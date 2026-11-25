#!/usr/bin/env node
// Prepare createAppTemplate calls for shipped Hugo rows, reading every folder from origin/main
// (the branch the catalog Deploy button builds).
// --dry-run writes the plan and does not change the catalog.
// --apply publishes only when HUGO_REGISTER_CONFIRM is exactly "REGISTER CONFIRM".
// Existing slugs are skipped. This script never updates or deletes a template.

import { execFile } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const REGISTRY = 'https://registry.wasmer.io/graphql';
const REPO_URL = 'https://github.com/wasmerio/examples';
const BRANCH = 'main';
const CONFIRM = 'REGISTER CONFIRM';
// Same value as the existing hugo-starter catalog entry.
const COMPLETION_SECONDS = '30';
const REQUIRED_FILES = ['README.md', 'hugo.toml', 'Anybuild', 'LICENSE', 'preview.jpg'];

function arg(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${name} needs a value`);
  return value;
}

function registryToken() {
  const text = readFileSync(path.join(homedir(), '.wasmer/wasmer.toml'), 'utf8');
  const match = text.match(/^token\s*=\s*"([^"]+)"/m) || text.match(/^token\s*=\s*'([^']+)'/m);
  if (!match) throw new Error('Wasmer registry token is missing');
  return match[1];
}

async function registryRequest(body, headers = {}) {
  const response = await fetch(REGISTRY, {
    method: 'POST',
    headers: { authorization: `Bearer ${registryToken()}`, ...headers },
    body,
    signal: AbortSignal.timeout(120000),
  });
  const json = await response.json();
  if (!response.ok || json.errors) {
    throw new Error(json.errors ? json.errors.map((item) => item.message).join('; ') : `registry HTTP ${response.status}`);
  }
  return json.data;
}

const graphql = (query, variables) =>
  registryRequest(JSON.stringify({ query, variables }), { 'content-type': 'application/json' });

async function existingSlugs() {
  const slugs = new Set();
  let cursor = null;
  for (;;) {
    const { getAppTemplates: page } = await graphql(
      `query($cursor: String) {
        getAppTemplates(first: 100, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          edges { node { slug } }
        }
      }`,
      { cursor },
    );
    for (const edge of page.edges || []) slugs.add(edge.node.slug);
    if (!page.pageInfo?.hasNextPage) return slugs;
    cursor = page.pageInfo.endCursor;
  }
}

// getAppTemplates' totalCount is only correct without a cursor.
async function catalogTotal() {
  const { getAppTemplates } = await graphql('{ getAppTemplates(first: 0) { totalCount } }');
  return getAppTemplates.totalCount;
}

export function loadRows(reportsDir) {
  const byRank = new Map();
  const files = readdirSync(reportsDir).filter((name) => /^run-.*\.jsonl$/.test(name)).sort();
  for (const name of files) {
    for (const line of readFileSync(path.join(reportsDir, name), 'utf8').split('\n')) {
      if (!line.trim()) continue;
      const row = JSON.parse(line);
      if (byRank.has(row.rank)) throw new Error(`rank ${row.rank} appears in more than one report`);
      byRank.set(row.rank, row);
    }
  }
  return [...byRank.values()];
}

async function gitShow(repo, rev, file, encoding = 'utf8') {
  try {
    const { stdout } = await exec('git', ['-C', repo, 'cat-file', 'blob', `${rev}:${file}`], { encoding, maxBuffer: 16 * 1024 * 1024 });
    return stdout;
  } catch {
    return null;
  }
}

// The theme module the folder's hugo.toml imports.
export function importedModule(hugoToml) {
  const match = String(hugoToml || '').match(/\[\[module\.imports\]\]\s*\n\s*path\s*=\s*"([^"]+)"/);
  return match ? match[1] : '';
}

async function liveHtml(url) {
  try {
    const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30000) });
    return { status: response.status, html: await response.text() };
  } catch (error) {
    return { status: 0, html: '', error: error.message || String(error) };
  }
}

const ownerOf = (modulePath) => String(modulePath || '').split('/')[1] || '';

export function inputFor(row, readme) {
  const catalog = row.catalog || {};
  return {
    name: catalog.name,
    slug: catalog.slug,
    description: String(catalog.description || '').slice(0, 160),
    category: catalog.category,
    framework: 'hugo',
    language: 'go',
    repoUrl: REPO_URL,
    rootDir: row.folder,
    branch: BRANCH,
    demoUrl: row.demo,
    repoLicense: row.license || '',
    readme,
    isPublic: true,
    canDeployWithoutRepo: false,
    completionTimeInSeconds: COMPLETION_SECONDS,
    highlighted: false,
  };
}

// Decide one row's action from what main holds and what the live demo serves.
export function planItem({ row, existing, files, demo, sameSlugRanks }) {
  const base = { rank: row.rank, module: row.module, folder: row.folder, slug: row.catalog?.slug || '', demoUrl: row.demo };
  if (existing.has(base.slug)) return { ...base, action: 'skip-existing', reason: 'slug is already in the catalog' };
  const missing = REQUIRED_FILES.filter((name) => !files[name]);
  if (missing.length) return { ...base, action: 'not-ready', reason: `${BRANCH} is missing ${missing.join(', ')}` };
  // GitHub paths are case-insensitive, so github.com/RyanBalfanz/x and github.com/ryanbalfanz/x are the same theme.
  if (importedModule(files['hugo.toml']).toLowerCase() !== String(row.module).toLowerCase()) {
    return { ...base, action: 'hold-slug', reason: `folder on ${BRANCH} imports ${importedModule(files['hugo.toml']) || 'no module'}, not this row's theme` };
  }
  // No license means all rights reserved, so the theme can't be offered for redistribution.
  if (!row.license || /^Unknown license/i.test(files.LICENSE)) {
    return { ...base, action: 'hold-license', reason: 'the theme has no license the catalog can show' };
  }
  if (demo.status !== 200) return { ...base, action: 'hold-demo', reason: `demo returned ${demo.status || demo.error}` };
  if (sameSlugRanks.length > 1 && !demo.html.includes(ownerOf(row.module))) {
    return { ...base, action: 'hold-slug', reason: `ranks ${sameSlugRanks.join(', ')} share this slug and the live demo shows a different theme` };
  }
  return { ...base, action: 'ready', reason: '', input: inputFor(row, files['README.md']) };
}

