import { describe, it, expect } from 'vitest';
import { tier0Filter, gate, scoreServer, isLowQualityDesc, publisherOf, isStdioOnly, transportsOf, DEFAULT_VET_CONFIG, type VetConfig } from './vet';
import { mapServer, type RawEntry } from './map';
import type { McpServer } from '../../types/mcp';

function server(over: Partial<NonNullable<RawEntry['server']>>, status: 'active' | 'deprecated' = 'active'): McpServer {
    const entry: RawEntry = {
        server: {
            name: over.name ?? 'io.github.acme/thing',
            title: over.title ?? 'Test MCP Server',
            description: over.description ?? 'A reasonably descriptive MCP server that does useful things.',
            version: '1.0.0',
            repository: over.repository ?? { url: 'https://github.com/acme/thing' },
            packages: over.packages ?? [{ registryType: 'npm', identifier: 'thing', transport: { type: 'stdio' } }],
            ...over,
        },
        _meta: { 'io.modelcontextprotocol.registry/official': { status, isLatest: true, publishedAt: '2026-01-01T00:00:00Z' } },
    };
    return mapServer(entry)!;
}

// A remote (streamable-http) server with no package install method.
function remoteServer(name: string, url = 'https://github.com/acme/remote'): McpServer {
    return server({ name, repository: { url }, packages: [], remotes: [{ type: 'streamable-http', url: 'https://api.example.com/mcp' }] });
}

describe('transportsOf / isStdioOnly', () => {
    it('flags stdio-package servers as stdio-only', () => {
        const s = server({ name: 'io.github.a/ok' });
        expect(transportsOf(s)).toEqual(['stdio']);
        expect(isStdioOnly(s)).toBe(true);
    });

    it('rejects remote (streamable-http) servers', () => {
        expect(isStdioOnly(remoteServer('io.github.a/remote'))).toBe(false);
    });

    it('rejects servers mixing stdio with a remote transport', () => {
        const s = server({
            name: 'io.github.a/mixed',
            packages: [{ registryType: 'npm', identifier: 'thing', transport: { type: 'stdio' } }],
            remotes: [{ type: 'sse', url: 'https://api.example.com/mcp' }],
        });
        expect(isStdioOnly(s)).toBe(false);
    });
});

describe('tier0Filter', () => {
    it('drops deprecated, no-install, non-GitHub, thin, and non-stdio servers', () => {
        const list = [
            server({ name: 'io.github.a/ok' }),
            server({ name: 'io.github.b/dep' }, 'deprecated'),
            server({ name: 'io.github.c/noinstall', packages: [], repository: { url: 'https://github.com/c/x' } }),
            server({ name: 'io.github.d/gitlab', repository: { url: 'https://gitlab.com/d/x' } }),
            server({ name: 'io.github.e/thin', description: 'too short' }),
            remoteServer('io.github.f/remote'),
        ];
        const out = tier0Filter(list, DEFAULT_VET_CONFIG);
        expect(out.map((s) => s.name)).toEqual(['io.github.a/ok']);
    });

    it('dedupes identical descriptions from spam publishers', () => {
        const dup = 'The exact same marketing blurb repeated across many servers here.';
        const list = [
            server({ name: 'io.github.spam/one', description: dup, repository: { url: 'https://github.com/spam/one' } }),
            server({ name: 'io.github.spam/two', description: dup, repository: { url: 'https://github.com/spam/two' } }),
        ];
        expect(tier0Filter(list, DEFAULT_VET_CONFIG)).toHaveLength(1);
    });

    it('excludes denylisted publishers', () => {
        const cfg: VetConfig = { ...DEFAULT_VET_CONFIG, denylist: ['io.github.spammer'] };
        const list = [server({ name: 'io.github.spammer/x', repository: { url: 'https://github.com/spammer/x' } })];
        expect(tier0Filter(list, cfg)).toHaveLength(0);
    });

    it('drops servers whose title is just the reverse-DNS name', () => {
        const s = server({ name: 'io.github.a/notitle', title: 'io.github.a/notitle', repository: { url: 'https://github.com/a/notitle' } });
        expect(tier0Filter([s], DEFAULT_VET_CONFIG)).toHaveLength(0);
    });

    it('keeps the highest-scoring eligible record per source repository', () => {
        const url = 'https://github.com/acme/dup';
        const a = server({ name: 'io.github.a/one', repository: { url }, description: 'First distinct description for the repo dedupe test here.' });
        const b = server({ name: 'io.github.b/two', icons: [{ src: 'https://example.com/icon.png' }], repository: { url }, description: 'Second distinct description for the repo dedupe test here.' });
        const res = gate([a, b], { ...DEFAULT_VET_CONFIG, minScore: 0 });
        expect(res.servers.map((x) => x.name)).toEqual(['io.github.b/two']);
    });

    it('does not let a weak record block a qualifying sibling from the same repo', () => {
        const url = 'https://github.com/acme/dup';
        const weak = server({ name: 'io.github.a/weak', repository: { url }, description: 'First distinct description for the repo dedupe test here.' });
        const strong = server({ name: 'com.acme/strong', repository: { url }, description: 'Second distinct description for the repo dedupe test here.' });
        // weak is io.github (unverified, no icon) → 0.25 < minScore; strong is domain-verified → 0.35.
        const res = gate([weak, strong], DEFAULT_VET_CONFIG);
        expect(res.servers.map((x) => x.name)).toEqual(['com.acme/strong']);
    });
});

