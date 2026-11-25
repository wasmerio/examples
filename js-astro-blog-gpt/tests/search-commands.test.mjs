import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import { searchTokens } from '../scripts/lib/search-tokens.mjs';
import { searchScope, matchesSearch } from '../src/lib/search.ts';
import { searchIndexes } from '../src/lib/search-client.ts';

const script = ts.transpileModule(await readFile('src/scripts/ui.ts', 'utf8'), {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
  },
}).outputText;

// Exercise the real submit/search handlers while supplying the DOM and index.
function browser(home = false, options = {}) {
  const events = new Map();
  const submits = [];
  const navigations = [];
  const queries = [];
  const filters = [];
  const input = { value: '', addEventListener() {}, dispatchEvent() {} };
  const scope = { value: 'articles' };
  const output = { replaceChildren() {}, append() {}, addEventListener() {} };
  const container = {
    classList: { contains: (name) => name === 'search-page' },
    querySelector: () => output,
  };
  const form = {
    querySelector: (selector) =>
      selector === 'input[name="q"]'
        ? input
        : selector === 'input[name="scope"]'
          ? scope
          : null,
    querySelectorAll: () => [],
    closest: () => (home ? null : container),
    addEventListener(event, callback) {
      if (event === 'submit') submits.push(callback);
    },
  };
  const styles = new Map();
  const root = {
    dataset: {
      defaultTheme: 'light',
      sidebarDefaultWidth: '340',
      sidebarMinWidth: '240',
      sidebarMaxWidth: '500',
    },
    style: {
      getPropertyValue: (name) => styles.get(name) ?? '',
      setProperty: (name, value) => styles.set(name, value),
    },
  };
  const document = {
    documentElement: root,
    body: {
      dataset: {
        locale: options.locale ?? 'en',
        base: '/',
        localeRoot: '/en/',
        languageUrls: '{"en":"/en/"}',
        searchDev: options.dev ? 'true' : 'false',
      },
    },
    querySelector: () => null,
    querySelectorAll: (selector) =>
      selector === '[data-search-form]' ? [form] : [],
    createElement: () => ({}),
    addEventListener(event, callback) {
      const callbacks = events.get(event) ?? [];
      callbacks.push(callback);
      events.set(event, callbacks);
    },
  };
  vm.runInNewContext(script, {
    document,
    window: { addEventListener() {} },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    innerWidth: 1440,
    navigator: { platform: 'Win32' },
    localStorage: { getItem: () => null, setItem() {} },
    location: { href: 'https://example.com/en/search/', search: '' },
    history: { replaceState() {} },
    fetch: options.fetch,
    AbortController,
    Event,
    URL,
    URLSearchParams,
    setTimeout,
    clearTimeout,
    exports: {},
    require(name) {
      if (name === '../lib/i18n') return { t: () => ({}) };
      if (name === '../lib/search') return { searchScope, matchesSearch };
      if (name === '../../scripts/lib/search-tokens.mjs')
        return { searchTokens };
      if (name === 'astro:transitions/client')
        return {
          navigate: (url) => {
            navigations.push(url);
            return Promise.resolve();
          },
        };
      if (name === '../lib/search-client')
        return {
          searchIndexes:
            options.searchIndexes ??
            (() => async (folder) => ({
              search: async (query, options) => {
                queries.push({ folder, query });
                filters.push(JSON.parse(JSON.stringify(options?.filters)));
                return { results: [] };
              },
            })),
        };
      return new Proxy({}, { get: () => () => {} });
    },
  });
  events.get('astro:page-load').forEach((callback) => callback());
  return {
    input,
    scope,
    navigations,
    queries,
    filters,
    theme: () => root.dataset.theme,
    async submit(value = input.value) {
      input.value = value;
      let cancelled = false;
      let stopped = false;
      const event = {
        preventDefault() {
          cancelled = true;
        },
        stopImmediatePropagation() {
          stopped = true;
        },
      };
      for (const submit of submits) {
        submit(event);
        if (stopped) break;
      }
      await new Promise((done) => setImmediate(done));
      return cancelled;
    },
  };
}

