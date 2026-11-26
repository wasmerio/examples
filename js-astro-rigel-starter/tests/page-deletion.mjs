import assert from 'node:assert/strict';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { openProperties, chooseSelect } from './editor-controls.mjs';

export async function checkPageDeletion({ cdp, evaluate, waitFor }) {
  const slug = 'browser-delete-check';
  const file = `src/content/pages/${slug}.json`;
  await assert.rejects(readFile(file), { code: 'ENOENT' });
  const manifest = await evaluate("fetch('/rigel/manifest.json').then(response => response.json())");
  const protectedPages = manifest.documents.filter(doc => manifest.schema.documents.find(type => type.name === doc.type)?.protectedSlugs?.includes(doc.slug));
  const originals = new Map(await Promise.all(protectedPages.map(async doc => {
    const type = manifest.schema.documents.find(type => type.name === doc.type);
    const path = `${type.folder}/${doc.slug}.json`;
    return [path, await readFile(path)];
  })));
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const input = (selector, value) => evaluate(`(() => { const input = document.querySelector(${JSON.stringify(selector)}); input.value = ${JSON.stringify(value)}; input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  const pageTab = async () => {
    await openProperties({ evaluate, waitFor });
    await click('#properties-tab-page');
  };
  const open = async pageSlug => {
    await click('#nav-pages');
    await waitFor("!!document.querySelector('tbody .table-link')");
    await evaluate(`[...document.querySelectorAll('tbody tr')].find(row => row.cells[1].textContent.trim() === ${JSON.stringify(pageSlug)}).querySelector('.table-link').click()`);
    await waitFor("document.querySelector('.canvas-stage')?.dataset.ready === 'true'");
    await pageTab();
  };
  const create = async () => {
    await click('#nav-pages');
    await waitFor("!!document.querySelector('.titlebar .primary')");
    await click('.titlebar .primary');
    await waitFor("!!document.querySelector('.action-dialog[open] input')");
    await input('.action-dialog input', 'Browser delete check');
    await chooseSelect({ evaluate, waitFor }, '.action-dialog [role=combobox]', 'Core');
    await click('.action-dialog [type=submit]');
    await waitFor("!!document.querySelector('.visual-editor') && !document.querySelector('.action-dialog')");
    await pageTab();
  };
  const remove = '#properties-page .danger-btn';
  let owned = false;
  try {
    await open('home');
    for (const theme of ['light', 'dark']) {
      await evaluate(`document.documentElement.dataset.theme = '${theme}'`);
      for (const width of [1280, 390]) {
        await cdp('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: false });
        assert.equal(await evaluate(`document.querySelector('${remove}').disabled`), true);
        assert.equal(await evaluate("document.querySelector('#page-delete-notice').textContent"), 'This page is part of the website and cannot be deleted.');
        assert.equal(await evaluate(`(() => { const button = document.querySelector('${remove}'); return button.getAttribute('aria-describedby') === 'page-delete-notice' && getComputedStyle(button).cursor === 'not-allowed'; })()`), true);
        await evaluate(`document.querySelector('${remove}').scrollIntoView({ block: 'center' })`);
        await writeFile(`_temp/protected-page-${theme}-${width}.png`, Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
      }
    }
    await cdp('Emulation.clearDeviceMetricsOverride');
    await evaluate("document.documentElement.dataset.theme = 'light'");
    const status = await evaluate("fetch('/rigel/api/local/documents/page%3Ahome', { method: 'DELETE' }).then(response => response.status)");
    assert.equal(status, 403, 'The API protects required pages independently of disabled controls');
    await input('#properties-page input:not([readonly])', 'changed-home');
    assert.equal(await evaluate(`document.querySelector('${remove}').disabled`), true, 'Changing the public slug cannot remove stable-ID protection');
    await click('#nav-pages');
    await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
    await evaluate("[...document.querySelectorAll('.unsaved-dialog button')].find(button => button.textContent === 'Discard changes').click()");
    await waitFor("!!document.querySelector('tbody .table-link')");

    await create();
    assert.equal(await evaluate(`document.querySelector('${remove}').disabled`), false);
    await assert.rejects(readFile(file), { code: 'ENOENT' });
    await click(remove);
    await waitFor("!!document.querySelector('.action-dialog[open]')");
    await click('.action-dialog [type=submit]');
    await waitFor("!!document.querySelector('tbody .table-link')");
    await assert.rejects(readFile(file), { code: 'ENOENT' });

    await create();
    owned = true;
    await click('.save-button');
    await waitFor("document.querySelector('.save-status')?.textContent.trim() === 'Saved'");
    const saved = await readFile(file);
    await cdp('Page.reload');
    await waitFor("!!document.querySelector('#nav-pages')");
    await open(slug);
    assert.equal(await evaluate(`document.querySelector('${remove}').disabled`), false, 'User pages remain deletable after Save and reload');
    assert.equal(await evaluate("!!document.querySelector('.titlebar .danger-btn, .titlebar .icon-btn')"), false);
    await click(remove);
    await waitFor("!!document.querySelector('.action-dialog[open]')");
    await click('.action-dialog [aria-label=Cancel]');
    assert((await readFile(file)).equals(saved), 'Cancel preserves the saved page');
    await click(remove);
    await waitFor("!!document.querySelector('.action-dialog[open]')");
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', windowsVirtualKeyCode: 27 });
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', windowsVirtualKeyCode: 27 });
    await waitFor("!document.querySelector('.action-dialog')");
    assert((await readFile(file)).equals(saved), 'Escape preserves the saved page');
    await evaluate("window.pageDeleteFetch = window.fetch; window.failPageDelete = true; window.fetch = (...args) => window.failPageDelete && String(args[0]).includes('/documents/') && args[1]?.method === 'DELETE' ? Promise.resolve(new Response('Retry deletion', { status: 503 })) : window.pageDeleteFetch(...args)");
    await click(remove);
    await waitFor("!!document.querySelector('.action-dialog[open]')");
    await click('.action-dialog [type=submit]');
    await waitFor("document.querySelector('.action-dialog [role=alert]')?.textContent === 'Retry deletion'");
    assert((await readFile(file)).equals(saved), 'Failed deletion retains the page and confirmation dialog');
    await evaluate('window.failPageDelete = false');
    await click('.action-dialog [type=submit]');
    await waitFor("!document.querySelector('.action-dialog') && !!document.querySelector('tbody .table-link')");
    await assert.rejects(readFile(file), { code: 'ENOENT' });
    owned = false;
    await evaluate('window.fetch = window.pageDeleteFetch');
    await waitFor(`fetch('/rigel/manifest.json').then(response => response.json()).then(manifest => !manifest.documents.some(doc => doc.id === 'page:${slug}'))`);
    await cdp('Page.reload');
    await waitFor("!!document.querySelector('#nav-pages')");
    assert.equal(await evaluate(`fetch('/rigel/api/local/documents/page%3A${slug}').then(response => response.status)`), 404);
    for (const [path, bytes] of originals) assert((await readFile(path)).equals(bytes), `${path} remains byte-identical`);
    console.log('PASS: required pages stay protected in UI/API, stable-ID protection, light/dark/mobile notice, unsaved discard, create/Save/reload/delete, Cancel/Escape, failed deletion/retry and unchanged required pages');
  } finally {
    await cdp('Emulation.clearDeviceMetricsOverride');
    await evaluate('if (window.pageDeleteFetch) window.fetch = window.pageDeleteFetch');
    if (owned) await rm(file, { force: true });
    await cdp('Page.reload');
    await waitFor("!!document.querySelector('#nav-pages')");
  }
}
