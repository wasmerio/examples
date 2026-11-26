import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

export async function checkPreviewContextMenu({ cdp, evaluate, waitFor }) {
  const frame = "document.querySelector('.visual-editor iframe')";
  await waitFor("!!document.querySelector('#nav-pages')");
  await evaluate("document.querySelector('#nav-pages').click()");
  await waitFor("!!document.querySelector('.table-link')");
  await evaluate("document.querySelector('.table-link').click()");
  await waitFor(`document.querySelector('.canvas-stage')?.dataset.ready === 'true' && ${frame}?.classList.contains('revealed')`);
  const heading = `${frame}.contentDocument.querySelector('h1')`;
  const original = await evaluate(`({ href: ${frame}.contentDocument.querySelector('a[href]').getAttribute('href'), text: ${heading}.textContent, url: ${frame}.contentDocument.URL })`);
  const menu = () => evaluate(`(() => { const target = ${heading}; const event = new target.ownerDocument.defaultView.MouseEvent('contextmenu', { bubbles: true, cancelable: true, button: 2 }); target.dispatchEvent(event); return event.defaultPrevented; })()`);
  const mode = async index => {
    await evaluate(`document.querySelectorAll('.mode-toggle button')[${index}].click()`);
    await waitFor(`document.querySelectorAll('.mode-toggle button')[${index}].getAttribute('aria-pressed') === 'true'`);
  };
  for (const width of [1280, 390]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    for (const index of [1, 0, 1, 0]) {
      await mode(index);
      assert.equal(await menu(), index === 1, 'Context menu follows the current mode without reloading');
      await evaluate(`(() => { const doc = ${frame}.contentDocument; window.previewMenuEvents = []; doc.addEventListener('contextmenu', event => queueMicrotask(() => window.previewMenuEvents.push({ prevented: event.defaultPrevented, trusted: event.isTrusted })), { once: true }); })()`);
      await evaluate(`${heading}.scrollIntoView({ block: 'center' }); ${frame}.scrollIntoView({ block: 'center' })`);
      const point = await evaluate(`(() => { const f = ${frame}.getBoundingClientRect(); return { x: (Math.max(0, f.left) + Math.min(innerWidth, f.right)) / 2, y: (Math.max(0, f.top) + Math.min(innerHeight, f.bottom)) / 2 }; })()`);
      await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'right', buttons: 2, clickCount: 1 });
      await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'right', buttons: 0, clickCount: 1 });
      await waitFor('window.previewMenuEvents.length === 1');
      assert.deepEqual(await evaluate('window.previewMenuEvents'), [{ prevented: index === 1, trusted: true }]);
      await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
      await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
      assert.equal(await evaluate("!!document.querySelector('.inline-editor, .schema-panel, .collection-panel')"), false, 'Right-click does not activate editing');
    }
    if (width === 1280) {
      const point = await evaluate(`(() => { const f = ${frame}.getBoundingClientRect(), h = ${heading}.getBoundingClientRect(); return { x: f.x + h.x + 20, y: f.y + h.y + 20 }; })()`);
      await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', buttons: 1, clickCount: 2 });
      await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', buttons: 0, clickCount: 2 });
      assert(await evaluate(`${frame}.contentDocument.getSelection().toString().length > 0`), 'Native double-click selects text in Browse');
      const targets = (await cdp('Target.getTargets')).targetInfos.map(target => target.targetId);
      const linkPoint = await evaluate(`(() => { const a = [...${frame}.contentDocument.querySelectorAll('a[href]')].find(link => link.getAttribute('href').startsWith('/') && !link.getAttribute('href').startsWith('//') && link.getBoundingClientRect().width > 2 && link.getBoundingClientRect().height > 2); a.scrollIntoView({ block: 'center' }); window.previewNativeLinkHref = a.href; const f = ${frame}.getBoundingClientRect(), r = a.getBoundingClientRect(); return { x: f.x + r.x + r.width / 2, y: f.y + r.y + r.height / 2 }; })()`);
      await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', ...linkPoint, button: 'middle', buttons: 4, clickCount: 1 });
      await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', ...linkPoint, button: 'middle', buttons: 0, clickCount: 1 });
      await new Promise(resolve => setTimeout(resolve, 500));
      const opened = (await cdp('Target.getTargets')).targetInfos.filter(target => !targets.includes(target.targetId));
      for (const target of opened) await cdp('Target.closeTarget', { targetId: target.targetId });
      const href = await evaluate('window.previewNativeLinkHref');
      assert(opened.some(target => target.type === 'page' && target.url === href), 'Native middle-click opens the original link in a new tab without popup permissions');
    }
    assert.equal(await evaluate(`(() => { const doc = ${frame}.contentDocument, range = doc.createRange(); range.selectNodeContents(doc.querySelector('h1')); const selection = doc.getSelection(); selection.removeAllRanges(); selection.addRange(range); return selection.toString(); })()`), original.text);
    assert.equal(await evaluate(`(() => { const doc = ${frame}.contentDocument; const event = new doc.defaultView.Event('copy', { bubbles: true, cancelable: true }); doc.querySelector('h1').dispatchEvent(event); return event.defaultPrevented; })()`), false);
    assert.equal(await evaluate(`${frame}.contentDocument.querySelector('a[href]').getAttribute('href')`), original.href);
    assert.equal(await evaluate(`(() => { const doc = ${frame}.contentDocument; const event = new doc.defaultView.MouseEvent('click', { bubbles: true, cancelable: true }); doc.querySelector('a[href]').dispatchEvent(event); return event.defaultPrevented; })()`), true, 'Ordinary clicks retain the preview navigation guard');
    assert.equal(await evaluate(`${frame}.contentDocument.URL`), original.url);
    assert.equal(await evaluate(`${frame}.getAttribute('sandbox')`), 'allow-same-origin', 'No scripts, popups or popup escape permission added');
    assert.deepEqual(await evaluate("(() => { const a = document.querySelector('.visual-live'); return [a.target, a.rel]; })()"), ['_blank', 'noopener noreferrer'], 'Existing trusted-parent live-page action provides safe new-tab navigation');
    await writeFile(`_temp/preview-context-menu-${await evaluate('location.port')}-${width}.png`, Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
  }
  await evaluate(`window.previewBeforeReload = ${frame}.contentDocument; ${frame}.contentWindow.location.reload()`);
  await waitFor(`${frame}?.contentDocument !== window.previewBeforeReload && document.querySelector('.canvas-stage')?.dataset.ready === 'true' && ${frame}?.classList.contains('revealed')`);
  assert.equal(await menu(), false, 'Reloaded iframe retains Browse policy');
  await mode(1);
  assert.equal(await menu(), true, 'Reloaded iframe switches back to guarded Edit');
  await cdp('Emulation.clearDeviceMetricsOverride');
  console.log('PASS: desktop/mobile trusted right-click and cancelable contextmenu, mode switches/reload, native double-click selection and middle-click new tab, copy event, original links, navigation guard and unchanged sandbox; OS menu contents and clipboard contents not inspected');
}
