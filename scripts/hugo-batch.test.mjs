import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { autobuildInput } from './mcp-batch.mjs';
import {
  BASIC_SHA, slugFor, planRow, chooseDemo, renderAnybuild, renderRootPointer, renderLicense, renderReadme, renderHugoToml,
  checkGenerated, hugoVersionCandidates, categoryFor, catalogDescription, withJsonMinifyDisabled, pinGoMod, htmlRefs, brokenContentFiles, seenForRun, modulePathFix, applyModulePathFix, stripParentRefs, withTailwindAllowed, tailwindDenied, redactSecrets, SASS_VERSION,
} from './hugo-batch.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function row(extra) {
  return {
    rank: 1,
    module: 'github.com/alex-shpak/hugo-book',
    host: 'github.com',
    repo: 'alex-shpak/hugo-book',
    subdir: '',
    official: 'True',
    stars: '4108',
    license: 'MIT',
    licenseGate: 'ok',
    pushedAt: '2026-11-09',
    branch: 'main',
    commit: '7875ae6727c38350ff330d66cb5ee2f70e6cfc54',
    exampleSite: 'True',
    minHugo: '0.158.0',
    packageJson: 'False',
    goMod: 'True',
    themeName: 'Book',
    demo: 'https://book.alxs.dev',
    description: 'Hugo documentation theme as simple as plain book',
    ...extra,
  };
}

test('module import keeps the theme pinned in hugo.toml', () => {
  const plan = planRow(row(), { used: new Set(), seen: new Map() });
  assert.equal(plan.status, 'not-run');
  assert.equal(plan.folder, 'go-hugo-book');
  assert.match(plan.hugoToml, /baseURL = "\/"/);
  assert.match(plan.hugoToml, /path = "github.com\/alex-shpak\/hugo-book"/);
  const mentioned = renderHugoToml('BookRepo = "https://github.com/alex-shpak/hugo-book/"\ntheme = "hugo-book"\nenableGitInfo = true\n', 'github.com/alex-shpak/hugo-book', 'Book');
  assert.match(mentioned, /path = "github.com\/alex-shpak\/hugo-book"/);
  const merged = renderHugoToml('[module.hugoVersion]\nextended = true\n', 'github.com/alex-shpak/hugo-book', 'Book');
  assert.equal((merged.match(/^\[module\]$/gm) || []).length, 0);
  assert.equal(/^\s*theme\s*=/m.test(mentioned), false);
  assert.match(mentioned, /enableGitInfo = false/);
  const cleaned = renderHugoToml('# run from exampleSite with themesDir ../..\n', 'github.com/alex-shpak/hugo-book', 'Book');
  assert.equal(cleaned.includes('../'), false);
  assert.equal(stripParentRefs('themesDir = "../.."\nbaseURL = "/"\n').includes('../'), false);
  const allowed = withTailwindAllowed('baseURL = "/"\n');
  assert.match(allowed, /\^tailwindcss\$/);
  assert.equal(withTailwindAllowed(allowed), allowed);
  assert.equal(tailwindDenied('allowChildProcess = [\'tailwindcss\']\nallowAddons = [\'tailwindcss\']\n'), true);
  const sassBuild = renderAnybuild({ folder: 'go-hugo-love-it', hugoVersion: '0.146.0', npm: false, sass: true, goVersion: '1.25.5' });
  assert.match(sassBuild, new RegExp(`dart-sass-${SASS_VERSION}-linux-x64`));
  assert.match(sassBuild, /\/tmp\/dart-sass/);
  assert.equal(sassBuild.includes('../'), false);
  const token = 'pk.eyJ1IjoiZm9vYmFyIn0.aaaaaaaaaa';
  const tokenWithPlus = 'pk.eyJ1IjoiZm9vK2Jhci8wPSJ9.abcdefghij';
  assert.equal(redactSecrets(`accessToken = "${token}"\n`).includes('pk.eyJ'), false);
  assert.equal(redactSecrets(`accessToken = "${tokenWithPlus}"\n`).includes('pk.eyJ'), false);
  const rendered = renderHugoToml(`token = "${token}"\n`, 'github.com/dillonzq/LoveIt', 'LoveIt');
  assert.equal(rendered.includes('pk.eyJ'), false);
  assert.match(rendered, /token = ""/);
  assert.equal(plan.catalog.framework, 'hugo');
  assert.equal(plan.catalog.language, 'go');
  assert.equal(plan.catalog.category, 'documentation');
  assert.ok(plan.catalog.description.length <= 160);
});

