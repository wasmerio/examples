import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, rmSync, cpSync, existsSync, readdirSync, statSync, renameSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCsv, templateSlugs, deployAutobuild } from './mcp-batch.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(process.env.HOME || '/tmp', '.cache/wasmer-hugo');
const GAP_QUEUE = '/Users/ayush/Desktop/01 Wasmer/Wasmer Dashboard/template-gap-map/hugo/hugo-queue.csv';
export const CURRENT_HUGO = '0.167.0';
export const GO_VERSION = '1.25.5';
export const NODE_VERSION = '24.16.0';
export const SASS_VERSION = '1.83.4';
export const BASIC_REPO = 'gohugoio/hugoBasicExample';
export const BASIC_SHA = 'c500a6256906e2cd7c4d707370dca721906e94b3';
export const LINE_BUDGET = 1750;
const FINAL = new Set(['shipped', 'blocked', 'rejected-license', 'already-exists']);
const DROP_EXT = new Set(['.mp4', '.webm', '.mov', '.avi', '.mkv', '.mp3', '.wav', '.flac', '.ogg', '.zip', '.gz', '.tgz', '.7z', '.cast']);
const SIZE_SKIP = new Set(['public', 'node_modules', 'resources', '.git']);
export function kebab(value) {
  return String(value || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
export function themeSlugBase(row) {
  const raw = row.themeName || String(row.module || '').split('/').filter(Boolean).pop() || String(row.repo || '').split('/').pop() || 'theme';
  let slug = kebab(raw);
  let previous = '';
  while (slug && slug !== previous) {
    previous = slug;
    slug = slug.replace(/^(hugo-|theme-)/, '').replace(/(-hugo|-theme)$/, '');
  }
  return (slug || 'theme').slice(0, 40).replace(/-$/, '');
}
export function slugFor(row, used) {
  const base = themeSlugBase(row);
  let slug = base;
  if (used.has(slug)) {
    const owner = kebab(String(row.repo || '').split('/')[0] || 'owner') || 'owner';
    slug = `${base}-${owner}`.slice(0, 48).replace(/-$/, '');
    if (used.has(slug)) slug = `${slug}-${row.rank}`.slice(0, 48).replace(/-$/, '');
  }
  used.add(slug);
  return slug;
}
export function themeTitle(row) {
  if (row.themeName && row.themeName.trim()) return row.themeName.trim();
  return themeSlugBase(row).split('-').filter(Boolean).map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
}
export function categoryFor(row) {
  const blob = `${row.themeName || ''} ${row.description || ''} ${row.module || ''} ${row.repo || ''}`.toLowerCase();
  if (/\/hugo-book$/.test(row.module || '') || /(docs|documentation|docsy|wiki|knowledge-base|knowledge base|hextra|doks)/.test(blob)) {
    return 'documentation';
  }
  return 'static';
}
export function catalogName(row) {
  return `${themeTitle(row)} Hugo Theme`.slice(0, 80);
}
export function catalogDescription(row) {
  const kind = categoryFor(row) === 'documentation' ? 'documentation' : 'website';
  const owner = String(row.repo || '').split('/')[0] || 'its author';
  return `${themeTitle(row)} is a Hugo ${kind} theme by ${owner}. This template pins it as a module and serves a small demo.`.slice(0, 160);
}
export function normalizeVersion(value) {
  const match = String(value || '').trim().match(/(\d+\.\d+\.\d+)/);
  return match ? match[1] : '';
}
export function hugoVersionCandidates(row, hints = []) {
  const versions = [];
  const add = (value) => {
    const version = normalizeVersion(value);
    if (version && !versions.includes(version)) versions.push(version);
  };
  add(CURRENT_HUGO);
  add(row.minHugo);
  hints.forEach(add);
  add('0.145.0');
  add('0.127.0');
  add('0.122.0');
  return versions;
}
export function chooseDemo(row, probe = {}) {
  if (String(row.exampleSite) === 'True' && probe.hasExampleDir !== false) return 'exampleSite';
  if (probe.branchSha) return `github.com/${row.repo}@${probe.branchSha}`;
  if (probe.readme) return probe.readme;
  if (probe.repoContent) return `github.com/${row.repo}@${row.commit}`;
  return `hugoBasicExample@${BASIC_SHA}`;
}
export function modulePathFix(errorText) {
  const text = String(errorText || '');
  const declared = text.match(/module declares its path as:\s*(\S+)/);
  const required = text.match(/but was required as:\s*(\S+)/);
  const pseudo = text.match(/v0\.0\.0-\d{14}-[0-9a-f]{12}/);
  if (!declared || !required || !pseudo) return null;
  return { declared: declared[1], required: required[1], version: pseudo[0] };
}
export function applyModulePathFix(goMod, hugoToml, fix) {
  const declared = fix.declared.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let mod = String(goMod || '').trimEnd();
  mod = mod.replace(new RegExp(`\\nrequire ${declared} [^\\n]*`, 'g'), '');
  mod = mod.replace(new RegExp(`\\nreplace ${declared} => [^\\n]*`, 'g'), '');
  mod += `\n\nrequire ${fix.declared} v0.0.0\n\nreplace ${fix.declared} => ${fix.required} ${fix.version}\n`;
  const toml = String(hugoToml || '').replaceAll(`path = "${fix.required}"`, `path = "${fix.declared}"`);
  return { goMod: `${mod}\n`, hugoToml: toml };
}
export function renderRootPointer(folder) {
  return `# Anybuild resolves a subdirectory build from this file at the repository root.\nload("//${folder}:Anybuild", "config")\n`;
}
export function renderAnybuild(info) {
  const goVersion = info.goVersion || GO_VERSION;
  const nodeVersion = info.nodeVersion || NODE_VERSION;
  const hugoVersion = info.hugoVersion || CURRENT_HUGO;
  const minify = info.minify === false ? 'hugo --gc' : 'hugo --gc --minify';
  const useLine = info.npm
    ? `use(dep("hugo", config.hugo_version), dep("go", "${goVersion}"), dep("node", "${nodeVersion}"), dep("npm")),`
    : `use(dep("hugo", config.hugo_version), dep("go", "${goVersion}")),`;
  const install = info.npmLock ? 'npm ci --no-audit --no-fund' : 'npm install --no-audit --no-fund';
  const npmSteps = info.npm
    ? `        run("hugo mod npm pack", group = "install"),\n        run("${install}", group = "install"),\n`
    : '';
  const sassSteps = info.sass
    ? `        run("curl -fsSL -o /tmp/dart-sass.tgz https://github.com/sass/dart-sass/releases/download/${SASS_VERSION}/dart-sass-${SASS_VERSION}-linux-x64.tar.gz && rm -rf /tmp/dart-sass && tar -xzf /tmp/dart-sass.tgz -C /tmp", group = "install"),\n`
    : '';
  const bins = [];
  if (info.npm) bins.push('$PWD/node_modules/.bin');
  if (info.sass) bins.push('/tmp/dart-sass');
  const hugoRun = bins.length
    ? `run('PATH="$PATH:${bins.join(':')}" ${minify}', group = "build"),`
    : `run("${minify}", group = "build"),`;
  const replace = info.moduleReplace && info.moduleReplace.path && info.moduleReplace.version
    ? info.moduleReplace
    : null;
  if (replace && !/^[\w./@+-]+$/.test(`${replace.path}@${replace.version}`)) {
    throw new Error('module replace spec has unexpected characters');
  }
  const replaceStep = replace
    ? `        run("go mod download ${replace.path}@${replace.version}", group = "install"),\n`
    : '';
  const modGetStep = replace ? '' : '        run("hugo mod get", group = "install"),\n';
  const folder = info.folder || 'go-hugo-site';
  return `load("//anybuild:serve.bzl", "build")
load("//anybuild/tools:hugo.bzl", "hugo_config")
load("//anybuild/tools:staticfile.bzl", "staticfile_serve")

config = hugo_config(
    schema = 1,
    hugo_version = "${hugoVersion}",
    static_dir = "public",
    sws_version = "2.38.0",
    port = 8080,
)

temp = mount("temp")
site = mount("static_app")
output = build(
    steps = [
        ${useLine}
        env(
            GOTOOLCHAIN = "local",
            GOPROXY = "https://proxy.golang.org,direct",
            GO111MODULE = "on",
            HUGO_MODULE_PROXY = "https://proxy.golang.org,direct",
            GOMAXPROCS = "1",
        ),
        workdir(temp.path),
        copy(config.app_subdir or ".", ".", ignore = [".git", ".anybuild", ".cache", ".toolchain", "public", "resources", "node_modules"]),
${replaceStep}${modGetStep}${npmSteps}${sassSteps}        ${hugoRun}
        run('cp -R public/. "{}/"'.format(site.path)),
    ],
    mounts = [site],
    static_app = site,
    static_config = None,
)
staticfile_serve(config, output, name = "${folder}", provider = "hugo")
`;
}
export function renderHugoToml(existing, modulePath, title) {
  let text = existing || '';
  text = text.replace(/^\s*baseURL\s*=.*$/gmi, 'baseURL = "/"');
  text = text.replace(/^\s*theme\s*=.*$/gm, '');
  text = text.replace(/^\s*canonifyURLs\s*=.*$/gmi, 'canonifyURLs = false');
  text = text.replace(/^\s*enableGitInfo\s*=.*$/gmi, 'enableGitInfo = false');
  if (!/^\s*baseURL\s*=/mi.test(text)) text = `baseURL = "/"\n${text}`;
  if (!/^\s*canonifyURLs\s*=/mi.test(text)) text += `${text.endsWith('\n') || !text ? '' : '\n'}canonifyURLs = false\n`;
  if (title && !/^\s*title\s*=/m.test(text)) text = `title = ${JSON.stringify(title)}\n${text}`;
  const importPath = modulePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!new RegExp(`path\\s*=\\s*"${importPath}"`).test(text)) {
    const header = /^\s*\[\[?module(\.|\]|\s)/m.test(text) ? '' : '[module]\n';
    text += `\n${header}[[module.imports]]\npath = "${modulePath}"\n`;
  }
  text = redactSecrets(stripParentRefs(text));
  return `${text.replace(/\n{3,}/g, '\n\n').trim()}\n`;
}
const SECRET_PATTERNS = [
  /(?:pk|sk)\.eyJ[^\s"'\\]{20,}/g,
  /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}/g,
  /\bgithub_pat_[A-Za-z0-9_]{22,}/g,
  /\bAKIA[0-9A-Z]{16}\b/g,
  /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}/g,
  /\bxox[baprs]-[A-Za-z0-9-]{10,}/g,
];
export function redactSecrets(text) {
  let next = String(text || '');
  for (const pattern of SECRET_PATTERNS) next = next.replace(pattern, '');
  return next;
}
const REDACT_EXT = new Set(['.toml', '.yaml', '.yml', '.json', '.md', '.html', '.htm', '.css', '.js', '.txt', '.xml', '.svg', '.scss']);
export function redactTree(dest) {
  let changed = 0;
  for (const file of walk(dest, new Set(['public', 'node_modules', 'resources', '.git']))) {
    if (!REDACT_EXT.has(path.extname(file.full).toLowerCase()) || file.size > 1024 * 1024) continue;
    let text = '';
    try { text = readFileSync(file.full, 'utf8'); } catch { continue; }
    const next = redactSecrets(text);
    if (next !== text) {
      writeFileSync(file.full, next);
      changed += 1;
    }
  }
  return changed;
}
export function stripParentRefs(text) {
  return String(text || '').split('\n').filter((line) => !line.includes('../')).join('\n');
}
export function tailwindDenied(text) {
  return /tailwindcss" is not whitelisted|allowAddons = \['tailwindcss'\]/i.test(String(text || ''));
}

export function withTailwindAllowed(toml) {
  if (/\^tailwindcss\$/.test(toml)) return toml.endsWith('\n') ? toml : `${toml}\n`;
  return `${String(toml || '').trim()}\n\n[security]\n  [security.exec]\n    allow = ['^(dart-)?sass$', '^go$', '^git$', '^node$', '^postcss$', '^tailwindcss$']\n`;
}

export function aboutParagraph(row, source) {
  const owner = String(row.repo || '').split('/')[0] || 'the theme author';
  const where = source === 'exampleSite'
    ? "The demo pages come from the theme's exampleSite folder."
    : String(source).startsWith('hugoBasicExample')
      ? "The theme has no example site at this commit, so the demo pages come from Hugo's basic example."
      : "The demo pages come from the theme's published example.";
  return `${themeTitle(row)} is a Hugo theme maintained by ${owner}. This template does not copy the theme source. It imports ${row.module} as a Hugo module pinned to commit ${(row.commit || '').slice(0, 12)}, builds it with Hugo extended, and serves the result on Wasmer Edge. ${where}`;
}

export function renderReadme(row, info) {
  const demo = `https://hugo-${info.slug}.wasmer.app`;
  const owner = String(row.repo || '').split('/')[0] || 'the theme author';
  return `# ${themeTitle(row)}

## Demo

${demo}

## About the theme

${aboutParagraph(row, info.demoContentSource)}

## Customise

Edit \`hugo.toml\` and the files under \`content/\`. Update the theme with \`hugo mod get -u\`. To change copies of the theme files, run \`hugo mod vendor\` and edit the vendored module.

## Run locally

Install Hugo extended ${info.hugoVersion} and Go ${info.goVersion || GO_VERSION}. From this folder:

\`\`\`bash
hugo mod get
hugo server
\`\`\`

## Deploy to Wasmer

This folder is a Wasmer Edge template. Deploy it from the Wasmer template catalog, or with the Wasmer CLI from this directory. The build runs \`hugo mod get\` and then Hugo, and static-web-server serves the published site.

## License and credits

Theme by ${owner}: https://github.com/${row.repo}
License: ${row.license || 'see LICENSE'}
Pinned commit: \`${row.commit}\`
${String(info.demoContentSource).startsWith('hugoBasicExample') ? `Demo content from gohugoio/hugoBasicExample (MIT) at \`${BASIC_SHA}\`.\n` : ''}`;
}

export function renderLicense({ licenseText, row, source }) {
  const lines = [
    (licenseText || `${row.license || 'Unknown'} license.\nThe license file was not found at commit ${row.commit}.`).trim(),
    '',
    'NOTICE',
    '',
    `Theme: ${themeTitle(row)} (${row.module})`,
    `Repository: https://github.com/${row.repo}`,
    `Commit: ${row.commit}`,
    `License: ${row.license || 'see the license text above'}`,
  ];
  if (String(source).startsWith('hugoBasicExample')) {
    lines.push('', 'Demo content marked hugoBasicExample in UPSTREAM.json is from', `gohugoio/hugoBasicExample (MIT) at commit ${BASIC_SHA}.`, 'https://github.com/gohugoio/hugoBasicExample');
  }
  return `${lines.join('\n')}\n`;
}

