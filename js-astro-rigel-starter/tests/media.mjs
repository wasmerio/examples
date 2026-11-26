import "./local-only.mjs";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, mkdtemp, readFile, rm, writeFile, stat } from "node:fs/promises";

import { mediaFixtures } from "./media-fixtures.mjs";
import { stripTypeScriptTypes } from "node:module";

const { ICONS } = await import(`data:text/javascript,${encodeURIComponent(stripTypeScriptTypes(await readFile(new URL('../node_modules/@rigel-cms/rigel/src/editor/lib/icons.ts', import.meta.url), 'utf8')))}`);

const url = process.env.RIGEL_URL || "http://localhost:4321/rigel/";
const baseline = await (await fetch(new URL('/rigel/media.json', url))).json();
assert.equal(baseline.writable, true, 'Browser test requires live local backend');
const originalAssets = new Map(await Promise.all((baseline.assets ?? baseline.images).map(async image => [image.url, await readFile('public' + image.url)])));
const created = new Set();
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9L8AAAAASUVORK5CYII=';
const uploads = [];
const uuidURL = /^\/rigel-media\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.[a-z0-9]+$/;
const sidecarPath = 'public/rigel-media/.rigel-media.json';
let originalSidecar = null;
try { originalSidecar = await readFile(sidecarPath); } catch {}
const readSidecar = async () => JSON.parse(await readFile(sidecarPath, 'utf8'));
const slug = `richtext-check-${process.pid}`;
const copyFile = `src/content/copy/${slug}.ts`;
const originalCopy = `import { defineCopy } from "@rigel-cms/rigel/content";\nexport default defineCopy({slug: "${slug}", label: "${slug}", groups: [{id: "content", label: "Content", fields: [{key: "rich", label: "Rich copy", type: "markdown"}, {key: "items", label: "Items", type: "list", item: {fields: [{key: "rich", label: "Nested copy", type: "markdown"}]}}]}], values: {content: {rich: "Copy", items: [{rich: "*Nested*"}]}\n  },\n});`;
await mkdir('src/content/copy', { recursive: true });
await writeFile(copyFile, originalCopy, { flag: 'wx' });

