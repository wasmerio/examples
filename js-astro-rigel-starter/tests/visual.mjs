import "./local-only.mjs";
import { checkLiveStructure } from './live-structure.mjs';
import { openProperties, chooseSelect } from './editor-controls.mjs';
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";

const url = process.env.RIGEL_URL || "http://127.0.0.1:4321/rigel/";
const homeFile = "src/content/pages/home.json";
const logosFile = "src/content/shared/logos/brands.json";
const createdFile = "src/content/pages/studio-notes.json";
await assert.rejects(access(createdFile), { code: "ENOENT" }, "Refusing to overwrite an existing Studio Notes page");
const originals = await Promise.all([readFile(homeFile, "utf8"), readFile(logosFile, "utf8")]);
const pageChecks = [
  ['about', 'About'], ['contact', 'Contact'], ['services', 'Services'],
  ['blog', 'Blog'], ['news', 'News'], ['getting-started', 'About this demo'],
];
const pageOriginals = new Map(await Promise.all(pageChecks.map(async ([slug]) => [slug, await readFile(`src/content/pages/${slug}.json`, 'utf8')])));
await mkdir("_temp", { recursive: true });
const profile = await mkdtemp(`${process.cwd()}/_temp/visual-browser-`);
const chrome = spawn(process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", "--no-first-run", "--no-default-browser-check", "--window-size=1440,960",
  "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });
let socket;
try {
  const endpoint = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Chrome did not start")), 10000);
    chrome.once("error", reject);
    chrome.stderr.on("data", (chunk) => {
      const match = String(chunk).match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
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
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const requestId = ++id;
    const timer = setTimeout(() => { pending.delete(requestId); reject(new Error(`${method} timed out`)); }, 20000);
    pending.set(requestId, { resolve: (value) => { clearTimeout(timer); resolve(value); }, reject: (error) => { clearTimeout(timer); reject(error); } });
    socket.send(JSON.stringify({ id: requestId, method, params, sessionId }));
  });
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const cdp = (method, params) => send(method, params, sessionId);
  const errors = [];
  const writes = [];
  let requests = 0;
  socket.addEventListener("message", ({ data }) => {
    const event = JSON.parse(data);
    if (event.method === "Runtime.exceptionThrown") errors.push(event.params.exceptionDetails.exception?.description ?? event.params.exceptionDetails.text);
    if (event.method === "Runtime.consoleAPICalled" && event.params.type === "error") errors.push(event.params.args.map((arg) => arg.value ?? arg.description).join(" "));
    if (event.method === "Network.requestWillBeSent") {
      requests++;
      if (!["GET", "HEAD", "OPTIONS"].includes(event.params.request.method)) writes.push(`${event.params.request.method} ${event.params.request.url}`);
    }
  });
  await cdp("Runtime.enable");
  await cdp("Page.enable");
  await cdp("Page.addScriptToEvaluateOnNewDocument", { source: "if (!localStorage.getItem('rigelcms.settings')) localStorage.setItem('rigelcms.settings', JSON.stringify({ userPref: { editorExperience: 'sidebar' } }));" });
  await cdp("Network.enable");
  const evaluate = async (expression) => {
    const result = await cdp("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const waitFor = async (expression, label = expression) => {
    for (let attempt = 0; attempt < 120; attempt++) {
      if (await evaluate(expression)) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error(`Timed out: ${label}\n${JSON.stringify(errors)}\n${await evaluate('document.body.innerText.slice(0, 2000)')}`);
  };
  const waitFile = async (file, needle, label = file) => {
    for (let attempt = 0; attempt < 120; attempt++) {
      try {
        if ((await readFile(file, "utf8")).includes(needle)) return;
      } catch {
        // file has not been written yet
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error(`Timed out waiting for ${label}`);
  };
  const reloadEditor = async () => {
    await evaluate("window.visualBeforeReload = true");
    await cdp("Page.navigate", { url });
    await waitFor("!window.visualBeforeReload && !!document.querySelector('[data-doctype=author]')", "editor reload");
  };
  const click = (selector) => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const frame = "document.querySelector('.visual-editor iframe')";
  const panelField = "document.querySelector('.schema-panel .section-properties input[type=text]')";
  const inputValue = (selector, text) => evaluate(`(() => { const el = ${selector}; el.value = ${JSON.stringify(text)}; el.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  const openPage = async (title) => {
    await click("#nav-pages");
    await waitFor(`[...document.querySelectorAll('.table-link')].some(button => button.textContent.trim() === ${JSON.stringify(title)})`, `page row ${title}`);
    await evaluate(`[...document.querySelectorAll('.table-link')].find(button => button.textContent.trim() === ${JSON.stringify(title)}).click()`);
    await waitFor(`document.querySelector('.canvas-stage')?.dataset.ready === 'true' && !!${frame}?.contentDocument?.querySelector('[data-rigel-doc]')`, "visual canvas");
  };

  await cdp("Page.navigate", { url });
  await waitFor("!!document.querySelector('#nav-pages')", "editor shell");
  await waitFor("!!document.querySelector('[data-doctype=author]')", "manifest navigation");
  assert.equal(await evaluate("document.querySelectorAll('.rail-scroll .count, #nav-all').length"), 0);
  assert.deepEqual(await evaluate("[...document.querySelectorAll('.rail-scroll > button')].map(b => b.textContent.trim().replace(/\\s+/g, ' '))"), [
    "Pages", "Blog", "News", "Authors", "Logo sets", "Callouts", "Menus", "Media", "Site settings", "Demo",
  ]);

  await checkLiveStructure({ cdp, evaluate, waitFor, url });
  await (await import('./section-defaults.mjs')).checkSectionDefaults({ cdp, evaluate, waitFor });
  const starterWrites = writes.filter(entry => entry.startsWith("PUT ") && entry.includes("/rigel/api/local/documents/")).length;

  for (const [slug, title] of pageChecks) {
    await openPage(title);
    await waitFor(`!!${frame}?.contentDocument?.querySelector('h1[data-rigel-text]')`, `${slug}: editable heading`);
    await evaluate(`${frame}.contentDocument.querySelector('h1[data-rigel-text]').click()`);
    await waitFor("document.activeElement?.matches('.schema-panel input[type=text]')", `${slug}: clicked heading control`);
    const marker = `Saved visual heading ${slug}`;
    const before = requests;
    await inputValue('document.activeElement', marker);
    await waitFor(`${frame}.contentDocument.querySelector('h1').textContent === ${JSON.stringify(marker)}`, `${slug}: unsaved canvas patch`);
    assert.equal(requests, before, `${slug}: heading patches without network`);
    const file = `src/content/pages/${slug}.json`;
    assert.equal(await readFile(file, 'utf8'), pageOriginals.get(slug), `${slug}: no autosave`);
    await click('.save-button');
    await waitFile(file, marker, `${slug}: explicit Save`);
    await waitFor(`fetch('/${slug}/').then(response => response.text()).then(html => html.includes(${JSON.stringify(marker)}))`, `${slug}: real public page updates`);
    await writeFile(file, pageOriginals.get(slug));
    await reloadEditor();
  }

  await openPage("About this demo");
  const validationFile = 'src/content/pages/getting-started.json';
  const validationOriginal = await readFile(validationFile, 'utf8');
  for (const heading of ['Valid sibling heading', '']) {
    await openProperties({ evaluate, waitFor });
    await chooseSelect({ evaluate, waitFor }, '.add-section [role=combobox]', 'Text block');
    await click('.add-section button.outlined');
    await evaluate("[...document.querySelectorAll('.structure-row')].at(-1).click()");
    await waitFor("!!document.querySelector('.section-properties input[type=text]')");
    await inputValue(panelField, heading);
  }
  await click('.save-button');
  await waitFor("document.querySelector('.save-toast p')?.textContent === 'getting-started.sections[2].heading: required'", 'real required-field save error');
  assert.equal(await readFile(validationFile, 'utf8'), validationOriginal, 'Rejected validation must not write content');
  assert.equal(await evaluate("(() => { const toast = document.querySelector('.save-toast'), rect = toast.getBoundingClientRect(); return getComputedStyle(toast).position === 'fixed' && rect.top === 16 && Math.abs(rect.left + rect.width / 2 - innerWidth / 2) < 1; })()"), true, 'Save error is top-center in the viewport');
  await writeFile('_temp/save-error.png', Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
  await new Promise(resolve => setTimeout(resolve, 6000));
  assert.equal(await evaluate("!!document.querySelector('.save-toast')"), true, 'Error toast does not expire');
  await inputValue(panelField, 'Fixed required heading');
  assert.equal(await evaluate("!!document.querySelector('.save-toast')"), true, 'Editing does not silently dismiss the error');
  await click('[aria-label="Dismiss save error"]');
  assert.equal(await evaluate("!!document.querySelector('.save-toast')"), false);
  assert.equal(await readFile(validationFile, 'utf8'), validationOriginal, 'Dismiss does not save or discard the draft');
  await inputValue(panelField, '');
  await click('.save-button');
  await waitFor("!!document.querySelector('.save-toast')", 'Repeated failures show the toast again');
  await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
  assert.equal(await evaluate("(() => { const rect = document.querySelector('.save-toast').getBoundingClientRect(); return rect.left >= 16 && rect.right <= innerWidth - 16 && rect.bottom < innerHeight; })()"), true, 'Error toast fits mobile');
  await cdp('Emulation.clearDeviceMetricsOverride');
  await inputValue(panelField, 'Fixed required heading');
  await click('.save-toast .outlined');
  await waitFor("!document.querySelector('.save-toast') && document.querySelector('.save-status')?.textContent === 'Saved'", 'Successful Retry saves and clears the error');
  assert.equal(JSON.parse(await readFile(validationFile, 'utf8')).sections[2].heading, 'Fixed required heading');
  await writeFile(validationFile, validationOriginal);
  await reloadEditor();

  await openPage("Home");
  assert.equal(await evaluate(`new URL(${frame}.src).pathname`), "/");
  assert.equal(await evaluate("document.querySelector('.visual-toolbar .visual-live.icon-btn')?.getAttribute('href')"), '/');
  await (await import('./properties-resize.mjs')).checkPropertiesResize({ cdp, evaluate, waitFor });
  assert.equal(await evaluate(`${frame}.getAttribute('sandbox')`), "allow-same-origin");
  assert.equal(await evaluate(`${frame}.contentDocument.querySelector('h1').textContent`), "A brighter perspective.");
  assert.equal(await evaluate(`${frame}.contentDocument.querySelectorAll('[data-rigel-section]').length`), 7);
  await (await import('./section-reorder.mjs')).checkSectionReorder({ cdp, evaluate, waitFor, writes });

  const logoHeading = '[data-rigel-text="sections.khomelogos.heading"]';
  const originalLogoHeading = JSON.parse(originals[0]).sections.find(section => section._key === 'khomelogos').heading;
  await evaluate(`${frame}.contentDocument.querySelector('img[data-rigel-doc="logoSet:brands"]').click()`);
  await waitFor("document.querySelector('.schema-panel .selected-path')?.textContent === 'Logo strip'", "logo image selects containing strip");
  assert.equal(await evaluate("document.querySelector('.schema-panel .section-properties select')?.value"), 'logoSet:brands');
  assert.equal(await evaluate(`${panelField}.value`), originalLogoHeading);
  await evaluate(`${frame}.contentDocument.querySelector(${JSON.stringify(logoHeading)}).click()`);
  await waitFor("document.querySelector('.schema-panel .selected-path')?.textContent === 'Heading · Logo strip'", "combined strip properties");
  assert.equal(await evaluate("document.querySelector('.schema-panel .section-properties select')?.value"), 'logoSet:brands', "Heading selection keeps logo-set selector visible");
  await inputValue(panelField, 'Only this page has this heading');
  await waitFor(`${frame}.contentDocument.querySelector(${JSON.stringify(logoHeading)}).textContent === 'Only this page has this heading'`, "local logo heading preview");
  assert.equal(await readFile(homeFile, 'utf8'), originals[0], "Heading stays unsaved");
  assert.equal(await readFile(logosFile, 'utf8'), originals[1], "Heading never changes shared logos");
  assert.equal((await (await fetch(new URL('/about/', url))).text()).includes('Only this page has this heading'), false, "Other page heading is independent");
  await evaluate("[...document.querySelectorAll('.schema-panel button')].find(button => button.textContent.includes('Edit logo set')).click()");
  await waitFor("!!document.querySelector('.unsaved-dialog[open]')", "edit shared logo set protects page draft");
  await evaluate("[...document.querySelectorAll('.unsaved-dialog button')].find(button => button.textContent.trim() === 'Keep editing').click()");
  await waitFor("!document.querySelector('.unsaved-dialog[open]')", "keep page draft");
  assert.equal(await evaluate(`${panelField}.value`), 'Only this page has this heading');
  await inputValue(panelField, originalLogoHeading);
  await evaluate("[...document.querySelectorAll('.schema-panel button')].find(button => button.textContent.includes('Edit logo set')).click()");
  await waitFor("document.querySelector('.titlebar h2')?.textContent === 'Demo brands'", "edit button opens referenced logo set");
  await waitFor("document.querySelector('.schema-panel .shared-badge')?.textContent.includes('Shared content')", "shared editing warning");
  await openPage("Home");

  await evaluate(`${frame}.contentDocument.querySelector('[data-rigel-text="sections.khomehero.title"]').click()`);
  await waitFor("document.querySelector('.schema-panel .selected-path')?.textContent.includes('Headline')", "selected headline");
  assert.equal(await evaluate(`${panelField}.value`), "A brighter perspective.");
  assert.equal(await evaluate("document.activeElement === " + panelField), true, "Panel field receives focus after canvas click");
  await click(".mode-toggle button");
  assert.equal(await evaluate("document.querySelector('.mode-toggle button').getAttribute('aria-pressed')"), "true");
  assert.equal(await evaluate("!!document.querySelector('.schema-panel .selected-path')"), false, "Browse mode clears the edit selection");
  await evaluate("[...document.querySelectorAll('.mode-toggle button')][1].click()");
  assert.equal(await evaluate("[...document.querySelectorAll('.mode-toggle button')][1].getAttribute('aria-pressed')"), "true");
  await evaluate(`${frame}.contentDocument.querySelector('[data-rigel-text="sections.khomehero.title"]').click()`);
  await waitFor("document.querySelector('.schema-panel .selected-path')?.textContent.includes('Headline')", "headline after browse mode");

  const beforeRequests = requests;
  await inputValue(panelField, "UNSAVED VISUAL HEADLINE");
  await waitFor(`${frame}.contentDocument.querySelector('h1').textContent === 'UNSAVED VISUAL HEADLINE'`, "live text patch");
  assert.equal(requests, beforeRequests, "Text edits do not fetch or reload the page");
  assert.equal(await evaluate(`${frame}.contentDocument.querySelector('img[data-rigel-doc="logoSet:brands"]')?.getAttribute('src')`), "/demo/solara.svg", "Shared logo anchors stay intact while editing a page");
  assert.equal(await evaluate(`${frame}.contentDocument.querySelector('h2[data-rigel-doc="callout:studio"]')?.textContent.includes('Make room for')`), true, "Shared callout anchors stay intact");
  assert.equal((await readFile(homeFile, "utf8")), originals[0]);
  assert.equal((await (await fetch(new URL("/", url))).text()).includes("UNSAVED VISUAL HEADLINE"), false);

  await evaluate(`${frame}.contentDocument.querySelector('[data-rigel-text="sections.khomeintro.heading"]').click()`);
  await waitFor("document.querySelector('.schema-panel .selected-path')?.textContent.includes('Heading')", "intro heading");
  await evaluate(`${frame}.contentDocument.querySelector('[data-rigel-text="sections.khomeintro.heading"]').dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true }))`);
  await waitFor("!!document.querySelector('.inline-editor')", "inline editor");
  await inputValue("document.querySelector('.inline-editor')", "INLINE HEADLINE");
  await waitFor(`${frame}.contentDocument.querySelector('[data-rigel-text="sections.khomeintro.heading"]').textContent.includes('INLINE HEADLINE')`, "inline patch");
  await cdp("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await cdp("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await waitFor("!document.querySelector('.inline-editor')", "inline editor closes");

  assert.deepEqual(await evaluate(`[...${frame}.contentDocument.querySelectorAll('[data-rigel-doc="page:home"][data-rigel-section]')].map(el => el.getAttribute('data-rigel-key'))`), [
    "khomehero", "khomeintro", "khomelogos", "khomework", "khomeservices", "khomejournal", "khomecta",
  ]);
  await evaluate("document.querySelector('.section-drag[aria-label=\"Reorder Text block\"]').focus()");
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowUp', code: 'ArrowUp', windowsVirtualKeyCode: 38 });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowUp', code: 'ArrowUp' });
  await waitFor(`${frame}.contentDocument.querySelector('[data-rigel-each="sections"]').children[0].getAttribute('data-rigel-key') === 'khomeintro'`, "reorder applies to the real page");
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowDown', code: 'ArrowDown' });
  await waitFor(`${frame}.contentDocument.querySelector('[data-rigel-each="sections"]').children[0].getAttribute('data-rigel-key') === 'khomehero'`, "reorder restores");

  await openProperties({ evaluate, waitFor });
  await chooseSelect({ evaluate, waitFor }, '.add-section [role=combobox]', 'Story');
  await click(".add-section button.outlined");
  await waitFor(`${frame}.contentDocument.querySelectorAll('[data-rigel-section="story"]').length === 1`, "new section renders before Save");
  await evaluate("[...document.querySelectorAll('.structure-actions [aria-label^=\"Remove Story\"]')].at(-1).click()");
  await waitFor("!document.querySelector('.schema-panel .panel-note[role=status]')", "pending notice clears");

  await click("#nav-pages");
  await waitFor("!!document.querySelector('.unsaved-dialog[open]')", "Pages uses unsaved guard");
  await cdp("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await cdp("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await waitFor("!document.querySelector('.unsaved-dialog[open]')", "Escape keeps editing");
  assert.equal(await evaluate("document.querySelector('.titlebar h2').textContent"), "Home");
  assert.equal(await evaluate(`${frame}.contentDocument.querySelector('[data-rigel-text="sections.khomeintro.heading"]').textContent`), "INLINE HEADLINE");
  await click("[data-collection=blog]");
  await waitFor("!!document.querySelector('.unsaved-dialog[open]')", "unsaved guard again");
  await evaluate("[...document.querySelectorAll('.unsaved-dialog button')].find(b => b.textContent.trim() === 'Discard changes').click()");
  await waitFor("document.querySelector('.titlebar h2')?.textContent === 'All Blogs'", "discard then navigate");
  assert.equal(await evaluate(`${frame}`), null);

  await openPage("Home");
  const marker = "Visual Save regression headline";
  await evaluate(`${frame}.contentDocument.querySelector('[data-rigel-text="sections.khomehero.title"]').click()`);
  await waitFor("document.querySelector('.schema-panel .selected-path')?.textContent.includes('Headline')", "headline selected again");
  await inputValue(panelField, marker);
  await waitFor(`${frame}.contentDocument.querySelector('h1').textContent === ${JSON.stringify(marker)}`, "live patch before save");
  await waitFor("!document.querySelector('.save-button').disabled", "save enabled");
  await click(".save-button");
  await waitFile(homeFile, marker, "saved page file");
  await waitFor(`fetch('/').then(r => r.text()).then(html => html.includes(${JSON.stringify(marker)}))`, "saved page HTML");
  assert.equal(JSON.parse(await readFile(homeFile, "utf8")).sections[0].title, marker);
  await reloadEditor();

  await openPage("Home");
  await openProperties({ evaluate, waitFor });
  await chooseSelect({ evaluate, waitFor }, '.add-section [role=combobox]', 'Text block');
  await click(".add-section button.outlined");
  await waitFor(`${frame}.contentDocument.querySelectorAll('[data-rigel-section="textBlock"]').length === 2`, "new section visible before Save");
  await evaluate("[...document.querySelectorAll('.structure-row')].at(-1).click()");
  await waitFor("[...document.querySelectorAll('.structure-list li')].at(-1).classList.contains('active')", "new section selected");
  await inputValue("document.querySelector('.schema-panel .section-properties input[type=text]')", "Saved section");
  await waitFor("!document.querySelector('.save-button').disabled", "save new section enabled");
  await click(".save-button");
  await waitFile(homeFile, "Saved section", "saved new section");
  await waitFor(`${frame}.contentDocument.body.textContent.includes('Saved section')`, "saved section renders in the canvas");
  await waitFor("!document.querySelector('.schema-panel .panel-note[role=status]')", "pending notice clears after save");
  assert.equal(await evaluate(`${frame}.contentDocument.querySelectorAll('[data-rigel-doc="page:home"][data-rigel-section]').length`), 8);

  await click("[data-doctype=logoSet]");
  await waitFor("[...document.querySelectorAll('.table-link')].some(b => b.textContent.trim() === 'Demo brands')", "logo set list");
  await evaluate("[...document.querySelectorAll('.table-link')].find(b => b.textContent.trim() === 'Demo brands').click()");
  await waitFor("!!document.querySelector('.document-form .schema-array')", "shared logo form");
  assert.equal(await evaluate("!!document.querySelector('.visual-editor, .visual-toolbar, main iframe')"), false, 'Logo sets do not preview a website page');
  await waitFor("document.querySelector('.schema-panel .shared-badge')?.textContent.includes('Shared content')", "shared badge");
  const altitude = "Solara, shared logo regression";
  await evaluate(`(() => {
    const label = [...document.querySelectorAll('.schema-panel .schema-item label')].find(item => item.textContent.includes('Alt text'));
    const input = label.querySelector('input');
    input.value = ${JSON.stringify(altitude)};
    input.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  assert.equal(await readFile(logosFile, 'utf8'), originals[1], 'Logo edits remain drafts before Save');
  const logoCount = await evaluate("document.querySelectorAll('.document-form .schema-item').length");
  await evaluate("[...document.querySelectorAll('.document-form button')].find(button => button.textContent.trim() === 'Add item').click()");
  await waitFor(`document.querySelectorAll('.document-form .schema-item').length === ${logoCount + 1}`, 'Add a reusable logo item without a page preview');
  await click(`[aria-label="Remove Logos item ${logoCount + 1}"]`);
  await waitFor(`document.querySelectorAll('.document-form .schema-item').length === ${logoCount}`);
  await writeFile('_temp/logo-set-form.png', Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
  await waitFor("!document.querySelector('.save-button').disabled", "shared save enabled");
  await click(".save-button");
  await waitFile(logosFile, altitude, "saved shared logo file");
  assert.equal(JSON.parse(await readFile(logosFile, "utf8")).logos[0].alt, altitude);
  for (const route of ["/", "/about/"]) {
    await waitFor(`fetch(${JSON.stringify(route)}).then(r => r.text()).then(html => html.includes(${JSON.stringify(altitude)}))`, `shared logo on ${route}`);
  }
  await reloadEditor();

  await click("#nav-pages");
  await waitFor("!!document.querySelector('.titlebar .primary')", "add page button");
  await click(".titlebar .primary");
  await waitFor("!!document.querySelector('.action-dialog[open] input')", "new page dialog");
  await inputValue("document.querySelector('.action-dialog input')", "Studio Notes");
  await chooseSelect({ evaluate, waitFor }, '.action-dialog [role=combobox]', 'Core');
  await evaluate("document.querySelector('.action-dialog form').requestSubmit()");
  await waitFor("document.querySelector('.titlebar h2')?.textContent === 'Studio Notes'", "new page draft");
  await waitFor("document.querySelector('.visual-canvas .visual-error')?.textContent.includes('New page')", "new page notice");
  assert.equal(await evaluate("document.querySelector('.save-status').textContent.trim()"), "Unsaved");
  await click(".save-button");
  await waitFile(createdFile, "Studio Notes", "new page file");
  const created = JSON.parse(await readFile(createdFile, "utf8"));
  assert.equal(created._id, "page:studio-notes");
  assert.equal(created.title, "Studio Notes");
  assert.deepEqual(created.sections.map((section) => section._type), ["pageIntro", "cta"]);
  const keys = created.sections.map((section) => section._key);
  assert.equal(new Set(keys).size, keys.length);
  assert.ok(keys.every((key) => typeof key === "string" && key.length > 1));

  await reloadEditor();
  await click("#nav-pages");
  await waitFor("[...document.querySelectorAll('.table-link')].some(b => b.textContent.trim() === 'Studio Notes')", "new page listed after save");
  await cdp("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
  await evaluate("document.querySelector('#nav-pages').click()");
  await waitFor("!!document.querySelector('.table-link')");
  await evaluate("[...document.querySelectorAll('.table-link')].find(b => b.textContent.trim() === 'Home').click()");
  await waitFor("!!document.querySelector('.visual-editor iframe')");
  assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), true, "Mobile editor has no horizontal overflow");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.visual-editor')).gridTemplateColumns.split(' ').length"), 1, "Mobile panel stacks under the canvas");
  await cdp("Emulation.clearDeviceMetricsOverride");

  await evaluate("localStorage.removeItem('rigelcms.settings')");
  assert.deepEqual(errors, []);
  assert.deepEqual(writes.filter((entry) => !entry.startsWith("PUT ") && !entry.startsWith("POST ")), []);
  assert.equal(writes.filter((entry) => entry.startsWith("POST ") && entry.includes("/rigel/api/local/documents/")).length, 1);
  assert.equal(writes.filter((entry) => entry.startsWith("PUT ") && entry.includes("/rigel/api/local/documents/")).length, starterWrites + 3 + pageChecks.length + 3);
  const shot = await cdp("Page.captureScreenshot", { format: "png" });
  await writeFile("_temp/visual-editor.png", Buffer.from(shot.data, "base64"));
  console.log("PASS: schema page canvas, required-field rejection with persistent top-center error toast, dismiss/retry/mobile fit, click/inline edit without network, keyed reorder and instant new sections, unsaved guard, Save to disk and page HTML, shared logo Save across pages, template creation.");
} finally {
  for (const [slug, original] of pageOriginals) await writeFile(`src/content/pages/${slug}.json`, original);
  await writeFile(homeFile, originals[0]);
  await writeFile(logosFile, originals[1]);
  await rm(createdFile, { force: true });
  await assert.rejects(access(createdFile));
  assert.equal(await readFile(homeFile, "utf8"), originals[0]);
  assert.equal(await readFile(logosFile, "utf8"), originals[1]);
  socket?.close();
  if (chrome.exitCode === null && chrome.signalCode === null) {
    const exited = once(chrome, "exit");
    chrome.kill("SIGKILL");
    await exited;
  }
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