export const GITIGNORE = `public/
resources/_gen/
node_modules/
.hugo_build.lock
hugo_stats.json
package-lock.json
pnpm-lock.yaml
yarn.lock
`;

export function emptyChecks() {
  return { home: 'not run', assets: 'not run', innerPage: 'not run', baseUrl: 'not run' };
}

export function catalogFor(row, slug) {
  return {
    slug: `hugo-${slug}`,
    name: catalogName(row),
    framework: 'hugo',
    language: 'go',
    category: categoryFor(row),
    description: catalogDescription(row),
    preview: `go-hugo-${slug}/preview.jpg`,
  };
}

export function planRow(row, ctx = {}) {
  const used = ctx.used || new Set();
  const seen = ctx.seen || new Map();
  const licenseOk = ctx.licenseOk || new Set();
  if (String(row.licenseGate || 'ok') === 'check' && !licenseOk.has(row.module)) {
    const slug = slugFor(row, used);
    return baseRecord(row, slug, {
      status: 'needs-review',
      reason: 'licenseGate=check; read LICENSE and README before building',
      demoContentSource: chooseDemo(row, ctx.probe || {}),
    });
  }
  if (seen.has(row.module)) {
    const slug = slugFor(row, used);
    return baseRecord(row, slug, {
      status: `duplicate-of:${seen.get(row.module)}`,
      reason: `module ${row.module} was already processed`,
      demoContentSource: chooseDemo(row, ctx.probe || {}),
    });
  }
  const slug = slugFor(row, used);
  const folder = `go-hugo-${slug}`;
  if ((ctx.slugs && ctx.slugs.has(`hugo-${slug}`)) || (ctx.tracked && ctx.tracked.has(folder))) {
    return baseRecord(row, slug, { status: 'already-exists', reason: 'slug or folder is already present', demoContentSource: chooseDemo(row, ctx.probe || {}) });
  }
  const source = chooseDemo(row, ctx.probe || {});
  return baseRecord(row, slug, {
    status: 'not-run',
    reason: ctx.dryRun ? 'dry-run' : '',
    demoContentSource: source,
    hugoToml: renderHugoToml('', row.module, themeTitle(row)),
    anybuild: renderAnybuild({ folder, npm: String(row.packageJson) === 'True', hugoVersion: CURRENT_HUGO, minify: true }),
  });
}