await mkdir("_temp", { recursive: true });
const profile = await mkdtemp(`${process.cwd()}/_temp/settings-browser-`);
const chrome = spawn(process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", "--no-first-run", "--no-default-browser-check", "--window-size=1280,900",
  "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });
let socket;
try {
  const endpoint = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Chrome did not start")), 10000);
    chrome.once("error", reject);
    chrome.stderr.on("data", (chunk) => {
      const match = String(chunk).match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) { clearTimeout(timeout); resolve(match[1]); }
    });
  });
  socket = new WebSocket(endpoint);
  await once(socket, "open");
  let id = 0;
  const pending = new Map();
  socket.addEventListener("message", ({ data }) => {
    const result = JSON.parse(data);
    const request = pending.get(result.id);
    if (!request) return;
    pending.delete(result.id);
    if (result.error) request.reject(new Error(result.error.message));
    else request.resolve(result.result);
  });
  function send(method, params = {}, sessionId) {
    return new Promise((resolve, reject) => {
      const requestId = ++id;
      const timeout = setTimeout(() => { pending.delete(requestId); reject(new Error(`CDP timed out: ${method} ${JSON.stringify(params)}`)); }, 15000);
      pending.set(requestId, { resolve: value => { clearTimeout(timeout); resolve(value); }, reject: error => { clearTimeout(timeout); reject(error); } });
      socket.send(JSON.stringify({ id: requestId, method, params, sessionId }));
    });
  }
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const cdp = (method, params) => send(method, params, sessionId);
  const errors = [];
  socket.addEventListener("message", ({ data }) => {
    const event = JSON.parse(data);
    if (event.method === 'Runtime.bindingCalled' && event.params.name === 'recordMediaUpload') {
      const asset = JSON.parse(event.params.payload).url;
      uploads.push(asset);
      if (!originalAssets.has(asset)) created.add(asset);
    }
    if (event.method === "Runtime.exceptionThrown") errors.push(event.params.exceptionDetails.text);
    if (event.method === "Page.javascriptDialogOpening" && event.params.type === "beforeunload") void cdp('Page.handleJavaScriptDialog', { accept: true });
  });
  await cdp("Runtime.enable");
  await cdp("Page.enable");
  await cdp('Runtime.addBinding', {name:'recordMediaUpload'});
  async function evaluate(expression) {
    const result = await cdp("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || "Browser evaluation failed");
    return result.result.value;
  }
  async function waitFor(expression) {
    for (let i = 0; i < 100; i++) {
      if (await evaluate(expression)) {
        const rounded = await evaluate(`(() => {
          const corners = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'];
          return [...document.querySelectorAll('.rigel, .rigel *')].flatMap(el => ['', '::before', '::after'].flatMap(pseudo => {
            const style = getComputedStyle(el, pseudo || null);
            if (pseudo && ['none', 'normal'].includes(style.content)) return [];
            const expected = !pseudo && el.classList.contains('avatar') ? '50%' : '0px';
            return corners.every(c => style[c] === expected) ? [] : [el.tagName + '.' + el.getAttribute('class') + pseudo];
          }));
        })()`);
        assert.deepEqual(rounded, [], 'Only avatars may have rounded corners');
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.fail(`Timed out: ${expression}`);
  }
  await cdp("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "light" }] });
  await cdp("Page.addScriptToEvaluateOnNewDocument", { source: `
    window.alert = window.confirm = window.prompt = () => { throw new Error('Native dialogs are forbidden'); };
    const fetchOriginal = window.fetch;
    window.fetch = async (...args) => {
      if (window.failSave && args[1]?.method === 'POST') return new Response('Save failed for test', {status: 500});
      const response = await fetchOriginal(...args);
      if (args[0] === '/rigel/api/local/media' && args[1]?.method === 'POST' && response.ok) window.recordMediaUpload(JSON.stringify(await response.clone().json()));
      if (args[0] !== '/rigel/manifest.json') return response;
      const manifest = await response.json();
      manifest.collections.find(c => c.name === 'blog').fields.push({key: 'summary', label: 'Rich summary', type: 'markdown'});
      return Response.json(manifest);
    };
  ` });
  for (let i = 0; i < 100; i++) {
    const manifest = await (await fetch(new URL('/rigel/manifest.json', url), { signal: AbortSignal.timeout(15000) })).json();
    if (manifest.pages.some(p => p.slug === slug) && manifest.collections.find(c => c.name === 'blog').posts.some(p => p.slug === slug)) break;
    await new Promise(r => setTimeout(r, 100));
  }
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const editor = label => `[contenteditable=true][aria-label="${label}"]`;
  const root = label => `document.querySelector(${JSON.stringify(`[aria-label="${label}"], [aria-label="${label} Markdown source"]`)}).closest('.markdown-editor')`;
  const button = (label, text) => evaluate(`[...${root(label)}.querySelectorAll('button')].find(b => (b.getAttribute('aria-label') || b.textContent.trim()) === ${JSON.stringify(text)}).click()`);
  const format = (label, value) => evaluate(`(() => { const el = ${root(label)}.querySelector('select[aria-label="Text style"]'); el.value = ${JSON.stringify(value)}; el.dispatchEvent(new Event('change', {bubbles: true})); })()`);
  const source = label => evaluate(`${root(label)}.querySelector('textarea').value`);
  const setSource = (label, text) => evaluate(`(() => {const el = ${root(label)}.querySelector('textarea'); el.value = ${JSON.stringify(text)}; el.dispatchEvent(new Event('input', {bubbles:true}));})()`);
  const selectText = label => evaluate(`(() => {const el = document.querySelector(${JSON.stringify(editor(label))}); el.focus(); const range = document.createRange(); range.selectNodeContents(el); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range);})()`);
  const type = async (label, text) => { await selectText(label); await cdp('Input.insertText', {text}); };
  const open = async nav => {
    await waitFor(`!!document.querySelector(${JSON.stringify(nav)})`);
    await click(nav);
    await waitFor(`!![...document.querySelectorAll('.table-link')].find(b => b.textContent.trim() === ${JSON.stringify(slug)})`);
    await evaluate(`[...document.querySelectorAll('.table-link')].find(b => b.textContent.trim() === ${JSON.stringify(slug)}).click()`);
  };
  const choice = text => evaluate(`[...document.querySelectorAll('.unsaved-dialog button')].find(b => b.textContent.trim() === ${JSON.stringify(text)}).click()`);
  const savedFile = async (file, text) => {
    for (let i = 0; i < 100; i++) { if ((await readFile(file, 'utf8')).includes(text)) return; await new Promise(r => setTimeout(r, 100)); }
    assert.fail(`Save did not persist ${text}`);
  };
  await new Promise(r => setTimeout(r, 750));
  await cdp('Page.navigate', {url});
  await waitFor("!!document.querySelector('#nav-media')");
  assert.equal(await evaluate("document.querySelector('.rail-scroll > button').id"), 'nav-pages');
  await click('#nav-media');
  await waitFor("!!document.querySelector('.media-library .grid')");
  assert.equal(await evaluate("!!document.querySelector('.media-tools button[role=combobox][aria-label=\"Media type\"]')"), true, 'Custom media category filter');
  assert.equal(await evaluate("document.querySelector('.save-button') === null"), true);
  assert.equal(await evaluate("document.querySelector('.media-library .tabs, .media-library input[type=file]') === null"), true);
  assert.deepEqual(await evaluate(`[...document.querySelectorAll('.media-views button')].map(b => ({label: b.getAttribute('aria-label'), tooltip: b.dataset.tooltip, text: b.textContent.trim(), svg: !!b.querySelector('svg[aria-hidden="true"] path[d]')}))`), [
    {label: 'Grid view', tooltip: 'Grid view', text: '', svg: true},
    {label: 'List view', tooltip: 'List view', text: '', svg: true},
  ]);
  assert.ok(await evaluate(`(() => {
    const group = document.querySelector('.media-views');
    return group.nextElementSibling.getBoundingClientRect().left - group.getBoundingClientRect().right >= 24;
  })()`), 'View toggle is separated from filters by 1.5rem');
  assert.ok(await evaluate(`[...document.querySelectorAll('.media-tools .select-trigger')].every(select => {
    const icon = select.querySelector('svg'), style = getComputedStyle(select);
    return parseFloat(style.gap) >= 12 && icon.getAttribute('aria-hidden') === 'true' &&
      select.getBoundingClientRect().right - icon.getBoundingClientRect().right >= 12;
  })`), 'Custom dropdowns reserve text space and inset decorative carets');
  await evaluate("document.querySelector('[aria-label=\"Grid view\"]').focus()");
  await cdp('Input.dispatchKeyEvent', {type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  await cdp('Input.dispatchKeyEvent', {type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  assert.equal(await evaluate("document.activeElement.getAttribute('aria-label')"), 'List view');
  assert.equal(await evaluate("getComputedStyle(document.activeElement).outlineWidth"), '3px');
  await cdp('Input.dispatchKeyEvent', {type:'keyDown',key:' ',code:'Space',windowsVirtualKeyCode:32});
  await cdp('Input.dispatchKeyEvent', {type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});
  await waitFor("document.querySelector('[aria-label=\"List view\"]').getAttribute('aria-pressed') === 'true'");
  await click('[aria-label="Grid view"]');
  await waitFor("document.querySelector('[aria-label=\"Grid view\"]').getAttribute('aria-pressed') === 'true'");
  const desktopWidth = await evaluate("document.querySelector('.media-library').getBoundingClientRect().width");
  assert.ok(desktopWidth > 720, `Library width ${desktopWidth}`);
  const desktopColumns = await evaluate("getComputedStyle(document.querySelector('.media-library .grid')).gridTemplateColumns.split(' ').length");
  await cdp('Emulation.setDeviceMetricsOverride', {width:390,height:844,deviceScaleFactor:1,mobile:false});
  assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth"));
  assert.ok(await evaluate("getComputedStyle(document.querySelector('.media-library .grid')).gridTemplateColumns.split(' ').length") < desktopColumns);
  await cdp('Emulation.clearDeviceMetricsOverride');
  const uploadButton = text => evaluate(`[...document.querySelector('[aria-label="Upload media"]').querySelectorAll('button')].find(b => b.textContent.trim() === ${JSON.stringify(text)}).click()`);
  const checkTextPreview = async fixture => {
    const src = await evaluate("document.querySelector('.media-preview iframe').src");
    for (let attempt = 0; attempt < 100; attempt++) {
      const { targetInfos } = await send('Target.getTargets');
      const target = targetInfos.find(target => target.type === 'iframe' && target.url === src);
      if (target) {
        const { sessionId } = await send('Target.attachToTarget', { targetId: target.targetId, flatten:true });
        try {
          const { result } = await send('Runtime.evaluate', { expression:"({type:document.contentType,text:document.querySelector('pre')?.textContent})", returnByValue:true }, sessionId);
          if (result.value?.text !== undefined) {
            assert.equal(result.value.type, 'text/plain');
            assert.equal(result.value.text, fixture.bytes.toString('utf8'), 'Native text preview preserves UTF-8 and displays HTML-looking text literally');
            assert.equal(await evaluate("document.body.dataset.documentPreviewExecuted"), undefined, 'Text previews cannot execute scripts in the editor');
            return;
          }
        } finally { await send('Target.detachFromTarget', { sessionId }); }
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.fail('Text document did not render inside its sandboxed preview frame');
  };
  const checkImportLayout = async name => {
    const theme = await evaluate("document.documentElement.dataset.theme || ''");
    for (const width of [1440, 390]) for (const mode of ['light', 'dark']) {
      await cdp('Emulation.setDeviceMetricsOverride', {width, height:1000, deviceScaleFactor:1, mobile:false});
      await evaluate(`document.documentElement.dataset.theme=${JSON.stringify(mode)}`);
      assert.equal(await evaluate(`(() => {const selection=document.querySelector('.media-selection'),preview=selection.querySelector('.media-preview').getBoundingClientRect(),meta=selection.querySelector('.media-details').getBoundingClientRect();return selection.classList.contains('media-editing') && (innerWidth>700 ? preview.right<=meta.left && preview.width>meta.width : preview.bottom<=meta.top) && document.documentElement.scrollWidth<=innerWidth;})()`), true, 'Import reuses gallery split layout on desktop and stacks on mobile');
      assert.equal(await evaluate("document.querySelector('.media-details').scrollWidth <= document.querySelector('.media-details').clientWidth"), true, 'Long upload filenames fit the metadata column');
      await writeFile(`_temp/image-import-${name}-${width}-${mode}.png`, Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
    }
    await cdp('Emulation.clearDeviceMetricsOverride');
    await evaluate(`document.documentElement.dataset.theme=${JSON.stringify(theme)}`);
  };
  await click('.titlebar .primary');
  await waitFor("!!document.querySelector('.image-dialog[open] input[type=file]')");
  assert.equal(await evaluate("document.activeElement.getAttribute('aria-label')"), 'Close');
  assert.deepEqual(await evaluate("[...document.querySelectorAll('.image-dialog .tabs button')].map(button => button.dataset.source)"), ['upload', 'url', 'picsum'], 'Unconfigured stock providers are hidden in Media uploads');
  const uploadTheme = await evaluate("document.documentElement.dataset.theme || ''");
  for (const width of [1440,390]) for (const theme of ['light','dark']) {
    await cdp('Emulation.setDeviceMetricsOverride', {width,height:1000,deviceScaleFactor:1,mobile:false});
    await evaluate(`document.documentElement.dataset.theme=${JSON.stringify(theme)}`);
    assert.equal(await evaluate("(() => {const input=document.querySelector('.image-dialog input[type=file]'),label=input.parentElement.querySelector(':scope > span');return !!label && input.getBoundingClientRect().top-label.getBoundingClientRect().bottom>=6 && getComputedStyle(label).fontSize==='12px' && getComputedStyle(label).fontWeight==='600';})()"), true, 'Upload label and Browse control use shared field spacing');
    assert.equal(await evaluate("(() => {const dialog=document.querySelector('.image-dialog'),panel=dialog.querySelector('.rigel-modal'),style=getComputedStyle(panel);return dialog.classList.contains('rigel-modal-backdrop') && style.paddingTop==='20px' && style.borderRadius==='0px' && panel.getBoundingClientRect().right<=innerWidth && document.documentElement.scrollWidth<=innerWidth;})()"), true, 'Upload uses shared modal chrome without overflow');
    await writeFile(`_temp/upload-dialog-${width}-${theme}.png`, Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
  }
  await cdp('Emulation.clearDeviceMetricsOverride');
  await evaluate(`document.documentElement.dataset.theme=${JSON.stringify(uploadTheme)}`);
  assert.match(await evaluate("document.querySelector('.image-dialog input[type=file]').parentElement.textContent"), /2 MB maximum/);
  await evaluate("{const input=document.querySelector('.image-dialog input[type=file]'),files=new DataTransfer();files.items.add(new File([new Uint8Array(2*1024*1024+1)],'oversized.png',{type:'image/png'}));input.files=files.files;input.dispatchEvent(new Event('change',{bubbles:true}));}");
  await waitFor("document.querySelector('.image-dialog [role=alert]')?.textContent.includes('up to 2 MB')");
  assert.equal(await evaluate("!!document.querySelector('.image-dialog .media-selection')"), false, 'Oversized files never reach upload confirmation');
  const tooLarge = await fetch(new URL('/rigel/api/local/media',url), {method:'POST',headers:{Origin:new URL(url).origin,'Content-Type':'image/png','X-Rigel-Filename':'oversized.png'},body:new Uint8Array(2*1024*1024+1)});
  assert.equal(tooLarge.status,413,'Real API enforces the same configured limit');
  assert.match(await tooLarge.text(), /2 MB/);
  await cdp('Input.dispatchKeyEvent', {type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  await cdp('Input.dispatchKeyEvent', {type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  await waitFor("!document.querySelector('.image-dialog')");
  assert.equal(await evaluate("document.activeElement.textContent.trim()"), 'Upload');
  await click('.titlebar .primary');
  await waitFor("!!document.querySelector('.image-dialog[open] input[type=file]')");
  await evaluate(`(async () => {
    const bytes = Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9L8AAAAASUVORK5CYII='), c => c.charCodeAt(0));
    const input = document.querySelector('input[type=file]'); const dt = new DataTransfer();
    dt.items.add(new File([bytes], 'fixture-${'a'.repeat(120)}.png', {type:'image/png'})); input.files = dt.files; input.dispatchEvent(new Event('change',{bubbles:true}));
  })()`);
  await waitFor("!!document.querySelector('.media-selection')");
  assert.equal(await evaluate("!!document.querySelector('.media-selection [aria-label=\"Delete file\"]')"), false, 'Staged uploads cannot be deleted');
  assert.deepEqual(await evaluate("[...document.querySelectorAll('.media-selection .media-meta [aria-label]')].map(field => field.ariaLabel)"), ['Image alt text', 'Image title', 'Image description'], 'Uploads collect image metadata before confirmation');
  assert.equal(await evaluate("document.querySelector('[aria-label=\"Image title\"]').value"), `fixture-${'a'.repeat(120)}`, 'Computer uploads prefill the editable title from the original filename');
  for (const [label, value] of [['Image alt text', 'Uploaded fixture alt'], ['Image title', 'Uploaded fixture title'], ['Image description', 'Uploaded fixture description']]) {
    await evaluate(`{const field=document.querySelector('.media-selection [aria-label="${label}"]');field.value=${JSON.stringify(value)};field.dispatchEvent(new Event('input',{bubbles:true}));}`);
  }
  await checkImportLayout('upload');
  assert.deepEqual(await readFile(sidecarPath).catch(() => null), originalSidecar, 'Staged upload metadata is not written before confirmation');
  await writeFile('_temp/media-upload-preview.png', Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
  await uploadButton('Import image');
  await waitFor("!document.querySelector('.image-dialog') && !!document.querySelector('.media-library .thumb img')");
  await writeFile('_temp/media-library.png', Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
  console.log(`Media desktop width: ${desktopWidth}px; columns: ${desktopColumns}; mobile responsive and modal Escape verified`);
  const uploaded = uploads.at(-1);
  assert.match(uploaded, uuidURL);
  assert.ok(uploaded.endsWith('.png'));
  await waitFor(`!!document.querySelector('.media-library img[src="${uploaded}"]')`);
  assert.equal((await fetch(new URL(uploaded,url))).status, 200);
  const mediaBytes = await readFile('public' + uploaded);
  assert.equal(mediaBytes.toString('base64'), 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9L8AAAAASUVORK5CYII=');
  const metadata = (await (await fetch(new URL('/rigel/media.json', url))).json()).images.find(a => a.url === uploaded);
  const actual = await stat('public' + uploaded);
  assert.equal(metadata.size, actual.size);
  assert.equal(metadata.modified, actual.mtime.toISOString());
  assert.equal(metadata.type, 'image/png');
  assert.equal(metadata.title, 'Uploaded fixture title');
  assert.equal(metadata.description, 'Uploaded fixture description');
  assert.equal(metadata.alt, 'Uploaded fixture alt');
  assert.deepEqual((await readSidecar())[uploaded], { name: `fixture-${'a'.repeat(120)}.png`.slice(0, 120), author: 'Local user', title: 'Uploaded fixture title', description: 'Uploaded fixture description', alt: 'Uploaded fixture alt' });
  const mediaControl = (label, value, event = 'change') => evaluate(`{const el = document.querySelector('.media-tools ${event === 'change' ? 'select' : 'input'}[aria-label="${label}"]'); el.value = ${JSON.stringify(value)}; el.dispatchEvent(new Event('${event}', {bubbles:true}));}`);
  const mediaButton = text => evaluate(`[...document.querySelectorAll('.media-library .media-tools button')].find(b => (b.getAttribute('aria-label') || b.textContent.trim()) === ${JSON.stringify(text)}).click()`);
  await mediaControl('Media type', 'Images');
  await mediaControl('Modified month', metadata.modified.slice(0,7));
  await mediaControl('Search media', metadata.name, 'input');
  await waitFor("document.querySelectorAll('.media-library .thumb').length === 1");
  await mediaButton('List view');
  await waitFor("document.querySelectorAll('.media-table tbody tr').length === 1");
  assert.deepEqual(await evaluate("[...document.querySelectorAll('.media-table th')].map(x=>x.textContent)"), ['File','Type','Size','Modified (UTC)']);
  await click('.media-library .media-file');
  await waitFor("!!document.querySelector('.media-selection')");
  await uploadButton('Cancel');
  await mediaButton('Grid view');
  await waitFor("document.querySelector('.media-library .thumb')?.getAttribute('aria-pressed') === 'true'");
  await mediaButton('List view');
  await waitFor("document.querySelector('.media-library .media-file')?.getAttribute('aria-pressed') === 'true'");
  assert.equal(await evaluate("document.querySelector('select[aria-label=\"Media type\"]').value"), 'Images');
  await mediaControl('Media type', 'Documents');
  await waitFor("document.querySelector('.media-library [role=status]')?.textContent === 'No media match these filters.'");
  await mediaButton('Reset filters');
  await waitFor("document.querySelectorAll('.media-table tbody tr').length > 0");
  await writeFile('_temp/media-list.png', Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
  for (const width of [390, 320]) {
    await cdp('Emulation.setDeviceMetricsOverride', {width,height:844,deviceScaleFactor:1,mobile:false});
    assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth"), 'No list/toolbar page overflow');
    assert.ok(await evaluate("[...document.querySelectorAll('.media-tools > *')].every(el => el.getBoundingClientRect().right <= innerWidth)"));
  }
  await writeFile('_temp/media-list-mobile.png', Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
  await cdp('Emulation.clearDeviceMetricsOverride');
  await mediaButton('Grid view');
  console.log('PASS: filesystem metadata, combined format/month/search, no matches/reset, grid/list filters and selection, narrow list/toolbar');
  assert.deepEqual(await evaluate("[...document.querySelector('select[aria-label=\\\"Media type\\\"]').options].map(o=>o.text)"), ['All media items','Images','Audio','Video','Documents','Spreadsheets','Archives','Other']);
  const renamedAssets = new Map([[uploaded, metadata.name]]);
  for (const fixture of mediaFixtures) {
    const documentPreview = ['application/pdf', 'text/plain'].includes(fixture.type);
    const fileIcon = { Documents: fixture.type === 'text/plain' ? ICONS.fileTxt : ICONS.filePdf, Audio: ICONS.fileAudio, Video: ICONS.fileVideo, Spreadsheets: ICONS.fileXls, Archives: ICONS.fileZip }[fixture.category].d;
    await click('.titlebar .primary');
    await waitFor("!!document.querySelector('.image-dialog input[type=file]')");
    await evaluate(`{ const input = document.querySelector('.image-dialog input[type=file]'), dt = new DataTransfer(); dt.items.add(new File([Uint8Array.from(atob('${fixture.bytes.toString('base64')}'), c=>c.charCodeAt(0))], '${fixture.name}', {type:'${fixture.type}'})); input.files = dt.files; input.dispatchEvent(new Event('change',{bubbles:true})); }`);
    await waitFor("!!document.querySelector('.media-selection')");
    assert.equal(await evaluate("!!document.querySelector('.media-selection img')"), false);
    assert.equal(await evaluate("!!document.querySelector('.media-preview iframe')"), documentPreview, 'PDF and text uploads have document previews; other files keep their existing preview');
    assert.deepEqual(await evaluate("[...document.querySelectorAll('.media-selection .media-meta [aria-label]')].map(field => field.ariaLabel)"), ['Media title', 'Media description'], 'Every file upload offers title and description, without image alt text');
    assert.equal(await evaluate("document.querySelector('[aria-label=\"Media title\"]').value"), fixture.name.replace(/\.[^.]+$/, ''), 'File title starts with the original filename');
    for (const [label, value] of [['Media title', `${fixture.category} fixture title`], ['Media description', `${fixture.category} fixture description`]]) {
      await evaluate(`{const field=document.querySelector('[aria-label="${label}"]');field.value=${JSON.stringify(value)};field.dispatchEvent(new Event('input',{bubbles:true}));}`);
    }
    if (fixture.category !== 'Video' && !documentPreview) assert.equal(await evaluate("document.querySelector('.media-preview svg path').getAttribute('d')"), fileIcon, 'Upload preview uses the matching official Phosphor file glyph');
    if (fixture.type === 'text/plain') await checkTextPreview(fixture);
    if (documentPreview) await checkImportLayout(fixture.name.split('.').pop());
    await uploadButton('Upload file');
    await waitFor("!document.querySelector('.image-dialog')");
    const expectedURL = uploads.at(-1);
    assert.match(expectedURL, uuidURL);
    assert.ok(expectedURL.endsWith('.' + fixture.name.split('.').pop()), 'Upload retains the original extension');
    const listing = await (await fetch(new URL('/rigel/media.json', url))).json();
    const item = listing.assets.find(a=>a.url===expectedURL);
    assert.ok(item); assert.equal(item.type, fixture.type);
    assert.equal(item.name, fixture.name, 'Computer uploads retain the original display filename');
    renamedAssets.set(expectedURL, item.name);
    assert.equal((await readSidecar())[expectedURL].name, fixture.name, 'The original display filename is registered in the ledger');
    assert.equal(item.title, `${fixture.category} fixture title`);
    assert.equal(item.description, `${fixture.category} fixture description`);
    assert.equal(item.alt, undefined, 'Nonimages never acquire alt metadata');
    assert.equal((await readSidecar())[expectedURL].title, item.title);
    assert.equal((await readSidecar())[expectedURL].description, item.description);
    assert.equal(listing.images.some(a=>a.url===expectedURL), false);
    assert.deepEqual(await readFile('public'+expectedURL), fixture.bytes);
    const download = await fetch(new URL(expectedURL,url));
    assert.equal(download.headers.get('content-type'),fixture.type === 'text/plain' ? 'text/plain; charset=utf-8' : fixture.type);
    assert.equal(download.headers.get('x-content-type-options'),'nosniff');
    assert.match(download.headers.get('content-disposition'), fixture.category === 'Video' ? /^inline;/ : /^attachment;/);
    assert.deepEqual(Buffer.from(await download.arrayBuffer()),fixture.bytes);
    await mediaControl('Media type',fixture.category);
    await mediaControl('Modified month',item.modified.slice(0,7));
    await mediaControl('Search media',item.name,'input');
    await waitFor("document.querySelectorAll('.media-library .thumb').length === 1");
    assert.equal(await evaluate("document.querySelector('.media-library .thumb .media-extension').textContent"), fixture.name.split('.').pop().toUpperCase(), 'Extension badge uses the actual file');
    assert.equal(await evaluate("!!document.querySelector('.media-library .thumb img, .media-library iframe')"),false, 'Document previews never become library thumbnails');
    if (fixture.category !== 'Video') assert.equal(await evaluate("document.querySelector('.media-library .thumb svg path').getAttribute('d')"), fileIcon, 'Grid uses a file-specific icon');
    assert.equal(await evaluate("document.querySelector('.media-search').previousElementSibling.textContent.trim()"),'Reset filters');
    assert.equal(await evaluate("document.querySelector('.media-search').previousElementSibling.previousElementSibling.textContent.trim()"),'Refresh');
    await mediaButton('List view');
    await waitFor("document.querySelectorAll('.media-table tbody tr').length === 1");
    assert.equal(await evaluate("document.querySelector('.media-file svg path').getAttribute('d')"), fileIcon, 'List uses the same file-specific icon');
    assert.deepEqual(await evaluate("(() => {const rect=document.querySelector('.media-file').firstElementChild.getBoundingClientRect();return [rect.width,rect.height];})()"), [48, 40], 'Every list entry reserves the same rectangular thumbnail size as images');
    await click('.media-file');
    await waitFor("!!document.querySelector('.media-selection a[download]')");
    assert.equal(await evaluate("document.querySelector('.media-selection a[download]').getAttribute('href')"),expectedURL);
    assert.equal(await evaluate("document.querySelector('[aria-label=\"Media title\"]').value"), item.title);
    assert.equal(await evaluate("document.querySelector('[aria-label=\"Media description\"]').value"), item.description);
    assert.equal(await evaluate("!!document.querySelector('.media-preview iframe')"), documentPreview, 'Saved PDFs and text files open inside the metadata editor');
    if (fixture.category !== 'Video' && !documentPreview) assert.equal(await evaluate("document.querySelector('.media-preview svg path').getAttribute('d')"), fileIcon, 'Saved-file preview retains its matching icon');
    if (documentPreview) {
      const previewURL = expectedURL + '?preview=1' + (fixture.type === 'application/pdf' ? '#navpanes=0&view=FitH' : '');
      assert.equal(await evaluate("document.querySelector('.media-preview iframe').getAttribute('src')"), previewURL);
      assert.equal(await evaluate("document.querySelector('.media-preview iframe').getAttribute('sandbox')"), fixture.type === 'text/plain' ? '' : null);
      if (fixture.type === 'text/plain') await checkTextPreview(fixture);
      const name = `Readable ${fixture.name.split('.').pop().toUpperCase()} without extension`;
      await evaluate(`{const input=document.querySelector('[aria-label="Media display name"]');input.value=${JSON.stringify(name)};input.dispatchEvent(new Event('input',{bubbles:true}));}`);
      await uploadButton('Save');
      await waitFor("document.querySelector('.media-actions [role=status]')?.textContent==='Metadata saved.'");
      assert.equal(await evaluate("document.querySelector('.media-preview iframe').getAttribute('src')"), previewURL, 'Friendly display names never change document preview type or URL');
      renamedAssets.set(expectedURL, name);
      await checkImportLayout(`saved-${fixture.name.split('.').pop()}`);
    }
    if (fixture.category === 'Video') {
      await waitFor("document.querySelector('.media-selection video')?.readyState>=2");
      assert.equal(await evaluate("document.querySelector('.media-selection video').controls"), true, 'Metadata editor has a playable video');
      await evaluate("document.querySelector('.media-selection video').play()");
      await waitFor("document.querySelector('.media-selection video').currentTime>0");
      await evaluate("document.querySelector('.media-selection video').pause()");
      const previousTheme = await evaluate("document.documentElement.dataset.theme || ''");
      for (const width of [1440,390]) for (const theme of ['light','dark']) {
        await cdp('Emulation.setDeviceMetricsOverride', {width,height:1000,deviceScaleFactor:1,mobile:false});
        await evaluate(`document.documentElement.dataset.theme=${JSON.stringify(theme)}`);
        assert.equal(await evaluate("(() => {const video=document.querySelector('.media-preview video').getBoundingClientRect(),panel=document.querySelector('.media-preview').getBoundingClientRect();return video.left>=panel.left && video.right<=panel.right+1 && document.documentElement.scrollWidth<=innerWidth;})()"), true, 'Video preview fits its container without assuming a ratio');
        await writeFile(`_temp/video-metadata-${width}-${theme}.png`, Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
      }
      await cdp('Emulation.clearDeviceMetricsOverride');
      await evaluate(`document.documentElement.dataset.theme=${JSON.stringify(previousTheme)}`);
      await evaluate(`{const input=document.querySelector('[aria-label="Media display name"]');input.value='Fixture movie without extension';input.dispatchEvent(new Event('input',{bubbles:true}));}`);
      await uploadButton('Save');
      await waitFor("[...document.querySelectorAll('.media-selection p')].some(p=>p.textContent.trim()==='Metadata saved.')");
      assert.equal((await readSidecar())[expectedURL].name, 'Fixture movie without extension');
      renamedAssets.set(expectedURL, 'Fixture movie without extension');
      assert.deepEqual(await readFile('public'+expectedURL),fixture.bytes, 'Renaming leaves the video bytes untouched');
    }
    await uploadButton('Cancel');
    if (fixture.category === 'Video') {
      await mediaControl('Search media', 'Fixture movie without extension', 'input');
      await waitFor("document.querySelectorAll('.media-table tbody tr').length===1");
      await mediaButton('Grid view');
      await waitFor("!!document.querySelector('.media-library .thumb[aria-label=\"Fixture movie without extension\"]')");
      assert.equal(await evaluate("document.querySelector('.media-library .thumb .media-extension').textContent"), 'MP4', 'Display-name rename cannot change extension badge');
      const badgeTheme = await evaluate("document.documentElement.dataset.theme || ''");
      for (const width of [1440,390]) for (const theme of ['light','dark']) {
        await cdp('Emulation.setDeviceMetricsOverride', {width,height:1000,deviceScaleFactor:1,mobile:false});
        await evaluate(`document.documentElement.dataset.theme=${JSON.stringify(theme)}`);
        assert.equal(await evaluate("[...document.querySelectorAll('.media-library .thumb')].every(button=>{const box=button.getBoundingClientRect(),badge=button.querySelector('.media-extension'),rect=badge.getBoundingClientRect();return rect.top>=box.top && rect.top<box.top+16 && rect.right<=box.right && rect.right>box.right-16 && badge.id===button.getAttribute('aria-describedby');})"), true, 'Badges stay top-right and provide accessible descriptions');
        assert.equal(await evaluate("getComputedStyle(document.querySelector('.media-extension')).fontSize"), '10px', 'Extension badges remain compact');
        await writeFile(`_temp/media-badges-${width}-${theme}.png`, Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
      }
      await cdp('Emulation.clearDeviceMetricsOverride');
      await evaluate(`document.documentElement.dataset.theme=${JSON.stringify(badgeTheme)}`);
      await waitFor("document.querySelector('.media-library .thumb video')?.getVideoPlaybackQuality().totalVideoFrames>0");
      assert.deepEqual(await evaluate("(() => {const video=document.querySelector('.media-library .thumb video');return [video.muted,video.controls,video.paused,video.videoWidth>0];})()"), [true,false,true,true], 'Renamed video stays in Video filter with a decoded, silent, nonplaying frame preview');
      await writeFile('_temp/video-library-frame.png', Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
    }
    await mediaButton('Reset filters');
    await mediaButton('Grid view');
    console.log(`PASS: ${fixture.category} UI upload -> disk -> category/date/search grid/list -> download exact bytes and safe headers`);
  }
  const galleryTheme = await evaluate("document.documentElement.dataset.theme || ''");
  for (const width of [1440, 390, 320]) for (const theme of ['light', 'dark']) for (const view of ['Grid view', 'List view']) {
    await cdp('Emulation.setDeviceMetricsOverride', {width, height:1000, deviceScaleFactor:1, mobile:false});
    await evaluate(`document.documentElement.dataset.theme=${JSON.stringify(theme)}`);
    await mediaButton(view);
    const geometry = view === 'List view'
      ? "(() => {const files=[...document.querySelectorAll('.media-library .media-file')],rects=files.map(file=>file.firstElementChild.getBoundingClientRect());return files.length>1 && rects.every(rect=>rect.width===48 && rect.height===40);})()"
      : "(() => {const cards=[...document.querySelectorAll('.media-library .thumb')].map(card=>card.getBoundingClientRect());return cards.length>1 && cards.every(card=>Math.abs(card.width/cards[0].width-1)<0.01 && Math.abs(card.height-card.width/1.5)<1) && [...document.querySelectorAll('.media-library .thumb .media-file-icon')].every(icon=>getComputedStyle(icon).backgroundColor!=='rgba(0, 0, 0, 0)');})()";
    assert.equal(await evaluate(geometry), true, `${view} gives images and file placeholders matching rectangle sizes at ${width}px`);
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true);
    if (width !== 320) await writeFile(`_temp/media-rectangles-${view.startsWith('Grid') ? 'grid' : 'list'}-${width}-${theme}.png`, Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
  }
  await cdp('Emulation.clearDeviceMetricsOverride');
  await evaluate(`document.documentElement.dataset.theme=${JSON.stringify(galleryTheme)}`);
  await mediaButton('Grid view');
  console.log('PASS: mixed image/file grid cards and list thumbnail rectangles match on desktop/mobile in both themes');
  const repositoryAlt = 'A small repository image';
  await evaluate(`[...document.querySelectorAll('.media-library .thumb')].find(button => button.querySelector('img')?.getAttribute('src') === ${JSON.stringify(uploaded)}).click()`);
  await waitFor("!!document.querySelector('textarea[aria-label=\"Media alt text\"]')");
  await evaluate(`{ const control=document.querySelector('[aria-label="Media alt text"]'); control.value=${JSON.stringify(repositoryAlt)}; control.dispatchEvent(new Event('input',{bubbles:true})); }`);
  const checkMetadataFeedback = async isError => {
    assert.equal(await evaluate(`(() => {const footer=document.querySelector('.media-selection .media-actions'),message=footer.querySelector('[role=${isError ? 'alert' : 'status'}]');if(!message)return false;const rect=message.getBoundingClientRect(),button=footer.querySelector('.primary').getBoundingClientRect(),color=getComputedStyle(message).color.match(/\\d+/g).map(Number);return getComputedStyle(message).position==='absolute' && rect.bottom<=footer.getBoundingClientRect().top-3 && Math.abs(rect.right-button.right)<1 && ${isError ? 'color[0]>color[1] && color[0]>color[2]' : 'color[1]>color[0] && color[1]>color[2]'};})()`), true, 'Feedback sits above the footer divider aligned to Save, green for success and red for errors');
  };
  const displayName = await evaluate("document.querySelector('[aria-label=\"Media display name\"]').value");
  await evaluate("{const field=document.querySelector('[aria-label=\"Media display name\"]');field.value='../invalid';field.dispatchEvent(new Event('input',{bubbles:true}));}");
  await click('.media-selection .media-actions .primary');
  await waitFor("document.querySelector('.image-dialog [role=alert]')?.textContent.includes('Metadata save failed')");
  await checkMetadataFeedback(true);
  await writeFile('_temp/media-metadata-error.png', Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
  await evaluate(`{const field=document.querySelector('[aria-label="Media display name"]');field.value=${JSON.stringify(displayName)};field.dispatchEvent(new Event('input',{bubbles:true}));}`);
  await click('.media-selection .media-actions .primary');
  await waitFor("document.querySelector('.media-actions [role=status]')?.textContent === 'Metadata saved.'");
  await checkMetadataFeedback(false);
  assert.equal((await readSidecar())[uploaded].alt, repositoryAlt);
  assert.equal((await (await fetch(new URL('/rigel/media.json', url))).json()).images.find(asset => asset.url === uploaded).alt, repositoryAlt);
  assert.deepEqual(await readFile('public' + uploaded), mediaBytes);
  assert.equal(await evaluate("(() => { const left=document.querySelector('.media-preview').getBoundingClientRect(), right=document.querySelector('.media-details').getBoundingClientRect(); return right.left>=left.right && Math.abs(left.width/right.width-1.5)<0.03; })()"), true, 'Metadata modal uses 60/40 desktop columns');
  assert.equal(await evaluate("(() => { const download=document.querySelector('.media-download').getBoundingClientRect(), path=document.querySelector('.media-path').getBoundingClientRect(), cancel=document.querySelector('.media-button-actions button').getBoundingClientRect(); return download.right<=path.left && path.right<=cancel.left && getComputedStyle(document.querySelector('.media-path')).overflowX==='auto'; })()"), true, 'Footer places Download, scrollable code path, then Cancel/Save');
  assert.equal(await evaluate("document.querySelector('.media-path code').textContent"), uploaded);
  await writeFile('_temp/media-alt-desktop.png', Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
  await cdp('Emulation.setDeviceMetricsOverride', {width:390,height:844,deviceScaleFactor:1,mobile:false});
  assert.equal(await evaluate("(() => { const preview=document.querySelector('.media-preview').getBoundingClientRect(), fields=document.querySelector('.media-details').getBoundingClientRect(), modal=document.querySelector('.image-picker'); return fields.top>=preview.bottom && modal.scrollWidth<=modal.clientWidth; })()"), true, 'Metadata stacks without overflow on mobile');
  await checkMetadataFeedback(false);
  await writeFile('_temp/media-alt-mobile.png', Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
  await cdp('Emulation.clearDeviceMetricsOverride');
  await click('.media-selection .media-actions button.outlined');
  await open('#nav-pages');
  await waitFor(`!!document.querySelector(${JSON.stringify(editor('Rich copy'))})`);
  await button('Rich copy', 'Insert image');
  await waitFor("!!document.querySelector('[aria-label=\"Choose image\"]')");
  const modalButton = text => evaluate(`[...document.querySelector('[aria-label="Choose image"]').querySelectorAll('button')].find(b => b.textContent.trim() === ${JSON.stringify(text)}).click()`);
  await waitFor("!!document.querySelector('.image-dialog .thumb')");
  assert.equal(await evaluate("[...document.querySelectorAll('.image-dialog .thumb')].every(b=>!!b.querySelector('img'))"), true);
  await modalButton('upload');
  await waitFor("!!document.querySelector('.image-dialog input[type=file]')");
  assert.equal(await evaluate("document.querySelector('.image-dialog input[type=file]').accept.includes('.pdf')"), false);
  await evaluate(`{ const input = document.querySelector('.image-dialog input[type=file]'), dt = new DataTransfer(); dt.items.add(new File(['%PDF-1.4'], 'not-an-image.pdf', {type:'application/pdf'})); input.files = dt.files; input.dispatchEvent(new Event('change',{bubbles:true})); }`);
  await waitFor("!!document.querySelector('.image-dialog [role=alert]')");
  assert.equal(await evaluate("!!document.querySelector('.media-selection')"), false);
  await modalButton('url');
  await evaluate(`{ const input = document.querySelector('.image-dialog input[type=url]'); input.value='/rigel-media/document.pdf'; input.dispatchEvent(new Event('input',{bubbles:true})); }`);
  await modalButton('Use this URL');
  await waitFor("!!document.querySelector('.image-dialog [role=alert]')");
  assert.equal(await evaluate("!!document.querySelector('.media-selection')"), false);
  await evaluate("document.querySelector('[aria-label=\"Choose image\"] .media-head .close').click()");
  assert.equal(await readFile(copyFile,'utf8'), originalCopy);
  assert.equal(await evaluate("document.querySelector('.save-button').disabled"), true);
  await type('Rich copy', 'before after');
  await format('Rich copy', 'paragraph');
  await evaluate(`document.querySelector(${JSON.stringify(editor('Rich copy'))}).focus()`);
  await cdp('Input.dispatchKeyEvent', {type:'keyDown',key:'End',code:'End',windowsVirtualKeyCode:35});
  for (let i = 0; i < 5; i++) await cdp('Input.dispatchKeyEvent', {type:'keyDown',key:'ArrowLeft',code:'ArrowLeft',windowsVirtualKeyCode:37});
  await evaluate('new Promise(r => setTimeout(r, 100))');
  await button('Rich copy','Insert image');
  await modalButton('url');
  const input = (selector, value) => evaluate(`(() => {const el = document.querySelector(${JSON.stringify(selector)}); el.value = ${JSON.stringify(value)}; el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await input('[aria-label="Choose image"] input[type=url]', 'javascript:alert(1)');
  await modalButton('Use this URL');
  await waitFor("!!document.querySelector('[aria-label=\"Choose image\"] [role=alert]')");
  await input('[aria-label="Choose image"] input[type=url]', uploaded);
  await modalButton('Use this URL');
  await input('.media-selection input:not([readonly])', 'Tiny fixture');
  assert.ok(await evaluate("document.querySelector('.media-selection .primary').getBoundingClientRect().width > 80"), 'Picker buttons must not inherit compact rich-text toolbar sizing');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.image-dialog .outlined')).borderTopStyle"), 'solid');
  await writeFile('_temp/media-richtext-picker.png', Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
  await modalButton('Insert image');
  await waitFor(`!!${root('Rich copy')}.querySelector('.ProseMirror img')`);
  await button('Rich copy','Markdown');
  assert.equal(await source('Rich copy'), `before ![Tiny fixture](${uploaded})after`);
  assert.equal(await readFile(copyFile,'utf8'), originalCopy, 'Insertion is draft-only');
  await click('#nav-media');
  await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
  await choice('Keep editing');
  await click('.save-button');
  await savedFile(copyFile, `![Tiny fixture](${uploaded})`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  await cdp('Page.reload');
  await new Promise(resolve => setTimeout(resolve, 400));
  await waitFor("!!document.querySelector('#nav-media')");
  await click('#nav-media');
  await waitFor("!!document.querySelector('.media-library')");
  await mediaButton('List view');
  await waitFor("!!document.querySelector('.media-library .media-table')");
  await cdp('Page.reload');
  await new Promise(resolve => setTimeout(resolve, 400));
  await waitFor("!!document.querySelector('#nav-media')");
  await click('#nav-media');
  await waitFor("!!document.querySelector('.media-library')");
  await waitFor("!!document.querySelector('.media-library .media-table tbody')");
  assert.equal(await evaluate("!!document.querySelector('.media-library .media-table tbody')"), true, 'Saved media view (list) survives reload');
  await mediaButton('Grid view');
  await waitFor("!!document.querySelector('.media-library .grid')");
  await open('#nav-pages');
  await waitFor(`!!document.querySelector(${JSON.stringify(editor('Rich copy'))})`);
  await button('Rich copy','Visual');
  await button('Rich copy','Insert image');
  await modalButton('library');
  await waitFor("!!document.querySelector('[aria-label=\"Choose image\"] .thumb')");
  await mediaControl('Image format', 'image/png');
  await mediaControl('Search media', metadata.name, 'input');
  await evaluate("[...document.querySelectorAll('.image-dialog .media-views button')].find(b => b.getAttribute('aria-label') === 'List view').click()");
  await waitFor("document.querySelectorAll('.image-dialog .media-file').length === 1");
  await click('.image-dialog .media-file');
  assert.equal(await evaluate("document.querySelector('.media-selection input:not([readonly])').value"), repositoryAlt, 'Fresh picker uses saved repository alt text');
  await modalButton('Back');
  await waitFor("document.querySelector('.image-dialog .media-file')?.getAttribute('aria-pressed') === 'true'");
  assert.equal(await evaluate("document.querySelector('.image-dialog select[aria-label=\\\"Image format\\\"]').value"), 'image/png');
    await evaluate("document.querySelector('.image-dialog .media-head .close').click()");
    assert.equal(await evaluate("document.querySelector('.save-button').disabled"), true);
  for (const provider of ['pexels', 'pixabay', 'unsplash']) for (const configured of [true, false]) {
    await click('.user-btn');
    await evaluate("[...document.querySelectorAll('.user-menu button')].find(button => button.textContent.trim().includes('Settings')).click()");
    await evaluate("[...document.querySelectorAll('.settings-nav button')].find(button => button.textContent.trim() === 'Media').click()");
    await input(`#rigel-key-${provider}`, configured ? 'synthetic-test-key' : '   ');
    await waitFor(`!!JSON.parse(localStorage.getItem('rigelcms.settings')).apiKeys.${provider} === ${configured}`);
    await click('.settings-head .close');
    await button('Rich copy', 'Insert image');
    await waitFor("!!document.querySelector('.image-dialog[open] .tabs')");
    assert.deepEqual(await evaluate("[...document.querySelectorAll('.image-dialog .tabs button')].map(button => button.dataset.source)"), ['library', 'upload', 'url', 'picsum', ...(configured ? [provider] : [])], `${provider} visibility follows Settings without reloading`);
    await click('.image-dialog .media-head .close');
  }
  console.log('PASS: each stock provider appears only with a saved key; clearing it hides the source without reloading');
  await evaluate(`localStorage.setItem('rigelcms.keys', JSON.stringify({unsplash:'synthetic-test-key'}));
    const real = window.fetch; window.tracked=0;
    window.fetch = async (url,...args) => {
      if (String(url).startsWith('https://api.unsplash.com/photos/test/download')) {window.tracked++; return Response.json({});}
      if (String(url).startsWith('https://api.unsplash.com/photos')) return Response.json([{id:'test',urls:{regular:'https://images.unsplash.com/test',small:'https://images.unsplash.com/test'},user:{name:'Fixture photographer'}}]);
      return real(url,...args);
    };`);
  await button('Rich copy','Insert image');
  await modalButton('library');
  await waitFor("!!document.querySelector('.image-dialog .media-file, .image-dialog .thumb')");
  await evaluate(`[...document.querySelectorAll('.image-dialog .media-file, .image-dialog .thumb')].find(button => button.querySelector('img')?.getAttribute('src') === ${JSON.stringify(uploaded)}).click()`);
  await modalButton('Insert image');
  await waitFor(`!!${root('Rich copy')}.querySelector('img[alt="${repositoryAlt}"]')`);
  assert.equal((await readFile(copyFile,'utf8')).includes(repositoryAlt), false, 'Default alt insertion stays unsaved');
  await button('Rich copy','Insert image');
  await modalButton('unsplash');
  await waitFor("!!document.querySelector('[aria-label=\"Choose image\"] .thumb')");
  await click('[aria-label="Choose image"] .thumb');
  await modalButton('Insert image');
  await waitFor('window.tracked === 1');
  await button('Rich copy','Markdown');
  assert.ok((await source('Rich copy')).includes('Fixture photographer'));
  assert.ok((await source('Rich copy')).includes('https://images.unsplash.com/test'));
  assert.ok(!(await readFile(copyFile,'utf8')).includes('Fixture photographer'));
  await click('#nav-media');
  await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
  await choice('Discard changes');
  await waitFor("!!document.querySelector('.media-library')");
  await click('.titlebar .primary');
  await waitFor("!!document.querySelector('.image-dialog[open] .tabs')");
  await writeFile('_temp/media-sources.png', Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
  assert.deepEqual(await evaluate("[...document.querySelectorAll('.image-dialog .tabs button')].map(b => b.textContent.trim())"), ['upload','url','picsum']);
  await evaluate(`{ localStorage.setItem('rigelcms.keys', JSON.stringify({pexels:'synthetic',pixabay:'synthetic'}));
    const real = window.fetch;
    window.fetch = async (url,...args) => {
      const value = String(url);
      if (value.startsWith('https://api.pexels.com/')) return Response.json({photos:[{src:{large:'https://images.pexels.com/test.png',medium:'https://images.pexels.com/test.png'},photographer:'Fixture',alt:'Mountain reflected in a lake'}]});
      if (value.startsWith('https://pixabay.com/api/')) return Response.json({hits:[{largeImageURL:'https://cdn.pixabay.com/test.png',webformatURL:'https://cdn.pixabay.com/test.png',user:'Fixture',tags:'mountain, lake, reflection'}]});
      if (value === '/rigel/api/local/media' && args[0]?.method === 'PUT' && window.failImageMetadata) { window.failImageMetadata = false; return new Response('Test metadata failure', {status:503}); }
      if (['https://example.com/', 'https://picsum.photos/', 'https://images.pexels.com/', 'https://cdn.pixabay.com/'].some(prefix => value.startsWith(prefix))) {
        const bytes = Uint8Array.from(atob('${pngBase64}'), c => c.charCodeAt(0));
        return new Response(new Blob([bytes, value], {type:'image/png'}));
      }
      return real(url,...args);
    }; }`);
  await click('.image-dialog .media-head .close');
  await click('.titlebar .primary');
  await waitFor("!!document.querySelector('.image-dialog .tabs [data-source=pexels]')");
  assert.deepEqual(await evaluate("[...document.querySelectorAll('.image-dialog .tabs button')].map(button => button.dataset.source)"), ['upload', 'url', 'picsum', 'pexels', 'pixabay'], 'Media uploads show configured providers but never Unsplash');
  for (const provider of ['url','picsum','pexels','pixabay']) {
    await uploadButton(provider);
    let remote;
    if (provider === 'url') {
      remote = 'https://example.com/photo.png';
      await input('.image-dialog input[type=url]', remote);
      await uploadButton('Use this URL');
    } else {
      await waitFor("!!document.querySelector('.image-dialog .thumb')");
      await click('.image-dialog .thumb');
      remote = await evaluate("document.querySelector('.media-selection input[readonly]').value");
    }
    const defaults = provider === 'pexels' ? 'Mountain reflected in a lake' : provider === 'pixabay' ? 'mountain, lake, reflection' : '';
    assert.deepEqual(await evaluate("[...document.querySelectorAll('.media-selection .media-meta input, .media-selection .media-meta textarea')].map(field => field.value)"), [defaults, defaults, defaults], `${provider} metadata prefills from the API, or stays blank when unavailable`);
    const importedMeta = { title: `${provider} edited title`, description: `${provider} edited description`, alt: `${provider} edited alt` };
    for (const [field, text] of Object.entries(importedMeta)) await input(`.media-selection [aria-label="Image ${field === 'alt' ? 'alt text' : field}"]`, text);
    if (provider === 'pexels' || provider === 'pixabay') await checkImportLayout(provider);
    const expected = Buffer.concat([Buffer.from(pngBase64, 'base64'), Buffer.from(remote)]);
    let failedUpload;
    if (provider === 'pexels') {
      await evaluate('window.failImageMetadata = true');
      await uploadButton('Import image');
      await waitFor("document.querySelector('.image-dialog [role=alert]')?.textContent.includes('metadata could not be saved')");
      failedUpload = uploads.at(-1);
      assert.match(failedUpload, uuidURL);
      assert.deepEqual(await readFile('public' + failedUpload), expected, 'Metadata failure still leaves a real upload to clean up');
      assert.equal(await evaluate("document.querySelector('.media-selection [aria-label=\"Image title\"]').value"), importedMeta.title, 'Failed metadata save keeps the preview and edits available for retry');
    }
    await uploadButton('Import image');
    await waitFor("!document.querySelector('.image-dialog')");
    const local = uploads.at(-1);
    assert.match(local, uuidURL);
    assert.ok(local.endsWith('.png'));
    if (failedUpload) assert.notEqual(local, failedUpload, 'Retrying the same image bytes creates a fresh UUID upload');
    await waitFor(`!!document.querySelector('.media-library img[src="${local}"]')`);
    const response = await fetch(new URL(local, url));
    assert.equal(response.status, 200);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), expected);
    assert.deepEqual(await readFile('public' + local), expected);
    const listing = await (await fetch(new URL('/rigel/media.json',url))).json();
    assert.ok(listing.images.some(image => image.url === local));
    for (const [key, text] of Object.entries(importedMeta)) {
      assert.equal(listing.images.find(image => image.url === local)[key], text);
      assert.equal((await readSidecar())[local][key], text, 'Import metadata is persisted on disk');
    }
    console.log(`PASS: ${provider} mocked download -> editable metadata -> real POST/PUT -> disk/GET bytes and library ${local}`);
    if (provider !== 'pixabay') { await click('.titlebar .primary'); await waitFor("!!document.querySelector('.image-dialog input[type=file]')"); }
  }
  await evaluate('window.mediaReloadMarker = true');
  await cdp('Page.reload');
  await waitFor("!window.mediaReloadMarker && !!document.querySelector('#nav-media')");
  await click('#nav-media');
  const reloadListing = await (await fetch(new URL('/rigel/media.json', url))).json();
  for (const asset of [...originalAssets.keys(), ...created]) {
    const name = renamedAssets.get(asset) ?? reloadListing.assets.find(item => item.url === asset)?.name ?? decodeURIComponent(asset.split("/").pop());
    await waitFor(`!![...document.querySelectorAll(".media-library .thumb, .media-library .media-file")].find(b => b.dataset.tooltip === ${JSON.stringify(name)} || b.textContent.trim() === ${JSON.stringify(name)})`);
  }
  for (const [asset, bytes] of originalAssets) assert.deepEqual(await readFile('public' + asset), bytes);
  console.log('PASS: reload displays durable imports and all pre-existing user assets unchanged');
  // ── Metadata sidecar: author capture, display-name/title/description rename, safe validation ──
  const medOrigin = new URL(url).origin;
  const csvBytes = Buffer.from('author,value\nAda,1\n');
  assert.equal((await readSidecar())[uploaded].author, 'Local user', 'Client upload captured Local user author fallback');
  let res = await fetch(new URL('/rigel/api/local/media', url), { method: 'POST', headers: { Origin: medOrigin, 'Content-Type': 'text/csv', 'X-Rigel-Filename': 'meta.csv', 'X-Rigel-Author': 'Ada Lovelace' }, body: csvBytes });
  assert.equal(res.status, 200);
  const csvURL = (await res.json()).url;
  if (!originalAssets.has(csvURL)) created.add(csvURL);
  assert.match(csvURL, uuidURL);
  assert.ok(csvURL.endsWith('.csv'));
  assert.equal((await readSidecar())[csvURL].author, 'Ada Lovelace', 'Upload captured saved identity author');
  const metaName = 'Fixture ' + 'a'.repeat(112), metaTitle = 'A test title', metaDesc = 'Longer description for the asset.';
  res = await fetch(new URL('/rigel/api/local/media', url), { method: 'PUT', headers: { Origin: medOrigin, 'Content-Type': 'application/json' }, body: JSON.stringify({ url: csvURL, name: metaName, title: metaTitle, description: metaDesc }) });
  assert.equal(res.status, 200);
  const updated = await res.json();
  assert.equal(updated.url, csvURL);
  assert.equal(updated.name, metaName);
  assert.equal(updated.title, metaTitle);
  assert.equal(updated.description, metaDesc);
  assert.equal(updated.author, 'Ada Lovelace');
  const meta = (await readSidecar())[csvURL];
  assert.equal(meta.name, metaName);
  assert.equal(meta.title, metaTitle);
  assert.equal(meta.description, metaDesc);
  assert.equal(meta.author, 'Ada Lovelace');
  assert.deepEqual(await readFile('public' + csvURL), csvBytes, 'rename must not touch the real UUID file');
  for (const bad of [
    { url: csvURL, name: '../evil' },
    { url: csvURL, name: 'x'.repeat(200) },
    { url: csvURL, name: 'a b/c' },
    { url: csvURL, author: 'Hacker' },
    { url: '/rigel-media/nope.csv', name: 'X' },
    { url: csvURL, title: 'no', bogus: true },
  ]) {
    const r = await fetch(new URL('/rigel/api/local/media', url), { method: 'PUT', headers: { Origin: medOrigin, 'Content-Type': 'application/json' }, body: JSON.stringify(bad) });
    assert.equal(r.status, 400, `expected reject ${JSON.stringify(bad)}`);
  }
  assert.equal((await readSidecar())[csvURL].name, metaName, 'rejected writes leave sidecar unchanged');
  assert.deepEqual(await readFile('public' + csvURL), csvBytes, 'rejected writes leave real file unchanged');
  await evaluate('window.mediaMetaMarker = true');
  await cdp('Page.reload');
  await new Promise(resolve => setTimeout(resolve, 1100));
  await waitFor("!window.mediaMetaMarker && !!document.querySelector('#nav-media')");
  await new Promise(resolve => setTimeout(resolve, 300));
  await click('#nav-media');
  await waitFor("!!document.querySelector('.media-library')");
  await mediaButton('Grid view');
  await waitFor("!!document.querySelector('.media-library .grid')");
  assert.equal(await evaluate(`!![...document.querySelectorAll('.media-library figure')].find(f => f.querySelector('figcaption')?.textContent === ${JSON.stringify(metaName)})`), true, 'Grid shows display name');
  await mediaButton('List view');
  await waitFor(`[...document.querySelectorAll('.media-table .media-file')].some(b => b.textContent.includes(${JSON.stringify(metaName)}))`);
  await evaluate(`[...document.querySelectorAll('.media-table .media-file')].find(b => b.textContent.includes(${JSON.stringify(metaName)})).click()`);
  await waitFor("!!document.querySelector('.media-selection')");
  assert.equal(await evaluate("document.querySelector('.media-path code')?.textContent"), csvURL);
  assert.equal(await evaluate("document.querySelector('.media-selection input[aria-label=\"Media display name\"]')?.value"), metaName);
  assert.equal(await evaluate("document.querySelector('.media-selection input[aria-label=\"Media title\"]')?.value"), metaTitle);
  assert.equal(await evaluate("!!document.querySelector('[aria-label=\"Media alt text\"]')"), false, 'Nonimages have no alt text field');
  assert.equal(await evaluate("document.querySelector('.media-selection textarea[aria-label=\"Media description\"]')?.value"), metaDesc);
  assert.ok(await evaluate("[...document.querySelectorAll('.media-selection p.hint')].some(p => p.textContent.includes('Author: Ada Lovelace'))"), 'Read-only author displayed');
  assert.equal(await evaluate("document.querySelector('.media-selection a[download]')?.getAttribute('href')"), csvURL);
  assert.ok(await evaluate("[...document.querySelectorAll('.media-selection .media-actions button')].some(b => b.textContent.trim() === 'Save' && b.classList.contains('primary'))"), 'Save button present');
  await click('.media-selection .media-actions .primary');
  await waitFor("[...document.querySelectorAll('.media-selection p')].some(p => p.textContent.trim() === 'Metadata saved.')");
  await click('.media-selection .media-actions button.outlined');
  await waitFor("!document.querySelector('.media-selection')");
  await mediaButton('Grid view');
  console.log('PASS: metadata sidecar author capture, rename/title/description, URL+file unchanged, safe validation, grid/list display name and preview metadata editor');
  assert.ok(created.has(csvURL) && !originalAssets.has(csvURL), 'Delete regression only targets a newly uploaded fixture');
  await evaluate(`[...document.querySelectorAll('.media-library .thumb')].find(button => button.getAttribute('aria-label') === ${JSON.stringify(metaName)}).click()`);
  await waitFor("!!document.querySelector('.media-selection .media-actions [aria-label=\"Delete file\"]')");
  await input('.media-selection [aria-label="Media title"]', 'Unsaved title kept during deletion');
  const deleteLedger = await readFile(sidecarPath);
  const deleteMetadata = await readSidecar();
  const previewValues = await evaluate("[...document.querySelectorAll('.media-selection input, .media-selection textarea')].map(field => field.value)");
  await evaluate(`{
    window.deletePreview = document.querySelector('.media-selection');
    window.deleteRequests = []; window.failDelete = true;
    const real = window.fetch;
    window.fetch = async (...args) => {
      if (args[0] !== '/rigel/api/local/media' || args[1]?.method !== 'DELETE') return real(...args);
      const request = {body: JSON.parse(args[1].body), type: args[1].headers['Content-Type']};
      window.deleteRequests.push(request);
      if (window.failDelete) { window.failDelete = false; request.status = 500; return new Response('Test delete failure', {status:500}); }
      const response = await real(...args); request.status = response.status; return response;
    };
  }`);
  const checkDeletePreview = async () => {
    assert.equal(await evaluate("window.deletePreview === document.querySelector('.media-selection')"), true, 'Confirmation leaves the same preview mounted');
    assert.deepEqual(await evaluate("[...document.querySelectorAll('.media-selection input, .media-selection textarea')].map(field => field.value)"), previewValues, 'Confirmation preserves unsaved metadata edits');
    assert.deepEqual(await readFile('public' + csvURL), csvBytes);
    assert.deepEqual(await readFile(sidecarPath), deleteLedger, 'Cancelled or failed deletion leaves the ledger unchanged');
  };
  for (const dismiss of ['Cancel', 'Escape']) {
    await click('.media-selection .media-actions [aria-label="Delete file"]');
    await waitFor("!!document.querySelector('.action-dialog[open]') && document.activeElement?.textContent.trim() === 'Cancel'");
    assert.equal(await evaluate("document.querySelector('.action-dialog h2').textContent"), `Delete “${metaName}”?`);
    const warning = await evaluate("document.querySelector('.action-dialog #action-description').textContent");
    assert.match(warning, /cannot be undone/i);
    assert.match(warning, /pages.*(?:broken|break)/i);
    assert.equal(await evaluate("document.querySelector('.action-dialog button[type=submit]').classList.contains('danger-btn')"), true);
    assert.deepEqual(await evaluate('window.deleteRequests'), [], 'Opening confirmation must not send DELETE');
    if (dismiss === 'Cancel') {
      const previousTheme = await evaluate("document.documentElement.dataset.theme || ''");
      for (const width of [1440, 390, 320]) for (const theme of ['light', 'dark']) {
        await cdp('Emulation.setDeviceMetricsOverride', {width,height:1000,deviceScaleFactor:1,mobile:false});
        await evaluate(`document.documentElement.dataset.theme=${JSON.stringify(theme)}`);
        assert.equal(await evaluate("(() => {const panel=document.querySelector('.action-dialog .rigel-modal');return panel.scrollWidth<=panel.clientWidth && panel.getBoundingClientRect().right<=innerWidth;})()"), true, 'Confirmation contains long filenames on desktop and mobile');
        await writeFile(`_temp/media-delete-confirmation-${width}-${theme}.png`, Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
      }
      await cdp('Emulation.clearDeviceMetricsOverride');
      await evaluate(`document.documentElement.dataset.theme=${JSON.stringify(previousTheme)}`);
    }
    if (dismiss === 'Cancel') await click('.action-dialog .action-actions button[type=button]');
    else {
      await cdp('Input.dispatchKeyEvent', {type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
      await cdp('Input.dispatchKeyEvent', {type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    }
    await waitFor("!document.querySelector('.action-dialog') && !!document.querySelector('.media-selection')");
    assert.equal(await evaluate("document.activeElement === document.querySelector('.media-selection [aria-label=\"Delete file\"]')"), true, 'Dismissing confirmation returns focus to Delete');
    assert.deepEqual(await evaluate('window.deleteRequests'), [], 'Cancel and Escape never send DELETE');
    await checkDeletePreview();
  }
  await click('.media-selection .media-actions [aria-label="Delete file"]');
  await waitFor("!!document.querySelector('.action-dialog[open]')");
  await click('.action-dialog button[type=submit]');
  await waitFor("document.querySelector('.action-dialog[open] [role=alert]')?.textContent.includes('500') && !document.querySelector('.action-dialog button[type=submit]').disabled");
  assert.deepEqual(await evaluate('window.deleteRequests'), [{body:{url:csvURL},type:'application/json',status:500}]);
  await checkDeletePreview();
  assert.ok((await (await fetch(new URL('/rigel/media.json', url))).json()).assets.some(asset => asset.url === csvURL), 'Failed delete keeps the API listing entry');
  await click('.action-dialog button[type=submit]');
  await waitFor("!document.querySelector('.action-dialog, .media-selection') && document.querySelector('.media-library [role=status]')?.textContent === 'File deleted.'");
  assert.deepEqual(await evaluate('window.deleteRequests'), [{body:{url:csvURL},type:'application/json',status:500},{body:{url:csvURL},type:'application/json',status:204}]);
  await assert.rejects(readFile('public' + csvURL), {code:'ENOENT'});
  delete deleteMetadata[csvURL];
  assert.deepEqual(await readSidecar(), deleteMetadata, 'Successful delete removes only the fixture ledger entry');
  assert.equal((await (await fetch(new URL('/rigel/media.json', url))).json()).assets.some(asset => asset.url === csvURL), false, 'Deleted file is absent from the API listing');
  for (const [asset, bytes] of originalAssets) assert.deepEqual(await readFile('public' + asset), bytes, 'Deleting the fixture preserves every original user file');
  for (const view of ['List view', 'Grid view']) {
    await mediaButton(view);
    await waitFor(view === 'List view' ? "!!document.querySelector('.media-library .media-table')" : "!!document.querySelector('.media-library .grid')");
    assert.equal(await evaluate(`[...document.querySelectorAll('.media-library .thumb, .media-library .media-file')].some(button => button.getAttribute('aria-label') === ${JSON.stringify(metaName)} || button.textContent.trim() === ${JSON.stringify(metaName)})`), false, 'Deleted fixture disappears from library rows and cards');
  }
  console.log('PASS: Delete confirmation Cancel/Escape/no early request, failed DELETE retains edits/file/ledger, retry removes fixture from disk/ledger/API/grid/list');
  await evaluate(`[...document.querySelectorAll('.media-library .thumb')].find(button => button.querySelector('img')?.getAttribute('src') === ${JSON.stringify(uploaded)}).click()`);
  await waitFor("!!document.querySelector('textarea[aria-label=\"Media alt text\"]')");
  assert.equal(await evaluate("document.querySelector('[aria-label=\"Media alt text\"]').value"), repositoryAlt, 'Alt text survives reload');
  await evaluate("{ const control=document.querySelector('[aria-label=\"Media alt text\"]'); control.value=''; control.dispatchEvent(new Event('input',{bubbles:true})); }");
  await click('.media-selection .media-actions .primary');
  await waitFor("document.querySelector('.media-actions [role=status]')?.textContent === 'Metadata saved.'");
  assert.equal((await readSidecar())[uploaded].alt, '', 'Decorative alt can be cleared');
  await click('.media-selection .media-actions button.outlined');
  console.log('PASS: image-only alt metadata Save/disk/list/reload/clear/default insertion; 60/40 desktop and stacked mobile preview; source bytes preserved');
  assert.deepEqual(errors, []);
  console.log('PASS: Media navigation, Markdown copy-field image pickers, real upload/list/served bytes, cancellation, safe URL, alt text, preserved selection, draft-only insertion, explicit Save persistence, Media unsaved guard, library cancellation, mocked Unsplash tracking/credit');
} finally {
  for (const asset of created) await rm('public' + asset, {force:true});
  socket?.close();
  if (chrome.exitCode === null && chrome.signalCode === null) {
    const exited = once(chrome, "exit");
    chrome.kill('SIGKILL');
    await exited;
  }
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  await rm(copyFile, {force: true});
  if (originalSidecar === null) await rm(sidecarPath, {force: true});
  else await writeFile(sidecarPath, originalSidecar);
}
