import './local-only.mjs';
import { chooseSelect, openProperties } from './editor-controls.mjs';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';

const url = process.env.RIGEL_URL || 'http://127.0.0.1:4321/rigel/';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
await mkdir('_temp/tooltips', { recursive: true });
const profile = await mkdtemp(`${process.cwd()}/_temp/tooltips-chrome-`);
const chrome = spawn(process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--no-first-run', '--no-default-browser-check', '--window-size=1440,1000',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
let socket;
try {
  const endpoint = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => finish(new Error('Chrome did not start')), 15000);
    const finish = (error, value) => { clearTimeout(timer); error ? reject(error) : resolve(value); };
    chrome.once('error', error => finish(error));
    chrome.once('exit', code => finish(new Error(`Chrome exited during startup: ${code}`)));
    chrome.stderr.on('data', chunk => {
      const match = String(chunk).match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) finish(null, match[1]);
    });
  });
  socket = new WebSocket(endpoint);
  await once(socket, 'open');
  let id = 0;
  const pending = new Map(), errors = [];
  socket.addEventListener('message', ({ data }) => {
    const result = JSON.parse(data), request = pending.get(result.id);
    if (request) {
      pending.delete(result.id);
      result.error ? request.reject(new Error(result.error.message)) : request.resolve(result.result);
    }
    if (result.method === 'Runtime.exceptionThrown') errors.push(result.params.exceptionDetails.exception?.description ?? result.params.exceptionDetails.text);
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const requestId = ++id;
    const timer = setTimeout(() => { pending.delete(requestId); reject(new Error(`CDP timeout: ${method}`)); }, 20000);
    pending.set(requestId, {
      resolve: value => { clearTimeout(timer); resolve(value); },
      reject: error => { clearTimeout(timer); reject(error); },
    });
    socket.send(JSON.stringify({ id: requestId, method, params, sessionId }));
  });
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const cdp = (method, params) => send(method, params, sessionId);
  const evaluate = async expression => {
    const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
    return result.result.value;
  };
  const run = (fn, ...args) => evaluate(`(${fn})(${args.map(arg => JSON.stringify(arg)).join(',')})`);
  const waitFor = async expression => {
    for (let i = 0; i < 150; i++) {
      if (await evaluate(expression)) return;
      await delay(100);
    }
    throw new Error(`Timed out: ${expression}\n${errors.join('\n')}`);
  };
  const visible = "!!document.querySelector('#rigel-tooltip:popover-open')";
  const frame = () => evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
  const key = async (key, code = key, windowsVirtualKeyCode) => {
    for (const type of ['keyDown', 'keyUp']) await cdp('Input.dispatchKeyEvent', { type, key, code, windowsVirtualKeyCode });
  };
  const mouse = (x, y) => cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
  const center = selector => run(selector => {
    const box = document.querySelector(selector).getBoundingClientRect();
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  }, selector);
  const hover = async selector => { const point = await center(selector); await mouse(point.x, point.y); };
  const focus = async selector => {
    await evaluate('document.activeElement?.blur()');
    await key('Shift', 'ShiftLeft', 16);
    await run(selector => document.querySelector(selector).focus(), selector);
    assert.equal(await evaluate(visible), true, `Keyboard focus immediately opens ${selector}`);
    await frame();
  };
  const dismiss = async () => {
    await evaluate('document.activeElement?.blur()');
    await mouse(1, 1);
    await key('Escape', 'Escape', 27);
    await waitFor(`!(${visible})`);
  };
  const snapshot = name => cdp('Page.captureScreenshot', { format: 'png' }).then(result => writeFile(`_temp/tooltips/${name}.png`, Buffer.from(result.data, 'base64')));
  const geometry = () => evaluate(`(() => {
    const tip = document.querySelector('#rigel-tooltip:popover-open'), trigger = document.querySelector('[aria-describedby~="rigel-tooltip"]');
    if (!tip || !trigger) throw new Error('Missing tooltip or ARIA association');
    const style = getComputedStyle(tip), box = tip.getBoundingClientRect();
    return { tip: box.toJSON(), trigger: trigger.getBoundingClientRect().toJSON(), side: tip.dataset.side,
      text: tip.textContent, role: tip.getAttribute('role'), popover: tip.popover,
      font: style.fontSize, padding: style.padding, radius: style.borderRadius, shadow: style.boxShadow,
      background: style.backgroundColor, color: style.color, width: innerWidth, height: innerHeight,
      hit: document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2) === tip };
  })()`);
  const luminance = color => {
    const [r, g, b] = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => value / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const fits = state => {
    assert.ok(state.tip.left >= 7.5 && state.tip.top >= 7.5 && state.tip.right <= state.width - 7.5 && state.tip.bottom <= state.height - 7.5,
      `Tooltip must fit viewport with 8px margin: ${JSON.stringify(state)}`);
    assert.equal(state.role, 'tooltip');
    assert.equal(state.popover, 'manual');
    assert.equal(state.hit, true, 'Tooltip is hit-testable above surrounding surfaces');
  };
  const probe = async ({ side = 'top', align = 'center', text = 'Tooltip probe', left, top, width = 100, height = 32 } = {}) => {
    await dismiss();
    await run(options => {
      document.querySelector('#tooltip-probe')?.remove();
      const button = document.createElement('button');
      button.id = 'tooltip-probe'; button.type = 'button'; button.textContent = 'Probe';
      button.dataset.tooltip = options.text;
      if (options.side) button.dataset.tooltipPosition = options.side;
      if (options.align) button.dataset.tooltipAlign = options.align;
      button.setAttribute('aria-label', 'Explicit accessible name');
      button.setAttribute('aria-describedby', 'tooltip-existing-description');
      button.style.cssText = `position:fixed;z-index:2147483647;left:${options.left ?? (innerWidth-options.width)/2}px;top:${options.top ?? (innerHeight-options.height)/2}px;width:${options.width}px;height:${options.height}px;`;
      document.querySelector('.rigel').append(button);
    }, { side, align, text, left, top, width, height });
  };

  await cdp('Runtime.enable');
  await cdp('Page.enable');
  await cdp('Page.addScriptToEvaluateOnNewDocument', { source: "localStorage.setItem('rigelcms.settings',JSON.stringify({userPref:{editorExperience:'sidebar'}}))" });
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await cdp('Page.navigate', { url });
  await waitFor("document.readyState === 'complete' && !!document.querySelector('.sidebar-toggle')");
  await run(() => {
    const description = document.createElement('span');
    description.id = 'tooltip-existing-description'; description.hidden = true; description.textContent = 'Existing description';
    document.querySelector('.rigel').append(description);
  });

  await focus('.sidebar-toggle');
  assert.equal((await geometry()).side, 'right', 'Real sidebar toggle uses right-hand placement');
  await snapshot('sidebar-right');
  await dismiss();

  for (const [expanded, text] of [[false, 'Expand sidebar'], [true, 'Collapse sidebar']]) {
    const point = await center('.sidebar-toggle');
    await mouse(point.x, point.y);
    await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
    await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
    await waitFor(`document.querySelector('.sidebar-toggle').getAttribute('aria-expanded') === '${expanded}'`);
    assert.equal(await evaluate('document.activeElement === document.querySelector(".sidebar-toggle")'), true);
    await mouse(600, 50);
    await delay(300);
    await hover('.sidebar-toggle');
    await waitFor(visible);
    assert.equal((await geometry()).text, text, 'A clicked, still-focused toggle regains its updated tooltip on hover');
    await snapshot(expanded ? 'sidebar-expanded-hover' : 'sidebar-collapsed-hover');
  }
  await dismiss();

  for (const side of ['top', 'bottom', 'left', 'right']) for (const align of ['start', 'center', 'end']) {
    await probe({ side, align, width: 100, height: 64 });
    await focus('#tooltip-probe');
    const state = await geometry(), { tip, trigger } = state;
    fits(state);
    assert.equal(state.side, side, `${side}/${align} keeps its requested side`);
    const gap = { top: trigger.top - tip.bottom, bottom: tip.top - trigger.bottom, left: trigger.left - tip.right, right: tip.left - trigger.right }[side];
    assert.ok(Math.abs(gap - 8) <= 1, `${side}/${align} uses an 8px gap, got ${gap}`);
    const horizontal = side === 'top' || side === 'bottom';
    const start = horizontal ? 'left' : 'top', end = horizontal ? 'right' : 'bottom';
    const offset = align === 'start' ? tip[start] - trigger[start] : align === 'end' ? tip[end] - trigger[end] : (tip[start] + tip[end] - trigger[start] - trigger[end]) / 2;
    assert.ok(Math.abs(offset) <= 1, `${side}/${align} aligns correctly, got ${offset}`);
    await snapshot(`${side}-${align}`);
  }
  await probe({ side: null, align: null });
  await focus('#tooltip-probe');
  assert.equal((await geometry()).side, 'top', 'Unconfigured placement defaults to top');
  assert.equal(await evaluate("document.querySelector('#tooltip-probe').getAttribute('aria-label')"), 'Explicit accessible name');
  assert.equal(await evaluate("document.querySelector('#tooltip-probe').getAttribute('aria-describedby')"), 'tooltip-existing-description rigel-tooltip');
  await dismiss();
  assert.equal(await evaluate("document.querySelector('#tooltip-probe').getAttribute('aria-describedby')"), 'tooltip-existing-description');
  assert.equal(await evaluate("!!document.querySelector('[data-tooltip][title]')"), false, 'Shared tooltip triggers have no competing native titles');

  await hover('#tooltip-probe');
  await delay(150);
  assert.equal(await evaluate(visible), false, 'Hover does not open before the 450ms delay');
  await waitFor(visible);
  await hover('#rigel-tooltip');
  await delay(250);
  assert.equal(await evaluate(visible), true, 'Pointer can enter and read tooltip content');
  await mouse(1, 1);
  await waitFor(`!(${visible})`);

  await focus('#tooltip-probe');
  const beforeMove = await geometry();
  await evaluate("document.querySelector('#tooltip-probe').style.left='800px'");
  await frame();
  const afterMove = await geometry();
  assert.ok(Math.abs((afterMove.tip.left-beforeMove.tip.left)-(afterMove.trigger.left-beforeMove.trigger.left)) < 1, 'Tooltip follows a moving anchor');
  await evaluate("document.querySelector('#tooltip-probe').dataset.tooltip='Changed live tooltip'");
  await frame();
  assert.equal((await geometry()).text, 'Changed live tooltip', 'Live tooltip text updates');
  await evaluate("document.querySelector('#tooltip-probe').remove()");
  await waitFor(`!(${visible})`);

  for (const event of ['scroll', 'blur', 'click']) {
    await probe(); await focus('#tooltip-probe');
    if (event === 'scroll') {
      await run(() => {
        const scroller = document.createElement('div'); scroller.id = 'tooltip-scroller';
        scroller.style.cssText = 'position:fixed;left:20px;top:100px;width:50px;height:50px;overflow:auto';
        const child = document.createElement('div'); child.style.height = '500px'; scroller.append(child);
        document.querySelector('.rigel').append(scroller); scroller.scrollTop = 30;
      });
    } else if (event === 'blur') await evaluate('document.activeElement.blur()');
    else await evaluate("document.querySelector('#tooltip-probe').click()");
    await waitFor(`!(${visible})`);
    await evaluate("document.querySelector('#tooltip-scroller')?.remove()");
  }
  await probe(); await focus('#tooltip-probe');
  const point = await center('#tooltip-probe');
  await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
  assert.equal(await evaluate(visible), false, 'Pointer down dismisses immediately');
  await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
  await dismiss();
  await cdp('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
  await cdp('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
  await cdp('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await delay(650);
  assert.equal(await evaluate(visible), false, 'Touch interaction never creates a tooltip');
  await cdp('Emulation.setTouchEmulationEnabled', { enabled: false });

  for (const width of [1440, 390, 320]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    for (const theme of ['light', 'dark']) for (const contrast of ['normal', 'high']) {
      await run((theme, contrast) => { document.documentElement.dataset.theme = theme; document.documentElement.dataset.contrast = contrast; }, theme, contrast);
      await probe({ text: 'Compact tooltip' }); await focus('#tooltip-probe');
      const state = await geometry(); fits(state);
      assert.equal(state.font, '11px'); assert.equal(state.padding, '4px 10px'); assert.equal(state.radius, '0px');
      assert.notEqual(state.shadow, 'none'); assert.notEqual(state.color, state.background);
      const foreground = luminance(state.color), background = luminance(state.background);
      assert.ok((Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05) >= 4.5, 'Tooltip text meets WCAG AA contrast in every palette');
      assert.equal(await evaluate(`(() => {
        const tip=document.querySelector('#rigel-tooltip'),sample=document.createElement('span');
        sample.style.cssText='background:var(--text);color:var(--panel)';tip.parentElement.append(sample);
        const expected=getComputedStyle(sample),actual=getComputedStyle(tip),matches=expected.backgroundColor===actual.backgroundColor && expected.color===actual.color;
        sample.remove();return matches;
      })()`), true, 'Tooltip uses inverse theme tokens');
      await snapshot(`${width}-${theme}-${contrast}`);
    }
    for (const [side, opposite, position] of [
      ['top', 'bottom', { top: 8 }], ['bottom', 'top', { top: 860 }],
      ['left', 'right', { left: 8 }], ['right', 'left', { left: width - 108 }],
    ]) {
      await probe({ side, text: 'Edge', ...position }); await focus('#tooltip-probe');
      const state = await geometry(); fits(state); assert.equal(state.side, opposite, `${width}px ${side} edge flips`);
    }
    for (const position of [{ left: 8, top: 8 }, { left: width-108, top: 860 }]) {
      await probe({ text: 'Long tooltip content '.repeat(180), ...position }); await focus('#tooltip-probe');
      fits(await geometry()); await snapshot(`${width}-long-${position.top}`);
    }
    if (width === 320) {
      await probe({ side: 'left', text: 'A wide tooltip that cannot fit on either horizontal side of this button' });
      await focus('#tooltip-probe'); const state = await geometry(); fits(state);
      assert.ok(['top', 'bottom'].includes(state.side), 'Uses perpendicular fallback when neither horizontal direction fits');
    }
  }

  await dismiss();
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await frame();
  for (const kind of ['dialog', 'popover']) {
    await run(kind => {
      const surface = document.createElement(kind === 'dialog' ? 'dialog' : 'div');
      surface.id = 'tooltip-surface'; surface.style.cssText = 'padding:60px;margin:auto;overflow:hidden';
      if (kind === 'popover') surface.popover = 'auto';
      const button = document.createElement('button'); button.type = 'button'; button.id = 'tooltip-surface-button';
      button.dataset.tooltip = 'Above native top layer'; button.textContent = 'Surface probe'; surface.append(button);
      document.querySelector('.rigel').append(surface);
      kind === 'dialog' ? surface.showModal() : surface.showPopover();
    }, kind);
    await focus('#tooltip-surface-button');
    fits(await geometry());
    await snapshot(`native-${kind}`);
    await key('Escape', 'Escape', 27);
    assert.equal(await evaluate(visible), false, 'Escape dismisses the tooltip');
    assert.equal(await run(kind => document.querySelector('#tooltip-surface').matches(kind === 'dialog' ? ':modal' : ':popover-open'), kind), true, 'First Escape leaves surrounding native surface open');
    assert.equal(await evaluate("document.activeElement.id"), 'tooltip-surface-button', 'Escape keeps trigger focus');
    await run(kind => {
      const surface = document.querySelector('#tooltip-surface');
      kind === 'dialog' ? surface.close() : surface.hidePopover(); surface.remove();
    }, kind);
  }

  await dismiss();
  await evaluate("document.querySelector('#tooltip-probe')?.remove()");
  await waitFor("!!document.querySelector('[data-collection=news]')");
  await evaluate("document.querySelector('[data-collection=news]').click()");
  await waitFor("!!document.querySelector('tbody .table-link')");
  await run(() => {
    const row = [...document.querySelectorAll('tbody tr')].find(row => row.cells[1]?.textContent.trim() === 'launch-week');
    if (!row) throw new Error('Missing launch-week fixture');
    row.querySelector('.table-link').click();
  });
  await openProperties({ evaluate, waitFor });
  await waitFor("!!document.querySelector('.body-toolbar [data-media-trigger]')");
  await focus('.body-toolbar [data-media-trigger]'); fits(await geometry()); await snapshot('editor-toolbar');
  await evaluate("document.querySelector('.body-toolbar [data-media-trigger]').click()");
  await waitFor("!!document.querySelector('.media-menu:popover-open')");
  assert.equal(await evaluate(visible), false, 'Opening real media menu cleans up toolbar tooltip');
  await evaluate("[...document.querySelectorAll('.media-menu:popover-open [role=menuitem]')].find(item => item.textContent.trim() === 'Image').click()");
  await waitFor("!!document.querySelector('dialog[open] [data-tooltip=\"Grid view\"]')");
  await focus('dialog[open] [data-tooltip="Grid view"]'); fits(await geometry()); await snapshot('editor-image-dialog');
  await key('Escape', 'Escape', 27);
  assert.equal(await evaluate(visible), false);
  assert.equal(await evaluate("!!document.querySelector('dialog[open]')"), true, 'Tooltip Escape leaves real media dialog open');
  await evaluate("document.querySelector('dialog[open] .close').click()");
  await waitFor("!document.querySelector('dialog[open]')");
  const originalArticle = await readFile('src/content/news/launch-week.json');
  await evaluate("document.querySelector('.user-btn').click()");
  await evaluate("[...document.querySelectorAll('.user-menu button')].find(button=>button.textContent.includes('Settings')).click()");
  await waitFor("!!document.querySelector('.settings-nav')");
  await evaluate("[...document.querySelectorAll('.settings-nav button')].find(button=>button.textContent.trim()==='Content').click()");
  await chooseSelect({ evaluate, waitFor }, '.settings-pane [role=combobox]', 'Inline preview');
  await evaluate("document.querySelector('.settings-head .close').click()");
  await waitFor("document.querySelector('.canvas-stage')?.dataset.ready==='true'");
  const inlineDoc = "document.querySelector('.visual-editor iframe').contentDocument";
  await waitFor(`!!${inlineDoc}?.querySelector('[data-rigel-richtext="$body"] p')`);
  const pointer = await evaluate(`(() => {const frame=document.querySelector('.visual-editor iframe'),element=frame.contentDocument.querySelector('[data-rigel-richtext="$body"] p');element.scrollIntoView({block:'center'});const rect=element.getBoundingClientRect(),box=frame.getBoundingClientRect(),scale=box.width/frame.clientWidth;return {x:box.left+(rect.left+rect.width/2)*scale,y:box.top+(rect.top+rect.height/2)*scale};})()`);
  await cdp('Input.dispatchMouseEvent', {type:'mousePressed',...pointer,button:'left',clickCount:1});
  await cdp('Input.dispatchMouseEvent', {type:'mouseReleased',...pointer,button:'left',clickCount:1});
  await waitFor(`!!${inlineDoc}.querySelector('.block-content')`);
  await evaluate(`{const doc=${inlineDoc},root=doc.querySelector('.block-content'),range=doc.createRange();root.focus();range.selectNodeContents(root.querySelector('p'));const selection=doc.defaultView.getSelection();selection.removeAllRanges();selection.addRange(range);}`);
  await key('End', 'End', 35);
  await key('Enter', 'Enter', 13);
  await waitFor(`!!${inlineDoc}.querySelector('.body-toolbar:not([hidden]) [data-media-trigger]')`);
  const trigger = await evaluate(`(() => {const frame=document.querySelector('.visual-editor iframe'),element=frame.contentDocument.querySelector('.body-toolbar:not([hidden]) [data-media-trigger]'),rect=element.getBoundingClientRect(),box=frame.getBoundingClientRect(),scale=box.width/frame.clientWidth;return {x:box.left+(rect.left+rect.width/2)*scale,y:box.top+(rect.top+rect.height/2)*scale};})()`);
  await mouse(trigger.x, trigger.y);
  await waitFor(`!!${inlineDoc}.querySelector('#rigel-tooltip:popover-open')`);
  assert.equal(await evaluate(`(() => {const doc=${inlineDoc},tip=doc.querySelector('#rigel-tooltip:popover-open'),button=doc.querySelector('.body-toolbar:not([hidden]) [data-media-trigger]'),rect=tip.getBoundingClientRect(),anchor=button.getBoundingClientRect();return tip.ownerDocument===doc && button.getAttribute('aria-describedby')?.includes('rigel-tooltip') && rect.left>=8 && rect.top>=8 && rect.right<=doc.defaultView.innerWidth-7 && rect.bottom<=doc.defaultView.innerHeight-7 && (tip.dataset.side==='bottom' ? Math.abs(rect.top-anchor.bottom-8)<1 : tip.dataset.side==='top' && Math.abs(anchor.top-rect.bottom-8)<1);})()`), true, 'Inline toolbar tooltip uses its own iframe viewport and actual anchor');
  await snapshot('inline-iframe-toolbar');
  assert.deepEqual(await readFile('src/content/news/launch-week.json'), originalArticle, 'Tooltip interactions never save article content');
  assert.deepEqual(errors, [], errors.join('\n'));
  console.log('PASS: four sides/alignment/flip/clamp; desktop/390/320 theme palettes; hover/keyboard/ARIA/touch/cleanup; native top layers; real sidebar, toolbar, media dialog and inline iframe. Screenshots: _temp/tooltips/.');
} finally {
  socket?.close();
  if (chrome.exitCode === null && chrome.signalCode === null) {
    const exited = once(chrome, 'exit');
    chrome.kill('SIGKILL');
    await exited;
  }
  chrome.stderr.destroy();
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
