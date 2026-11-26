import { openProperties } from './editor-controls.mjs';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

export async function checkPropertiesResize({ cdp, evaluate, waitFor }) {
  await openProperties({ evaluate, waitFor });
  await waitFor("!!document.querySelector('.properties-divider')");
  assert.equal(await evaluate("Array.from(document.querySelectorAll('.schema-panel section')).every(section => ['Top', 'Right', 'Bottom', 'Left'].every(side => getComputedStyle(section)['border' + side + 'Width'] === '0px'))"), true, 'Properties sections have no card borders');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('[aria-label=\"Toggle properties panel\"] .sidebar-asset-icon')).maskImage.includes('square-half')"), true);
  const metrics = () => evaluate(`(() => {
    const divider = document.querySelector('.properties-divider'), rect = divider.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, width: document.querySelector('.schema-panel').getBoundingClientRect().width, min: +divider.getAttribute('aria-valuemin'), max: +divider.getAttribute('aria-valuemax') };
  })()`);
  const initial = await metrics();
  assert.equal(initial.width, 340, 'Each newly opened document starts at the original width');
  await evaluate("window.propertiesFrame = document.querySelector('.visual-editor iframe'); window.propertiesDoc = window.propertiesFrame.contentDocument; window.propertiesSettings = localStorage.getItem('rigelcms.settings');");
  const mouse = (type, x, y) => cdp('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: type === 'mouseMoved' ? 0 : 1 });
  await mouse('mousePressed', initial.x, initial.y);
  await waitFor("document.querySelector('.visual-editor').classList.contains('resizing-properties')");
  assert.equal(await evaluate("getComputedStyle(window.propertiesFrame).pointerEvents"), 'none');
  await mouse('mouseMoved', initial.x - 80, initial.y);
  await waitFor("document.querySelector('.schema-panel').getBoundingClientRect().width > 400");
  await mouse('mouseReleased', initial.x - 80, initial.y);
  await waitFor("!document.querySelector('.resizing-properties')");
  const key = async key => {
    await evaluate("document.querySelector('.properties-divider').focus()");
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key });
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key });
  };
  await key('Home');
  assert.equal((await metrics()).width, initial.min);
  await key('ArrowLeft');
  assert.equal((await metrics()).width, initial.min + 20);
  await key('ArrowRight');
  assert.equal((await metrics()).width, initial.min);
  await key('End');
  assert.equal((await metrics()).width, initial.max);
  await writeFile('_temp/properties-resized.png', Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
  assert.equal(await evaluate("window.propertiesFrame === document.querySelector('.visual-editor iframe') && window.propertiesDoc === window.propertiesFrame.contentDocument"), true);
  assert.equal(await evaluate("getComputedStyle(window.propertiesFrame).pointerEvents"), 'auto');
  assert.equal(await evaluate("localStorage.getItem('rigelcms.settings') === window.propertiesSettings"), true, 'Resizing is not persisted');
  assert.equal(await evaluate("document.querySelector('.save-button').disabled"), true, 'Resizing does not dirty content');
  for (const cleanup of ["document.querySelector('.properties-divider').dispatchEvent(new PointerEvent('pointercancel', { pointerId: 1 }))", "document.querySelector('.properties-divider').releasePointerCapture(1)"]) {
    const current = await metrics();
    await mouse('mousePressed', current.x, current.y);
    await mouse('mouseMoved', current.x - 20, current.y);
    await evaluate(cleanup);
    await mouse('mouseReleased', current.x - 20, current.y);
    await waitFor("!document.querySelector('.resizing-properties')");
    assert.equal(await evaluate("getComputedStyle(window.propertiesFrame).pointerEvents"), 'auto');
  }
  await key('Home');
  console.log('PASS: properties panel pointer drag, iframe guard, keyboard resizing, bounds, unchanged iframe/draft/settings and default size on open');
}
