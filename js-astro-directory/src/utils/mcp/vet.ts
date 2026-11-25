// Deterministic, offline quality gate for MCP servers (§13). Pure functions of
// (servers, config). No network, no tokens — every signal is intrinsic to the
// committed registry data. The listing is restricted to active, stdio-only
// servers plus the usual anti-spam filters.
import type { McpServer } from '../../types/mcp';
import { parseGitHubRepo, repoKey } from './github';

export interface VetWeights {
    install: number;
    polish: number;
    verified: number;
}

export interface VetConfig {
    minDescLen: number; // Tier-0: drop thin descriptions
    maxAgeDays: number; // Tier-0: drop stale servers (0 = disabled) — A2
    minScore: number; // drop survivors scoring below this (0 = disabled) — A5
    perPublisherCap: number; // keep each namespace owner's top-N by score
    maxTotal: number; // hard cap on total survivors (0 = unlimited)
    requireDistinctTitle: boolean; // drop servers whose title is just the reverse-DNS name
    weights: VetWeights; // ranking weights (§13.5)
    allowlist: string[]; // publisher prefixes always included, exempt from the cap
    denylist: string[]; // publisher prefixes always excluded
}

export const DEFAULT_VET_CONFIG: VetConfig = {
    minDescLen: 40,
    maxAgeDays: 540, // ~18 months since the last registry update
    minScore: 0.3,
    perPublisherCap: 3,
    maxTotal: 0,
    requireDistinctTitle: true,
    weights: { install: 0.3, polish: 0.2, verified: 0.2 },
    allowlist: ['io.github.modelcontextprotocol', 'com.anthropic', 'io.github.anthropics', 'io.github.github'],
    denylist: ['io.github.sadri-dridi', 'io.github.pipeworx-io', 'io.github.mcp-dir'],
};

export interface GateStats {
    input: number;
    tier0: number;
    final: number;
}

export interface GateResult {
    servers: McpServer[]; // vetted, capped, A–Z for stable diffs
    stats: GateStats;
}

export function publisherOf(server: McpServer): string {
    return server.name.split('/')[0] || server.name;
}

function prefixMatch(publisher: string, list: string[]): boolean {
    const p = publisher.toLowerCase();
    return list.some((entry) => p === entry.toLowerCase() || p.startsWith(entry.toLowerCase() + '.'));
}

// Reverse-DNS namespaces that aren't `io.github.*` are domain-verified (stronger).
function isDomainVerified(server: McpServer): boolean {
    return !server.name.toLowerCase().startsWith('io.github.');
}