describe('gate', () => {
    it('includes active, stdio-only servers with a GitHub repo (no token, no network)', () => {
        const s = server({ name: 'io.github.acme/thing' });
        const res = gate([s], { ...DEFAULT_VET_CONFIG, minScore: 0 });
        expect(res.servers.map((x) => x.name)).toEqual(['io.github.acme/thing']);
        expect(res.stats.final).toBe(1);
    });

    it('excludes deprecated and remote servers', () => {
        const dep = server({ name: 'io.github.a/dep' }, 'deprecated');
        const remote = remoteServer('io.github.b/remote');
        expect(gate([dep, remote], DEFAULT_VET_CONFIG).servers).toHaveLength(0);
    });

    it('allowlisted publishers are exempt from the per-publisher cap', () => {
        const cfg: VetConfig = { ...DEFAULT_VET_CONFIG, minScore: 0, allowlist: ['io.github.official'], perPublisherCap: 1 };
        const servers = [0, 1, 2].map((i) =>
            server({ name: `io.github.official/x${i}`, description: `Official server number ${i} that is quite useful.`, repository: { url: `https://github.com/official/x${i}` } }),
        );
        expect(gate(servers, cfg).servers).toHaveLength(3);
    });

    it('applies the per-publisher cap', () => {
        const cfg: VetConfig = { ...DEFAULT_VET_CONFIG, minScore: 0, perPublisherCap: 2 };
        const servers = [0, 1, 2, 3, 4].map((i) =>
            server({ name: `io.github.flood/r${i}`, description: `Distinct description number ${i} for a server.`, repository: { url: `https://github.com/flood/r${i}` } }),
        );
        expect(gate(servers, cfg).servers).toHaveLength(2);
    });

    it('never exceeds maxTotal when set', () => {
        const cfg: VetConfig = { ...DEFAULT_VET_CONFIG, minScore: 0, perPublisherCap: 10, maxTotal: 2 };
        const servers = [0, 1, 2, 3].map((i) =>
            server({ name: `io.github.p${i}/x`, description: `Unique server description content ${i} here now.`, repository: { url: `https://github.com/p${i}/x` } }),
        );
        expect(gate(servers, cfg).servers).toHaveLength(2);
    });
});

