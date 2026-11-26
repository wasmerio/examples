import "./local-only.mjs";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { mediaFixtures } from "./media-fixtures.mjs";

const url = process.env.RIGEL_URL || "http://localhost:4321/rigel/";
const blueprint = await (await fetch(new URL("/rigel/manifest.json", url))).json();
const github = { repo: "fixture-owner/fixture-site", branch: "drafts", publishBranch: "main", repoRoot: "", authOrigin: "http://localhost:9999", appSlug: "rigel-cms", copyDir: "src/content/copy", collections: [] };
const manifest = { ...blueprint, backend: "github", pages: [], collections: [], menus: undefined, sidebar: undefined, documents: [], schema: { objects: [], documents: [] }, github };
const requests = [], errors = [], results = [];
const blobs = new Map(), files = new Map();
const head = "b".repeat(40);
let user = "alice", hold, release;
function put(path, bytes) {
  const sha = createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
  blobs.set(sha, bytes); files.set(path, { path, sha, type: "blob", mode: "100644", size: bytes.length });
  return sha;
}
function api(path, method) {
  requests.push({ path, method });
  if (method === "OPTIONS") return [204, null];
  assert.equal(method, "GET", "Mock rejects all production mutations");
  const repository = { id: 42, full_name: github.repo, name: "fixture-site", default_branch: "main", owner: { login: "fixture-owner" }, permissions: { push: true, pull: true } };
  const installation = { id: 7, app_slug: "rigel-cms", account: { login: "fixture-owner", type: "User" }, permissions: { contents: "write" }, suspended_at: null };
  if (path === "/user") return [200, { login: user, avatar_url: "https://avatars.githubusercontent.com/u/1", html_url: `https://github.com/${user}` }];
  if (path.startsWith("/user/installations?")) return [200, { total_count: 1, installations: [installation] }];
  if (path.startsWith("/user/installations/7/repositories?")) return [200, { total_count: 1, repositories: [repository] }];
  const prefix = `/repos/${github.repo}`;
  if (path === prefix) return [200, repository];
  if (path === `${prefix}/git/ref/heads/drafts` || path === `${prefix}/branches/drafts`) return [200, { object: { sha: head, type: "commit" }, commit: { sha: head } }];
  if (path.startsWith(`${prefix}/git/trees/`)) return [200, { truncated: false, tree: [...files.values()] }];
  if (path.startsWith(`${prefix}/git/blobs/`)) {
    const sha = path.split("/").at(-1); assert.ok(blobs.has(sha));
    return [200, { sha, encoding: "base64", content: blobs.get(sha).toString("base64") }];
  }
  throw Error(`Unexpected fixture request ${method} ${path}`);
}
await mkdir("_temp", { recursive: true });
const profile = await mkdtemp(`${process.cwd()}/_temp/media-cache-browser-`);
const chrome = spawn(process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", ["--headless=new", "--no-first-run", "--no-default-browser-check", "--window-size=1280,900", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"], { stdio: ["ignore", "ignore", "pipe"] });
let socket;
try {
  const endpoint = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(Error("Chrome did not start")), 10000);
    chrome.once("error", reject);
    chrome.stderr.on("data", chunk => { const match = String(chunk).match(/DevTools listening on (ws:\/\/\S+)/); if (match) { clearTimeout(timer); resolve(match[1]); } });
  });
  socket = new WebSocket(endpoint); await once(socket, "open");
  let sequence = 0;
  const pending = new Map();
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data), task = pending.get(message.id);
    if (task) { pending.delete(message.id); message.error ? task.reject(Error(message.error.message)) : task.resolve(message.result); }
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++sequence, timer = setTimeout(() => { pending.delete(id); reject(Error(`${method} timed out`)); }, 20000);
    pending.set(id, { resolve: value => { clearTimeout(timer); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
    socket.send(JSON.stringify({ id, method, params, sessionId }));
  });
  async function page() {
    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
    const cdp = (method, params) => send(method, params, sessionId);
    socket.addEventListener("message", ({ data }) => {
      const event = JSON.parse(data);
      if (event.sessionId !== sessionId) return;
      if (event.method === "Runtime.exceptionThrown") errors.push(event.params.exceptionDetails.exception?.description ?? event.params.exceptionDetails.text);
      if (event.method === "Fetch.requestPaused") void (async () => {
        const { requestId, request } = event.params, target = new URL(request.url);
        if (target.pathname.startsWith("/rigel/api/local/")) throw Error("Unexpected local mutation");
        let response;
        if (target.pathname === "/rigel/manifest.json") response = [200, manifest];
        else if (target.hostname === "api.github.com") {
          response = api(target.pathname + target.search, request.method);
          if (hold && request.method === "GET" && target.pathname.includes("/git/blobs/") && target.pathname.endsWith(hold.sha)) { hold.started(); await hold.promise; }
        } else { await cdp("Fetch.continueRequest", { requestId }); return; }
        await cdp("Fetch.fulfillRequest", { requestId, responseCode: response[0], responseHeaders: [{ name: "Content-Type", value: "application/json" }, { name: "Access-Control-Allow-Origin", value: "*" }, { name: "Access-Control-Allow-Headers", value: "Authorization,Content-Type,Accept,X-GitHub-Api-Version" }, { name: "Access-Control-Allow-Methods", value: "GET,OPTIONS" }], body: Buffer.from(response[1] === null ? "" : JSON.stringify(response[1])).toString("base64") });
      })().catch(error => { errors.push(error.message); void cdp("Fetch.failRequest", { requestId: event.params.requestId, errorReason: "Failed" }); });
    });
    await cdp("Page.enable"); await cdp("Runtime.enable");
    await cdp("Fetch.enable", { patterns: [{ urlPattern: "*://api.github.com/*" }, { urlPattern: "*/rigel/manifest.json" }, { urlPattern: "*/rigel/api/local/*" }] });
    const evaluate = async expression => {
      const response = await cdp("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true, userGesture: true }).catch(error => { throw Error(`${error.message}: ${expression.slice(0, 500)}`); });
      if (response.exceptionDetails) throw Error(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text);
      return response.result.value;
    };
    const wait = async expression => {
      for (let i = 0; i < 150; i++) { if (await evaluate(expression)) return; await new Promise(resolve => setTimeout(resolve, 100)); }
      throw Error(`Timed out: ${expression}\n${JSON.stringify(errors)}\n${await evaluate("document.body.innerText.slice(0,3000)")}`);
    };
    const initialize = `localStorage.setItem('rigelcms.session', JSON.stringify({version:1,scope:${JSON.stringify(JSON.stringify([github.authOrigin, github.repo, github.branch, github.appSlug]))},accessToken:'ghu_fixture_user_token',expiresAt:Date.now()+3600000}));`;
    await cdp("Page.addScriptToEvaluateOnNewDocument", { source: initialize });
    return { cdp, evaluate, wait, targetId };
  }
  const p = await page(), { cdp, evaluate, wait } = p;
  const png = Buffer.from(await evaluate(`(async () => { const canvas = new OffscreenCanvas(640,480), c = canvas.getContext('2d'); c.fillStyle='#247080'; c.fillRect(0,0,640,480); return [...new Uint8Array(await (await canvas.convertToBlob({type:'image/png'})).arrayBuffer())]; })()`));
  const imagePath = "public/rigel-media/image-00.png";
  for (let i = 0; i < 48; i++) put(`public/rigel-media/image-${String(i).padStart(2, "0")}.png`, Buffer.concat([png, Buffer.from(String(i))]));
  for (const fixture of mediaFixtures.filter(file => ["pdf", "mp4"].includes(file.name.split(".").at(-1)))) put("public/rigel-media/" + fixture.name, fixture.bytes);
  const imageReads = since => requests.slice(since).filter(request => request.method === "GET" && [...files.values()].some(file => file.path.endsWith(".png") && request.path.endsWith(`/git/blobs/${file.sha}`))).length;
  const ready = async () => {
    await send("Target.activateTarget", { targetId: p.targetId });
    await wait("!!document.querySelector('.media-library .grid .thumb img')");
    await evaluate(`new Promise(resolve=>{const nodes=[...document.querySelectorAll('.media-library .thumb img')],seen=new Set(),visible=new Set();const observer=new IntersectionObserver(entries=>{for(const entry of entries){seen.add(entry.target);if(entry.isIntersecting)visible.add(entry.target)}if(seen.size===nodes.length){window.visibleCacheImages=[...visible];observer.disconnect();resolve()}});nodes.forEach(node=>observer.observe(node))})`);
    await wait("window.visibleCacheImages.length>0&&window.visibleCacheImages.every(img=>img.getAttribute('src')?.startsWith('blob:')&&img.complete&&img.naturalWidth>0)");
  };
  const reload = async () => { const previous = await evaluate("performance.timeOrigin"); await cdp("Page.reload"); await wait(`performance.timeOrigin!==${previous}&&document.readyState!=='loading'`); await ready(); };
  const db = action => evaluate(`(async()=>{ const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('rigelcms-files');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});try{return await (${action})(db)}finally{db.close()} })()`);
  const records = () => db(`db=>new Promise((resolve,reject)=>{const tx=db.transaction('thumbnails');const r=tx.objectStore('thumbnails').getAll();r.onsuccess=()=>resolve(r.result.map(e=>({key:e.key,size:e.size,type:e.blob.type})));r.onerror=()=>reject(r.error)})`);
  const importCache = `await import(performance.getEntriesByType('resource').find(e=>e.name.includes('/lib/file-cache.ts')).name)`;
  const clear = () => evaluate(`(async()=>{const cache=${importCache};await cache.clearFileCache()})()`);
  const start = requests.length;
  await cdp("Page.navigate", { url: url + "#/media" }); await ready();
  const cold = imageReads(start), coldRecords = await records();
  assert.ok(cold > 0 && cold < 48, `Only visible images download: ${cold}/48`);
  assert.equal(coldRecords.length, cold);
  assert.ok(coldRecords.every(record => record.type === "image/webp" && record.key.includes("v1:320x320:contain:webp:0.8")));
  assert.equal(await evaluate("document.querySelector('.thumb img[src]').naturalWidth"), 320);
  await writeFile("_temp/media-cache-cold.png", Buffer.from((await cdp("Page.captureScreenshot", { format: "png" })).data, "base64"));
  let before = requests.length; await reload();
  assert.equal(imageReads(before), 0, "Actual browser reload reuses persistent thumbnails without original downloads");
  results.push({ phase: "cold", originalImageDownloads: cold, totalAPI: requests.slice(start, before).filter(r => r.method !== "OPTIONS").length, persistedThumbnails: coldRecords.length }, { phase: "reload-warm", originalImageDownloads: 0, totalAPI: requests.slice(before).filter(r => r.method !== "OPTIONS").length });
  await writeFile("_temp/media-cache-warm.png", Buffer.from((await cdp("Page.captureScreenshot", { format: "png" })).data, "base64"));
  await evaluate("document.querySelector('.media-library .thumb:has(img)').click()"); await wait("!!document.querySelector('.media-preview img[src^=\"blob:\"]')");
  assert.equal(await evaluate("document.querySelector('.media-preview img').naturalWidth"), 640);
  assert.equal(await evaluate("document.querySelector('.media-path code').textContent"), "/rigel-media/image-00.png");
  await wait("document.querySelector('.media-download')?.getAttribute('href')?.startsWith('blob:')");
  const downloaded = Buffer.from(await evaluate("fetch(document.querySelector('.media-download').href).then(r=>r.arrayBuffer()).then(b=>[...new Uint8Array(b)])"));
  assert.deepEqual(downloaded, blobs.get(files.get(imagePath).sha), "Downloads retain exact canonical source bytes, never thumbnail bytes");
  await evaluate("document.querySelector('.image-dialog .close').click()");
  before = requests.length; put(imagePath, Buffer.concat([png, Buffer.from("changed")])); await reload();
  assert.equal(imageReads(before), 1, "Changed current tree SHA misses only that image");
  results.push({ phase: "changed-sha", originalImageDownloads: 1 });
  await db(`db=>new Promise((resolve,reject)=>{const tx=db.transaction('thumbnails','readwrite'),s=tx.objectStore('thumbnails');s.openCursor().onsuccess=e=>{const c=e.target.result;if(c){const v=c.value;v.blob=new Blob(['corrupt'],{type:'image/webp'});c.update(v);c.continue()}};tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error)})`);
  before = requests.length; await reload(); assert.equal(imageReads(before), cold, "Corrupt derived bytes are discarded and regenerated");
  results.push({ phase: "corrupt", originalImageDownloads: cold });
  await db(`db=>new Promise((resolve,reject)=>{const tx=db.transaction('thumbnails','readwrite'),s=tx.objectStore('thumbnails');s.openCursor().onsuccess=e=>{const c=e.target.result;if(c){const v=c.value;s.delete(c.primaryKey);v.key=v.key.replace('v1:320x320','v0:320x320');s.put(v);c.continue()}};tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error)})`);
  before = requests.length; await reload(); assert.equal(imageReads(before), cold, "Transform discriminator misses old derivatives");
  before = requests.length; user = "bob"; await reload(); assert.equal(imageReads(before), cold, "Different verified account cannot reuse Alice's thumbnails");
  assert.ok((await records()).every(record => !coldRecords.some(old => old.key === record.key)));
  results.push({ phase: "different-account", originalImageDownloads: cold });
  before = requests.length;
  await evaluate("[...document.querySelectorAll('.media-tools button')].find(b=>b.textContent.trim()==='Refresh').click()"); await ready();
  assert.equal(imageReads(before), cold, "Refresh refetches identical SHA originals");
  const second = await page(); await second.cdp("Page.navigate", { url: url + "#/media" }); await second.wait("!!document.querySelector('.media-library .thumb img[src^=\"blob:\"]')");
  await clear();
  await second.wait("!document.querySelector('.media-library .thumb img[src^=\"blob:\"]')");
  assert.equal((await records()).length, 0, "Clear purges persistent bytes across tabs");
  await send("Target.closeTarget", { targetId: second.targetId });
  before = requests.length; await reload(); assert.equal(imageReads(before), cold);
  await reload();
  before = requests.length;
  await clear();
  await evaluate(`(() => { const root=document.querySelector('.media-library'), group=document.createElement('div');group.id='consumer-probe'; group.style='position:fixed;top:100px;left:400px;z-index:10000;display:flex'; group.innerHTML='<span class="thumb"><img width="100" src="/rigel-media/image-00.png"></span><span class="thumb"><img width="100" src="/rigel-media/image-00.png"></span><img class="preview" width="100" src="/rigel-media/image-00.png">';root.prepend(group) })()`);
  await wait("[...document.querySelectorAll('#consumer-probe img')].every(img=>img.src.startsWith('blob:')&&img.complete&&img.naturalWidth>0)");
  assert.equal(imageReads(before), 1, "Concurrent thumbnails and original preview share one source download");
  assert.deepEqual(await evaluate("[...document.querySelectorAll('#consumer-probe img')].map(img=>img.naturalWidth)"), [320,320,640]);
  assert.equal(await evaluate("new Set([...document.querySelectorAll('#consumer-probe img')].map(img=>img.src)).size"), 3);
  const survivingURL = await evaluate("document.querySelectorAll('#consumer-probe img')[1].src");
  await evaluate("document.querySelector('#consumer-probe .thumb').remove()");
  await new Promise(resolve => setTimeout(resolve, 100));
  assert.equal(await evaluate(`fetch(${JSON.stringify(survivingURL)}).then(r=>r.ok)`), true, "Closing one consumer does not revoke another's object URL");
  await evaluate("document.querySelector('#consumer-probe').remove()");
  results.push({ phase: "three-consumers", originalImageDownloads: 1, dimensions: [320,320,640] });
  const imageSha = files.get(imagePath).sha;
  let started;
  const waiting = new Promise(resolve => { started = resolve; });
  hold = { sha: imageSha, started, promise: new Promise(resolve => { release = resolve; }) };
  await clear(); await cdp("Page.reload"); await waiting; await clear(); release(); hold = undefined;
  await new Promise(resolve => setTimeout(resolve, 500));
  assert.equal((await records()).some(record => record.key.includes(imageSha)), false, "Old pending generation cannot repopulate after clear");
  await reload();
  let logoutStarted;
  const logoutWaiting = new Promise(resolve => { logoutStarted = resolve; });
  hold = { sha: imageSha, started: logoutStarted, promise: new Promise(resolve => { release = resolve; }) };
  await clear(); await cdp("Page.reload"); await logoutWaiting;
  await evaluate("document.querySelector('.user-btn').click()");
  await wait("!!document.querySelector('#github-sign-out')");
  await evaluate("document.querySelector('#github-sign-out').click()");
  await wait("!!document.querySelector('#github-sign-in')");
  release(); hold = undefined;
  await new Promise(resolve => setTimeout(resolve, 500));
  assert.equal((await records()).length, 0, "Logout purges bytes and rejects the old pending generation");
  await reload();
  const source = await evaluate(`performance.getEntriesByType('resource').find(e=>e.name.includes('/lib/file-cache.ts')).name`);
  await evaluate(`(async()=>{const cache=await import(${JSON.stringify(source)});await cache.clearFileCache()})()`);
  const quotaScript = await cdp("Page.addScriptToEvaluateOnNewDocument", { source: `IDBObjectStore.prototype.put=function(){throw new DOMException('Fixture quota','QuotaExceededError')};` });
  before = requests.length; await reload(); assert.equal(imageReads(before), cold); assert.equal((await records()).length, 0);
  await evaluate(`(async()=>{const cache=${importCache};const scope=await cache.fileCacheScope('quota-fixture','repo');const blob=new Blob(['derived'],{type:'image/webp'});await cache.cacheThumbnail(scope,'a'.repeat(40),'v1',blob,cache.fileCacheRevision());window.quotaHit=(await cache.cachedThumbnail(scope,'a'.repeat(40),'v1'))?.size===blob.size})()`);
  assert.equal(await evaluate("window.quotaHit"), true);
  await cdp("Page.removeScriptToEvaluateOnNewDocument", { identifier: quotaScript.identifier });
  const website = new URL("/", url).href;
  await cdp("Page.navigate", { url: website }); await wait("location.pathname==='/'&&document.readyState==='complete'");
  const blocker = await page();
  await blocker.cdp("Page.navigate", { url: website }); await blocker.wait("location.pathname==='/'&&document.readyState==='complete'");
  await blocker.evaluate(`(async()=>{await new Promise((resolve,reject)=>{const r=indexedDB.deleteDatabase('rigelcms-files');r.onsuccess=resolve;r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('Unexpected old connection'))});await new Promise((resolve,reject)=>{const r=indexedDB.open('rigelcms-files',1);r.onupgradeneeded=()=>{r.result.createObjectStore('files',{keyPath:'key'});r.result.createObjectStore('meta')};r.onsuccess=()=>{window.blockerDB=r.result;window.blockerDB.onversionchange=()=>{window.upgradeBlocked=true};resolve()};r.onerror=()=>reject(r.error)})})()`);
  await cdp("Page.addScriptToEvaluateOnNewDocument", { source: `window.cacheOpenCalls=0;const nativeOpen=indexedDB.open.bind(indexedDB);indexedDB.open=(...args)=>{window.cacheOpenCalls++;return nativeOpen(...args)};` });
  before = requests.length;
  await cdp("Page.navigate", { url: url + "#/media" }); await ready();
  assert.equal(imageReads(before), cold, "An actual blocked IndexedDB upgrade falls back to memory");
  assert.equal(await blocker.evaluate("window.upgradeBlocked"), true);
  assert.ok(await evaluate("window.cacheOpenCalls<=2"), "Do not retry blocked database opens for every thumbnail");
  await blocker.evaluate("window.blockerDB.close()");
  await send("Target.closeTarget", { targetId: blocker.targetId });
  await reload();
  assert.equal((await records()).length, cold, "A later verified scope recovers persistent storage after the blocker closes");
  results.push({ phase: "native-blocked-upgrade-recovery", passed: true });
  await evaluate(`(async()=>{const cache=${importCache},scope=await cache.fileCacheScope('bounds-fixture','repo'),canvas=new OffscreenCanvas(10,10);canvas.getContext('2d').fillRect(0,0,10,10);const blob=await canvas.convertToBlob({type:'image/webp'});for(let i=0;i<130;i++)await cache.cacheThumbnail(scope,i.toString(16).padStart(40,'0'),'v1',blob,cache.fileCacheRevision());window.countBound=!(await cache.cachedThumbnail(scope,'0'.repeat(40),'v1'))&&!!(await cache.cachedThumbnail(scope,(129).toString(16).padStart(40,'0'),'v1'));window.boundScope=scope;window.boundBlob=blob})()`);
  assert.equal((await records()).length, 128, "Native IndexedDB prunes thumbnail entries to the count limit");
  assert.equal(await evaluate("window.countBound"), true);
  await evaluate(`(async()=>{const cache=${importCache};await cache.clearMediaFileCache();const large=new Blob([window.boundBlob,new Uint8Array(2*1024*1024)],{type:'image/webp'});for(let i=0;i<9;i++)await cache.cacheThumbnail(window.boundScope,i.toString(16).padStart(40,'0'),'v1',large,cache.fileCacheRevision());window.byteBound=!(await cache.cachedThumbnail(window.boundScope,'0'.repeat(40),'v1'))&&!!(await cache.cachedThumbnail(window.boundScope,'8'.padStart(40,'0'),'v1'))})()`);
  const bounded = await records();
  assert.ok(bounded.length > 0 && bounded.reduce((sum, record) => sum + record.size, 0) <= 16 * 1024 * 1024, "Native IndexedDB prunes by bytes, not only count");
  assert.equal(await evaluate("window.byteBound"), true);
  results.push({ phase: "native-count-and-byte-eviction", entryLimit: 128, byteLimit: 16 * 1024 * 1024 });
  assert.deepEqual(errors, []);
  results.push({ phase: "refresh-clear-cross-tab-pending-quota", passed: true });
  await writeFile("_temp/media-cache-results.json", JSON.stringify({ results, requests }, null, 2));
  console.log(JSON.stringify({ results, screenshots: ["_temp/media-cache-cold.png", "_temp/media-cache-warm.png"] }, null, 2));
} finally {
  release?.(); socket?.close(); chrome.kill("SIGTERM"); await once(chrome, "exit").catch(() => {}); await rm(profile, { recursive: true, force: true });
}
