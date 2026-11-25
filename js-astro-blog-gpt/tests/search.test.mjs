import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { matchesSearch, searchScope } from '../src/lib/search.ts';
import { searchRecords } from '../scripts/lib/search-records.mjs';
import { searchIndexes } from '../src/lib/search-client.ts';
import { contentUrls } from '../src/lib/content-urls.ts';
import { contextSnippets } from '../src/lib/search-context.ts';
import { parse } from 'parse5';

test('rendered paragraphs have unique destinations without replacing author IDs or indexing hidden content', () => {
  const html = `<html lang="zh"><head><link rel="canonical" href="https://example.com/zh/posts/test/"></head><body><nav><p>Navigation</p></nav><span id="search-paragraph-1"></span><main><article data-search-record="posts" data-search-title="搜索"><div class="article-content" data-search-content><h2 id="section">章节搜索</h2><p>第一段搜索 <a href="https://example.org/">链接</a></p><p id="custom">第二段搜索</p><ul><li><p>列表搜索</p><ul><li>嵌套搜索</li></ul></li></ul><aside data-pagefind-ignore><p>Hidden search</p></aside><pre><code>code search</code></pre></div></article></main></body></html>`;
  const rendered = contentUrls(
    html,
    new URL('https://example.com/zh/posts/test/'),
  );
  assert.equal(
    contentUrls(rendered, new URL('https://example.com/zh/posts/test/')),
    rendered,
    'Anchoring must be idempotent',
  );
  const tree = parse(rendered);
  const nodes = [];
  const visit = (node) => {
    nodes.push(node);
    (node.childNodes ?? []).forEach(visit);
  };
  visit(tree);
  const attr = (node, name) =>
    node.attrs?.find((item) => item.name === name)?.value;
  const ids = nodes.map((node) => attr(node, 'id')).filter(Boolean);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(rendered.includes('<p id="custom" data-search-paragraph>'));
  assert.ok(rendered.includes('<nav><p>Navigation</p></nav>'));
  assert.ok(
    rendered.includes(
      '<aside data-pagefind-ignore><p>Hidden search</p></aside>',
    ),
  );
  const [record] = searchRecords(rendered);
  const snippets = contextSnippets(record.sections, '搜索');
  assert.deepEqual(
    snippets.map((item) => item.text),
    ['章节搜索', '第一段搜索 链接', '第二段搜索', '列表搜索', '嵌套搜索'],
  );
  assert.equal(snippets[2].id, 'custom');
  assert.equal(new Set(snippets.map((item) => item.id)).size, snippets.length);
  for (const snippet of snippets.slice(1)) {
    const target = nodes.find((node) => attr(node, 'id') === snippet.id);
    assert.ok(['p', 'li'].includes(target.tagName));
    assert.equal(snippet.heading, '章节搜索');
  }
});

test('cached Pagefind modules create fresh instances after locale navigation and release workers', async () => {
  let language = 'zh';
  const created = [];
  const imported = [];
  const module = {
    createInstance(options) {
      assert.equal(options.baseUrl, '/');
      const instance = {
        language,
        released: false,
        init: async () => {},
        destroy: async () => {
          instance.released = true;
        },
        search: async () => ({ results: [] }),
      };
      created.push(instance);
      return instance;
    },
  };
  const load = async (path) => {
    imported.push(path);
    return module;
  };
  const zh = new AbortController();
  const first = searchIndexes('/blog/', zh.signal, load);
  assert.equal(await first('pagefind'), await first('pagefind'));
  await first('pagefind-title');
  zh.abort();
  await new Promise((resolve) => setImmediate(resolve));
  assert.ok(created.every((instance) => instance.released));
  language = 'en';
  const en = new AbortController();
  const second = searchIndexes('/blog/', en.signal, load);
  assert.equal((await second('pagefind')).language, 'en');
  assert.equal(created.length, 3);
  assert.deepEqual(imported, [
    '/blog/pagefind/pagefind.js',
    '/blog/pagefind-title/pagefind.js',
    '/blog/pagefind/pagefind.js',
  ]);
  const cancelled = new AbortController();
  cancelled.abort();
  await assert.rejects(
    searchIndexes('/blog/', cancelled.signal, load)('pagefind'),
    { name: 'AbortError' },
  );
  assert.equal(created.length, 3);
  en.abort();
});

