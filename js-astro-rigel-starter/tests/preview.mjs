import "./local-only.mjs";
import { openProperties } from './editor-controls.mjs';
import assert from "node:assert/strict";
import { testPreviewResize } from './preview-resize.mjs';
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";

const url = process.env.RIGEL_URL || "http://localhost:4321/rigel/";
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
    if (event.method === "Runtime.exceptionThrown") errors.push(event.params.exceptionDetails.text);
    if (event.method === "Page.javascriptDialogOpening" && event.params.type === "beforeunload") void cdp('Page.handleJavaScriptDialog', { accept: true });
  });
  await cdp("Runtime.enable");
  await cdp("Page.enable");
  await cdp("Page.addScriptToEvaluateOnNewDocument", { source: "if (!localStorage.getItem('rigelcms.settings')) localStorage.setItem('rigelcms.settings', JSON.stringify({ userPref: { editorExperience: 'sidebar' } }));" });
  async function navigate(method, params) {
    let listener, timeout;
    const loaded = new Promise((resolve, reject) => {
      listener = ({ data }) => {
        const event = JSON.parse(data);
        if (event.sessionId === sessionId && event.method === 'Page.loadEventFired') resolve();
      };
      socket.addEventListener('message', listener);
      timeout = setTimeout(() => reject(new Error(`Page load timed out: ${method}`)), 15000);
    });
    try {
      await Promise.all([loaded, cdp(method, params)]);
    } finally {
      clearTimeout(timeout);
      socket.removeEventListener('message', listener);
    }
  }
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
            const expected = !pseudo && el.matches('.avatar, .preview-spinner') ? '50%' : '0px';
            return corners.every(c => style[c] === expected) ? [] : [el.tagName + '.' + el.getAttribute('class') + pseudo];
          }));
        })()`);
        assert.deepEqual(rounded, [], 'Only avatars and preview spinners may have rounded corners');
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.fail(`Timed out: ${expression}\n${JSON.stringify(errors)}\n${await evaluate("document.body.innerText.slice(0,3000)")}`);
  }
  await cdp("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "light" }] });
  const watched = ['src/content/blog/first-post.json', 'src/content/news/launch-week.json', 'src/content/menus/footer.json'];
  const originals = await Promise.all(watched.map(file => readFile(file, 'utf8')));
  await cdp('Network.enable');
  let requests = 0;
  const writes = [];
  const requestUrls = [];
  socket.addEventListener('message', ({data}) => { const event=JSON.parse(data); if(event.method === 'Network.requestWillBeSent') { requestUrls.push(event.params.request.url); if(!['GET','HEAD','OPTIONS'].includes(event.params.request.method)) writes.push(event.params.request.url); } });
  socket.addEventListener('message', ({data}) => { if(JSON.parse(data).method === 'Network.requestWillBeSent') requests++; });
  await navigate('Page.navigate',{url});
  await waitFor("!!document.querySelector('#nav-pages')");
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const open = async (nav, title) => {
    await click(nav);
    await waitFor(`!![...document.querySelectorAll('.table-link')].find(b=>b.textContent.trim()===${JSON.stringify(title)})`);
    await evaluate(`[...document.querySelectorAll('.table-link')].find(b=>b.textContent.trim()===${JSON.stringify(title)}).click()`);
  };
  const input = (selector,text) => evaluate(`(() => {const el=document.querySelector(${JSON.stringify(selector)});el.value=${JSON.stringify(text)};el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  const selectBody = () => evaluate("(() => {const root=document.querySelector('.block-content');root.focus();const range=document.createRange();range.selectNodeContents(root);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);})()");
  const replaceBody = async text => {
    await selectBody();
    await cdp('Input.insertText',{text});
    await preview(text);
  };
  const blockType = async label => {
    await click('.body-toolbar [aria-label="Block type"]');
    await waitFor("!!document.querySelector('.select-menu:popover-open')");
    await evaluate(`[...document.querySelectorAll('.select-menu:popover-open [role=option]')].find(option=>option.querySelector('span').textContent===${JSON.stringify(label)}).click()`);
  };
  const discard = async () => {
    await click('#nav-pages');
    await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
    await evaluate("[...document.querySelectorAll('.unsaved-dialog button')].find(b=>b.textContent.trim()==='Discard changes').click()");
    await waitFor("!!document.querySelector('.table-link')");
  };

  const frame = "document.querySelector('.visual-editor iframe')";
  const preview = text => waitFor(`${frame}?.contentDocument?.body?.textContent.includes(${JSON.stringify(text)})`);
  const openArticle = () => open('[data-collection=blog]', 'A calmer way to publish a website');
  const { identifier } = await cdp('Page.addScriptToEvaluateOnNewDocument', { source: `
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (args[0] !== '/rigel/manifest.json') return response;
      const manifest = await response.json();
      manifest.pages.push({ slug: 'preview-fixture', label: 'Legacy preview fixture', shared: true, groups: [], values: {} });
      manifest.sidebar.push({ kind: 'link', target: { kind: 'page', slug: 'preview-fixture' } });
      (manifest.preview.pages ??= {})['preview-fixture'] = '/blog/first-post/';
      return Response.json(manifest);
    };
  ` });
  try {
    await navigate('Page.reload');
    await waitFor("!!document.querySelector('[data-page=preview-fixture]')");
    const openLegacyPage = async () => {
      await click('[data-page=preview-fixture]');
      await waitFor("!!document.querySelector('.site-preview iframe')?.contentDocument?.querySelector('[data-rigel-text]')");
    };
    await openLegacyPage();
    await testPreviewResize({ cdp, evaluate, waitFor, open: openLegacyPage, reload: () => navigate('Page.reload') });
  } finally {
    await cdp('Page.removeScriptToEvaluateOnNewDocument', { identifier });
    await evaluate("(() => { const settings = JSON.parse(localStorage.getItem('rigelcms.settings')); settings.userPref.editorExperience = 'sidebar'; localStorage.setItem('rigelcms.settings', JSON.stringify(settings)); })()");
    await navigate('Page.reload');
    await waitFor("!!document.querySelector('#nav-pages')");
  }
  await openArticle();
  await preview('A calmer way to publish a website');
  await openProperties({ evaluate, waitFor });
  assert.equal(await evaluate("document.querySelector('.visual-live').getAttribute('href')"), '/blog/first-post/');
  assert.equal(await evaluate("document.querySelector('.visual-live').target"), '_blank');
  assert.equal(await evaluate("(() => { const link = document.querySelector('.visual-live').getBoundingClientRect(), toggle = document.querySelector('[aria-label=\"Toggle properties panel\"]').getBoundingClientRect(); return toggle.left - link.right === parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.75; })()"), true);
  assert.equal(await evaluate("!!document.querySelector('.visual-toolbar .visual-live.icon-btn') && !document.querySelector('.titlebar .visual-live') && document.querySelectorAll('.visual-live').length === 1"), true);
  assert.equal(await evaluate("document.querySelector('.visual-live').textContent.trim() === '' && document.querySelector('.visual-live').getAttribute('aria-label') === 'Preview on website' && document.querySelector('.visual-live').dataset.tooltip === 'Preview on website'"), true);
  assert.equal(await evaluate("(() => { const link = document.querySelector('.visual-live').getBoundingClientRect(), toggle = document.querySelector('[aria-label=\"Toggle properties panel\"]').getBoundingClientRect(); return link.width === toggle.width && link.height === toggle.height; })()"), true);
  const liveStyle = () => evaluate("({ decoration: getComputedStyle(document.querySelector('.visual-live')).textDecorationLine, border: getComputedStyle(document.querySelector('.visual-live')).borderTopWidth })");
  assert.deepEqual(await liveStyle(), { decoration: 'none', border: '1px' });
  const liveRect = await evaluate("(() => { const rect = document.querySelector('.visual-live').getBoundingClientRect(); return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }; })()");
  await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', ...liveRect });
  assert.deepEqual(await liveStyle(), { decoration: 'none', border: '1px' });
  assert.equal(await evaluate("document.querySelector('.visual-editor iframe').getBoundingClientRect().top >= document.querySelector('.visual-toolbar').getBoundingClientRect().bottom"), true);
  await evaluate(`window.originalDoc=${frame}.contentDocument; window.originalFrame=${frame}; window.originalSrc=${frame}.src`);
  await evaluate('new Promise(r=>setTimeout(r,300))');
  const beforeRequests=requests;
  const beforePreviewRequests=requestUrls.filter(value => new URL(value).pathname === '/blog/first-post/').length;
  for(const text of ['Fast one','Fast two','UNSAVED HOST CONTACT']) await input('[data-collection-field=title] input',text);
  await preview('UNSAVED HOST CONTACT');
  assert.equal(await evaluate(`${frame}.contentDocument===window.originalDoc && ${frame}===window.originalFrame && ${frame}.src===window.originalSrc`),true);
  assert.equal(requestUrls.filter(value => new URL(value).pathname === '/blog/first-post/').length,beforePreviewRequests,'Text patches do not refetch the preview page');
  assert.equal(await evaluate(`${frame}.getAttribute('sandbox')`),'allow-same-origin');
  assert.equal(await evaluate(`getComputedStyle(${frame}.contentDocument.body).fontSize`),'16px');
  assert.equal(await evaluate(`getComputedStyle(${frame}.contentDocument.body).margin`),'0px');
  assert.equal(await readFile(watched[0],'utf8'),originals[0]);
  assert(!(await (await fetch(new URL('/blog/first-post/',url))).text()).includes('UNSAVED HOST CONTACT'));
  await evaluate(`window.postMessage({type:'rigel:preview',body:'STALE MALICIOUS DRAFT'},location.origin)`);
  await preview('UNSAVED HOST CONTACT');
  await writeFile('_temp/site-preview.png',Buffer.from((await cdp('Page.captureScreenshot',{format:'png'})).data,'base64'));
  await discard();
  await click('[data-document="settings:site"]');
  await waitFor("!!document.querySelector('[data-schema-path=copyright]')");
  assert.equal(await evaluate("!!document.querySelector('.site-preview')"),false,'Global Site settings has no page preview');
  assert.equal(await evaluate(`!!${frame}`),false);
  const manifest=await (await fetch(new URL('/rigel/manifest.json',url))).json();
  const menu = manifest.menus.entries.find(entry => entry.slug === 'footer');
  assert.ok(menu, 'The watched footer menu fixture exists');
  await open('#nav-menus',menu.title);
  await waitFor("!!document.querySelector('.menu-editor')");
  assert.equal(await evaluate("!!document.querySelector('.site-preview, .visual-editor')"),false,'Menus have no page preview');
  for(const collection of ['blog','news']) {
    const post=manifest.collections.find(c=>c.name===collection).posts[0];
    await open(`[data-collection=${collection}]`,post.frontmatter.title);
    await preview(post.frontmatter.title);
    await openProperties({ evaluate, waitFor });
    await evaluate(`window.postDoc=${frame}.contentDocument`);
    await waitFor("!!document.querySelector('.block-content')");
    await selectBody();
    const malicious = `UNSAVED ${collection}\n<script>parent.previewXss=true</script>\n<img src=x onerror=parent.previewXss=true>\n[unsafe](javascript:alert(1))\n![unsafe](data:image/svg+xml,x)`;
    await evaluate(`(() => {const data=new DataTransfer();data.setData('text/plain',${JSON.stringify(malicious)});data.setData('text/html',${JSON.stringify(malicious)});document.querySelector('.block-content').dispatchEvent(new ClipboardEvent('paste',{bubbles:true,cancelable:true,clipboardData:data}));})()`);
    await preview(`UNSAVED ${collection}`);
    assert.equal(await evaluate(`${frame}.contentDocument===window.postDoc`),true);
    assert.equal(await evaluate("window.previewXss === undefined"),true);
    assert.equal(await evaluate(`${frame}.contentDocument.querySelector('[data-rigel-richtext]').querySelectorAll('script, [onerror], [onclick], iframe').length`),0);
    assert.equal(await evaluate(`${frame}.contentDocument.querySelector('[data-rigel-richtext]').textContent.includes('<script>parent.previewXss=true</script>')`),true,'HTML paste stays literal text');
    await replaceBody('Actual bold');
    await selectBody();
    await click('.body-toolbar [aria-label=Bold]');
    await waitFor(`${frame}.contentDocument.querySelector('strong')?.textContent==='Actual bold'`);
    await click('.body-toolbar [aria-label=Bold]');
    await replaceBody('Preview quote');
    await blockType('Quote');
    await waitFor(`!!${frame}.contentDocument.querySelector('blockquote')`);
    assert.equal(await evaluate(`${frame}.contentDocument.defaultView.getComputedStyle(${frame}.contentDocument.querySelector('blockquote')).borderLeftWidth`),'3px');
    await blockType('Paragraph');
    await replaceBody('const answer = 42;');
    await blockType('Code block');
    await waitFor(`!!${frame}.contentDocument.querySelector('pre')`);
    assert.deepEqual(await evaluate(`(() => {const doc=${frame}.contentDocument,style=doc.defaultView.getComputedStyle(doc.querySelector('pre'));return [style.backgroundColor,style.overflowX];})()`),['rgb(36, 41, 46)','auto']);
    await blockType('Paragraph');
    await replaceBody('Inline code');
    await selectBody();
    await click('.body-toolbar [aria-label="More formatting"]');
    await waitFor("!!document.querySelector('.block-format-menu:popover-open')");
    await click('.block-format-menu [aria-label="Inline code"]');
    await waitFor(`!!${frame}.contentDocument.querySelector('p > code')`);
    assert.equal(await evaluate(`${frame}.contentDocument.defaultView.getComputedStyle(${frame}.contentDocument.querySelector('p > code')).backgroundColor`),'rgb(241, 245, 249)');
    await evaluate(`${frame}.contentDocument.querySelector('main').insertAdjacentHTML('beforeend','<img data-rigel-image="title"><a data-rigel-href="title">test</a>')`);
    await input('[data-collection-field=title] input','javascript:alert(1)');
    await waitFor(`${frame}.contentDocument.querySelector('[data-rigel-text="title"]').textContent==='javascript:alert(1)'`);
    assert.equal(await evaluate(`${frame}.contentDocument.querySelector('[data-rigel-image]').hasAttribute('src')`),false);
    assert.equal(await evaluate(`${frame}.contentDocument.querySelector('[data-rigel-href]').hasAttribute('href')`),false);
    await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'),true);
    await cdp('Emulation.clearDeviceMetricsOverride');
    await discard();
  }
  await click('[data-collection=blog]');
  await evaluate("[...document.querySelectorAll('.titlebar button')].find(b=>b.textContent.includes('Add new')).click()");
  await waitFor("!!document.querySelector('.action-dialog[open] input')");
  await input('.action-dialog input','New static preview');
  await evaluate("document.querySelector('.action-dialog form').requestSubmit()");
  await preview('New static preview');
  assert.equal(await evaluate(`new URL(${frame}.src).pathname`),'/preview/blog/');
  assert.equal(await evaluate("document.querySelector('.visual-live').getAttribute('href')"), '/blog/new-static-preview/');
  for(let i=0;i<watched.length;i++) assert.equal(await readFile(watched[i],'utf8'), originals[i],watched[i]+' unchanged');
  assert.deepEqual(errors,[]);
  assert.deepEqual(writes,[], 'Preview edits and resizing never save content');
  console.log('PASS: real static same-document iframe; no network for text edits; initial draft/new template sync; Lexical formatting/plain-text paste/XSS/URL safety; stale messages ignored; host CSS; no settings/menu preview; source bytes unchanged; mobile layout');
} finally {
  socket?.close();
  if (chrome.exitCode === null && chrome.signalCode === null) {
    const exited = once(chrome, "exit");
    chrome.kill('SIGKILL');
    await exited;
  }
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });

}