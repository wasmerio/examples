import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, rmSync, cpSync, mkdtempSync, existsSync, readdirSync, chmodSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const JS_SDK = '1.32.2';
const ZOD = '4.4.3';
const PY_MCP = '1.29.1';
const TERMINAL = new Set([
  'shipped', 'blocked', 'already-exists', 'rejected-provenance', 'rejected-license', 'rejected-unsafe',
]);

const NODE_EXACT = new Set([
  'playwright', 'playwright-core', 'puppeteer', 'puppeteer-core', 'chrome-launcher', 'selenium-webdriver',
  'sharp', 'better-sqlite3', 'sqlite3', 'bcrypt', 'argon2', 'canvas', 'node-pty', 'isolated-vm', 'keytar',
  'robotjs', 'node-gyp-build', '@prisma/client', 'esbuild',
]);
const PY_EXACT = new Set([
  'torch', 'tensorflow', 'jax', 'polars', 'numba', 'llama-cpp-python', 'grpcio', 'playwright', 'selenium',
  'pyautogui', 'pywin32',
]);
const UNSAFE = [
  [/\bfilesystem\b/i, 'filesystem'],
  [/\bshell\b/i, 'shell'],
  [/\bterminal\b/i, 'terminal'],
  [/\bexec\b/i, 'exec'],
  [/code[- ]?run|code execution/i, 'code-run'],
  [/git[- ]local|local git/i, 'git-local'],
  [/\bssh\b/i, 'ssh'],
  [/\bbrowser\b/i, 'browser'],
  [/\bdesktop\b/i, 'desktop'],
  [/applescript/i, 'applescript'],
  [/os[- ]control|os automation/i, 'os-control'],
  [/\bkeyboard\b|\bmouse\b/i, 'keyboard/mouse'],
  [/wallet[- ]sign|sign transactions/i, 'wallet-sign'],
  [/private[- ]key/i, 'private-key'],
];

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (c !== '\r') field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  const header = rows.shift() || [];
  return rows.filter((item) => item.some((value) => value !== '')).map((item) => {
    const record = {};
    header.forEach((key, index) => { record[key] = item[index] || ''; });
    record.rank = Number(record.rank);
    return record;
  });
}

