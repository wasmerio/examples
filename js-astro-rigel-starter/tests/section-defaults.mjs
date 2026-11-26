import { openProperties, chooseSelect } from './editor-controls.mjs';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';

export async function checkSectionDefaults({ cdp, evaluate, waitFor }) {
  const file = 'src/content/pages/about.json';
  const original = await readFile(file, 'utf8');
  const baseline = JSON.parse(original);
  const canvas = "document.querySelector('.visual-editor iframe').contentDocument";
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const open = async () => {
    await waitFor("!!document.querySelector('#nav-pages')");
    await click('#nav-pages');
    await waitFor("[...document.querySelectorAll('.table-link')].some(button => button.textContent === 'About')");
    await evaluate("[...document.querySelectorAll('.table-link')].find(button => button.textContent === 'About').click()");
    await waitFor("document.querySelector('.canvas-stage')?.dataset.ready === 'true'");
  };
  try {
    await open();
    const manifest = await evaluate("fetch('/rigel/manifest.json').then(response => response.json())");
    const types = manifest.schema.objects.filter(type => type.type === 'section');
    const keys = [];
    for (const type of types) {
      await openProperties({ evaluate, waitFor });
      await chooseSelect({ evaluate, waitFor }, '.add-section [role=combobox]', type.title);
      await click('.add-section button.outlined');
      await waitFor(`document.querySelectorAll('.structure-row').length === ${baseline.sections.length + keys.length + 1} && document.querySelector('.structure-list li:last-child').classList.contains('active')`);
      const key = await evaluate("document.querySelector('.section-properties [data-schema-path]').dataset.schemaPath.split('.')[1]");
      keys.push(key);
      await waitFor(`document.activeElement?.closest('[data-schema-path]')?.dataset.schemaPath.startsWith('sections.${key}.')`, `${type.name}: added section opens and focuses its properties`);
      await waitFor(`!!${canvas}.querySelector('[data-rigel-key="${key}"]')`, `${type.name}: starter preview is immediate`);
      await waitFor(`(() => { const el = ${canvas}.querySelector('[data-rigel-key="${key}"]'); const rect = el.getBoundingClientRect(); return rect.top < ${canvas}.defaultView.innerHeight && rect.bottom > 0; })()`, `${type.name}: canvas scrolls to new section`);
      assert.equal(await readFile(file, 'utf8'), original, 'Adding starter content never autosaves');
    }
    await click('.save-button');
    await waitFor("document.querySelector('.save-status')?.textContent.trim() === 'Saved'", 'Every new section saves without manual edits');
    const saved = JSON.parse(await readFile(file, 'utf8'));
    assert.deepEqual(saved.sections.slice(0, baseline.sections.length), baseline.sections, 'Existing sections stay unchanged');
    assert.deepEqual(saved.sections.slice(baseline.sections.length).map(section => section._type), types.map(type => type.name));
    assert.deepEqual(saved.sections.slice(baseline.sections.length).map(section => section._key), keys);
    await waitFor(`fetch('/about/').then(response => response.text()).then(html => { const doc = new DOMParser().parseFromString(html, 'text/html'); return ${JSON.stringify(keys)}.every(key => doc.querySelector('[data-rigel-key="' + key + '"]')); })`, 'Public page renders all saved starter sections');
    await evaluate("document.documentElement.dataset.rigelTestReload = 'pending'");
    await cdp('Page.reload');
    await waitFor("document.documentElement.dataset.rigelTestReload !== 'pending'");
    await open();
    await openProperties({ evaluate, waitFor });
    assert.equal(await evaluate("document.querySelectorAll('.structure-row').length"), baseline.sections.length + types.length);
    assert.equal(await evaluate("document.querySelector('.save-button').disabled"), true, 'Saved starter sections reload clean');
    console.log(`PASS: all ${types.length} section types add with starter content, auto-open/focus/scroll, no autosave, Save/file/public rendering/reload and existing-section preservation`);
  } finally {
    if (await evaluate("document.querySelector('.save-button')?.disabled === false")) {
      await click('#nav-pages');
      await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
      await evaluate("[...document.querySelectorAll('.unsaved-dialog button')].find(button => button.textContent === 'Discard changes').click()");
    }
    await writeFile(file, original);
    assert.equal(await readFile(file, 'utf8'), original);
    await evaluate("document.documentElement.dataset.rigelTestReload = 'pending'");
    await cdp('Page.reload');
    await waitFor("document.documentElement.dataset.rigelTestReload !== 'pending'");
    await waitFor("!!document.querySelector('#nav-pages')");
  }
}