test('exampleSite content is the demo source when the theme has one', () => {
  assert.equal(chooseDemo(row(), { hasExampleDir: true }), 'exampleSite');
  const plan = planRow(row(), { used: new Set(), seen: new Map() });
  assert.equal(plan.demoContentSource, 'exampleSite');
});

test('a theme whose demo content lives at the repo root is pinned to that commit', () => {
  const sample = row({ exampleSite: 'False', themeName: '', module: 'github.com/HugoBlox/hugo-theme-academic-cv', repo: 'HugoBlox/hugo-theme-academic-cv', commit: '4295c33f37ca7b7d0f0d739f70395392d063edd8' });
  assert.equal(chooseDemo(sample, { hasExampleDir: false, repoContent: true }), 'github.com/HugoBlox/hugo-theme-academic-cv@4295c33f37ca7b7d0f0d739f70395392d063edd8');
});

test('a go.mod path mismatch is pinned with a replace, not a copied theme', () => {
  const error = 'module declares its path as: github.com/HugoBlox/kit/templates/academic-cv\nbut was required as: github.com/HugoBlox/hugo-theme-academic-cv\nv0.0.0-20261122035711-4295c33f37ca';
  const fix = modulePathFix(error);
  const next = applyModulePathFix('module github.com/wasmerio/examples/go-hugo-academic-cv\n\ngo 1.25.5\n', 'path = "github.com/HugoBlox/hugo-theme-academic-cv"\n', fix);
  assert.match(next.goMod, /require github.com\/HugoBlox\/kit\/templates\/academic-cv v0\.0\.0\n/);
  assert.match(next.goMod, /replace github.com\/HugoBlox\/kit\/templates\/academic-cv => github.com\/HugoBlox\/hugo-theme-academic-cv v0\.0\.0-20261122035711-4295c33f37ca/);
  assert.match(next.hugoToml, /path = "github.com\/HugoBlox\/kit\/templates\/academic-cv"/);
  assert.equal(next.goMod.includes('../'), false);
});