export function normaliseRepo(value) {
  if (!value) return '';
  const text = String(value).trim().replace(/^git\+/, '').replace(/\.git$/, '');
  const match = text.match(/github\.com[:/]([^/]+)\/([^/#?\s]+)/i)
    || text.match(/^([^/\s]+)\/([^/\s]+)$/);
  if (!match) return '';
  return `${match[1]}/${match[2]}`.replace(/\.git$/, '').toLowerCase();
}

function depName(spec) {
  const bare = String(spec).split(';')[0].trim();
  const match = bare.match(/^([A-Za-z0-9_.@/-]+)/);
  return (match ? match[1] : bare).toLowerCase();
}

export function blockedDependency(meta) {
  const runtime = new Set((meta.dependencies || []).map(depName));
  const python = meta.pkgType === 'pypi';
  for (const name of runtime) {
    if (python) {
      if (PY_EXACT.has(name) || name.startsWith('faiss') || name.startsWith('pyobjc')) return name;
      continue;
    }
    if (NODE_EXACT.has(name) || name.startsWith('@playwright/') || name.startsWith('@nut-tree/')) return name;
    if (name.startsWith('@napi-rs/') && !name.endsWith('-wasm32-wasi') && !meta.napiWasm) return name;
  }
  return '';
}

export function unsafeTerms(text) {
  const found = [];
  for (const [pattern, label] of UNSAFE) {
    if (pattern.test(text) && !found.includes(label)) found.push(label);
  }
  return found;
}

export function hasExport(meta) {
  if (meta.importSymbol) return true;
  const text = meta.entryExcerpt || '';
  if (meta.pkgType === 'pypi') return /^(?:app|mcp|server)\s*=\s*(?:FastMCP|Server)\b/m.test(text);
  return /export\s+(?:async\s+)?function\s+createServer\b/.test(text)
    || /export\s+(?:const|class)\s+(?:server|mcp|app|createServer)\b/.test(text)
    || /export\s*\{[^}]*\b(?:server|createServer|mcp)\b/.test(text);
}

export function hasHttp(meta) {
  if (Array.isArray(meta.httpArgs) && meta.httpArgs.length) return true;
  return /streamable-http|--transport[ =]http\b|MCP_TRANSPORT\s*=\s*streamable-http|--mode[ =]streamable-http/i
    .test(`${meta.readme || ''}\n${meta.help || ''}`);
}

export function chooseAdapter(meta) {
  const python = meta.pkgType === 'pypi';
  if (hasExport(meta)) return { adapter: 'in-process' };
  if (hasHttp(meta)) return { adapter: 'native-http' };
  if (!python) return { adapter: 'stdio-bridge' };
  return { adapter: '', blocked: 'python-runtime' };
}

function kebab(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function packageSlug(pkg, used) {
  const parts = pkg.replace(/^@/, '').split('/');
  const base = kebab(parts[parts.length - 1]);
  if (!used.has(base)) return base;
  return kebab(parts.join('-'));
}

function catalogName(title, pkg) {
  const base = String(title || pkg || 'MCP').trim();
  if (/mcp server$/i.test(base)) return base;
  if (/\bmcp$/i.test(base)) return `${base} Server`;
  return `${base} MCP Server`;
}

function secretNames(row) {
  const extra = String(row.secretEnv || '').split(/[,\s]+/).map((item) => item.trim()).filter((item) => item && item !== '0' && item !== 'MCP_AUTH_TOKEN');
  return ['MCP_AUTH_TOKEN', ...extra];
}

function baseReport(row) {
  const tier = String(row.tier || '').startsWith('B') ? 'B' : 'A';
  return {
    rank: row.rank,
    registryName: row.name,
    package: row.pkg,
    version: row.version,
    status: 'not-run',
    folder: '',
    adapter: '',
    tier,
    secrets: secretNames(row),
    tools: [],
    disabledTools: [],
    blocker: null,
    tests: { local: 'not run', edge: 'not run', auth401: 'not run', setup503: 'not run', method405: 'not run', coldStartMs: null, memoryMb: 'not measured' },
    demo: '',
    pr: '',
    catalog: null,
    reason: '',
    createdApp: '',
    waits: [],
  };
}

export function evaluateRow(row, meta, ctx) {
  const report = baseReport(row);
  const repo = normaliseRepo(meta.repository);
  const wanted = normaliseRepo(row.gh);
  if (!repo || repo !== wanted) {
    report.status = 'rejected-provenance';
    report.reason = `package repository ${meta.repository || '(none)'} does not match ${row.gh}`;
    return report;
  }
  const dupKey = `${wanted}|${row.pkg.toLowerCase()}`;
  if (ctx.seen.has(dupKey)) {
    report.status = `duplicate-of:${ctx.seen.get(dupKey)}`;
    report.reason = `same GitHub repo and package as rank ${ctx.seen.get(dupKey)}`;
    return report;
  }
  ctx.seen.set(dupKey, row.rank);
  const slug = packageSlug(row.pkg, ctx.slugs);
  const lang = row.pkgType === 'pypi' ? 'python' : 'javascript';
  const folder = `${lang === 'python' ? 'python' : 'js'}-mcp-${slug}`;
  report.folder = folder;
  if (ctx.folders.has(folder) || ctx.templates.has(`mcp-${slug}`)) {
    report.status = 'already-exists';
    report.reason = ctx.folders.has(folder) ? `folder ${folder} exists` : `template mcp-${slug} exists`;
    return report;
  }
  const blocked = blockedDependency({ ...meta, pkgType: row.pkgType });
  if (blocked) {
    report.status = 'blocked';
    report.blocker = {
      where: row.pkgType === 'pypi' ? 'python-runtime' : 'edgejs',
      what: `dependency ${blocked} is not available on Wasmer Edge`,
      evidence: `dependency ${blocked}`,
    };
    report.reason = report.blocker.what;
    return report;
  }
  const choice = chooseAdapter({ ...meta, pkgType: row.pkgType });
  report.adapter = choice.adapter;
  if (choice.blocked) {
    report.status = 'blocked';
    report.blocker = {
      where: 'python-runtime',
      what: 'Python stdio cannot be bridged on Edge',
      evidence: 'No in-process export or Streamable HTTP flag. asyncio pipes fail on WASIX.',
    };
    report.reason = report.blocker.what;
    return report;
  }
  const unsafe = unsafeTerms(`${row.pkg} ${row.title || ''} ${row.description || ''} ${meta.description || ''} ${(meta.toolNames || []).join(' ')}`);
  if (unsafe.length) {
    report.status = 'needs-review';
    report.reason = `unsafe-purpose: ${unsafe.join(', ')}`;
    return report;
  }
  if (!choice.adapter) {
    report.status = 'needs-review';
    report.reason = 'adapter unknown';
    return report;
  }
  if (choice.adapter === 'in-process' && !meta.importSymbol) {
    report.status = 'needs-review';
    report.reason = 'in-process export seen but the import path is unknown';
    return report;
  }
  if ((row.licenseGate || '') === 'check') {
    report.status = 'needs-review';
    report.reason = 'licenseGate=check';
    return report;
  }
  ctx.slugs.add(slug);
  report.status = 'build';
  report.catalog = {
    slug: `mcp-${slug}`,
    name: catalogName(row.title, row.pkg),
    framework: 'mcp',
    language: lang,
    category: 'developer-tools',
    description: `${row.title || row.pkg} over Streamable HTTP. Callers send a bearer token.`.slice(0, 160),
    preview: `${folder}/preview.jpg`,
  };
  report.reason = choice.adapter;
  return report;
}

function anybuild(folder, lang) {
  if (lang === 'python') {
    return `load("//anybuild/tools:python.bzl", "python_build", "python_config", "python_serve")

config = python_config(
    schema = 1,
    commands = {"start": "python main.py"},
    python_main_file = "main.py",
    python_version = "3.13",
    uv_version = "0.8.15",
)

build = python_build(config)

python_serve(
    config,
    build,
    name = ${JSON.stringify(folder)},
    build_post = [run('sh -c "if [ ! -f mcp_http/__init__.py ] && [ -d ../_shared/mcp-http/python/mcp_http ]; then cp -R ../_shared/mcp-http/python/mcp_http mcp_http; fi"')],
)
`;
  }
  return `load("//anybuild/tools:node.bzl", "node_build", "node_config", "node_serve")

config = node_config(
    schema = 1,
    commands = {"start": "node server.mjs"},
    node_package_manager = "npm",
    node_server = "node",
    node_version = "24",
)

build = node_build(config)

node_serve(
    config,
    build,
    name = ${JSON.stringify(folder)},
    build_post = [run('sh -c "if [ ! -f mcp-http/app.mjs ] && [ -d ../_shared/mcp-http/js ]; then mkdir -p mcp-http && cp -R ../_shared/mcp-http/js/. mcp-http/; fi"')],
)
`;
}

function readme(row, report, meta) {
  const names = report.secrets.map((name) => `\`${name}\``).join(', ');
  const steps = report.secrets.map((name) => (
    name === 'MCP_AUTH_TOKEN'
      ? '1. Add `MCP_AUTH_TOKEN`. Create a value with `openssl rand -hex 32`.'
      : `1. Add \`${name}\` from the upstream service.`
  ));
  const numbered = steps.map((step, index) => step.replace(/^1\./, `${index + 1}.`)).join('\n');
  return `# ${row.title || row.pkg}

## What it does

This template runs \`${row.pkg}\` ${row.version} as a public Streamable HTTP MCP endpoint on Wasmer Edge. Callers must send a bearer token. ${row.description || ''}

## Tools

The landing page lists the tools returned by \`tools/list\` after the app is deployed.

## Setup

Wasmer does not ask for secrets on the deploy-from-template page. After the app exists, open wasmer.io, then this app, then Settings, then Secrets.

${numbered}
${report.secrets.length + 1}. Redeploy the app.

Until ${names} ${report.secrets.length === 1 ? 'is' : 'are'} set, \`/mcp\` returns 503. There is no default token.

## Connect

URL: \`https://<your-app>.wasmer.app/mcp\`

\`\`\`json
{
  "mcpServers": {
    ${JSON.stringify(report.catalog.slug.replace(/^mcp-/, ''))}: {
      "url": "https://<your-app>.wasmer.app/mcp",
      "headers": {"Authorization": "Bearer <MCP_AUTH_TOKEN>"}
    }
  }
}
\`\`\`

\`\`\`bash
claude mcp add --transport http ${report.catalog.slug.replace(/^mcp-/, '')} https://<your-app>.wasmer.app/mcp --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
\`\`\`

Cursor uses the same JSON. ChatGPT connectors use the URL and the same bearer header.

## Limits

Adapter: ${report.adapter}. Disabled tools: none.

## License and source

Upstream: ${meta.repository} version ${row.version}, ${meta.license || row.license}. Integrity: \`${meta.integrity || ''}\`.
`;
}

function pythonBoot() {
  return `import sys
from pathlib import Path

here = Path(__file__).resolve().parent
shared = here.parent / "_shared" / "mcp-http" / "python"
if not (here / "mcp_http" / "__init__.py").exists() and (shared / "mcp_http").is_dir():
    sys.path.insert(0, str(shared))
`;
}

export function renderTemplate(row, meta, report) {
  const lang = row.pkgType === 'pypi' ? 'python' : 'javascript';
  const folder = report.folder;
  const files = {};
  const upstream = {
    registryName: row.name,
    package: row.pkg,
    version: row.version,
    integrity: meta.integrity || '',
    repository: meta.repository,
    commit: meta.commit || null,
    license: meta.license || row.license,
    adapter: report.adapter,
    rank: row.rank,
  };
  files[`${folder}/UPSTREAM.json`] = `${JSON.stringify(upstream, null, 2)}\n`;
  files[`${folder}/LICENSE`] = meta.licenseText || `Upstream license: ${meta.license || row.license}\n${meta.repository}\n`;
  files[`${folder}/README.md`] = readme(row, report, meta);
  files[`${folder}/app.yaml`] = 'kind: wasmer.io/App.v0\npackage: .\ndebug: true\n';
  files[`${folder}/.gitignore`] = lang === 'python'
    ? '.venv/\n__pycache__/\n.anybuild/\n*.pyc\nmcp_http/\n'
    : 'node_modules/\n.anybuild/\nmcp-http/\n';
  const build = anybuild(folder, lang);
  files[`${folder}/Anybuild`] = build;
  files[`Anybuild.${folder}`] = `app_subdir = ${JSON.stringify(folder)}\n\n${build}`;
  if (lang === 'python') {
    files[`${folder}/pyproject.toml`] = `[project]
name = ${JSON.stringify(folder)}
version = "0.1.0"
description = ${JSON.stringify(report.catalog.description)}
readme = "README.md"
requires-python = ">=3.13,<3.14"
dependencies = [
    "mcp[cli]==${PY_MCP}",
    ${JSON.stringify(`${row.pkg}==${row.version}`)},
]
`;
    const common = {
      title: row.title || row.pkg,
      repository: meta.repository,
      license_name: meta.license || row.license,
      package: row.pkg,
      version: row.version,
      required_env: report.secrets,
      summary: report.catalog.description,
      slug: report.catalog.slug.replace(/^mcp-/, ''),
      limits: 'No write tools are switched off.',
    };
    let body;
    if (report.adapter === 'in-process') {
      const register = meta.register ? `${meta.register}()\n` : '';
      body = `${pythonBoot()}
from ${meta.importModule} import ${meta.importSymbol}${meta.register ? `, ${meta.register}` : ''}
from mcp_http import serve

${register}
if __name__ == "__main__":
    serve(
        adapter="in-process",
        mcp_server=${meta.importSymbol},
        title=${JSON.stringify(common.title)},
        repository=${JSON.stringify(common.repository)},
        license_name=${JSON.stringify(common.license_name)},
        package=${JSON.stringify(common.package)},
        version=${JSON.stringify(common.version)},
        required_env=${JSON.stringify(common.required_env)},
        summary=${JSON.stringify(common.summary)},
        slug=${JSON.stringify(common.slug)},
        limits=${JSON.stringify(common.limits)},
    )
`;
    } else {
      const args = ['-m', meta.httpModule || row.pkg.replaceAll('-', '_'), ...(meta.httpArgs || [])];
      body = `${pythonBoot()}
from mcp_http import serve

if __name__ == "__main__":
    serve(
        adapter="native-http",
        command=[sys.executable, ${args.map((item) => JSON.stringify(item)).join(', ')}],
        upstream_port=8765,
        title=${JSON.stringify(common.title)},
        repository=${JSON.stringify(common.repository)},
        license_name=${JSON.stringify(common.license_name)},
        package=${JSON.stringify(common.package)},
        version=${JSON.stringify(common.version)},
        required_env=${JSON.stringify(common.required_env)},
        summary=${JSON.stringify(common.summary)},
        slug=${JSON.stringify(common.slug)},
        limits=${JSON.stringify(common.limits)},
    )
`;
    }
    files[`${folder}/main.py`] = body;
  } else {
    files[`${folder}/package.json`] = `${JSON.stringify({
      name: folder,
      version: '0.1.0',
      private: true,
      type: 'module',
      scripts: { start: 'node server.mjs' },
      dependencies: {
        '@modelcontextprotocol/sdk': JS_SDK,
        zod: ZOD,
        [row.pkg]: row.version,
      },
    }, null, 2)}\n`;
    const boot = `import { existsSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const local = path.join(here, 'mcp-http', 'app.mjs');
const shared = path.join(here, '..', '_shared', 'mcp-http', 'js', 'app.mjs');
const { startMcpHttp } = await import(pathToFileURL(existsSync(local) ? local : shared).href);
`;
    const fields = {
      title: row.title || row.pkg,
      repository: meta.repository,
      license: meta.license || row.license,
      packageName: row.pkg,
      version: row.version,
      requiredEnv: report.secrets,
      summary: report.catalog.description,
      slug: report.catalog.slug.replace(/^mcp-/, ''),
      limits: 'No write tools are switched off.',
      adapter: report.adapter,
    };
    if (report.adapter === 'stdio-bridge') {
      files[`${folder}/server.mjs`] = `${boot}
const entry = path.join(here, 'node_modules', ${JSON.stringify(row.pkg)}, ${JSON.stringify(meta.entryFile || 'dist/index.js')});
startMcpHttp({
  ...${JSON.stringify(fields, null, 2)},
  command: process.execPath,
  args: [entry],
});
`;
    } else if (report.adapter === 'in-process') {
      files[`${folder}/server.mjs`] = `${boot}
import { ${meta.importName || 'createServer'} } from ${JSON.stringify(meta.importPath)};
startMcpHttp({
  ...${JSON.stringify(fields, null, 2)},
  createServer: () => ${meta.importName || 'createServer'}(),
});
`;
    } else {
      files[`${folder}/server.mjs`] = `${boot}
startMcpHttp({
  ...${JSON.stringify(fields, null, 2)},
  command: process.execPath,
  args: ${JSON.stringify(['node_modules/' + row.pkg, ...(meta.httpArgs || [])])},
  upstreamPort: 8765,
});
`;
    }
  }
  return { folder, files };
}

function arg(name, fallback = '') {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] || fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function readJsonl(file) {
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
}

function writeJsonl(file, rows) {
  mkdirSync(path.dirname(file), { recursive: true });
  const text = rows.map((row) => JSON.stringify(row)).join('\n');
  writeFileSync(file, text ? `${text}\n` : '');
}

function isTerminal(status) {
  return TERMINAL.has(status) || String(status).startsWith('duplicate-of:') || String(status).startsWith('rejected-');
}

function repoFolders() {
  return new Set(readdirSync(ROOT).filter((name) => existsSync(path.join(ROOT, name, 'app.yaml')) || existsSync(path.join(ROOT, name, 'Anybuild'))));
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: opts.cwd, env: opts.env || process.env });
    let out = '';
    let err = '';
    child.stdout.on('data', (chunk) => { out += chunk; });
    child.stderr.on('data', (chunk) => { err += chunk; });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve({ out, err });
      else {
        const error = new Error(`${cmd} exited ${code}: ${err.slice(-400)}`);
        error.out = out;
        error.err = err;
        reject(error);
      }
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withBackoff(row, fn) {
  let wait = 2000;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      const text = String(error && error.message ? error.message : error);
      if (!/429|rate limit|too many/i.test(text) || attempt === 4) throw error;
      row.waits.push({ attempt, waitMs: wait });
      await sleep(wait);
      wait *= 2;
    }
  }
  return null;
}

function stageFolder(folder) {
  const dest = mkdtempSync(path.join(tmpdir(), 'mcp-stage-'));
  cpSync(path.join(ROOT, folder), dest, {
    recursive: true,
    filter: (src) => !['node_modules', '.venv', '__pycache__', '.anybuild', 'mcp-http', 'mcp_http'].includes(path.basename(src)),
  });
  const python = existsSync(path.join(dest, 'main.py'));
  if (python) cpSync(path.join(ROOT, '_shared/mcp-http/python/mcp_http'), path.join(dest, 'mcp_http'), { recursive: true });
  else {
    mkdirSync(path.join(dest, 'mcp-http'), { recursive: true });
    cpSync(path.join(ROOT, '_shared/mcp-http/js/app.mjs'), path.join(dest, 'mcp-http/app.mjs'));
    cpSync(path.join(ROOT, '_shared/mcp-http/js/wasmer-starter-ui.js'), path.join(dest, 'mcp-http/wasmer-starter-ui.js'));
  }
  return dest;
}

async function publishToken(owner, appName, pkgHash, token) {
  const file = path.join(tmpdir(), `mcp-env-${appName}.yaml`);
  const yaml = `kind: wasmer.io/App.v0
name: ${appName}
owner: ${owner}
package: ${pkgHash}
debug: true
env:
  MCP_AUTH_TOKEN: ${JSON.stringify(token)}
`;
  writeFileSync(file, yaml, { mode: 0o600 });
  chmodSync(file, 0o600);
  try {
    await run('wasmer', ['deploy', '--path', file, '--non-interactive', '--no-persist-id', '--owner', owner, '--app-name', appName]);
  } finally {
    rmSync(file, { force: true });
  }
}

export function minimalArgs(schema) {
  const out = {};
  const props = (schema && schema.properties) || {};
  const required = (schema && schema.required) || [];
  for (const key of required) {
    const prop = props[key] || {};
    if (prop.default !== undefined) continue;
    const type = Array.isArray(prop.type) ? prop.type.find((item) => item !== 'null') : prop.type;
    if (prop.enum && prop.enum.length) out[key] = prop.enum[0];
    else if (/zone|time/i.test(key)) out[key] = 'UTC';
    else if (/city|location|query|name/i.test(key)) out[key] = 'London';
    else if (type === 'number' || type === 'integer') out[key] = 0;
    else if (type === 'boolean') out[key] = false;
    else if (type === 'array') out[key] = [];
    else if (type === 'object') out[key] = {};
    else out[key] = 'test';
  }
  return out;
}

export function readOnlyTool(schemas) {
  return (schemas || []).find((tool) => /get|list|search|read|fetch|time|info|describe/i.test(`${tool.name} ${tool.description || ''}`)) || null;
}

export async function templateSlugs() {
  const found = new Set();
  let cursor = null;
  for (let page = 0; page < 40; page += 1) {
    const response = await fetch('https://registry.wasmer.io/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        query: 'query($cursor: String) { getAppTemplates(first: 100, after: $cursor) { pageInfo { hasNextPage endCursor } edges { node { slug } } } }',
        variables: { cursor },
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (response.status === 429) throw new Error('429 getAppTemplates');
    if (!response.ok) throw new Error(`${response.status} getAppTemplates`);
    const body = await response.json();
    if (body.errors) throw new Error(body.errors.map((item) => item.message).join('; '));
    const connection = body.data && body.data.getAppTemplates;
    if (!connection) throw new Error('getAppTemplates returned no data');
    for (const edge of connection.edges || []) {
      if (edge.node && edge.node.slug) found.add(edge.node.slug);
    }
    if (!connection.pageInfo || !connection.pageInfo.hasNextPage) break;
    cursor = connection.pageInfo.endCursor;
  }
  return found;
}

const REPO_URL = 'https://github.com/wasmerio/examples';
const REGISTRY = 'https://registry.wasmer.io/graphql';

export function autobuildInput({ folder, branch, appName, owner, token, perishAt, envVars, repoUrl }) {
  const input = {
    repoUrl: repoUrl || REPO_URL,
    rootDir: folder,
    branch,
    appName,
    owner,
    allowExistingApp: true,
    waitForScreenshotGeneration: false,
  };
  if (Array.isArray(envVars)) input.envVars = envVars;
  else if (token) input.envVars = [{ name: 'MCP_AUTH_TOKEN', value: token, sensitive: true, runtime: true }];
  if (perishAt) input.perishAt = perishAt;
  return input;
}

function registryToken() {
  const text = readFileSync(path.join(process.env.HOME || '', '.wasmer/wasmer.toml'), 'utf8');
  const match = text.match(/^token\s*=\s*"([^"]+)"/m) || text.match(/^token\s*=\s*'([^']+)'/m);
  if (!match) throw new Error('Wasmer registry token is missing');
  return match[1];
}

async function registryGraphql(query, variables) {
  const response = await fetch(REGISTRY, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${registryToken()}`,
    },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(60000),
  });
  const body = await response.json();
  if (!response.ok || body.errors) {
    const message = body.errors ? body.errors.map((item) => item.message).join('; ') : `registry HTTP ${response.status}`;
    throw new Error(message);
  }
  return body.data;
}

async function currentBranch() {
  const branch = (await run('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: ROOT })).out.trim();
  if (!branch || branch === 'HEAD' || branch === 'main' || branch === 'master') {
    throw new Error(`Refusing to publish from ${branch || 'detached HEAD'}`);
  }
  return branch;
}

export async function deployAutobuild({ folder, appName, owner, token, perishAt, branch, envVars, attempts }) {
  const input = autobuildInput({
    folder,
    branch: branch || await currentBranch(),
    appName,
    owner,
    token,
    perishAt,
    envVars,
  });
  let existed = true;
  try {
    const found = await registryGraphql(
      'query($name: String!, $owner: String!) { getDeployApp(name: $name, owner: $owner) { name } }',
      { name: appName, owner },
    );
    existed = Boolean(found.getDeployApp);
  } catch (error) {
    const text = String(error && error.message ? error.message : error);
    existed = !/not found|does not exist|no such/i.test(text);
  }
  const started = await registryGraphql(
    'mutation($input: DeployViaAutobuildInput!) { deployViaAutobuild(input: $input) { success buildId } }',
    { input },
  );
  const buildId = started.deployViaAutobuild && started.deployViaAutobuild.buildId;
  if (!buildId) throw new Error('deployViaAutobuild did not return a build id');
  const terminal = new Set(['SUCCESS', 'FAILED', 'CANCELLED', 'INTERNAL_ERROR', 'TIMEOUT']);
  const limit = attempts || 120;
  let status = 'QUEUED';
  let appUrl = '';
  for (let attempt = 0; attempt < limit; attempt += 1) {
    const polled = await registryGraphql(
      'query($id: UUID!) { autobuildDeploymentStatus(buildId: $id) { status appVersion { url app { url name } } } }',
      { id: buildId },
    );
    const row = polled.autobuildDeploymentStatus;
    status = row.status;
    appUrl = (row.appVersion && (row.appVersion.url || (row.appVersion.app && row.appVersion.app.url))) || '';
    if (terminal.has(status)) break;
    await sleep(10000);
  }
  if (status !== 'SUCCESS') {
    const error = new Error(`autobuild ${buildId} ${status}`);
    error.existed = existed;
    error.buildId = buildId;
    throw error;
  }
  return { buildId, existed, appUrl: appUrl || `https://${appName}.wasmer.app` };
}

async function fetchJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (response.status === 429) throw new Error(`429 ${url}`);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

function entryFromPackage(body) {
  const exp = body.exports && (body.exports['.'] || body.exports);
  const value = typeof exp === 'string' ? exp : exp && (exp.import || exp.default || exp.require);
  const file = typeof value === 'string' ? value : body.main;
  return typeof file === 'string' ? file.replace(/^\.\//, '') : 'dist/index.js';
}

export async function fetchMetadata(row) {
  if (row.pkgType === 'npm') {
    const spec = row.pkg.startsWith('@') ? row.pkg.replace('/', '%2f') : row.pkg;
    const body = await fetchJson(`https://registry.npmjs.org/${spec}/${row.version}`);
    const repository = typeof body.repository === 'string' ? body.repository : (body.repository && body.repository.url) || '';
    const meta = {
      repository,
      license: typeof body.license === 'string' ? body.license : '',
      integrity: (body.dist && body.dist.integrity) || '',
      dependencies: Object.keys({ ...(body.dependencies || {}), ...(body.optionalDependencies || {}), ...(body.peerDependencies || {}) }),
      devDependencies: Object.keys(body.devDependencies || {}),
      description: body.description || '',
      readme: body.readme || '',
      entryFile: entryFromPackage(body),
      entryExcerpt: '',
    };
    try {
      const fileUrl = `https://cdn.jsdelivr.net/npm/${row.pkg}@${row.version}/${meta.entryFile}`;
      const response = await fetch(fileUrl, { signal: AbortSignal.timeout(15000) });
      if (response.ok) meta.entryExcerpt = (await response.text()).slice(0, 80000);
    } catch {
      meta.entryExcerpt = '';
    }
    return meta;
  }
  const body = await fetchJson(`https://pypi.org/pypi/${row.pkg}/${row.version}/json`);
  const info = body.info || {};
  const urls = info.project_urls || {};
  const repository = urls.Source || urls.Repository || urls.Homepage || urls['Source Code'] || '';
  const files = body.urls || [];
  const wheel = files.find((item) => String(item.packagetype) === 'bdist_wheel' && String(item.filename).includes('py3-none-any'))
    || files.find((item) => String(item.packagetype) === 'bdist_wheel')
    || files.find((item) => String(item.packagetype) === 'sdist');
  return {
    repository,
    license: typeof info.license === 'string' ? info.license.split('\n')[0] : '',
    integrity: wheel && wheel.digests ? `sha256:${wheel.digests.sha256}` : '',
    dependencies: (info.requires_dist || []).map((item) => String(item).split(' ')[0]),
    devDependencies: [],
    description: info.summary || '',
    readme: info.description || '',
    entryExcerpt: '',
    httpModule: row.pkg.replaceAll('-', '_'),
  };
}

async function probeHttp(url, options = {}) {
  const headers = { accept: 'application/json, text/event-stream' };
  if (options.token) headers.authorization = `Bearer ${options.token}`;
  if (options.body) headers['content-type'] = 'application/json';
  const started = Date.now();
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body,
    signal: AbortSignal.timeout(180000),
  });
  const text = await response.text();
  return {
    status: response.status,
    ms: Date.now() - started,
    text: text.slice(0, 400),
    pkg: response.headers.get('x-edge-instance-package-source') || '',
    age: response.headers.get('x-edge-instance-age-seconds') || '',
  };
}

async function deployBuilt(row, report, owner, token) {
  const appName = report.catalog.slug;
  const stage = stageFolder(report.folder);
  try {
    let existed = true;
    try {
      await run('wasmer', ['app', 'get', `${owner}/${appName}`, '-f', 'json']);
    } catch {
      existed = false;
    }
    const env = { ...process.env };
    delete env.MCP_AUTH_TOKEN;
    await withBackoff(report, () => run('wasmer', [
      'deploy', '--build-remote', '--dir', stage, '--non-interactive', '--no-persist-id', '--owner', owner, '--app-name', appName,
    ], { env }));
    if (!existed) report.createdApp = `${owner}/${appName}`;
    const bare = await probeHttp(`https://${appName}.wasmer.app/mcp`, {
      method: 'POST',
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'batch', version: '0' } } }),
    });
    report.tests.setup503 = bare.status === 503 ? 'passed' : `failed:${bare.status}`;
    if (!bare.pkg) throw new Error('deploy did not return a package hash');
    await publishToken(owner, appName, bare.pkg, token);
    report.demo = `https://${appName}.wasmer.app`;
    const denied = await probeHttp(`${report.demo}/mcp`, {
      method: 'POST',
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'batch', version: '0' } } }),
    });
    report.tests.auth401 = denied.status === 401 ? 'passed' : `failed:${denied.status}`;
    const method = await probeHttp(`${report.demo}/mcp`, { token });
    report.tests.method405 = method.status === 405 ? 'passed' : `failed:${method.status}`;
    const check = await run(process.execPath, [
      path.join(ROOT, 'scripts/mcp-template-check.mjs'),
      '--url', `${report.demo}/mcp`,
      '--token', token,
    ]);
    const listed = JSON.parse(check.out);
    report.tools = listed.tools || [];
    report.tests.edge = listed.ok ? 'passed' : 'failed';
    if (report.tier === 'A') {
      const tool = readOnlyTool(listed.toolSchemas || []);
      if (tool) {
        const args = minimalArgs(tool.schema);
        const called = await run(process.execPath, [
          path.join(ROOT, 'scripts/mcp-template-check.mjs'),
          '--url', `${report.demo}/mcp`,
          '--token', token,
          '--tool', tool.name,
          '--args', JSON.stringify(args),
        ]);
        const result = JSON.parse(called.out);
        report.tests.edge = result.ok ? 'passed' : 'failed';
        if (!result.ok) report.reason = result.error || 'tool call failed';
      }
    }
    await run(process.execPath, [
      path.join(ROOT, 'scripts/mcp-preview.mjs'),
      '--url', `${report.demo}/`,
      '--out', path.join(ROOT, report.folder, 'preview.jpg'),
    ]);
    report.status = report.tests.edge === 'passed' && report.tests.auth401 === 'passed' ? 'shipped' : 'failed';
  } finally {
    rmSync(stage, { recursive: true, force: true });
  }
}

