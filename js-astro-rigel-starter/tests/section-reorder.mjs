import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

export async function checkSectionReorder({ cdp, evaluate, waitFor, writes }) {
  const file = 'src/content/pages/home.json';
  const original = await readFile(file, 'utf8');
  const beforeWrites = writes.length;
  const rows = "[...document.querySelectorAll('.structure-list > li')]";
  const keys = `${rows}.map(row => row.dataset.sectionKey)`;
  const canvasKeys = "[...document.querySelector('.visual-editor iframe').contentDocument.querySelectorAll('[data-rigel-doc=\"page:home\"][data-rigel-section]')].map(row => row.dataset.rigelKey)";
  const initial = await evaluate(keys);
  const order = async expected => {
    await waitFor(`JSON.stringify(${keys}) === ${JSON.stringify(JSON.stringify(expected))} && JSON.stringify(${canvasKeys}) === ${JSON.stringify(JSON.stringify(expected))}`, 'keyed structure and canvas order');
  };
  const key = async (key, code) => {
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: code === 'ArrowUp' ? 38 : code === 'ArrowDown' ? 40 : 27 });
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key, code });
  };
  const geometry = () => evaluate(`(async () => {
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const rows = ${rows}; rows[0].closest('ul').scrollIntoView({ block: 'center', behavior: 'instant' });
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return rows.map(row => { const r = row.getBoundingClientRect(), h = row.querySelector('.section-drag').getBoundingClientRect(); return { x: h.left + h.width / 2, y: h.top + h.height / 2, top: r.top, bottom: r.bottom }; });
  })()`);
  const mouse = async (type, point) => {
    if (type === 'mousePressed') await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: point.x, y: point.y, buttons: 0 });
    await cdp('Input.dispatchMouseEvent', { type, x: point.x, y: point.y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: type === 'mouseMoved' ? 0 : 1 });
  };
  const clean = async () => {
    assert.equal(await evaluate("!!document.querySelector('.is-dragging, .drop-before, .drop-after')"), false, 'Drag state cleaned');
    await order(initial);
    assert.equal(await evaluate("document.querySelector('.save-button').disabled"), true, 'No-op/cancel does not dirty the document');
  };
  assert.equal(await evaluate("document.querySelectorAll('.structure-actions [aria-label^=\"Move \" ]').length"), 0, 'No visible section arrows');
  assert.equal(await evaluate("document.querySelector('.section-drag').nextElementSibling.matches('.structure-row') && !!document.querySelector('.section-drag svg')"), true, 'Real icon grip precedes name');
  assert.match(await evaluate("document.querySelector('#section-reorder-hint').textContent"), /Arrow Up.*Arrow Down.*Escape/);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.section-drag')).cursor"), 'grab');
  assert.equal(await evaluate(`(() => {
    const list = document.querySelector('.structure-list'), label = list.querySelector('.structure-row > span');
    const original = label.textContent, style = list.getAttribute('style');
    const longName = 'A long section name that must stay intact while its visible label ends in an ellipsis';
    try {
      label.textContent = longName;
      list.style.width = '280px';
      const css = getComputedStyle(label), box = label.getBoundingClientRect(), row = label.closest('li');
      return label.textContent === longName && label.scrollWidth > label.clientWidth && css.whiteSpace === 'nowrap' && css.textOverflow === 'ellipsis' && css.overflow === 'hidden' && box.height < 30 && row.scrollWidth <= row.clientWidth;
    } finally {
      label.textContent = original;
      if (style === null) list.removeAttribute('style'); else list.setAttribute('style', style);
    }
  })()`), true, 'Long section names use single-line CSS ellipsis without changing the full name or overflowing actions');

  let boxes = await geometry();
  await mouse('mousePressed', boxes[1]);
  await mouse('mouseMoved', { x: boxes[1].x + 2, y: boxes[1].y + 2 });
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.section-drag:active')).cursor"), 'grabbing');
  assert.equal(await evaluate("!!document.querySelector('.is-dragging')"), false, 'Movement threshold');
  await mouse('mouseReleased', boxes[1]);
  await clean();
  await mouse('mousePressed', boxes[1]);
  await mouse('mouseMoved', { x: boxes[1].x + 8, y: boxes[1].y });
  await mouse('mouseReleased', boxes[1]);
  await clean();

  for (const cancel of ['escape', 'capture', 'outside']) {
    boxes = await geometry();
    const destination = { x: boxes[0].x, y: boxes[0].top + 2 };
    await mouse('mousePressed', boxes[1]);
    await mouse('mouseMoved', destination);
    await waitFor("!!document.querySelector('.drop-before')", 'Insertion indicator');
    assert.deepEqual(await geometry(), boxes, 'Indicator does not reflow siblings');
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.drop-before'), '::before').position"), 'absolute');
    if (cancel === 'escape') await key('Escape', 'Escape');
    if (cancel === 'capture') await evaluate("document.querySelector('.is-dragging .section-drag').releasePointerCapture(1)");
    if (cancel === 'outside') await mouse('mouseMoved', { x: 2, y: 2 });
    await mouse('mouseReleased', cancel === 'outside' ? { x: 2, y: 2 } : destination);
    await clean();
  }

  await evaluate(`${rows}[1].querySelector('.structure-row').click()`);
  boxes = await geometry();
  await mouse('mousePressed', boxes[1]);
  await mouse('mouseMoved', { x: boxes[0].x, y: boxes[0].top + 2 });
  await mouse('mouseReleased', { x: boxes[0].x, y: boxes[0].top + 2 });
  await order([initial[1], initial[0], ...initial.slice(2)]);
  assert.equal(await evaluate("document.querySelector('.structure-list li.active').dataset.sectionKey"), initial[1], 'Selected stable key survives drag');
  assert.match(await evaluate("document.querySelector('.reorder-status[role=status]').textContent"), /position 1 of 7/);
  await evaluate("document.querySelector('.structure-list li.active .section-drag').focus()");
  await key('ArrowDown', 'ArrowDown');
  await order(initial);
  assert.equal(await evaluate("document.activeElement.closest('li').dataset.sectionKey"), initial[1], 'Keyboard reorder retains focus');
  await key('ArrowUp', 'ArrowUp');
  await order([initial[1], initial[0], ...initial.slice(2)]);
  await key('ArrowUp', 'ArrowUp');
  await order([initial[1], initial[0], ...initial.slice(2)]);
  await key('ArrowDown', 'ArrowDown');
  await order(initial);

  boxes = await geometry();
  await mouse('mousePressed', boxes[0]);
  await mouse('mouseMoved', { x: boxes[3].x, y: boxes[3].top + 2 });
  await mouse('mouseReleased', { x: boxes[3].x, y: boxes[3].top + 2 });
  await order([initial[1], initial[2], initial[0], ...initial.slice(3)]);
  await evaluate(`${rows}[2].querySelector('.section-drag').focus()`);
  await key('ArrowUp', 'ArrowUp');
  await key('ArrowUp', 'ArrowUp');
  await order(initial);

  await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
  await cdp('Emulation.setTouchEmulationEnabled', { enabled: true });
  try {
    boxes = await geometry();
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.section-drag')).touchAction"), 'none');
    assert.deepEqual(await evaluate("(() => { const r = document.querySelector('.section-drag').getBoundingClientRect(); return [r.width, r.height]; })()"), [44, 44]);
    const touch = (type, point) => cdp('Input.dispatchTouchEvent', { type, touchPoints: point ? [{ x: point.x, y: point.y, id: 0 }] : [] });
    await touch('touchStart', boxes[0]);
    await touch('touchMove', { x: boxes[1].x, y: boxes[1].bottom - 2 });
    await waitFor("!!document.querySelector('.is-dragging')", 'Touch activates drag');
    await touch('touchCancel');
    await waitFor("!document.querySelector('.is-dragging')", 'pointercancel cleans touch drag');
    await order(initial);
    await touch('touchStart', boxes[0]);
    await touch('touchMove', { x: boxes.at(-1).x, y: boxes.at(-1).bottom - 2 });
    await waitFor("!!document.querySelector('.drop-after')", 'Touch insertion at list end');
    await touch('touchEnd');
    await order([...initial.slice(1), initial[0]]);
    await evaluate(`${rows}.at(-1).querySelector('.section-drag').focus()`);
    await key('ArrowDown', 'ArrowDown');
    await order([...initial.slice(1), initial[0]]);
    for (let index = 1; index < initial.length; index++) await key('ArrowUp', 'ArrowUp');
    await order(initial);
  } finally {
    await cdp('Emulation.setTouchEmulationEnabled', { enabled: false });
    await cdp('Emulation.clearDeviceMetricsOverride');
  }
  assert.equal(await readFile(file, 'utf8'), original, 'Reorder never autosaves');
  assert.equal(writes.length, beforeWrites, 'Reorder sends no write requests');
  console.log('PASS: section pointer insertion without reflow, threshold/no-op/outside/Escape/lost capture, stable selection, keyboard/focus/bounds, mobile touch drop/cancel, no autosave.');
}
