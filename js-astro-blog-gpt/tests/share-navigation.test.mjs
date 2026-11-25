import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import { setImmediate as flush } from 'node:timers/promises';

// Run the installed Astro router too: cancelling a pending navigation with a
// same-page fragment keeps the old document without another astro:page-load.
const scripts = new Map();
for (const [name, file] of [
  ['./events.js', 'node_modules/astro/dist/transitions/events.js'],
  ['router', 'node_modules/astro/dist/transitions/router.js'],
  ['share', 'src/scripts/share.ts'],
]) {
  const source = (await readFile(file, 'utf8'))
    .replaceAll('import.meta.env.SSR', 'false')
    .replaceAll('import.meta.env.DEV', 'false');
  scripts.set(
    name,
    ts.transpileModule(source, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
      },
    }).outputText,
  );
}

class Element extends EventTarget {
  dataset = {};
  style = {};
  open = false;
  setAttribute() {}
  contains() {
    return false;
  }
  querySelector() {
    return null;
  }
  matches() {
    return this.open;
  }
  showPopover() {
    this.open = true;
  }
  hidePopover() {
    this.open = false;
  }
  getBoundingClientRect() {
    return { right: 500, top: 400, width: 240, height: 100 };
  }
}

function browser({ deferCopy = false } = {}) {
  const trigger = new Element();
  trigger.querySelector = () => ({ textContent: '' });
  const panel = new Element();
  const root = new Element();
  root.dataset = { shareText: 'Share this article' };
  root.querySelector = (selector) =>
    selector === '[data-share-panel]'
      ? panel
      : selector === '[data-share-trigger]'
        ? trigger
        : null;
  const document = new EventTarget();
  document.title = 'Current article';
  document.body = { dataset: { locale: 'en' } };
  document.querySelector = (selector) =>
    selector === '[data-share-root]'
      ? root
      : selector.includes('astro-view-transitions-enabled')
        ? {}
        : selector.includes('astro-view-transitions-fallback')
          ? { getAttribute: () => 'swap' }
          : null;
  document.getElementsByTagName = () => [];
  const window = new EventTarget();
  window.document = document;
  window.onscrollend = null;
  const location = new URL('https://example.com/en/posts/current/');
  const history = {
    state: { index: 0, scrollX: 0, scrollY: 0 },
    replaceState(state, title, url) {
      this.state = state;
      if (url) location.href = url;
    },
    pushState(state, title, url) {
      this.state = state;
      location.href = url;
    },
  };
  let copies = 0,
    loads = 0,
    swaps = 0,
    fetches = 0,
    timerId = 0;
  const timers = new Map();
  const pendingCopies = [];
  document.addEventListener('astro:page-load', () => loads++);
  document.addEventListener('astro:before-swap', () => swaps++);
  const context = vm.createContext({
    document,
    window,
    location,
    history,
    Event,
    EventTarget,
    AbortController,
    DOMException,
    URL,
    Headers,
    scrollX: 0,
    scrollY: 0,
    scrollTo() {},
    innerWidth: 1280,
    addEventListener: window.addEventListener.bind(window),
    setTimeout(callback) {
      const id = ++timerId;
      timers.set(id, callback);
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
    navigator: {
      clipboard: {
        writeText() {
          copies++;
          if (deferCopy)
            return new Promise((resolve, reject) =>
              pendingCopies.push({ resolve, reject }),
            );
        },
      },
    },
    matchMedia: () => ({ matches: true }),
    fetch(url, init) {
      fetches++;
      return new Promise((resolve, reject) =>
        init.signal.addEventListener(
          'abort',
          () => reject(new DOMException('Cancelled', 'AbortError')),
          { once: true },
        ),
      );
    },
  });
  const modules = new Map();
  for (const [name, script] of scripts) {
    const module = { exports: {} };
    const require = (id) => {
      if (id === '../lib/i18n') return { t: () => ({}) };
      if (id === 'virtual:astro:adapter-config/client')
        return { internalFetchHeaders: {} };
      if (id === './swap-functions.js')
        return {
          detectScriptExecuted() {},
          swap() {
            assert.fail('Unexpected DOM swap');
          },
        };
      assert.ok(modules.has(id), `Unexpected import: ${id}`);
      return modules.get(id);
    };
    vm.runInContext(
      `(function(exports, require, module) {${script}\n})`,
      context,
    )(module.exports, require, module);
    modules.set(name, module.exports);
  }
  const dispatch = (name) => document.dispatchEvent(new Event(name));
  dispatch('astro:page-load');
  return {
    dispatch,
    panel,
    timers,
    pendingCopies,
    router: modules.get('router'),
    location,
    stats: () => ({ copies, loads, swaps, fetches }),
    async clickShare() {
      trigger.dispatchEvent(new Event('click'));
      await flush();
    },
  };
}

test('sharing remains functional when a fragment cancels an unfinished page navigation', async () => {
  const page = browser();
  await page.clickShare();
  const pending = page.router.navigate('/en/posts/');
  await page.router.navigate('#section');
  await pending;
  await page.clickShare();
  assert.deepEqual(page.stats(), { copies: 2, loads: 1, swaps: 0, fetches: 1 });
  assert.equal(page.location.hash, '#section');
  page.dispatch('astro:before-swap');
  assert.equal(page.timers.size, 0);
});

test('sharing is disposed on actual swaps and initializes without duplicate listeners', async () => {
  const page = browser();
  page.panel.showPopover();
  page.dispatch('astro:before-preparation');
  assert.equal(page.panel.open, true);
  await page.clickShare();
  page.dispatch('astro:before-swap');
  assert.equal(page.panel.open, false);
  assert.equal(page.timers.size, 0);
  await page.clickShare();
  assert.equal(page.stats().copies, 1);
  page.dispatch('astro:page-load');
  page.dispatch('astro:page-load');
  await page.clickShare();
  assert.equal(page.stats().copies, 2);
  page.dispatch('astro:before-swap');
  assert.equal(page.timers.size, 0);
});

test('clipboard operations settling after a swap cannot update or reopen the previous page', async () => {
  for (const failed of [false, true]) {
    const page = browser({ deferCopy: true });
    await page.clickShare();
    page.dispatch('astro:before-swap');
    const pending = page.pendingCopies[0];
    if (failed) pending.reject(new Error('Permission denied'));
    else pending.resolve();
    await flush();
    assert.equal(page.panel.open, false);
    assert.equal(page.timers.size, 0);
  }
});
