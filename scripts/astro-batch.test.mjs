import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  assignSlugs, themeSlugBase, planRow, adapterPlan, removeAdapter, swapToNode, classifyLicense, checkFolder,
  copyTheme, nodeAdapterVersion, archiveTopOk, linkProblems, catalogFor, nameKey, withWasmerSection, installCommand,
} from './astro-batch.mjs';

const COMMIT = '0123456789abcdef0123456789abcdef01234567';

function row(extra) {
  return {
    rank: 4, host: 'github.com', repo: 'saicaca/fuwari', subdir: '', official: 'True', title: 'Fuwari', license: 'MIT', licenseGate: 'ok',
    branch: 'main', commit: COMMIT, astroVersion: '5.13.10', astroMajor: '5', adapter: '', lockfile: 'pnpm-lock.yaml', workspace: 'False',
    servicesDeps: '', sizeMb: '7.7', demo: 'https://fuwari.vercel.app', description: 'A static blog template built with Astro.', ...extra,
  };
}

function ctxFor(rows, extra = {}) {
  return { slugs: assignSlugs(rows), catalogSlugs: new Set(), catalogRepos: new Map(), trackedMentions: new Map(), catalogByName: new Map(), ...extra };
}

function tempDir() {
  return mkdtempSync(path.join(tmpdir(), 'astro-batch-'));
}

const VERCEL_CONFIG = `import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://example.vercel.app',
  integrations: [tailwind()],
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
});
`;

const CLOUDFLARE_CONFIG = `import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: "server",
  adapter: cloudflare({ platformProxy: { enabled: true } }),
});
`;

test('slugs drop astro/theme/template affixes and split camel case', () => {
  assert.equal(themeSlugBase(row({ repo: 'satnaing/astro-paper' })), 'paper');
  assert.equal(themeSlugBase(row({ repo: 'chrismwilliams/astro-theme-cactus' })), 'cactus');
  assert.equal(themeSlugBase(row({ repo: 'ccbikai/BroadcastChannel' })), 'broadcast-channel');
  assert.equal(themeSlugBase(row({ repo: 'someone/astro-theme' })), 'someone');
  assert.equal(themeSlugBase(row({ repo: 'org/monorepo', subdir: 'themes/astro-nova' })), 'nova');
});

test('duplicate: the same repo and subdir is processed once, at its first rank', () => {
  const rows = [row({ rank: 4 }), row({ rank: 9 }), row({ rank: 12, repo: 'other/fuwari' })];
  const ctx = ctxFor(rows);
  assert.equal(planRow(rows[0], ctx).status, 'not-run');
  const dup = planRow(rows[1], ctx);
  assert.equal(dup.status, 'duplicate-of:4');
  assert.equal(dup.folder, '');
  // A different repo with the same name gets its own slug, so folders and demo apps never collide.
  const other = planRow(rows[2], ctx);
  assert.equal(other.folder, 'js-astro-fuwari-other');
  assert.equal(other.demo, 'https://astro-fuwari-other.wasmer.app');
});

test('slugs avoid the hand-written starter folders', () => {
  const slugs = assignSlugs([row({ rank: 1, repo: 'someone/astro-starter' })], new Set(['starter']));
  assert.equal(slugs[1].slug, 'starter-someone');
});

test('already-exists: a catalog template whose folder names this repo', () => {
  const rows = [row({ rank: 1, repo: 'ColorlibHQ/AdminLTE' })];
  const ctx = ctxFor(rows, { catalogByName: new Map([[nameKey('AdminLTE'), { slug: 'adminlte', rootDir: 'js-adminlte', mentions: new Set(['colorlibhq/adminlte']) }]]) });
  assert.equal(planRow(rows[0], ctx).status, 'already-exists');
  const other = ctxFor(rows, { catalogByName: new Map([[nameKey('AdminLTE'), { slug: 'adminlte', rootDir: 'js-adminlte', mentions: new Set(['someone/else']) }]]) });
  assert.equal(planRow(rows[0], other).status, 'not-run');
});

test('static theme: no adapter means nothing to change', () => {
  const plan = adapterPlan("import { defineConfig } from 'astro/config';\nexport default defineConfig({});\n", ['---\n---\n<h1>Hi</h1>']);
  assert.deepEqual(plan, { action: 'none', adapter: '' });
});