function baseRecord(row, slug, extra) {
  return {
    rank: row.rank,
    module: row.module,
    repo: row.repo,
    commit: row.commit,
    license: row.license,
    status: extra.status,
    reason: extra.reason || '',
    folder: `go-hugo-${slug}`,
    hugoVersion: extra.hugoVersion || '',
    npm: String(row.packageJson) === 'True',
    demoContentSource: extra.demoContentSource || '',
    folderSizeMb: extra.folderSizeMb || 0,
    buildSeconds: extra.buildSeconds || 0,
    checks: extra.checks || emptyChecks(),
    demo: `https://hugo-${slug}.wasmer.app`,
    createdApp: extra.createdApp || '',
    pr: extra.pr || '',
    catalog: catalogFor(row, slug),
    hugoToml: extra.hugoToml || '',
    anybuild: extra.anybuild || '',
    slug,
  };
}

function isFinal(status) {
  return FINAL.has(status) || String(status).startsWith('duplicate-of:');
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
        const error = new Error(`${cmd} exited ${code}: ${(err || out).slice(-500)}`);
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

function tailText(error) {
  const text = `${error && error.out ? error.out : ''}\n${error && error.err ? error.err : ''}\n${error && error.message ? error.message : error}`;
  return text.trim().split('\n').filter(Boolean).slice(-20).join('\n').slice(-1800);
}

function flag(name, fallback = '') {
  const index = process.argv.indexOf(name);
  if (index === -1 || !process.argv[index + 1]) return fallback;
  return process.argv[index + 1];
}

function walk(dir, skip = SIZE_SKIP, files = []) {
  if (!existsSync(dir)) return files;
  for (const name of readdirSync(dir)) {
    if (skip.has(name) && path.dirname(dir) !== dir) {
    }
    const full = path.join(dir, name);
    let info;
    try { info = statSync(full); } catch { continue; }
    if (info.isDirectory()) {
      if (skip.has(name)) continue;
      walk(full, skip, files);
    } else files.push({ full, size: info.size });
  }
  return files;
}

export function folderMb(dir) {
  const bytes = walk(dir).reduce((sum, file) => sum + file.size, 0);
  return Math.round((bytes / (1024 * 1024)) * 10) / 10;
}

export function checkGenerated(dir) {
  const errors = [];
  const upstreamPath = path.join(dir, 'UPSTREAM.json');
  if (!existsSync(upstreamPath)) return ['missing UPSTREAM.json'];
  const upstream = JSON.parse(readFileSync(upstreamPath, 'utf8'));
  const actual = readFileSync(path.join(dir, 'Anybuild'), 'utf8');
  if (actual !== renderAnybuild(upstream)) errors.push('Anybuild does not match the generator');
  const folder = path.basename(dir);
  const pointer = path.join(path.dirname(dir), `Anybuild.${folder}`);
  if (existsSync(path.join(path.dirname(dir), 'scripts', 'hugo-batch.mjs'))) {
    const pointerText = existsSync(pointer) ? readFileSync(pointer, 'utf8') : '';
    if (pointerText !== renderRootPointer(folder)) errors.push('root Anybuild pointer does not match the generator');
    if (pointerText.includes('../')) errors.push('root Anybuild pointer contains ../');
  }
  for (const name of ['Anybuild', 'hugo.toml', 'go.mod', 'README.md', 'UPSTREAM.json', '.gitignore']) {
    const file = path.join(dir, name);
    if (existsSync(file) && readFileSync(file, 'utf8').includes('../')) errors.push(`${name} contains ../`);
  }
  const mb = folderMb(dir);
  if (mb > 8) errors.push(`folder is ${mb} MB`);
  return errors;
}

function patchConfig(file, modulePath) {
  const yaml = /\.ya?ml$/i.test(file);
  const json = /\.json$/i.test(file);
  let text = readFileSync(file, 'utf8');
  if (json) {
    try {
      const data = JSON.parse(text);
      data.baseURL = '/';
      delete data.theme;
      data.canonifyURLs = false;
      writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    } catch {
    }
    return;
  }
  text = text.replace(/^\s*baseURL\s*[:=].*$/gmi, yaml ? 'baseURL: "/"' : 'baseURL = "/"');
  text = text.replace(/^\s*theme\s*[:=].*$/gmi, '');
  text = text.replace(/^\s*canonifyURLs\s*[:=].*$/gmi, yaml ? 'canonifyURLs: false' : 'canonifyURLs = false');
  text = text.replace(/^\s*enableGitInfo\s*[:=].*$/gmi, yaml ? 'enableGitInfo: false' : 'enableGitInfo = false');
  text = redactSecrets(stripParentRefs(text));
  if (text.includes(modulePath) && file.endsWith('hugo.toml')) return writeFileSync(file, text);
  writeFileSync(file, text);
}

function mergeRootConfig(dest) {
  const dir = path.join(dest, 'config', '_default');
  for (const name of readdirSync(dest)) {
    if (name === 'hugo.toml' || !/^(hugo|config)\.(toml|yaml|yml|json)$/i.test(name)) continue;
    mkdirSync(dir, { recursive: true });
    const target = path.join(dir, name);
    if (!existsSync(target)) renameSync(path.join(dest, name), target);
  }
}

function patchSiteConfig(dest) {
  const files = walk(dest, new Set(['content', 'static', 'assets', 'data', 'i18n', 'public', 'resources', 'node_modules', 'layouts', 'archetypes']));
  for (const file of files) {
    const rel = path.relative(dest, file.full);
    const base = path.basename(file.full);
    const inConfig = rel.startsWith('config/');
    const rootConfig = /^(hugo|config).*\.(toml|yaml|yml|json)$/i.test(base);
    if ((inConfig || rootConfig) && /\.(toml|yaml|yml|json)$/i.test(base)) patchConfig(file.full, 'skip');
  }
}

function trimTree(dest) {
  for (const file of walk(dest, SIZE_SKIP)) {
    const ext = path.extname(file.full).toLowerCase();
    if (DROP_EXT.has(ext)) rmSync(file.full, { force: true });
  }
  if (process.platform === 'darwin') {
    for (const file of walk(dest, SIZE_SKIP)) {
      const ext = path.extname(file.full).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext) && file.size > 80 * 1024) {
        spawnSync('sips', ['-Z', '1600', file.full], { stdio: 'ignore' });
      }
    }
  }
  const pages = walk(dest, SIZE_SKIP).filter((file) => /\/content[^/]*\/.+\.(md|markdown|html)$/i.test(`/${file.full.replaceAll('\\', '/')}`));
  const indexes = pages.filter((file) => path.basename(file.full).startsWith('_index')).sort((a, b) => {
    const score = (file) => /\/(docs|doc|documentation|posts|post|blog)\//i.test(file.full.replaceAll('\\', '/')) ? 0 : 1;
    return score(a) - score(b) || a.size - b.size;
  }).slice(0, 8);
  const leaves = pages.filter((file) => !path.basename(file.full).startsWith('_index'));
  const linked = menuTargets(dest);
  const rank = (file) => {
    const rel = file.full.replaceAll('\\', '/');
    if (linked.has(path.basename(file.full, path.extname(file.full)).toLowerCase())) return 0;
    if (/\/content(?:[._-][^/]+)?\/(posts|post|blog|docs|doc|documentation)\//i.test(rel)) return 1;
    return 2;
  };
  const chosen = leaves.filter((file) => rank(file) < 2).sort((a, b) => rank(a) - rank(b) || a.size - b.size).slice(0, 8);
  const keep = new Set([...indexes, ...chosen].map((file) => file.full));
  pages.forEach((file) => { if (!keep.has(file.full)) rmSync(file.full, { force: true }); });
  for (const file of keep) truncateMarkdown(file, 40);
  const controlNames = new Set(['Anybuild', 'hugo.toml', 'go.mod', 'go.sum', 'README.md', 'LICENSE', 'UPSTREAM.json', '.gitignore']);
  const textExt = new Set(['.cast', '.txt', '.json', '.js', '.css', '.svg', '.xml', '.html']);
  for (const file of walk(dest, SIZE_SKIP)) {
    const base = path.basename(file.full);
    const rel = path.relative(dest, file.full).replaceAll('\\', '/');
    if (controlNames.has(base) || rel.startsWith('content') || rel.startsWith('config/')) continue;
    if (!textExt.has(path.extname(file.full).toLowerCase())) continue;
    let count = 0;
    try { count = readFileSync(file.full, 'utf8').split('\n').length; } catch { continue; }
    if (count > 200) rmSync(file.full, { force: true });
  }
  for (const file of walk(dest, SIZE_SKIP)) {
    const ext = path.extname(file.full).toLowerCase();
    const rel = path.relative(dest, file.full);
    if (file.size > 120 * 1024 && !['.css', '.js', '.svg', '.woff', '.woff2', '.toml', '.yaml', '.yml'].includes(ext)) {
      if (!rel.startsWith('content')) rmSync(file.full, { force: true });
    }
  }
  let guard = 0;
  while (folderMb(dest) > 7 && guard < 40) {
    const bulky = walk(dest, SIZE_SKIP)
      .filter((file) => !/\.(toml|yaml|yml|json|md|markdown|html|css)$/i.test(file.full))
      .sort((a, b) => b.size - a.size)[0];
    if (!bulky) break;
    rmSync(bulky.full, { force: true });
    guard += 1;
  }
}

