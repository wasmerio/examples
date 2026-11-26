import './local-only.mjs';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';

const url = process.env.RIGEL_URL || 'http://127.0.0.1:4321/rigel/';
const file = 'src/content/news/launch-week.json';
const original = await readFile(file);
const article = JSON.parse(original);
const paragraph = text => ({ type: 'paragraph', version: 1, children: text ? [{ type: 'text', version: 1, text, format: 0, mode: 'normal', style: '', detail: 0 }] : [], direction: null, format: '', indent: 0 });
article.body.root.children = [paragraph('Existing article text'), { type: 'video', version: 1, src: '/fixture-video.mp4' }, { type: 'embed', version: 1, provider: 'youtube', id: 'dQw4w9WgXcQ', privacy: true }, paragraph('')];
const fixture = JSON.stringify(article, null, 2) + '\n';
await mkdir('_temp/extensions', { recursive: true });
const profile = await mkdtemp(`${process.cwd()}/_temp/extensions/chrome-`);
const chrome = spawn(process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--no-first-run', '--no-default-browser-check', '--window-size=1440,1000', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
let socket;
try {
  await writeFile(file, fixture);
  const endpoint = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(Error('Chrome startup timeout')), 15000);
    chrome.once('error', reject);
    chrome.stderr.on('data', data => { const match = String(data).match(/DevTools listening on (ws:\/\/\S+)/); if (match) { clearTimeout(timeout); resolve(match[1]); } });
  });
  socket = new WebSocket(endpoint);
  await once(socket, 'open');
  let id = 0;
  const pending = new Map(), errors = [];
  socket.addEventListener('message', ({ data }) => {
    const result = JSON.parse(data), request = pending.get(result.id);
    if (request) { pending.delete(result.id); result.error ? request.reject(Error(result.error.message)) : request.resolve(result.result); }
    if (result.method === 'Runtime.exceptionThrown') errors.push(result.params.exceptionDetails.exception?.description ?? result.params.exceptionDetails.text);
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const requestId = ++id, timeout = setTimeout(() => { pending.delete(requestId); reject(Error(`CDP timeout: ${method}`)); }, 20000);
    pending.set(requestId, { resolve: value => { clearTimeout(timeout); resolve(value); }, reject: error => { clearTimeout(timeout); reject(error); } });
    socket.send(JSON.stringify({ id: requestId, method, params, sessionId }));
  });
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const cdp = (method, params) => send(method, params, sessionId);
  const evaluate = async expression => {
    const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
    return result.result.value;
  };
  const waitFor = async expression => {
    for (let attempt = 0; attempt < 150; attempt++) { if (await evaluate(expression)) return; await new Promise(resolve => setTimeout(resolve, 100)); }
    throw Error(`Timed out: ${expression}\n${errors.join('\n')}\n${await evaluate(`(() => {const doc=${doc};return JSON.stringify({active:doc.activeElement?.outerHTML.slice(0,200),selection:doc.getSelection()?.anchorNode?.textContent,body:doc.querySelector('.block-content')?.innerHTML,slash:doc.querySelector('.block-slash')?.outerHTML});})()`)}`);
  };
  const doc = "document.querySelector('.visual-editor iframe').contentDocument";
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const frameClick = async selector => {
    const point = await evaluate(`(async () => {const element=${doc}.querySelector(${JSON.stringify(selector)});element.scrollIntoView({block:'center'});await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));const rect=element.getBoundingClientRect(),outer=document.querySelector('.visual-editor iframe').getBoundingClientRect();const x=[Math.min(rect.width/2,30),rect.width/2,rect.width-12].find(x=>element.contains(element.ownerDocument.elementFromPoint(rect.left+x,rect.top+rect.height/2)));if(x===undefined)throw Error('Click target obscured: '+${JSON.stringify(selector)});return {x:outer.left+rect.left+x,y:outer.top+rect.top+rect.height/2};})()`);
    await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point });
    await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point });
    await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point });
  };
  const key = async (key, code) => {
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key, windowsVirtualKeyCode: code, ...(key === 'Enter' ? { code: 'Enter', text: '\r' } : {}) });
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key, windowsVirtualKeyCode: code });
  };
  const open = async () => {
    await waitFor("!!document.querySelector('[data-collection=news]')");
    await click('[data-collection=news]');
    await waitFor("!!document.querySelector('tbody .table-link')");
    await evaluate("[...document.querySelectorAll('tbody tr')].find(row=>row.cells[1].textContent.trim()==='launch-week').querySelector('.table-link').click()");
    await waitFor("document.querySelector('.canvas-stage')?.dataset.ready==='true'");
  };
  await cdp('Page.enable'); await cdp('Runtime.enable');
  await cdp('Page.addScriptToEvaluateOnNewDocument', { source: "localStorage.setItem('rigelcms.settings', JSON.stringify({language:'en',theme:'light',devMode:true,userPref:{editorExperience:'inline'}}))" });
  await cdp('Page.navigate', { url }); await open();
  await frameClick('[data-rigel-richtext="$body"] > p');
  await waitFor(`!!${doc}.querySelector('.block-content')`);
  await waitFor(`!!${doc}.querySelector('.body-toolbar:not([hidden]) [aria-label="Insert call to action"]')`);
  await waitFor(`!!${doc}.querySelector('.body-toolbar:not([hidden]) [data-rigel-group="widgets"] button')`);
  assert.equal(await evaluate(`${doc}.querySelector('[data-rigel-group="widgets"] button').textContent.trim()`), '', 'Group trigger can use only an SVG icon');
  assert.equal(await evaluate(`${doc}.querySelector('[data-rigel-group="widgets"] button').getAttribute('aria-label')`), 'Widgets');
  assert.equal(await evaluate(`!!${doc}.querySelector('.body-toolbar > [data-rigel-command="insert-callout"]')`), false, 'Grouped actions do not become separate top-level buttons');
  assert.equal(await evaluate(`!!${doc}.querySelector('.body-toolbar [data-media-trigger]')`), false, 'Custom CTA remains available on populated text while built-in insertion is hidden');
  for (const selector of ['.media-video', '.media-embed']) {
    await frameClick(selector);
    await waitFor(`!!${doc}.querySelector('.body-toolbar:not([hidden]) [aria-label="Insert call to action"]')?.getClientRects().length`);
    assert.equal(await evaluate(`!!${doc}.querySelector('.body-toolbar:not([hidden]) [data-rigel-group="widgets"] button')?.getClientRects().length`), true, `Group remains available on ${selector}`);
    assert.equal(await evaluate(`!!${doc}.querySelector('.body-toolbar:not([hidden]) [data-media-trigger]')`), false, `Custom-only toolbar on ${selector}`);
  }
  await frameClick('.block-content > p:last-child');
  await cdp('Input.insertText', { text: '/cta' });
  await waitFor(`${doc}.querySelector('.block-slash:popover-open')?.textContent.includes('Insert call to action')`);
  await key('Enter', 13);
  await waitFor(`!!${doc}.querySelector('.cta-editor [aria-label="CTA text"]')`);
  assert.equal(await evaluate(`${doc}.querySelector('.block-content').textContent.includes('/cta')`), false, 'Successful slash insertion replaces the command paragraph');
  assert.equal(await readFile(file, 'utf8'), fixture, 'Extension insertion does not autosave');
  await frameClick('.cta-editor [aria-label="CTA text"]');
  await evaluate(`(() => {const input=${doc}.querySelector('.cta-editor [aria-label="CTA text"]');input.select();})()`);
  await cdp('Input.insertText', { text: 'Contact' });
  for (const character of ' our team') {
    await cdp('Input.insertText', { text: character });
    assert.equal(await evaluate(`${doc}.activeElement === ${doc}.querySelector('.cta-editor [aria-label="CTA text"]')`), true, 'Custom Svelte editor retains focus between data updates');
  }
  await waitFor(`${doc}.querySelector('.cta-editor a')?.textContent==='Contact our team'`);
  assert.equal(await readFile(file, 'utf8'), fixture, 'Custom block editing does not autosave');
  await frameClick('[data-rigel-extension-editor]');
  await waitFor(`!!${doc}.querySelector('.body-toolbar:not([hidden]) [aria-label="Insert call to action"]')?.getClientRects().length`);
  await writeFile('_temp/extensions/cta-editor.png', Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
  await click('.save-button');
  await waitFor("document.querySelector('.save-status')?.textContent.trim()==='Saved'");
  const saved = JSON.parse(await readFile(file, 'utf8'));
  const custom = saved.body.root.children.find(node => node.type === 'extension');
  assert.deepEqual(custom, { type: 'extension', version: 1, name: 'call-to-action', data: { text: 'Contact our team', href: '/contact/' } });
  assert.equal(saved.body.root.children[0].children[0].text, 'Existing article text', 'Insertion preserves existing copy');
  let published = '';
  for (let attempt = 0; attempt < 50; attempt++) {
    published = await fetch(new URL('/news/launch-week/', url)).then(response => response.text());
    if (published.includes('Contact our team')) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.match(published, /Contact our team/);
  assert.match(published, /class="call-to-action/);
  assert.equal(published.includes('CTA destination'), false, 'Published output renders the custom display component, not its editor');
  const rejected = structuredClone(saved);
  rejected.body.root.children.find(node => node.type === 'extension').data.href = 'javascript:alert(1)';
  const response = await evaluate(`fetch('/rigel/api/local/news/launch-week',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(${JSON.stringify({ frontmatter: rejected.frontmatter, body: rejected.body })})}).then(async response=>({status:response.status,body:await response.text()}))`);
  assert.equal(response.status, 400, `Declared block validation is enforced by local saves: ${response.body}`);
  assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), saved, 'Rejected extension data never reaches disk');
  await evaluate('window.__extensionBeforeReload=true');
  await cdp('Page.reload');
  await waitFor('!window.__extensionBeforeReload && document.readyState===\"complete\"');
  await open();
  await waitFor(`${doc}.querySelector('[data-rigel-extension] .call-to-action')?.textContent==='Contact our team'`);
  assert.equal(await evaluate(`!!${doc}.querySelector('.cta-editor')`), false, 'Read-only preview mounts the display component, not the editor');
  await frameClick('[data-rigel-richtext="$body"] > p');
  await waitFor(`${doc}.querySelector('.cta-editor [aria-label="CTA text"]')?.value==='Contact our team'`);
  await frameClick('.block-content > p');
  await frameClick('.body-toolbar [aria-label="Insert call to action"]');
  await waitFor(`${doc}.querySelectorAll('.cta-editor').length===2`);
  assert.equal(JSON.parse(await readFile(file, 'utf8')).body.root.children.filter(node => node.type === 'extension').length, 1, 'Toolbar insertion also respects explicit Save');
  await frameClick('.block-content > p');
  await frameClick('.body-toolbar [data-rigel-group="widgets"] button');
  await waitFor(`!!${doc}.querySelector('[data-rigel-group-menu="widgets"]:popover-open')`);
  assert.deepEqual(await evaluate(`[...${doc}.querySelectorAll('[data-rigel-group-menu="widgets"]:popover-open button')].map(button=>button.textContent.trim())`), ['Insert callout', 'Insert warning']);
  assert.equal(await evaluate(`${doc}.querySelector('[data-rigel-group="widgets"] button').getAttribute('aria-expanded')`), 'true');
  assert.equal(await evaluate(`(() => {const menu=${doc}.querySelector('[data-rigel-group-menu="widgets"]:popover-open'),button=menu.querySelector('button'),view=menu.ownerDocument.defaultView,style=view.getComputedStyle(menu);return Math.abs(button.getBoundingClientRect().width-(menu.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)))<=1&&view.getComputedStyle(button).borderTopStyle==='none';})()`), true, 'Group actions use full-width Rigel menu styles inside the iframe');
  assert.equal(await evaluate(`(() => {const menu=${doc}.querySelector('[data-rigel-group-menu="widgets"]:popover-open'),rect=menu.getBoundingClientRect(),view=menu.ownerDocument.defaultView;return rect.left>=0&&rect.top>=0&&rect.right<=view.innerWidth&&rect.bottom<=view.innerHeight;})()`), true, 'Group menu fits inside its preview iframe');
  await writeFile('_temp/extensions/widgets-menu.png', Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
  await key('End', 35);
  assert.equal(await evaluate(`${doc}.activeElement.textContent.trim()`), 'Insert warning');
  await key('Home', 36);
  assert.equal(await evaluate(`${doc}.activeElement.textContent.trim()`), 'Insert callout');
  await key('Escape', 27);
  assert.equal(await evaluate(`${doc}.activeElement.getAttribute('aria-label')`), 'Widgets', 'Dismissal restores group trigger focus');
  await frameClick('.body-toolbar [data-rigel-group="widgets"] button');
  await waitFor(`!!${doc}.querySelector('[data-rigel-group-menu="widgets"]:popover-open')`);
  await key('Home', 36); await key('Enter', 13);
  await waitFor(`!!${doc}.querySelector('.callout-editor [aria-label="Callout title"]')`);
  await frameClick('.callout-editor [aria-label="Callout title"]');
  await evaluate(`${doc}.querySelector('.callout-editor [aria-label="Callout title"]').select()`);
  await cdp('Input.insertText', { text: 'Reading tip' });
  await cdp('Input.insertText', { text: '!' });
  assert.equal(await evaluate(`${doc}.activeElement === ${doc}.querySelector('.callout-editor [aria-label="Callout title"]')`), true, 'Grouped widget editor preserves focus');
  assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), saved, 'Grouped insertion and edits do not autosave');
  await writeFile('_temp/extensions/widgets-editor.png', Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
  await click('.save-button');
  await waitFor("document.querySelector('.save-status')?.textContent.trim()==='Saved'");
  const grouped = JSON.parse(await readFile(file, 'utf8'));
  assert.deepEqual(grouped.body.root.children.find(node=>node.name==='callout'), {type:'extension',version:1,name:'callout',data:{title:'Reading tip!',message:'Add a useful note for your readers.',tone:'info'}});
  await evaluate('window.__extensionBeforeReload=true'); await cdp('Page.reload');
  await waitFor('!window.__extensionBeforeReload && document.readyState==="complete"'); await open();
  await waitFor(`${doc}.querySelector('[data-rigel-extension="callout"] .article-callout strong')?.textContent==='Reading tip!'`);
  for (let attempt = 0; attempt < 50; attempt++) {
    published = await fetch(new URL('/news/launch-week/', url)).then(response => response.text());
    if (published.includes('Reading tip!')) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.match(published, /Reading tip!/);
  assert.match(published, /class="article-callout/);
  await frameClick('[data-rigel-richtext="$body"] > p');
  await waitFor(`!!${doc}.querySelector('.block-content')`);
  await evaluate(`(() => { const root = ${doc}.querySelector('.block-content'), range = ${doc}.createRange(); root.focus(); range.selectNodeContents(root.querySelector(':scope > p:last-child')); range.collapse(false); const selection = ${doc}.getSelection(); selection.removeAllRanges(); selection.addRange(range); })()`);
  await cdp('Input.insertText', { text: '/warning' });
  await waitFor(`${doc}.querySelector('.block-slash:popover-open')?.textContent.includes('Insert warning')`);
  await key('Enter', 13);
  await waitFor(`${doc}.querySelectorAll('.callout-editor').length===2`);
  assert.equal(await evaluate(`[...${doc}.querySelectorAll('.callout-editor [aria-label="Callout title"]')].some(input=>input.value==='Before you begin')`), true, 'Grouped actions retain independent slash shortcuts');
  assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), grouped, 'Grouped slash insertion also respects explicit Save');
  assert.deepEqual(errors, []);
  console.log('PASS: standalone and grouped icon buttons, keyboard menu/focus/bounds, slash insertion, reactive CTA/callout editors, explicit Save, disk/reload, read-only previews, published renderers and backend validation');
} finally {
  socket?.close();
  const stopped = once(chrome, 'exit').catch(() => {});
  chrome.kill();
  const forced = setTimeout(() => chrome.kill('SIGKILL'), 2000);
  await stopped; clearTimeout(forced); chrome.stderr.destroy();
  await writeFile(file, original);
  assert.deepEqual(await readFile(file), original);
  await rm(profile, { recursive: true, force: true });
}