async function createTemplate(input, imageBytes) {
  const form = new FormData();
  form.set('operations', JSON.stringify({
    query: `mutation($input: CreateAppTemplateInput!) {
      createAppTemplate(input: $input) { appTemplate { slug } }
    }`,
    variables: { input: { ...input, defaultImageUpload: null } },
  }));
  form.set('map', JSON.stringify({ 0: ['variables.input.defaultImageUpload'] }));
  form.set('0', new Blob([imageBytes], { type: 'image/jpeg' }), 'preview.jpg');
  const data = await registryRequest(form);
  return data.createAppTemplate.appTemplate.slug;
}

async function pool(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await worker(items[index]);
    }
  }));
  return results;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const apply = process.argv.includes('--apply');
  if (dryRun === apply) throw new Error('pass exactly one of --dry-run or --apply');
  if (apply && process.env.HUGO_REGISTER_CONFIRM !== CONFIRM) throw new Error('refusing to publish without HUGO_REGISTER_CONFIRM');
  const repo = path.resolve(arg('--repo', process.cwd()));
  const rev = arg('--rev', `origin/${BRANCH}`);
  const reportsDir = path.resolve(arg('--reports', path.join(repo, 'reports/hugo')));
  const outPath = path.resolve(arg('--out', path.join(reportsDir, 'register-plan.json')));

  const shipped = loadRows(reportsDir).filter((row) => row.status === 'shipped').sort((a, b) => a.rank - b.rank);
  const existing = await existingSlugs();
  const totalBefore = await catalogTotal();
  const ranksBySlug = new Map();
  for (const row of shipped) ranksBySlug.set(row.catalog?.slug, [...(ranksBySlug.get(row.catalog?.slug) || []), row.rank]);

  const items = await pool(shipped, 8, async (row) => {
    const files = {};
    for (const name of REQUIRED_FILES) {
      files[name] = name === 'preview.jpg'
        ? Boolean(await gitShow(repo, rev, `${row.folder}/${name}`, 'buffer'))
        : await gitShow(repo, rev, `${row.folder}/${name}`);
    }
    const demo = await liveHtml(row.demo);
    return planItem({ row, existing, files, demo, sameSlugRanks: ranksBySlug.get(row.catalog?.slug) || [] });
  });

  const counts = {};
  for (const item of items) counts[item.action] = (counts[item.action] || 0) + 1;
  const plan = { rev, catalogTotalCount: totalBefore, shippedRows: shipped.length, counts, published: false, items };

  if (apply) {
    plan.created = [];
    plan.failed = [];
    for (const item of items.filter((entry) => entry.action === 'ready')) {
      try {
        const image = await gitShow(repo, rev, `${item.folder}/preview.jpg`, 'buffer');
        const slug = await createTemplate(item.input, image);
        const { getAppTemplate } = await graphql('query($slug: String!) { getAppTemplate(slug: $slug) { slug } }', { slug });
        if (!getAppTemplate) throw new Error('created but getAppTemplate returned nothing');
        plan.created.push({ rank: item.rank, slug });
        console.log(`created ${slug}`);
      } catch (error) {
        plan.failed.push({ rank: item.rank, slug: item.slug, error: error.message || String(error) });
        console.error(`failed ${item.slug}: ${error.message || error}`);
      }
    }
    plan.published = true;
    plan.catalogTotalCountAfter = await catalogTotal();
  }

  writeFileSync(outPath, `${JSON.stringify(plan, null, 2)}\n`);
  console.log(JSON.stringify({
    out: outPath, rev, catalogTotalCount: totalBefore, shippedRows: shipped.length, counts,
    ...(apply && { created: plan.created.length, failed: plan.failed.length, catalogTotalCountAfter: plan.catalogTotalCountAfter }),
  }));
}

const entry = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (entry) {
  main().catch((error) => {
    console.error(error && error.message ? error.message : error);
    process.exit(1);
  });
}