test('hugoBasicExample is the fallback when the theme has no demo', () => {
  const sample = row({ exampleSite: 'False', themeName: 'Coder', module: 'github.com/luizdepra/hugo-coder', repo: 'luizdepra/hugo-coder', description: 'A minimalist blog theme' });
  assert.equal(chooseDemo(sample, { hasExampleDir: false, branchSha: '', readme: '' }), `hugoBasicExample@${BASIC_SHA}`);
  const text = renderLicense({ licenseText: 'MIT', row: sample, source: `hugoBasicExample@${BASIC_SHA}` });
  assert.match(text, /NOTICE/);
  assert.match(text, new RegExp(BASIC_SHA));
  assert.match(renderReadme(sample, { slug: 'coder', hugoVersion: '0.167.0', demoContentSource: `hugoBasicExample@${BASIC_SHA}` }), /## Customise/);
});

test('npm theme adds Node and npm install to the one Anybuild recipe', () => {
  const withNpm = renderAnybuild({ folder: 'go-hugo-love-it', hugoVersion: '0.146.0', npm: true, npmLock: false, goVersion: '1.25.5', nodeVersion: '24.16.0' });
  assert.match(withNpm, /dep\("node", "24.16.0"\)/);
  assert.match(withNpm, /dep\("go", "1.25.5"\)/);
  assert.match(withNpm, /npm install --no-audit --no-fund/);
  assert.match(withNpm, /hugo mod get/);
  assert.match(withNpm, /config\.app_subdir or "\."/);
  assert.equal(withNpm.includes('../'), false);
  const plain = renderAnybuild({ folder: 'go-hugo-book', hugoVersion: '0.167.0', npm: false, minify: true });
  assert.equal(renderRootPointer('go-hugo-book'), '# Anybuild resolves a subdirectory build from this file at the repository root.\nload("//go-hugo-book:Anybuild", "config")\n');
  assert.equal(renderRootPointer('go-hugo-book').includes('../'), false);
  assert.equal(plain.includes('dep("node"'), false);
  assert.match(plain, /hugo --gc --minify/);
  assert.match(plain, /GOMAXPROCS = "1"/);
  assert.match(plain, /hugo mod get/);
  const replaced = renderAnybuild({
    folder: 'go-hugo-academic-cv',
    hugoVersion: '0.167.0',
    npm: false,
    moduleReplace: { path: 'github.com/HugoBlox/hugo-theme-academic-cv', version: 'v0.0.0-20261122035711-4295c33f37ca' },
  });
  assert.match(replaced, /go mod download github.com\/HugoBlox\/hugo-theme-academic-cv@v0\.0\.0-20261122035711-4295c33f37ca/);
  assert.equal(replaced.includes('hugo mod get'), false);
  assert.equal(replaced.includes('../'), false);
});

test('license check stays in review until the license is read', () => {
  const plan = planRow(row({ licenseGate: 'check', license: 'NOASSERTION' }), { used: new Set(), seen: new Map() });
  assert.equal(plan.status, 'needs-review');
  assert.match(plan.reason, /licenseGate=check/);
  const allowed = planRow(row({ licenseGate: 'check' }), { used: new Set(), seen: new Map(), licenseOk: new Set([row().module]) });
  assert.equal(allowed.status, 'not-run');
});

test('retrying a blocked row does not treat that row as its own duplicate', () => {
  const seen = seenForRun(new Map([['github.com/alex-shpak/hugo-book', 3]]), [{ rank: 3, module: 'github.com/alex-shpak/hugo-book', status: 'blocked' }], true);
  assert.equal(seen.has('github.com/alex-shpak/hugo-book'), false);
  const kept = seenForRun(new Map([['github.com/alex-shpak/hugo-book', 3]]), [{ rank: 9, module: 'github.com/alex-shpak/hugo-book', status: 'blocked' }], true);
  assert.equal(kept.get('github.com/alex-shpak/hugo-book'), 3);
});

test('a repeated module is a duplicate of the earlier rank', () => {
  const seen = new Map([['github.com/alex-shpak/hugo-book', 3]]);
  const plan = planRow(row({ rank: 9 }), { used: new Set(), seen, licenseOk: new Set() });
  assert.equal(plan.status, 'duplicate-of:3');
});

test('slug uses the theme name and adds the owner only on a collision', () => {
  const used = new Set();
  assert.equal(slugFor(row({ themeName: 'PaperMod', repo: 'adityatelange/hugo-PaperMod' }), used), 'paper-mod');
  assert.equal(slugFor(row({ themeName: '', module: 'github.com/HugoBlox/hugo-theme-academic-cv', repo: 'HugoBlox/hugo-theme-academic-cv' }), used), 'academic-cv');
  assert.equal(slugFor(row({ themeName: 'LoveIt' }), used), 'love-it');
  assert.equal(slugFor(row(), used), 'book');
  assert.equal(slugFor(row({ themeName: 'Book', repo: 'other/hugo-book', module: 'github.com/other/hugo-book' }), used), 'book-other');
});

test('a content shortcode error points at the demo page, not the theme', () => {
  const dest = '/tmp/site';
  const tail = 'error calling Content: "/tmp/site/content/posts/emoji-support.md:35:1": failed to render shortcode "css.inline"';
  assert.deepEqual(brokenContentFiles(dest, tail), ['/tmp/site/content/posts/emoji-support.md']);
  assert.deepEqual(brokenContentFiles(dest, 'layouts/baseof.html failed'), []);
  const spaced = '/tmp/01 Wasmer/site';
  const spacedTail = 'error calling Content: "/tmp/01 Wasmer/site/content/posts/emoji-support.md:35:1": no earlier definition of shortcode "css.inline" found';
  assert.deepEqual(brokenContentFiles(spaced, spacedTail), [`${spaced}/content/posts/emoji-support.md`]);
  const localized = 'failed to extract shortcode: "/tmp/site/content.en/_index.md:15:1": template for shortcode "button" not found';
  assert.deepEqual(brokenContentFiles(dest, localized), ['/tmp/site/content.en/_index.md']);
});

test('a missing shortcode drops the demo page when the error path was cut off', () => {
  const dest = mkdtempSync(path.join(tmpdir(), 'hugo-shortcode-'));
  const page = path.join(dest, 'content', 'posts', 'emoji-support.md');
  mkdirSync(path.dirname(page), { recursive: true });
  writeFileSync(page, '---\ntitle: Emoji\n---\n{{< css.inline >}}\nbody { color: red; }\n{{< /css.inline >}}\n');
  writeFileSync(path.join(dest, 'content', 'posts', 'ok.md'), '---\ntitle: Ok\n---\nHello\n');
  const tail = 'failed to render shortcode "css.inline": no earlier definition of shortcode "css.inline" found';
  assert.deepEqual(brokenContentFiles(dest, tail), [page]);
  rmSync(dest, { recursive: true, force: true });
});

test('minified Hugo markup still exposes css and page links', () => {
  const html = '<link href=/assets/css/stylesheet.min.css rel=stylesheet><a href=/posts/hello/>Hello</a><a href="https://gohugo.io/">Hugo</a>';
  const refs = htmlRefs(html);
  assert.ok(refs.includes('/assets/css/stylesheet.min.css'));
  assert.ok(refs.includes('/posts/hello/'));
  assert.ok(refs.includes('https://gohugo.io/'));
});

test('the site go.mod is pinned to the Go version installed on Wasmer', () => {
  const text = 'module github.com/wasmerio/examples/go-hugo-book\n\ngo 1.26.5\n\ntoolchain go1.26.5\n\nrequire example.com/theme v0.0.0\n';
  const pinned = pinGoMod(text, '1.25.5');
  assert.match(pinned, /^go 1\.25\.5$/m);
  assert.equal(pinned.includes('1.26.5'), false);
  assert.equal(pinned.includes('toolchain'), false);
});

test('a JSON minify failure can be disabled in hugo.toml without dropping minify', () => {
  const once = withJsonMinifyDisabled('baseURL = "/"\n');
  assert.match(once, /\[minify\]\ndisableJSON = true\n/);
  assert.equal(withJsonMinifyDisabled(once), once);
});

test('Hugo version order tries current, then the theme minimum, then the last safe releases', () => {
  assert.deepEqual(hugoVersionCandidates(row(), ['0.140.0']), ['0.167.0', '0.158.0', '0.140.0', '0.145.0', '0.127.0', '0.122.0']);
});

test('category stays static unless the theme is documentation', () => {
  assert.equal(categoryFor(row({ themeName: 'PaperMod', module: 'github.com/adityatelange/hugo-PaperMod', description: 'A fast, clean, responsive Hugo theme.' })), 'static');
  assert.ok(catalogDescription(row()).length <= 160);
});

test('generated Anybuild matches the recipe and the folder stays under 8 MB', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'hugo-folder-'));
  const info = {
    module: 'github.com/alex-shpak/hugo-book',
    repository: 'https://github.com/alex-shpak/hugo-book',
    commit: '7875ae6727c38350ff330d66cb5ee2f70e6cfc54',
    license: 'MIT',
    hugoVersion: '0.167.0',
    demoContentSource: 'exampleSite',
    npm: false,
    npmLock: false,
    goVersion: '1.25.5',
    nodeVersion: '24.16.0',
    minify: true,
    folder: 'go-hugo-book',
    slug: 'book',
  };
  writeFileSync(path.join(dir, 'UPSTREAM.json'), `${JSON.stringify(info, null, 2)}\n`);
  writeFileSync(path.join(dir, 'Anybuild'), renderAnybuild(info));
  writeFileSync(path.join(dir, 'go.mod'), 'module github.com/wasmerio/examples/go-hugo-book\n\ngo 1.25\n');
  assert.deepEqual(checkGenerated(dir), []);
  rmSync(dir, { recursive: true, force: true });
});

