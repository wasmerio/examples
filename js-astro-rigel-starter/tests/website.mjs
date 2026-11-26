import "./local-only.mjs";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { checkFooter } from "./footer.mjs";

const origin = new URL(process.env.RIGEL_URL || "http://127.0.0.1:4321").origin;
const routes = new Set(["/", "/about/", "/services/", "/contact/", "/blog/", "/news/"]);
const assets = new Set();
const manifest = await (await fetch(new URL('/rigel/manifest.json', origin))).json();
const headingCounts = new Map(manifest.documents.filter(doc => doc.type === 'page').map(doc => [doc.slug === 'home' ? '/' : `/${doc.slug}/`, doc.data.sections.filter(section => ['hero', 'pageIntro', 'articleText'].includes(section._type)).length]));
for (const route of routes) {
  const response = await fetch(new URL(route, origin));
  assert.equal(response.status, 200, route);
  const html = await response.text();
  assert.match(html, /<title>[^<]+<\/title>/, `${route}: page title`);
  assert.match(html, /<main(?:\s|>)/, `${route}: main landmark`);
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const url = new URL(match[1].replaceAll("&amp;", "&"), origin);
    if (url.origin !== origin) continue;
    if (url.pathname.startsWith("/blog/")) routes.add(url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`);
    if (/\.(?:png|jpe?g|webp|avif|svg)(?:$|\?)/i.test(url.pathname)) assets.add(url.href);
  }
}
assert.ok([...routes].filter(route => route.startsWith("/blog/") && route !== "/blog/").length >= 2, "At least two linked articles");
assert.ok(assets.size >= 3, "Local marketing imagery and logo assets");
for (const asset of assets) {
  const response = await fetch(asset);
  assert.equal(response.status, 200, asset);
  assert.match(response.headers.get("content-type") || "", /^image\//, asset);
  assert.ok((await response.arrayBuffer()).byteLength > 0, asset);
}

await mkdir("_temp", { recursive: true });
const profile = await mkdtemp(`${process.cwd()}/_temp/website-browser-`);
const chrome = spawn(process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", "--no-first-run", "--no-default-browser-check", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });
let socket;
try {
  const endpoint = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Chrome startup timed out")), 15000);
    chrome.once("error", error => { clearTimeout(timer); reject(error); });
    chrome.stderr.on("data", chunk => {
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
    clearTimeout(request.timer);
    pending.delete(result.id);
    if (result.error) request.reject(new Error(result.error.message));
    else request.resolve(result.result);
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const requestId = ++id;
    const timer = setTimeout(() => { pending.delete(requestId); reject(new Error(`${method} timed out`)); }, 15000);
    pending.set(requestId, { resolve, reject, timer });
    socket.send(JSON.stringify({ id: requestId, method, params, sessionId }));
  });
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const cdp = async (method, params) => {
    if (method !== "Page.navigate" && method !== "Page.reload") return send(method, params, sessionId);
    let listener, timer;
    const loaded = new Promise((resolve, reject) => {
      listener = ({ data }) => {
        const event = JSON.parse(data);
        if (event.sessionId === sessionId && event.method === "Page.loadEventFired") resolve();
      };
      socket.addEventListener("message", listener);
      timer = setTimeout(() => reject(new Error(`${method}: page load timed out`)), 15000);
    });
    try {
      const [result] = await Promise.all([send(method, params, sessionId), loaded]);
      return result;
    } finally {
      clearTimeout(timer);
      socket.removeEventListener("message", listener);
    }
  };
  const evaluate = async expression => {
    const result = await cdp("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }).catch(error => {
      throw new Error(`${error.message}: ${expression}`, { cause: error });
    });
    assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const errors = [];
  const fontRequests = [];
  socket.addEventListener("message", ({ data }) => {
    const event = JSON.parse(data);
    if (event.method === "Runtime.exceptionThrown") errors.push(event.params.exceptionDetails.text);
    if (event.method === "Network.requestWillBeSent" && event.params.type === "Font") fontRequests.push(event.params.request.url);
  });
  await cdp("Runtime.enable");
  await cdp("Page.enable");
  await cdp("Network.enable");
  for (const width of [1440, 768, 390]) {
    await cdp("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    for (const route of routes) {
      await evaluate("window.websiteNavigationPending = true");
      await cdp("Page.navigate", { url: new URL(route, origin).href });
      let ready = false;
      for (let attempt = 0; attempt < 80; attempt++) {
        ready = await evaluate(`!window.websiteNavigationPending && location.pathname === ${JSON.stringify(route)} && document.readyState === 'complete' && !!document.querySelector('main h1')`).catch(error => {
          if (/navigated or closed|Cannot find context|Execution context was destroyed/.test(error.message)) return false;
          throw error;
        });
        if (ready) break;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      assert.ok(ready, `${route}: browser load`);
      assert.equal(await evaluate("[...document.querySelectorAll('main h1')].filter(heading => !heading.closest('[data-rigel-richtext=\"$body\"]')).length"), headingCounts.get(route) ?? 1, `${route}: authored section headings outside the editable article body`);
      assert.equal(await evaluate("!!document.querySelector('footer .copyright') && !!document.querySelector('footer nav[aria-label=Footer]')"), true);
      assert.equal(await evaluate("!!document.querySelector('footer a[href=\"/rigel/\"]') || document.querySelector('footer').textContent.includes('Editable demo menu')"), false);
      assert.equal(await evaluate("[...document.querySelectorAll('header a[href=\"/rigel/\"]')].every(link => link.textContent === 'CMS Studio') && document.querySelectorAll('header a[href=\"/rigel/\"]').length === 2"), true);
      if (width >= 768) assert.equal(await evaluate("document.querySelector('footer nav').getBoundingClientRect().left > document.querySelector('footer p').getBoundingClientRect().right"), true, "Desktop footer menu sits right of copyright");
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await evaluate("Promise.all([...document.images].map(async img => { img.loading = 'eager'; await img.decode().catch(() => {}); }))");
          break;
        } catch (error) {
          if (attempt === 2 || !/navigated or closed|Cannot find context|Execution context was destroyed/.test(error.message)) throw error;
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `${route}: overflow at ${width}px`);
      assert.deepEqual(await evaluate("[...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src)"), [], `${route}: loaded images`);
      assert.match(await evaluate("getComputedStyle(document.body).fontFamily"), /-apple-system/);
      assert.deepEqual(await evaluate("[...document.querySelectorAll('.site-icon')].filter(icon => { const style = getComputedStyle(icon); return style.width !== '16px' || style.height !== '16px'; }).map(icon => icon.outerHTML)"), [], `${route}: consistent 16px icons`);
      assert.deepEqual(await evaluate("[...document.querySelectorAll('.button')].filter(button => { const box = button.getBoundingClientRect(); return box.width > 0 && (box.height < 44 || getComputedStyle(button).borderRadius !== '0px'); }).map(button => button.textContent)"), [], `${route}: square accessible buttons`);
      if (route === "/") {
        await cdp("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "dark" }] });
        await new Promise(resolve => setTimeout(resolve, 150));
        const darkPreference = await evaluate("({background: getComputedStyle(document.documentElement).backgroundColor, color: getComputedStyle(document.body).color, scheme: getComputedStyle(document.documentElement).colorScheme})");
        assert.equal(darkPreference.background, "rgb(248, 250, 252)");
        assert.equal(darkPreference.scheme, "light only");
        const dark = await cdp("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
        await writeFile(`_temp/website-${width}-dark.png`, Buffer.from(dark.data, "base64"));
        await cdp("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "light" }] });
        await new Promise(resolve => setTimeout(resolve, 150));
        assert.deepEqual(await evaluate("({background: getComputedStyle(document.documentElement).backgroundColor, color: getComputedStyle(document.body).color, scheme: getComputedStyle(document.documentElement).colorScheme})"), darkPreference, "OS dark preference does not change the light website");
        const light = await cdp("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
        await writeFile(`_temp/website-${width}-light.png`, Buffer.from(light.data, "base64"));
        await evaluate("document.querySelector('footer').scrollIntoView()");
        const footer = await cdp("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
        await writeFile(`_temp/website-footer-${width}.png`, Buffer.from(footer.data, "base64"));
        await evaluate("scrollTo(0, 0)");
      }
    }
  }
  assert.deepEqual(errors, [], "No browser runtime exceptions");
  assert.deepEqual(fontRequests, [], "No font downloads");
  await checkFooter({ cdp, evaluate, origin });
  console.log(`Website checks passed: ${routes.size} routes, ${assets.size} local images, desktop/mobile, light-only under both OS preferences, 16px icons, square buttons, system fonts without downloads.`);
} finally {
  socket?.close();
  if (chrome.pid && chrome.exitCode === null && chrome.signalCode === null) {
    const exited = once(chrome, "exit");
    chrome.kill("SIGKILL");
    await exited;
  }
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