function normDesc(desc: string): string {
    return desc.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

// Placeholder / stub blurbs that clear the length bar but carry no real signal.
const PLACEHOLDER_DESC =
    /^(todo|tbd|wip|test|testing|demo|example|sample|placeholder|coming soon|untitled|no description|my (mcp )?server|an? mcp server)\b/;

// Bare "mcp server" is only a placeholder when it's the entire blurb —
// "MCP server for searching docs" must pass, "mcp server" must not.
const STUB_DESC = /^mcp server$/;

// A3: description quality beyond raw length — reject URL-only blurbs, known
// placeholder stubs, and near-empty text with fewer than 3 distinct words.
export function isLowQualityDesc(desc: string): boolean {
    const trimmed = (desc || '').trim();
    if (/^https?:\/\/\S+$/i.test(trimmed)) return true;
    const norm = normDesc(trimmed);
    if (PLACEHOLDER_DESC.test(norm) || STUB_DESC.test(norm)) return true;
    const distinct = new Set(trimmed.toLowerCase().match(/[\p{L}\p{N}]{2,}/gu) || []);
    return distinct.size < 3;
}

// A2: milliseconds since the server's last registry update (or publish).
function ageMs(server: McpServer, now: number): number {
    const ts = Date.parse(server.updatedAt || server.publishedAt || '');
    return Number.isNaN(ts) ? Infinity : now - ts;
}

// Union of every declared transport across remotes + packages.
export function transportsOf(server: McpServer): string[] {
    return [...new Set([...server.remotes.map((r) => r.type), ...server.packages.map((p) => p.transport)])];
}

// stdio-only = at least one transport and every transport is stdio (no remote
// streamable-http/sse endpoints).
export function isStdioOnly(server: McpServer): boolean {
    const t = transportsOf(server);
    return t.length > 0 && t.every((x) => x === 'stdio');
}

// Tier-0 intrinsic filter (§13.2). Cheap, offline; also enforces the listing
// policy: active + stdio-only, with anti-spam guards.
export function tier0Filter(servers: McpServer[], cfg: VetConfig, now: number = Date.now()): McpServer[] {
    const seenDesc = new Set<string>();
    const maxAgeMs = cfg.maxAgeDays > 0 ? cfg.maxAgeDays * 86_400_000 : Infinity;
    const out: McpServer[] = [];
    for (const s of servers) {
        if (prefixMatch(publisherOf(s), cfg.denylist)) continue;
        if (s.status !== 'active') continue;
        if (!isStdioOnly(s)) continue; // list stdio-transport servers only
        if (s.installKind === 'none') continue;
        const gh = parseGitHubRepo(s.repository?.url);
        if (!gh) continue;
        if (cfg.requireDistinctTitle && s.title.trim().toLowerCase() === s.name.trim().toLowerCase()) continue;
        if ((s.description || '').length < cfg.minDescLen) continue;
        if (isLowQualityDesc(s.description)) continue; // A3: placeholder / near-empty blurbs
        if (ageMs(s, now) > maxAgeMs) continue; // A2: drop stale servers
        const key = normDesc(s.description);
        if (key) {
            if (seenDesc.has(key)) continue; // spam publishers reuse identical blurbs
            seenDesc.add(key);
        }
        out.push(s);
    }
    return out;
}

export function scoreServer(server: McpServer, cfg: VetConfig): number {
    const install = server.packages.length > 0 && server.remotes.length > 0 ? 1 : 0.5;
    const polish = server.iconUrl ? 1 : 0;
    const verified = isDomainVerified(server) ? 1 : 0.5;
    const w = cfg.weights;
    return w.install * install + w.polish * polish + w.verified * verified;
}

interface Scored {
    server: McpServer;
    score: number;
}

// Offline quality gate: Tier-0 intrinsic filter (active + stdio-only + anti-spam)
// + per-publisher cap + optional hard total cap, ranked by intrinsic score.
// No network, no tokens.
export function gate(servers: McpServer[], cfg: VetConfig, now: number = Date.now()): GateResult {
    const tier0 = tier0Filter(servers, cfg, now);
    const scored: Scored[] = tier0
        .map((server) => ({ server, score: scoreServer(server, cfg) }))
        .filter((item) => item.score >= cfg.minScore); // A5: hard-drop weak survivors

    // One listing per source repository — keep the highest-scoring eligible
    // record so a weak sibling can't block a qualifying one (score runs first).
    const byRepo = new Map<string, Scored>();
    for (const item of scored) {
        const gh = parseGitHubRepo(item.server.repository?.url);
        const repo = gh ? repoKey(gh) : item.server.name;
        const prev = byRepo.get(repo);
        if (!prev || item.score > prev.score || (item.score === prev.score && item.server.name.localeCompare(prev.server.name) < 0)) {
            byRepo.set(repo, item);
        }
    }
    const deduped = [...byRepo.values()];

    // Per-publisher cap: keep each owner's top-N by score (allowlisted are exempt).
    const byPublisher = new Map<string, Scored[]>();
    const exempt: Scored[] = [];
    for (const item of deduped) {
        const pub = publisherOf(item.server);
        if (prefixMatch(pub, cfg.allowlist)) {
            exempt.push(item);
            continue;
        }
        const arr = byPublisher.get(pub) ?? [];
        arr.push(item);
        byPublisher.set(pub, arr);
    }
    const capped: Scored[] = [...exempt];
    for (const arr of byPublisher.values()) {
        arr.sort((a, b) => b.score - a.score || a.server.name.localeCompare(b.server.name));
        capped.push(...arr.slice(0, cfg.perPublisherCap));
    }

    // Optional hard total cap by score.
    let survivors = capped;
    if (cfg.maxTotal > 0 && survivors.length > cfg.maxTotal) {
        survivors = [...survivors]
            .sort((a, b) => b.score - a.score || a.server.name.localeCompare(b.server.name))
            .slice(0, cfg.maxTotal);
    }

    // Emit A–Z for minimal diffs (ranking already applied above).
    const out = survivors.map(({ server }) => server).sort((a, b) => a.name.localeCompare(b.name));

    return {
        servers: out,
        stats: { input: servers.length, tier0: tier0.length, final: out.length },
    };
}
