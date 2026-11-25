import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { searchTokens } from '../scripts/lib/search-tokens.mjs';
import { contextSnippets } from '../src/lib/search-context.ts';
import { parse } from 'parse5';

test('production Pagefind finds Chinese Markdown headings consistently in full, body and title scopes', async () => {
  const originalFetch = globalThis.fetch;
  const originalDocument = globalThis.document;
  let language = 'zh';
  // Exercise the shipped Pagefind API/WASM directly, serving its real index files
  // in memory. This is not a mock of the search algorithm or its tokenizer.
  globalThis.document = {
    currentScript: null,
    querySelector: () => ({ getAttribute: () => language }),
  };
  globalThis.fetch = async (input) => {
    const path = new URL(input).pathname;
    assert.match(path, /^\/pagefind(?:-title|-body)?\//);
    return new Response(
      await readFile(new URL(`../dist${path}`, import.meta.url)),
    );
  };
  const api = await import('../dist/pagefind/pagefind.js');
  const instances = [];
  const query = async (folder, term) => {
    const instance = api.createInstance({
      basePath: `https://search.invalid/${folder}/`,
    });
    instances.push(instance);
    const results = await instance.search(searchTokens(term), {
      filters: { kind: 'posts', locale: language.toLowerCase() },
    });
    return Promise.all(results.results.map((result) => result.data()));
  };
  try {
    const results = await query('pagefind', '搜索');
    const design = results.find((entry) =>
      entry.url.endsWith('/zh/posts/design/'),
    );
    assert.ok(
      design,
      'A title match must also retain all matching body paragraphs',
    );
    const snippets = contextSnippets(JSON.parse(design.meta.sections), '搜索');
    assert.ok(snippets.length >= 2);
    const html = await readFile('dist/zh/posts/design/index.html', 'utf8');
    const nodes = [];
    const visit = (node) => {
      nodes.push(node);
      (node.childNodes ?? []).forEach(visit);
    };
    visit(parse(html));
    for (const snippet of snippets) {
      const target = nodes.find((node) =>
        node.attrs?.some(
          (attr) => attr.name === 'id' && attr.value === snippet.id,
        ),
      );
      assert.ok(target, `Missing rendered paragraph ${snippet.id}`);
      assert.ok(
        ['p', 'table'].includes(target.tagName),
        'Body matches must link to the actual paragraph/table, not a preceding heading',
      );
    }
    const full = await query('pagefind', '博客');
    const welcome = full.find((entry) =>
      entry.url.endsWith('/zh/posts/welcome/'),
    );
    assert.ok(
      welcome,
      'The pinned welcome post must match 博客 in its Markdown heading',
    );
    assert.ok(
      JSON.parse(welcome.meta.sections).some(
        (section) => section.heading === '从聊天布局到博客',
      ),
    );
    assert.ok(
      (await query('pagefind-body', '从聊天布局到博客')).some((entry) =>
        entry.url.endsWith('/zh/posts/welcome/'),
      ),
    );
    assert.ok(
      !(await query('pagefind-title', '博客')).some((entry) =>
        entry.url.endsWith('/zh/posts/welcome/'),
      ),
    );
    language = 'en';
    assert.ok(
      (await query('pagefind', 'Markdown')).every((entry) =>
        entry.url.includes('/en/'),
      ),
    );
  } finally {
    for (const instance of instances) await instance.destroy();
    globalThis.fetch = originalFetch;
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
  }
});

test('built indexes return no other-language results when the current locale has no public articles', async () => {
  const temporary = path.join(process.cwd(), '.astro');
  await mkdir(temporary, { recursive: true });
  const root = await mkdtemp(path.join(temporary, 'search-locale-test-'));
  const originalFetch = globalThis.fetch;
  const originalDocument = globalThis.document;
  const instances = [];
  let language = 'en';
  try {
    await mkdir(path.join(root, '.astro'));
    await writeFile(path.join(root, '.astro/bloggpt-bundle-assets.json'), '[]');
    // English has a public page but no discoverable articles. Regional English
    // and Chinese do, reproducing Pagefind's parent/largest-index fallbacks.
    for (const [locale, kind] of [
      ['en', 'pages'],
      ['en-US-u-nu-latn', 'posts'],
      ['zh', 'posts'],
    ]) {
      const directory = path.join(root, 'dist', locale, kind, 'visible');
      await mkdir(directory, { recursive: true });
      await writeFile(
        path.join(directory, 'index.html'),
        `<html lang="${locale}"><head><link rel="canonical" href="https://example.com/blog/${locale}/${kind}/visible/"></head><body data-locale="${locale}"><article data-search-record="${kind}" data-search-title="visibilityneedle"><div data-search-content><p>visibilityneedle</p></div></article></body></html>`,
      );
    }
    const build = spawnSync(
      process.execPath,
      [path.resolve('scripts/build-search.mjs')],
      { cwd: root, encoding: 'utf8', windowsHide: true },
    );
    assert.equal(build.status, 0, build.stdout + build.stderr);
    globalThis.document = {
      currentScript: null,
      querySelector: () => ({ getAttribute: () => language }),
    };
    globalThis.fetch = async (input) => {
      const pathname = new URL(input).pathname;
      assert.match(pathname, /^\/pagefind(?:-title|-body)?\//);
      return new Response(
        await readFile(path.join(root, 'dist', pathname.slice(1))),
      );
    };
    const api = await import('../dist/pagefind/pagefind.js');
    const query = async (scope, locale, filtered = true) => {
      language = locale;
      const folder =
        scope === 'title' || scope === 'body'
          ? `pagefind-${scope}`
          : 'pagefind';
      const instance = api.createInstance({
        basePath: `https://search.invalid/${folder}/`,
        baseUrl: '/',
      });
      instances.push(instance);
      const result = await instance.search('visibilityneedle', {
        filters: {
          ...(filtered ? { locale: locale.toLowerCase() } : {}),
          ...(scope === 'articles' ? { kind: 'posts' } : {}),
        },
      });
      return Promise.all(result.results.map((item) => item.data()));
    };
    for (const scope of ['all', 'articles', 'title', 'body']) {
      const english = await query(scope, 'en');
      assert.equal(english.length, scope === 'all' ? 1 : 0, scope);
      assert.ok(english.every((item) => item.url.startsWith('/blog/en/')));
      assert.equal((await query(scope, 'en-GB')).length, 0, scope);
      const regional = await query(scope, 'en-US-u-nu-latn');
      assert.equal(regional.length, 1, scope);
      assert.equal(regional[0].url, '/blog/en-US-u-nu-latn/posts/visible/');
    }
    // Prove the fixture triggers the original failure in the shipped engine.
    for (const scope of ['title', 'body'])
      assert.equal((await query(scope, 'en', false)).length, 1);
  } finally {
    for (const instance of instances) await instance.destroy();
    globalThis.fetch = originalFetch;
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
    assert.equal(path.dirname(root), temporary);
    await rm(root, { recursive: true, force: true });
  }
});