test('Vercel adapter with prerenderable pages becomes a static build', () => {
  const plan = adapterPlan(VERCEL_CONFIG, ['---\n---\n<h1>Hi</h1>']);
  assert.equal(plan.action, 'static');
  const next = removeAdapter(VERCEL_CONFIG);
  assert.doesNotMatch(next, /adapter|@astrojs\/vercel/);
  assert.match(next, /integrations: \[tailwind\(\)\],\n\}\);/);
  assert.match(next, /site: 'https:\/\/example\.vercel\.app'/);
});

test('Cloudflare adapter with server-rendered pages becomes @astrojs/node standalone', () => {
  const plan = adapterPlan(CLOUDFLARE_CONFIG, ['---\nconst q = Astro.url.searchParams.get("q");\n---\n<p>{q}</p>']);
  assert.equal(plan.action, 'node');
  const next = swapToNode(CLOUDFLARE_CONFIG);
  assert.match(next, /^import node from '@astrojs\/node';/);
  assert.match(next, /adapter: node\(\{ mode: 'standalone' \}\),/);
  assert.doesNotMatch(next, /cloudflare/);
});

test('host runtime APIs block the swap', () => {
  const plan = adapterPlan(CLOUDFLARE_CONFIG, ['export const prerender = false;'], ['const { env } = Astro.locals.runtime;']);
  assert.equal(plan.action, 'host-api');
});

test('hybrid output without server pages becomes static', () => {
  const config = "import netlify from '@astrojs/netlify';\nexport default defineConfig({ output: 'hybrid', adapter: netlify() });\n";
  assert.equal(adapterPlan(config, ['<h1/>']).action, 'static');
  assert.equal(removeAdapter(config), "export default defineConfig({ output: 'static', });\n");
});

test('@astrojs/node is kept, and middleware mode is switched to standalone', () => {
  assert.equal(adapterPlan("import node from '@astrojs/node';\nadapter: node({ mode: 'standalone' })", []).action, 'keep');
  assert.equal(adapterPlan("import node from '@astrojs/node';\nadapter: node({ mode: 'middleware' })", []).action, 'standalone');
});

test('the @astrojs/node release matches the theme astro major and minimum', () => {
  const packument = { versions: {
    '9.4.2': { peerDependencies: { astro: '^5.3.0' } },
    '9.5.5': { peerDependencies: { astro: '^5.17.3' } },
    '10.1.4': { peerDependencies: { astro: '^6.3.0' } },
    '11.0.0-beta.1': { peerDependencies: { astro: '^7.0.0' } },
  } };
  assert.equal(nodeAdapterVersion(packument, '5.13.10'), '9.4.2');
  assert.equal(nodeAdapterVersion(packument, '6.4.0'), '10.1.4');
  assert.equal(nodeAdapterVersion(packument, '7.1.0'), '');
});

test('license check: standard grants pass, missing or restrictive terms are rejected', () => {
  assert.deepEqual(classifyLicense('MIT License\n\nPermission is hereby granted, free of charge, to any person'), { decision: 'ok', kind: 'MIT' });
  assert.equal(classifyLicense('GNU GENERAL PUBLIC LICENSE Version 3').kind, 'GPL');
  assert.equal(classifyLicense('').decision, 'rejected');
  assert.equal(classifyLicense('Attribution-NonCommercial 4.0 International').decision, 'rejected');
  assert.equal(classifyLicense('Copyright 2024 Me. All rights reserved.').decision, 'rejected');
  assert.equal(classifyLicense('You may use this theme for anything you like.').decision, 'review');
});

test('provenance: the archive must be this repo at this commit', () => {
  assert.equal(archiveTopOk(row(), `fuwari-${COMMIT}`), true);
  assert.equal(archiveTopOk(row(), `Fuwari-${COMMIT.toUpperCase()}/`), true);
  assert.equal(archiveTopOk(row(), `paper-mod-${COMMIT}`), false);
  assert.equal(archiveTopOk(row(), 'fuwari-ffffffffffffffffffffffffffffffffffffffff'), false);
});

function writeFolder(dir, extra = {}) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'x', dependencies: { astro: '5.13.10' } }));
  writeFileSync(path.join(dir, 'pnpm-lock.yaml'), "lockfileVersion: '9.0'\n");
  writeFileSync(path.join(dir, 'LICENSE'), 'MIT');
  writeFileSync(path.join(dir, 'UPSTREAM.json'), JSON.stringify({ repository: 'https://github.com/saicaca/fuwari', commit: COMMIT, archiveSha256: 'a'.repeat(64), ...extra }));
}

