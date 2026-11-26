import assert from "node:assert/strict";
import { chooseSelect, openProperties } from './editor-controls.mjs';
import { writeFile } from "node:fs/promises";

export async function checkPages({ cdp, evaluate, waitFor }) {
  await waitFor("!!document.querySelector('[data-doctype=author]')");
  assert.equal(await evaluate("document.querySelectorAll('.rail-scroll [aria-expanded]').length"), 0);
  const manifest = await evaluate("fetch('/rigel/manifest.json').then(r => r.json())");
  await checkEditorActions({ cdp, evaluate, waitFor });
  assert.equal(await evaluate("!!document.querySelector('.content-header')"), false);
  await evaluate("document.querySelector('#nav-pages').click()");
  await chooseSelect({ evaluate, waitFor }, '[role=combobox][aria-label="Category"]', 'All pages');
  await waitFor("document.querySelector('main h2')?.textContent === 'All pages'");
  const pageDocuments = manifest.documents.filter(doc => !manifest.schema.documents.find(type => type.name === doc.type).shared);
  assert.equal(await evaluate("document.querySelectorAll('tbody tr').length"), manifest.pages.filter(page => !page.shared).length + pageDocuments.length);
  assert.equal(await evaluate("[...document.querySelectorAll('.table-link')].some(button => button.textContent.trim() === 'Footer')"), false);
  assert.deepEqual(await evaluate("[...document.querySelectorAll('.sidebar-heading')].map(heading => heading.textContent)"), ['Website', 'Shared content', 'Assets']);
  assert.equal(await evaluate("document.querySelectorAll('.rail-scroll .count, #nav-all').length"), 0, 'Sidebar contains labels only, without counts or All content');
  await evaluate("document.querySelector('[data-document=\"settings:site\"]').click()");
  await waitFor("document.querySelector('.titlebar h2')?.textContent === 'Site settings'");
  assert.equal(await evaluate("document.querySelector('[data-document=\"settings:site\"]').getAttribute('aria-current')"), 'page');
  assert.equal(await evaluate("!!document.querySelector('[data-page=footer], [data-doctype=settings], main > .titlebar > .primary, main > table, .visual-editor, .site-preview')"), false, 'Settings opens directly without a collection or legacy footer preview');
  assert.equal(await evaluate("document.querySelector('[data-document=\"settings:site\"]').querySelector('.count')"), null);
  assert.equal(await evaluate("document.querySelector('[data-document=\"settings:site\"]').previousElementSibling.matches('hr') && document.querySelector('[data-document=\"settings:site\"]').previousElementSibling.previousElementSibling.id === 'nav-media'"), true, 'Site settings sits separately after Assets/Media');
  const settingsFields = manifest.schema.documents.find(type => type.name === 'settings').fields.map(field => field.key);
  assert.deepEqual(settingsFields, ['siteName', 'copyright', 'metaDescription'], 'Site settings contains real global website settings only');
  assert.equal(await evaluate("!!document.querySelector('[data-schema-path=mapsApiKey], [data-schema-path=analyticsSnippet], [data-schema-path=maxGuests]')"), false, 'Test controls do not leak into Site settings');
  assert.equal(await evaluate("document.querySelector('.back button').textContent.trim()"), '← Back to Welcome');
  await evaluate("document.querySelector('.back button').click()");
  await waitFor("!!document.querySelector('.welcome')");
  const demo = manifest.schema.documents.find(type => type.demo);
  if (demo) {
    await evaluate("document.querySelector('[data-document=\"demo:fields\"]').click()");
    await waitFor("document.querySelector('.titlebar h2')?.textContent === 'Demo'");
    assert.equal(await evaluate("!!document.querySelector('.document-form') && !document.querySelector('.visual-editor, .site-preview')"), true);
    for (const field of demo.fields) assert.equal(await evaluate(`!!document.querySelector('[data-schema-path="${field.key}"]')`), true, `Demo exposes ${field.type}: ${field.key}`);
    assert.equal(await evaluate("document.querySelector('[data-document=\"demo:fields\"]').querySelector('.count')"), null);
    assert.equal(await evaluate("document.querySelector('.save-button').disabled"), true, 'Opening Demo does not dirty the record');
    assert.equal(await evaluate("document.querySelector('.shared-badge').textContent.includes('separate from your website settings')"), true);
    await evaluate("document.querySelector('[data-document=\"demo:fields\"]').scrollIntoView({block:'nearest'})");
    await writeFile('_temp/demo-fields.png', Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
  } else {
    assert.equal(await evaluate("!!document.querySelector('[data-document=\"demo:fields\"], [data-doctype=demo]')"), false, 'Disabled Demo has no sidebar entry');
    assert.equal(await evaluate("fetch('/rigel/api/local/documents/demo:fields').then(response => response.status)"), 404, 'Disabled Demo is not readable through the local API');
  }
  await evaluate("document.querySelector('#nav-pages').click()");
  await chooseSelect({ evaluate, waitFor }, '[role=combobox][aria-label="Category"]', 'All pages');
  await waitFor("document.querySelector('main h2')?.textContent === 'All pages'");
  assert.equal(await evaluate("document.querySelector('main').classList.contains('wide')"), true);
  assert.equal(await evaluate("document.querySelector('.titlebar .primary')?.textContent"), "Add new");
  const checkColumns = async () => {
    assert.deepEqual(await evaluate("[...document.querySelectorAll('.table-sort')].slice(0, 2).map(b => b.textContent.trim())"), ['Title', 'Slug']);
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.table-link')).color === getComputedStyle(document.querySelector('tbody td')).color"), true);
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.table-link')).fontWeight"), '400');
  };
  await checkColumns();
  await evaluate("document.querySelectorAll('.table-sort')[1].click(); document.querySelectorAll('.table-sort')[1].click()");
  await waitFor("document.querySelectorAll('th')[1].getAttribute('aria-sort') === 'descending'");
  assert.deepEqual(await evaluate("[...document.querySelectorAll('tbody tr')].map(r => r.cells[1].textContent.trim())"), [...manifest.pages.filter(page => !page.shared).map(p => p.slug), ...pageDocuments.map(doc => doc.slug)].sort((a, b) => b.localeCompare(a)));
  await evaluate("document.querySelector('.table-link').focus()");
  await cdp("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, text: "\r" });
  await cdp("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await waitFor("!!document.querySelector('main .back')");
  assert.equal(await evaluate("!!document.querySelector('.editor-actions .save-status')"), true);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.back button')).borderTopStyle"), "solid");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.back button')).borderTopWidth"), "1px");
  assert.match(await evaluate("document.querySelector('.back button').textContent"), /← Back to /);
  assert.equal(await evaluate(`(() => {
    const save = document.querySelector('.save-button').getBoundingClientRect();
    const status = document.querySelector('.save-status').getBoundingClientRect();
    const bar = document.querySelector('.editor-actions').getBoundingClientRect();
    const back = document.querySelector('.back button').getBoundingClientRect();
    return status.right < save.left && Math.abs(save.right - bar.right) < 1 && Math.abs(back.left - bar.left) < 1 && Math.abs(back.top - save.top) < 1 && back.height === save.height && Math.abs((status.top + status.bottom - save.top - save.bottom) / 2) < 1;
  })()`), true, 'Back left and Save right share a row and height, with status immediately left of Save');
  await evaluate("document.querySelector('.back button').click()");
  await waitFor("document.querySelector('main h2')?.textContent === 'All pages'");
  const screenshot = await cdp("Page.captureScreenshot", { format: "png" });
  await writeFile("_temp/pages-overview.png", Buffer.from(screenshot.data, "base64"));
  const { identifier } = await cdp("Page.addScriptToEvaluateOnNewDocument", { source: `
    const pagesFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await pagesFetch(...args);
      if (args[0] !== '/rigel/manifest.json') return response;
      const manifest = await response.json();
      manifest.collections[0].listTitle = 'Editorial library';
      manifest.collections[0].columns = ['date', 'title', 'slug', 'title'];
      const sample = { shared: false, groups: [], values: {} };
      manifest.pages = [
        { ...sample, slug: 'core-a', label: 'Core A', category: 'Core pages' },
        { ...sample, slug: 'core-b', label: 'Core B', category: 'Core pages' },
        { ...sample, slug: 'legal', label: 'Legal', category: 'Legal pages' },
        { ...sample, slug: 'standalone', label: 'Standalone', category: undefined }
      ];
      manifest.documents = [];
      manifest.schema.documents = manifest.schema.documents.map(type => ({ ...type, category: undefined }));
      delete manifest.sidebar;
      return Response.json(manifest);
    };
  ` });
  try {
    await cdp("Page.reload");
    await new Promise((resolve) => setTimeout(resolve, 600));
    await waitFor("!!document.querySelector('[data-category=\"Core pages\"]')");
    assert.deepEqual(await evaluate("[...document.querySelectorAll('.rail-scroll > button')].map(b => b.textContent.trim().replace(/\\s+/g, ' '))"), ["Pages", ...manifest.collections.map(c => c.label), "Core pages", "Legal pages", ...manifest.schema.documents.filter(type => type.shared && !type.singleton).map(type => type.title), ...(manifest.menus ? ["Menus"] : []), "Media", ...manifest.schema.documents.filter(type => type.shared && type.singleton).map(type => type.title)]);
    await evaluate("document.querySelector('[data-category]').click()");
    await waitFor("document.querySelector('main h2')?.textContent === 'All Core pages'");
    assert.equal(await evaluate("document.querySelectorAll('tbody tr').length"), 2);
    await evaluate("document.querySelector('.table-link').click()");
    await waitFor("document.querySelector('main h2')?.textContent === 'Core A'");
    assert.equal(await evaluate("document.querySelector('.back button').textContent.trim()"), "← Back to Core pages");

    await evaluate("document.querySelector('.back button').click()");
    await waitFor("document.querySelector('main h2')?.textContent === 'All Core pages'");
    await evaluate("document.querySelectorAll('[data-category]')[1].click()");
    await waitFor("document.querySelector('main h2')?.textContent === 'All Legal pages'");
    assert.equal(await evaluate("document.querySelectorAll('tbody tr').length"), 1);
    await evaluate("document.querySelector('#nav-pages').click()");
    await chooseSelect({ evaluate, waitFor }, '[role=combobox][aria-label="Category"]', 'All pages');
    await waitFor("document.querySelectorAll('tbody tr').length === 4");
    assert.equal(await evaluate("document.querySelector('.titlebar .primary')?.textContent"), "Add new");
    await evaluate("document.querySelector('[data-collection]').click()");
    await waitFor("!!document.querySelector('.titlebar .primary')");
    assert.equal(await evaluate("document.querySelector('.titlebar .primary').textContent"), "Add new");
    assert.equal(await evaluate("document.querySelector('main h2').textContent"), 'Editorial library');
    await checkColumns();
    assert.equal(await evaluate("document.querySelectorAll('th').length"), 3);
    assert.equal(await evaluate("document.querySelectorAll('th').length"), await evaluate("document.querySelectorAll('.table-sort').length"));
    assert.equal(await evaluate("document.querySelectorAll('tbody tr').length"), manifest.collections[0].posts.length);
    await evaluate("document.querySelector('tbody tr').click()");
    await waitFor("!!document.querySelector('.canvas-stage')");
    assert.equal(await evaluate("!!document.querySelector('.titlebar [aria-label=\"Delete post\"]')"), false);
    const post = manifest.collections[0].posts[0];
    assert.equal(await evaluate("document.querySelector('.titlebar h2').textContent"), post.frontmatter.title || post.slug);
    assert.equal(await evaluate("!!document.querySelector('.editor-actions .save-status')"), true);
    const shot = await cdp("Page.captureScreenshot", { format: "png" });
    await writeFile("_temp/content-header.png", Buffer.from(shot.data, "base64"));
    await cdp("Emulation.setDeviceMetricsOverride", { width: 700, height: 800, deviceScaleFactor: 1, mobile: false });
    assert.equal(await evaluate("document.querySelector('.titlebar').scrollWidth <= document.querySelector('.titlebar').clientWidth"), true);
    await cdp("Emulation.clearDeviceMetricsOverride");
    await evaluate("document.querySelector('.back button').click()");
    await waitFor("!!document.querySelector('.titlebar .primary')");
    await evaluate("document.querySelectorAll('[data-collection]')[1].click()");
    await waitFor("document.querySelector('main h2')?.textContent === 'All News'");
    await checkColumns();
    assert.equal(await evaluate("document.querySelectorAll('.table-link').length"), manifest.collections[1].posts.length);
    const tableShot = await cdp("Page.captureScreenshot", { format: "png" });
    await writeFile("_temp/collection-table.png", Buffer.from(tableShot.data, "base64"));
    console.log("PASS: no top bar, inline collection Add new, editor Delete/save status, back navigation and narrow titlebar");
  } finally {
    await cdp("Page.removeScriptToEvaluateOnNewDocument", { identifier });
    await cdp("Page.reload");
    await waitFor("!!document.querySelector('#nav-pages') && !!document.querySelector('[data-doctype=author]')");
  }
  console.log("PASS: flat collection-only sidebar, pages table, sorting, keyboard opening, virtual category filtering/back navigation and real collections (category fixture)");
}

export async function checkEditorActions({ cdp, evaluate, waitFor }) {
  const settings = await evaluate("localStorage.getItem('rigelcms.settings')");
  const cases = [
    ['#nav-pages', 'about'], ['#nav-pages', 'home'],
    ['[data-collection=blog]', 'first-post'], ['[data-collection=news]', 'launch-week'],
    ['[data-doctype=author]', null], ['[data-document="settings:site"]'], ['[data-doctype=logoSet]', null], ['[data-doctype=callout]', null], ['#nav-menus', null],
  ];
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  for (const theme of ['light', 'dark']) {
    await evaluate(`(() => { const settings = JSON.parse(localStorage.getItem('rigelcms.settings') || '{}'); settings.theme = '${theme}'; localStorage.setItem('rigelcms.settings', JSON.stringify(settings)); })()`);
    await cdp('Page.reload');
    await waitFor(`document.documentElement.dataset.theme === '${theme}' && !!document.querySelector('#nav-pages')`);
    for (const width of [1440, 390]) {
      await cdp('Emulation.setDeviceMetricsOverride', { width, height: 960, deviceScaleFactor: 1, mobile: false });
      for (const [nav, slug] of cases) {
        await click(nav);
        if (slug !== undefined) {
          await waitFor("!!document.querySelector('tbody .table-link')");
          await evaluate(slug ? `[...document.querySelectorAll('tbody tr')].find(row => row.cells[1].textContent.trim() === '${slug}').querySelector('.table-link').click()` : "document.querySelector('tbody .table-link').click()");
        }
        await waitFor("!!document.querySelector('.editor-actions .save-button')");
        if (nav.startsWith('[data-doctype=')) assert.equal(await evaluate("!!document.querySelector('.document-form') && !document.querySelector('.visual-editor, .visual-toolbar, main iframe')"), true, `${nav}: shared records are forms, not website pages`);
        const geometry = await evaluate(`(() => {
          const back = document.querySelector('.back button'), save = document.querySelector('.save-button');
          const b = back.getBoundingClientRect(), s = save.getBoundingClientRect(), row = document.querySelector('.editor-actions').getBoundingClientRect(), title = document.querySelector('.titlebar').getBoundingClientRect();
          const bs = getComputedStyle(back), ss = getComputedStyle(save), form = document.querySelector('.document-form')?.getBoundingClientRect();
          return { formAligned: !form || Math.abs(s.right - form.right) < 1, sameRow: Math.abs(b.top - s.top) < 1, sameHeight: b.height === s.height, samePadding: bs.padding === ss.padding, sameFont: bs.fontSize === ss.fontSize, edges: Math.abs(b.left - row.left) < 1 && Math.abs(s.right - row.right) < 1, aboveTitle: row.bottom <= title.top, noOverflow: document.documentElement.scrollWidth <= innerWidth + 1 && s.right <= innerWidth, count: document.querySelectorAll('.save-button').length, disabled: save.disabled };
        })()`);
        assert.deepEqual(geometry, { formAligned:true, sameRow:true, sameHeight:true, samePadding:true, sameFont:true, edges:true, aboveTitle:true, noOverflow:true, count:1, disabled:true }, `${nav}/${slug}: ${theme} ${width}px action row`);
        if (nav === '[data-doctype=author]' && width === 1440 && theme === 'light') {
          const textarea = "document.querySelector('.document-form textarea')";
          assert.equal(await evaluate(`getComputedStyle(${textarea}).resize`), 'vertical');
          const rect = await evaluate(`(() => { const r = ${textarea}.getBoundingClientRect(); return {x:r.right-4,y:r.bottom-4,width:r.width,height:r.height}; })()`);
          await cdp('Input.dispatchMouseEvent', {type:'mousePressed',button:'left',clickCount:1,x:rect.x,y:rect.y});
          await cdp('Input.dispatchMouseEvent', {type:'mouseMoved',button:'left',buttons:1,x:rect.x+80,y:rect.y+50});
          await cdp('Input.dispatchMouseEvent', {type:'mouseReleased',button:'left',clickCount:1,x:rect.x+80,y:rect.y+50});
          assert.equal(await evaluate(`${textarea}.getBoundingClientRect().width`), rect.width, 'Textarea resizing keeps the form width');
          assert.equal(await evaluate(`${textarea}.getBoundingClientRect().height > ${rect.height}`), true, 'Textarea height remains user-resizable');
          assert.equal(await evaluate("document.querySelector('.save-button').disabled"), true, 'Resizing is not a content edit');
          await writeFile('_temp/author-actions.png', Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
        }
        await click('.back button');
        await waitFor("!document.querySelector('.editor-actions')");
      }
    }
  }
  await cdp('Emulation.clearDeviceMetricsOverride');
  await click('#nav-pages');
  await waitFor("!!document.querySelector('tbody .table-link')");
  await evaluate("[...document.querySelectorAll('tbody tr')].find(row => row.cells[1].textContent.trim() === 'about').querySelector('.table-link').click()");
  await openProperties({ evaluate, waitFor });
  await waitFor("!!document.querySelector('.document-properties input[type=text]')");
  await waitFor("document.querySelector('.canvas-stage')?.dataset.ready === 'true'");
  await evaluate("(() => { const input = document.querySelector('.document-properties input[type=text]'); input.value += ' action-row check'; input.dispatchEvent(new Event('input', {bubbles:true})); })()");
  await waitFor("!document.querySelector('.save-button').disabled && document.querySelector('.save-status').textContent.trim() === 'Unsaved'");
  await evaluate("document.querySelector('.back button').focus()");
  await cdp('Input.dispatchKeyEvent', { type:'keyDown', key:'Tab', code:'Tab', windowsVirtualKeyCode:9 });
  await cdp('Input.dispatchKeyEvent', { type:'keyUp', key:'Tab', code:'Tab', windowsVirtualKeyCode:9 });
  assert.equal(await evaluate("document.activeElement === document.querySelector('.save-button') && getComputedStyle(document.activeElement).outlineStyle === 'solid'"), true, 'Tab reaches enabled Save with a visible focus indicator');
  await writeFile('_temp/editor-actions.png', Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
  await click('.back button');
  await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
  await evaluate("[...document.querySelectorAll('.unsaved-dialog button')].find(button => button.textContent.trim() === 'Keep editing').click()");
  await waitFor("!document.querySelector('.unsaved-dialog[open]')");
  assert.equal(await evaluate("document.querySelector('.save-status').textContent.trim()"), 'Unsaved', 'Back retains the draft when Keep editing is chosen');
  await click('.back button');
  await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
  await evaluate("[...document.querySelectorAll('.unsaved-dialog button')].find(button => button.textContent.trim() === 'Discard changes').click()");
  await waitFor("!document.querySelector('.editor-actions')");
  await evaluate(settings === null ? "localStorage.removeItem('rigelcms.settings')" : `localStorage.setItem('rigelcms.settings', ${JSON.stringify(settings)})`);
  await cdp('Page.reload');
  await waitFor("!!document.querySelector('#nav-pages')");
  console.log('PASS: Back/Save shared action row, matching height/padding/type, page/post/shared/menu/copy editors, light/dark desktop/mobile, keyboard focus and unsaved Back guard');
}
