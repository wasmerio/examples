import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { chooseSelect, openProperties } from './editor-controls.mjs';

export async function checkPagePreviews({ evaluate, waitFor }) {
  const manifest = await evaluate("fetch('/rigel/manifest.json').then(response => response.json())");
  const types = manifest.schema.documents.filter(type => !type.shared && !type.locale);
  const originals = new Map();
  const listings = new Map();
  for (const type of types) {
    const names = (await readdir(type.folder)).sort();
    listings.set(type.folder, names);
    for (const name of names) if (name.endsWith('.json')) originals.set(`${type.folder}/${name}`, await readFile(`${type.folder}/${name}`));
  }
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const input = (selector, value) => evaluate(`(() => { const input = document.querySelector(${JSON.stringify(selector)}); input.value = ${JSON.stringify(value)}; input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  const discard = async () => {
    await click('#nav-pages');
    if (await evaluate("!!document.querySelector('.unsaved-dialog[open]')")) {
      await evaluate("[...document.querySelectorAll('.unsaved-dialog button')].find(button => button.textContent === 'Discard changes').click()");
    }
    await waitFor("!!document.querySelector('tbody .table-link')");
  };
  await evaluate("window.pagePreviewFetch = window.fetch; window.pagePreviewWrites = []; window.fetch = (...args) => { if (String(args[0]).includes('/rigel/api/') && args[1]?.method && args[1].method !== 'GET') window.pagePreviewWrites.push(args[1].method); return window.pagePreviewFetch(...args); }");
  try {
    for (const type of types) {
      const category = type.category ?? 'Core';
      const name = `Unsaved ${category} preview`, slug = `unsaved-${category.toLowerCase()}-preview`, id = `${type.name}:${slug}`;
      const mapping = manifest.preview.documents[type.name];
      await assert.rejects(readFile(`${type.folder}/${slug}.json`), { code: 'ENOENT' });
      await click('#nav-pages');
      await waitFor("!!document.querySelector('.titlebar .primary')");
      await click('.titlebar .primary');
      await waitFor("!!document.querySelector('.action-dialog[open] input')");
      await input('.action-dialog input', name);
      await chooseSelect({ evaluate, waitFor }, '.action-dialog [role=combobox]', category);
      await click('.action-dialog [type=submit]');
      await waitFor("document.querySelector('.canvas-stage')?.dataset.ready === 'true'");
      assert.equal(await evaluate("new URL(document.querySelector('.canvas-stage iframe').src).pathname"), mapping.template);
      assert.equal(await evaluate("!!document.querySelector('.visual-error')"), false);
      const frame = "document.querySelector('.canvas-stage iframe').contentDocument";
      assert.equal(await evaluate(`${frame}.querySelector('[data-rigel-each="sections"]').getAttribute('data-rigel-doc')`), id);
      assert.equal(await evaluate(`${frame}.querySelectorAll('[data-rigel-each="sections"] > [data-rigel-section]').length`), type.template.length);
      assert.equal(await evaluate(`${frame}.body.innerHTML.includes('data-rigel-doc="$document"')`), false, 'Primary bindings inside prepared templates are rebound too');
      assert.equal(await evaluate("document.querySelector('.visual-live').getAttribute('href')"), mapping.url.replaceAll('{slug}', slug));
      await openProperties({ evaluate, waitFor });
      await click('#properties-tab-content');
      await click('.structure-row');
      const field = manifest.schema.objects.find(object => object.name === type.template[0].type).fields.find(field => field.type === 'string');
      const sectionKey = await evaluate(`${frame}.querySelector('[data-rigel-each="sections"] > [data-rigel-section]').getAttribute('data-rigel-key')`);
      const path = `sections.${sectionKey}.${field.key}`;
      const selector = `.section-properties [data-schema-path="${path}"] input`;
      await waitFor(`!!document.querySelector(${JSON.stringify(selector)})`);
      await input(selector, `${category} unsaved content`);
      await waitFor(`${frame}.querySelector(${JSON.stringify(`[data-rigel-text="${path}"]`)})?.textContent === ${JSON.stringify(`${category} unsaved content`)}`);
      await click('#properties-tab-page');
      await input('#properties-page input:not([readonly])', `${slug}-edited`);
      assert.equal(await evaluate("document.querySelector('.page-path input').value"), mapping.url.replaceAll('{slug}', `${slug}-edited`));
      assert.equal(await evaluate("new URL(document.querySelector('.canvas-stage iframe').src).pathname"), mapping.template, 'Unsaved slug edits do not replace the canvas with a missing website route');
      await discard();
      await assert.rejects(readFile(`${type.folder}/${slug}.json`), { code: 'ENOENT' });
    }
    assert.deepEqual(await evaluate('window.pagePreviewWrites'), [], 'Previewing and discarding new pages never writes content');
    for (const [folder, names] of listings) assert.deepEqual((await readdir(folder)).sort(), names);
    for (const [file, bytes] of originals) assert((await readFile(file)).equals(bytes), `${file} is unchanged`);
    console.log('PASS: Core/Legal pages preview before Save using assigned static templates, real rendered sections, stable primary bindings, public routes, draft slug edits, discard and no filesystem/API writes');
  } finally {
    await evaluate('window.fetch = window.pagePreviewFetch');
    await discard();
  }
}