async function main() {
  const from = Number(arg('--from', '1'));
  const to = Number(arg('--to', '1'));
  const queuePath = arg('--queue');
  const owner = arg('--owner');
  const fixtures = arg('--fixtures');
  const dryRun = hasFlag('--dry-run') || Boolean(fixtures);
  const concurrency = Number(arg('--concurrency', '4'));
  if (!queuePath) {
    console.error('Pass --queue, --from, --to, and --owner');
    process.exit(1);
  }
  const rows = parseCsv(readFileSync(queuePath, 'utf8')).filter((row) => row.rank >= from && row.rank <= to);
  const metaByRank = fixtures ? JSON.parse(readFileSync(path.join(fixtures, 'meta.json'), 'utf8')) : null;
  const reportPath = arg('--report', path.join(ROOT, 'reports/mcp', `run-${from}-${to}.jsonl`));
  const prior = dryRun ? [] : readJsonl(reportPath);
  const byRank = new Map(prior.map((row) => [row.rank, row]));
  const ctx = { seen: new Map(), slugs: new Set(), folders: fixtures ? new Set() : repoFolders(), templates: new Set() };
  if (!fixtures) {
    try {
      ctx.templates = await templateSlugs();
    } catch (error) {
      console.error(`getAppTemplates skipped: ${error.message || error}`);
    }
  }
  const decided = [];
  for (const row of rows) {
    const saved = byRank.get(row.rank);
    if (saved && isTerminal(saved.status)) {
      ctx.seen.set(`${normaliseRepo(row.gh)}|${row.pkg.toLowerCase()}`, row.rank);
      if (saved.catalog && saved.catalog.slug) ctx.slugs.add(saved.catalog.slug.replace(/^mcp-/, ''));
      decided.push(saved);
      continue;
    }
    let meta = metaByRank ? (metaByRank[String(row.rank)] || {}) : null;
    const waits = [];
    if (!meta) {
      const bucket = { waits };
      try {
        meta = await withBackoff(bucket, () => fetchMetadata(row));
      } catch (error) {
        const failed = baseReport(row);
        failed.waits = waits;
        failed.status = 'failed';
        failed.reason = String(error.message || error).slice(0, 300);
        failed.blocker = { where: 'upstream', what: 'metadata fetch failed', evidence: failed.reason };
        decided.push(failed);
        continue;
      }
    }
    const evaluated = evaluateRow(row, { ...meta, pkgType: row.pkgType }, ctx);
    evaluated.waits = waits;
    evaluated.meta = meta;
    decided.push(evaluated);
  }
  if (dryRun) {
    for (const row of decided) {
      const copy = { ...row };
      delete copy.meta;
      process.stdout.write(`${JSON.stringify(copy)}\n`);
    }
    return;
  }
  if (!owner) {
    console.error('Pass --owner for a real run');
    process.exit(1);
  }
  const token = readFileSync(process.env.MCP_TOKEN_FILE || '/tmp/mcp-pilot-token', 'utf8').trim();
  const pending = decided.filter((row) => row.status === 'build');
  let cursor = 0;
  let writing = Promise.resolve();
  const save = () => {
    writing = writing.then(() => writeJsonl(reportPath, decided.map((item) => {
      const copy = { ...item };
      delete copy.meta;
      return copy;
    })));
    return writing;
  };
  async function worker() {
    while (cursor < pending.length) {
      const index = cursor;
      cursor += 1;
      const report = pending[index];
      const row = rows.find((item) => item.rank === report.rank);
      const meta = report.meta;
      delete report.meta;
      try {
        const rendered = renderTemplate(row, meta, report);
        for (const [file, content] of Object.entries(rendered.files)) {
          const dest = path.join(ROOT, file);
          mkdirSync(path.dirname(dest), { recursive: true });
          writeFileSync(dest, content);
        }
        report.tests.local = 'not run';
        await deployBuilt(row, report, owner, token);
      } catch (error) {
        report.status = 'failed';
        report.reason = String(error.message || error).slice(0, 400);
        if (report.createdApp) {
          try {
            await run('wasmer', ['app', 'delete', '--non-interactive', report.createdApp]);
            report.createdApp = '';
          } catch {
            report.reason += ' (app delete failed)';
          }
        }
      }
      await save();
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, pending.length || 1) }, () => worker()));
  const shipped = decided.filter((row) => row.status === 'shipped' && row.tests.coldStartMs == null);
  if (shipped.length) {
    await sleep(6 * 60 * 1000);
    for (const report of shipped) {
      const hit = await probeHttp(`${report.demo}/mcp`, {
        token,
        method: 'POST',
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'cold', version: '0' } } }),
      });
      report.tests.coldStartMs = hit.status === 200 ? hit.ms : null;
      if (hit.status !== 200) report.reason = `cold start HTTP ${hit.status}`;
    }
  }
  writeJsonl(reportPath, decided.map((item) => {
    const copy = { ...item };
    delete copy.meta;
    return copy;
  }));
}

const entry = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (entry) {
  main().catch((error) => {
    console.error(error && error.message ? error.message : error);
    process.exit(1);
  });
}