test('Hugo autobuild input does not attach an MCP token', () => {
  const input = autobuildInput({ folder: 'go-hugo-book', branch: 'ayush/hugo-tooling', appName: 'hugo-book', owner: 'ayushojha' });
  assert.equal(input.envVars, undefined);
  assert.equal(input.rootDir, 'go-hugo-book');
  assert.equal(input.repoUrl, 'https://github.com/wasmerio/examples');
  assert.equal(input.branch, 'ayush/hugo-tooling');
  const mcp = autobuildInput({ folder: 'js-mcp-time-mcp', branch: 'ayush/mcp', appName: 'mcp-time-mcp', owner: 'ayushojha', token: 'secret' });
  assert.equal(mcp.envVars[0].name, 'MCP_AUTH_TOKEN');
  assert.equal(mcp.envVars[0].sensitive, true);
});

test('dry-run reports each gate without building', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'hugo-dry-'));
  const queue = path.join(dir, 'queue.csv');
  const report = path.join(dir, 'out.jsonl');
  const lines = [
    'rank,module,host,repo,subdir,official,stars,license,licenseGate,pushedAt,branch,commit,exampleSite,minHugo,packageJson,goMod,themeName,demo,description',
    '1,github.com/alex-shpak/hugo-book,github.com,alex-shpak/hugo-book,,True,1,MIT,ok,2026-11-09,main,abc,True,0.158.0,False,True,Book,,docs',
    '2,github.com/luizdepra/hugo-coder,github.com,luizdepra/hugo-coder,,True,1,MIT,ok,2026-11-09,main,def,False,,False,True,Coder,,blog',
    '3,github.com/dillonzq/LoveIt,github.com,dillonzq/LoveIt,,True,1,MIT,ok,2026-11-09,main,aaa,True,0.146.0,True,True,LoveIt,,blog',
    '4,github.com/example/private,github.com,example/private,,True,1,NOASSERTION,check,2026-11-09,main,bbb,False,,False,False,Private,,blog',
    '5,github.com/alex-shpak/hugo-book,github.com,alex-shpak/hugo-book,,True,1,MIT,ok,2026-11-09,main,abc,True,0.158.0,False,True,Book,,docs',
  ];
  writeFileSync(queue, `${lines.join('\n')}\n`);
  const result = spawnSync(process.execPath, [
    path.join(root, 'scripts/hugo-batch.mjs'),
    '--queue', queue,
    '--from', '1',
    '--to', '5',
    '--dry-run',
    '--report', report,
  ], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const records = readFileSync(report, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
  assert.deepEqual(records.map((item) => item.status), ['not-run', 'not-run', 'not-run', 'needs-review', 'duplicate-of:1']);
  assert.equal(records[0].demoContentSource, 'exampleSite');
  assert.equal(records[1].demoContentSource, `hugoBasicExample@${BASIC_SHA}`);
  assert.equal(records[2].npm, true);
  assert.equal(records[2].folder, 'go-hugo-love-it');
  rmSync(dir, { recursive: true, force: true });
});
