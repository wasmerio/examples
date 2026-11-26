import { openProperties, chooseSelect } from './editor-controls.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

export async function checkLiveStructure({ cdp, evaluate, waitFor, url }) {
  const file = 'src/content/pages/about.json';
  const original = await readFile(file, 'utf8');
  const frame = "document.querySelector('.visual-editor iframe')";
  const canvas = `${frame}.contentDocument`;
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const field = path => `document.querySelector('.section-properties [data-schema-path="${path}"]')`;
  const input = (path, value) => evaluate(`(() => { const el = ${field(path)}.querySelector('input[type=text],textarea'); el.value = ${JSON.stringify(value)}; el.dispatchEvent(new Event('input', { bubbles:true })); })()`);
  const add = async (type, label) => {
    await openProperties({ evaluate, waitFor });
    await chooseSelect({ evaluate, waitFor }, '.add-section [role=combobox]', label);
    await click('.add-section button.outlined');
    await waitFor("document.querySelector('.structure-list li:last-child')?.classList.contains('active')");
    const key = await evaluate("document.querySelector('.section-properties [data-schema-path]').dataset.schemaPath.split('.')[1]");
    await waitFor(`${canvas}.querySelector('[data-rigel-key="${key}"]') !== null`, `${type}: new section appears before Save`);
    return key;
  };
  try {
    await click('#nav-pages');
    await waitFor("[...document.querySelectorAll('.table-link')].some(el => el.textContent.trim() === 'About')");
    await evaluate("[...document.querySelectorAll('.table-link')].find(el => el.textContent.trim() === 'About').click()");
    await waitFor("document.querySelector('.canvas-stage')?.dataset.ready === 'true'");
    await evaluate(`window.liveDocument = ${canvas}; window.liveIntro = ${canvas}.querySelector('h1'); window.liveRequests = []; window.liveOriginalFetch = window.fetch; window.fetch = (...args) => { window.liveRequests.push(String(args[0])); return window.liveOriginalFetch(...args); }`);

    const paragraph = 'sections.kaboutstory.paragraphs.kaboutpara2.text';
    const position = await evaluate(`(() => { const el = ${canvas}.querySelector('[data-rigel-text="${paragraph}"]'); el.scrollIntoView({block:'center'}); const r = el.getBoundingClientRect(), f = ${frame}.getBoundingClientRect(); return { x:f.left+r.left+10, y:f.top+r.top+10 }; })()`);
    await cdp('Input.dispatchMouseEvent', { type:'mousePressed', button:'left', clickCount:1, ...position });
    await cdp('Input.dispatchMouseEvent', { type:'mouseReleased', button:'left', clickCount:1, ...position });
    await waitFor(`document.activeElement?.closest('[data-schema-path]')?.dataset.schemaPath === '${paragraph}'`, 'About paragraph click focuses that paragraph, not heading');
    for (const touch of [false, true]) {
      await cdp('Emulation.setTouchEmulationEnabled', { enabled: touch });
      for (const selector of ['.structure-actions button', '.schema-item-actions button']) {
        const boxes = await evaluate(`[...document.querySelectorAll('${selector}')].map(button => { const r = button.getBoundingClientRect(); return [r.width, r.height]; })`);
        assert.ok(boxes.length > 0, `${selector} rendered`);
        assert.ok(boxes.every(([width, height]) => width === (touch ? 44 : 36) && height === width), `${selector} square on ${touch ? 'touch' : 'desktop'}`);
      }
    }
    await cdp('Emulation.setTouchEmulationEnabled', { enabled: false });
    await input(paragraph, 'Instant paragraph regression');
    await waitFor(`${canvas}.querySelector('[data-rigel-text="${paragraph}"]').textContent === 'Instant paragraph regression'`);
    assert.equal(await evaluate(`document.activeElement === ${field(paragraph)}.querySelector('textarea')`), true, 'Typing does not move focus');

    const title = 'sections.kaboutstory.paragraphs.kaboutpara2.title';
    await input(title, 'Previously absent subheading');
    await waitFor(`${canvas}.querySelector('[data-rigel-text="${title}"]').textContent === 'Previously absent subheading' && !${canvas}.querySelector('[data-rigel-text="${title}"]').hidden`, 'Optional subheading appears instantly');
    await input(title, '');
    await waitFor(`${canvas}.querySelector('[data-rigel-text="${title}"]').hidden`, 'Clearing optional subheading hides it');
    assert.deepEqual(await evaluate('window.liveRequests'), [], 'Text changes do not request rendering or write content');

    await evaluate("[...document.querySelectorAll('.section-properties button')].find(el => el.textContent.trim() === 'Add item').click()");
    await waitFor(`${canvas}.querySelectorAll('[data-rigel-each="sections.kaboutstory.paragraphs"] > [data-rigel-item]').length === 4`, 'New paragraph appears before Save');
    const key = await evaluate("[...document.querySelectorAll('.section-properties .schema-item-head .schema-key')].at(-1).textContent");
    await input(`sections.kaboutstory.paragraphs.${key}.title`, 'New item title');
    await input(`sections.kaboutstory.paragraphs.${key}.text`, 'New item text');
    await waitFor(`${canvas}.querySelector('[data-rigel-text="sections.kaboutstory.paragraphs.${key}.text"]').textContent === 'New item text'`);
    await click('[aria-label="Move Paragraphs item 4 up"]');
    await waitFor(`${canvas}.querySelector('[data-rigel-each="sections.kaboutstory.paragraphs"]').children[2].getAttribute('data-rigel-item') === '${key}'`, 'Array reorder is instant and keyed');
    await click('[aria-label="Remove Paragraphs item 3"]');
    await waitFor(`!${canvas}.querySelector('[data-rigel-text="sections.kaboutstory.paragraphs.${key}.text"]')`, 'Array removal is instant');
    for (let index = 3; index > 0; index--) await click(`[aria-label="Remove Paragraphs item ${index}"]`);
    await waitFor(`${canvas}.querySelectorAll('[data-rigel-each="sections.kaboutstory.paragraphs"] > [data-rigel-item]').length === 0`, 'Remove final array item');
    await evaluate("[...document.querySelectorAll('.section-properties button')].find(el => el.textContent.trim() === 'Add item').click()");
    await waitFor(`${canvas}.querySelectorAll('[data-rigel-each="sections.kaboutstory.paragraphs"] > [data-rigel-item]').length === 1`, 'Empty array retains its prepared template');

    const manifest = await evaluate("fetch('/rigel/manifest.json').then(r => r.json())");
    for (const type of manifest.schema.objects.filter(object => object.type === 'section')) {
      const section = await add(type.name, type.title);
      if (type.name === 'textBlock' || type.name === 'journal') {
        await input(`sections.${section}.linkLabel`, 'Optional link appears');
        await waitFor(`!${canvas}.querySelector('[data-rigel-if="sections.${section}.linkLabel"]').hidden`, `${type.name}: optional link appears`);
      }
      if (type.name === 'services' || type.name === 'workGrid') {
        const array = type.name === 'services' ? 'rows' : 'items';
        await evaluate("[...document.querySelectorAll('.section-properties button')].find(el => el.textContent.trim() === 'Add item').click()");
        const count = (type.fields.find(field => field.key === array).initialValue?.length ?? 0) + 1;
        await waitFor(`${canvas}.querySelectorAll('[data-rigel-each="sections.${section}.${array}"] > [data-rigel-item]').length === ${count}`, `${type.name}: list creates a new row`);
      }
      if (type.name === 'logoStrip' || type.name === 'cta') {
        const reference = type.name === 'logoStrip' ? 'logoSet' : 'callout';
        const target = type.name === 'logoStrip' ? 'logoSet:brands' : 'callout:studio';
        await evaluate(`(() => { const select = ${field(`sections.${section}.${reference}`)}.querySelector('select'); select.value = '${target}'; select.dispatchEvent(new Event('change', {bubbles:true})); })()`);
        const selector = type.name === 'logoStrip' ? `img[data-rigel-doc="${target}"]` : `h2[data-rigel-doc="${target}"]`;
        await waitFor(`${canvas}.querySelector('[data-rigel-key="${section}"]').querySelector('${selector}') !== null`, `${type.name}: selecting shared content binds its preview`);
      }
      await evaluate(`[...document.querySelectorAll('[aria-label="Remove ${type.title}"]')].at(-1).click()`);
      await waitFor(`!${canvas}.querySelector('[data-rigel-key="${section}"]')`, `${type.name}: unsaved removal is instant`);
    }
    await click('[aria-label="Duplicate Story"]');
    await waitFor(`${canvas}.querySelectorAll('[data-rigel-section="story"]').length === 2`, 'Section duplication appears immediately');
    assert.equal(await evaluate(`${canvas} === window.liveDocument && ${canvas}.querySelector('h1') === window.liveIntro`), true, 'Same iframe document and untouched section elements survive');
    assert.equal(await readFile(file, 'utf8'), original, 'All changes stay in memory before explicit Save');
    await writeScreenshot();
    console.log('PASS: About nested click/focus, absent subheadings, array add/remove/reorder/empty, every section type added without Save, shared references, no text requests or autosave, unchanged iframe');
  } finally {
    await evaluate('if (window.liveOriginalFetch) window.fetch = window.liveOriginalFetch');
    await evaluate(`if (document.querySelector('.save-status')?.textContent.trim() === 'Unsaved') document.querySelector('#nav-pages')?.click()`);
    if (await evaluate("!!document.querySelector('.unsaved-dialog[open]')")) {
      await evaluate("[...document.querySelectorAll('.unsaved-dialog button')].find(button => button.textContent.trim() === 'Discard changes').click()");
      await waitFor("!document.querySelector('.unsaved-dialog[open]')");
    }
    await cdp('Page.navigate', { url });
    await waitFor("!!document.querySelector('#nav-pages')");
  }
  async function writeScreenshot() {
    const { writeFile } = await import('node:fs/promises');
    await writeFile('_temp/live-structure.png', Buffer.from((await cdp('Page.captureScreenshot', { format:'png' })).data, 'base64'));
  }
}
