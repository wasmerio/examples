import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { parse } from 'parse5';
import remarkCallouts from '../src/plugins/remark-callouts.ts';

function descendants(node, predicate, found = []) {
  if (predicate(node)) found.push(node);
  for (const child of node.childNodes ?? [])
    descendants(child, predicate, found);
  return found;
}
const attr = (node, name) =>
  node.attrs?.find((attribute) => attribute.name === name)?.value;

test('localized MDX renders math, callouts, and valid hierarchical heading links', async () => {
  for (const lang of ['zh', 'en']) {
    const html = await readFile(
      `dist/${lang}/posts/article-enhancements/index.html`,
      'utf8',
    );
    assert.match(html, /class="katex"/);
    assert.match(html, /class="katex-display"/);
    assert.match(html, /class="callout callout-note"/);
    assert.match(html, /data-callout="warning"/);
    assert.match(html, /data-delay="1000"/);
    const tree = parse(html);
    const rail = descendants(
      tree,
      (node) => attr(node, 'data-toc-rail') !== undefined,
    )[0];
    const links = descendants(rail, (node) => node.tagName === 'a');
    assert.ok(links.length >= 6);
    const ids = new Set(
      descendants(tree, (node) => /^h[1-6]$/.test(node.tagName ?? '')).map(
        (node) => attr(node, 'id'),
      ),
    );
    for (const link of links) assert.ok(ids.has(attr(link, 'href').slice(1)));
    assert.equal(new Set(links.map((link) => attr(link, 'style'))).size, 2);
    assert.ok(
      html.includes('data-language="mermaid"'),
      'Original source remains usable without JS',
    );
    const styles = descendants(
      tree,
      (node) => node.tagName === 'link' && attr(node, 'rel') === 'stylesheet',
    ).map((node) => attr(node, 'href'));
    assert.ok(styles.some((url) => /katex\.min/.test(url)));
    assert.equal(
      styles.some((url) => /photoswipe/i.test(url)),
      false,
      'Lightbox stylesheet waits for the first interaction',
    );
  }
});

test('share cards are real PNG files, use one canonical social image, and respect per-post opt-out', async () => {
  for (const lang of ['zh', 'en']) {
    const png = await readFile(`dist/${lang}/og/article-enhancements.png`);
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);
    const html = await readFile(
      `dist/${lang}/posts/article-enhancements/index.html`,
      'utf8',
    );
    assert.match(
      html,
      new RegExp(
        `property="og:image" content="https://example.com/${lang}/og/article-enhancements.png"`,
      ),
    );
    assert.equal((html.match(/name="twitter:card"/g) ?? []).length, 1);
    assert.match(html, /content="summary_large_image"/);
    const optedOut = await readFile(
      `dist/${lang}/posts/reading-sample/index.html`,
      'utf8',
    );
    assert.equal(optedOut.includes('data-article-toc'), false);
    await assert.rejects(access(`dist/${lang}/og/reading-sample.png`));
    await assert.rejects(access(`dist/${lang}/og/draft-example.png`));
    await assert.rejects(access(`dist/${lang}/og/future-example.png`));
  }
});

test('callout transformation preserves nested Markdown and unknown quote markers', () => {
  const quote = (marker) => ({
    type: 'blockquote',
    children: [
      {
        type: 'paragraph',
        children: [
          { type: 'text', value: marker },
          { type: 'strong', children: [{ type: 'text', value: 'body' }] },
        ],
      },
    ],
  });
  const custom = quote('[!TIP] Custom heading\n');
  const unknown = quote('[!UNKNOWN]\n');
  const localized = quote('[!NOTE]\nContent');
  const tree = { type: 'root', children: [custom, unknown, localized] };
  remarkCallouts()(tree, { path: 'example.en.md' });
  assert.equal(custom.data.hName, 'aside');
  assert.equal(custom.children[0].children[0].value, 'Custom heading');
  assert.equal(custom.children[1].children[0].type, 'strong');
  assert.equal(unknown.data, undefined);
  assert.equal(localized.children[0].children[0].value, 'Note');
  assert.equal(localized.children[1].children[0].value, 'Content');
});

test('enhancement guides retain normal reading controls while presenting overrides as code', async () => {
  for (const lang of ['zh', 'en']) {
    const html = await readFile(
      `dist/${lang}/posts/enhancement-overrides/index.html`,
      'utf8',
    );
    assert.equal(html.includes('class="katex"'), false);
    assert.equal(html.includes('class="callout callout-note"'), false);
    assert.match(html, /data-article-toc/);
    assert.match(html, /data-mermaid="true"/);
    assert.match(html, /data-lightbox="true"/);
    assert.match(html, /data-share-trigger/);
    await access(`dist/${lang}/og/enhancement-overrides.png`);
  }
});

test('builtin introductions provide titles, categories link tags, and friends search follows body content', async () => {
  for (const lang of ['zh', 'en']) {
    const posts = await readFile(`dist/${lang}/posts/index.html`, 'utf8');
    const secondPage = await readFile(
      `dist/${lang}/posts/page/2/index.html`,
      'utf8',
    );
    assert.ok(posts.includes('class="content-intro"'));
    assert.equal(secondPage.includes('class="content-intro"'), false);
    assert.ok(
      posts.includes(
        lang === 'zh' ? '功能导览与演示' : 'Feature guides and samples',
      ),
    );
    const categories = await readFile(
      `dist/${lang}/categories/index.html`,
      'utf8',
    );
    assert.ok(
      categories.includes(lang === 'zh' ? '按主题浏览' : 'Browse by topic'),
    );
    assert.match(categories, /class="tag-cloud"/);
    assert.ok(categories.includes(`href="/${lang}/tags/astro/"`));
    for (const mode of ['fade', 'background'])
      assert.ok(categories.includes(`data-cover-style="${mode}"`));
    const tags = await readFile(`dist/${lang}/tags/index.html`, 'utf8');
    assert.ok(tags.includes('data-cover-style="thumbnail"'));
    const friends = await readFile(`dist/${lang}/links/index.html`, 'utf8');
    assert.ok(
      friends.indexOf('class="content-intro"') <
        friends.indexOf('class="friends-search"'),
    );
    assert.ok(
      friends.indexOf('class="friends-search"') <
        friends.indexOf('class="friend-group"'),
    );
    assert.ok(
      friends.indexOf('Powered by') < friends.indexOf('© Licensed under'),
    );
  }
});
