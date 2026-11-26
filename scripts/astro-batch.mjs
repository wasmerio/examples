// Turn rows of the Astro theme queue into Wasmer Edge templates.
// Each template folder is the theme's own source at a pinned commit (sha256 recorded), with only
// adapter, config and image-size changes, each listed in UPSTREAM.json wasmerChanges.
// Every row is tested through deployViaAutobuild with rootDir = the folder on the pushed chunk branch,
// the same path the catalog Deploy button uses.
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, readlinkSync, realpathSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCsv, deployAutobuild } from './mcp-batch.mjs';
import {
  kebab, htmlRefs, redactTree, autobuildLogTail, run, sleep, tailText, flag, walk, withGit, gitOut,
  assertPublishBranch, loadJsonl, mapPool, withBackoff, deleteCreated, absUrl,
} from './hugo-batch.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(process.env.HOME || '/tmp', '.cache/wasmer-astro');
const GAP_QUEUE = '/Users/ayush/Desktop/01 Wasmer/Wasmer Dashboard/template-gap-map/astro/astro-queue.csv';
const REGISTRY = 'https://registry.wasmer.io/graphql';
// Anybuild builds Node apps with Node 24 unless told otherwise (wasmerio/anybuild crates/anybuild/src/providers/node.rs).
export const NODE_VERSION = '24';
const LOCAL_NODE_BIN = '/opt/homebrew/opt/node@24/bin';
export const MAX_MB = 10;
export const IMAGE_BYTES = 300 * 1024;
export const IMAGE_WIDTH = 1600;
const STEP_TIMEOUT = 15 * 60 * 1000;
// Hand-written starters that predate this pipeline; they have no UPSTREAM.json.
export const HANDWRITTEN = new Set(['js-astro-staticsite', 'js-astro-ssr', 'js-astro-starter']);
const FINAL = new Set(['shipped', 'blocked', 'rejected-license', 'already-exists']);
export const LOCKFILES = {
  npm: ['package-lock.json'],
  pnpm: ['pnpm-lock.yaml'],
  yarn: ['yarn.lock'],
  bun: ['bun.lock', 'bun.lockb'],
};
const ALL_LOCKS = Object.values(LOCKFILES).flat();
const STRIP_ANYWHERE = new Set(['.git', 'node_modules', '.astro', '.vercel', '.netlify', '.wrangler', '.DS_Store']);
const STRIP_ROOT = new Set(['.github', 'dist', 'vercel.json', 'netlify.toml', 'wrangler.toml', 'wrangler.json', 'wrangler.jsonc']);
const SKIP_SIZE = new Set(['node_modules', 'dist', '.astro', '.git']);
const CONFIG_NAMES = ['astro.config.mjs', 'astro.config.ts', 'astro.config.js', 'astro.config.mts', 'astro.config.cjs', 'astro.config.cts'];
const HOST_ADAPTER = /@astrojs\/(vercel|netlify|cloudflare)/;
const HOST_API = /Astro\.locals\.runtime|locals\.runtime\.env|from\s+['"]cloudflare:workers['"]|@vercel\/(?:kv|edge-config|blob)|@netlify\/(?:blobs|functions)/;
const LICENSE_FILE = /^(licen[cs]e|copying|unlicense)([-._][\w.-]*)?$/i;

export function repoKey(row) {
  return `${String(row.host || 'github.com').toLowerCase()}/${String(row.repo).toLowerCase()}#${String(row.subdir || '').replace(/^\/|\/$/g, '')}`;
}

export function themeSlugBase(row) {
  const raw = row.subdir ? String(row.subdir).split('/').filter(Boolean).pop() : String(row.repo || '').split('/').pop();
  let slug = kebab(raw);
  let previous = '';
  while (slug && slug !== previous) {
    previous = slug;
    slug = slug.replace(/^(astro|theme|template)-/, '').replace(/-(astro|theme|template)$/, '');
    if (['astro', 'theme', 'template'].includes(slug)) slug = '';
  }
  if (!slug) slug = kebab(String(row.repo || '').split('/')[0]) || 'theme';
  return slug.slice(0, 40).replace(/-$/, '');
}

// One slug per distinct theme across the whole queue, so two rows never share a folder, slug or app name,
// whichever chunk they run in. Duplicates (same repo and subdir) point at the first rank instead.
export function assignSlugs(rows, reserved = new Set()) {
  const used = new Set(reserved);
  const first = new Map();
  const out = {};
  for (const row of [...rows].sort((a, b) => a.rank - b.rank)) {
    const key = repoKey(row);
    if (first.has(key)) {
      out[row.rank] = { slug: out[first.get(key)].slug, duplicateOf: first.get(key) };
      continue;
    }
    first.set(key, row.rank);
    const base = themeSlugBase(row);
    let slug = base;
    if (used.has(slug)) slug = `${base}-${kebab(String(row.repo).split('/')[0])}`.slice(0, 48).replace(/-$/, '');
    if (used.has(slug)) slug = `${slug}-${row.rank}`.slice(0, 52);
    used.add(slug);
    out[row.rank] = { slug };
  }
  return out;
}

export function themeTitle(row, slug) {
  const raw = String(row.title || '').split(/\s+[|–—:-]\s+/)[0].trim();
  if (raw) return raw;
  return String(slug || themeSlugBase(row)).split('-').filter(Boolean).map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
}

export function categoryFor(row, pkg = {}) {
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  if (deps['@astrojs/starlight']) return 'documentation';
  const blob = `${row.title || ''} ${row.description || ''} ${row.repo || ''} ${row.subdir || ''}`.toLowerCase();
  return /\b(docs|documentation|starlight|knowledge[- ]base|wiki)\b/.test(blob) ? 'documentation' : 'astro';
}

function kindOf(row, category) {
  if (category === 'documentation') return 'documentation';
  const blob = `${row.title || ''} ${row.description || ''} ${row.repo || ''}`.toLowerCase();
  if (/portfolio|resume|cv\b/.test(blob)) return 'portfolio';
  if (/blog/.test(blob)) return 'blog';
  if (/landing|startup|saas|marketing|agency|business/.test(blob)) return 'landing page';
  return 'website';
}

export function catalogName(row, slug) {
  const title = themeTitle(row, slug);
  if (/\btheme\b/i.test(title)) return title.slice(0, 80);
  return `${title} ${/astro/i.test(title) ? 'Theme' : 'Astro Theme'}`.slice(0, 80);
}

export function catalogFor(row, slug, pkg = {}) {
  const category = categoryFor(row, pkg);
  const owner = String(row.repo || '').split('/')[0] || 'its author';
  const title = themeTitle(row, slug);
  return {
    slug: `astro-${slug}`,
    name: catalogName(row, slug),
    framework: 'astro',
    language: 'javascript',
    category,
    description: `${title} is an Astro ${kindOf(row, category)} theme by ${owner}, copied at a pinned commit and ready to deploy on Wasmer Edge.`.slice(0, 160),
    preview: `js-astro-${slug}/preview.jpg`,
  };
}

export function emptyChecks() {
  return { home: 'not run', assets: 'not run', innerPage: 'not run', notFound: 'not run', links: 'not run', ssrRoute: 'n/a', coldStartMs: 0 };
}

function baseRecord(row, slug, extra = {}) {
  return {
    rank: row.rank,
    repo: row.repo,
    subdir: row.subdir || '',
    commit: row.commit,
    archiveSha256: '',
    license: row.license,
    status: extra.status || 'not-run',
    reasonCode: extra.reasonCode || '',
    reason: extra.reason || '',
    folder: `js-astro-${slug}`,
    astroVersion: row.astroVersion || '',
    packageManager: lockManager(row.lockfile) || 'npm',
    nodeVersion: NODE_VERSION,
    output: '',
    wasmerChanges: [],
    folderSizeMb: 0,
    buildSeconds: 0,
    checks: emptyChecks(),
    demo: `https://astro-${slug}.wasmer.app`,
    createdApp: '',
    pr: '',
    catalog: catalogFor(row, slug),
  };
}

export function lockManager(lockfile) {
  const name = String(lockfile || '');
  return Object.keys(LOCKFILES).find((manager) => LOCKFILES[manager].includes(name)) || '';
}

// Gates that need no download: duplicates and themes the catalog or repo already has.
export function planRow(row, ctx) {
  const entry = ctx.slugs[row.rank];
  if (!entry) throw new Error(`rank ${row.rank} has no slug; regenerate reports/astro/slugs.json`);
  const record = baseRecord(row, entry.slug);
  if (entry.duplicateOf) {
    return { ...record, status: `duplicate-of:${entry.duplicateOf}`, reasonCode: 'duplicate', reason: `same repo and subdir as rank ${entry.duplicateOf}`, folder: '', demo: '', catalog: null };
  }
  const repoUrl = `https://github.com/${String(row.repo).toLowerCase()}`;
  const owned = (ctx.catalogRepos || new Map()).get(repoUrl);
  if (owned) return { ...record, status: 'already-exists', reasonCode: 'already-exists', reason: `catalog template ${owned} already uses ${row.repo}` };
  for (const folder of [`js-${entry.slug}`, `js-astro-${entry.slug}`]) {
    const mentions = (ctx.trackedMentions || new Map()).get(folder);
    if (mentions && mentions.has(String(row.repo).toLowerCase())) {
      return { ...record, status: 'already-exists', reasonCode: 'already-exists', reason: `${folder} on main already holds ${row.repo}` };
    }
  }
  if (ctx.catalogSlugs && ctx.catalogSlugs.has(`astro-${entry.slug}`)) {
    return { ...record, status: 'already-exists', reasonCode: 'already-exists', reason: `catalog slug astro-${entry.slug} is already registered` };
  }
  const same = (ctx.catalogByName || new Map()).get(nameKey(String(row.repo).split('/').pop()));
  if (same && same.mentions.has(String(row.repo).toLowerCase())) {
    return { ...record, status: 'already-exists', reasonCode: 'already-exists', reason: `catalog template ${same.slug} (${same.rootDir}) already ships ${row.repo}` };
  }
  return record;
}

// Catalog slugs and repo names compared without prefixes, dashes or case: adminlte matches AdminLTE.
export function nameKey(value) {
  return String(value || '').toLowerCase().replace(/^(tpl|astro|js)-/, '').replace(/[^a-z0-9]/g, '');
}

export function classifyLicense(text) {
  const body = String(text || '');
  if (!body.trim()) return { decision: 'rejected', kind: 'no license text' };
  if (/\bnon-?commercial\b|\bno-?deriv|\bBY-NC\b|\bBY-ND\b/i.test(body)) return { decision: 'rejected', kind: 'non-commercial or no-derivatives terms' };
  if (/no redistribution|may not (?:\w+, )*(?:sublicense, )?redistribute|not (?:be )?redistributed/i.test(body)) return { decision: 'rejected', kind: 'the license forbids redistribution' };
  const kinds = [
    [/Permission is hereby granted, free of charge/i, 'MIT'],
    [/Apache License/i, 'Apache-2.0'],
    [/Redistribution and use in source and binary forms/i, 'BSD'],
    [/GNU AFFERO GENERAL PUBLIC LICENSE/i, 'AGPL'],
    [/GNU LESSER GENERAL PUBLIC LICENSE/i, 'LGPL'],
    [/GNU GENERAL PUBLIC LICENSE/i, 'GPL'],
    [/Mozilla Public License/i, 'MPL-2.0'],
    [/Permission to use, copy, modify, and\/?or distribute/i, 'ISC'],
    [/free and unencumbered software released into the public domain/i, 'Unlicense'],
    [/CC0 1\.0|creativecommons\.org\/publicdomain\/zero/i, 'CC0-1.0'],
    [/Attribution 4\.0 International|creativecommons\.org\/licenses\/by\/4\.0/i, 'CC-BY-4.0'],
    [/Creative Commons Attribution 3\.0|creativecommons\.org\/licenses\/by\/3\.0/i, 'CC-BY-3.0'],
    [/DO WHAT THE FUCK YOU WANT/i, 'WTFPL'],
    [/Eclipse Public License/i, 'EPL'],
  ];
  const found = kinds.find(([pattern]) => pattern.test(body));
  if (found) return { decision: 'ok', kind: found[1] };
  if (/all rights reserved/i.test(body) || /personal use only|commercial license|purchase/i.test(body)) return { decision: 'rejected', kind: 'no redistribution grant' };
  return { decision: 'review', kind: 'unrecognised license text' };
}

export function findConfig(dir) {
  return CONFIG_NAMES.find((name) => existsSync(path.join(dir, name))) || '';
}

export function adapterOf(configText) {
  const match = String(configText || '').match(/from\s+['"]@astrojs\/(node|vercel|netlify|cloudflare)(?:\/[\w-]+)?['"]/);
  return match ? match[1] : '';
}

// End index of the expression that starts at `start`: the first top-level comma or closing bracket.
function expressionEnd(text, start) {
  let depth = 0;
  let quote = '';
  for (let i = start; i < text.length; i += 1) {
    const c = text[i];
    if (quote) {
      if (c === '\\') i += 1;
      else if (c === quote) quote = '';
      continue;
    }
    if (c === '"' || c === "'" || c === '`') quote = c;
    else if ('([{'.includes(c)) depth += 1;
    else if (')]}'.includes(c)) {
      if (depth === 0) return i;
      depth -= 1;
    } else if (c === ',' && depth === 0) return i;
  }
  return text.length;
}

function adapterSpan(text) {
  const match = /(^|[\s,{])adapter\s*:\s*/m.exec(text);
  if (!match) return null;
  const keyStart = match.index + match[1].length;
  const valueStart = match.index + match[0].length;
  const valueEnd = expressionEnd(text, valueStart);
  return { keyStart, valueStart, valueEnd };
}

function hostImport(text) {
  return /^[ \t]*import\s+(\w+)\s+from\s+['"]@astrojs\/(?:vercel|netlify|cloudflare)(?:\/[\w-]+)?['"];?[ \t]*\r?\n?/m.exec(text);
}

export function removeAdapter(configText) {
  let text = String(configText);
  const span = adapterSpan(text);
  if (span) {
    let end = span.valueEnd;
    if (text[end] === ',') end += 1;
    const lineStart = text.lastIndexOf('\n', span.keyStart) + 1;
    const before = text.slice(lineStart, span.keyStart);
    const after = text.slice(end).match(/^[ \t]*\r?\n/);
    if (!before.trim() && after) text = text.slice(0, lineStart) + text.slice(end + after[0].length);
    else text = text.slice(0, span.keyStart) + text.slice(end).replace(/^[ \t]*/, '');
  }
  const imp = hostImport(text);
  if (imp && !new RegExp(`(?<![\\w.$/-])${imp[1]}(?![\\w$])`).test(text.slice(0, imp.index) + text.slice(imp.index + imp[0].length))) {
    text = text.slice(0, imp.index) + text.slice(imp.index + imp[0].length);
  }
  return text.replace(/(output\s*:\s*)['"](hybrid|server)['"]/, "$1'static'");
}

// A GitHub Pages sub-path (`base: '/<repo name>'`) makes every asset 404 at the root of a Wasmer app.
export function removeRepoBase(configText, repo) {
  const name = String(repo || '').split('/').pop().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^([ \\t]*)base\\s*:\\s*(['"\`])\\/${name}\\/?\\2\\s*,?[ \\t]*\\r?\\n`, 'im');
  return re.test(configText) ? configText.replace(re, '') : configText;
}

export function swapToNode(configText) {
  let text = String(configText);
  const span = adapterSpan(text);
  if (!span) return text;
  text = `${text.slice(0, span.valueStart)}node({ mode: 'standalone' })${text.slice(span.valueEnd)}`;
  const imp = hostImport(text);
  if (imp) {
    const rest = text.slice(0, imp.index) + text.slice(imp.index + imp[0].length);
    text = new RegExp(`(?<![\\w.$/-])${imp[1]}(?![\\w$])`).test(rest) ? text : rest;
  }
  if (!/from\s+['"]@astrojs\/node['"]/.test(text)) text = `import node from '@astrojs/node';\n${text}`;
  return text;
}

export function needsServer(configText, sources) {
  if (sources.some((text) => /export\s+const\s+prerender\s*=\s*false/.test(text))) return true;
  const output = String(configText).match(/output\s*:\s*['"](server|hybrid|static)['"]/);
  if (output && output[1] === 'server') return !sources.every((text) => /export\s+const\s+prerender\s*=\s*true/.test(text));
  return false;
}

// Decide what the adapter rule does for this theme, before any file is changed.
export function adapterPlan(configText, pageSources, allSources) {
  const adapter = adapterOf(configText);
  if (!adapter) return { action: 'none', adapter: '' };
  if (adapter === 'node') return { action: /mode\s*:\s*['"]middleware['"]/.test(configText) ? 'standalone' : 'keep', adapter };
  if (!needsServer(configText, pageSources)) return { action: 'static', adapter };
  if ((allSources || pageSources).some((text) => HOST_API.test(text))) return { action: 'host-api', adapter };
  return { action: 'node', adapter };
}

export function nodeAdapterVersion(packument, astroVersion) {
  const want = String(astroVersion || '').match(/(\d+)\.(\d+)\.(\d+)/);
  if (!want) return '';
  const num = (v) => v.split('.').map(Number);
  const less = (a, b) => { for (let i = 0; i < 3; i += 1) { if (a[i] !== b[i]) return a[i] < b[i]; } return false; };
  const have = [Number(want[1]), Number(want[2]), Number(want[3])];
  let best = '';
  for (const [version, meta] of Object.entries(packument.versions || {})) {
    if (version.includes('-')) continue;
    const peer = String((meta.peerDependencies || {}).astro || '').match(/^\^(\d+)\.(\d+)\.(\d+)$/);
    if (!peer || Number(peer[1]) !== have[0] || less(have, [Number(peer[1]), Number(peer[2]), Number(peer[3])])) continue;
    if (!best || less(num(best), num(version))) best = version;
  }
  return best;
}

export function sizeBytes(dir) {
  return walk(dir, SKIP_SIZE).reduce((sum, file) => sum + file.size, 0);
}

export function mb(bytes) {
  return Math.round((bytes / (1024 * 1024)) * 10) / 10;
}

// Relative paths in text files that resolve outside `root`.
export function escapingRefs(root) {
  const found = [];
  const textExt = /\.(m?[jt]sx?|c[jt]s|astro|vue|svelte|json|ya?ml|toml|css|scss|md|mdx|html)$/i;
  for (const file of walk(root, SKIP_SIZE)) {
    if (!textExt.test(file.full) || file.size > 1024 * 1024) continue;
    const rel = path.relative(root, file.full).split(path.sep).join('/');
    // Markdown outside src/ (README, CHANGELOG, docs) and test files are not part of the site build.
    if (/\.mdx?$/i.test(rel) && !rel.startsWith('src/')) continue;
    if (/(^|\/)(tests?|__tests__|e2e)\/|\.(test|spec)\.[cm]?[jt]sx?$/.test(rel)) continue;
    let text = '';
    try { text = readFileSync(file.full, 'utf8'); } catch { continue; }
    for (const match of text.matchAll(/['"`(]((?:\.\.\/)+[^'"`)\s]*)/g)) {
      const target = path.resolve(path.dirname(file.full), match[1]);
      if (target !== root && !target.startsWith(`${root}${path.sep}`)) found.push(`${path.relative(root, file.full)}: ${match[1]}`);
    }
  }
  return found;
}

export function checkFolder(dir) {
  const errors = [];
  const upstreamPath = path.join(dir, 'UPSTREAM.json');
  if (!existsSync(upstreamPath)) return ['missing UPSTREAM.json'];
  let upstream = {};
  try { upstream = JSON.parse(readFileSync(upstreamPath, 'utf8')); } catch { return ['UPSTREAM.json is not valid JSON']; }
  if (!/^[0-9a-f]{40}$/.test(upstream.commit || '')) errors.push('UPSTREAM.json commit is not a 40-character sha');
  if (!/^[0-9a-f]{64}$/.test(upstream.archiveSha256 || '')) errors.push('UPSTREAM.json archiveSha256 is not a sha256');
  if (!/^https:\/\/(github\.com|gitlab\.com|codeberg\.org)\/[\w.-]+\/[\w.-]+$/.test(upstream.repository || '')) errors.push('UPSTREAM.json repository is not a repo URL');
  const locks = ALL_LOCKS.filter((name) => existsSync(path.join(dir, name)));
  if (locks.length !== 1) errors.push(`has ${locks.length} lockfiles (${locks.join(', ') || 'none'})`);
  if (!readdirSync(dir).some((name) => LICENSE_FILE.test(name))) errors.push('missing LICENSE');
  const size = mb(sizeBytes(dir));
  if (size > MAX_MB) errors.push(`folder is ${size} MB`);
  const escaping = escapingRefs(path.resolve(dir));
  if (escaping.length) errors.push(`paths outside the folder: ${escaping.slice(0, 3).join('; ')}`);
  try {
    const pkg = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8'));
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    const outside = Object.entries(deps).filter(([, spec]) => /^(file|link):\.\.\//.test(String(spec)));
    if (outside.length) errors.push(`package.json depends on paths outside the folder: ${outside.map(([name]) => name).join(', ')}`);
  } catch {
    errors.push('missing or invalid package.json');
  }
  return errors;
}

function archiveUrl(row) {
  const host = String(row.host || 'github.com');
  const name = String(row.repo).split('/').pop();
  if (host === 'gitlab.com') return `https://gitlab.com/${row.repo}/-/archive/${row.commit}/${name}-${row.commit}.tar.gz`;
  if (host === 'codeberg.org') return `https://codeberg.org/${row.repo}/archive/${row.commit}.tar.gz`;
  return `https://codeload.github.com/${row.repo}/tar.gz/${row.commit}`;
}

// The archive's top folder must end in -<commit> (or be <repo name> on Codeberg): proof the archive GitHub served
// for this row's repo is that exact commit, not a base theme's or another branch's.
// A renamed repo keeps its commits, so the commit, not the folder name, is what proves the source.
export function archiveTopOk(row, top) {
  const name = String(row.repo).split('/').pop().toLowerCase();
  const value = String(top || '').replace(/\/$/, '').toLowerCase();
  return value.endsWith(`-${String(row.commit).toLowerCase()}`) || (row.host === 'codeberg.org' && value === name);
}

async function fetchSource(row, work) {
  const tarPath = path.join(work, 'source.tgz');
  await run('curl', ['-fsSL', '--retry', '3', '--retry-delay', '3', '-o', tarPath, archiveUrl(row)], { timeout: STEP_TIMEOUT });
  const sha256 = createHash('sha256').update(readFileSync(tarPath)).digest('hex');
  const listing = spawnSync('tar', ['-tzf', tarPath], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  const top = String(listing.stdout || '').split('\n')[0].split('/')[0];
  if (!archiveTopOk(row, top)) throw Object.assign(new Error(`archive top folder ${top} is not ${row.repo}@${row.commit}`), { code: 'provenance' });
  const src = path.join(work, 'src');
  mkdirSync(src, { recursive: true });
  await run('tar', ['-xzf', tarPath, '-C', src, '--strip-components=1'], { timeout: STEP_TIMEOUT });
  rmSync(tarPath, { force: true });
  return { src, sha256 };
}

function licenseIn(dir) {
  if (!existsSync(dir)) return '';
  const name = readdirSync(dir).filter((item) => LICENSE_FILE.test(item) && statSync(path.join(dir, item)).isFile()).sort((a, b) => a.length - b.length)[0];
  return name ? path.join(dir, name) : '';
}

// Copy the theme without git data, build output, other hosts' files or other package managers' lockfiles.
export function copyTheme(from, dest, keepLock) {
  const dropped = [];
  const root = realpathSync(from);
  const visit = (dir, rel) => {
    for (const name of readdirSync(dir)) {
      const full = path.join(dir, name);
      const relPath = rel ? `${rel}/${name}` : name;
      if (STRIP_ANYWHERE.has(name) || (!rel && (STRIP_ROOT.has(name) || (ALL_LOCKS.includes(name) && name !== keepLock)))) {
        if (!rel) dropped.push(name);
        continue;
      }
      const info = lstatSync(full);
      if (info.isSymbolicLink()) {
        let target = '';
        try { target = realpathSync(full); } catch { target = ''; }
        if (!target || (target !== root && !target.startsWith(`${root}${path.sep}`))) {
          dropped.push(`${relPath} (symlink to ${readlinkSync(full)})`);
          continue;
        }
        const out = path.join(dest, relPath);
        mkdirSync(path.dirname(out), { recursive: true });
        cpSync(target, out, { recursive: true, dereference: true });
        continue;
      }
      if (info.isDirectory()) visit(full, relPath);
      else {
        const out = path.join(dest, relPath);
        mkdirSync(path.dirname(out), { recursive: true });
        cpSync(full, out);
      }
    }
  };
  mkdirSync(dest, { recursive: true });
  visit(from, '');
  return dropped;
}

function imageSize(file) {
  const out = spawnSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
  const width = Number((String(out.stdout).match(/pixelWidth: (\d+)/) || [])[1] || 0);
  return width;
}

// Resize PNG and JPEG images over 300 KB to at most 1600 px wide, keeping each file name and format.
function shrinkImages(dest) {
  if (process.platform !== 'darwin') return 0;
  let changed = 0;
  for (const file of walk(dest, SKIP_SIZE)) {
    if (file.size <= IMAGE_BYTES || !/\.(png|jpe?g)$/i.test(file.full)) continue;
    const args = [];
    if (imageSize(file.full) > IMAGE_WIDTH) args.push('--resampleWidth', String(IMAGE_WIDTH));
    if (/\.jpe?g$/i.test(file.full)) args.push('-s', 'formatOptions', '80');
    if (!args.length) continue;
    const before = file.size;
    spawnSync('sips', [...args, file.full], { stdio: 'ignore' });
    if (statSync(file.full).size < before) changed += 1;
  }
  return changed;
}

// Drop videos, audio and fonts that no text file in the folder names.
function dropUnusedMedia(dest) {
  const media = walk(dest, SKIP_SIZE).filter((file) => /\.(mp4|webm|mov|m4v|ogv|mp3|wav|ogg|woff2?|ttf|otf|eot)$/i.test(file.full));
  if (!media.length) return [];
  const texts = walk(dest, SKIP_SIZE)
    .filter((file) => /\.(m?[jt]sx?|astro|vue|svelte|css|scss|sass|less|md|mdx|html|json|ya?ml|toml)$/i.test(file.full) && file.size < 2 * 1024 * 1024)
    .map((file) => { try { return readFileSync(file.full, 'utf8'); } catch { return ''; } })
    .join('\n');
  const dropped = [];
  for (const file of media) {
    if (texts.includes(path.basename(file.full))) continue;
    rmSync(file.full, { force: true });
    dropped.push(path.relative(dest, file.full));
  }
  return dropped;
}

function readJson(file) {
  try { return JSON.parse(readFileSync(file, 'utf8')); } catch { return null; }
}

function sourceTexts(dir, onlyPages) {
  const base = onlyPages ? path.join(dir, 'src', 'pages') : path.join(dir, 'src');
  return walk(base, SKIP_SIZE)
    .filter((file) => /\.(astro|m?[jt]sx?|mdx?)$/i.test(file.full) && file.size < 1024 * 1024)
    .map((file) => { try { return readFileSync(file.full, 'utf8'); } catch { return ''; } });
}

let nodePackument = null;
async function nodeAdapterFor(astroVersion) {
  if (!nodePackument) {
    const response = await fetch('https://registry.npmjs.org/@astrojs/node', { signal: AbortSignal.timeout(30000) });
    nodePackument = await response.json();
  }
  return nodeAdapterVersion(nodePackument, astroVersion);
}

// Package caches live under the runner's own cache folder, so a run never grows the user's global npm/pnpm/bun caches.
function localEnv() {
  const pathPrefix = existsSync(LOCAL_NODE_BIN) ? `${LOCAL_NODE_BIN}:` : '';
  const pkg = path.join(CACHE, 'pkg');
  return { ...process.env, PATH: `${pathPrefix}${process.env.PATH || ''}`,
    npm_config_cache: path.join(pkg, 'npm'), npm_config_store_dir: path.join(pkg, 'pnpm-store'),
    BUN_INSTALL_CACHE_DIR: path.join(pkg, 'bun'), YARN_CACHE_FOLDER: path.join(pkg, 'yarn'), CI: 'true', ASTRO_TELEMETRY_DISABLED: '1', HUSKY: '0', NODE_OPTIONS: '--max-old-space-size=4096', npm_config_manage_package_manager_versions: 'false' };
}

// Anybuild installs pnpm 10 unless package.json declares a version (node.rs default_manager_version); match it locally.
const PNPM_DEFAULT = '10.34.9';
function pnpmCmd(dir) {
  const declared = String((dir && (readJson(path.join(dir, 'package.json')) || {}).packageManager) || '').match(/^pnpm@(\d+\.\d+\.\d+)/);
  return ['npx', ['-y', `pnpm@${declared ? declared[1] : PNPM_DEFAULT}`]];
}

const YARN1 = ['npx', ['-y', 'yarn@1.22.22']];
const YARN4 = ['npx', ['-y', '-p', '@yarnpkg/cli-dist@4.9.2', 'yarn']];
function yarnCmd(dir) {
  return dir && yarnBerry(dir) ? YARN4 : YARN1;
}

function yarnBerry(dir) {
  return existsSync(path.join(dir, '.yarnrc.yml')) || /__metadata:/.test(existsSync(path.join(dir, 'yarn.lock')) ? readFileSync(path.join(dir, 'yarn.lock'), 'utf8').slice(0, 2000) : '');
}

// Same install commands as Anybuild (crates/anybuild/resources/starlib/tools/node.bzl): the lockfile pins versions,
// but the install is not frozen, so an older lockfile format is upgraded the way the Wasmer build does it.
export function installCommand(manager, frozen = false, dir = '') {
  if (manager === 'pnpm') return [pnpmCmd(dir)[0], [...pnpmCmd(dir)[1], 'install', frozen ? '--frozen-lockfile' : '--no-frozen-lockfile']];
  if (manager === 'yarn') {
    const [cmd, base] = yarnCmd(dir);
    const berry = base === YARN4[1];
    return [cmd, [...base, 'install', ...(frozen ? [berry ? '--immutable' : '--frozen-lockfile'] : [])]];
  }
  if (manager === 'bun') return ['bun', ['install', ...(frozen ? ['--frozen-lockfile'] : [])]];
  return ['npm', frozen ? ['ci', '--no-audit', '--no-fund'] : ['install', '--no-audit', '--no-fund']];
}

function addCommand(manager, spec, dir) {
  if (manager === 'pnpm') return [pnpmCmd(dir)[0], [...pnpmCmd(dir)[1], 'add', spec]];
  if (manager === 'yarn') return [yarnCmd(dir)[0], [...yarnCmd(dir)[1], 'add', spec]];
  if (manager === 'bun') return ['bun', ['add', spec]];
  return ['npm', ['install', '--no-audit', '--no-fund', spec]];
}

function buildCommand(manager, pkg, dir) {
  if (pkg && pkg.scripts && pkg.scripts.build) {
    if (manager === 'yarn') return [yarnCmd(dir)[0], [...yarnCmd(dir)[1], 'run', 'build']];
    if (manager === 'pnpm') return [pnpmCmd(dir)[0], [...pnpmCmd(dir)[1], 'run', 'build']];
    return [manager, ['run', 'build']];
  }
  return ['npx', ['astro', 'build']];
}

function detectOutput(dir) {
  if (existsSync(path.join(dir, 'dist', 'server', 'entry.mjs'))) return 'server';
  if (existsSync(path.join(dir, 'dist', 'index.html'))) return 'static';
  return '';
}

function htmlTitle(html) {
  const match = String(html || '').match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].replace(/\s+/g, ' ').trim() : '';
}

const BAD_HOST = /^(?:https?:)?\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|(?:www\.)?example\.(?:com|org|net))(?::\d+)?(?:\/|$)/i;

function canonicalHost(html) {
  const match = String(html || '').match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  const href = match && (match[0].match(/href=["']([^"']+)["']/i) || [])[1];
  try { return href ? new URL(href).host : ''; } catch { return ''; }
}

// Anchors on the home page that leave the demo for the theme's own configured site, or for a placeholder host.
export function linkProblems(html, demoHost) {
  const anchors = [...String(html || '').matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
  const assets = htmlRefs(html).filter((ref) => /\.(css|js|woff2?|ttf|png|jpe?g|webp|svg)(?:$|\?)/i.test(ref));
  // Assets on a placeholder host, or anchors to a dev server, break the page. Demo-content anchors to
  // example.com (placeholder social or partner links) leave navigation intact, so they are only noted.
  const placeholder = [...anchors.filter((ref) => BAD_HOST.test(ref) && !/example\.(com|org|net)/i.test(ref)), ...assets.filter((ref) => BAD_HOST.test(ref))];
  const examples = anchors.filter((ref) => BAD_HOST.test(ref) && /example\.(com|org|net)/i.test(ref));
  const site = canonicalHost(html);
  const oldHost = site && site !== demoHost ? anchors.filter((ref) => { try { return new URL(ref).host === site; } catch { return false; } }) : [];
  return { placeholder, oldHost, site, examples };
}

function patchSite(configText, url) {
  const re = /(\bsite\s*:\s*)(['"`])[^'"`]*\2/;
  return re.test(configText) ? configText.replace(re, `$1'${url}'`) : '';
}

function envNames(dir) {
  const names = new Set();
  for (const file of ['.env.example', '.env.sample', '.env.template', 'example.env']) {
    const full = path.join(dir, file);
    if (!existsSync(full)) continue;
    for (const line of readFileSync(full, 'utf8').split('\n')) {
      const match = line.match(/^\s*(?:export\s+)?([A-Z][A-Z0-9_]+)\s*=/);
      if (match) names.add(match[1]);
    }
  }
  return [...names];
}

const MARK_START = '<!-- wasmer:start -->';
const MARK_END = '<!-- wasmer:end -->';

export function renderWasmerSection(row, info) {
  const owner = String(row.repo).split('/')[0];
  const changes = info.wasmerChanges.length ? info.wasmerChanges.map((item) => `  - ${item}`).join('\n') : '  - None. The theme builds as published.';
  const serve = info.output === 'server'
    ? 'runs the `@astrojs/node` standalone server on Wasmer Edge'
    : 'serves the static `dist/` folder';
  const env = info.envVars.length
    ? `The theme's example env file lists ${info.envVars.map((name) => `\`${name}\``).join(', ')}. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.`
    : 'None.';
  return `${MARK_START}
## Deploy on Wasmer

This folder is the [${themeTitle(row, info.slug)}](https://${row.host || 'github.com'}/${row.repo}) Astro theme by ${owner}, copied from commit \`${row.commit}\` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-${info.slug}.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run \`wasmer deploy\` in this folder. Wasmer installs with ${info.packageManager}, runs the build script with Node ${NODE_VERSION} and ${serve}.
- **Changed for Wasmer:**
${changes}
- **Environment variables:** ${env}
- **Credit:** theme by [${owner}](https://${row.host || 'github.com'}/${owner}), ${row.license || 'see the license file'}. The theme's license file is kept unchanged.
${MARK_END}

`;
}

export function withWasmerSection(readme, section) {
  let text = String(readme || '');
  const start = text.indexOf(MARK_START);
  const end = text.indexOf(MARK_END);
  if (start !== -1 && end > start) text = text.slice(0, start) + text.slice(end + MARK_END.length).replace(/^\s*\n/, '');
  return `${section}${text}`;
}

function readmeFile(dir) {
  return readdirSync(dir).find((name) => /^readme\.md$/i.test(name)) || '';
}

function writeMeta(dest, row, info) {
  const upstream = {
    repository: `https://${row.host || 'github.com'}/${row.repo}`,
    subdir: row.subdir || '',
    commit: row.commit,
    archiveSha256: info.archiveSha256,
    license: row.license,
    astroVersion: info.astroVersion,
    packageManager: info.packageManager,
    nodeVersion: NODE_VERSION,
    output: info.output,
    wasmerChanges: info.wasmerChanges,
  };
  writeFileSync(path.join(dest, 'UPSTREAM.json'), `${JSON.stringify(upstream, null, 2)}\n`);
  const name = readmeFile(dest) || 'README.md';
  const current = existsSync(path.join(dest, name)) ? readFileSync(path.join(dest, name), 'utf8') : `# ${themeTitle(row, info.slug)}\n`;
  writeFileSync(path.join(dest, name), withWasmerSection(current, renderWasmerSection(row, info)));
}

function classify(stage, text) {
  const body = String(text || '');
  if (/heap out of memory/i.test(body)) return 'out-of-memory';
  if (/ETIMEDOUT|timed out|SIGTERM/i.test(body) && (stage === 'install' || stage === 'build')) return `${stage}-timeout`;
  if (/Missing clientId|tina\.io\/docs|(SUPABASE|CLERK|DATABASE_URL|API_KEY|SECRET|TOKEN)[A-Z_]*\b.*(missing|required|undefined|not set)|(missing|required).*env(ironment)? var/i.test(body)) return 'needs-secrets';
  if (/workspace:|ERR_PNPM_WORKSPACE|No matching version found for .*workspace/i.test(body)) return 'workspace-deps';
  if (/ERR_PNPM_OUTDATED_LOCKFILE|lockfile.*(out of date|not up to date)|npm ci.*in sync|can only install packages when your package\.json and package-lock\.json/i.test(body)) return 'lockfile-mismatch';
  return `${stage}-failed`;
}

async function localBuild(work, manager, env, info) {
  const pkg = readJson(path.join(work, 'package.json')) || {};
  const [cmd, args] = installCommand(manager, false, work);
  try {
    await run(cmd, args, { cwd: work, env, timeout: STEP_TIMEOUT });
  } catch (error) {
    throw Object.assign(new Error(`install failed: ${tailText(error)}`), { stage: 'install', detail: tailText(error) });
  }
  const started = Date.now();
  const [bcmd, bargs] = buildCommand(manager, pkg, work);
  try {
    await run(bcmd, bargs, { cwd: work, env, timeout: STEP_TIMEOUT });
  } catch (error) {
    const tail = tailText(error);
    const script = String((pkg.scripts || {}).build || '');
    if (/astro check/.test(script) && /error\s+ts\(|Found \d+ errors?|astro check/i.test(`${error.out || ''}${error.err || ''}`)) {
      try {
        await run('npx', ['astro', 'build'], { cwd: work, env, timeout: STEP_TIMEOUT });
        info.buildScript = 'astro build';
      } catch (retry) {
        throw Object.assign(new Error(`build failed: ${tailText(retry)}`), { stage: 'build', detail: tailText(retry) });
      }
    } else {
      throw Object.assign(new Error(`build failed: ${tail}`), { stage: 'build', detail: tail });
    }
  }
  return Math.round((Date.now() - started) / 1000);
}

async function fetchText(url, timeout = 30000) {
  const started = Date.now();
  const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(timeout) });
  const body = await response.text();
  return { status: response.status, body, ms: Date.now() - started, url: response.url };
}

function isPageRef(ref) {
  return !/^\/?404\/?$/.test(ref) && !/^(https?:|mailto:|tel:|javascript:|data:)/i.test(ref) && !ref.startsWith('//') && !ref.startsWith('#') && ref !== '/' && ref !== ''
    && !/\.(css|js|mjs|png|jpe?g|gif|svg|webp|avif|ico|xml|json|txt|pdf|woff2?|ttf|webmanifest|rss)(?:$|[?#])/i.test(ref);
}

async function liveChecksOnce(demo, local) {
  const checks = emptyChecks();
  const detail = [];
  const home = await fetchText(`${demo.replace(/\/$/, '')}/`, 60000);
  checks.coldStartMs = home.ms;
  checks.home = home.status === 200 ? 'passed' : 'failed';
  detail.push(`home HTTP ${home.status}`);
  if (checks.home !== 'passed') return { checks, detail: detail.join('; ') };
  const refs = htmlRefs(home.body);
  const demoHost = new URL(demo).host;
  const assets = refs.filter((ref) => /\.(css|js|mjs|woff2?|ttf|otf)(?:$|[?#])/i.test(ref));
  let assetsOk = true;
  const fonts = new Set();
  for (const ref of assets) {
    const target = absUrl(`${demo}/`, ref);
    if (!target) continue;
    const response = await fetchText(target);
    if (response.status !== 200) {
      // A broken third-party CDN link is the theme's own problem; only files this app serves can fail the row.
      if (new URL(target).host === demoHost) assetsOk = false;
      detail.push(`asset ${ref} HTTP ${response.status}`);
    }
    if (/\.css(?:$|\?)/i.test(ref)) {
      for (const match of response.body.matchAll(/url\(\s*['"]?([^'")]+\.(?:woff2?|ttf|otf))(?:[?#][^'")]*)?['"]?\s*\)/gi)) {
        if (!/^(https?:)?\/\/|^data:/i.test(match[1])) fonts.add(absUrl(target, match[1]));
      }
    }
  }
  for (const font of [...fonts].slice(0, 20)) {
    const response = await fetch(font, { method: 'GET', signal: AbortSignal.timeout(30000) });
    await response.arrayBuffer();
    if (response.status !== 200) { assetsOk = false; detail.push(`font ${font} HTTP ${response.status}`); }
  }
  checks.assets = assetsOk ? 'passed' : 'failed';
  checks.innerPage = 'failed';
  for (const ref of refs.filter(isPageRef).slice(0, 8)) {
    const target = absUrl(`${demo}/`, ref);
    if (!target || new URL(target).host !== demoHost) continue;
    const response = await fetchText(target);
    if (response.status === 200) { checks.innerPage = 'passed'; detail.push(`inner ${new URL(target).pathname}`); break; }
  }
  if (checks.innerPage === 'failed' && !refs.some(isPageRef)) {
    detail.push('home links to no inner page');
    // A one-page theme has no inner page to check; the local build proves it has no other HTML page.
    if (local.singlePage) checks.innerPage = 'n/a';
  }
  const missing = await fetchText(`${demo.replace(/\/$/, '')}/wasmer-missing-page-check-${Date.now()}`);
  checks.notFound = missing.status === 404 ? 'passed' : missing.status >= 500 ? 'failed' : 'passed';
  detail.push(`missing path HTTP ${missing.status}`);
  const links = linkProblems(home.body, demoHost);
  checks.links = links.placeholder.length ? 'failed' : 'passed';
  if (links.placeholder.length) detail.push(`placeholder links: ${links.placeholder.slice(0, 3).join(', ')}`);
  if (links.oldHost.length) detail.push(`${links.oldHost.length} links go to the theme's own site ${links.site}`);
  if (links.examples.length) detail.push(`${links.examples.length} demo-content links point at example.com`);
  if (local.output === 'server') checks.ssrRoute = home.status === 200 ? 'passed' : 'failed';
  if (local.title && htmlTitle(home.body) !== local.title) {
    checks.home = 'failed';
    detail.push(`live title "${htmlTitle(home.body)}" is not the local build's "${local.title}"`);
  }
  return { checks, detail: detail.join('; ') };
}

async function liveChecks(demo, local) {
  let last = { checks: emptyChecks(), detail: '' };
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try { last = await liveChecksOnce(demo, local); } catch (error) { last = { checks: emptyChecks(), detail: tailText(error) }; }
    if (last.checks.home === 'passed') break;
    if (attempt < 4) await sleep(8000);
  }
  return last;
}

async function pushBranch(branch) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await run('git', ['push', '-q', 'origin', `HEAD:refs/heads/${branch}`], { cwd: ROOT, timeout: 5 * 60 * 1000 });
      return;
    } catch (error) {
      if (attempt === 3) throw error;
      await sleep(5000 * attempt);
    }
  }
}

async function publishFolder(folder, message, branch) {
  return withGit(async () => {
    await assertPublishBranch(branch);
    // -f: the archive holds only files the theme tracks upstream, so its own ignore rules must not drop any.
    await run('git', ['add', '-A', '-f', '--', folder], { cwd: ROOT });
    const names = await gitOut(['diff', '--cached', '--name-only']);
    if (!names) return;
    await run('git', ['commit', '-q', '--no-verify', '-m', message], { cwd: ROOT });
    await pushBranch(branch);
  });
}

async function unpublishFolder(folder, branch) {
  return withGit(async () => {
    await assertPublishBranch(branch);
    await run('git', ['rm', '-r', '-q', '--ignore-unmatch', '--', folder], { cwd: ROOT });
    rmSync(path.join(ROOT, folder), { recursive: true, force: true });
    const names = await gitOut(['diff', '--cached', '--name-only']);
    if (!names) return;
    await run('git', ['commit', '-q', '--no-verify', '-m', `Remove ${folder}`], { cwd: ROOT });
    await pushBranch(branch);
  });
}

async function registryGraphql(query, variables) {
  const text = readFileSync(path.join(process.env.HOME || '', '.wasmer/wasmer.toml'), 'utf8');
  const token = (text.match(/^token\s*=\s*"([^"]+)"/m) || [])[1];
  const response = await fetch(REGISTRY, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(60000),
  });
  if (response.status === 429) throw new Error('429 registry');
  const body = await response.json();
  if (body.errors) throw new Error(body.errors.map((item) => item.message).join('; '));
  return body.data;
}

async function appExists(owner, name) {
  try {
    const data = await registryGraphql('query($name: String!, $owner: String!) { getDeployApp(name: $name, owner: $owner) { name } }', { name, owner });
    return Boolean(data.getDeployApp);
  } catch (error) {
    if (/not found|does not exist|no such/i.test(String(error.message))) return false;
    throw error;
  }
}

export async function catalogIndex() {
  const slugs = new Set();
  const repos = new Map();
  const nodes = [];
  let cursor = null;
  for (let page = 0; page < 80; page += 1) {
    const data = await withBackoff(() => registryGraphql(
      'query($cursor: String) { getAppTemplates(first: 100, after: $cursor) { pageInfo { hasNextPage endCursor } edges { node { slug repoUrl rootDir branch } } } }',
      { cursor },
    ));
    const connection = data.getAppTemplates;
    for (const edge of connection.edges || []) {
      slugs.add(edge.node.slug);
      nodes.push(edge.node);
      const repo = String(edge.node.repoUrl || '').toLowerCase().replace(/\.git$/, '').replace(/\/$/, '');
      if (repo && !repo.endsWith('github.com/wasmerio/examples')) repos.set(repo, edge.node.slug);
    }
    if (!connection.pageInfo.hasNextPage) break;
    cursor = connection.pageInfo.endCursor;
  }
  return { slugs, repos, nodes };
}

async function repoMentions(rev, folder) {
  const repos = new Set();
  for (const file of ['README.md', 'package.json', 'UPSTREAM.json']) {
    let text = '';
    try { text = await gitOut(['show', `${rev}:${folder}/${file}`]); } catch { continue; }
    for (const match of text.matchAll(/(?:github\.com|gitlab\.com|codeberg\.org)\/([\w.-]+\/[\w.-]+)/gi)) repos.add(match[1].replace(/\.git$/, '').toLowerCase());
  }
  return repos;
}

// Catalog templates whose slug names one of the queue's repos, with the repos their folder names.
async function catalogByName(nodes, rows) {
  const wanted = new Set(rows.map((row) => nameKey(String(row.repo).split('/').pop())));
  const map = new Map();
  for (const node of nodes) {
    const key = nameKey(node.slug);
    if (!wanted.has(key) || !node.rootDir || !/wasmerio\/examples/i.test(node.repoUrl || '')) continue;
    const rev = `origin/${node.branch || 'main'}`;
    map.set(key, { slug: node.slug, rootDir: node.rootDir, mentions: await repoMentions(rev, node.rootDir) });
  }
  return map;
}

// Folders on main named js-<slug> or js-astro-<slug>, mapped to the repos their README/package.json/UPSTREAM.json name.
async function trackedMentions(slugs) {
  const tracked = new Set((await gitOut(['ls-tree', '--name-only', 'origin/main'])).split('\n'));
  const map = new Map();
  for (const { slug } of Object.values(slugs)) {
    for (const folder of [`js-${slug}`, `js-astro-${slug}`]) {
      if (!tracked.has(folder) || map.has(folder)) continue;
      map.set(folder, await repoMentions('origin/main', folder));
    }
  }
  return map;
}

function publicRecord(record) {
  const copy = { ...record };
  delete copy.title;
  return copy;
}

async function processRow(row, plan, ctx) {
  const record = { ...plan };
  const folder = plan.folder;
  const slug = folder.replace(/^js-astro-/, '');
  const dest = path.join(ROOT, folder);
  const work = path.join(CACHE, 'work', slug);
  const appName = `astro-${slug}`;
  const info = { slug, archiveSha256: '', wasmerChanges: [], packageManager: plan.packageManager, output: '', astroVersion: row.astroVersion, envVars: [] };
  let stage = 'download';
  let pushed = false;
  let created = '';
  let liveOk = false;
  try {
    console.log(`build ${row.rank} ${folder}`);
    rmSync(work, { recursive: true, force: true });
    rmSync(dest, { recursive: true, force: true });
    mkdirSync(work, { recursive: true });
    const { src, sha256 } = await fetchSource(row, work);
    info.archiveSha256 = sha256;
    record.archiveSha256 = sha256;
    const from = row.subdir ? path.join(src, row.subdir) : src;
    if (!existsSync(path.join(from, 'package.json'))) throw Object.assign(new Error(`no package.json in ${row.subdir || 'the repo root'}`), { code: 'no-package-json' });

    stage = 'license';
    const licensePath = licenseIn(from) || (row.subdir ? licenseIn(src) : '');
    if (!licensePath) throw Object.assign(new Error(`no license file at commit ${row.commit}`), { status: 'rejected-license', code: 'no-license' });
    if (String(row.licenseGate) === 'check') {
      const review = ctx.licenseReview[row.repo];
      const verdict = review ? { decision: review.decision, kind: review.note } : classifyLicense(readFileSync(licensePath, 'utf8'));
      if (verdict.decision === 'rejected') throw Object.assign(new Error(`license: ${verdict.kind}`), { status: 'rejected-license', code: 'license-terms' });
      if (verdict.decision !== 'ok') throw Object.assign(new Error(`licenseGate=check and the license text needs a human read (${verdict.kind})`), { status: 'needs-review', code: 'license-review' });
      record.license = review && review.license ? review.license : (row.license && row.license !== 'NOASSERTION' ? row.license : verdict.kind);
    }

    stage = 'copy';
    const listed = lockManager(row.lockfile) || 'npm';
    const keepLock = LOCKFILES[listed].find((name) => existsSync(path.join(from, name))) || '';
    // Without the listed lockfile the folder gets an npm lockfile, so npm is what Anybuild will pick.
    const manager = keepLock ? listed : 'npm';
    info.packageManager = manager;
    const dropped = copyTheme(from, dest, keepLock);
    if (row.subdir && !licenseIn(dest)) cpSync(licensePath, path.join(dest, 'LICENSE'));
    if (row.subdir && !licenseIn(from)) info.wasmerChanges.push('Copied the repository root LICENSE into this folder, because the theme lives in a subfolder.');
    const hostFiles = dropped.filter((name) => STRIP_ROOT.has(name) && !['.github', 'dist'].includes(name));
    const otherLocks = dropped.filter((name) => ALL_LOCKS.includes(name));
    if (hostFiles.length) info.wasmerChanges.push(`Removed files used only by other hosts: ${hostFiles.join(', ')}.`);
    if (otherLocks.length) info.wasmerChanges.push(`Removed lockfiles of other package managers: ${otherLocks.join(', ')}; kept ${keepLock}.`);
    const links = dropped.filter((name) => name.includes('(symlink'));
    if (links.length) info.wasmerChanges.push(`Dropped symlinks that point outside the theme: ${links.join(', ')}.`);
    if (redactTree(dest)) info.wasmerChanges.push('Removed strings that look like API tokens from the source.');

    stage = 'adapter';
    const configName = findConfig(dest);
    if (!configName) throw Object.assign(new Error('no astro.config file'), { code: 'no-astro-config' });
    const configPath = path.join(dest, configName);
    let configText = readFileSync(configPath, 'utf8');
    const fix = ctx.fixes[String(row.rank)] || {};
    for (const [find, replace] of fix.configReplace || []) {
      if (!configText.includes(find)) throw new Error(`config fix does not apply: ${find}`);
      configText = configText.replace(find, replace);
      info.wasmerChanges.push(fix.note || `Changed \`${find}\` to \`${replace}\` in ${configName}.`);
    }
    const unbased = removeRepoBase(configText, row.repo);
    if (unbased !== configText) {
      configText = unbased;
      info.wasmerChanges.push(`Removed the GitHub Pages sub-path \`base: '/${String(row.repo).split('/').pop()}'\` from ${configName}, so assets load at the root of the Wasmer app.`);
    }
    const plan2 = adapterPlan(configText, sourceTexts(dest, true), sourceTexts(dest, false));
    let addNode = '';
    if (plan2.action === 'host-api') throw Object.assign(new Error(`pages need ${plan2.adapter} runtime APIs`), { code: 'host-api' });
    if (plan2.action === 'static') {
      configText = removeAdapter(configText);
      info.wasmerChanges.push(`Removed the @astrojs/${plan2.adapter} adapter from ${configName} and build a static site, since every page can be prerendered. The package stays in package.json so the lockfile is unchanged.`);
    } else if (plan2.action === 'node') {
      addNode = await nodeAdapterFor((row.astroVersion || '').replace(/^[^\d]*/, ''));
      if (!addNode) throw Object.assign(new Error(`no @astrojs/node release supports astro ${row.astroVersion}`), { code: 'adapter-swap' });
      configText = swapToNode(configText);
      info.wasmerChanges.push(`Replaced the @astrojs/${plan2.adapter} adapter with @astrojs/node ${addNode} in standalone mode, because some pages render on the server. Added @astrojs/node to package.json and the lockfile.`);
    } else if (plan2.action === 'standalone') {
      configText = configText.replace(/mode\s*:\s*['"]middleware['"]/, "mode: 'standalone'");
      info.wasmerChanges.push(`Switched @astrojs/node from middleware to standalone mode in ${configName} so it starts its own server.`);
    }
    writeFileSync(configPath, configText);
    if (fix.buildScript) {
      const pkg = readJson(path.join(dest, 'package.json'));
      pkg.scripts = { ...(pkg.scripts || {}), build: fix.buildScript };
      writeFileSync(path.join(dest, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`);
      info.wasmerChanges.push(fix.buildNote || `Set the build script to \`${fix.buildScript}\`.`);
    }

    stage = 'size';
    const resized = shrinkImages(dest);
    if (resized) info.wasmerChanges.push(`Resized ${resized} image${resized === 1 ? '' : 's'} over 300 KB to at most ${IMAGE_WIDTH} px wide, keeping file names and formats.`);
    if (sizeBytes(dest) > MAX_MB * 1024 * 1024) {
      const media = dropUnusedMedia(dest);
      if (media.length) info.wasmerChanges.push(`Dropped ${media.length} video, audio or font file${media.length === 1 ? '' : 's'} that nothing in the theme references.`);
    }
    const size = mb(sizeBytes(dest));
    record.folderSizeMb = size;
    if (size > MAX_MB) throw Object.assign(new Error(`folder is ${size} MB after the size pass`), { code: 'too-large' });

    const pkg = readJson(path.join(dest, 'package.json')) || {};
    const pinnedNode = (pkg.engines && pkg.engines.node) || ['.nvmrc', '.node-version'].some((name) => existsSync(path.join(dest, name)));
    if (!pinnedNode) {
      writeFileSync(path.join(dest, '.nvmrc'), `${NODE_VERSION}\n`);
      info.wasmerChanges.push(`Added .nvmrc with Node ${NODE_VERSION}, the Node version Wasmer builds with.`);
    }
    if (!keepLock) info.wasmerChanges.push('The theme has no lockfile, so this folder adds a package-lock.json generated with npm.');
    info.envVars = envNames(dest);
    record.catalog = catalogFor(row, slug, pkg);

    stage = 'install';
    const build = path.join(work, 'build');
    cpSync(dest, build, { recursive: true });
    const env = localEnv();
    if (!keepLock) {
      await run('npm', ['install', '--package-lock-only', '--no-audit', '--no-fund'], { cwd: build, env, timeout: STEP_TIMEOUT });
    }
    if (addNode) {
      const [cmd, args] = addCommand(manager, `@astrojs/node@${addNode}`, build);
      try { await run(cmd, args, { cwd: build, env, timeout: STEP_TIMEOUT }); } catch (error) {
        throw Object.assign(new Error(`adding @astrojs/node failed: ${tailText(error)}`), { stage: 'install' });
      }
    }
    for (const name of ['package.json', ...ALL_LOCKS]) {
      if (existsSync(path.join(build, name)) && (name === 'package.json' || name === keepLock || (!keepLock && name === 'package-lock.json'))) cpSync(path.join(build, name), path.join(dest, name));
    }
    stage = 'build';
    record.buildSeconds = await localBuild(build, manager, env, info);
    if (info.buildScript) {
      const next = readJson(path.join(dest, 'package.json'));
      next.scripts = { ...(next.scripts || {}), build: info.buildScript };
      writeFileSync(path.join(dest, 'package.json'), `${JSON.stringify(next, null, 2)}\n`);
      info.wasmerChanges.push('Changed the build script to `astro build`, because the theme\'s `astro check` step fails on type errors only.');
    }
    info.output = detectOutput(build);
    if (!info.output) throw Object.assign(new Error('the build produced neither dist/index.html nor dist/server/entry.mjs'), { stage: 'build', code: 'no-dist' });
    const builtPkg = readJson(path.join(dest, 'package.json')) || {};
    if (info.output === 'server' && !(builtPkg.scripts || {}).start) {
      // Anybuild needs a start command for a server build; js-astro-ssr declares the same one.
      builtPkg.scripts = { ...(builtPkg.scripts || {}), start: 'node ./dist/server/entry.mjs' };
      writeFileSync(path.join(dest, 'package.json'), `${JSON.stringify(builtPkg, null, 2)}\n`);
      info.wasmerChanges.push('Added a `start` script (`node ./dist/server/entry.mjs`) to package.json so Wasmer can start the Node server.');
    }
    const pages = walk(path.join(build, 'dist'), new Set(['_astro', 'server'])).filter((file) => file.full.endsWith('.html') && !/\/404(\/index)?\.html$/.test(file.full));
    const localHome = info.output === 'static' ? readFileSync(path.join(build, 'dist', 'index.html'), 'utf8')
      : existsSync(path.join(build, 'dist', 'client', 'index.html')) ? readFileSync(path.join(build, 'dist', 'client', 'index.html'), 'utf8') : '';
    const demoUrl = `https://${appName}.wasmer.app`;
    const local = linkProblems(localHome, `${appName}.wasmer.app`);
    if (local.oldHost.length) {
      const patched = patchSite(readFileSync(configPath, 'utf8'), demoUrl);
      if (patched) {
        writeFileSync(configPath, patched);
        info.wasmerChanges.push(`Set \`site\` in ${configName} to the Wasmer demo URL, because ${local.oldHost.length} home page links pointed at ${local.site}.`);
      }
    }
    info.astroVersion = (readJson(path.join(build, 'node_modules', 'astro', 'package.json')) || {}).version || row.astroVersion;
    record.astroVersion = info.astroVersion;
    record.packageManager = manager;
    record.output = info.output;
    const localTitle = htmlTitle(localHome);
    writeMeta(dest, row, info);
    record.wasmerChanges = info.wasmerChanges;
    rmSync(build, { recursive: true, force: true });
    const errors = checkFolder(dest);
    if (errors.length) throw Object.assign(new Error(errors.join('; ')), { code: errors.some((item) => item.startsWith('folder is')) ? 'too-large' : 'folder-check' });

    stage = 'publish';
    if (await appExists(ctx.owner, appName) && !ctx.ownApps.has(appName)) {
      throw Object.assign(new Error(`app ${ctx.owner}/${appName} already exists and this run did not create it`), { code: 'app-name-taken' });
    }
    await publishFolder(folder, `Add ${folder}`, ctx.branch);
    pushed = true;
    record.pr = ctx.branch;

    stage = 'deploy';
    let deployed;
    for (let attempt = 1; !deployed; attempt += 1) {
      try {
        deployed = await withBackoff(() => deployAutobuild({ folder, appName, owner: ctx.owner, branch: ctx.branch, attempts: 120 }));
      } catch (error) {
        if (error && error.existed === false) created = appName;
        // Under load some builds end FAILED with a log that stops mid-build and shows no error; those pass on a redeploy.
        const silent = error && error.buildId && attempt === 1 && !/ERROR|error:|failed to solve|Error:/.test(await autobuildLogTail(error.buildId));
        if (!silent) throw error;
        info.silentRetry = error.buildId;
        console.log(`redeploy ${row.rank} after silent build failure ${error.buildId}`);
        await sleep(60000);
      }
    }
    if (!deployed.existed) created = appName;
    record.createdApp = created || (ctx.ownApps.has(appName) ? appName : '');
    record.demo = demoUrl;

    stage = 'live';
    const live = await liveChecks(demoUrl, { output: info.output, title: localTitle, singlePage: info.output === 'static' && pages.length <= 1 });
    record.checks = live.checks;
    const failed = Object.entries(live.checks).filter(([key, value]) => key !== 'coldStartMs' && value !== 'passed' && value !== 'n/a').map(([key]) => key);
    if (failed.length) throw Object.assign(new Error(`live checks failed: ${failed.join(', ')} (${live.detail})`), { code: 'live-check' });
    liveOk = true;
    record.liveDetail = info.silentRetry ? `${live.detail}; first build ${info.silentRetry} failed without an error and was redeployed` : live.detail;

    stage = 'preview';
    const previewPath = path.join(dest, 'preview.jpg');
    await run(process.execPath, [path.join(ROOT, 'scripts/mcp-preview.mjs'), '--url', demoUrl, '--out', previewPath, '--selector', 'body'], { timeout: 5 * 60 * 1000 });
    if (statSync(previewPath).size > 120 * 1024) throw new Error(`preview.jpg is ${statSync(previewPath).size} bytes`);
    if (process.platform === 'darwin') {
      const probed = spawnSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', previewPath], { encoding: 'utf8' });
      if (!/pixelWidth: 1600/.test(probed.stdout) || !/pixelHeight: 1000/.test(probed.stdout)) throw new Error('preview is not 1600x1000');
    }
    await publishFolder(folder, `Add the ${folder} preview`, ctx.branch);
    record.status = 'shipped';
    record.reason = '';
    record.reasonCode = '';
    record.folderSizeMb = mb(sizeBytes(dest));
    console.log(`done ${row.rank} shipped ${demoUrl}`);
  } catch (error) {
    record.status = error.status || 'blocked';
    const realStage = error.stage || stage;
    record.reasonCode = error.code || classify(realStage, `${error.detail || ''}\n${error.message || ''}`);
    record.reason = `${realStage}: ${tailText(error)}`.slice(-1800);
    if (error && error.buildId) {
      const logTail = await autobuildLogTail(error.buildId);
      if (logTail) record.reason = `${record.reason}\n${logTail}`.slice(-1800);
      record.reasonCode = classify('autobuild', logTail) === 'autobuild-failed' ? 'autobuild-failed' : classify('autobuild', logTail);
    }
    if (!liveOk) {
      const deleted = await deleteCreated(created, ctx.owner);
      if (deleted) record.reason = `${record.reason}${deleted}`.slice(-1800);
      record.createdApp = deleted ? created : '';
      if (pushed) {
        try { await unpublishFolder(folder, ctx.branch); } catch (cleanup) {
          record.reason = `${record.reason} (folder cleanup failed: ${tailText(cleanup).split('\n').slice(-1)[0]})`.slice(-1800);
        }
      } else rmSync(dest, { recursive: true, force: true });
    }
    console.log(`done ${row.rank} ${record.status} ${record.reasonCode} ${folder}`);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
  if (record.status !== 'shipped') record.wasmerChanges = info.wasmerChanges;
  ctx.rows.set(row.rank, publicRecord(record));
  await ctx.save();
}

function isFinal(status) {
  return FINAL.has(status) || String(status).startsWith('duplicate-of:');
}

function readJsonFile(file, fallback) {
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : fallback;
}

// Apps earlier runs created for these slugs, so a rerun may redeploy them; any other existing app is off limits.
async function ownApps(dir) {
  const apps = new Set();
  // Folders this branch already pushed: an interrupted run may have deployed their app before recording it.
  for (const name of (await gitOut(['diff', '--name-only', 'origin/main...HEAD'])).split('\n')) {
    const folder = name.split('/')[0];
    if (folder.startsWith('js-astro-')) apps.add(folder.replace(/^js-/, ''));
  }
  if (!existsSync(dir)) return apps;
  for (const name of readdirSync(dir).filter((item) => item.endsWith('.jsonl'))) {
    for (const row of loadJsonl(path.join(dir, name)).values()) if (row.createdApp) apps.add(row.createdApp);
  }
  return apps;
}

export function noteShared(rows, file) {
  const groups = new Map();
  for (const row of rows) {
    if (row.status !== 'blocked' || !['autobuild-failed', 'live-check', 'deploy-failed', 'publish-failed'].includes(row.reasonCode)) continue;
    const label = row.reasonCode === 'live-check' ? 'edge-platform' : row.reasonCode === 'autobuild-failed' ? 'anybuild' : 'wasmer-cli';
    const line = String(row.reason || '').split('\n').find((item) => /error|failed|HTTP 5/i.test(item)) || String(row.reason).split('\n')[0];
    const key = `${label}\t${line.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>').replace(/astro-[\w-]+/g, '<app>').slice(0, 160)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  const shared = [...groups.entries()].filter(([, items]) => items.length >= 3);
  if (!shared.length) return 0;
  const previous = existsSync(file) ? readFileSync(file, 'utf8') : '# Wasmer-side failures in the Astro run\n';
  const blocks = shared.map(([key, items]) => {
    const [label, line] = key.split('\t');
    const sample = items[0];
    return `\n## ${label}: ranks ${items.map((item) => item.rank).join(', ')}\n\n- Error: ${line}\n- Repro: deployViaAutobuild with repoUrl https://github.com/wasmerio/examples, rootDir ${sample.folder}, branch ${sample.pr || 'the chunk branch'} (${sample.output || 'unknown'} output, ${sample.packageManager}).\n`;
  }).filter((block) => !previous.includes(block.split('\n')[1]));
  if (blocks.length) writeFileSync(file, `${previous.trimEnd()}\n${blocks.join('')}`);
  return blocks.length;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const retryBlocked = process.argv.includes('--retry-blocked');
  const only = new Set(flag('--only', '').split(',').filter(Boolean).map(Number));
  const from = Number(flag('--from', '1'));
  const to = Number(flag('--to', '8'));
  const owner = flag('--owner', '');
  const concurrency = Number(flag('--concurrency', '6'));
  const reportsDir = path.join(ROOT, 'reports/astro');
  const report = path.resolve(ROOT, flag('--report', `reports/astro/run-${from}-${to}.jsonl`));
  let queuePath = flag('--queue', path.join(ROOT, 'astro-queue.csv'));
  if (!existsSync(queuePath)) queuePath = GAP_QUEUE;
  if (!dryRun && !owner) throw new Error('Pass --owner');
  const all = parseCsv(readFileSync(queuePath, 'utf8'));
  const slugsPath = path.join(reportsDir, 'slugs.json');
  let slugs = readJsonFile(slugsPath, null);
  if (!slugs) {
    slugs = assignSlugs(all, new Set([...HANDWRITTEN].map((name) => name.replace(/^js-astro-/, ''))));
    mkdirSync(reportsDir, { recursive: true });
    writeFileSync(slugsPath, `${JSON.stringify(slugs, null, 1)}\n`);
  }
  const rows = all.filter((row) => row.rank >= from && row.rank <= to && (!only.size || only.has(row.rank)));
  const reportRows = loadJsonl(report);
  const catalog = await catalogIndex();
  const ctx = {
    slugs,
    catalogSlugs: catalog.slugs,
    catalogRepos: catalog.repos,
    catalogByName: await catalogByName(catalog.nodes, rows),
    trackedMentions: await trackedMentions(slugs),
    licenseReview: readJsonFile(path.join(reportsDir, 'license-review.json'), {}),
    fixes: readJsonFile(path.join(reportsDir, 'config-fixes.json'), {}),
    ownApps: dryRun ? new Set() : await ownApps(reportsDir),
    owner,
    rows: reportRows,
    branch: dryRun ? '' : await gitOut(['rev-parse', '--abbrev-ref', 'HEAD']),
    save: async () => {
      const lines = [...ctx.rows.values()].sort((a, b) => a.rank - b.rank).map((row) => JSON.stringify(row));
      mkdirSync(path.dirname(report), { recursive: true });
      writeFileSync(report, `${lines.join('\n')}\n`);
    },
  };
  if (!dryRun) await assertPublishBranch(ctx.branch);
  const pending = [];
  for (const row of rows) {
    const previous = reportRows.get(row.rank);
    if (previous && isFinal(previous.status) && !(retryBlocked && previous.status === 'blocked') && !only.size) {
      console.log(`skip ${row.rank} ${previous.status}`);
      continue;
    }
    const plan = planRow(row, ctx);
    if (plan.status !== 'not-run' || dryRun) {
      ctx.rows.set(row.rank, publicRecord(dryRun && plan.status === 'not-run' ? { ...plan, reason: 'dry-run' } : plan));
      console.log(`done ${row.rank} ${plan.status} ${plan.folder}`);
      continue;
    }
    pending.push({ row, plan });
  }
  await ctx.save();
  if (!dryRun) await mapPool(pending, concurrency, (item) => processRow(item.row, item.plan, ctx));
  noteShared([...ctx.rows.values()], path.join(reportsDir, 'wasmer-bugs.md'));
  const counts = [...ctx.rows.values()].reduce((bag, row) => {
    const key = String(row.status).startsWith('duplicate-of:') ? 'duplicate' : row.status;
    bag[key] = (bag[key] || 0) + 1;
    return bag;
  }, {});
  console.log(`BATCH_DONE ${JSON.stringify(counts)}`);
}

const entry = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (entry) {
  main().catch((error) => {
    console.error(`FATAL ${error && error.message ? error.message : error}`);
    process.exit(1);
  });
}
