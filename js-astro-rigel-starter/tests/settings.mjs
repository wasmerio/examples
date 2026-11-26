import "./local-only.mjs";
import { openProperties } from './editor-controls.mjs';
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";

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
      pending.set(++id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const cdp = async (method, params) => {
    if (method !== "Page.reload") return send(method, params, sessionId);
    let listener, timer;
    const loaded = new Promise((resolve, reject) => {
      listener = ({ data }) => {
        const event = JSON.parse(data);
        if (event.sessionId === sessionId && event.method === "Page.javascriptDialogOpening" && event.params.type === "beforeunload") {
          console.log("Accepting unsaved-change confirmation for requested test reload");
          send("Page.handleJavaScriptDialog", { accept: true }, sessionId).catch(reject);
        }
        if (event.sessionId === sessionId && event.method === "Page.loadEventFired") resolve();
      };
      socket.addEventListener("message", listener);
      timer = setTimeout(() => reject(new Error("Reload did not finish")), 15000);
    });
    try {
      const [result] = await Promise.all([send(method, params, sessionId), loaded]);
      return result;
    } finally {
      clearTimeout(timer);
      socket.removeEventListener("message", listener);
    }
  };
  const errors = [];
  socket.addEventListener("message", ({ data }) => {
    const event = JSON.parse(data);
    if (event.method === "Runtime.exceptionThrown") errors.push(event.params.exceptionDetails.exception?.description ?? event.params.exceptionDetails.text);
  });
  await cdp("Runtime.enable");
  await cdp("Page.enable");
  await cdp("Page.addScriptToEvaluateOnNewDocument", { source: `
    if (window === window.top && !localStorage.getItem('rigelcms.settings')) localStorage.setItem('rigelcms.settings', JSON.stringify({ userPref: { editorExperience: 'sidebar' } }));
    window.alert = window.confirm = window.prompt = () => { throw new Error('Native JS dialogs must not be used'); };
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      if (window.stockTestMode) {
        const url = new URL(args[0], location.origin);
        if (url.pathname === '/rigel/api/local/save') {
          sessionStorage.setItem('test.contentWrites', String(Number(sessionStorage.getItem('test.contentWrites') || 0) + 1));
          window.stockSaved = JSON.parse(args[1].body);
          return new Response(null, { status: 204 });
        }
        if (url.pathname === '/rigel/api/local/media' && args[1]?.method === 'PUT') return new Response(null, { status: 204 });
        if (url.pathname === '/rigel/api/local/media' && args[1]?.method === 'POST') {
          window.stockUploaded = args[1].body instanceof Blob;
          window.stockUploadCount = (window.stockUploadCount || 0) + 1;
          return Response.json({ url: '/rigel-media/' + (window.stockUploadCount === 1 ? '00000000-0000-4000-8000-000000000001' : '00000000-0000-4000-8000-000000000002') + '.png' });
        }
        if (url.pathname === '/test-photo.png') return new Response('test image', { headers: { 'Content-Type': 'image/png' } });
        if (url.hostname === 'images.pexels.com' || (url.hostname === 'pixabay.com' && url.pathname.startsWith('/get/'))) {
          return new Response('test image', { headers: { 'Content-Type': 'image/png' } });
        }
        if (['api.pexels.com', 'api.unsplash.com', 'pixabay.com'].includes(url.hostname)) {
          if (url.pathname.endsWith('/download')) { window.stockTracked = true; return Response.json({}); }
          const query = url.searchParams.get('query') || url.searchParams.get('q');
          if (query === 'slow') await new Promise(resolve => setTimeout(resolve, 250));
          if (query === 'error') return new Response(null, { status: 429 });
          const thumb = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="60"><rect width="100" height="60" fill="steelblue"/></svg>';
          if (url.hostname === 'api.pexels.com') return Response.json({ photos: query === 'empty' ? [] : [{ id: 1, url: 'https://www.pexels.com/photo/1/', photographer: 'Test Pexels', src: { large2x: 'https://images.pexels.com/test-photo.png', medium: thumb } }] });
          if (url.hostname === 'pixabay.com') return Response.json({ hits: query === 'empty' ? [] : [{ id: 2, user: 'Test Pixabay', pageURL: 'https://pixabay.com/photos/2/', largeImageURL: 'https://pixabay.com/get/test-photo.png', webformatURL: thumb }] });
          const photos = [{ id: 'test-photo', user: { name: 'Test Unsplash' }, urls: { regular: 'https://images.unsplash.com/test-photo', small: thumb } }];
          return Response.json(query ? { results: query === 'empty' ? [] : photos } : photos);
        }
      }
      const response = await originalFetch(...args);
      if (args[0] !== '/rigel/manifest.json') return response;
      const manifest = await response.json();
      manifest.pages.push({ slug: 'legacy-fixture', label: 'Legacy copy fixture', shared: true, groups: [{ id: 'test', label: 'Test fields', fields: [{ key: 'testImage', label: 'Test image', type: 'image' }] }], values: { test: { testImage: '' } } });
      manifest.sidebar?.push({ kind: 'link', target: { kind: 'page', slug: 'legacy-fixture' } });
      return new Response(JSON.stringify(manifest), { headers: { 'Content-Type': 'application/json' } });
    };
  ` });
  async function evaluate(expression) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const result = await cdp("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
        if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || "Browser evaluation failed");
        return result.result.value;
      } catch (error) {
        if (attempt < 2 && /navigated or closed|Cannot find context|Execution context was destroyed/.test(String(error?.message ?? error))) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        }
        throw error;
      }
    }
  }
  async function waitFor(expression) {
    for (let i = 0; i < 100; i++) {
      if (await evaluate(expression)) {
        const rounded = await evaluate(`(() => {
          const corners = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'];
          return [...document.querySelectorAll('.rigel, .rigel *')].flatMap(el => ['', '::before', '::after'].flatMap(pseudo => {
            const style = getComputedStyle(el, pseudo || null);
            if (pseudo && ['none', 'normal'].includes(style.content)) return [];
            if (!pseudo && el.matches('input[type=radio]') && style.appearance !== 'none') return [];
            const expected = !pseudo && el.matches('.avatar, .preview-spinner') ? '50%' : '0px';
            return corners.every(c => style[c] === expected) ? [] : [el.tagName + '.' + el.getAttribute('class') + '[' + el.getAttribute('type') + ']' + pseudo];
          }));
        })()`);
        assert.deepEqual(rounded, [], 'Only avatars and native radio controls may have rounded corners');
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.fail(`Timed out: ${expression}`);
  }
  await cdp("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "light" }] });
  await cdp("Page.navigate", { url: process.env.RIGEL_URL || "http://localhost:4321/rigel/" });
  await waitFor("!!document.querySelector('.user-btn')");
  if (process.env.RIGEL_BROWSER_PREVIEW_CONTEXT_ONLY === "true") {
    await (await import("./preview-context-menu.mjs")).checkPreviewContextMenu({ cdp, evaluate, waitFor });
    assert.deepEqual(errors, []);
  } else if (process.env.RIGEL_BROWSER_NAVIGATION_ONLY === "true") {
    await (await import("./hash-navigation.mjs")).checkHashNavigation({ cdp, evaluate, waitFor });
    assert.deepEqual(errors, []);
  } else if (process.env.RIGEL_BROWSER_SEO_ONLY === "true") {
    await (await import("./seo.mjs")).checkSeo({ cdp, evaluate, waitFor });
    assert.deepEqual(errors, []);
  } else if (process.env.RIGEL_BROWSER_MULTILANG_ONLY === "true") {
    await (await import("./multilang.mjs")).checkMultilang({ cdp, evaluate, waitFor });
    assert.deepEqual(errors, []);
  } else {
  const siteFile = "src/content/demo/fields.json";
  const siteOriginal = await readFile(siteFile, "utf8");
  const realSettings = await readFile("src/content/settings/site.json", "utf8");
  try {
    await waitFor("!!document.querySelector('[data-document=\"demo:fields\"]')");
    await evaluate("document.querySelector('[data-document=\"demo:fields\"]').click()");
    await waitFor("!!document.querySelector('[data-schema-path=brandColor] input[type=color]')");
    const setField = async (selector, value) => evaluate(`(() => { const input=document.querySelector(${JSON.stringify(selector)}); input.focus(); input.value=${JSON.stringify(value)}; input.dispatchEvent(new Event('input',{bubbles:true})); })()`);
    const hex = '[data-schema-path=brandColor] input[type=text]';
    const picker = '[data-schema-path=brandColor] input[type=color]';
    const password = '[data-schema-path=mapsApiKey] input';
    const reveal = '[data-schema-path=mapsApiKey] button';
    assert.equal(await evaluate("document.querySelector('.save-button').disabled"),true,'Demo mounts clean');
    assert.equal(await evaluate("document.querySelector('[data-schema-path=priceValidUntil] .date-trigger')?.textContent.trim()"),'December 31, 2026','Schema dates display a readable date, not the stored ISO string');
    const showCalendar = async () => {
      await evaluate("document.querySelector('[data-schema-path=priceValidUntil] .date-trigger').click()");
      await waitFor("!!document.querySelector('.date-popover:popover-open')");
    };
    const calendarKey = async key => {
      await cdp('Input.dispatchKeyEvent',{type:'keyDown',key,code:key});
      await cdp('Input.dispatchKeyEvent',{type:'keyUp',key,code:key});
    };
    await showCalendar();
    assert.equal(await evaluate("document.querySelectorAll('.date-popover input[type=text], .date-popover [aria-label=\"Apply date\"]').length"),0,'Calendar has no duplicate date entry or confirmation');
    assert.equal(await evaluate("(() => {const [today,clear]=[...document.querySelectorAll('.date-actions button')].map(button=>button.getBoundingClientRect());return Math.abs(today.top-clear.top)<1&&clear.left-today.right>0&&clear.left-today.right<=16;})()"),true,'Today and Clear share one compact row');
    assert.equal(await evaluate("document.activeElement.dataset.date"),'2026-12-31','Calendar starts focused on the selected day');
    await calendarKey('ArrowRight');
    await waitFor("document.activeElement.dataset.date==='2027-01-01'");
    await calendarKey('PageUp');
    await waitFor("document.activeElement.dataset.date==='2026-12-01'");
    await calendarKey('Escape');
    await waitFor("!document.querySelector('.date-popover:popover-open') && document.activeElement.matches('.date-trigger')");
    assert.equal(await evaluate("document.querySelector('.save-button').disabled"),true,'Browsing and cancelling never changes the date');
    await showCalendar();
    await evaluate("document.querySelector('.date-header [aria-label=\"Next month\"]').click()");
    await waitFor("!!document.querySelector('[data-date=\"2027-01-31\"]')");
    await evaluate("document.querySelector('.date-header [aria-label=\"Previous month\"]').click()");
    await waitFor("!!document.querySelector('[data-date=\"2026-12-31\"]')");
    const outsideCalendar = await evaluate("({x:innerWidth-32,y:8})");
    for (const type of ['mousePressed','mouseReleased']) await cdp('Input.dispatchMouseEvent',{type,...outsideCalendar,button:'left',buttons:type==='mousePressed'?1:0,clickCount:1});
    await waitFor("!document.querySelector('.date-popover:popover-open')");
    const numberStyle = "(() => {const number=document.querySelector('[data-schema-path=maxGuests] input'),text=document.querySelector('[data-schema-path=siteName] input');const properties=['backgroundColor','color','borderTopColor','borderTopWidth','borderRadius','fontFamily','fontSize','paddingTop','paddingLeft','height','width'];return {number:Object.fromEntries(properties.map(key=>[key,getComputedStyle(number)[key]])),text:Object.fromEntries(properties.map(key=>[key,getComputedStyle(text)[key]])),appearance:getComputedStyle(number).appearance};})()";
    for (const theme of ['dark','light']) {
      await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:theme}]});
      await waitFor(`document.documentElement.dataset.theme===${JSON.stringify(theme)}`);
      const styles=await evaluate(numberStyle);
      assert.deepEqual(styles.number,styles.text,`Number inputs match themed text fields in ${theme} mode`);
      assert.equal(styles.appearance,'textfield','Number fields hide native spinner chrome');
      await showCalendar();
      assert.equal(await evaluate("getComputedStyle(document.querySelector('.date-popover')).backgroundColor===getComputedStyle(document.querySelector('[data-schema-path=siteName] input')).backgroundColor"),true,`Calendar uses the ${theme} field surface`);
      await writeFile(`_temp/calendar-${theme}.png`,Buffer.from((await cdp('Page.captureScreenshot',{format:'png'})).data,'base64'));
      await calendarKey('Escape');
    }
    await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
    await showCalendar();
    assert.equal(await evaluate("(() => {const rect=document.querySelector('.date-popover').getBoundingClientRect();return rect.left>=0&&rect.right<=innerWidth&&rect.top>=0&&rect.bottom<=innerHeight;})()"),true,'Calendar fits a narrow viewport');
    await writeFile('_temp/calendar-mobile.png',Buffer.from((await cdp('Page.captureScreenshot',{format:'png'})).data,'base64'));
    await calendarKey('Escape');
    await cdp('Emulation.clearDeviceMetricsOverride');
    await evaluate("document.querySelector('[data-schema-path=maxGuests] input').focus()");
    for (const [key,value] of [['ArrowUp','13'],['ArrowDown','12']]) {
      await cdp('Input.dispatchKeyEvent',{type:'keyDown',key,windowsVirtualKeyCode:key==='ArrowUp'?38:40});
      await cdp('Input.dispatchKeyEvent',{type:'keyUp',key,windowsVirtualKeyCode:key==='ArrowUp'?38:40});
      await waitFor(`document.querySelector('[data-schema-path=maxGuests] input').value===${JSON.stringify(value)}`);
    }
    await evaluate("document.querySelector('[data-schema-path=maxGuests] input').blur()");
    assert.equal(await evaluate("document.querySelector('.save-button').disabled"),true,'Keyboard stepping and restoring the value leaves the draft clean');
    await evaluate(`document.querySelector(${JSON.stringify(reveal)}).click()`);
    assert.equal(await evaluate(`document.querySelector(${JSON.stringify(password)}).type`),'text');
    assert.equal(await evaluate(`document.querySelector(${JSON.stringify(reveal)}).getAttribute('aria-pressed')`),'true');
    assert.equal(await evaluate(`document.querySelector(${JSON.stringify(password)}).value`),JSON.parse(siteOriginal).mapsApiKey);
    await evaluate(`document.querySelector(${JSON.stringify(reveal)}).click()`);
    assert.equal(await evaluate(`document.querySelector(${JSON.stringify(password)}).type`),'password');
    assert.equal(await evaluate("document.querySelector('.save-button').disabled"),true,'Reveal does not edit content');
    await showCalendar();
    await evaluate("[...document.querySelectorAll('.date-actions button')].find(button=>button.textContent==='Today').click()");
    assert.equal(await evaluate("document.querySelector('.date-trigger').textContent.trim()"),await evaluate("new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(new Date())"));
    await showCalendar();
    await evaluate("[...document.querySelectorAll('.date-actions button')].find(button=>button.textContent==='Clear').click()");
    await waitFor("document.querySelector('.date-trigger').textContent.includes('Choose date')");
    await setField(picker,'#113355');
    await waitFor(`document.querySelector(${JSON.stringify(hex)}).value==='#113355'`);
    await setField(hex,'');
    await evaluate(`document.querySelector(${JSON.stringify(hex)}).blur()`);
    assert.equal(await evaluate(`document.querySelector(${JSON.stringify(hex)}).value`),'');
    await setField(hex,'#');
    assert.equal(await evaluate(`document.querySelector(${JSON.stringify(hex)}).value`),'#','Hex input stays permissive while typing');
    await setField(hex,'#0AF');
    await evaluate(`document.querySelector(${JSON.stringify(hex)}).blur()`);
    await waitFor(`document.querySelector(${JSON.stringify(hex)}).value==='#00aaff' && document.querySelector(${JSON.stringify(picker)}).value==='#00aaff'`);
    const snippet = '<script>window.schemaSnippetExecuted=true</script>\nconst demo = false;';
    await setField('[data-schema-path=analyticsSnippet] textarea',snippet);
    assert.deepEqual(await evaluate("(() => {const input=document.querySelector('[data-schema-path=analyticsSnippet] textarea');return {rows:input.rows,spellcheck:input.spellcheck,monospace:getComputedStyle(input).fontFamily.includes('monospace')};})()"),{rows:8,spellcheck:false,monospace:true});
    await setField(password,'changed-demo-only-key');
    await setField('[data-schema-path=siteName] input','Schema fields browser check');
    await setField('[data-schema-path=openingHours] .schema-item label input','Tuesday');
    await showCalendar();
    await setField('.date-header input','2026');
    await evaluate("document.querySelector('.date-header input').dispatchEvent(new Event('change',{bubbles:true}))");
    await evaluate("document.querySelector('.date-header [aria-label=\"Calendar month\"]').click()");
    await waitFor("!!document.querySelector('.date-popover .select-menu:popover-open')");
    await evaluate("[...document.querySelectorAll('.date-popover .select-menu:popover-open [role=option]')].find(option=>option.querySelector('span').textContent==='October').click()");
    await waitFor("!!document.querySelector('[data-date=\"2026-10-13\"]') && !!document.querySelector('.date-popover:popover-open')");
    await evaluate("document.querySelector('[data-date=\"2026-10-13\"]').click()");
    await waitFor("document.querySelector('.date-trigger').textContent.trim()==='October 13, 2026' && !document.querySelector('.date-popover:popover-open')");
    await waitFor("!document.querySelector('.save-button').disabled");
    assert.equal(await readFile(siteFile,'utf8'),siteOriginal,'Field edits do not autosave');
    await evaluate("document.querySelector('.save-button').click()");
    await waitFor("document.querySelector('.save-status')?.textContent.trim()==='Saved'");
    const saved = JSON.parse(await readFile(siteFile,'utf8'));
    assert.equal(saved.brandColor,'#00aaff');
    assert.equal(saved.analyticsSnippet,snippet);
    assert.equal(saved.mapsApiKey,'changed-demo-only-key');
    assert.equal(saved.siteName,'Schema fields browser check');
    assert.equal(saved.openingHours[0].day,'Tuesday');
    assert.equal(saved.priceValidUntil,'2026-10-13','Readable dates still save as ISO dates');
    assert.equal(await evaluate('window.schemaSnippetExecuted===true'),false,'Code remains inert text');
    let html = '';
    for (let attempt=0;attempt<100;attempt++) {
      html=await (await fetch(new URL('/demo/fields/',process.env.RIGEL_URL || 'http://127.0.0.1:4321'))).text();
      if (html.includes('Schema fields browser check') && html.includes('#00aaff') && html.includes('Tuesday')) break;
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    assert(html.includes('Schema fields browser check') && html.includes('#00aaff') && html.includes('Tuesday'),'Save updates the actual /demo/fields/ HTML');
    assert(!html.includes('changed-demo-only-key') && !html.includes('schemaSnippetExecuted'),'The demo route does not expose the password or execute code');
    await cdp('Page.reload');
    await waitFor("!!document.querySelector('[data-document=\"demo:fields\"]')");
    await evaluate("document.querySelector('[data-document=\"demo:fields\"]').click()");
    await waitFor("document.querySelector('[data-schema-path=brandColor] input[type=text]')?.value==='#00aaff'");
    assert.equal(await evaluate("document.querySelector('[data-schema-path=analyticsSnippet] textarea').value"),snippet);
    assert.equal(await evaluate(`document.querySelector(${JSON.stringify(password)}).value`),'changed-demo-only-key');
    assert.equal(await evaluate(`document.querySelector(${JSON.stringify(password)}).type`),'password');
    await evaluate("document.querySelector('[data-schema-path=brandColor]').scrollIntoView({block:'start'})");
    assert.equal(await evaluate("document.querySelector('.date-trigger').textContent.trim()"),'October 13, 2026','ISO values reload with a readable display');
    await writeFile('_temp/schema-fields.png',Buffer.from((await cdp('Page.captureScreenshot',{format:'png'})).data,'base64'));
    console.log('PASS: schema color/code/password, reveal without mutation, explicit Save/file/public HTML/reload');
    await showCalendar();
    await evaluate("[...document.querySelectorAll('.date-actions button')].find(button=>button.textContent==='Clear').click()");
    await evaluate("document.querySelector('.save-button').click()");
    await waitFor("document.querySelector('.save-status')?.textContent.trim()==='Saved'");
    assert.equal(Object.hasOwn(JSON.parse(await readFile(siteFile,'utf8')),'priceValidUntil'),false,'Clearing an optional date saves an absent value, not an invalid empty date');
    console.log('PASS: custom calendar navigation/keyboard, compact Today/Clear row, immediate selection, light/dark/mobile, readable display and ISO Save/reload');
  } finally {
    await writeFile(siteFile,siteOriginal);
    assert.equal(await readFile(siteFile,'utf8'),siteOriginal,'Demo fields restored byte-for-byte');
    assert.equal(await readFile('src/content/settings/site.json','utf8'),realSettings,'Demo edits never change real Site settings');
  }
  await cdp('Page.reload');
  await waitFor("!!document.querySelector('.user-btn')");
  await (await import("./sidebar.mjs")).checkSidebar({ cdp, evaluate, waitFor });
  await (await import("./unsaved.mjs")).checkUnsaved({ cdp, evaluate, waitFor });
  await (await import("./menus.mjs")).checkMenus({ cdp, evaluate, waitFor });
  await (await import("./pages.mjs")).checkPages({ cdp, evaluate, waitFor });
  await (await import("./page-previews.mjs")).checkPagePreviews({ evaluate, waitFor });
  await (await import("./page-deletion.mjs")).checkPageDeletion({ cdp, evaluate, waitFor });
  await (await import("./search-palette.mjs")).checkSearchPalette({ cdp, evaluate, waitFor });
  await evaluate("document.querySelector('#nav-pages').click()");
  await waitFor("!![...document.querySelectorAll('tbody tr')].find(row => row.cells[1].textContent.trim() === 'contact')");
  await evaluate("[...document.querySelectorAll('tbody tr')].find(row => row.cells[1].textContent.trim() === 'contact').querySelector('.table-link').click()");
  await openProperties({ evaluate, waitFor });
  await evaluate("document.querySelector('#properties-tab-page').click()");
  await waitFor("!!document.querySelector('main input[type=text]')");
  await waitFor("document.querySelector('.brand img')?.complete && document.querySelector('.brand img').naturalWidth > 0");
  assert.equal(await evaluate("document.querySelector('.brand span').textContent"), "Rigel CMS");
  await evaluate("document.querySelector('.user-btn').click()");
  await waitFor("!!document.querySelector('.user-menu')");
  await waitFor("(() => { const menu = document.querySelector('.user-menu').getBoundingClientRect(); return !!document.elementFromPoint(menu.left + 10, menu.top + 10)?.closest('.user-menu'); })()");
  assert.equal(await evaluate(`(() => {
    const trigger = document.querySelector('.user-btn').getBoundingClientRect();
    const menu = document.querySelector('.user-menu').getBoundingClientRect();
    return menu.left >= trigger.right && menu.right <= innerWidth && menu.bottom <= innerHeight && document.elementFromPoint(menu.left + 10, menu.top + 10)?.closest('.user-menu') !== null;
  })()`), true, 'User menu opens visibly to the right');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.user-menu button')).justifyContent"), "flex-start");
  assert.equal(await evaluate("!!document.querySelector('.user-menu-head .avatar svg')"), true);
  assert.equal(await evaluate("document.querySelector('.user-menu-head .user-details strong')?.textContent"), "Local user");
  assert.equal(await evaluate("document.querySelector('.user-menu-head .user-details small')?.textContent"), "Local mode");
  await evaluate("document.querySelector('.user-menu-head').click()");
  assert.equal(await evaluate("!!document.querySelector('.user-menu')"), true);
  await evaluate("document.querySelector('main').click()");
  await waitFor("!document.querySelector('.user-menu')");
  await evaluate("document.querySelector('.user-btn').click()");
  await waitFor("!!document.querySelector('.user-menu')");
  await cdp("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await cdp("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await waitFor("!document.querySelector('.user-menu')");
  assert.equal(await evaluate("document.querySelector('.user-btn').getAttribute('aria-expanded')"), "false");
  await evaluate("document.querySelector('.user-btn').click()");
  await waitFor("!!document.querySelector('.user-menu')");
  await evaluate("[...document.querySelectorAll('.user-menu button')].find(b => b.textContent.trim() === 'Settings').click()");
  await waitFor("!!document.querySelector('.settings-modal')");
  await evaluate("window.settingsTestMarker = 'same-page'");
  const checkColors = async (theme) => {
    const dark = theme === "dark";
    assert.equal(await evaluate("getComputedStyle(document.documentElement).backgroundColor"), dark ? "rgb(8, 15, 28)" : "rgb(248, 250, 252)");
    const color = (selector, property) => evaluate(`getComputedStyle(document.querySelector(${JSON.stringify(selector)}))[${JSON.stringify(property)}]`);
    await waitFor(`getComputedStyle(document.querySelector('main input[type=text]')).borderTopColor === '${dark ? 'rgb(113, 131, 156)' : 'rgb(100, 116, 139)'}'`);
    assert.equal(await color('.rigel', 'colorScheme'), theme);
    assert.equal(await color('.rail-scroll button.active', 'color'), dark ? 'rgb(173, 232, 255)' : 'rgb(12, 62, 107)');
    assert.equal(await color('.settings-pane input[type=radio]', 'accentColor'), dark ? 'rgb(114, 216, 255)' : 'rgb(0, 90, 163)');
    assert.equal(await color('.rigel:not(.rigel-modal-backdrop)', 'backgroundColor'), dark ? 'rgb(8, 15, 28)' : 'rgb(248, 250, 252)');
    assert.equal(await color('.settings-modal', 'backgroundColor'), dark ? 'rgb(17, 28, 46)' : 'rgb(255, 255, 255)');
    assert.equal(await color('.settings-nav button.active', 'backgroundColor'), dark ? 'rgb(6, 38, 68)' : 'rgb(217, 244, 255)');
    assert.equal(await color('.settings-nav button.active', 'color'), dark ? 'rgb(173, 232, 255)' : 'rgb(12, 62, 107)');
    assert.equal(await color('main input[type=text]', 'borderTopColor'), dark ? 'rgb(113, 131, 156)' : 'rgb(100, 116, 139)');
    assert.equal(await color('.settings-head', 'borderBottomColor'), dark ? 'rgb(51, 65, 85)' : 'rgb(203, 213, 225)');
    await evaluate("document.querySelector('main input[type=text]').focus()");
    assert.equal(await color('main input[type=text]', 'outline'), `rgb(${dark ? '114, 216, 255' : '0, 90, 163'}) solid 3px`);
    assert.equal(await color('main input[type=text]', 'outlineOffset'), '3px');
    await evaluate("document.activeElement.blur()");
    await evaluate("document.querySelector('[data-collection]').click()");
    await waitFor("!!document.querySelector('.titlebar .primary')");
    assert.equal(await color('.titlebar .primary', 'backgroundColor'), dark ? 'rgb(114, 216, 255)' : 'rgb(0, 90, 163)');
    assert.equal(await color('.titlebar .primary', 'color'), dark ? 'rgb(8, 15, 28)' : 'rgb(255, 255, 255)');
    assert.equal(await color('.table-card td', 'borderBottomColor'), dark ? 'rgb(51, 65, 85)' : 'rgb(203, 213, 225)');
    await evaluate("document.querySelector('#nav-pages').click()");
    await waitFor("!!document.querySelector('.table-link')");
    await evaluate("[...document.querySelectorAll('tbody tr')].find(row => row.cells[1].textContent.trim() === 'contact').querySelector('.table-link').click()");
    await openProperties({ evaluate, waitFor });
    await evaluate("document.querySelector('#properties-tab-page').click()");
    await waitFor("!!document.querySelector('main input[type=text]')");
  };
  await checkColors("light");
  const checkAlignment = async () => {
    assert.equal(await evaluate("[...document.querySelectorAll('.settings-pane input[type=checkbox]')].every(input => input.getAttribute('role') === 'switch')"), true);
    const offsets = await evaluate(`[...document.querySelectorAll('.settings-pane input[type=radio], .settings-pane input[type=checkbox]')].map(input => {
      const control = input.getBoundingClientRect();
      const label = input.parentElement.querySelector('span').getBoundingClientRect();
      return Math.abs(control.top + control.height / 2 - label.top - label.height / 2);
    })`);
    assert.ok(offsets.length > 0 && offsets.every(offset => offset < 1), 'Radio/checkbox centers must align with their labels: ' + offsets);
  };
  await checkAlignment();
  await evaluate("document.querySelector('input[value=dark]').click()");
  await waitFor("document.documentElement.dataset.theme === 'dark'");
  await checkColors("dark");
  assert.equal(await evaluate("JSON.parse(localStorage.getItem('rigelcms.settings')).theme"), "dark");
  assert.equal(await evaluate("[...document.querySelectorAll('.settings-modal button')].some(b => b.textContent.trim() === 'Save')"), false);
  const { data } = await cdp("Page.captureScreenshot", { format: "png" });
  await writeFile("_temp/settings-dark.png", Buffer.from(data, "base64"));
  const stored = (key, value) => waitFor(`JSON.parse(localStorage.getItem('rigelcms.settings'))[${JSON.stringify(key)}] === ${JSON.stringify(value)}`);
  const pane = async (name) => {
    await evaluate(`[...document.querySelectorAll('.settings-nav button')].find(b => b.textContent.trim() === ${JSON.stringify(name)}).click()`);
    await waitFor(`document.querySelector('.settings-nav button.active').textContent.trim() === ${JSON.stringify(name)}`);
  };
  const input = (selector, value, event = "input") => evaluate(`(() => {
    const input = document.querySelector(${JSON.stringify(selector)});
    input.value = ${JSON.stringify(value)};
    input.dispatchEvent(new Event(${JSON.stringify(event)}, { bubbles: true }));
  })()`);
  for (const theme of ["light", "system"]) {
    await evaluate(`document.querySelector('input[value=${theme}]').click()`);
    await stored("theme", theme);
    await waitFor("document.documentElement.dataset.theme === 'light'");
  }
  await cdp("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "dark" }] });
  await waitFor("document.documentElement.dataset.theme === 'dark'");
  await checkColors("dark");
  await evaluate("document.querySelector('input[value=light]').click()");
  await waitFor("document.documentElement.dataset.theme === 'light'");
  await checkColors("light");
  assert.equal(await evaluate("document.querySelector('.settings-pane input[type=text]')"), null);
  assert.equal(await evaluate("document.querySelector('.uname').textContent"), "Local user");
  await pane("Media");
  assert.equal(await evaluate("document.querySelector('.settings-pane').textContent.includes('Cloud Storage Service API Keys')"), false);
  assert.equal(await evaluate("document.querySelector('.settings-pane select')"), null);
  assert.equal(await evaluate("document.querySelector('.settings-pane').textContent.includes('Stock Photo Service API Keys')"), true);
  for (const theme of ["light", "dark"]) {
    await pane("Interface");
    await evaluate(`document.querySelector('input[value=${theme}]').click()`);
    await stored("theme", theme);
    await pane("Advanced");
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.settings-pane input[type=checkbox]')).accentColor"), theme === "dark" ? "rgb(114, 216, 255)" : "rgb(0, 90, 163)");
    await pane("Media");
    const shot = await cdp("Page.captureScreenshot", { format: "png" });
    await writeFile(`_temp/settings-media-${theme}.png`, Buffer.from(shot.data, "base64"));
  }
  await pane("Interface");
  await evaluate("document.querySelector('input[value=light]').click()");
  await stored("theme", "light");
  await pane("Media");

  for (const key of ["pexels", "pixabay", "unsplash"]) {
    const selector = `#rigel-key-${key}`;
    assert.equal(await evaluate(`document.querySelector('${selector}').placeholder.startsWith('e.g. ')`), true);
    assert.equal(await evaluate(`document.querySelector('button[aria-controls="rigel-key-${key}"]').textContent.trim()`), "");
    assert.equal(await evaluate(`!!document.querySelector('button[aria-controls="rigel-key-${key}"] svg')`), true);
    assert.equal(await evaluate(`(() => {
      const field = document.querySelector('${selector}').getBoundingClientRect();
      const button = document.querySelector('button[aria-controls="rigel-key-${key}"]').getBoundingClientRect();
      return button.left >= field.left && button.right <= field.right && button.top >= field.top && button.bottom <= field.bottom;
    })()`), true);
    assert.equal(await evaluate(`document.querySelector('${selector}').type`), "password");
    await evaluate(`document.querySelector('button[aria-controls="rigel-key-${key}"]').click()`);
    await waitFor(`document.querySelector('${selector}').type === 'text'`);
    await evaluate(`document.querySelector('button[aria-controls="rigel-key-${key}"]').click()`);
    await waitFor(`document.querySelector('${selector}').type === 'password'`);
    await input(selector, "  settings-test-placeholder  ");
    await waitFor(`JSON.parse(localStorage.getItem('rigelcms.settings')).apiKeys.${key} === 'settings-test-placeholder'`);
    await input(selector, "");
    await waitFor(`!JSON.parse(localStorage.getItem('rigelcms.settings')).apiKeys.${key}`);
  }
  await pane("Interface");
  await checkAlignment();
  for (const language of ["es", "ru", "en"]) {
    await evaluate(`document.querySelector('input[value=${language}]').click()`);
    await stored("language", language);
  }
  await pane("Advanced");
  await checkAlignment();
  const checkContextMenu = async allowed => {
    assert.deepEqual(await evaluate("(() => { const frame=document.querySelector('.visual-editor iframe');const targets=[document.querySelector('main input[type=text]'),document.querySelector('.settings-modal'),frame.contentDocument.body];return targets.map(target=>{const event=new target.ownerDocument.defaultView.MouseEvent('contextmenu',{bubbles:true,cancelable:true});target.dispatchEvent(event);return !event.defaultPrevented;});})()"), [allowed,allowed,allowed], 'Context menu follows Developer mode in fields, dialogs and preview');
  };
  await waitFor("document.querySelector('.canvas-stage')?.dataset.ready === 'true'");
  await checkContextMenu(false);
  await evaluate("document.querySelector('.settings-pane input[type=checkbox]').click()");
  await stored("devMode", true);
  await checkContextMenu(true);
  await waitFor("!!document.querySelector('main .md-preview pre')");
  await waitFor("[...document.querySelectorAll('main label > span')].some(el => /\\(.+\\)/.test(el.textContent))");
  await evaluate("document.querySelector('.settings-pane input[type=checkbox]').click()");
  await stored("devMode", false);
  await checkContextMenu(false);
  console.log('PASS: native context menu blocked by default, enabled live by Developer mode, and blocked again in fields, Settings and preview');
  await waitFor("!document.querySelector('main .md-preview pre')");
  assert.equal(await evaluate("window.settingsTestMarker"), "same-page");
  await evaluate("document.querySelector('.settings-head .close').click()");
  await waitFor("!document.querySelector('.settings-modal')");
  await evaluate("document.querySelector('[data-page=legacy-fixture]').click()");
  await waitFor("!!document.querySelector('.image-field button')");
  await evaluate("document.querySelector('.image-field button').click()");
  await waitFor("document.querySelector('.tabs button.active')?.textContent === 'library'");
  await evaluate("[...document.querySelectorAll('.tabs button')].find(b => b.textContent === 'picsum').click()");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.search-row button')).backgroundColor"), "rgb(0, 90, 163)");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.search-row button')).color"), "rgb(255, 255, 255)");
  assert.equal(await evaluate("!!document.querySelector('.tabs [data-source=pexels]')"), false, 'Unconfigured stock providers are hidden');
  await evaluate("document.querySelector('.image-dialog .media-head .close').click()");
  await evaluate("window.stockTestMode = true; localStorage.setItem('rigelcms.keys', JSON.stringify({pexels:'test-key',pixabay:'test-key',unsplash:'test-key'}))");
  await evaluate("document.querySelector('.image-field button').click()");
  await waitFor("!!document.querySelector('.tabs [data-source=pexels]')");
  const providerTab = (source) => evaluate(`[...document.querySelectorAll('.tabs button')].find(b => b.textContent === ${JSON.stringify(source)}).click()`);
  for (const source of ["pexels", "pixabay", "unsplash"]) {
    await providerTab(source);
    await waitFor(`document.querySelector('.grid figcaption')?.textContent.includes(${JSON.stringify(source === "pexels" ? "Test Pexels" : source === "pixabay" ? "Test Pixabay" : "Test Unsplash")})`);
    await input('.search-row input', "empty");
    await evaluate("document.querySelector('.search-row button').click()");
    await waitFor("document.querySelector('[aria-label=\"Choose image\"] [role=status]')?.textContent.includes('No photos')");
    await input('.search-row input', "error");
    await evaluate("document.querySelector('.search-row button').click()");
    await waitFor("document.querySelector('[role=alert]')?.textContent.includes('429')");
    await input('.search-row input', "stars");
    await evaluate("document.querySelector('.search-row button').click()");
    await waitFor("!!document.querySelector('.grid .thumb')");
    await evaluate("document.querySelector('.grid .thumb').click()");
    await evaluate("document.querySelector('.media-selection button.primary').click()");
    await waitFor("!document.querySelector('[aria-label=\"Choose image\"]')");
    await evaluate("document.querySelector('.save-button').click()");
    await waitFor("!!window.stockSaved");
    const chosen = await evaluate("window.stockSaved.values.test.testImage");
    assert.equal(chosen, source === "unsplash" ? "https://images.unsplash.com/test-photo" : `/rigel-media/${source === "pexels" ? "00000000-0000-4000-8000-000000000001" : "00000000-0000-4000-8000-000000000002"}.png`);
    assert.equal(await evaluate(source === "unsplash" ? "window.stockTracked" : "window.stockUploaded"), true);
    await evaluate("window.stockSaved = null; document.querySelector('.image-field button').click()");
    await waitFor("!!document.querySelector('.tabs')");
  }
  await providerTab("unsplash");
  await input('.search-row input', "slow");
  await evaluate("document.querySelector('.search-row button').click()");
  await providerTab("picsum");
  await waitFor("document.querySelector('.grid figcaption')?.textContent.includes('Lorem Picsum')");
  await evaluate("new Promise(resolve => setTimeout(resolve, 350))");
  assert.equal(await evaluate("document.querySelector('.grid figcaption').textContent.includes('Lorem Picsum')"), true);
  await cdp("Page.reload");
  await waitFor("window.settingsTestMarker === undefined && !!document.querySelector('.user-btn')");
  assert.equal(await evaluate("document.querySelector('.uname').textContent"), "Local user");
  assert.equal(await evaluate("document.documentElement.dataset.theme"), "light");
  await evaluate("document.querySelector('.user-btn').click()");
  await waitFor("!!document.querySelector('.user-menu')");
  await evaluate("[...document.querySelectorAll('.user-menu button')].find(b => b.textContent.trim() === 'Settings').click()");
  await waitFor("!!document.querySelector('.settings-modal')");
  assert.equal(await evaluate("document.querySelector('input[value=light]').checked"), true);
  await evaluate("window.originalSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Quota exceeded', 'QuotaExceededError'); }");
  await evaluate("document.querySelector('input[value=dark]').click()");
  await waitFor("document.querySelector('[role=alert]')?.textContent.includes('Settings could not be saved')");
  assert.equal(await evaluate("JSON.parse(localStorage.getItem('rigelcms.settings')).theme"), "light");
  await evaluate("Storage.prototype.setItem = window.originalSetItem; document.querySelector('input[value=system]').click()");
  await stored("theme", "system");
  await waitFor("!document.querySelector('[role=alert]')");
  await evaluate("localStorage.setItem('rigel.user', 'Legacy name')");
  await evaluate("localStorage.setItem('rigelcms.settings', JSON.stringify({...JSON.parse(localStorage.getItem('rigelcms.settings')), userName: 'Obsolete name'}))");
  await evaluate("window.settingsTestMarker = 'before-reload'");
  await cdp("Page.reload");
  await waitFor("window.settingsTestMarker === undefined && !!document.querySelector('.user-btn')");
  assert.equal(await evaluate("document.querySelector('.uname').textContent"), "Local user");
  await evaluate("document.querySelector('.user-btn').click()");
  await waitFor("!!document.querySelector('.user-menu')");
  await evaluate("[...document.querySelectorAll('.user-menu button')].find(b => b.textContent.trim() === 'Settings').click()");
  await waitFor("!!document.querySelector('.settings-modal')");
  await pane("Advanced");
  assert.equal(await evaluate("[...document.querySelectorAll('.clear-data button')].find(b => b.textContent === 'Clear File Cache').disabled"), true);
  const advancedShot = await cdp("Page.captureScreenshot", { format: "png" });
  await writeFile("_temp/settings-advanced.png", Buffer.from(advancedShot.data, "base64"));
  await evaluate("localStorage.setItem('site.preferences', 'untouched'); window.settingsTestMarker = 'erase-cancelled'");
  const eraseButton = "[...document.querySelectorAll('.clear-data button')].find(b => b.textContent === 'Erase All Data')";
  await evaluate(`${eraseButton}.click()`);
  await waitFor("!!document.querySelector('.action-dialog[open]')");
  await evaluate("document.querySelector('.action-dialog [aria-label=Cancel]').click()");
  assert.equal(await evaluate("window.settingsTestMarker"), "erase-cancelled");
  assert.equal(await evaluate("JSON.parse(localStorage.getItem('rigelcms.settings')).apiKeys.pexels"), "test-key");
  assert.equal(await evaluate("localStorage.getItem('rigelcms.keys')"), null);
  await evaluate("window.originalRemoveItem = Storage.prototype.removeItem; Storage.prototype.removeItem = () => { throw new Error('Storage blocked'); }");
  await evaluate(`${eraseButton}.click()`);
  await waitFor("!!document.querySelector('.action-dialog[open]')");
  await evaluate("document.querySelector('.action-dialog [type=submit]').click()");
  await waitFor("document.querySelector('.action-dialog [role=alert]')?.textContent.includes('Storage blocked')");
  assert.equal(await evaluate("window.settingsTestMarker"), "erase-cancelled");
  await evaluate("Storage.prototype.removeItem = window.originalRemoveItem");
  await evaluate("document.querySelector('.action-dialog [aria-label=Cancel]').click()");
  await evaluate("document.querySelector('#nav-pages').click()");
  await waitFor("!!document.querySelector('.table-link')");
  await evaluate("document.querySelector('.table-link').click()");
  await openProperties({ evaluate, waitFor });
  await evaluate("document.querySelector('#properties-tab-page').click()");
  await waitFor("!!document.querySelector('main input[type=text]')");
  await waitFor("document.querySelector('.canvas-stage')?.dataset.ready === 'true'");
  await evaluate(`(() => {
    window.stockTestMode = true;
    sessionStorage.setItem('test.contentWrites', '0');
    const input = document.querySelector('main input[type=text]');
    input.value = 'unsaved test draft';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await waitFor("!document.querySelector('.save-button').disabled");
  await evaluate(`${eraseButton}.click()`);
  await waitFor("!!document.querySelector('.action-dialog[open]')");
  await evaluate("document.querySelector('.action-dialog [type=submit]').click()");
  await waitFor("window.settingsTestMarker === undefined && !!document.querySelector('.user-btn')");
  assert.equal(await evaluate("localStorage.getItem('rigelcms.keys')"), null);
  assert.equal(await evaluate("localStorage.getItem('site.preferences')"), "untouched");
  assert.equal(await evaluate("sessionStorage.getItem('test.contentWrites')"), "0");
  await waitFor("!!document.querySelector('#nav-pages')");
  await evaluate("document.querySelector('#nav-pages').click()");
  await waitFor("!!document.querySelector('.table-link')");
  await evaluate("document.querySelector('.table-link').click()");
  await openProperties({ evaluate, waitFor });
  await evaluate("document.querySelector('#properties-tab-page').click()");
  await waitFor("!!document.querySelector('main input[type=text]')");
  assert.equal(await evaluate("document.querySelector('main input[type=text]').value.includes('unsaved test draft')"), false);
  assert.deepEqual(errors, []);
  await evaluate("document.querySelector('.user-btn').click()");
  await waitFor("!!document.querySelector('.user-menu')");
  await evaluate("[...document.querySelectorAll('.user-menu button')].find(b => b.textContent.trim() === 'Settings').click()");
  await waitFor("!!document.querySelector('.settings-modal')");
  for (const theme of ["light", "dark"]) {
    await evaluate(`document.querySelector('input[value=${theme}]').click()`);
    await stored("theme", theme);
    await evaluate("document.querySelector('input[aria-describedby=high-contrast-hint]').focus()");
    await cdp("Input.dispatchKeyEvent", { type: "keyDown", key: " ", code: "Space", windowsVirtualKeyCode: 32 });
    await cdp("Input.dispatchKeyEvent", { type: "keyUp", key: " ", code: "Space", windowsVirtualKeyCode: 32 });
    await stored("highContrast", true);
    await waitFor("document.documentElement.dataset.contrast === 'high'");
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.settings-modal')).backgroundColor"), theme === "dark" ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)");
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.settings-modal')).color"), theme === "dark" ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)");
    const shot = await cdp("Page.captureScreenshot", { format: "png" });
    await writeFile(`_temp/high-contrast-${theme}.png`, Buffer.from(shot.data, "base64"));
    await evaluate("document.querySelector('input[aria-describedby=high-contrast-hint]').click()");
    await stored("highContrast", false);
    await waitFor("document.documentElement.dataset.contrast === 'normal'");
    await checkColors(theme);
  }
  await evaluate("document.querySelector('input[aria-describedby=high-contrast-hint]').click(); window.settingsTestMarker = 'contrast-reload'");
  await stored("highContrast", true);
  await cdp("Page.reload");
  await waitFor("window.settingsTestMarker === undefined && document.documentElement.dataset.contrast === 'high' && !!document.querySelector('.user-btn')");
  assert.equal(await evaluate("JSON.parse(localStorage.getItem('rigelcms.settings')).highContrast"), true);
  await (await import("./collection-visual.mjs")).checkCollectionVisual({ cdp, evaluate, waitFor });
  await (await import("./authors.mjs")).checkAuthors({ cdp, evaluate, waitFor });
  await (await import("./seo.mjs")).checkSeo({ cdp, evaluate, waitFor });
  await (await import("./selects.mjs")).checkSelects({ cdp, evaluate, waitFor });
  await (await import("./inline-articles.mjs")).checkInlineArticles({ cdp, evaluate, waitFor });
  await (await import("./inline-articles.mjs")).checkInlineArticles({ cdp, evaluate, waitFor, collection: "blog", slug: "first-post" });
  assert.deepEqual(errors, []);
  console.log("PASS: high contrast light/dark, immediate persistence, normal palette restoration and reload");
  console.log("PASS: light/dark palette, system theme, native accents, control/separator borders, primary buttons and focus ring; instant settings, media sections, key reveal/clearing, preferences/reload, storage errors; mocked stock-provider browse/search/pick, imports/tracking and stale-result protection");
  }
} finally {
  socket?.close();
  if (chrome.pid && chrome.exitCode === null && chrome.signalCode === null) {
    const exited = once(chrome, "exit");
    chrome.kill("SIGKILL");
    await exited;
  }
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
