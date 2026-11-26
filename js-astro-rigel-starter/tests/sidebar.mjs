import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";

export async function checkSidebar({ cdp, evaluate, waitFor }) {
  await waitFor("!!document.querySelector('[data-doctype=author]')");
  const width = () => evaluate("document.querySelector('#rigel-sidebar').getBoundingClientRect().width");
  assert.equal(await width(), 256);
  const toggleAtBottom = () => evaluate("(() => { const button = document.querySelector('.sidebar-toggle'); return button.nextElementSibling.classList.contains('aside-foot') && button.getBoundingClientRect().bottom <= document.querySelector('.user-btn').getBoundingClientRect().top; })()");
  assert.equal(await toggleAtBottom(), true, 'Collapse is the last sidebar action before the user control');
  const original = await readFile('src/content/pages/home.json', 'utf8');
  await evaluate("document.querySelector('#nav-pages').click()");
  await waitFor("[...document.querySelectorAll('.table-link')].some(button => button.textContent.trim() === 'Home')");
  await evaluate("[...document.querySelectorAll('.table-link')].find(button => button.textContent.trim() === 'Home').click()");
  await waitFor("document.querySelector('.visual-editor .canvas-stage')?.dataset.ready === 'true' && !!document.querySelector('.visual-editor iframe')?.contentDocument?.querySelector('h1')");
  await evaluate("document.querySelector('.visual-editor iframe').contentDocument.querySelector('h1').click()");
  await waitFor("document.activeElement?.matches('.schema-panel input[type=text]')");
  await evaluate("window.sidebarFrame = document.querySelector('.visual-editor iframe'); const input = document.activeElement; input.value = 'Sidebar draft stays intact'; input.dispatchEvent(new Event('input', { bubbles: true }));");
  await evaluate("document.querySelector('.sidebar-toggle').click()");
  await waitFor("document.querySelector('.sidebar-toggle')?.getAttribute('aria-expanded') === 'false'");
  assert.equal(await width(), 64);
  assert.equal(await toggleAtBottom(), true, 'Expand stays above the user control in the collapsed rail');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('#nav-pages .sidebar-label')).display"), 'none');
  assert.equal(await evaluate("document.querySelector('#nav-pages').getAttribute('aria-label')"), 'Pages');
  assert.equal(await evaluate("document.querySelector('#nav-pages').getAttribute('data-tooltip')"), 'Pages');
  assert.equal(await evaluate("document.querySelector('.save-button').disabled"), false);
  assert.equal(await evaluate("window.sidebarFrame === document.querySelector('.visual-editor iframe')"), true);
  assert.equal(await readFile('src/content/pages/home.json', 'utf8'), original);
  await evaluate("document.querySelector('.brand').click()");
  await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
  await evaluate("[...document.querySelectorAll('.unsaved-dialog button')].find(button => button.textContent.trim() === 'Keep editing').click()");
  await waitFor("!document.querySelector('.unsaved-dialog')");
  assert.equal(await evaluate("document.querySelector('.visual-editor iframe').contentDocument.querySelector('h1').textContent"), 'Sidebar draft stays intact');
  await evaluate("document.querySelector('.brand').click()");
  await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
  await evaluate("[...document.querySelectorAll('.unsaved-dialog button')].find(button => button.textContent.trim() === 'Discard changes').click()");
  await waitFor("!!document.querySelector('.welcome')");
  await cdp('Page.reload');
  await waitFor("!!document.querySelector('[data-doctype=author]')");
  assert.equal(await width(), 64, 'Collapsed preference survives reload');
  const assets = await evaluate(`Promise.all([...new Set([...document.querySelectorAll('.sidebar-asset-icon')].map(icon => getComputedStyle(icon).maskImage.match(/url\\(["']?(.*?)["']?\\)/)[1]))].map(async url => {
    const response = await fetch(url);
    return { url, status: response.status, svg: (await response.text()).includes('<svg') };
  }))`);
  for (const asset of assets) {
    assert.equal(new URL(asset.url).origin, new URL(process.env.RIGEL_URL || 'http://localhost:4321').origin);
    assert.equal(asset.status, 200);
    assert.equal(asset.svg, true);
    assert.equal(asset.url.startsWith('data:'), false);
  }
  await evaluate("document.querySelector('.search-trigger').click()");
  await waitFor("!!document.querySelector('.palette')");
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await waitFor("!document.querySelector('.palette')");
  await evaluate("document.querySelector('.user-btn').click()");
  await waitFor("!!document.querySelector('.user-menu')");
  assert.equal(await evaluate("(() => { const rect = document.querySelector('.user-menu').getBoundingClientRect(); return rect.left >= 0 && rect.right <= innerWidth; })()"), true);
  await evaluate("document.querySelector('.user-btn').click()");
  await writeFile('_temp/sidebar-collapsed.png', Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
  await waitFor("document.documentElement.dataset.theme === 'dark'");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('#nav-pages .sidebar-asset-icon')).backgroundColor === getComputedStyle(document.querySelector('#nav-pages')).color"), true, 'External SVG masks inherit dark-theme text color');
  await writeFile('_temp/sidebar-collapsed-dark.png', Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
  await waitFor("document.documentElement.dataset.theme === 'light'");
  await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
  assert.equal(await evaluate("getComputedStyle(document.querySelector('#nav-pages .sidebar-label')).display !== 'none'"), true, 'Mobile keeps readable labels');
  assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true);
  await cdp('Emulation.clearDeviceMetricsOverride');
  await waitFor("getComputedStyle(document.querySelector('.sidebar-toggle')).display !== 'none'");
  await evaluate("document.querySelector('.sidebar-toggle').focus()");
  assert.equal(await evaluate("document.activeElement === document.querySelector('.sidebar-toggle')"), true);
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await waitFor("document.querySelector('.sidebar-toggle')?.getAttribute('aria-expanded') === 'true'");
  assert.equal(await width(), 256);
  await writeFile('_temp/sidebar-expanded.png', Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
  const { identifier } = await cdp('Page.addScriptToEvaluateOnNewDocument', { source: `
    const fetchOriginal = window.fetch.bind(window);
    window.fetch = async (...args) => {
      const response = await fetchOriginal(...args);
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;
      if (new URL(url, location.href).pathname !== '/rigel/manifest.json') return response;
      const manifest = await response.json();
      manifest.sidebar.find(item => item.kind === 'link' && item.target.kind === 'pages').icon = '/demo/solara.svg';
      return new Response(JSON.stringify(manifest), { headers: { 'Content-Type': 'application/json' } });
    };
  ` });
  try {
    await cdp('Page.reload');
    await waitFor("!!document.querySelector('[data-doctype=author]')");
    assert.equal(await evaluate("getComputedStyle(document.querySelector('#nav-pages .sidebar-asset-icon')).maskImage.includes('/demo/solara.svg')"), true);
    assert.equal(await evaluate("fetch('/demo/solara.svg').then(async response => response.ok && (await response.text()).includes('<svg'))"), true);
    await evaluate("document.querySelector('.sidebar-toggle').click()");
    await waitFor("document.querySelector('.sidebar-toggle')?.getAttribute('aria-expanded') === 'false'");
    assert.equal(await evaluate("getComputedStyle(document.querySelector('#nav-pages .sidebar-asset-icon')).maskImage.includes('/demo/solara.svg')"), true);
    await evaluate("document.querySelector('.sidebar-toggle').click()");
    await waitFor("document.querySelector('.sidebar-toggle')?.getAttribute('aria-expanded') === 'true'");
  } finally {
    await cdp('Page.removeScriptToEvaluateOnNewDocument', { identifier });
    await cdp('Page.reload');
    await waitFor("!!document.querySelector('[data-doctype=author]')");
  }
  console.log('PASS: collapsible icon rail, local SVG assets, keyboard toggle, reload persistence, draft preservation, unsaved guard, search/account menu and readable mobile navigation');
}
