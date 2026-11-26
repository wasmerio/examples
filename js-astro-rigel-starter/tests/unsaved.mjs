import assert from "node:assert/strict";
import { openProperties } from './editor-controls.mjs';
import { writeFile } from "node:fs/promises";

export async function checkUnsaved({ cdp, evaluate, waitFor }) {
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const field = 'main [data-schema-path="title"] input, main [data-collection-field="title"] input, main .menu-details input:not([readonly])';
  const value = () => evaluate(`document.querySelector(${JSON.stringify(field)}).value`);
  const edit = text => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(field)}); el.value = ${JSON.stringify(text)}; el.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  const choice = text => evaluate(`[...document.querySelectorAll('.unsaved-dialog button')].find(b => b.textContent.trim() === ${JSON.stringify(text)}).click()`);
  const key = async (name, code) => {
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: name, code, windowsVirtualKeyCode: name === 'Escape' ? 27 : 9 });
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: name, code });
  };
  const count = () => evaluate('window.explicitWrites.length');
  const openRow = async (selector) => {
    const slug = selector === '#nav-pages' ? 'contact' : selector === '#nav-menus' ? 'footer' : null;
    if (slug) {
      await waitFor(`[...document.querySelectorAll('tbody tr')].some(row => row.cells[1].textContent.trim() === ${JSON.stringify(slug)})`);
      await evaluate(`[...document.querySelectorAll('tbody tr')].find(row => row.cells[1].textContent.trim() === ${JSON.stringify(slug)}).querySelector('.table-link').click()`);
    } else await click('.table-link');
    if (selector !== '#nav-menus') {
      await waitFor("document.querySelector('.canvas-stage')?.dataset.ready === 'true'");
      await openProperties({ evaluate, waitFor });
    }
  };
  const checkPosition = async () => assert.equal(await evaluate("(() => { const r = document.querySelector('dialog[open] .rigel-modal').getBoundingClientRect(); return Math.abs(r.x + r.width / 2 - innerWidth / 2) < 1 && Math.abs(r.y - innerHeight * 0.1) < 1 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth; })()"), true, 'Confirmation modals align with the search palette and fit the viewport');
  await evaluate(`window.explicitWrites = []; window.explicitOriginalFetch = window.fetch; window.fetch = async (...args) => {
    if (String(args[0]).startsWith('/rigel/api/local/') && ['POST', 'PUT', 'DELETE'].includes(args[1]?.method)) {
      window.explicitWrites.push({ url: args[0], body: args[1].body ? JSON.parse(args[1].body) : null });
      return new Response(window.failExplicitSave ? 'Test save failure' : null, { status: window.failExplicitSave ? 500 : 204 });
    }
    return window.explicitOriginalFetch(...args);
  }`);
  try {
    for (const selector of ['#nav-pages', '[data-collection="blog"]', '[data-collection="news"]', '#nav-menus']) {
      const open = async () => {
        await click(selector);
        await waitFor("!!document.querySelector('.table-link')");
        await openRow(selector);
        await waitFor(`!!document.querySelector(${JSON.stringify(field)})`);
      };
      await open();
      const original = await value();
      const before = await count();
      assert.equal(await evaluate("document.querySelector('.save-button').disabled"), true);
      await edit('Unsaved change');
      await evaluate('new Promise(r => setTimeout(r, 1100))');
      assert.equal(await count(), before, `${selector}: edits must not autosave`);
      assert.equal(await evaluate("window.dispatchEvent(new Event('beforeunload', { cancelable: true }))"), false);
      await click('.brand');
      await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
      assert.equal(await evaluate("document.activeElement.textContent.trim()"), 'Keep editing');
      await checkPosition();
      if (selector === '#nav-pages') {
        for (const [width, height] of [[390, 844], [844, 390]]) {
          await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
          await checkPosition();
        }
        await cdp('Emulation.clearDeviceMetricsOverride');
      }
      for (let i = 0; i < 5; i++) { await key('Tab', 'Tab'); assert.equal(await evaluate("document.activeElement === document.body || !!document.activeElement.closest('.unsaved-dialog')"), true); }
      await click('.unsaved-dialog [aria-label="Keep editing"]');
      await waitFor("!document.querySelector('.unsaved-dialog')");
      assert.equal(await value(), 'Unsaved change');
      await click('.brand');
      await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
      await key('Escape', 'Escape');
      await waitFor("!document.querySelector('.unsaved-dialog')");
      assert.equal(await value(), 'Unsaved change');
      await click(selector);
      await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
      await choice('Discard changes');
      await waitFor("!!document.querySelector('.table-link')");
      await openRow(selector);
      await waitFor(`!!document.querySelector(${JSON.stringify(field)})`);
      assert.equal(await value(), original);
      assert.equal(await count(), before, 'Discard must not write');
      await edit('Saved through dialog');
      await click(selector);
      await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
      await evaluate('window.failExplicitSave = true');
      await choice('Save and leave');
      await waitFor("document.querySelector('.unsaved-dialog [role=alert]')?.textContent === 'Test save failure'");
      assert.equal(await value(), 'Saved through dialog');
      await evaluate('window.failExplicitSave = false');
      const screenshot = await cdp('Page.captureScreenshot', { format: 'png' });
      await writeFile('_temp/unsaved-changes.png', Buffer.from(screenshot.data, 'base64'));
      await choice('Save and leave');
      await waitFor("!document.querySelector('.unsaved-dialog') && !!document.querySelector('.table-link')");
      await openRow(selector);
      await waitFor(`!!document.querySelector(${JSON.stringify(field)})`);
      assert.equal(await value(), 'Saved through dialog');
      await edit('Saved explicitly');
      await click('.save-button');
      await waitFor("document.querySelector('.save-status')?.textContent.trim() === 'Saved'");
      assert.equal(await value(), 'Saved explicitly');
      assert.equal(await evaluate("window.dispatchEvent(new Event('beforeunload', { cancelable: true }))"), true);
      await edit('Reverted draft');
      await edit('Saved explicitly');
      assert.equal(await evaluate("document.querySelector('.save-button').disabled"), true);
      await click('.brand');
      await waitFor("!!document.querySelector('.welcome')");
    }
    for (const selector of ['[data-collection="blog"]', '[data-collection="news"]']) {
      await click(selector);
      await waitFor("!!document.querySelector('.titlebar .primary')");
      const before = await count();
      await click('.titlebar .primary');
      await waitFor("!!document.querySelector('.action-dialog input')");
      await evaluate("(() => { const input = document.querySelector('.action-dialog input'); input.value = '!!!'; input.dispatchEvent(new Event('input', { bubbles: true })); })()");
      await checkPosition();
      await click('.action-dialog [type=submit]');
      await waitFor("document.querySelector('.action-dialog [role=alert]')?.textContent.includes('letters or numbers')");
      await evaluate("(() => { const input = document.querySelector('.action-dialog input'); input.value = 'Unsaved creation'; input.dispatchEvent(new Event('input', { bubbles: true })); })()");
      await click('.action-dialog [type=submit]');
      await waitFor("!!document.querySelector('.save-button')");
      assert.equal(await evaluate("document.querySelector('.save-button').disabled"), false);
      assert.equal(await count(), before, 'Creation must wait for Save');
      await click('.brand');
      await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
      await choice('Discard changes');
      await waitFor("!!document.querySelector('.welcome')");
      assert.equal(await count(), before);
      await click(selector);
      await waitFor("!!document.querySelector('.titlebar .primary')");
      await click('.titlebar .primary');
      await waitFor("!!document.querySelector('.action-dialog input')");
      await evaluate("(() => { const input = document.querySelector('.action-dialog input'); input.value = 'Unsaved creation'; input.dispatchEvent(new Event('input', { bubbles: true })); })()");
      await click('.action-dialog [type=submit]');
      await waitFor("!!document.querySelector('.save-button')");
      await click('.save-button');
      await waitFor("document.querySelector('.save-status')?.textContent.trim() === 'Saved'");
      assert.equal(await count(), before + 1, 'First Save creates the new entry exactly once');
      await click('.brand');
      await waitFor("!!document.querySelector('.welcome')");
    }
    for (const collection of ['blog', 'news']) {
      await click(`[data-collection="${collection}"]`);
      await waitFor("!!document.querySelector('.table-link')");
      await evaluate("[...document.querySelectorAll('.table-link')].find(b => b.textContent === 'Unsaved creation').click()");
      await waitFor("!!document.querySelector('.canvas-stage')");
      await openProperties({ evaluate, waitFor });
      await click('#properties-tab-page');
      await waitFor("!!document.querySelector('#properties-page [aria-label=\"Delete post\"]')");
      const before = await count();
      await click('[aria-label="Delete post"]');
      await waitFor("!!document.querySelector('.action-dialog[open]')");
      assert.equal(await count(), before);
      await checkPosition();
      await click('.action-dialog [aria-label=Cancel]');
      assert.equal(await value(), 'Unsaved creation');
      await click('[aria-label="Delete post"]');
      await waitFor("!!document.querySelector('.action-dialog[open]')");
      await key('Escape', 'Escape');
      await waitFor("!document.querySelector('.action-dialog')");
      assert.equal(await count(), before);
      await click('[aria-label="Delete post"]');
      await waitFor("!!document.querySelector('.action-dialog[open]')");
      await evaluate('window.failExplicitSave = true');
      await click('.action-dialog [type=submit]');
      await waitFor("!!document.querySelector('.action-dialog [role=alert]')");
      assert.equal(await value(), 'Unsaved creation');
      await evaluate('window.failExplicitSave = false');
      await click('.action-dialog [type=submit]');
      await waitFor("!document.querySelector('.action-dialog') && !!document.querySelector('.table-link')");
      assert.equal(await count(), before + 2);
      assert.equal(await evaluate("[...document.querySelectorAll('.table-link')].some(b => b.textContent === 'Unsaved creation')"), false);
    }
    await click('#nav-pages');
    await waitFor("!!document.querySelector('.table-link')");
    await openRow('#nav-pages');
    await waitFor(`!!document.querySelector(${JSON.stringify(field)})`);
    const beforeSettings = await count();
    await edit('Unsaved before settings');
    await click('.user-btn');
    await waitFor("!!document.querySelector('.user-menu')");
    await evaluate("[...document.querySelectorAll('.user-menu button')].find(b => b.textContent.trim() === 'Settings').click()");
    await waitFor("!!document.querySelector('.settings-modal')");
    assert.equal(await evaluate("!!document.querySelector('.unsaved-dialog')"), false);
    assert.equal(await value(), 'Unsaved before settings');
    await click('.settings-head .close');
    assert.equal(await value(), 'Unsaved before settings');
    assert.equal(await count(), beforeSettings, 'Settings must neither save nor discard the draft');
    await edit('Unsaved before search');
    await click('.search-trigger');
    await waitFor("!!document.querySelector('.palette')");
    await evaluate("const search = document.querySelector('.palette input'); search.value = 'Blogs'; search.dispatchEvent(new Event('input', { bubbles: true }));");
    await waitFor("[...document.querySelectorAll('.palette li button')].some(button => button.textContent.includes('Collection'))");
    await evaluate("[...document.querySelectorAll('.palette li button')].find(b => b.textContent.includes('Collection')).click()");
    await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
    await choice('Keep editing');
    assert.equal(await value(), 'Unsaved before search');
    await click('.back button');
    await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
    await choice('Discard changes');
    await waitFor("!!document.querySelector('.table-link')");
    console.log('PASS: explicit Save for pages/blogs/news/menus, no autosave, unsaved modal Save/Discard/X/Escape, focus trap, error retention, settings preserves drafts, new-entry drafts and unload protection (mocked writes)');
  } finally {
    await evaluate('window.fetch = window.explicitOriginalFetch');
    await click('.brand');
    if (await evaluate("!!document.querySelector('.unsaved-dialog')")) await choice('Discard changes');
    await cdp('Page.reload');
    await waitFor("!!document.querySelector('#nav-pages')");
  }
}
