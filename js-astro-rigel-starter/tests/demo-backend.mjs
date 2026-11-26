import "./local-only.mjs";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { openProperties } from "./editor-controls.mjs";

const url = process.env.RIGEL_URL || "http://localhost:4321/rigel/";
const manifest = await (await fetch(new URL("manifest.json", url))).json();
assert.equal(manifest.backend, "demo", "Start the server with RIGEL_BACKEND=demo");
const snapshot = async () => new Map(await Promise.all((await Promise.all(["src/content", "public"].map(async root => (await readdir(root, { recursive: true, withFileTypes: true })).filter(entry => entry.isFile()).map(entry => join(entry.parentPath, entry.name))))).flat().map(async file => [file, (await readFile(file)).toString("base64")])));
const originalFiles = await snapshot();
await mkdir("_temp", { recursive: true });
const profile = await mkdtemp(`${process.cwd()}/_temp/demo-backend-browser-`);
const chrome = spawn(process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", ["--headless=new", "--no-first-run", "--no-default-browser-check", "--window-size=1280,900", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"], { stdio: ["ignore", "ignore", "pipe"] });
let socket;
try {
  const endpoint = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Chrome did not start")), 10000);
    chrome.once("error", reject);
    chrome.stderr.on("data", chunk => { const match = String(chunk).match(/DevTools listening on (ws:\/\/\S+)/); if (match) { clearTimeout(timeout); resolve(match[1]); } });
  });
  socket = new WebSocket(endpoint);
  await once(socket, "open");
  let id = 0;
  const pending = new Map();
  const errors = [];
  const writes = [];
  socket.addEventListener("message", ({ data }) => {
    const result = JSON.parse(data);
    if (result.method === "Runtime.exceptionThrown") errors.push(result.params.exceptionDetails.exception?.description ?? result.params.exceptionDetails.text);
    if (result.method === "Network.requestWillBeSent") {
      const request = result.params.request;
      if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method) || new URL(request.url).hostname === "api.github.com") writes.push({ method: request.method, url: request.url });
    }
    const request = pending.get(result.id);
    if (!request) return;
    pending.delete(result.id);
    if (result.error) request.reject(new Error(result.error.message)); else request.resolve(result.result);
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { pending.set(++id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params, sessionId })); });
  let sessionId;
  const cdp = (method, params = {}) => send(method, params, sessionId);
  const evaluate = async expression => { const { result, exceptionDetails } = await cdp("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }); if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text); return result.value; };
  const waitFor = async expression => { for (let n = 0; n < 150; n++) { if (await evaluate(expression)) return; await new Promise(resolve => setTimeout(resolve, 100)); } throw new Error(`Timed out: ${expression}`); };
  async function open() {
    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    sessionId = (await send("Target.attachToTarget", { targetId, flatten: true })).sessionId;
    await cdp("Runtime.enable"); await cdp("Network.enable"); await cdp("Page.enable");
    await cdp("Page.addScriptToEvaluateOnNewDocument", { source: "localStorage.setItem('rigelcms.settings', JSON.stringify({ userPref: { editorExperience: 'sidebar' } }));" });
    await cdp("Page.navigate", { url });
    await waitFor("!!document.querySelector('[data-document=\"settings:site\"]')");
  }
  async function settings() {
    await evaluate("document.querySelector('[data-document=\"settings:site\"]').click()");
    await openProperties({ evaluate, waitFor });
    await waitFor("!!document.querySelector('main input[type=text]')");
    return evaluate("document.querySelector('main input[type=text]').value");
  }
  await open();
  const baseline = await settings();
  const edited = "Demo session only";
  await evaluate(`(() => { const input = document.querySelector('main input[type=text]'); input.value = ${JSON.stringify(edited)}; input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  await waitFor("!document.querySelector('.save-button').disabled");
  await evaluate("document.querySelector('.save-button').click()");
  await waitFor("document.querySelector('.save-button').disabled");
  await evaluate("document.querySelector('#nav-pages').click()");
  await waitFor("!!document.querySelector('.table-link')");
  assert.equal(await settings(), edited, "Simulated Save survives in-tab navigation");
  await waitFor("!!document.querySelector('#publish-button') && !document.querySelector('#publish-button').disabled");
  await evaluate("document.querySelector('#publish-button').click()");
  await waitFor("!!document.querySelector('dialog[open]')");
  assert.match(await evaluate("document.querySelector('dialog[open]').textContent"), /demo|simulat/i);
  await evaluate("document.querySelector('#confirm-publish').click()");
  await waitFor("!!document.querySelector('.publish-dialog [role=status]')");
  assert.match(await evaluate("document.querySelector('.publish-dialog [role=status]').textContent"), /demo|simulat/i);
  await evaluate("document.querySelector('.publish-actions .outlined').click()");
  await waitFor("!document.querySelector('dialog[open]')");
  assert.equal(await settings(), edited);
  await evaluate("document.querySelector('[data-collection=blog]').click()");
  await waitFor("!!document.querySelector('.titlebar .primary')");
  await evaluate("document.querySelector('.titlebar .primary').click()");
  await waitFor("!!document.querySelector('.action-dialog[open] input')");
  await evaluate("(() => { const input = document.querySelector('.action-dialog input'); input.value = 'Demo browser post'; input.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('.action-dialog [type=submit]').click(); })()");
  await waitFor("!!document.querySelector('.save-button') && !document.querySelector('.save-button').disabled");
  await evaluate("document.querySelector('.save-button').click()");
  await waitFor("document.querySelector('.save-button').disabled && !document.querySelector('[role=alert]')");
  await evaluate("document.querySelector('[data-collection=blog]').click()");
  await waitFor("[...document.querySelectorAll('.table-link')].some(button => button.textContent.includes('Demo browser post'))");
  await evaluate("[...document.querySelectorAll('.table-link')].find(button => button.textContent.includes('Demo browser post')).click()");
  await openProperties({ evaluate, waitFor });
  await evaluate("document.querySelector('#properties-tab-page').click()");
  await waitFor("!!document.querySelector('#properties-page button[aria-label=\"Delete post\"]')");
  await evaluate("document.querySelector('button[aria-label=\"Delete post\"]').click()");
  await waitFor("!!document.querySelector('.action-dialog[open]')");
  await evaluate("document.querySelector('.action-dialog [type=submit]').click()");
  await waitFor("!document.querySelector('.action-dialog[open]') && !!document.querySelector('.table-link')");
  assert.equal(await evaluate("[...document.querySelectorAll('.table-link')].some(button => button.textContent.includes('Demo browser post'))"), false, "Demo post creation and deletion stay in memory");
  assert.equal(await settings(), edited);
  const firstSession = sessionId;
  await open();
  assert.equal(await settings(), baseline, "A second tab starts with bundled content");
  sessionId = firstSession;
  await evaluate("window.demoBeforeReload = true");
  await cdp("Page.reload");
  await waitFor("!window.demoBeforeReload && !!document.querySelector('[data-document=\"settings:site\"]')");
  assert.equal(await settings(), baseline, "Reload discards simulated saves and publishes");
  const screenshot = await cdp("Page.captureScreenshot", { format: "png" });
  await writeFile("_temp/demo-backend.png", Buffer.from(screenshot.data, "base64"));
  assert.deepEqual(writes, [], "Demo UI sends no mutation or GitHub requests");
  for (const route of ["save", `blog/${manifest.collections.find(collection => collection.name === "blog").posts[0].slug}`, "documents/settings%3Asite", "menus/footer", "media"]) {
    for (const method of ["POST", "PUT", "DELETE"]) {
      const response = await fetch(new URL(`api/local/${route}`, url), { method, headers: { Origin: new URL(url).origin, "Content-Type": "application/json" }, body: "{}" });
      assert.ok([403, 404, 405].includes(response.status), `${method} ${route} rejects writes (${response.status})`);
    }
  }
  assert.deepEqual(await snapshot(), originalFiles, "Content and media bytes stay unchanged");
  assert.deepEqual(errors, []);
  console.log("PASS: demo Save/Publish, navigation, tab isolation, refresh reset, no write/GitHub requests, blocked local mutations and unchanged content/media");
} finally {
  socket?.close();
  if (chrome.pid && chrome.exitCode === null && chrome.signalCode === null) { const exited = once(chrome, "exit"); chrome.kill("SIGKILL"); await exited; }
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
