import "./local-only.mjs";
import { chooseSelect, openProperties } from './editor-controls.mjs';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';

const url = process.env.RIGEL_URL || 'http://127.0.0.1:4321/rigel/';
const originals = new Map();
for (const collection of ['blog', 'news']) for (const file of await readdir(`src/content/${collection}`)) if (file.endsWith('.json')) {
  const path = `src/content/${collection}/${file}`;
  originals.set(path, await readFile(path));
}
assert.ok(originals.has("src/content/news/launch-week.json"));
const file = 'src/content/news/launch-week.json';
const fixture = JSON.parse(originals.get(file));
const paragraph = text => ({ children: text ? [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }] : [], direction: null, format: '', indent: 0, type: 'paragraph', version: 1, textFormat: 0, textStyle: '' });
fixture.body.root.children = [paragraph('First block'), paragraph('Second block')];
const fixtureBytes = JSON.stringify(fixture, null, 2) + '\n';
await mkdir('_temp', { recursive: true });
const profile = await mkdtemp(`${process.cwd()}/_temp/blog-blocks-`);
const chrome = spawn(process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--no-first-run', '--no-default-browser-check', '--window-size=1440,1000', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
let socket;
try {
  await writeFile(file, fixtureBytes);
  const endpoint = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Chrome did not start')), 15000);
    chrome.once('error', reject);
    chrome.stderr.on('data', chunk => { const match = String(chunk).match(/DevTools listening on (ws:\/\/\S+)/); if (match) { clearTimeout(timer); resolve(match[1]); } });
  });
  socket = new WebSocket(endpoint); await once(socket, 'open');
  let id = 0;
  const pending = new Map(), errors = [];
  let unloads = 0;
  socket.addEventListener('message', ({ data }) => {
    const result = JSON.parse(data), request = pending.get(result.id);
    if (request) { pending.delete(result.id); result.error ? request.reject(new Error(result.error.message)) : request.resolve(result.result); }
    if (result.method === 'Runtime.exceptionThrown') errors.push(result.params.exceptionDetails.exception?.description ?? result.params.exceptionDetails.text);
    if (result.method === 'Page.javascriptDialogOpening' && result.params.type === 'beforeunload') { unloads++; void cdp('Page.handleJavaScriptDialog', { accept: false }); }
  });
  function send(method, params = {}, sessionId) {
    return new Promise((resolve, reject) => {
      const requestId = ++id, timer = setTimeout(() => { pending.delete(requestId); reject(new Error(`CDP timeout: ${method}`)); }, 20000);
      pending.set(requestId, { resolve: result => { clearTimeout(timer); resolve(result); }, reject: error => { clearTimeout(timer); reject(error); } });
      socket.send(JSON.stringify({ id: requestId, method, params, sessionId }));
    });
  }
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const cdp = (method, params) => send(method, params, sessionId);
  await cdp('Runtime.enable'); await cdp('Page.enable');
  const evaluate = async expression => {
    const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? 'Browser evaluation failed');
    return result.result.value;
  };
  const waitFor = async expression => { for (let i = 0; i < 150; i++) { if (await evaluate(expression)) return; await new Promise(resolve => setTimeout(resolve, 100)); } throw new Error(`Timed out: ${expression}\nErrors: ${errors.join('\n')}`); };
  const navigate = async (method, params) => {
    const loaded = new Promise((resolve, reject) => {
      const timer = setTimeout(() => { socket.removeEventListener('message', listener); reject(new Error('Navigation timed out')); }, 20000);
      const listener = ({ data }) => { const event = JSON.parse(data); if (event.method === 'Page.loadEventFired' && event.sessionId === sessionId) { clearTimeout(timer); socket.removeEventListener('message', listener); resolve(); } };
      socket.addEventListener('message', listener);
    });
    await cdp(method, params); await loaded;
  };
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const mouse = async (type, point, extra = {}) => cdp('Input.dispatchMouseEvent', { type, ...point, ...extra });
  const point = selector => evaluate(`(async () => { const element = document.querySelector(${JSON.stringify(selector)}); element.scrollIntoView({block:'center'}); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); const r = element.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}; })()`);
  const realClick = async selector => { const p = await point(selector); await mouse('mouseMoved', p); await mouse('mousePressed', p, {button:'left',clickCount:1}); await mouse('mouseReleased', p, {button:'left',clickCount:1}); };
  const key = async key => { const code = { Enter:13, Escape:27, ArrowDown:40, ArrowUp:38, Backspace:8, Tab:9 }[key]; await cdp('Input.dispatchKeyEvent', {type:'keyDown',key,windowsVirtualKeyCode:code}); await cdp('Input.dispatchKeyEvent', {type:'keyUp',key,windowsVirtualKeyCode:code}); };
  const focus = async (selector, all = false) => { await point(selector); await evaluate(`(() => { const root = document.querySelector('.block-content'), element = document.querySelector(${JSON.stringify(selector)}); root.focus(); const range = document.createRange(); range.selectNodeContents(element); ${all ? '' : 'range.collapse(false);'} const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); })()`); };
  const tree = () => evaluate("JSON.parse(document.querySelector('main > .md-preview pre').textContent).body");
  const open = async (collection, slug) => {
    await waitFor(`!!document.querySelector('[data-collection=${collection}]')`); await click(`[data-collection=${collection}]`);
    await waitFor("!!document.querySelector('tbody .table-link')");
    await evaluate(`[...document.querySelectorAll('tbody tr')].find(row => row.cells[1].textContent.trim() === ${JSON.stringify(slug)}).querySelector('.table-link').click()`);
    await openProperties({ evaluate, waitFor });
    await waitFor("document.querySelector('.block-content')?.children.length > 0 && document.querySelector('.canvas-stage')?.dataset.ready === 'true'");
  };
  await cdp('Page.addScriptToEvaluateOnNewDocument', { source: "localStorage.setItem('rigelcms.settings',JSON.stringify({theme:'light',devMode:true,userPref:{editorExperience:'sidebar'}})); window.alert=window.confirm=window.prompt=()=>{throw Error('No native dialogs')};" });
  await navigate('Page.navigate', { url });
  await open('news', 'launch-week');
  assert.equal(await evaluate("document.querySelector('[data-collection-field=\"$body\"] .ProseMirror') === null"), true);
  assert.equal(await evaluate("document.querySelector('.save-button').disabled"), true, 'Mount does not dirty an article: ' + JSON.stringify(await tree()));
  const beforeInsertion = await tree();
  const insertionPoint = await evaluate("(() => {const root=document.querySelector('.block-content');root.children[0].scrollIntoView({block:'center'});const first=root.children[0].getBoundingClientRect(),next=root.children[1].getBoundingClientRect();return {x:first.left+8,y:(first.bottom+next.top)/2};})()");
  await mouse('mouseMoved',insertionPoint);
  await waitFor("!!document.querySelector('.block-insert')");
  assert.deepEqual(await tree(),beforeInsertion,'Hovering between blocks is not an edit');
  await realClick('.block-insert');
  await waitFor(`document.querySelector('.block-content').children.length===${beforeInsertion.root.children.length + 1}`);
  const afterInsertion = await tree();
  assert.equal(afterInsertion.root.children[1].type,'paragraph');
  assert.deepEqual(afterInsertion.root.children[1].children,[],'Insertion starts as an empty paragraph');
  assert.deepEqual(afterInsertion.root.children.filter((_,index)=>index!==1),beforeInsertion.root.children,'Both neighboring blocks remain unchanged');
  assert.equal(await evaluate("document.querySelector('.block-content').children[1].contains(getSelection().anchorNode)"),true,'Caret moves into the new paragraph');
  assert.equal(await readFile(file,'utf8'),fixtureBytes,'Inserting never autosaves');
  await realClick('.body-toolbar .block-history');
  await waitFor(`document.querySelector('.block-content').children.length===${beforeInsertion.root.children.length}`);
  assert.deepEqual(await tree(),beforeInsertion,'Insertion is one undoable operation');
  await evaluate("[...document.querySelectorAll('.body-toolbar .block-history')].find(button=>button.textContent==='Redo').click()");
  await waitFor(`document.querySelector('.block-content').children.length===${afterInsertion.root.children.length}`);
  await focus('.block-content > :last-child'); await key('Enter');
  await cdp('Input.insertText', { text: '/heading' });
  await waitFor("document.querySelector('.block-slash')?.textContent.includes('Heading 2')");
  assert.equal(await evaluate("document.querySelectorAll('.block-slash [role=option]').length"), 6);
  await key('ArrowDown'); await key('Enter'); await cdp('Input.insertText', { text: 'Block test heading' });
  await waitFor("document.querySelector('.block-content h2')?.textContent === 'Block test heading'");
  assert.equal(await evaluate("document.querySelector('.body-toolbar [role=combobox][aria-label=\"Block type\"]').dataset.tooltip"),'Heading 2','Sidebar trigger identifies the selected heading');
  await realClick('.body-toolbar [role=combobox][aria-label="Block type"]');
  await waitFor("!!document.querySelector('.select-menu:popover-open')");
  assert.equal(await evaluate("[...document.querySelectorAll('.select-menu:popover-open [role=option]')].every(option=>!!option.querySelector('svg'))"),true,'Every block conversion option has an icon');
  assert.equal(await evaluate("document.querySelector('.body-toolbar [role=combobox] svg path').getAttribute('d')===document.querySelector('.select-menu:popover-open [aria-selected=true] svg path').getAttribute('d')"),true,'Sidebar trigger uses the current block icon');
  await key('Escape'); await focus('.block-content h2');
  await key('Enter'); await cdp('Input.insertText', { text: 'Block test tail' });
  await waitFor("document.querySelector('.block-content > :last-child')?.textContent === 'Block test tail'");
  assert.equal(await readFile(file, 'utf8'), fixtureBytes, 'No autosave');
  const tail = await point('.block-content > :last-child'); await mouse('mouseMoved', tail);
  await waitFor("!!document.querySelector('.block-handle')");
  const { grip, first } = await evaluate("(async () => {await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));const center=selector=>{const r=document.querySelector(selector).getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}};return {grip:center('.block-handle'),first:center('.block-content > :first-child')};})()");
  const hit = await evaluate(`document.elementFromPoint(${grip.x},${grip.y})?.outerHTML.slice(0,600)`);
  assert.equal(await evaluate(`!!document.elementFromPoint(${grip.x},${grip.y})?.closest('.block-handle')`),true,'Drag handle is not obscured: ' + JSON.stringify({grip,first,hit}));
  await mouse('mouseMoved', grip); await mouse('mousePressed', grip, {button:'left',clickCount:1});
  const destination = { x: first.x, y: first.y - 10 };
  for (let i = 1; i <= 12; i++) await mouse('mouseMoved', {x:grip.x+(destination.x-grip.x)*i/12,y:grip.y+(destination.y-grip.y)*i/12}, {button:'left',buttons:1});
  await waitFor("!!document.querySelector('.block-drop-indicator')");
  await mouse('mouseReleased', destination, {button:'left',clickCount:1});
  await waitFor("document.querySelector('.block-content > :first-child')?.textContent === 'Block test tail'");
  await evaluate("[...document.querySelectorAll('.block-history')].find(button=>button.textContent==='Undo').click()");
  await waitFor("document.querySelector('.block-content > :first-child')?.textContent === 'First block'");
  await evaluate("[...document.querySelectorAll('.block-history')].find(button=>button.textContent==='Redo').click()");
  await waitFor("document.querySelector('.block-content > :first-child')?.textContent === 'Block test tail'");
  console.log('PASS: vanilla Lexical mount, filtered keyboard slash insertion, real mouse drag/drop indicator and reorder; no autosave');
  await focus('.block-content > :first-child', true);
  await waitFor("!!document.querySelector('.block-float')");
  assert.deepEqual(await evaluate("[...document.querySelectorAll('.block-float button')].filter(button=>!button.closest('[data-rigel-command],[data-rigel-group]')).map(button=>button.getAttribute('aria-label'))"),['Bold','Italic','Link','More formatting']);
  assert.equal(await evaluate("!!document.querySelector('.block-float [aria-label=\"Insert call to action\"]')"),true,'Custom extension actions accompany selected text');
  await realClick('.block-float [aria-label=Bold]');
  await waitFor("document.querySelector('.block-content > :first-child .block-bold')?.textContent === 'Block test tail'");
  const beforeFormats = await tree();
  await realClick('.block-float [aria-label="More formatting"]');
  await waitFor("!!document.querySelector('.block-format-menu:popover-open')");
  assert.deepEqual(await evaluate("[...document.querySelectorAll('.block-format-menu button')].map(button=>button.getAttribute('aria-label'))"),['Inline code','Strikethrough','Underline','Highlight','Subscript','Superscript']);
  await key('End'); assert.equal(await evaluate("document.activeElement.getAttribute('aria-label')"),'Superscript');
  await key('ArrowDown'); assert.equal(await evaluate("document.activeElement.getAttribute('aria-label')"),'Inline code');
  await key('Escape'); assert.equal(await evaluate("document.activeElement.getAttribute('aria-label')"),'More formatting');
  assert.deepEqual(await tree(),beforeFormats,'Opening and dismissing formatting is not an edit');
  for (const [label,selector] of [['Inline code','code'],['Strikethrough','.block-strike'],['Underline','.block-underline'],['Highlight','mark'],['Subscript','sub'],['Superscript','sup']]) {
    await focus('.block-content > :first-child',true);
    await realClick('.block-float [aria-label="More formatting"]');
    await realClick(`.block-format-menu [aria-label="${label}"]`);
    await waitFor(`!!document.querySelector('.block-content > :first-child ${selector}')`);
    await realClick('.block-float [aria-label="More formatting"]');
    assert.equal(await evaluate(`document.querySelector('.block-format-menu [aria-label="${label}"]').getAttribute('aria-checked')`),'true',`${label} reports the selected format`);
    await realClick(`.block-format-menu [aria-label="${label}"]`);
    await waitFor(`!document.querySelector('.block-content > :first-child ${selector}')`);
  }
  for (const label of ['Underline','Highlight']) {
    await focus('.block-content > :first-child',true);
    await realClick('.block-float [aria-label="More formatting"]');
    await realClick(`.block-format-menu [aria-label="${label}"]`);
  }
  await realClick('.block-float [aria-label="More formatting"]');
  await writeFile('_temp/more-formatting.png',Buffer.from((await cdp('Page.captureScreenshot',{format:'png'})).data,'base64'));
  assert.equal(await evaluate("!!document.querySelector('.visual-editor iframe').contentDocument.querySelector('[data-rigel-richtext=\"$body\"] mark u')"),true,'Live preview preserves highlight and underline before Save');
  await key('Escape');
  await focus('.block-content > :first-child', true);
  await evaluate("window.textLinkSelection=getSelection().getRangeAt(0).cloneRange()");
  await realClick('.block-editor .body-toolbar [aria-label=Link]');
  await waitFor("!!document.querySelector('.block-editor [aria-label=\"Edit link\"] input')");
  assert.equal(await evaluate("document.querySelector('.block-float')?.getClientRects().length"),1,'Selected-text toolbar stays visible with the sidebar link form open');
  assert.equal(await evaluate("document.querySelector('.markdown-link').getBoundingClientRect().top >= window.textLinkSelection.getBoundingClientRect().bottom + 4"),true,'Sidebar link form opens below the selected copy');
  assert.equal(await evaluate("(() => {const form=document.querySelector('.markdown-link').getBoundingClientRect(),bar=document.querySelector('.block-float').getBoundingClientRect();return form.top>=bar.bottom || form.bottom<=bar.top;})()"),true,'Link form does not cover the selected-text toolbar');
  await evaluate("(() => {const input=document.querySelector('.block-editor [aria-label=\"Edit link\"] input'); input.value='/about/';input.dispatchEvent(new Event('input',{bubbles:true}));})()");
  await evaluate("document.querySelector('.block-editor [aria-label=\"Apply link\"]').click()");
  await waitFor("!!document.querySelector('.block-content a[href=\"/about/\"]')");
  await focus('.block-content > :last-child'); await key('Enter');
  await evaluate("(() => {const data=new DataTransfer();data.setData('text/plain','Plain paste');data.setData('text/html','<img src=x onerror=window.pasteExecuted=true><script>window.pasteExecuted=true</script>');document.querySelector('.block-content').dispatchEvent(new ClipboardEvent('paste',{clipboardData:data,bubbles:true,cancelable:true}));})()");
  await waitFor("document.querySelector('.block-content').textContent.includes('Plain paste')");
  assert.equal(await evaluate('window.pasteExecuted === undefined'), true);
  assert.equal(await evaluate("document.querySelector('.block-content [onerror], .block-content script') === null"), true);
  const beforeMarkdown = await tree();
  await click('.block-editor .markdown-heading button');
  await waitFor("!!document.querySelector('.block-markdown')");
  assert.equal(await evaluate("document.querySelector('.block-markdown').tagName"), 'PRE');
  assert.equal(await evaluate("document.querySelector('.block-markdown').isContentEditable"), false);
  assert.deepEqual(await tree(), beforeMarkdown);
  await click('.block-editor .markdown-heading button');
  console.log('PASS: floating bold/link controls, plain-text-only paste and inert read-only Markdown view');
  const addBlock = async (label, selector, text) => {
    await realClick('.block-add'); await waitFor("!!document.querySelector('.block-slash')");
    assert.equal(await evaluate("[...document.querySelectorAll('.block-slash button')].some(button=>button.textContent==='Callout')"),false,'Article insertion does not offer Callout');
    await evaluate(`[...document.querySelectorAll('.block-slash button')].find(button=>button.textContent===${JSON.stringify(label)}).click()`);
    await waitFor(`!!document.querySelector(${JSON.stringify(selector)})`);
    if (text) await cdp('Input.insertText',{text});
  };
  for (const [label,selector,text] of [
    ['Heading 1','.block-content h1','Heading one'],
    ['Heading 3','.block-content h3','Subheading three'],
    ['Heading 4','.block-content h4','Subheading four'],
    ['Heading 5','.block-content h5','Heading five'],
    ['Heading 6','.block-content h6','Heading six'],
    ['Quote','.block-content blockquote','Quoted block'],
    ['Bulleted list','.block-content ul','Bullet item'],
    ['Numbered list','.block-content ol','Numbered item'],
    ['Code block','.block-content .block-code','const safe = "<script>";'],
    ['Divider','.block-content hr',''],
  ]) await addBlock(label,selector,text);
  await realClick('.block-editor .body-toolbar [aria-label="Insert media"]');
  await realClick('.media-menu:popover-open [role="menuitem"]');
  await waitFor("!!document.querySelector('.image-dialog .thumb')");
  await realClick('.image-dialog .thumb');
  await waitFor("!!document.querySelector('.image-dialog .media-actions .primary')");
  await evaluate("(() => {const input=[...document.querySelectorAll('.image-dialog label')].find(label=>label.textContent.startsWith('Alt text')).querySelector('input');input.value='Block image description';input.dispatchEvent(new Event('input',{bubbles:true}));})()");
  await realClick('.image-dialog .media-actions .primary');
  await waitFor("!!document.querySelector('.block-content img[alt=\"Block image description\"]')");
  await evaluate("document.querySelector('.block-content img').decode()");
  await realClick('.block-content img[alt="Block image description"]');
  await waitFor("!!document.querySelector('.body-toolbar.image-toolbar:not([hidden])')");
  assert.equal(await evaluate("!!document.querySelector('.body-toolbar[aria-label=\"Body formatting\"] [aria-label=\"Table\"]')"),true,'Selecting an image keeps the main sidebar toolbar mounted');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.body-toolbar[aria-label=\"Body formatting\"]')).position"),'sticky','Main sidebar toolbar stays at the top instead of becoming image controls');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.body-toolbar.image-toolbar')).position"),'fixed','Sidebar image selection also shows floating controls');
  assert.equal(await evaluate("(() => {const main=document.querySelector('.body-toolbar[aria-label=\"Body formatting\"]').getBoundingClientRect(),image=document.querySelector('.image-toolbar').getBoundingClientRect();return main.top>=0 && main.bottom<=innerHeight && image.top>=main.bottom;})()"),true,'Main toolbar stays visible without being covered by image controls');
  await writeFile('_temp/sidebar-image-toolbars.png',Buffer.from((await cdp('Page.captureScreenshot',{format:'png'})).data,'base64'));
  await realClick('.body-toolbar [aria-label="Edit alt text"]');
  await waitFor("document.querySelector('[aria-label=\"Image alt text\"]')?.value==='Block image description'");
  assert.equal(await evaluate("document.querySelector('.body-toolbar.image-toolbar').getClientRects().length"),1,'Sidebar image toolbar stays visible with the alt form open');
  await realClick('.body-toolbar [aria-label="Add image link"]');
  await waitFor("!!document.querySelector('.markdown-link input') && !document.querySelector('[aria-label=\"Image alt text\"]')");
  assert.equal(await evaluate("document.querySelector('.body-toolbar.image-toolbar').getClientRects().length"),1,'Toolbar stays visible when switching from alt text to link');
  await realClick('[aria-label="Close link"]');
  await waitFor("!document.querySelector('[aria-label=\"Image alt text\"]')");
  assert.equal(await evaluate("document.querySelector('.block-content img').alt"),'Block image description','Closing alt editing does not change the image');
  await realClick('.body-toolbar[aria-label="Body formatting"] [aria-label="Insert media"]');
  await realClick('.media-menu:popover-open [role="menuitem"]');
  await waitFor("!!document.querySelector('.image-dialog .thumb')");
  await realClick('.image-dialog .thumb');
  await waitFor("!!document.querySelector('.image-dialog .media-actions .primary')");
  await realClick('.image-dialog .media-actions .primary');
  await waitFor("document.querySelectorAll('.block-content figure img').length===2");
  assert.equal(await evaluate("document.querySelectorAll('.block-content img[alt=\"Block image description\"]').length"),1,'Main Insert image adds another image instead of replacing the selected one');
  await focus('.block-content h3');
  const headingPoint = await point('.block-content h3'); await mouse('mouseMoved',headingPoint);
  await realClick('.block-handle');
  await waitFor("!!document.querySelector('.block-menu:popover-open')");
  await evaluate("[...document.querySelectorAll('.block-menu > button')].find(button=>button.textContent==='Duplicate block').click()");
  await waitFor("document.querySelectorAll('.block-content h3').length === 2");
  await focus('.block-content h3'); await mouse('mouseMoved',await point('.block-content h3')); await realClick('.block-handle');
  await evaluate("[...document.querySelectorAll('.block-menu > button')].find(button=>button.textContent==='Delete block').click()");
  await waitFor("document.querySelectorAll('.block-content h3').length === 1");
  console.log('PASS: all v1 block types, ImagePicker with alt text, duplicate and delete actions');
  await addBlock('Table','.block-content table');
  await waitFor("document.querySelectorAll('.block-content table tr').length === 3 && !!document.querySelector('.block-table-controls')");
  await focus('.block-content table tr:first-child > :first-child p',true); await cdp('Input.insertText',{text:'Product'});
  await key('Tab');
  assert.equal(await evaluate("getSelection().anchorNode.parentElement.closest('th,td').cellIndex"),1,'Tab moves to the next cell');
  await cdp('Input.insertText',{text:'Price'});
  await focus('.block-content table tr:nth-child(2) > :first-child p',true); await cdp('Input.insertText',{text:'Basic | plan'});
  const tableButton = async label => { if (!await evaluate("!!document.querySelector('.block-table-menu:popover-open')")) await realClick('.body-toolbar button[aria-label="Table"]'); const selector = await evaluate(`(() => {const buttons=[...document.querySelectorAll('.block-table-controls button')];return buttons.findIndex(button=>button.textContent===${JSON.stringify(label)})+1;})()`); await realClick(`.block-table-controls button:nth-child(${selector})`); };
  await tableButton('Add row below'); await waitFor("document.querySelectorAll('.block-content table tr').length === 4");
  await focus('.block-content table tr:last-child > :last-child p');
  await tableButton('Add column right'); await waitFor("document.querySelectorAll('.block-content table tr:first-child > *').length === 4");
  await focus('.block-content table tr:last-child > :last-child p');
  await tableButton('Remove row'); await waitFor("document.querySelectorAll('.block-content table tr').length === 3");
  await focus('.block-content table tr:last-child > :last-child p');
  await tableButton('Remove column'); await waitFor("document.querySelectorAll('.block-content table tr:first-child > *').length === 3");
  await realClick('.block-table-controls input'); await waitFor("document.querySelectorAll('.block-content table th').length === 0");
  await realClick('.block-table-controls input'); await waitFor("document.querySelectorAll('.block-content table th').length === 3");
  assert.equal(await evaluate("document.querySelector('.block-content table').textContent.includes('Basic | plan')"),true,'Row and column controls preserve other cells');
  const beforeSameType = await tree();
  await realClick('.block-editor button[aria-label="Block type"]');
  await waitFor("!!document.querySelector('[role=listbox]:popover-open [role=option]')");
  assert.equal(await evaluate("[...document.querySelectorAll('[role=listbox]:popover-open [role=option]')].some(option=>['Image','Table','Bulleted list','Numbered list'].includes(option.querySelector('span').textContent))"),false,'Image, table and lists have dedicated controls, not dropdown options');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});
  await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape'});
  assert.deepEqual(await tree(),beforeSameType,'Opening the text block chooser preserves table cells');
  await click('.block-editor .markdown-heading button');
  assert.equal(await evaluate("document.querySelector('.block-markdown').textContent.includes('| Product | Price |')"),true);
  await click('.block-editor .markdown-heading button');
  await point('.block-content table');
  await writeFile('_temp/blog-table.png',Buffer.from((await cdp('Page.captureScreenshot',{format:'png'})).data,'base64'));
  console.log('PASS: table insertion, cell editing/Tab, add/remove rows and columns, header toggle and read-only Markdown');
  const expected = await tree();
  await click('.save-button'); await waitFor("document.querySelector('.save-status')?.textContent.trim() === 'Saved'");
  const saved = JSON.parse(await readFile(file, 'utf8'));
  assert.deepEqual(saved.body, expected);
  assert.equal(await readFile(file, 'utf8'), JSON.stringify(saved, null, 2) + '\n');
  let html;
  for (let i = 0; i < 100; i++) { html = await (await fetch(new URL('/news/launch-week/',url))).text(); if (html.includes('<h2>Block test heading</h2>')) break; await new Promise(resolve=>setTimeout(resolve,100)); }
  assert(html.includes('<h2>Block test heading</h2>'));
  assert(html.includes('<strong>Block test tail</strong>'));
  assert(html.includes('href="/about/"'));
  assert(html.includes('<mark>') && html.includes('<u>'),'Extra formats survive explicit Save and public rendering');
  assert(html.includes('<table><thead><tr><th scope="col"><p>Product</p></th>'));
  assert(html.includes('<td><p>Basic | plan</p></td>'));
  for (const markup of ['<h1>Heading one</h1>','<h3>Subheading three</h3>','<h4>Subheading four</h4>','<h5>Heading five</h5>','<h6>Heading six</h6>','<blockquote>Quoted block</blockquote>','<ul>','<ol start="1">','<pre><code>','<hr>','alt="Block image description"']) assert(html.includes(markup),markup);
  assert.equal(await evaluate("document.querySelector('.visual-editor iframe').contentDocument.querySelector('[data-rigel-richtext=\"$body\"] h2').textContent"), 'Block test heading');
  assert.equal(await evaluate("document.querySelector('.visual-editor iframe').contentDocument.querySelector('[data-rigel-richtext=\"$body\"] table th').getAttribute('scope')"),'col');
  await navigate('Page.reload'); await open('news','launch-week');
  assert.deepEqual(await tree(), saved.body, 'Reload retains an identical serialized tree');
  const clean = await tree(); await click('.block-editor .markdown-heading button'); await click('.block-editor .markdown-heading button');
  assert.deepEqual(await tree(), clean); assert.equal(await evaluate("document.querySelector('.save-button').disabled"), true, 'View toggle never dirties saved content');
  console.log('PASS: explicit Save -> pretty JSON file -> public HTML and shared live renderer -> reload with identical tree');
  await realClick('.block-content'); await focus('.block-content > :last-child'); await cdp('Input.insertText',{text:' Unsaved change'});
  await click('#nav-pages'); await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
  await evaluate("[...document.querySelectorAll('.unsaved-dialog button')].find(button=>button.textContent.trim()==='Keep editing').click()");
  assert.equal(await evaluate("document.querySelector('.block-content').textContent.includes('Unsaved change')"), true);
  await cdp('Page.reload');
  for (let i = 0; i < 30 && !unloads; i++) await new Promise(resolve => setTimeout(resolve,100));
  assert(unloads > 0, 'beforeunload still protects unsaved articles');
  await click('#nav-pages'); await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
  await evaluate("[...document.querySelectorAll('.unsaved-dialog button')].find(button=>button.textContent.trim()==='Discard changes').click()");
  await waitFor("!!document.querySelector('tbody .table-link')");
  assert.deepEqual(JSON.parse(await readFile(file,'utf8')).body,saved.body);
  await open('blog','first-post');
  assert.equal(await evaluate("!!document.querySelector('.block-content h2')"),true);
  assert.equal(await evaluate("document.querySelector('.save-button').disabled"),true,'Migrated Blog loads without dirtying content');
  await open('blog','typography-check');
  const typographyFile = 'src/content/blog/typography-check.json';
  const setExperience = async experience => {
    await click('.user-btn');
    await evaluate("[...document.querySelectorAll('.user-menu button')].find(button=>button.textContent.includes('Settings')).click()");
    await waitFor("!!document.querySelector('.settings-nav')");
    await evaluate("[...document.querySelectorAll('.settings-nav button')].find(button=>button.textContent.trim()==='Content').click()");
    await chooseSelect({ evaluate, waitFor }, '.settings-pane [role=combobox]', experience === 'inline' ? 'Inline preview' : 'Sidebar');
    await click('.settings-head .close');
  };
  for (const experience of ['sidebar','inline']) {
    if (experience === 'inline') await setExperience('inline');
    const owner = experience === 'inline' ? "document.querySelector('.visual-editor iframe').contentDocument" : 'document';
    if (experience === 'inline') {
      const p = await evaluate(`(async () => {const frame=document.querySelector('.visual-editor iframe'),paragraph=frame.contentDocument.querySelector('[data-rigel-richtext="$body"] > p');paragraph.scrollIntoView({block:'center'});await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));const outer=frame.getBoundingClientRect(),rect=paragraph.getBoundingClientRect();return {x:outer.left+rect.left+12,y:outer.top+rect.top+12};})()`);
      await mouse('mouseMoved',p); await mouse('mousePressed',p,{button:'left',clickCount:1}); await mouse('mouseReleased',p,{button:'left',clickCount:1});
    } else await realClick('.block-content > p');
    await waitFor(`!!${owner}.querySelector('.block-content')`);
    const before = JSON.parse(await readFile(typographyFile,'utf8'));
    assert.deepEqual(await tree(),before.body,`${experience}: specimen mounts without changing any blocks`);
    assert.equal(await evaluate("document.querySelector('.save-button').disabled"),true,`${experience}: specimen starts clean`);
    for (const tag of ['h1','h2','h3','h4','h5','h6','blockquote','ul','ol','code','table','img','hr']) assert.equal(await evaluate(`!!${owner}.querySelector('.block-content ${tag}')`),true,`${experience}: ${tag} is editable`);
    await writeFile(`_temp/typography-${experience}.png`,Buffer.from((await cdp('Page.captureScreenshot',{format:'png'})).data,'base64'));
    await evaluate(`(() => {const doc=${owner},root=doc.querySelector('.block-content'),paragraph=root.firstElementChild;root.focus();const range=doc.createRange();range.selectNodeContents(paragraph);range.collapse(false);const selection=doc.defaultView.getSelection();selection.removeAllRanges();selection.addRange(range);})()`);
    const addition = ` Typography ${experience} edit.`;
    await cdp('Input.insertText',{text:addition});
    await waitFor(`!document.querySelector('.save-button').disabled && ${owner}.querySelector('.block-content > p').textContent.endsWith(${JSON.stringify(addition)})`);
    assert.deepEqual(JSON.parse(await readFile(typographyFile,'utf8')),before,`${experience}: editing never autosaves`);
    const expected = await tree();
    assert.deepEqual(expected.root.children.slice(1),before.body.root.children.slice(1),`${experience}: editing preserves every other specimen block`);
    await click('.save-button'); await waitFor("document.querySelector('.save-status')?.textContent.trim()==='Saved'");
    assert.deepEqual(JSON.parse(await readFile(typographyFile,'utf8')).body,expected,`${experience}: explicit Save persists the complete specimen`);
    await navigate('Page.reload'); await open('blog','typography-check');
    assert.deepEqual(await tree(),expected,`${experience}: Save/reload retains every format and block`);
  }
  assert.deepEqual(errors,[]);
  await open('blog','first-post');
  console.log('PASS: Typography check loads cleanly and edits/Save/reloads in sidebar and inline modes without losing other blocks');
  await click('.user-btn');
  await evaluate("[...document.querySelectorAll('.user-menu button')].find(button=>button.textContent.includes('Settings')).click()");
  await waitFor("!!document.querySelector('.settings-nav')");
  await evaluate("[...document.querySelectorAll('.settings-nav button')].find(button=>button.textContent.includes('Advanced')).click()");
  await click('.settings-pane input[role=switch]');
  await click('.settings-head .close');
  await waitFor("!document.querySelector('main > .md-preview')");
  await point('.block-editor .body-toolbar');
  await writeFile('_temp/blog-blocks.png', Buffer.from((await cdp('Page.captureScreenshot',{format:'png'})).data,'base64'));
  await click('.user-btn'); await evaluate("[...document.querySelectorAll('.user-menu button')].find(button=>button.textContent.includes('Settings')).click()");
  await waitFor("!!document.querySelector('.theme-options')");
  await click('.theme-option:has(input[value=dark])'); await click('.settings-head .close');
  await waitFor("document.documentElement.dataset.theme === 'dark'");
  await point('.block-editor .body-toolbar');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.block-content')).color === getComputedStyle(document.querySelector('.rigel')).color"),true);
  await writeFile('_temp/blog-blocks-dark.png',Buffer.from((await cdp('Page.captureScreenshot',{format:'png'})).data,'base64'));
  await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await point('.block-editor .body-toolbar');
  assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1 && document.querySelector('.block-editor').getBoundingClientRect().right <= innerWidth + 1"),true,'Mobile editor does not overflow');
  await click('.block-add'); await waitFor("!!document.querySelector('[aria-label=\"Find a block\"]')");
  assert.equal(await evaluate("(() => {const r=document.querySelector('.block-slash').getBoundingClientRect();return r.left>=0 && r.right<=innerWidth && r.top>=0 && r.bottom<=innerHeight;})()"),true,'Mobile block chooser stays in viewport');
  await key('Escape'); await point('.block-editor .body-toolbar');
  await writeFile('_temp/blog-blocks-mobile.png',Buffer.from((await cdp('Page.captureScreenshot',{format:'png'})).data,'base64'));
  assert.equal(await evaluate("document.querySelector('.save-button').disabled"),true,'Theme, viewport and chooser dismissal do not dirty content');
  console.log('PASS: themed square controls, light/dark and narrow editor/chooser bounds; settings and chooser dismissal leave content clean');
  assert.deepEqual(errors,[]);
  console.log('PASS: Blog and News, unsaved navigation/Keep/Discard and beforeunload; no browser exceptions');
} finally {
  for (const [path,bytes] of originals) { if (!(await readFile(path)).equals(bytes)) await writeFile(path,bytes); assert((await readFile(path)).equals(bytes),`Byte-exact restore: ${path}`); }
  console.log(`RESTORED: all ${originals.size} article fixtures byte-for-byte`);
  socket?.close();
  if (chrome.exitCode === null && chrome.signalCode === null) { const exited = once(chrome,'exit'); chrome.kill('SIGKILL'); await exited; }
  await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
}
