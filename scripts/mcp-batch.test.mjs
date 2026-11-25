import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  acceptLocal, applyProbe, autobuildInput, binFile, blockedDependency, checkMcpUrl, chooseAdapter, ensureLocalJsShared, evaluateRow, launchArgs, localError, nativeBinary, parseCsv, PROBE_SOURCE, renderTemplate, upstreamEnv,
} from './mcp-batch.mjs';
import { generatedCopy } from './sync-mcp-http.mjs';

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
  assert.doesNotMatch(main, /\.\.\//);
  assert.doesNotMatch(rendered.files[`Anybuild.${rows[1].folder}`], /\.\.\//);
  const shared = readFileSync(path.join(here, '../_shared/mcp-http/python/mcp_http/app.py'), 'utf8');
  assert.match(shared, /stdout=asyncio\.subprocess\.DEVNULL/);
  assert.match(shared, /stderr=asyncio\.subprocess\.DEVNULL/);
  const readme = rendered.files[`${rows[1].folder}/README.md`];
  assert.match(readme, /openssl rand -hex 32/);
  assert.match(readme, /Settings/);
});

test('python import probe selects in-process', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'mcp-probe-test-'));
  try {
    mkdirSync(path.join(dir, 'samplepkg'));
    writeFileSync(path.join(dir, 'samplepkg/__init__.py'), '');
    writeFileSync(path.join(dir, 'samplepkg/server.py'), [
      'class FastMCP:',
      '    def __init__(self, name):',
      '        self.name = name',
      '    def list_tools(self):',
      '        return []',
      'app = FastMCP("x")',
      'def register_all_tools():',
      '    return None',
      '',
    ].join('\n'));
    const result = spawnSync('python3', ['-c', PROBE_SOURCE], {
      encoding: 'utf8',
      env: { ...process.env, PYTHONPATH: dir, MCP_PROBE_MODULE: 'samplepkg', MCP_PROBE_DIST: 'samplepkg' },
    });
    assert.equal(result.status, 0, result.stderr);
    const parsed = JSON.parse(result.stdout.trim().split('\n').filter(Boolean).pop());
    assert.equal(parsed.found.symbol, 'app');
    assert.equal(parsed.found.module, 'samplepkg.server');
    assert.equal(parsed.found.register, 'register_all_tools');
    const meta = {
      pkgType: 'pypi',
      repository: 'https://github.com/example/plain-stdio',
      dependencies: [],
      readme: 'stdio only',
      entryExcerpt: 'def main():\n    pass\n',
    };
    applyProbe(meta, parsed.found);
    const ctx = { seen: new Map(), slugs: new Set(), folders: new Set(), templates: new Set() };
    const row = { ...queue[1], rank: 90, pkg: 'plain-stdio', gh: 'example/plain-stdio', description: 'Adds numbers' };
    const decision = evaluateRow(row, meta, ctx);
    assert.equal(decision.status, 'build');
    assert.equal(decision.adapter, 'in-process');
    const rendered = renderTemplate(row, meta, decision);
    assert.match(rendered.files[`${decision.folder}/main.py`], /register_all_tools\(\)/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('a failed local check blocks the row and skips deploy', async () => {
  const report = {
    rank: 7,
    folder: 'js-mcp-closed-port',
    adapter: 'stdio-bridge',
    status: 'build',
    reason: '',
    tests: { local: 'not run' },
    blocker: null,
    tools: [],
  };
  const accepted = acceptLocal(report, { ok: false, error: 'healthz did not answer' });
  assert.equal(accepted, false);
  assert.equal(report.status, 'blocked');
  assert.equal(report.tests.local, 'failed');
  assert.equal(report.blocker.where, 'edgejs');
  assert.equal(report.blocker.what, 'local MCP check failed');
  const checked = await checkMcpUrl('http://127.0.0.1:9/mcp', 'local-check-token');
  assert.equal(checked.ok, false);
  assert.match(String(checked.error), /\S/);
});

test('secretEnv counts are not required variable names', () => {
  const ctx = { seen: new Map(), slugs: new Set(), folders: new Set(), templates: new Set() };
  const row = {
    ...queue[2],
    rank: 92,
    pkg: 'context-docs',
    gh: 'example/context-docs',
    description: 'Docs lookup',
    tier: 'B-needs-secrets',
    secretEnv: '1',
    envVars: 'CONTEXT7_API_KEY',
  };
  const decision = evaluateRow(row, {
    pkgType: 'npm',
    repository: 'https://github.com/example/context-docs',
    dependencies: ['@modelcontextprotocol/sdk'],
    devDependencies: [],
    readme: 'stdio',
    entryExcerpt: 'const server = new McpServer();\n',
    license: 'MIT',
  }, ctx);
  assert.equal(decision.status, 'build');
  assert.deepEqual(decision.secrets, ['MCP_AUTH_TOKEN']);
  assert.deepEqual(decision.upstreamEnv, ['CONTEXT7_API_KEY']);
  assert.deepEqual(upstreamEnv({ envVars: 'PORT MCP_AUTH_TOKEN BRAVE_API_KEY' }), ['BRAVE_API_KEY']);
});

test('local JavaScript check can see the shared server beside node_modules', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'mcp-local-js-'));
  try {
    ensureLocalJsShared(dir);
    const source = readFileSync(path.join(dir, 'mcp-http/app.mjs'), 'utf8');
    assert.match(source, /@modelcontextprotocol\/sdk/);
    assert.equal(readFileSync(path.join(dir, 'mcp-http/wasmer-starter-ui.js'), 'utf8').length > 0, true);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('catalog deploy input points at the template folder', () => {
  const input = autobuildInput({
    folder: 'js-mcp-time-mcp',
    branch: 'ayush/mcp-self-contained',
    appName: 'cat-test-mcp-time-2',
    owner: 'ayushojha',
    token: 'not-a-real-token',
    perishAt: 'PT48H',
  });
  assert.equal(input.repoUrl, 'https://github.com/wasmerio/examples');
  assert.equal(input.rootDir, 'js-mcp-time-mcp');
  assert.equal(input.branch, 'ayush/mcp-self-contained');
  assert.equal(input.perishAt, 'PT48H');
  assert.equal(input.envVars[0].name, 'MCP_AUTH_TOKEN');
  assert.equal(input.envVars[0].sensitive, true);
  assert.equal(input.envVars[0].runtime, true);
  assert.equal(Object.hasOwn(input, 'package'), false);
  const copy = generatedCopy('js/app.mjs', 'export const marker = 1;\n');
  assert.match(copy.text, /^\/\/ Generated from _shared\/mcp-http\/js\/app\.mjs; SHA256 [a-f0-9]{64}\n/);
  assert.match(copy.text, /export const marker = 1/);
});

test('stdio bridge runs the package bin and lockfiles stay untracked', () => {
  assert.equal(binFile({ name: 'repomix', bin: { repomix: './bin/repomix.cjs' } }), 'bin/repomix.cjs');
  assert.equal(binFile({ name: 'chrome-devtools-mcp', bin: { 'chrome-devtools': 'a.js', 'chrome-devtools-mcp': 'b.js' } }), 'b.js');
  assert.equal(binFile({ name: 'plain', main: 'dist/index.js' }), '');
  const rows = decideAll();
  const js = renderTemplate(queue[2], { ...meta['3'], pkgType: 'npm', binFile: 'bin/cli.js' }, rows[2]);
  assert.match(js.files[`${rows[2].folder}/server.mjs`], /bin\/cli\.js/);
  assert.match(js.files[`${rows[2].folder}/.gitignore`], /package-lock\.json/);
  const py = renderTemplate(queue[1], { ...meta['2'], pkgType: 'pypi' }, rows[1]);
  assert.match(py.files[`${rows[1].folder}/main.py`], /import sys/);
  assert.match(py.files[`${rows[1].folder}/.gitignore`], /uv\.lock/);
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

test('launchArgs passes fixed registry arguments and flags ones that need a value', () => {
  assert.deepEqual(launchArgs(null), { args: [], missing: [] });
  assert.deepEqual(launchArgs({ packageArguments: [{ type: 'positional', value: '--mcp', isRequired: true }] }), { args: ['--mcp'], missing: [] });
  assert.deepEqual(launchArgs({ packageArguments: [
    { type: 'positional', value: 'serve' },
    { type: 'named', name: '--transport', default: 'stdio' },
    { type: 'named', name: '--storage-path', value: '${STORAGE}' },
  ] }), { args: ['serve', '--transport', 'stdio'], missing: [] });
  assert.deepEqual(launchArgs({ packageArguments: [{ type: 'named', name: '--root', isRequired: true }] }), { args: [], missing: ['--root'] });
});

test('stdio-bridge passes launch arguments to the child', () => {
  const ctx = { seen: new Map(), slugs: new Set(), folders: new Set(), templates: new Set() };
  const row = queue[2];
  const rowMeta = { ...meta[String(row.rank)], pkgType: row.pkgType, launchArgs: ['--mcp'] };
  const decision = evaluateRow(row, rowMeta, ctx);
  assert.equal(decision.adapter, 'stdio-bridge');
  const server = Object.entries(renderTemplate(row, rowMeta, decision).files).find(([name]) => name.endsWith('/server.mjs'))[1];
  assert.match(server, /args: \[entry, \.\.\.\["--mcp"\]\]/);
});

test('a stdio-bridge row with a required argument it cannot fill needs review', () => {
  const ctx = { seen: new Map(), slugs: new Set(), folders: new Set(), templates: new Set() };
  const row = queue[2];
  const decision = evaluateRow(row, { ...meta[String(row.rank)], pkgType: row.pkgType, launchMissing: ['--root'] }, ctx);
  assert.equal(decision.status, 'needs-review');
  assert.match(decision.reason, /--root/);
});

test('nativeBinary spots per-platform binary packages only', () => {
  assert.match(nativeBinary({ optionalDependencies: { '@vshulcz/deja-vu-linux-amd64': '1.0.0' } }), /deja-vu-linux-amd64/);
  assert.match(nativeBinary({ optionalDependencies: { '@fallow-cli/darwin-x64': '1.0.0' } }), /darwin-x64/);
  assert.equal(nativeBinary({ optionalDependencies: { 'fsevents': '2.3.3', 'linux-tools': '1.0.0' } }), '');
  assert.equal(nativeBinary({}), '');
});

test('a package that wraps a native binary is blocked before deploy', () => {
  const ctx = { seen: new Map(), slugs: new Set(), folders: new Set(), templates: new Set() };
  const row = queue[2];
  const decision = evaluateRow(row, { ...meta[String(row.rank)], pkgType: row.pkgType, nativeBinary: 'optional dependency x-linux-x64' }, ctx);
  assert.equal(decision.status, 'blocked');
  assert.equal(decision.blocker.where, 'edgejs');
  assert.match(decision.reason, /native binary/);
});

test('localError prefers the stdio child output', () => {
  const logs = 'mcp-http stdio-bridge listening\nstdio: Error: ENOENT: no such file ~/.claude\nmcp request failed Error: stdio server exited\n';
  assert.match(localError(logs), /ENOENT/);
  assert.match(localError('Error: boom\n'), /boom/);
});
