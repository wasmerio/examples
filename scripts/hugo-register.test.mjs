import test from 'node:test';
import assert from 'node:assert/strict';
import { importedModule, inputFor, planItem } from './hugo-register.mjs';

const MODULE = 'github.com/chipzoller/hugo-clarity';

function row(extra) {
  return {
    rank: 36,
    module: MODULE,
    folder: 'go-hugo-clarity',
    license: 'MIT',
    demo: 'https://hugo-clarity.wasmer.app',
    catalog: { slug: 'hugo-clarity', name: 'Clarity Hugo Theme', category: 'static', description: 'x'.repeat(200) },
    ...extra,
  };
}

const files = (extra) => ({
  'README.md': '# Clarity',
  'hugo.toml': `[module]\n[[module.imports]]\npath = "${MODULE}"\n`,
  Anybuild: 'build',
  LICENSE: 'MIT License',
  'preview.jpg': true,
  ...extra,
});

const ok = { status: 200, html: '<a href="https://github.com/chipzoller">chipzoller</a>' };
const plan = (extra) => planItem({ row: row(), existing: new Set(), files: files(), demo: ok, sameSlugRanks: [36], ...extra });

test('importedModule reads the first module import', () => {
  assert.equal(importedModule(files()['hugo.toml']), MODULE);
  assert.equal(importedModule('theme = "x"'), '');
});

test('a complete row on main with a live demo is ready', () => {
  const item = plan();
  assert.equal(item.action, 'ready');
  assert.equal(item.input.rootDir, 'go-hugo-clarity');
  assert.equal(item.input.branch, 'main');
  assert.equal(item.input.framework, 'hugo');
  assert.equal(item.input.isPublic, true);
  assert.equal(item.input.description.length, 160);
});

test('existing slugs are skipped, never updated', () => {
  assert.equal(plan({ existing: new Set(['hugo-clarity']) }).action, 'skip-existing');
});

test('missing files on main mean not ready', () => {
  const item = plan({ files: files({ 'preview.jpg': false }) });
  assert.equal(item.action, 'not-ready');
  assert.match(item.reason, /preview\.jpg/);
});

test('a folder that imports another theme is held', () => {
  const item = plan({ row: row({ rank: 817, module: 'github.com/iron6909/clarity' }) });
  assert.equal(item.action, 'hold-slug');
});

test('module paths compare without case', () => {
  assert.equal(plan({ row: row({ module: 'github.com/ChipZoller/hugo-clarity' }) }).action, 'ready');
});

test('a shared slug whose live demo shows another theme is held', () => {
  const item = plan({ sameSlugRanks: [36, 817], demo: { status: 200, html: 'iron6909' } });
  assert.equal(item.action, 'hold-slug');
  assert.equal(plan({ sameSlugRanks: [36, 817] }).action, 'ready');
});

test('a theme without a license is held', () => {
  assert.equal(plan({ row: row({ license: '' }) }).action, 'hold-license');
  assert.equal(plan({ files: files({ LICENSE: 'Unknown license. The license file was not found' }) }).action, 'hold-license');
});

test('a demo that is not 200 is held', () => {
  assert.equal(plan({ demo: { status: 404, html: '' } }).action, 'hold-demo');
});

test('inputFor carries the catalog fields', () => {
  const input = inputFor(row(), '# readme');
  assert.equal(input.slug, 'hugo-clarity');
  assert.equal(input.repoUrl, 'https://github.com/wasmerio/examples');
  assert.equal(input.readme, '# readme');
});
