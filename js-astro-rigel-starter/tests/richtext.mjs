import "./local-only.mjs";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";

const url = process.env.RIGEL_URL || "http://localhost:4321/rigel/";
const slug = `richtext-check-${process.pid}`;
const copyFile = `src/content/copy/${slug}.ts`;
const originalBody = '# Visual heading\n\nOriginal **bold** and *italic*.\n\n- First\n- Second\n';
const originalCopy = `import { defineCopy } from "@rigel-cms/rigel/content";\nexport default defineCopy({slug: "${slug}", label: "${slug}", groups: [{id: "content", label: "Content", fields: [{key: "rich", label: "Rich copy", type: "markdown"}, {key: "items", label: "Items", type: "list", item: {fields: [{key: "rich", label: "Nested copy", type: "markdown"}]}}]}], values: {content: {rich: ${JSON.stringify(originalBody)}, items: [{rich: "*Nested*"}]}\n  },\n});`;
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
      const timeout = setTimeout(() => { pending.delete(requestId); reject(new Error(`CDP timed out: ${method} ${JSON.stringify(params)}`)); }, 30000);
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
      if (args[0] !== '/rigel/manifest.json') return response;
      const manifest = await response.json();
      manifest.collections.find(c => c.name === 'blog').fields.push({key: 'summary', label: 'Rich summary', type: 'markdown'});
      return Response.json(manifest);
    };
  ` });
  for (let i = 0; i < 100; i++) {
    const manifest = await (await fetch(new URL('/rigel/manifest.json', url), { signal: AbortSignal.timeout(15000) })).json();
    if (manifest.pages.some(p => p.slug === slug)) break;
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
    for (let attempt = 0; attempt < 100; attempt++) {
      const clicked = await evaluate(`(() => { const button = [...document.querySelectorAll('.table-link')].find(b => b.textContent.trim() === ${JSON.stringify(slug)}); if (!button) return false; button.click(); return true; })()`);
      if (clicked) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error('Could not open ' + slug);
  };
  const choice = async text => {
    for (let attempt = 0; attempt < 100; attempt++) {
      const clicked = await evaluate(`(() => { const button = [...document.querySelectorAll('.unsaved-dialog button')].find(b => b.textContent.trim() === ${JSON.stringify(text)}); if (!button) return false; button.click(); return true; })()`);
      if (clicked) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error('Could not choose ' + text);
  };
  const savedFile = async (file, text) => {
    for (let i = 0; i < 100; i++) { if ((await readFile(file, 'utf8')).includes(text)) return; await new Promise(r => setTimeout(r, 100)); }
    assert.fail(`Save did not persist ${text}`);
  };
  await new Promise(r => setTimeout(r, 750));
  await cdp('Page.navigate', {url});
  await waitFor("!!document.querySelector('.user-btn')");
  await open('#nav-pages');
  await waitFor(`!!document.querySelector(${JSON.stringify(editor('Rich copy'))})`);
  assert.equal(await evaluate(`${root('Rich copy')}.querySelector('button[aria-pressed=true]').textContent.trim()`), 'Visual');
  assert.equal(await evaluate(`${root('Rich copy')}.querySelector('h1').textContent`), 'Visual heading');
  for (let i = 0; i < 2; i++) { await button('Rich copy', 'Markdown'); assert.equal(await source('Rich copy'), originalBody); await button('Rich copy', 'Visual'); }
  assert.equal(await evaluate("document.querySelector('.save-button').disabled"), true);
  await type('Rich copy', 'Hello visual');
  await format('Rich copy', 'paragraph');
  await selectText('Rich copy');
  await evaluate('new Promise(resolve => setTimeout(resolve, 50))');
  await evaluate(`${root('Rich copy')}.querySelector('[aria-label="Bold"]').focus()`);
  await cdp('Input.dispatchKeyEvent', {type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r', windowsVirtualKeyCode: 13});
  await cdp('Input.dispatchKeyEvent', {type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13});
  assert.equal(await evaluate(`${root('Rich copy')}.querySelector('[aria-label="Bold"]').getAttribute('aria-pressed')`), 'true');
  await button('Rich copy', 'Markdown');
  assert.equal(await source('Rich copy'), '**Hello visual**');
  await button('Rich copy', 'Visual');
  await format('Rich copy', 'h2');
  await button('Rich copy', 'Markdown');
  assert.equal(await source('Rich copy'), '## **Hello visual**');
  await button('Rich copy', 'Visual');
  await evaluate('new Promise(r => setTimeout(r, 1100))');
  assert.equal(await readFile(copyFile, 'utf8'), originalCopy, 'No autosave');
  assert.equal(await evaluate("window.dispatchEvent(new Event('beforeunload', {cancelable: true}))"), false);
  await click('.back button');
  await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
  await choice('Keep editing');
  await evaluate('window.failSave = true');
  await click('.save-button');
  await waitFor("document.querySelector('.save-status')?.textContent.includes('Save failed') || !!document.querySelector('.save-error')");
  assert.equal(await readFile(copyFile, 'utf8'), originalCopy);
  await evaluate('window.failSave = false');
  await click('.save-button');
  await savedFile(copyFile, '## **Hello visual**');
  await cdp('Page.reload');
  await new Promise((resolve) => setTimeout(resolve, 400));
  await waitFor("!!document.querySelector('.user-btn')");
  await open('#nav-pages');
  await waitFor(`${root('Rich copy')}.querySelector('h2')?.textContent === 'Hello visual'`);
  await button('Rich copy', 'Markdown');
  const unsupported = '| A | B |\n| - | - |\n| a | b |\n\n<script>window.richXss = true</script>\n\n[ref]: https://example.com';
  await setSource('Rich copy', unsupported);
  await button('Rich copy', 'Visual');
  assert.equal(await source('Rich copy'), unsupported);
  assert.equal(await evaluate(`${root('Rich copy')}.querySelector('[role=status]').textContent.includes('nothing has been converted')`), true);
  assert.equal(await evaluate('window.richXss === undefined'), true);
  await click('.save-button');
  await savedFile(copyFile, JSON.stringify(unsupported).slice(1,-1));
  await cdp('Page.reload');
  await new Promise((resolve) => setTimeout(resolve, 400));
  await waitFor("!!document.querySelector('.user-btn')");
  await open('#nav-pages');
  await waitFor(`${root('Rich copy')}.querySelector('textarea') !== null`);
  assert.equal((await source('Rich copy')).trim(), unsupported);
  await setSource('Rich copy', 'Safe text');
  await button('Rich copy', 'Visual');
  await selectText('Rich copy');
  await button('Rich copy', 'Link');
  await evaluate(`(() => {const el = ${root('Rich copy')}.querySelector('.markdown-link input'); el.value = 'javascript:alert(1)'; el.dispatchEvent(new Event('input', {bubbles: true}));})()`);
  await button('Rich copy', 'Apply link');
  assert.equal(await evaluate(`${root('Rich copy')}.querySelector('[role=alert]') !== null`), true);
  await evaluate(`(() => {const el = ${root('Rich copy')}.querySelector('.markdown-link input'); el.value = 'https://example.com'; el.dispatchEvent(new Event('input', {bubbles: true}));})()`);
  await button('Rich copy', 'Apply link');
  assert.equal(await evaluate(`${root('Rich copy')}.querySelector('.ProseMirror a')?.textContent`), 'Safe text');
  await button('Rich copy', 'Bullet list');
  assert.equal(await evaluate(`${root('Rich copy')}.querySelector('[aria-label="Bullet list"]').getAttribute('aria-pressed')`), 'true');
  await button('Rich copy', 'Bullet list');
  await button('Rich copy', 'Numbered list');
  assert.equal(await evaluate(`${root('Rich copy')}.querySelector('.ProseMirror ol li')?.textContent`), 'Safe text');
  await button('Rich copy', 'Numbered list');
  await format('Rich copy', 'code_block');
  assert.equal(await evaluate(`${root('Rich copy')}.querySelector('[aria-label="Bold"]').disabled`), true);
  await format('Rich copy', 'paragraph');
  await evaluate(`(() => {const data = new DataTransfer(); data.setData('text/plain', '<img src=x onerror=alert(1)>'); data.setData('text/html', '<img src=x onerror=alert(1)>'); document.querySelector(${JSON.stringify(editor('Rich copy'))}).dispatchEvent(new ClipboardEvent('paste', {clipboardData: data, bubbles: true, cancelable: true}));})()`);
  assert.equal(await evaluate(`${root('Rich copy')}.querySelector('.ProseMirror img') === null`), true);
  await click('#nav-pages');
  await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
  await choice('Discard changes');
  await open('#nav-pages');
  await waitFor(`!!document.querySelector(${JSON.stringify(editor('Nested copy'))})`);
  if (await evaluate(`${root('Rich copy')}.querySelector('textarea') !== null`)) { await setSource('Rich copy', 'Safe copy'); await button('Rich copy', 'Visual'); }
  const beforeNested = await readFile(copyFile, 'utf8');
  await type('Rich copy', 'Copy edited');
  await type('Nested copy', 'Nested edited');
  assert.equal(await readFile(copyFile, 'utf8'), beforeNested);
  await click('.back button');
  await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
  await choice('Save and leave');
  await savedFile(copyFile, 'Nested edited');
  await savedFile(copyFile, 'Copy edited');
  await cdp('Page.reload');
  await new Promise((resolve) => setTimeout(resolve, 400));
  await waitFor("!!document.querySelector('.user-btn')");
  await open('#nav-pages');
  await waitFor(`document.querySelector(${JSON.stringify(editor('Nested copy'))})?.textContent === 'Nested edited'`);
  assert.equal(await evaluate(` [...${root('Rich copy')}.querySelectorAll('.formatting-toolbar button:not([role=combobox])')].every(b => b.dataset.tooltip && b.getAttribute('aria-label') && b.querySelector('svg') && !b.textContent.trim())`), true);
  assert.ok(await evaluate(`${root('Rich copy')}.querySelector('.formatting-toolbar').getBoundingClientRect().height <= 90`));
  await cdp('Emulation.setDeviceMetricsOverride', {width: 390, height: 844, deviceScaleFactor: 1, mobile: false});
  assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true);
  assert.equal(await evaluate(` [...${root('Rich copy')}.querySelectorAll('.formatting-toolbar button, .formatting-toolbar select:not([hidden])')].every(b => { const r = b.getBoundingClientRect(); const p = b.closest('.markdown-editor').getBoundingClientRect(); return r.left >= p.left && r.right <= p.right; })`), true);
  await cdp('Emulation.clearDeviceMetricsOverride');
  const shot = await cdp('Page.captureScreenshot', {format: 'png'});
  await writeFile('_temp/richtext.png', Buffer.from(shot.data, 'base64'));
  assert.deepEqual(errors, []);
  console.log('PASS: Markdown copy fields retained; compact icon toolbar, keyboard selection/pressed state, headings, list toggles, safe link, disabled code-block marks, source round-trip, explicit Save/reload, no autosave, unsaved guards, failed-save retention, unsupported Markdown, URL/HTML boundaries, nested fields, narrow toolbar fit');
} finally {
  socket?.close();
  if (chrome.exitCode === null && chrome.signalCode === null) {
    const exited = once(chrome, "exit");
    chrome.kill('SIGKILL');
    await exited;
  }
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  await rm(copyFile, {force: true});
}
