import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const script = ts.transpileModule(await readFile('src/scripts/ui.ts', 'utf8'), {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
  },
}).outputText;

// Exercise the actual page-load, theme controls and before-swap handlers.
function browser(storage, defaultTheme = 'light') {
  const events = new Map();
  const mediaEvents = new Map();
  const controls = new Map();
  const resizeEvents = new Map();
  const windowEvents = new Map();
  const resizeHandle = {
    setAttribute() {},
    addEventListener: (event, callback) => resizeEvents.set(event, callback),
  };
  const buttons = ['light', 'dark', 'system'].map((theme) => ({
    dataset: { themeOption: theme },
    setAttribute() {},
    closest() {
      return null;
    },
    addEventListener(event, callback) {
      controls.set(`${theme}:${event}`, callback);
    },
  }));
  const element = () => {
    const styles = new Map();
    return {
      dataset: {
        defaultTheme,
        sidebarDefaultWidth: '340',
        sidebarMinWidth: '240',
        sidebarMaxWidth: '500',
      },
      style: {
        getPropertyValue: (name) => styles.get(name) ?? '',
        setProperty: (name, value) => styles.set(name, value),
      },
    };
  };
  const document = {
    documentElement: element(),
    body: { dataset: { locale: 'en', base: '/', localeRoot: '/en/' } },
    querySelector: (selector) =>
      selector === '[data-sidebar-resize]' ? resizeHandle : null,
    querySelectorAll: (selector) =>
      selector === '[data-theme-option]' ? buttons : [],
    addEventListener(event, callback) {
      const listeners = events.get(event) ?? [];
      listeners.push(callback);
      events.set(event, listeners);
    },
  };
  const media = {
    matches: false,
    addEventListener: (event, callback) => mediaEvents.set(event, callback),
  };
  const context = {
    document,
    window: {
      addEventListener: (event, callback) => windowEvents.set(event, callback),
    },
    innerWidth: 1440,
    navigator: { platform: 'Win32' },
    localStorage: storage,
    matchMedia: () => media,
    AbortController,
    setTimeout,
    clearTimeout,
    exports: {},
    require(name) {
      if (name === '../lib/i18n') return { t: () => ({}) };
      return new Proxy({}, { get: () => () => {} });
    },
  };
  vm.runInNewContext(script, context);
  const dispatch = (event, data) =>
    events.get(event)?.forEach((callback) => callback(data));
  dispatch('astro:page-load');
  return {
    theme: () => document.documentElement.dataset.theme,
    select: (theme) => controls.get(`${theme}:click`)(),
    width: () =>
      document.documentElement.style.getPropertyValue('--sidebar-width'),
    resize(key, shiftKey = false) {
      resizeEvents.get('keydown')({ key, shiftKey, preventDefault() {} });
    },
    viewport(width) {
      context.innerWidth = width;
      windowEvents.get('resize')();
    },
    navigate() {
      const next = { documentElement: element() };
      dispatch('astro:before-swap', { newDocument: next });
      const swapTheme = next.documentElement.dataset.theme;
      document.documentElement = next.documentElement;
      dispatch('astro:page-load');
      return swapTheme;
    },
    systemDark(matches) {
      media.matches = matches;
      mediaEvents.get('change')();
    },
  };
}

test('manual theme survives client navigation when storage reads and writes are blocked', () => {
  const page = browser({
    getItem() {
      throw new Error('Storage disabled');
    },
    setItem() {
      throw new Error('Storage disabled');
    },
  });
  assert.equal(page.theme(), 'light');
  page.select('dark');
  assert.equal(page.theme(), 'dark');
  assert.equal(page.navigate(), 'dark');
  assert.equal(page.theme(), 'dark');
  page.systemDark(false);
  assert.equal(page.theme(), 'dark');
  page.select('system');
  page.systemDark(true);
  assert.equal(page.navigate(), 'dark');
  assert.equal(page.theme(), 'dark');
  page.systemDark(false);
  assert.equal(page.theme(), 'light');
});

test('a failed storage write cannot restore a stale saved theme on navigation', () => {
  const page = browser({
    getItem: () => 'light',
    setItem() {
      throw new Error('Quota exceeded');
    },
  });
  page.select('dark');
  page.navigate();
  page.navigate();
  assert.equal(page.theme(), 'dark');
});

test('initial theme still honors saved preferences and validates invalid saved values', () => {
  const saved = browser({ getItem: () => 'dark', setItem() {} });
  assert.equal(saved.theme(), 'dark');
  const invalid = browser({ getItem: () => 'invalid', setItem() {} }, 'dark');
  assert.equal(invalid.theme(), 'light');
  const defaults = browser({ getItem: () => null, setItem() {} }, 'dark');
  assert.equal(defaults.theme(), 'dark');
});

test('sidebar width and reset survive navigation when storage writes fail', () => {
  const page = browser({
    getItem: (key) => (key === 'bloggpt-sidebar-width' ? '360' : null),
    setItem() {
      throw new Error('Quota exceeded');
    },
  });
  assert.equal(page.width(), '360px');
  page.resize('ArrowRight');
  assert.equal(page.width(), '368px');
  page.navigate();
  page.navigate();
  assert.equal(page.width(), '368px');
  page.resize('Home');
  page.navigate();
  assert.equal(page.width(), '340px');
});

test('sidebar width survives unavailable storage and retains its preference across viewport limits', () => {
  const blocked = browser({
    getItem() {
      throw new Error('Storage disabled');
    },
    setItem() {
      throw new Error('Storage disabled');
    },
  });
  blocked.resize('ArrowRight', true);
  blocked.navigate();
  assert.equal(blocked.width(), '372px');

  const saved = browser({
    getItem: (key) => (key === 'bloggpt-sidebar-width' ? '500' : null),
    setItem() {
      throw new Error('Quota exceeded');
    },
  });
  saved.resize('ArrowLeft');
  assert.equal(saved.width(), '492px');
  saved.viewport(800);
  assert.equal(saved.width(), '480px');
  saved.navigate();
  assert.equal(saved.width(), '480px');
  saved.viewport(1440);
  assert.equal(saved.width(), '492px');
});
