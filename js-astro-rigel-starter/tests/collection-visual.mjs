import assert from 'node:assert/strict';
import { openProperties } from './editor-controls.mjs';
import { readFile, writeFile } from 'node:fs/promises';

export async function checkCollectionVisual({ cdp, evaluate, waitFor }) {
  await evaluate("const settings = JSON.parse(localStorage.getItem('rigelcms.settings')); settings.theme = 'light'; settings.highContrast = false; localStorage.setItem('rigelcms.settings', JSON.stringify(settings));");
  await cdp('Page.reload');
  await waitFor("!!document.querySelector('[data-doctype=author]')");
  const fixtures = [
    { collection: 'blog', slug: 'first-post', file: 'src/content/blog/first-post.json' },
    { collection: 'news', slug: 'launch-week', file: 'src/content/news/launch-week.json' },
  ];
  const originals = await Promise.all(fixtures.map(item => readFile(item.file, 'utf8')));
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const open = async ({ collection, slug }) => {
    await click(`[data-collection="${collection}"]`);
    await waitFor(`!![...document.querySelectorAll('tbody tr')].find(row => row.cells[1].textContent.trim() === ${JSON.stringify(slug)})`);
    await evaluate(`[...document.querySelectorAll('tbody tr')].find(row => row.cells[1].textContent.trim() === ${JSON.stringify(slug)}).querySelector('.table-link').click()`);
    await waitFor("document.querySelector('.visual-editor .canvas-stage')?.dataset.ready === 'true'");
    await openProperties({ evaluate, waitFor });
  };
  const input = (selector, value) => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); el.value = ${JSON.stringify(value)}; el.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  const frame = "document.querySelector('.visual-editor iframe')";
  try {
    for (const item of fixtures) {
      await open(item);
      await (await import('./properties-resize.mjs')).checkPropertiesResize({ cdp, evaluate, waitFor });
      await click('#properties-tab-page');
      const originalDate = JSON.parse(originals[fixtures.indexOf(item)]).frontmatter.date;
      const readableDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${originalDate}T12:00:00Z`));
      assert.equal(await evaluate("document.querySelector('[data-collection-field=date] .date-trigger')?.textContent.trim()"), readableDate, 'Article dates display English long dates');
      assert.equal(await evaluate("document.querySelector('.save-button').disabled"), true, 'Date formatting does not dirty the article');
      await click('[data-collection-field=date] .date-trigger');
      await waitFor("!!document.querySelector('.date-popover:popover-open')");
      await input('.date-header input', '2026');
      await evaluate("document.querySelector('.date-header input').dispatchEvent(new Event('change', { bubbles: true }))");
      await click('.date-header [aria-label="Calendar month"]');
      await waitFor("!!document.querySelector('.date-popover .select-menu:popover-open')");
      await evaluate("[...document.querySelectorAll('.date-popover .select-menu:popover-open [role=option]')].find(option => option.querySelector('span').textContent === 'October').click()");
      await waitFor("!!document.querySelector('[data-date=\"2026-10-13\"]')");
      await click('[data-date="2026-10-13"]');
      await waitFor("document.querySelector('[data-collection-field=date] .date-trigger').textContent.trim() === 'October 13, 2026'");
      assert.equal(await readFile(item.file, 'utf8'), originals[fixtures.indexOf(item)], 'Choosing a date does not autosave');
      const draftSwitch = '[data-collection-field="draft"] input[role="switch"].switch';
      const originalDraft = await evaluate(`document.querySelector(${JSON.stringify(draftSwitch)}).checked`);
      assert.equal(await evaluate(`getComputedStyle(document.querySelector(${JSON.stringify(draftSwitch)})).appearance`), 'none');
      await click(draftSwitch);
      await waitFor(`document.querySelector(${JSON.stringify(draftSwitch)}).checked === ${!originalDraft}`);
      await evaluate(`document.querySelector(${JSON.stringify(draftSwitch)}).focus()`);
      await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
      await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
      await waitFor(`document.querySelector(${JSON.stringify(draftSwitch)}).checked === ${originalDraft}`);
      assert.equal(await evaluate("!!document.querySelector('.site-preview, .preview-divider')"), false);
      assert.equal(await evaluate(`${frame}.getAttribute('sandbox')`), 'allow-same-origin');
      assert.equal(await evaluate(`new URL(${frame}.src).pathname`), `/preview/${item.collection}/`);
      assert.equal(await evaluate("document.querySelector('.visual-live').getAttribute('href')"), `/${item.collection}/${item.slug}/`, 'Public destination stays separate from the editor template');
      assert.equal(await evaluate("document.querySelector('.collection-panel').getBoundingClientRect().left >= document.querySelector('.visual-canvas').getBoundingClientRect().right - 1"), true);
      await evaluate(`window.collectionFrame = ${frame}; window.collectionDoc = ${frame}.contentDocument`);
      await click('[aria-label="Toggle properties panel"]');
      await waitFor("!document.querySelector('.collection-panel')");
      await evaluate("[...document.querySelectorAll('.mode-toggle button')].find(button => button.textContent === 'Edit').click()");
      await openProperties({ evaluate, waitFor });
      await waitFor("!!document.querySelector('.collection-panel')");
      await evaluate(`${frame}.contentDocument.querySelector('h1').click()`);
      await waitFor("document.activeElement?.closest('[data-collection-field]')?.dataset.collectionField === 'title'");
      const title = `Canvas ${item.collection} article`;
      await input('[data-collection-field="title"] input', title);
      await waitFor(`${frame}.contentDocument.querySelector('h1').textContent === ${JSON.stringify(title)}`);
      await evaluate(`${frame}.contentDocument.querySelector('[data-rigel-richtext="$body"] p').click()`);
      await waitFor("document.activeElement?.closest('[data-collection-field]')?.dataset.collectionField === '$body'");
      const body = `Canvas ${item.collection} body. A real article from the right properties panel.`;
      await evaluate("(() => { const root=document.querySelector('.block-content');root.focus();const range=document.createRange();range.selectNodeContents(root);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);})()");
      await cdp('Input.insertText', { text: body });
      await waitFor(`${frame}.contentDocument.querySelector('[data-rigel-richtext]').textContent.includes('from the right properties panel')`);
      assert.equal(await evaluate(`${frame} === window.collectionFrame && ${frame}.contentDocument === window.collectionDoc`), true);
      assert.equal(await readFile(item.file, 'utf8'), originals[fixtures.indexOf(item)], 'Draft does not touch disk');
      await click('#nav-pages');
      await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
      await evaluate("[...document.querySelectorAll('.unsaved-dialog button')].find(button => button.textContent === 'Keep editing').click()");
      await waitFor("!document.querySelector('.unsaved-dialog')");
      await waitFor("getComputedStyle(document.querySelector('.save-button')).backgroundColor === 'rgb(0, 90, 163)'");
      await writeFile(`_temp/collection-${item.collection}-canvas.png`, Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
      await click('.save-button');
      let saved = '';
      for (let i = 0; i < 100; i++) {
        saved = await readFile(item.file, 'utf8');
        if (saved.includes(title) && saved.includes(body.trim())) break;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      assert(saved.includes(title) && saved.includes(body.trim()), 'Explicit Save writes frontmatter and Lexical JSON');
      assert.equal(JSON.parse(saved).body.root.type, 'root');
      assert.equal(JSON.parse(saved).frontmatter.date, '2026-10-13', 'Save keeps YYYY-MM-DD storage');
      let html = '';
      const base = process.env.RIGEL_URL || 'http://127.0.0.1:4321/rigel/';
      for (let i = 0; i < 100; i++) {
        html = await (await fetch(new URL(`/${item.collection}/${item.slug}/`, base))).text();
        if (html.includes(title) && html.includes(body)) break;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      assert(html.includes(title) && html.includes(body), 'Actual public page renders saved article');
      await waitFor("document.querySelector('.save-status')?.textContent.trim() === 'Saved'");
      assert.deepEqual(await evaluate(`({ frame: ${frame} === window.collectionFrame, document: ${frame}.contentDocument === window.collectionDoc, src: new URL(${frame}.src).pathname })`), { frame: true, document: true, src: `/preview/${item.collection}/` }, 'Save keeps the canvas mounted');
      await cdp('Page.reload');
      await waitFor("!!document.querySelector('[data-doctype=author]')");
      await open(item);
      assert.equal(await evaluate("document.querySelector('[data-collection-field=title] input').value"), title);
      assert.equal(await evaluate("document.querySelector('[data-collection-field=date] .date-trigger').textContent.trim()"), 'October 13, 2026', 'ISO dates reload with the readable display');
      assert.equal(await evaluate("document.querySelector('.schema-panel').getBoundingClientRect().width"), 340, 'Reload resets the panel width');
      await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
      await waitFor('innerWidth === 390');
      assert.equal(await evaluate("getComputedStyle(document.querySelector('.properties-divider')).display"), 'none');
      assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true);
      assert.equal(await evaluate("document.querySelector('.collection-panel').getBoundingClientRect().top >= document.querySelector('.visual-canvas').getBoundingClientRect().bottom - 1"), true);
      await cdp('Emulation.clearDeviceMetricsOverride');
      await waitFor('innerWidth >= 1100');
    }
    console.log('PASS: Blog and News share the website canvas, right properties panel, click-to-field/body editing, panel toggle, iframe identity, unsaved guard, explicit Save/disk/public HTML/reload and mobile layout');
  } finally {
    await Promise.all(fixtures.map((item, index) => writeFile(item.file, originals[index])));
    await cdp('Page.reload');
    await waitFor("!!document.querySelector('[data-doctype=author]')");
  }
}
