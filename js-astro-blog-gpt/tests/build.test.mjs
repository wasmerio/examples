import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { join } from 'node:path';

test('production pages, RSS and Sitemap enforce article visibility', async () => {
  await access('dist/zh/posts/unlisted/index.html');
  await assert.rejects(access('dist/zh/posts/draft-example/index.html'));
  await assert.rejects(access('dist/zh/posts/future-example/index.html'));
  for (const lang of ['zh', 'en']) {
    const list = await readFile(`dist/${lang}/posts/index.html`, 'utf8');
    const home = await readFile(`dist/${lang}/index.html`, 'utf8');
    const feed = await readFile(`dist/${lang}/rss.xml`, 'utf8');
    for (const html of [list, home, feed])
      for (const slug of ['unlisted', 'draft-example', 'future-example'])
        assert.equal(html.includes(`/posts/${slug}/`), false);
  }
  const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
  assert.ok(sitemap.includes('/zh/posts/welcome/'));
  assert.equal(sitemap.includes('/posts/unlisted/'), false);
  assert.equal(sitemap.includes('/search/'), false);
  await access('dist/pagefind/pagefind.js');
  const hidden = await readFile('dist/zh/posts/unlisted/index.html', 'utf8');
  assert.ok(hidden.includes('noindex,nofollow'));
  assert.equal(hidden.includes('data-pagefind-body'), false);
});

test('rendered Markdown never points to stale code-renderer assets', async () => {
  async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    return (
      await Promise.all(
        entries.map((entry) =>
          entry.isDirectory()
            ? walk(join(directory, entry.name))
            : [join(directory, entry.name)],
        ),
      )
    ).flat();
  }
  const checked = new Set();
  for (const file of (await walk('dist')).filter((file) =>
    file.endsWith('.html'),
  )) {
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(/(?:src|href)="(\/_astro\/[^"#]+)"/g)) {
      const asset = match[1];
      if (!checked.has(asset)) {
        await access(join('dist', asset));
        checked.add(asset);
      }
    }
  }
  assert.ok([...checked].some((asset) => /ec\..*\.css$/.test(asset)));
});

test('random recent article candidates are public, local, and generated', async () => {
  for (const lang of ['zh', 'en']) {
    const html = await readFile(`dist/${lang}/index.html`, 'utf8');
    const attribute = html.match(/data-random-posts="([^"]+)"/);
    assert.ok(attribute, 'Homepage exposes random article candidates');
    const urls = JSON.parse(attribute[1].replaceAll('&quot;', '"'));
    assert.ok(urls.length > 1);
    assert.equal(new Set(urls).size, urls.length);
    for (const url of urls) {
      assert.ok(url.startsWith(`/${lang}/posts/`));
      assert.ok(!/unlisted|draft-example|future-example/.test(url));
      const article = await readFile(join('dist', url, 'index.html'), 'utf8');
      assert.ok(article.includes('data-pagefind-body'));
      assert.ok(!article.includes('noindex,nofollow'));
    }
  }
});

test('generated taxonomy pages and bundles preserve content and colocated resources', async () => {
  for (const lang of ['zh', 'en']) {
    const guide = await readFile(
      `dist/${lang}/categories/guide/index.html`,
      'utf8',
    );
    const tags = await readFile(`dist/${lang}/tags/astro/index.html`, 'utf8');
    const post = await readFile(
      `dist/${lang}/posts/content-bundle/index.html`,
      'utf8',
    );
    assert.ok(guide.includes('class="content-intro"'));
    assert.ok(tags.includes('class="content-intro"'));
    assert.ok(guide.includes('class="post-list"'));
    assert.ok(guide.includes('src="/images/covers/getting-started.webp"'));
    assert.ok(
      post.includes(`href="/${lang}/posts/content-bundle/example.html"`),
    );
    for (const file of [
      'cover.webp',
      'example.html',
      'resources/readme.txt',
      'resources/example.py',
      'resources/notes.md',
      'resources/example.zip',
    ])
      assert.deepEqual(
        await readFile(`dist/${lang}/posts/content-bundle/${file}`),
        await readFile(`content/posts/demos/content-bundle/${file}`),
      );
    await assert.rejects(
      access(`dist/${lang}/categories/resources/readme.txt`),
    );
    await assert.rejects(
      access(`dist/${lang}/posts/content-bundle/index.${lang}.mdx`),
    );
    const categoryList = await readFile(
      `dist/${lang}/categories/index.html`,
      'utf8',
    );
    assert.ok(
      categoryList.indexOf('class="content-intro"') <
        categoryList.indexOf('class="taxonomy-grid"'),
    );
    for (const route of ['archives', 'links']) {
      const html = await readFile(`dist/${lang}/${route}/index.html`, 'utf8');
      assert.ok(html.includes('class="content-intro"'));
    }
  }
  const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
  assert.equal(sitemap.includes('example.html'), false);
  assert.equal(sitemap.includes('resources/notes'), false);
  const categories = await readFile('dist/zh/categories/index.html', 'utf8');
  assert.ok(categories.includes('入门与发布'));
});
