import assert from 'node:assert/strict';
import { openProperties } from './editor-controls.mjs';
import { writeFile } from 'node:fs/promises';

export async function checkSelects({ cdp, evaluate, waitFor }) {
  const click = async selector => {
    const point = await evaluate(`(async () => { const element = document.querySelector(${JSON.stringify(selector)}); element.scrollIntoView({ block: 'nearest' }); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); const rect = element.getBoundingClientRect(); return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }; })()`);
    await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point });
    await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point });
    await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point });
  };
  const key = async key => {
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key });
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key });
  };
  const navigate = async selector => {
    await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
    await evaluate("new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))");
    if (await evaluate("!!document.querySelector('.unsaved-dialog[open]')")) {
      await evaluate("[...document.querySelectorAll('.unsaved-dialog button')].find(button => button.textContent === 'Discard changes').click()");
      await waitFor("!document.querySelector('.unsaved-dialog[open]')");
    }
  };
  const article = async collection => {
    await navigate(`[data-collection=${collection}]`);
    await waitFor("!!document.querySelector('tbody .table-link')");
    await evaluate("document.querySelector('tbody .table-link').click()");
    await waitFor("document.querySelector('.canvas-stage')?.dataset.ready === 'true'");
    await openProperties({ evaluate, waitFor });
    await evaluate("document.querySelector('#properties-tab-page').click()");
  };
  const author = '[data-collection-field=author] button[role=combobox]';
  const clickPreview = async () => {
    const point = await evaluate("(() => { const rect=document.querySelector('.visual-editor iframe').getBoundingClientRect();return {x:rect.left+12,y:rect.top+12};})()");
    await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',...point});
    await cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});
    await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point});
  };

  const selectedText = "document.querySelector('.select-menu:popover-open .select-option.active > span').textContent";
  await article('blog');
  await click(author);
  await waitFor("!!document.querySelector('.select-menu:popover-open')");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('[data-collection-field=author] select')).display"), 'none');
  const originalAuthor = await evaluate("document.querySelector('[data-collection-field=author] select').value");
  await clickPreview();
  await waitFor("!document.querySelector('.select-menu:popover-open')");
  assert.equal(await evaluate("document.querySelector('[data-collection-field=author] select').value"),originalAuthor,'Preview dismissal does not change selection');
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(author)}).getAttribute('aria-expanded')`),'false');
  await click(author); await waitFor("!!document.querySelector('.select-menu:popover-open')");
  await key('Home');
  assert.equal(await evaluate(selectedText), await evaluate("document.querySelector('.select-menu:popover-open .select-option > span').textContent"));
  await key('End');
  assert.equal(await evaluate(selectedText), await evaluate("[...document.querySelectorAll('.select-menu:popover-open .select-option')].at(-1).querySelector('span').textContent"));
  await key('r');
  assert.equal(await evaluate(selectedText), 'Rigel Studio');
  await key('Enter');
  await waitFor("document.querySelector('[data-collection-field=author] select').value === 'author:rigel-studio' && !document.querySelector('.select-menu:popover-open')");
  assert.equal(await evaluate("document.activeElement === document.querySelector('[data-collection-field=author] button[role=combobox]')"), true);
  await key('ArrowDown');
  await key('a');
  assert.equal(await evaluate(selectedText), 'Alex');
  await key('Escape');
  assert.equal(await evaluate("document.querySelector('[data-collection-field=author] select').value"), 'author:rigel-studio', 'Escape cancels highlighted but unselected changes');
  const originalTheme = await evaluate('document.documentElement.dataset.theme');
  for (const theme of ['light', 'dark']) {
    await evaluate(`document.documentElement.dataset.theme = ${JSON.stringify(theme)}`);
    await click(author);
    await waitFor("!!document.querySelector('.select-menu:popover-open')");
    const palette = await evaluate("(() => { const menu = document.querySelector('.select-menu:popover-open'), style = getComputedStyle(menu), row = getComputedStyle(menu.querySelector('.active')); return { text: style.color, bg: style.backgroundColor, active: row.color, activeBg: row.backgroundColor, border: style.borderTopColor, radius: style.borderTopLeftRadius }; })()");
    const contrast = (a, b) => {
      const luminance = rgb => rgb.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => value / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
      return (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);
    };
    assert(contrast(palette.text, palette.bg) >= 4.5, `${theme} menu text contrast`);
    assert(contrast(palette.active, palette.activeBg) >= 4.5, `${theme} active option contrast`);
    assert(contrast(palette.border, palette.bg) >= 3, `${theme} menu boundary contrast`);
    assert.equal(palette.radius, '0px');
    await writeFile(`_temp/select-${theme}.png`, Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
    await click('.titlebar h2');
    await waitFor("!document.querySelector('.select-menu:popover-open')");
  }
  await evaluate(`document.documentElement.dataset.theme = ${JSON.stringify(originalTheme)}`);
  await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
  await click(author);
  await waitFor("!!document.querySelector('.select-menu:popover-open')").catch(async error => {
    await writeFile('_temp/select-mobile-failure.png', Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
    console.log(await evaluate("(() => { const button = document.querySelector('[data-collection-field=author] button'), rect = button.getBoundingClientRect(); return { rect: rect.toJSON(), expanded: button.getAttribute('aria-expanded'), hit: document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)?.outerHTML.slice(0, 800) }; })()"));
    throw error;
  });
  assert.equal(await evaluate("(() => { const rect = document.querySelector('.select-menu:popover-open').getBoundingClientRect(); return rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight; })()"), true, 'Menu fits mobile viewport');
  await key('Escape');
  await cdp('Emulation.clearDeviceMetricsOverride');
  await article('news');
  await click(author);
  await waitFor("!!document.querySelector('.select-menu:popover-open')");
  const studio = await evaluate("[...document.querySelectorAll('.select-menu:popover-open .select-option')].find(option => option.querySelector('span').textContent === 'Rigel Studio').id");
  const studioSelected = "[...document.querySelector('[data-collection-field=author] select').selectedOptions].some(option => option.value === 'author:rigel-studio')";
  const initiallySelected = await evaluate(studioSelected);
  await click(`[id="${studio}"]`);
  assert.equal(await evaluate(studioSelected), !initiallySelected);
  assert.equal(await evaluate("!!document.querySelector('.select-menu:popover-open')"), true, 'Multiple selection keeps the menu open');
  await click(`[id="${studio}"]`);
  assert.equal(await evaluate(studioSelected), initiallySelected);
  await clickPreview();
  await waitFor("!document.querySelector('.select-menu:popover-open')");
  console.log('PASS: real preview iframe clicks dismiss single/multiple dropdowns without changing selection; dropdowns reopen normally');
  await navigate('#nav-media');
  await waitFor("!!document.querySelector('.media-tools button[aria-label=\"Media type\"]')");
  await click('button[aria-label="Media type"]');
  await waitFor("!!document.querySelector('.select-menu:popover-open')");
  await key('End');
  await key('Enter');
  assert.equal(await evaluate("document.querySelector('select[aria-label=\"Media type\"]').value"), 'Other');
  await click('button[aria-label="Modified month"]');
  await waitFor("!!document.querySelector('.select-menu:popover-open')");
  await key('Escape');
  await article('blog');
  await evaluate("document.querySelector('#properties-tab-content').click()");
  await click('[data-collection-field="$body"] button[aria-label="Block type"]');
  await waitFor("!!document.querySelector('.select-menu:popover-open')");
  const heading = await evaluate("[...document.querySelectorAll('.select-menu:popover-open .select-option')].find(option => option.querySelector('span').textContent === 'Heading 2').id");
  await click(`[id="${heading}"]`);
  assert.equal(await evaluate("document.querySelector('[data-collection-field=\"$body\"] select[aria-label=\"Block type\"]').value"), 'h2');
  await click('[data-collection-field="$body"] button[aria-label="Insert media"]');
  await waitFor("!!document.querySelector('.media-menu:popover-open [role=menuitem]')");
  await click('.media-menu:popover-open [role="menuitem"]');
  await waitFor("!!document.querySelector('.image-dialog[open] button[aria-label=\"Image format\"]')");
  await click('.image-dialog button[aria-label="Image format"]');
  await waitFor("!!document.querySelector('.select-menu:popover-open')");
  await key('End');
  await key('Escape');
  assert.equal(await evaluate("!!document.querySelector('.image-dialog[open]')"), true, 'Escape closes the dropdown without closing its parent dialog');
  await click('.image-dialog button[aria-label="Image format"]');
  await waitFor("!!document.querySelector('.select-menu:popover-open')");
  await key('Home');
  await key('ArrowDown');
  await key('Enter');
  assert.equal(await evaluate("document.querySelector('.image-dialog select[aria-label=\"Image format\"]').value"), 'image/jpeg');
  await click('.image-dialog .close');
  await navigate('#nav-pages');
  await waitFor("!!document.querySelector('tbody .table-link')");
  await evaluate("[...document.querySelectorAll('tbody tr')].find(row => row.cells[1].textContent.trim() === 'home').querySelector('.table-link').click()");
  await waitFor("document.querySelector('.canvas-stage')?.dataset.ready === 'true'");
  await openProperties({ evaluate, waitFor });
  await click('.add-section button[role=combobox]');
  await waitFor("!!document.querySelector('.select-menu:popover-open')");
  await key('s');
  await key('Enter');
  assert.equal(await evaluate("!!document.querySelector('.add-section select').value"), true);
  await evaluate("[...document.querySelectorAll('.structure-row')].find(button => button.textContent.includes('Logo strip')).click()");
  await click('.section-properties button[role=combobox]');
  await waitFor("!!document.querySelector('.select-menu:popover-open')");
  await key('End');
  await key('Enter');
  assert.equal(await evaluate("document.querySelector('.section-properties select').value"), 'logoSet:brands');
  await navigate('#nav-pages');
  console.log('PASS: custom dropdown mouse/keyboard/typeahead, Escape/outside dismissal, single/multiple selection, media filters, rich-text formatting, light/dark contrast and mobile bounds');
}