test('failed Pagefind imports retry with fresh URLs, share in-flight work and cache successful instances', async () => {
  const controller = new AbortController();
  const imports = [];
  const modules = new Map();
  const instance = {
    init: async () => {},
    destroy: async () => {},
    search: async () => ({ results: [] }),
  };
  const load = (url) => {
    // Model the browser module map: fetching the same failed URL fails again.
    if (!modules.has(url)) {
      imports.push(url);
      modules.set(
        url,
        imports.length <= 2
          ? Promise.reject(new Error('Temporary network failure'))
          : Promise.resolve({ createInstance: () => instance }),
      );
    }
    return modules.get(url);
  };
  const get = searchIndexes('/blog/', controller.signal, load);
  for (let attempt = 0; attempt < 2; attempt++) {
    const first = get('pagefind');
    assert.equal(get('pagefind'), first);
    await assert.rejects(first, /Temporary network failure/);
  }
  const retried = get('pagefind');
  assert.equal(get('pagefind'), retried);
  assert.equal(await retried, instance);
  assert.equal(await get('pagefind'), instance);
  assert.deepEqual(await instance.search('example'), { results: [] });
  assert.equal(imports[0], '/blog/pagefind/pagefind.js');
  assert.equal(imports.length, 3);
  assert.equal(new Set(imports).size, 3);
  for (const url of imports.slice(1))
    assert.match(url, /^\/blog\/pagefind\/pagefind\.js\?retry=\d+$/);
  await get('pagefind-title');
  assert.equal(imports.at(-1), '/blog/pagefind-title/pagefind.js');
  controller.abort();
  const calls = imports.length;
  await assert.rejects(get('pagefind'), { name: 'AbortError' });
  assert.equal(imports.length, calls);
  // A later page must reuse the recovered URL, avoiding the cached failure.
  const next = new AbortController();
  assert.equal(
    await searchIndexes('/blog/', next.signal, load)('pagefind'),
    instance,
  );
  assert.equal(imports.length, calls);
  next.abort();
});

test('a cancelled Pagefind import cannot create an instance or retry after navigation', async () => {
  const controller = new AbortController();
  let resolve;
  let calls = 0;
  let created = 0;
  const get = searchIndexes('/', controller.signal, () => {
    calls++;
    return new Promise((done) => {
      resolve = done;
    });
  });
  const pending = get('pagefind');
  await new Promise((done) => setImmediate(done));
  controller.abort();
  resolve({
    createInstance() {
      created++;
    },
  });
  await assert.rejects(pending, { name: 'AbortError' });
  await assert.rejects(get('pagefind'), { name: 'AbortError' });
  assert.equal(calls, 1);
  assert.equal(created, 0);
});

test('invalidating a failed index always destroys it once and cannot evict its replacement', async () => {
  const controller = new AbortController();
  const instances = [];
  const get = searchIndexes('/recovery/', controller.signal, async () => ({
    createInstance() {
      const failed = instances.length === 0;
      const instance = {
        destroyed: 0,
        init: async () => {
          if (failed) throw new Error('Initialization failed');
        },
        destroy: async () => {
          instance.destroyed++;
        },
        search: async () => {
          if (failed) throw new Error('Index unavailable');
          return { results: [] };
        },
      };
      instances.push(instance);
      return instance;
    },
  }));
  const first = await get('pagefind');
  await assert.rejects(first.search('query'), /Index unavailable/);
  await Promise.all([
    get.invalidate('pagefind', first),
    get.invalidate('pagefind', first),
  ]);
  assert.equal(instances[0].destroyed, 1);
  const second = await get('pagefind');
  assert.notEqual(second, first);
  await get.invalidate('pagefind', first);
  assert.equal(await get('pagefind'), second);
  assert.equal(instances[1].destroyed, 0);
  assert.deepEqual(await second.search('query'), { results: [] });
  controller.abort();
  await get.invalidate('pagefind', second);
  assert.equal(instances[0].destroyed, 1);
  assert.equal(instances[1].destroyed, 1);
});

