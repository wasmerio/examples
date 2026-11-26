import assert from "node:assert/strict";
import { writeFile, rm } from "node:fs/promises";

export async function checkMenus({ cdp, evaluate, waitFor }) {
  await waitFor("!!document.querySelector('#nav-menus')");
  const slug = `rigel-menu-test-${Date.now()}`;
  const title = slug;
  const api = `/rigel/api/local/menus/${slug}`;
  const file = `src/content/menus/${slug}.json`;
  const declared = { slug, title, items: [] };
  const get = () => evaluate(`fetch(${JSON.stringify(api)}).then(r => r.json())`);
  const saved = async () => { await click('.save-button'); await waitFor("document.querySelector('.save-status')?.textContent.trim() === 'Saved'"); };
  const click = (selector) => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const input = (selector, value) => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); el.value = ${JSON.stringify(value)}; el.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  const pane = (id = '') => `.menu-pane[data-menu-parent="${id}"]`;
  const root = async () => { await click('[aria-label="Menu path"] [data-menu-path=""]'); await waitFor("document.querySelectorAll('.menu-pane').length === 1"); };
  const openItem = async (id, ancestors = []) => {
    await root();
    for (const item of [...ancestors, id]) {
      await click(`[data-menu-id="${item}"] .menu-open`);
      await waitFor(`!!document.querySelector(${JSON.stringify(`${pane(item)} [aria-label="Label for ${item}"]`)})`);
    }
  };
  const button = async (id, text) => evaluate(`(() => { const actions = document.querySelector(${JSON.stringify(`${pane(id)} .menu-actions`)}); actions.open = true; [...actions.querySelectorAll('button')].find(b => b.textContent.trim() === ${JSON.stringify(text)}).click(); })()`);
  const add = async (parent = '') => {
    const previous = await evaluate("document.querySelector('.menu-pane:last-child').dataset.menuParent");
    await click(`${pane(parent)} .menu-add`);
    await waitFor(`document.querySelector('.menu-pane:last-child')?.dataset.menuParent !== ${JSON.stringify(previous)} && document.querySelector('.menu-pane:last-child')?.dataset.menuParent !== ${JSON.stringify(parent)}`);
    return evaluate("document.querySelector('.menu-pane:last-child').dataset.menuParent");
  };
  const drag = async (id, targetId, position, allowed = true) => {
    const source = await evaluate(`(async () => { const el = document.querySelector('[data-menu-id="${id}"] .menu-drag'); el.scrollIntoView({ block: 'center' }); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
    await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', ...source });
    await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', ...source, button: 'left', buttons: 1, clickCount: 1 });
    await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: source.x + 12, y: source.y, button: 'left', buttons: 1 });
    try {
      await waitFor("!!document.querySelector('.menu-item.is-dragging')");
      assert.equal(await evaluate("!!document.querySelector('.menu-drops, [data-drop-position]')"), false, 'Dragging does not cover rows with drop buttons');
      const destination = await evaluate(`(() => { const el = document.querySelector('[data-menu-id="${targetId}"]'); el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height * ${position === 'before' ? 0.25 : 0.75} }; })()`);
      await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', ...destination, button: 'left', buttons: 1 });
      if (allowed) {
        await waitFor(`!!document.querySelector('[data-menu-id="${targetId}"].drop-${position}')`);
        assert.equal(await evaluate(`getComputedStyle(document.querySelector('[data-menu-id="${targetId}"]'), '${position === 'before' ? '::before' : '::after'}').height`), '3px', 'Drop position is a thin line');
        await writeFile('_temp/menu-reorder-line.png', Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
      } else {
        assert.equal(await evaluate("!!document.querySelector('.drop-before, .drop-after')"), false, 'Other lists cannot accept this drag');
      }
      await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', ...destination, button: 'left', buttons: 0, clickCount: 1 });
      await waitFor("!document.querySelector('.is-dragging, .drop-before, .drop-after')");
    } finally {
      await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', ...source, button: 'left', buttons: 0 });
    }
  };
  assert.equal(await evaluate(`fetch(${JSON.stringify(api)}, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: ${JSON.stringify(JSON.stringify(declared))} }).then(r => r.status)`), 405);
  assert.equal(await evaluate(`fetch(${JSON.stringify(api)}, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: ${JSON.stringify(JSON.stringify(declared))} }).then(r => r.status)`), 404);
  await writeFile(file, JSON.stringify(declared), { flag: 'wx' });
  try {
    await waitFor(`fetch('/rigel/manifest.json').then(r => r.json()).then(m => m.menus.entries.some(e => e.slug === ${JSON.stringify(slug)}))`);
    await cdp('Page.reload');
    await new Promise((resolve) => setTimeout(resolve, 600));
    await waitFor("!!document.querySelector('#nav-menus') && !!document.querySelector('#nav-pages') && !!document.querySelector('[data-doctype=author]')");
    await click('#nav-menus');
    await waitFor("document.querySelector('main h2')?.textContent === 'All Menus'");
    assert.deepEqual(await evaluate("[...document.querySelectorAll('th')].map(h => h.textContent.trim())"), ['Name', 'Slug']);
    assert.equal(await evaluate("!!document.querySelector('.titlebar .primary')"), false, 'Only developers can declare menus');
    await evaluate(`[...document.querySelectorAll('.table-link')].find(b => b.textContent === ${JSON.stringify(title)}).click()`);
    await waitFor("!!document.querySelector('.menu-editor')");
    assert.deepEqual(await evaluate("[...document.querySelectorAll('.menu-details label > span')].map(label => label.textContent)"), ['Slug', 'Name']);
    assert.equal(await evaluate("!!document.querySelector('[title=\"Delete menu\"]')"), false);
    assert.deepEqual(await get(), declared);
    assert.equal(await evaluate("document.querySelectorAll('.menu-pane').length"), 1);
    assert.equal(await evaluate("document.querySelector('.save-button').disabled"), true);
    const a = await add();
    await input(`[aria-label="Label for ${a}"]`, 'Parent');
    const child = await add(a);
    await input(`[aria-label="Label for ${child}"]`, 'Child');
    assert.equal(await evaluate("document.querySelector('.menu-pane[data-menu-parent=\"\"] .menu-add').disabled"), false);
    const b = await add();
    await input(`[aria-label="Label for ${b}"]`, 'Other');
    assert.equal(await evaluate(`document.querySelector('[data-menu-id="${b}"] .menu-open').textContent.includes('Other')`), true, 'Selected fields update the draft row live');
    assert.equal(await evaluate(`document.querySelector('${pane()} .menu-add').textContent.trim()`), 'Add item');
    assert.equal(await evaluate(`document.querySelector('${pane(b)} .menu-add').textContent.trim()`), 'Add child');
    assert.deepEqual(await get(), declared, 'Adding and editing items must not autosave');
    await saved();
    assert.equal((await get()).items[0].children[0].label, 'Child');
    await root();
    assert.deepEqual(await evaluate("[...document.querySelectorAll('.menu-item')].map(el => el.dataset.menuId)"), [a, b], 'Collapsed branches must not render descendants');
    await openItem(child, [a]);
    assert.deepEqual(await evaluate("[...document.querySelectorAll('.menu-pane')].map(el => el.dataset.menuParent)"), ['', a, child]);
    assert.deepEqual(await evaluate("[...document.querySelectorAll('[aria-label=\"Menu path\"] [data-menu-path]')].map(el => el.dataset.menuPath)"), ['', a, child]);
    await click(`[aria-label="Menu path"] [data-menu-path="${a}"]`);
    await waitFor("document.querySelectorAll('.menu-pane').length === 2");
    assert.equal(await evaluate("document.querySelector('.save-button').disabled"), true, 'Selection and breadcrumbs must not dirty the menu');
    assert.deepEqual(await get(), { ...declared, items: [{ id: a, label: 'Parent', url: '/', children: [{ id: child, label: 'Child', url: '/', children: [] }] }, { id: b, label: 'Other', url: '/', children: [] }] });
    assert.equal(await evaluate(`document.querySelector('[data-menu-id="${child}"]').dataset.parentId`), a);

    await drag(b, child, 'after', false);
    assert.equal(await evaluate("document.querySelector('.save-button').disabled"), true, 'Dragging into another panel does not reparent an item');
    await openItem(b);
    await button(b, 'Indent');
    await openItem(b, [a]);
    await button(b, 'Indent');
    await openItem(b, [a, child]);
    await waitFor(`document.querySelector('[data-menu-id="${b}"]')?.dataset.depth === '3'`);
    assert.equal(await evaluate(`document.querySelector('${pane(b)} .menu-add').disabled`), true);
    assert.equal(await evaluate("document.querySelector('.menu-pane[data-menu-parent=\"\"] .menu-add').disabled"), false);
    await saved();
    assert.equal((await get()).items[0].children[0].children[0].id, b);
    const newTabSwitch = `${pane(b)} input[role=switch]`;
    assert.equal(await evaluate(`document.querySelector(${JSON.stringify(newTabSwitch)}).checked`), false, 'Old menu items default to the same tab');
    await click(newTabSwitch);
    assert.equal((await get()).items[0].children[0].children[0].newTab, undefined, 'Link options do not autosave');
    await saved();
    assert.equal((await get()).items[0].children[0].children[0].newTab, true, 'Nested link options persist');
    const originalTheme = await evaluate('document.documentElement.dataset.theme');
    const themeColors = [];
    try {
      await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 960, deviceScaleFactor: 1, mobile: false });
      for (const theme of ['light', 'dark']) {
        await evaluate(`document.documentElement.dataset.theme = ${JSON.stringify(theme)}`);
        await new Promise(resolve => setTimeout(resolve, 250));
        const panes = await evaluate("[...document.querySelectorAll('.menu-pane')].map(el => { const r = el.getBoundingClientRect(); return { x: r.x, width: r.width, height: r.height }; })");
        assert.equal(panes.length, 4);
        assert.ok(panes.every((r, i) => r.width > 0 && r.height > 0 && (!i || r.x > panes[i - 1].x)), 'Desktop keeps the ancestor panes side by side');
        const colors = await evaluate(`(() => { const el = document.querySelector('[aria-label="Label for ${b}"]'); const s = getComputedStyle(el); return { text: s.color, background: s.backgroundColor, radius: s.borderRadius }; })()`);
        assert.notEqual(colors.text, colors.background, `${theme} fields must remain readable`);
        assert.equal(colors.radius, '0px');
        themeColors.push(colors);
        await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
        await waitFor("[...document.querySelectorAll('.menu-pane')].filter(el => el.getBoundingClientRect().width > 0).length === 1");
        assert.equal(await evaluate("[...document.querySelectorAll('.menu-pane')].find(el => el.getBoundingClientRect().width > 0).dataset.menuParent"), b);
        assert.equal(await evaluate("document.documentElement.scrollWidth <= window.innerWidth"), true, `${theme} mobile menu must not overflow the viewport`);
        assert.equal(await evaluate(`(() => { const r = document.querySelector('[aria-label="Label for ${b}"]').getBoundingClientRect(); return r.width > 0 && r.left >= 0 && r.right <= innerWidth; })()`), true);
        await click(`[aria-label="Menu path"] [data-menu-path="${a}"]`);
        await waitFor(`document.querySelector('.menu-pane:last-child')?.dataset.menuParent === '${a}'`);
        assert.equal(await evaluate("[...document.querySelectorAll('.menu-pane')].filter(el => el.getBoundingClientRect().width > 0).length"), 1);
        await openItem(b, [a, child]);
        assert.equal(await evaluate("document.querySelector('.save-button').disabled"), true, 'Mobile navigation must not dirty the menu');
        await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 960, deviceScaleFactor: 1, mobile: false });
      }
      assert.notEqual(themeColors[0].background, themeColors[1].background, 'Menu fields must follow light/dark theme');
    } finally {
      await evaluate(`document.documentElement.dataset.theme = ${JSON.stringify(originalTheme)}`);
      await cdp('Emulation.clearDeviceMetricsOverride');
    }
    await openItem(child, [a]);
    await drag(a, b, 'after', false);
    assert.equal(await evaluate("document.querySelector('.save-button').disabled"), true, 'Dragging a parent across panes is inert');
    assert.equal((await get()).items[0].children[0].children[0].id, b);
    await openItem(b, [a, child]);
    await button(b, 'Outdent');
    await openItem(b, [a]);
    await waitFor(`document.querySelector('[data-menu-id="${b}"]')?.dataset.depth === '2'`);
    await button(b, 'Outdent');
    await openItem(b);
    await waitFor(`document.querySelector('[data-menu-id="${b}"]')?.dataset.depth === '1'`);
    await drag(b, a, 'before');
    await saved();
    assert.equal((await get()).items[0].id, b);
    await drag(b, a, 'after');
    await saved();
    assert.equal((await get()).items[1].id, b);
    await openItem(b);
    await button(b, 'Up');
    await saved();
    assert.equal((await get()).items[0].id, b);
    await openItem(b);
    await button(b, 'Down');
    await saved();
    assert.equal((await get()).items[1].id, b);
    await openItem(b);
    await button(b, 'Indent');
    await openItem(b, [a]);
    await saved();
    assert.equal((await get()).items[0].children[1].id, b);
    await button(b, 'Outdent');
    await openItem(b);
    await button(b, 'Up');
    await saved();
    assert.equal((await get()).items[0].id, b);
    await openItem(a);
    await button(a, 'Remove');
    await waitFor("!!document.querySelector('.action-dialog[open]')");
    assert.equal(await evaluate("document.querySelector('.action-dialog').textContent.includes('all its children')"), true);
    await click('.action-dialog [aria-label=Cancel]');
    assert.equal(await evaluate("document.querySelectorAll('[data-menu-id]').length"), 3);
    await button(a, 'Remove');
    await waitFor("!!document.querySelector('.action-dialog[open]')");
    await click('.action-dialog [type=submit]');
    await waitFor("document.querySelectorAll('[data-menu-id]').length === 1");
    assert.equal((await get()).items.length, 2, 'Removing items only changes the draft until Save');
    await saved();
    assert.equal((await get()).items.length, 1);
    assert.deepEqual(await evaluate("[...document.querySelectorAll('.menu-pane')].map(el => el.dataset.menuParent)"), [''], 'Removing the selected subtree must reset to its surviving parent');
    await openItem(b);

    await input(`[aria-label="URL for ${b}"]`, 'javascript:alert(1)');
    await click('.save-button');
    await waitFor("document.querySelector('.save-status')?.textContent.trim() === 'Save failed'");
    await click('#nav-pages');
    await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
    assert.equal(await evaluate("!!document.querySelector('.menu-editor')"), true, 'Failed saves must keep the draft open');
    await click('.unsaved-dialog [aria-label="Keep editing"]');
    await input(`[aria-label="URL for ${b}"]`, '/safe');
    await saved();
    assert.equal((await get()).items[0].url, '/safe');
    await evaluate(`window.menuOriginalFetch = window.fetch; window.fetch = async (...args) => { if (args[0] === ${JSON.stringify(api)} && args[1]?.method === 'PUT') { window.menuWriteStarted = true; await new Promise(r => setTimeout(r, 350)); } return window.menuOriginalFetch(...args); };`);
    await input(`[aria-label="Label for ${b}"]`, 'First snapshot');
    await click('.save-button');
    await waitFor("window.menuWriteStarted === true");
    await input(`[aria-label="Label for ${b}"]`, 'Latest snapshot');
    await waitFor("document.querySelector('.save-button')?.disabled === false");
    assert.equal((await get()).items[0].label, 'First snapshot', 'Edits during Save require another explicit Save');
    await saved();
    assert.equal((await get()).items[0].label, 'Latest snapshot');
    await evaluate('window.fetch = window.menuOriginalFetch');

    const invalid = { slug, title, items: [{ id: 'l1', label: '1', url: '/', children: [{ id: 'l2', label: '2', url: '/', children: [{ id: 'l3', label: '3', url: '/', children: [{ id: 'l4', label: '4', url: '/', children: [] }] }] }] }] };
    assert.equal(await evaluate(`fetch(${JSON.stringify(api)}, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: ${JSON.stringify(JSON.stringify(invalid))} }).then(r => r.status)`), 400);
    assert.equal((await get()).items[0].id, b, 'Rejected depth must leave file intact');

    await input(`[aria-label="Label for ${b}"]`, 'Saved before navigation');
    await click('#nav-pages');
    await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
    await click('.unsaved-dialog .primary');
    await waitFor("!!document.querySelector('#nav-pages.active') && !!document.querySelector('.table-card') && !document.querySelector('.unsaved-dialog[open]')");
    assert.equal((await get()).items[0].label, 'Saved before navigation');
    await cdp('Page.reload');
    await waitFor("!!document.querySelector('#nav-menus')");
    await click('#nav-menus');
    await waitFor("document.querySelector('main h2')?.textContent === 'All Menus'");
    await evaluate(`[...document.querySelectorAll('.table-link')].find(b => b.textContent === ${JSON.stringify(title)}).click()`);
    await waitFor("!!document.querySelector('.menu-editor')");
    await openItem(b);
    assert.equal(await evaluate(`document.querySelector('[aria-label="Label for ${b}"]').value`), 'Saved before navigation');
    assert.equal(await evaluate(`document.querySelector(${JSON.stringify(newTabSwitch)}).checked`), true, 'New-tab preference survives moving and reload');
    await click(newTabSwitch);
    await saved();
    assert.equal((await get()).items[0].newTab, false, 'Turning new-tab off persists explicitly');
    await cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 1400, deviceScaleFactor: 1, mobile: false });
    await evaluate('window.scrollTo(0, 0)');
    const shot = await cdp('Page.captureScreenshot', { format: 'png' });
    await writeFile('_temp/menu-editor.png', Buffer.from(shot.data, 'base64'));
    await cdp('Emulation.clearDeviceMetricsOverride');
    assert.equal(await evaluate("!!document.querySelector('[title=\"Delete menu\"]')"), false);
    const persisted = await get();
    assert.equal(await evaluate(`fetch(${JSON.stringify(api)}, { method: 'DELETE' }).then(r => r.status)`), 405);
    assert.equal(await evaluate(`fetch(${JSON.stringify(api)}, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: ${JSON.stringify(JSON.stringify(declared))} }).then(r => r.status)`), 405);
    assert.deepEqual(await get(), persisted, 'Forbidden creation/deletion must leave the saved menu untouched');
    const footer = await evaluate("fetch('/rigel/api/local/menus/footer').then(r => r.json())");
    try {
      const changed = JSON.parse(JSON.stringify(footer));
      changed.items[0].label = 'Menu rendering regression';
      changed.items[0].newTab = true;
      assert.equal(await evaluate(`fetch('/rigel/api/local/menus/footer', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: ${JSON.stringify(JSON.stringify(changed))} }).then(r => r.status)`), 204);
      assert.equal((await evaluate("fetch('/rigel/api/local/menus/footer').then(r => r.json())")).items[0].newTab, true);
      await waitFor("fetch('/about').then(r => r.text()).then(html => { const doc = new DOMParser().parseFromString(html, 'text/html'); const link = [...doc.querySelectorAll('footer a')].find(a => a.textContent === 'Menu rendering regression'); return link?.target === '_blank' && link.relList.contains('noopener') && link.relList.contains('noreferrer'); })");
      changed.items[0].newTab = false;
      assert.equal(await evaluate(`fetch('/rigel/api/local/menus/footer', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: ${JSON.stringify(JSON.stringify(changed))} }).then(r => r.status)`), 204);
      assert.equal((await evaluate("fetch('/rigel/api/local/menus/footer').then(r => r.json())")).items[0].newTab, false);
      await waitFor("fetch('/about').then(r => r.text()).then(html => { const doc = new DOMParser().parseFromString(html, 'text/html'); const link = [...doc.querySelectorAll('footer a')].find(a => a.textContent === 'Menu rendering regression'); return !!link && !link.hasAttribute('target') && !link.hasAttribute('rel'); })");
    } finally {
      assert.equal(await evaluate(`fetch('/rigel/api/local/menus/footer', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: ${JSON.stringify(JSON.stringify(footer))} }).then(r => r.status)`), 204);
      assert.deepEqual(await evaluate("fetch('/rigel/api/local/menus/footer').then(r => r.json())"), footer);
    }
    console.log('PASS: developer-declared menus, pane navigation without dirtying, mobile/light/dark layout, API guards, item editing/removal, explicit Save snapshots, real mouse moves, depth checks, persistence and footer rendering');
  } catch (error) {
    console.error(await evaluate("({ title: document.querySelector('main')?.textContent, overlay: document.querySelector('vite-error-overlay')?.shadowRoot?.textContent })"));
    throw error;
  } finally {
    await rm(file);
    assert.equal(await evaluate(`fetch(${JSON.stringify(api)}).then(r => r.status)`), 404);
    await cdp('Page.reload');
    await waitFor("!!document.querySelector('#nav-pages')");
  }
}
