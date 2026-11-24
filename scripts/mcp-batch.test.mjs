import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  blockedDependency, chooseAdapter, evaluateRow, parseCsv, renderTemplate,
} from './mcp-batch.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(here, 'fixtures/mcp-batch');
const queue = parseCsv(readFileSync(path.join(fixtureDir, 'queue.csv'), 'utf8'));
const meta = JSON.parse(readFileSync(path.join(fixtureDir, 'meta.json'), 'utf8'));

function decideAll() {
  const ctx = { seen: new Map(), slugs: new Set(), folders: new Set(), templates: new Set() };
  return queue.map((row) => evaluateRow(row, { ...meta[String(row.rank)], pkgType: row.pkgType }, ctx));
}

test('fixture queue covers the five gate outcomes', () => {
  const rows = decideAll();
  assert.deepEqual(rows.map((row) => [row.rank, row.status, row.adapter]), [
    [1, 'build', 'in-process'],
    [2, 'build', 'native-http'],
    [3, 'build', 'stdio-bridge'],
    [4, 'blocked', ''],
    [5, 'rejected-provenance', ''],
  ]);
  assert.match(rows[3].reason, /playwright/);
  assert.match(rows[4].reason, /does not match/);
  assert.equal(rows[0].catalog.name, 'Weather MCP Server');
  assert.equal(rows[1].catalog.name, 'Native HTTP MCP Server');
});

test('in-process wins over a Streamable HTTP flag', () => {
  const choice = chooseAdapter({ pkgType: 'pypi', importSymbol: 'app', readme: '--mode streamable-http' });
  assert.equal(choice.adapter, 'in-process');
});

test('python stdio with no HTTP flag is blocked', () => {
  const ctx = { seen: new Map(), slugs: new Set(), folders: new Set(), templates: new Set() };
  const row = { ...queue[1], rank: 90, pkg: 'plain-stdio', gh: 'example/plain-stdio', description: 'Adds numbers' };
  const decision = evaluateRow(row, {
    pkgType: 'pypi',
    repository: 'https://github.com/example/plain-stdio',
    dependencies: [],
    readme: 'stdio only',
    entryExcerpt: 'def main():\n    pass\n',
  }, ctx);
  assert.equal(decision.status, 'blocked');
  assert.equal(decision.blocker.where, 'python-runtime');
});

test('unsafe wording is needs-review and a dev-only esbuild is allowed', () => {
  const ctx = { seen: new Map(), slugs: new Set(), folders: new Set(), templates: new Set() };
  const row = { ...queue[2], rank: 91, pkg: 'desk-mcp', gh: 'example/desk-mcp', description: 'Desktop helper' };
  const decision = evaluateRow(row, {
    pkgType: 'npm',
    repository: 'https://github.com/example/desk-mcp',
    dependencies: ['@modelcontextprotocol/sdk'],
    devDependencies: ['esbuild'],
    readme: 'stdio',
    entryExcerpt: 'const server = new McpServer();\n',
  }, ctx);
  assert.equal(decision.status, 'needs-review');
  assert.match(decision.reason, /desktop/);
  assert.equal(blockedDependency({ pkgType: 'npm', dependencies: [], devDependencies: ['esbuild'] }), '');
  assert.equal(blockedDependency({ pkgType: 'npm', dependencies: ['esbuild'], devDependencies: [] }), 'esbuild');
});

test('native-http template does not open Python pipes', () => {
  const rows = decideAll();
  const rendered = renderTemplate(queue[1], { ...meta['2'], pkgType: 'pypi' }, rows[1]);
  const main = rendered.files[`${rows[1].folder}/main.py`];
  assert.match(main, /adapter="native-http"/);
  assert.doesNotMatch(main, /PIPE/);
  const shared = readFileSync(path.join(here, '../_shared/mcp-http/python/mcp_http/app.py'), 'utf8');
  assert.match(shared, /stdout=asyncio\.subprocess\.DEVNULL/);
  assert.match(shared, /stderr=asyncio\.subprocess\.DEVNULL/);
  const readme = rendered.files[`${rows[1].folder}/README.md`];
  assert.match(readme, /openssl rand -hex 32/);
  assert.match(readme, /Settings/);
});

test('dry-run CLI prints one object per fixture row', () => {
  const result = spawnSync(process.execPath, [
    path.join(here, 'mcp-batch.mjs'),
    '--queue', path.join(fixtureDir, 'queue.csv'),
    '--from', '1',
    '--to', '5',
    '--fixtures', fixtureDir,
    '--dry-run',
  ], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const lines = result.stdout.trim().split('\n').map((line) => JSON.parse(line));
  assert.equal(lines.length, 5);
  assert.equal(lines[2].adapter, 'stdio-bridge');
  assert.equal(lines[4].status, 'rejected-provenance');
});