describe('A2 staleness', () => {
    const now = Date.parse('2026-10-25T00:00:00Z');

    it('keeps servers updated within maxAgeDays', () => {
        const fresh = server({ name: 'io.github.a/fresh', description: 'A fresh server updated quite recently indeed now.' });
        expect(tier0Filter([fresh], DEFAULT_VET_CONFIG, now).map((s) => s.name)).toEqual(['io.github.a/fresh']);
    });

    it('drops servers older than maxAgeDays', () => {
        const fresh = server({ name: 'io.github.a/stale', description: 'A once useful server that has gone quiet now.' });
        const stale = { ...fresh, updatedAt: '2023-01-01T00:00:00Z', publishedAt: '2023-01-01T00:00:00Z' };
        expect(tier0Filter([stale], DEFAULT_VET_CONFIG, now)).toHaveLength(0);
    });

    it('is disabled when maxAgeDays is 0', () => {
        const fresh = server({ name: 'io.github.a/old', description: 'An ancient server kept because age gating is off.' });
        const stale = { ...fresh, updatedAt: '2019-01-01T00:00:00Z', publishedAt: '2019-01-01T00:00:00Z' };
        expect(tier0Filter([stale], { ...DEFAULT_VET_CONFIG, maxAgeDays: 0 }, now)).toHaveLength(1);
    });
});

describe('A3 description quality', () => {
    it('flags URL-only, placeholder, and near-empty blurbs', () => {
        expect(isLowQualityDesc('https://example.com/readme-goes-here')).toBe(true);
        expect(isLowQualityDesc('TODO: write a proper description for this server later')).toBe(true);
        expect(isLowQualityDesc('My MCP server that will eventually do something useful')).toBe(true);
        expect(isLowQualityDesc('alpha alpha alpha alpha alpha alpha alpha alpha')).toBe(true);
    });

    it('accepts a genuine description', () => {
        expect(isLowQualityDesc('A reasonably descriptive MCP server that does useful things.')).toBe(false);
    });

    it('tier0Filter drops placeholder blurbs that clear the length bar', () => {
        const s = server({ name: 'io.github.a/stub', description: 'placeholder placeholder placeholder placeholder value' });
        expect(tier0Filter([s], DEFAULT_VET_CONFIG)).toHaveLength(0);
    });
});

describe('A5 minScore gate', () => {
    it('drops survivors scoring below minScore', () => {
        const plain = server({ name: 'io.github.acme/plain', description: 'A github server without an icon, fairly plain here.' });
        expect(scoreServer(plain, DEFAULT_VET_CONFIG)).toBeLessThan(DEFAULT_VET_CONFIG.minScore);
        expect(gate([plain], DEFAULT_VET_CONFIG).servers).toHaveLength(0);
        expect(gate([plain], { ...DEFAULT_VET_CONFIG, minScore: 0 }).servers).toHaveLength(1);
    });

    it('keeps polished or domain-verified servers', () => {
        const iconic = server({
            name: 'io.github.acme/iconic',
            description: 'A github server that ships a real icon asset here.',
            repository: { url: 'https://github.com/acme/iconic' },
            icons: ['https://cdn.example.com/i.png'],
        });
        const verified = server({ name: 'com.acme/srv', description: 'A domain verified publisher server, no icon needed.', repository: { url: 'https://github.com/acme/verified' } });
        expect(gate([iconic, verified], DEFAULT_VET_CONFIG).servers).toHaveLength(2);
    });
});

describe('scoreServer', () => {
    it('rewards an icon and domain verification', () => {
        const domain = server({ name: 'com.acme/x', description: 'A domain verified server with an icon.', icons: ['https://cdn.example.com/i.png'] });
        const gh = server({ name: 'io.github.acme/x', description: 'A github server without an icon here now.' });
        expect(scoreServer(domain, DEFAULT_VET_CONFIG)).toBeGreaterThan(scoreServer(gh, DEFAULT_VET_CONFIG));
    });
});

describe('publisherOf', () => {
    it('takes the namespace before the first slash', () => {
        expect(publisherOf(server({ name: 'io.github.acme/thing' }))).toBe('io.github.acme');
    });
});