test('search scopes separate post title/description/body and exclude other content by default', () => {
  const entry = {
    title: 'TitleToken',
    description: 'SummaryToken',
    body: 'BodyToken',
    url: '/zh/posts/test/',
    kind: 'posts',
  };
  assert.equal(searchScope(null), 'articles');
  assert.equal(searchScope('invalid'), 'articles');
  assert.equal(matchesSearch(entry, 'summarytoken', 'title'), true);
  assert.equal(matchesSearch(entry, 'bodytoken', 'title'), false);
  assert.equal(matchesSearch(entry, 'summarytoken', 'body'), false);
  assert.equal(matchesSearch(entry, 'bodytoken', 'body'), true);
  assert.equal(matchesSearch(entry, 'titleToken bodytoken', 'articles'), true);
  for (const kind of ['pages', 'categories', 'tags']) {
    const other = { ...entry, kind };
    for (const scope of ['articles', 'title', 'body'])
      assert.equal(matchesSearch(other, 'bodytoken', scope), false);
    assert.equal(matchesSearch(other, 'bodytoken', 'all'), true);
  }
});

test('rendered index extraction ignores navigation, share dialogs, title metadata and hidden script text in body', () => {
  const html = `<html lang="zh-CN"><head><link rel="canonical" href="https://example.com/blog/zh/about/"></head><body><nav>Noise</nav><article data-search-record="pages" data-search-title="A &amp; B" data-search-description="Description"><h1>Title</h1><div data-search-content><p>Rendered <strong>MDX</strong></p><p>Next paragraph</p><script>Secret</script><span data-pagefind-ignore>Ignore</span></div><section>Share dialog</section></article></body></html>`;
  assert.deepEqual(searchRecords(html), [
    {
      url: '/blog/zh/about/',
      language: 'zh-CN',
      kind: 'pages',
      title: 'A & B',
      description: 'Description',
      body: 'Rendered MDX Next paragraph',
      sections: [{ heading: '', id: '', text: 'Rendered MDX Next paragraph' }],
    },
  ]);
});

test('production indexes all four public content types and preserves independent page and bundle links', async () => {
  for (const folder of ['pagefind', 'pagefind-title', 'pagefind-body'])
    await access(`dist/${folder}/pagefind.js`);
  const routes = [
    ['posts/content-bundle', 'posts'],
    ['about', 'pages'],
    ['categories/guide', 'categories'],
    ['tags/astro', 'tags'],
  ];
  for (const [route, kind] of routes) {
    const html = await readFile(`dist/zh/${route}/index.html`, 'utf8');
    const records = searchRecords(html);
    assert.equal(records.length, 1);
    assert.equal(records[0].kind, kind);
    assert.ok(records[0].body.length > 20);
    assert.equal(records[0].body.includes('Powered by'), false);
    assert.equal(records[0].body.includes('Facebook'), false);
  }
  const unlisted = await readFile('dist/zh/posts/unlisted/index.html', 'utf8');
  assert.deepEqual(searchRecords(unlisted), []);
  const about = await readFile('dist/zh/about/index.html', 'utf8');
  assert.ok(about.includes('class="article-column"'));
  assert.ok(about.includes('data-article-toc'));
  await access('dist/zh/page-og/about.png');
  const list = await readFile('dist/zh/posts/index.html', 'utf8');
  assert.ok(list.includes('src="/images/covers/writing-typography.webp"'));
  const taxonomy = await readFile(
    'dist/zh/categories/guide/index.html',
    'utf8',
  );
  assert.ok(
    taxonomy.indexOf('taxonomy-detail-cover') < taxonomy.indexOf('<h1>'),
  );
});