function menuTargets(dest) {
  const names = new Set();
  for (const file of walk(dest, SIZE_SKIP)) {
    if (!/\.(toml|yaml|yml|json)$/i.test(file.full)) continue;
    const text = readFileSync(file.full, 'utf8');
    for (const match of text.matchAll(/\b(?:url|pageRef|pageref)\s*[:=]\s*["']?([^"'\s#]+)/gi)) {
      const url = match[1].replace(/^\.\//, '').replace(/^\//, '').replace(/\/$/, '');
      if (!url || url.includes('://')) continue;
      names.add(path.basename(url).toLowerCase());
    }
  }
  return names;
}

function truncateMarkdown(file, bodyLines) {
  const text = readFileSync(file, 'utf8');
  if (!text.startsWith('---\n')) {
    const parts = text.split('\n');
    if (parts.length > bodyLines) writeFileSync(file, `${parts.slice(0, bodyLines).join('\n')}\n`);
    return;
  }
  const end = text.indexOf('\n---', 3);
  if (end === -1) return;
  const head = text.slice(0, end + 4);
  const body = text.slice(end + 4).split('\n').slice(0, bodyLines).join('\n');
  writeFileSync(file, `${head}\n${body}\n`);
}

function copyDemo(demoDir, dest) {
  mkdirSync(dest, { recursive: true });
  const example = path.basename(demoDir) === 'exampleSite';
  for (const name of readdirSync(demoDir)) {
    if (name.startsWith('.') || ['themes', 'public', 'resources', 'node_modules', 'exampleSite', 'docs', 'images', 'test', 'tests'].includes(name)) continue;
    if (name === 'layouts' && !example) continue;
    const from = path.join(demoDir, name);
    const info = statSync(from);
    if (info.isDirectory()) {
      if (/^(content|static|assets|data|i18n|archetypes|config)$/.test(name) || /^content[._-]/.test(name) || (example && name === 'layouts')) {
        cpSync(from, path.join(dest, name), { recursive: true, dereference: true });
      }
      continue;
    }
    if (/legacy/i.test(name)) continue;
    if (/^(hugo|config).*\.(toml|yaml|yml|json)$/i.test(name) || /^(package\.json|postcss\.config\.[a-z]+|tailwind\.config\.[a-z]+)$/i.test(name)) {
      cpSync(from, path.join(dest, name));
    }
  }
}

function ensureInnerPage(dest) {
  const pages = walk(dest, SIZE_SKIP).filter((file) => /\/content[^/]*\/.+\.md$/i.test(`/${path.relative(dest, file.full)}`) && !path.basename(file.full).startsWith('_index'));
  if (pages.length) return;
  const dir = path.join(dest, 'content', 'posts');
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'demo-note.md'), `---
title: "Demo note"
date: 2026-01-02
draft: false
---

A short page so this demo has something besides the home page.
`);
}

function applyExtra(dest, extra) {
  if (!extra) return;
  const lines = extra.split('\n').filter((line) => line.trim());
  if (!lines.length || lines.length > 5) return;
  if (lines.some((line) => line.includes('../'))) return;
  writeFileSync(path.join(dest, 'hugo.toml'), `${readFileSync(path.join(dest, 'hugo.toml'), 'utf8').trim()}\n${lines.join('\n')}\n`);
}

const keyLocks = new Map();
function withKey(key, fn) {
  const prev = keyLocks.get(key) || Promise.resolve();
  const next = prev.then(fn, fn);
  keyLocks.set(key, next.then(() => {}, () => {}));
  return next;
}

async function fetchArchive(repo, rev) {
  return withKey(`src:${repo}@${rev}`, async () => {
    const key = `${repo.replace(/[^\w.-]+/g, '_')}@${rev}`;
    const dest = path.join(CACHE, 'src', key);
    if (existsSync(path.join(dest, '.ok'))) return dest;
    rmSync(dest, { recursive: true, force: true });
    mkdirSync(dest, { recursive: true });
    const tarPath = path.join(CACHE, 'tarballs', `${key}.tgz`);
    mkdirSync(path.dirname(tarPath), { recursive: true });
    await run('curl', ['-fsSL', '--retry', '3', '--retry-delay', '2', '-o', tarPath, `https://codeload.github.com/${repo}/tar.gz/${rev}`]);
    await run('tar', ['-xzf', tarPath, '-C', dest, '--strip-components=1']);
    writeFileSync(path.join(dest, '.ok'), rev);
    return dest;
  });
}

async function remoteSha(repo, ref) {
  try {
    const result = await run('git', ['ls-remote', `https://github.com/${repo}.git`, ref]);
    const line = result.out.split('\n').find((item) => item.endsWith(ref) || item.includes(ref));
    return line ? line.split(/\s+/)[0] : '';
  } catch {
    return '';
  }
}

async function resolveDemo(row) {
  if (String(row.exampleSite) === 'True') {
    const tree = await fetchArchive(row.repo, row.commit);
    if (existsSync(path.join(tree, 'exampleSite'))) {
      return { dir: path.join(tree, 'exampleSite'), source: chooseDemo(row, { hasExampleDir: true }) };
    }
  }
  const branchSha = await remoteSha(row.repo, 'refs/heads/exampleSite');
  if (branchSha) {
    const tree = await fetchArchive(row.repo, branchSha);
    const dir = existsSync(path.join(tree, 'exampleSite')) ? path.join(tree, 'exampleSite') : tree;
    return { dir, source: chooseDemo(row, { hasExampleDir: false, branchSha }) };
  }
  let readme = '';
  try {
    const response = await fetch(`https://raw.githubusercontent.com/${row.repo}/${row.commit}/README.md`, { signal: AbortSignal.timeout(20000) });
    if (response.ok) {
      const text = await response.text();
      const match = text.match(/github\.com\/([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)\/tree\/([A-Za-z0-9_.-]+)\/exampleSite/);
      if (match) {
        const sha = await remoteSha(match[1], `refs/heads/${match[2]}`) || match[2];
        const tree = await fetchArchive(match[1], sha);
        const dir = existsSync(path.join(tree, 'exampleSite')) ? path.join(tree, 'exampleSite') : tree;
        readme = `github.com/${match[1]}@${sha}`;
        return { dir, source: readme };
      }
    }
  } catch {
    readme = '';
  }
  try {
    const tree = await fetchArchive(row.repo, row.commit);
    if (readdirSync(tree).some((name) => name === 'content' || /^content[._-]/.test(name))) {
      return { dir: tree, source: chooseDemo(row, { hasExampleDir: false, repoContent: true }) };
    }
  } catch {
  }
  const basic = await fetchArchive(BASIC_REPO, BASIC_SHA);
  return { dir: basic, source: chooseDemo(row, { hasExampleDir: false }) };
}

async function fetchLicense(repo, commit) {
  for (const name of ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'COPYING', 'COPYING.md']) {
    try {
      const response = await fetch(`https://raw.githubusercontent.com/${repo}/${commit}/${name}`, { signal: AbortSignal.timeout(20000) });
      if (response.ok) return response.text();
    } catch {
    }
  }
  return '';
}

async function hugoBinary(version) {
  return withKey(`hugo:${version}`, async () => {
    if (version === CURRENT_HUGO && existsSync('/opt/homebrew/bin/hugo')) return '/opt/homebrew/bin/hugo';
    const dest = path.join(CACHE, 'bin', version, 'hugo');
    if (existsSync(dest)) return dest;
    mkdirSync(path.dirname(dest), { recursive: true });
    const names = [
      `hugo_extended_${version}_darwin-universal.tar.gz`,
      `hugo_extended_${version}_darwin-arm64.tar.gz`,
      `hugo_extended_${version}_macOS-ARM64.tar.gz`,
      `hugo_extended_${version}_macOS-64bit.tar.gz`,
    ];
    for (const name of names) {
      const tarPath = path.join(CACHE, 'bin', `${version}-${name}`);
      try {
        await run('curl', ['-fL', '--retry', '2', '--retry-delay', '1', '-o', tarPath, `https://github.com/gohugoio/hugo/releases/download/v${version}/${name}`]);
        await run('tar', ['-xzf', tarPath, '-C', path.dirname(dest), 'hugo']);
        await run('chmod', ['+x', dest]);
        const versionText = await run(dest, ['version']);
        if (!/extended/i.test(`${versionText.out} ${versionText.err}`)) continue;
        return dest;
      } catch {
      }
    }
    return '';
  });
}

async function ensureSass() {
  const root = path.join(CACHE, 'bin', `dart-sass-${SASS_VERSION}`);
  const bin = path.join(root, 'sass');
  if (existsSync(bin)) return root;
  mkdirSync(root, { recursive: true });
  const name = `dart-sass-${SASS_VERSION}-macos-arm64.tar.gz`;
  const tarPath = path.join(CACHE, 'bin', name);
  try {
    await run('curl', ['-fL', '--retry', '2', '--retry-delay', '1', '-o', tarPath, `https://github.com/sass/dart-sass/releases/download/${SASS_VERSION}/${name}`]);
    await run('tar', ['-xzf', tarPath, '-C', root, '--strip-components=1']);
    await run('chmod', ['+x', bin]);
    return existsSync(bin) ? root : '';
  } catch {
    return '';
  }
}

async function versionHints(row) {
  const found = [];
  for (const file of ['netlify.toml', 'README.md', 'theme.toml']) {
    try {
      const response = await fetch(`https://raw.githubusercontent.com/${row.repo}/${row.commit}/${file}`, { signal: AbortSignal.timeout(20000) });
      if (!response.ok) continue;
      const text = await response.text();
      for (const match of text.matchAll(/(?:HUGO_VERSION|hugo-version|hugo_version|min_version)\s*[:=]?\s*["']?v?(\d+\.\d+\.\d+)/gi)) found.push(match[1]);
    } catch {
    }
  }
  return found;
}

function buildEnv(slug) {
  const cache = path.join(CACHE, 'work', slug);
  mkdirSync(cache, { recursive: true });
  return {
    ...process.env,
    GOPROXY: 'https://proxy.golang.org,direct',
    GO111MODULE: 'on',
    HUGO_MODULE_PROXY: 'https://proxy.golang.org,direct',
    HUGO_CACHEDIR: path.join(cache, 'hugo'),
    GOCACHE: path.join(CACHE, 'go-build'),
    GOMODCACHE: path.join(CACHE, 'gomod'),
    GOTOOLCHAIN: 'local',
  };
}

async function hugoBuild(dir, bin, minify, env) {
  rmSync(path.join(dir, 'public'), { recursive: true, force: true });
  rmSync(path.join(dir, 'resources', '_gen'), { recursive: true, force: true });
  const prefixes = [];
  const localBins = path.join(dir, 'node_modules', '.bin');
  if (existsSync(localBins)) prefixes.push(localBins);
  if (env && env.SASS_BIN_DIR) prefixes.push(env.SASS_BIN_DIR);
  const buildEnv = prefixes.length ? { ...env, PATH: `${prefixes.join(':')}:${env.PATH || ''}` } : env;
  const args = minify ? ['--gc', '--minify'] : ['--gc'];
  try {
    const result = await run(bin, args, { cwd: dir, env: buildEnv });
    return { ok: true, tail: `${result.out}\n${result.err}`.trim() };
  } catch (error) {
    return { ok: false, tail: tailText(error) };
  }
}

export function htmlRefs(html) {
  const refs = [];
  const re = /(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;
  for (const match of String(html).matchAll(re)) refs.push(match[1] || match[2] || match[3] || '');
  return refs.filter(Boolean);
}

function outputOk(dir) {
  const pub = path.join(dir, 'public');
  const homePath = path.join(pub, 'index.html');
  if (!existsSync(homePath)) return { ok: false, reason: 'public/index.html missing' };
  let html = 0;
  let css = 0;
  for (const file of walk(pub, new Set())) {
    if (file.full.endsWith('.html')) html += 1;
    if (file.full.endsWith('.css')) css += 1;
  }
  if (html < 2) return { ok: false, reason: 'no inner html page' };
  if (!css) return { ok: false, reason: 'no css file' };
  const refs = htmlRefs(readFileSync(homePath, 'utf8'));
  if (!refs.some((ref) => /\.css(?:$|\?)/i.test(ref))) return { ok: false, reason: 'home page does not reference a css file' };
  const inner = refs.some((ref) => !/^https?:/i.test(ref) && !ref.startsWith('//') && !ref.startsWith('#') && ref !== '/' && !/\.(css|js|png|jpe?g|gif|svg|webp|ico|xml|json|txt|pdf|woff2?)(?:$|\?)/i.test(ref));
  if (!inner) return { ok: false, reason: 'home page does not link to an inner page' };
  return { ok: true, reason: '' };
}

function writeMeta(dest, row, info) {
  let previous = {};
  try { previous = JSON.parse(readFileSync(path.join(dest, 'UPSTREAM.json'), 'utf8')); } catch { /* first write */ }
  const moduleReplace = info.moduleReplace !== undefined ? info.moduleReplace : previous.moduleReplace;
  const upstream = {
    module: row.module,
    repository: `https://github.com/${row.repo}`,
    commit: row.commit,
    license: row.license,
    hugoVersion: info.hugoVersion,
    demoContentSource: info.demoContentSource,
    npm: info.npm,
    npmLock: false,
    sass: Boolean(info.sass),
    goVersion: GO_VERSION,
    nodeVersion: NODE_VERSION,
    minify: info.minify !== false,
    folder: info.folder,
    slug: info.slug,
  };
  if (moduleReplace && moduleReplace.path && moduleReplace.version) upstream.moduleReplace = moduleReplace;
  writeFileSync(path.join(dest, 'UPSTREAM.json'), `${JSON.stringify(upstream, null, 2)}\n`);
  writeFileSync(path.join(dest, 'Anybuild'), renderAnybuild(upstream));
  writeFileSync(path.join(path.dirname(dest), `Anybuild.${info.folder}`), renderRootPointer(info.folder));
  writeFileSync(path.join(dest, 'README.md'), renderReadme(row, { ...info, hugoVersion: info.hugoVersion || CURRENT_HUGO, goVersion: GO_VERSION }));
  writeFileSync(path.join(dest, '.gitignore'), GITIGNORE);
  return upstream;
}

async function prepareSite(row, info, extra) {
  const dest = path.join(ROOT, info.folder);
  rmSync(dest, { recursive: true, force: true });
  const demo = await resolveDemo(row);
  info.demoContentSource = demo.source;
  copyDemo(demo.dir, dest);
  mergeRootConfig(dest);
  trimTree(dest);
  patchSiteConfig(dest);
  const existing = existsSync(path.join(dest, 'hugo.toml')) ? readFileSync(path.join(dest, 'hugo.toml'), 'utf8') : '';
  writeFileSync(path.join(dest, 'hugo.toml'), renderHugoToml(existing, row.module, themeTitle(row)));
  applyExtra(dest, extra);
  ensureInnerPage(dest);
  const licenseText = await fetchLicense(row.repo, row.commit);
  writeFileSync(path.join(dest, 'LICENSE'), renderLicense({ licenseText, row, source: info.demoContentSource }));
  writeMeta(dest, row, { ...info, hugoVersion: info.hugoVersion || CURRENT_HUGO, demoContentSource: info.demoContentSource });
  const env = buildEnv(info.slug);
  const bin = await hugoBinary(CURRENT_HUGO);
  if (!bin) throw new Error('current Hugo extended binary is missing');
  if (existsSync(path.join(dest, 'go.mod'))) rmSync(path.join(dest, 'go.mod'), { force: true });
  if (existsSync(path.join(dest, 'go.sum'))) rmSync(path.join(dest, 'go.sum'), { force: true });
  await run(bin, ['mod', 'init', `github.com/wasmerio/examples/${info.folder}`], { cwd: dest, env });
  try {
    await run(bin, ['mod', 'get', `${row.module}@${row.commit}`], { cwd: dest, env });
  } catch (error) {
    const fix = modulePathFix(`${error.err || ''}\n${error.out || ''}\n${error.message || ''}`);
    if (!fix) throw error;
    const next = applyModulePathFix(readFileSync(path.join(dest, 'go.mod'), 'utf8'), readFileSync(path.join(dest, 'hugo.toml'), 'utf8'), fix);
    writeFileSync(path.join(dest, 'go.mod'), next.goMod);
    writeFileSync(path.join(dest, 'hugo.toml'), next.hugoToml);
    info.moduleReplace = { path: fix.required, version: fix.version };
    writeMeta(dest, row, { ...info, hugoVersion: info.hugoVersion || CURRENT_HUGO });
    await run('go', ['mod', 'download', `${fix.required}@${fix.version}`], { cwd: dest, env });
  }
  redactTree(dest);
  if (info.npm) {
    try {
      await run(bin, ['mod', 'npm', 'pack'], { cwd: dest, env });
    } catch (error) {
      info.npmNote = tailText(error).split('\n').slice(-2).join(' ');
    }
    if (existsSync(path.join(dest, 'package.json'))) {
      await run('npm', ['install', '--no-audit', '--no-fund'], { cwd: dest, env });
    }
  }
  return { dest, env, bin };
}

export function pinGoMod(text, version) {
  let next = text.replace(/^toolchain\s+.*\n?/gm, '');
  if (/^go\s+\d+\.\d+(?:\.\d+)?/m.test(next)) next = next.replace(/^go\s+\d+\.\d+(?:\.\d+)?\s*$/m, `go ${version}`);
  else next = next.replace(/^(module\s+\S+\s*\n)/, `$1\ngo ${version}\n`);
  return next.replace(/\n{3,}/g, '\n\n');
}

function pinGoModFile(dir, version) {
  const file = path.join(dir, 'go.mod');
  if (!existsSync(file)) return;
  const next = pinGoMod(readFileSync(file, 'utf8'), version);
  writeFileSync(file, next.endsWith('\n') ? next : `${next}\n`);
}

export function withJsonMinifyDisabled(toml) {
  if (/disableJSON\s*=\s*true/.test(toml)) return toml.endsWith('\n') ? toml : `${toml}\n`;
  return `${toml.trim()}\n\n[minify]\ndisableJSON = true\n`;
}

function versionLess(left, right) {
  const a = left.split('.').map(Number);
  const b = right.split('.').map(Number);
  for (let i = 0; i < 3; i += 1) {
    if ((a[i] || 0) < (b[i] || 0)) return true;
    if ((a[i] || 0) > (b[i] || 0)) return false;
  }
  return false;
}

function minifyFailure(text) {
  return /minify|postcss|tailwind|failed to process|expected comma character/i.test(text || '');
}

export function brokenContentFiles(dest, tail) {
  const root = dest.endsWith(path.sep) ? dest : `${dest}${path.sep}`;
  const found = [];
  const add = (file) => {
    const clean = String(file || '').replace(/:\d+:\d+$/, '');
    if (!clean.startsWith(root) || !clean.endsWith('.md') || found.includes(clean)) return;
    found.push(clean);
  };
  const text = String(tail || '');
  for (const match of text.matchAll(/"([^"\n]*\/content(?:[._-][^/"\n]+)?\/[^"\n]*?\.md)(?::\d+:\d+)?"/g)) add(match[1]);
  for (const match of text.matchAll(/(?:^|\s)(\/[^\s'"]*\/content(?:[._-][^/\s'"]+)?\/[^\s'"]*?\.md)(?::\d+:\d+)?/g)) add(match[1]);
  if (found.length) return found;
  const missing = text.match(/no earlier definition of shortcode "([^"]+)"/i);
  if (!missing || !existsSync(dest)) return found;
  const needle = new RegExp(`\\{\\{[<%]\\s*${missing[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
  for (const file of walk(dest)) {
    if (!/\.md$/i.test(file.full) || !file.full.startsWith(path.join(dest, 'content'))) continue;
    let body = '';
    try { body = readFileSync(file.full, 'utf8'); } catch { continue; }
    if (needle.test(body)) add(file.full);
  }
  return found;
}

function dropBrokenContent(dest, tail) {
  let dropped = 0;
  for (const file of brokenContentFiles(dest, tail)) {
    if (!existsSync(file)) continue;
    rmSync(file, { force: true });
    dropped += 1;
  }
  return dropped;
}

async function selectHugo(row, dest, env) {
  const hints = [];
  let fetchedHints = false;
  let floor = '';
  let firstError = '';
  const tried = new Set();
  while (true) {
    const version = hugoVersionCandidates(row, hints).find((item) => !tried.has(item) && !(floor && versionLess(item, floor)));
    if (!version) break;
    tried.add(version);
    const bin = await hugoBinary(version);
    if (!bin) {
      if (!firstError) firstError = `Hugo ${version} extended build is not available for this Mac`;
      continue;
    }
    const attempt = async (minify) => {
      writeMeta(dest, row, {
        folder: path.basename(dest),
        slug: path.basename(dest).replace(/^go-hugo-/, ''),
        hugoVersion: version,
        npm: existsSync(path.join(dest, 'package.json')),
        minify,
        demoContentSource: JSON.parse(readFileSync(path.join(dest, 'UPSTREAM.json'), 'utf8')).demoContentSource,
      });
      const started = Date.now();
      const result = await hugoBuild(dest, bin, minify, env);
      if (!result.ok) return { ok: false, tail: result.tail };
      const check = outputOk(dest);
      if (!check.ok) return { ok: false, tail: `${check.reason}\n${result.tail || ''}`.slice(-1800) };
      return { ok: true, hugoVersion: version, minify, sass: Boolean(env.SASS_BIN_DIR), buildSeconds: Math.round((Date.now() - started) / 1000) };
    };
    let outcome = await attempt(true);
    if (!outcome.ok && /TOCSS-DART|Dart Sass/i.test(outcome.tail || '') && !env.SASS_BIN_DIR) {
      const sassDir = await ensureSass();
      if (sassDir) {
        env.SASS_BIN_DIR = sassDir;
        outcome = await attempt(true);
      }
    }
    if (!outcome.ok && tailwindDenied(outcome.tail || '')) {
      const configPath = path.join(dest, 'hugo.toml');
      const next = withTailwindAllowed(readFileSync(configPath, 'utf8'));
      if (next !== readFileSync(configPath, 'utf8')) {
        writeFileSync(configPath, next);
        outcome = await attempt(true);
      }
    }
    if (!outcome.ok && /expected comma character|failed to process/i.test(outcome.tail)) {
      const configPath = path.join(dest, 'hugo.toml');
      const next = withJsonMinifyDisabled(readFileSync(configPath, 'utf8'));
      if (next !== readFileSync(configPath, 'utf8')) {
        writeFileSync(configPath, next);
        outcome = await attempt(true);
      }
    }
    if (!outcome.ok && /shortcode|failed to render/i.test(outcome.tail || '')) {
      let drops = 0;
      while (!outcome.ok && drops < 8 && dropBrokenContent(dest, outcome.tail)) {
        drops += 1;
        ensureInnerPage(dest);
        outcome = await attempt(true);
      }
    }
    if (!outcome.ok && minifyFailure(outcome.tail)) outcome = await attempt(false);
    if (outcome.ok) {
      pinGoModFile(dest, GO_VERSION);
      return outcome;
    }
    if (!firstError) firstError = `${version}: ${outcome.tail}`;
    const required = String(outcome.tail).match(/(\d+\.\d+\.\d+) or greater is required/);
    if (required) floor = required[1];
    if (!fetchedHints) {
      hints.push(...await versionHints(row));
      fetchedHints = true;
    }
  }
  return { error: firstError || 'no Hugo version produced a site' };
}

function absUrl(base, ref) {
  try { return new URL(ref, base).href; } catch { return ''; }
}

async function liveChecksOnce(demo) {
  const checks = emptyChecks();
  const home = await fetch(demo.endsWith('/') ? demo : `${demo}/`, { redirect: 'follow', signal: AbortSignal.timeout(30000) });
  const html = await home.text();
  checks.home = home.status === 200 ? 'passed' : 'failed';
  checks.detail = `home HTTP ${home.status}`;
  const refs = htmlRefs(html);
  const bad = refs.filter((ref) => /localhost|example\.com|example\.org/i.test(ref));
  checks.baseUrl = bad.length ? 'failed' : 'passed';
  const assets = refs.filter((ref) => /\.(css|js)(?:$|\?)/i.test(ref));
  let assetsOk = checks.home === 'passed' && assets.length > 0;
  for (const ref of assets) {
    const target = absUrl(demo, ref);
    const response = await fetch(target, { redirect: 'follow', signal: AbortSignal.timeout(30000) });
    if (response.status !== 200) assetsOk = false;
  }
  checks.assets = assets.length ? (assetsOk ? 'passed' : 'failed') : 'failed';
  const pages = refs.filter((ref) => !/^https?:/i.test(ref) && !ref.startsWith('//') && !ref.startsWith('#') && ref !== '/' && ref !== '' && !/\.(css|js|png|jpe?g|gif|svg|webp|ico|xml|json|txt|pdf|woff2?)(?:$|\?)/i.test(ref));
  checks.innerPage = 'failed';
  for (const inner of pages.slice(0, 8)) {
    const target = absUrl(demo, inner);
    const response = await fetch(target, { redirect: 'follow', signal: AbortSignal.timeout(30000) });
    if (response.status !== 200) continue;
    const body = await response.text();
    const css = htmlRefs(body).filter((ref) => /\.css(?:$|\?)/i.test(ref));
    if (!css.length) continue;
    let cssOk = true;
    for (const ref of css) {
      const asset = await fetch(absUrl(target, ref), { redirect: 'follow', signal: AbortSignal.timeout(30000) });
      if (asset.status !== 200) cssOk = false;
    }
    if (cssOk) {
      checks.innerPage = 'passed';
      break;
    }
  }
  return checks;
}

async function liveChecks(demo) {
  let last = emptyChecks();
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    last = await liveChecksOnce(demo);
    if (last.home === 'passed') break;
    if (attempt < 4) await sleep(5000);
  }
  const detail = last.detail || '';
  delete last.detail;
  return { checks: last, detail };
}

let gitChain = Promise.resolve();
function withGit(fn) {
  const next = gitChain.then(fn, fn);
  gitChain = next.then(() => {}, () => {});
  return next;
}

async function gitOut(args) {
  return (await run('git', args, { cwd: ROOT })).out.trim();
}

async function assertPublishBranch(branch) {
  const current = await gitOut(['rev-parse', '--abbrev-ref', 'HEAD']);
  if (!current || current === 'HEAD' || current === 'main' || current === 'master') throw new Error(`Refusing to publish from ${current || 'detached HEAD'}`);
  if (branch && current !== branch) throw new Error(`On ${current}, expected ${branch}`);
  return current;
}

async function diffLines(args) {
  let out = '';
  try { out = await gitOut(['diff', '--numstat', ...args]); } catch { return 0; }
  let lines = 0;
  for (const line of out.split('\n')) {
    if (!line.trim()) continue;
    const [added, deleted] = line.split('\t');
    if (added === '-' || deleted === '-') continue;
    lines += Number(added || 0) + Number(deleted || 0);
  }
  return lines;
}

async function takenPackBranches(base) {
  const taken = new Set();
  const addRef = (line) => {
    const name = String(line || '').trim().replace(/^\* /, '').replace(/^refs\/heads\//, '');
    if (name.startsWith(`${base}-p`)) taken.add(name);
  };
  try {
    for (const line of (await gitOut(['ls-remote', '--heads', 'origin', `${base}-p*`])).split('\n')) addRef((line.split('\t')[1] || ''));
  } catch { /* a missing remote list just means the next number is free */ }
  try {
    for (const line of (await gitOut(['branch', '--list', `${base}-p*`])).split('\n')) addRef(line);
  } catch { /* no local pack branches */ }
  return taken;
}

async function takePackBranch(state) {
  const taken = await takenPackBranches(state.base);
  for (let guard = 0; guard < 40; guard += 1) {
    state.pack += 1;
    const name = `${state.base}-p${state.pack}`;
    if (!taken.has(name)) {
      state.branch = name;
      return name;
    }
  }
  throw new Error(`no free pack branch for ${state.base}`);
}

async function publishFolder(folder, message, state) {
  return withGit(async () => {
    const current = await gitOut(['rev-parse', '--abbrev-ref', 'HEAD']);
    if (current !== state.branch) await run('git', ['checkout', state.branch], { cwd: ROOT });
    await assertPublishBranch(state.branch);
    const pointer = `Anybuild.${folder}`;
    if (!existsSync(path.join(ROOT, pointer))) writeFileSync(path.join(ROOT, pointer), renderRootPointer(folder));
    await run('git', ['add', '-A', '--', folder, pointer], { cwd: ROOT });
    const staged = await diffLines(['--cached']);
    const committed = await diffLines(['origin/main...HEAD']);
    const alreadyTracked = Boolean(await gitOut(['ls-tree', '--name-only', 'HEAD', folder]));
    if (!alreadyTracked && committed > 0 && committed + staged > LINE_BUDGET) {
      await run('git', ['reset', '-q', '--', folder, pointer], { cwd: ROOT });
      const pack = await takePackBranch(state);
      await run('git', ['checkout', '-B', pack, 'origin/main'], { cwd: ROOT });
      await assertPublishBranch(pack);
      if (!existsSync(path.join(ROOT, pointer))) writeFileSync(path.join(ROOT, pointer), renderRootPointer(folder));
      await run('git', ['add', '-A', '--', folder, pointer], { cwd: ROOT });
    }
    const names = await gitOut(['diff', '--cached', '--name-only']);
    if (!names) return state.branch;
    await run('git', ['commit', '-m', message], { cwd: ROOT });
    await run('git', ['push', '-u', 'origin', `HEAD:${state.branch}`], { cwd: ROOT });
    return state.branch;
  });
}

async function unpublishFolder(folder, branch, state) {
  await withGit(async () => {
    const returnTo = state && state.branch && state.branch !== branch ? state.branch : '';
    const current = await gitOut(['rev-parse', '--abbrev-ref', 'HEAD']);
    if (current !== branch) await run('git', ['checkout', branch], { cwd: ROOT });
    await assertPublishBranch(branch);
    const pointer = `Anybuild.${folder}`;
    await run('git', ['rm', '-r', '--quiet', '--ignore-unmatch', '--', folder, pointer], { cwd: ROOT });
    rmSync(path.join(ROOT, folder), { recursive: true, force: true });
    rmSync(path.join(ROOT, pointer), { force: true });
    const names = await gitOut(['diff', '--cached', '--name-only']);
    if (names) {
      await run('git', ['commit', '-m', `Remove ${folder}`], { cwd: ROOT });
      await run('git', ['push', '-u', 'origin', `HEAD:${branch}`], { cwd: ROOT });
    }
    if (returnTo) await run('git', ['checkout', returnTo], { cwd: ROOT });
  });
}

async function deleteCreated(created, owner) {
  if (!created) return '';
  try {
    await run('wasmer', ['app', 'delete', '--non-interactive', `${owner}/${created}`]);
    return '';
  } catch (error) {
    return ` (app delete failed: ${tailText(error).split('\n').slice(-1)[0]})`;
  }
}

async function withBackoff(fn) {
  let wait = 4000;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try { return await fn(); } catch (error) {
      const text = String(error && error.message ? error.message : error);
      if (!/429|rate limit|too many/i.test(text) || attempt === 5) throw error;
      console.error(`rate limit, waiting ${wait}ms`);
      await sleep(wait);
      wait *= 2;
    }
  }
  return null;
}

function loadJsonl(file) {
  const map = new Map();
  if (!existsSync(file)) return map;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try {
      const row = JSON.parse(line);
      map.set(row.rank, row);
    } catch {
    }
  }
  return map;
}

function loadSeen(dir) {
  const seen = new Map();
  if (!existsSync(dir)) return seen;
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.jsonl')) continue;
    for (const row of loadJsonl(path.join(dir, name)).values()) {
      if (row.module && isFinal(row.status) && !seen.has(row.module)) seen.set(row.module, row.rank);
    }
  }
  return seen;
}

export function seenForRun(seen, previousRows, retryBlocked) {
  const copy = new Map(seen);
  if (!retryBlocked) return copy;
  for (const row of previousRows) {
    if (row.status === 'blocked' && copy.get(row.module) === row.rank) copy.delete(row.module);
  }
  return copy;
}

function readSet(file) {
  if (!existsSync(file)) return new Set();
  return new Set(readFileSync(file, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean));
}

async function mapPool(items, limit, fn) {
  let cursor = 0;
  const size = Math.max(1, Math.min(limit, items.length || 1));
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      await fn(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: size }, () => worker()));
}

function publicRecord(row) {
  const copy = { ...row };
  delete copy.hugoToml;
  delete copy.anybuild;
  delete copy.slug;
  delete copy.npmNote;
  return copy;
}

export async function autobuildLogTail(buildId) {
  if (!buildId || typeof WebSocket !== 'function') return '';
  const token = readFileSync(path.join(process.env.HOME || '', '.wasmer/wasmer.toml'), 'utf8').match(/^token\s*=\s*"([^"]+)"/m);
  if (!token) return '';
  const ws = new WebSocket('wss://registry.wasmer.io/graphql', ['graphql-transport-ws']);
  const chunks = [];
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => { ws.close(); resolve(); }, 20000);
      ws.addEventListener('open', () => {
        ws.send(JSON.stringify({ type: 'connection_init', payload: { Authorization: `Bearer ${token[1]}` } }));
      });
      ws.addEventListener('message', (event) => {
        let msg = {};
        try { msg = JSON.parse(String(event.data)); } catch { return; }
        if (msg.type === 'connection_ack') {
          ws.send(JSON.stringify({
            id: '1',
            type: 'subscribe',
            payload: {
              query: 'subscription($buildId: String!) { fetchBuildLogs(buildId: $buildId) }',
              variables: { buildId },
            },
          }));
        } else if (msg.type === 'next') {
          const value = msg.payload && msg.payload.data && msg.payload.data.fetchBuildLogs;
          if (value) chunks.push(value);
        } else if (msg.type === 'complete' || msg.type === 'error') {
          clearTimeout(timer);
          ws.close();
          resolve();
        }
      });
      ws.addEventListener('error', () => { clearTimeout(timer); reject(new Error('build log stream failed')); });
    });
  } catch {
    try { ws.close(); } catch { /* the socket is already closed */ }
    return '';
  }
  const text = chunks.join('');
  const interesting = text.split('\n').filter((line) => /ERROR|error:|failed to|exit code|Unable to/i.test(line));
  return (interesting.length ? interesting : text.split('\n')).slice(-20).join('\n').slice(-1500);
}

async function processRow(row, plan, ctx) {
  const info = {
    slug: plan.slug,
    folder: plan.folder,
    npm: plan.npm,
    demoContentSource: plan.demoContentSource,
    hugoVersion: '',
    minify: true,
  };
  const record = publicRecord(plan);
  let published = '';
  let created = '';
  let liveOk = false;
  try {
    console.log(`build ${row.rank} ${info.folder}`);
    const prepared = await prepareSite(row, info, ctx.fixes[row.module] || '');
    record.demoContentSource = info.demoContentSource;
    const selected = await selectHugo(row, prepared.dest, prepared.env);
    if (selected.error) throw new Error(selected.error);
    record.hugoVersion = selected.hugoVersion;
    record.buildSeconds = selected.buildSeconds;
    const npmBuild = info.npm && existsSync(path.join(prepared.dest, 'package.json'));
    writeMeta(prepared.dest, row, { ...info, npm: npmBuild, sass: Boolean(selected.sass), hugoVersion: selected.hugoVersion, minify: selected.minify });
    if (info.npm && !npmBuild) info.npmNote = info.npmNote || 'packageJson was set, but hugo mod npm pack produced no package.json';
    const local = outputOk(prepared.dest);
    if (!local.ok) throw new Error(local.reason);
    record.folderSizeMb = folderMb(prepared.dest);
    if (record.folderSizeMb > 8) throw new Error(`folder is ${record.folderSizeMb} MB`);
    const drift = checkGenerated(prepared.dest);
    if (drift.length) throw new Error(drift.join('; '));
    published = await publishFolder(info.folder, `Add ${info.folder}`, ctx.git);
    record.pr = published;
    let deployed;
    try {
      deployed = await withBackoff(() => deployAutobuild({
        folder: info.folder,
        appName: `hugo-${info.slug}`,
        owner: ctx.owner,
        branch: published,
      }));
    } catch (error) {
      if (error && error.existed === false) created = `hugo-${info.slug}`;
      throw error;
    }
    if (!deployed.existed) {
      created = `hugo-${info.slug}`;
      record.createdApp = created;
    }
    record.demo = deployed.appUrl || record.demo;
    const live = await liveChecks(record.demo);
    record.checks = live.checks;
    const failed = Object.entries(record.checks).filter(([, value]) => value !== 'passed').map(([key]) => key);
    if (failed.length) throw new Error(`live checks failed: ${failed.join(', ')} ${live.detail}`.trim());
    liveOk = true;
    await run(process.execPath, [path.join(ROOT, 'scripts/mcp-preview.mjs'), '--url', record.demo, '--out', path.join(prepared.dest, 'preview.jpg'), '--selector', 'body']);
    const previewPath = path.join(prepared.dest, 'preview.jpg');
    const preview = statSync(previewPath);
    if (preview.size > 120 * 1024) throw new Error(`preview.jpg is ${preview.size} bytes`);
    if (process.platform === 'darwin') {
      const probed = spawnSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', previewPath], { encoding: 'utf8' });
      const text = `${probed.stdout || ''}`;
      if (!/pixelWidth: 1600/.test(text) || !/pixelHeight: 1000/.test(text)) throw new Error(`preview is not 1600x1000`);
    }
    await publishFolder(info.folder, `Add the ${info.folder} preview`, ctx.git);
    record.status = 'shipped';
    record.reason = info.npmNote ? `npm pack note: ${info.npmNote}` : '';
    record.folderSizeMb = folderMb(prepared.dest);
    console.log(`done ${row.rank} shipped ${record.demo}`);
  } catch (error) {
    record.status = 'blocked';
    record.demoContentSource = info.demoContentSource || record.demoContentSource;
    record.reason = tailText(error);
    if (error && error.buildId) {
      const logTail = await autobuildLogTail(error.buildId);
      if (logTail) record.reason = `${record.reason}\n${logTail}`.slice(-1800);
    }
    if (liveOk) {
      record.createdApp = created || record.createdApp;
    } else {
      record.createdApp = '';
      const deleted = await deleteCreated(created, ctx.owner);
      if (deleted) record.reason = `${record.reason}${deleted}`.slice(-1800);
      if (published) {
        try { await unpublishFolder(info.folder, published, ctx.git); } catch (cleanup) {
          record.reason = `${record.reason} (folder cleanup failed: ${tailText(cleanup).split('\n').slice(-1)[0]})`.slice(-1800);
        }
      } else {
        rmSync(path.join(ROOT, info.folder), { recursive: true, force: true });
        rmSync(path.join(ROOT, `Anybuild.${info.folder}`), { force: true });
      }
    }
    console.log(`done ${row.rank} blocked ${info.folder}`);
  }
  ctx.rows.set(row.rank, publicRecord(record));
  await ctx.save();
}

async function listTracked() {
  const out = await gitOut(['ls-tree', '--name-only', 'origin/main']);
  return new Set(out.split('\n').filter(Boolean));
}

function noteShared(rows, file) {
  const groups = new Map();
  for (const row of rows) {
    if (row.status !== 'blocked') continue;
    const reason = row.reason || '';
    let label = '';
    if (/^autobuild /.test(reason) || /deployViaAutobuild/.test(reason)) label = 'anybuild';
    else if (/HTTP 50[234]|edge/i.test(reason) && row.checks && row.checks.home === 'failed' && row.hugoVersion) label = 'edge-platform';
    else if (/wasmer exited|app delete failed/i.test(reason)) label = 'wasmer-cli';
    if (!label) continue;
    const key = `${label}:${reason.split('\n')[0].slice(0, 180)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  const shared = [...groups.entries()].filter(([, items]) => items.length >= 3);
  if (!shared.length) return;
  mkdirSync(path.dirname(file), { recursive: true });
  const blocks = shared.map(([key, items]) => {
    const [label, first] = key.split(/:(.*)/s);
    const sample = items[0];
    return `## ${label}\n\n- Rows: ${items.map((item) => item.rank).join(', ')}\n- Error: ${first}\n- Repro: folder ${sample.folder}, Hugo ${sample.hugoVersion || 'n/a'}, app ${sample.demo}\n`;
  });
  writeFileSync(file, `${blocks.join('\n')}\n`);
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const retryBlocked = process.argv.includes('--retry-blocked');
  const from = Number(flag('--from', '1'));
  const to = Number(flag('--to', '5'));
  const owner = flag('--owner', '');
  const concurrency = Number(flag('--concurrency', '8'));
  const report = path.resolve(ROOT, flag('--report', `reports/hugo/run-${from}-${to}.jsonl`));
  let queuePath = flag('--queue', path.join(ROOT, 'hugo-queue.csv'));
  if (!existsSync(queuePath)) queuePath = GAP_QUEUE;
  if (!dryRun && !owner) throw new Error('Pass --owner');
  const rows = parseCsv(readFileSync(queuePath, 'utf8')).filter((row) => row.rank >= from && row.rank <= to);
  const reportRows = loadJsonl(report);
  const seen = seenForRun(loadSeen(path.dirname(report)), [...reportRows.values()], retryBlocked);
  const licenseOk = readSet(path.join(ROOT, 'reports/hugo/license-ok.txt'));
  const fixes = existsSync(path.join(ROOT, 'reports/hugo/config-fixes.json'))
    ? JSON.parse(readFileSync(path.join(ROOT, 'reports/hugo/config-fixes.json'), 'utf8'))
    : {};
  const slugs = dryRun ? new Set() : await templateSlugs();
  const tracked = dryRun ? new Set() : await listTracked();
  const branch = dryRun ? '' : await gitOut(['rev-parse', '--abbrev-ref', 'HEAD']);
  if (!dryRun) await assertPublishBranch(branch);
  const ctx = {
    dryRun,
    seen,
    used: new Set(),
    slugs,
    tracked,
    licenseOk,
    fixes,
    owner,
    rows: reportRows,
    git: { base: branch, branch, pack: 1 },
    save: async () => {
      const lines = [...ctx.rows.values()].sort((a, b) => a.rank - b.rank).map((row) => JSON.stringify(publicRecord(row)));
      mkdirSync(path.dirname(report), { recursive: true });
      writeFileSync(report, `${lines.join('\n')}\n`);
    },
  };
  const pending = [];
  for (const row of rows) {
    const previous = reportRows.get(row.rank);
    if (previous && isFinal(previous.status) && !(retryBlocked && previous.status === 'blocked')) {
      ctx.seen.set(row.module, row.rank);
      console.log(`skip ${row.rank} ${previous.status}`);
      continue;
    }
    const plan = planRow(row, ctx);
    ctx.seen.set(row.module, row.rank);
    if (plan.status !== 'not-run' || dryRun) {
      ctx.rows.set(row.rank, publicRecord(plan));
      console.log(`done ${row.rank} ${plan.status} ${plan.folder}`);
      continue;
    }
    pending.push({ row, plan });
  }
  await ctx.save();
  if (!dryRun) await mapPool(pending, concurrency, (item) => processRow(item.row, item.plan, ctx));
  noteShared([...ctx.rows.values()], path.join(ROOT, 'reports/hugo/wasmer-bugs.md'));
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