test('title searches never execute commands, including repeated submits and homepage forms', async () => {
  for (const query of [
    '@/theme dark',
    '@/lang en',
    '@/random',
    '  @ /theme dark  ',
  ]) {
    const page = browser();
    await page.submit(query);
    await page.submit();
    assert.equal(page.theme(), 'light');
    assert.deepEqual(page.navigations, []);
    assert.equal(page.input.value, query);
    assert.equal(page.scope.value, 'title');
    assert.deepEqual(
      page.queries,
      Array.from({ length: 2 }, () => ({
        folder: 'pagefind-title',
        query: query.trim().slice(1).trim(),
      })),
    );
    const home = browser(true);
    assert.equal(await home.submit(query), false);
    assert.equal(home.input.value, query);
    assert.equal(home.scope.value, 'title');
    assert.deepEqual(home.navigations, []);
    assert.equal(home.theme(), 'light');
  }
});

test('explicit commands still execute after a title search, and ordinary queries still search articles', async () => {
  const page = browser();
  await page.submit('@Regular title');
  assert.equal(page.scope.value, 'title');
  const searches = page.queries.length;
  await page.submit('/theme dark');
  assert.equal(page.theme(), 'dark');
  assert.equal(page.queries.length, searches);
  await page.submit('/lang en');
  assert.deepEqual(page.navigations, ['/en/']);
  assert.equal(page.queries.length, searches);
  const ordinary = browser();
  await ordinary.submit('Regular title');
  assert.deepEqual(ordinary.queries, [
    { folder: 'pagefind', query: 'Regular title' },
  ]);
});

test('every production search scope filters by the exact current locale', async () => {
  for (const locale of ['en', 'en-US-u-nu-latn']) {
    const page = browser(false, { locale });
    for (const scope of ['all', 'articles', 'title', 'body']) {
      page.scope.value = scope;
      await page.submit('Markdown');
    }
    assert.deepEqual(page.filters, [
      { locale: locale.toLowerCase() },
      { locale: locale.toLowerCase(), kind: 'posts' },
      { locale: locale.toLowerCase() },
      { locale: locale.toLowerCase() },
    ]);
  }
});

test('failed index initialization and fragment loads are released before the next UI search', async () => {
  for (const phase of ['metadata', 'fragment']) {
    const instances = [];
    let indexes;
    const page = browser(false, {
      searchIndexes(base, signal) {
        indexes = searchIndexes(base, signal, async () => ({
          createInstance() {
            const failed = instances.length === 0;
            const instance = {
              destroyed: 0,
              init: async () => {},
              destroy: async () => {
                instance.destroyed++;
              },
              search: async () => {
                if (!failed) return { results: [] };
                if (phase === 'metadata')
                  throw new Error('Metadata unavailable');
                return {
                  results: [
                    {
                      data: async () => {
                        throw new Error('Fragment unavailable');
                      },
                    },
                  ],
                };
              },
            };
            instances.push(instance);
            return instance;
          },
        }));
        return indexes;
      },
    });
    await page.submit('Markdown');
    assert.equal(instances.length, 1, phase);
    assert.equal(instances[0].destroyed, 1, phase);
    await page.submit('Markdown');
    assert.equal(instances.length, 2, phase);
    assert.equal(instances[1].destroyed, 0, phase);
    await indexes.invalidate('pagefind', instances[1]);
    assert.equal(instances[1].destroyed, 1, phase);
  }
});

test('development search retries failed JSON index requests and then reuses the successful response', async () => {
  for (const fail of [
    () => {
      throw new Error('Network failure');
    },
    () => new Response('', { status: 503 }),
    () => new Response('invalid json'),
  ]) {
    let calls = 0;
    const page = browser(false, {
      dev: true,
      fetch: async () => (++calls === 1 ? fail() : Response.json([])),
    });
    await page.submit('Markdown');
    await page.submit('Markdown');
    assert.equal(calls, 2);
    await page.submit('Markdown');
    assert.equal(calls, 2);
  }
});