test('folder check passes a self-contained folder', () => {
  const dir = tempDir();
  try {
    writeFolder(dir);
    mkdirSync(path.join(dir, 'src', 'pages'), { recursive: true });
    writeFileSync(path.join(dir, 'src', 'pages', 'index.astro'), "---\nimport Layout from '../layouts/Layout.astro';\n---\n");
    assert.deepEqual(checkFolder(dir), []);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('too-large: folders over 10 MB fail the check', () => {
  const dir = tempDir();
  try {
    writeFolder(dir);
    writeFileSync(path.join(dir, 'big.bin'), Buffer.alloc(11 * 1024 * 1024));
    assert.ok(checkFolder(dir).some((item) => /folder is 11 MB/.test(item)));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('folder check rejects paths outside the folder, extra lockfiles and missing provenance', () => {
  const dir = tempDir();
  try {
    writeFolder(dir, { archiveSha256: '' });
    writeFileSync(path.join(dir, 'package-lock.json'), '{}');
    writeFileSync(path.join(dir, 'astro.config.mjs'), "import x from '../../shared/x.mjs';\n");
    const errors = checkFolder(dir);
    assert.ok(errors.some((item) => /archiveSha256/.test(item)));
    assert.ok(errors.some((item) => /2 lockfiles/.test(item)));
    assert.ok(errors.some((item) => /outside the folder/.test(item)));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('copyTheme strips git data, host files and other lockfiles', () => {
  const from = tempDir();
  const dest = path.join(tempDir(), 'out');
  try {
    for (const name of ['.github/workflows', 'node_modules/x', 'src', 'dist']) mkdirSync(path.join(from, name), { recursive: true });
    for (const name of ['vercel.json', 'package-lock.json', 'pnpm-lock.yaml', 'src/a.astro', 'package.json']) writeFileSync(path.join(from, name), 'x');
    const dropped = copyTheme(from, dest, 'pnpm-lock.yaml');
    assert.ok(existsSync(path.join(dest, 'src', 'a.astro')));
    assert.ok(existsSync(path.join(dest, 'pnpm-lock.yaml')));
    for (const name of ['.github', 'node_modules', 'dist', 'vercel.json', 'package-lock.json']) assert.equal(existsSync(path.join(dest, name)), false, name);
    assert.ok(dropped.includes('vercel.json'));
  } finally {
    rmSync(from, { recursive: true, force: true });
    rmSync(path.dirname(dest), { recursive: true, force: true });
  }
});

test('link check flags placeholder hosts and links back to the old site', () => {
  const html = '<link rel="canonical" href="https://fuwari.vercel.app/"><a href="https://fuwari.vercel.app/posts/a/">A</a><a href="http://localhost:4321/x">x</a>';
  const found = linkProblems(html, 'astro-fuwari.wasmer.app');
  assert.deepEqual(found.placeholder, ['http://localhost:4321/x']);
  assert.equal(found.oldHost.length, 1);
});

test('catalog entry uses the astro framework and an existing category', () => {
  const entry = catalogFor(row(), 'fuwari');
  assert.equal(entry.framework, 'astro');
  assert.equal(entry.category, 'astro');
  assert.ok(entry.description.length <= 160);
  assert.equal(catalogFor(row({ title: 'Starlight Docs' }), 'docs', { dependencies: { '@astrojs/starlight': '1' } }).category, 'documentation');
});

test('the Wasmer README section replaces itself on reruns', () => {
  const once = withWasmerSection('# Theme\n', '<!-- wasmer:start -->\nA\n<!-- wasmer:end -->\n\n');
  const twice = withWasmerSection(once, '<!-- wasmer:start -->\nB\n<!-- wasmer:end -->\n\n');
  assert.equal(twice, '<!-- wasmer:start -->\nB\n<!-- wasmer:end -->\n\n# Theme\n');
});

test('local installs run the same commands as Anybuild', () => {
  assert.deepEqual(installCommand('npm'), ['npm', ['install', '--no-audit', '--no-fund']]);
  assert.deepEqual(installCommand('pnpm'), ['npx', ['-y', 'pnpm@10.34.9', 'install', '--no-frozen-lockfile']]);
  assert.deepEqual(installCommand('bun'), ['bun', ['install']]);
  assert.deepEqual(installCommand('npm', true), ['npm', ['ci', '--no-audit', '--no-fund']]);
});
