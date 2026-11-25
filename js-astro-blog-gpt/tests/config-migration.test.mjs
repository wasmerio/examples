import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, access } from 'node:fs/promises';
import { parse } from 'parse5';
import config from '../blog.config.ts';
import friends from '../friends.config.ts';
import { siteAddress } from '../src/lib/site-url.ts';
import { validateConfig } from '../src/lib/validate-config.ts';
import {
  sineValue,
  sinePath,
} from '../content/posts/demos/article-enhancements/sine-wave.ts';

test('baseUrl derives deployment paths without duplicating the origin or directory', () => {
  for (const value of [
    'https://example.org/blog',
    'https://example.org/blog/',
  ]) {
    assert.deepEqual(siteAddress(value), {
      baseUrl: 'https://example.org/blog/',
      url: 'https://example.org',
      base: '/blog/',
    });
  }
  assert.equal(siteAddress('https://example.org').base, '/');
  assert.equal(
    new URL(
      '/blog/ja/posts/2026/hello/',
      siteAddress('https://example.org/blog/').url,
    ).href,
    'https://example.org/blog/ja/posts/2026/hello/',
  );
  for (const value of [
    'relative/',
    'file:///tmp/blog',
    'https://u:p@example.org/',
    'https://example.org/?q=a',
    'https://example.org/#fragment',
  ])
    assert.throws(() => siteAddress(value));
});

test('menu and random article limits are independent and accept all-article sized limits', () => {
  const custom = structuredClone(config);
  custom.posts.menuLimit = 99999;
  custom.posts.randomLimit = 1;
  assert.doesNotThrow(() => validateConfig(custom));
  for (const field of ['menuLimit', 'randomLimit'])
    for (const invalid of [0, -1, 1.5, NaN]) {
      const bad = structuredClone(config);
      bad.posts[field] = invalid;
      assert.throws(() => validateConfig(bad));
    }
  assert.equal('recentLimit' in config.sidebar, false);
  assert.equal('homeSubtitle' in config.text, false);
  assert.ok(config.sidebar.menu.every((item) => !('icon' in item)));
  assert.ok(Array.isArray(friends));
  assert.ok(
    friends
      .flatMap((group) => group.links)
      .every((link) => link.avatar && !('icon' in link)),
  );
});

test('sine graph applies amplitude, period and phase independently with bounded SVG geometry', () => {
  const wave = { amplitude: 2, period: 4, phase: 0 };
  assert.ok(Math.abs(sineValue(1, wave) - 2) < 1e-10);
  assert.ok(Math.abs(sineValue(5, wave) - sineValue(1, wave)) < 1e-10);
  assert.ok(
    Math.abs(sineValue(0, { ...wave, phase: Math.PI / 2 }) - 2) < 1e-10,
  );
  const normal = sinePath(wave);
  assert.notEqual(normal, sinePath({ ...wave, amplitude: 1 }));
  assert.notEqual(normal, sinePath({ ...wave, period: 2 }));
  assert.notEqual(normal, sinePath({ ...wave, phase: 1 }));
  assert.equal((normal.match(/L/g) ?? []).length, 480);
  assert.doesNotMatch(normal, /NaN|Infinity/);
});

test('demo pages are index language bundles and builtins share page titles and descriptions', async () => {
  for (const entry of await readdir('content/pages', { withFileTypes: true })) {
    assert.ok(entry.isDirectory());
    assert.ok(
      (await readdir(`content/pages/${entry.name}`)).every((name) =>
        /^index\.(zh|en)\.mdx?$/.test(name),
      ),
    );
  }
  await access('public/images/avatar.webp');
  await assert.rejects(access('public/images/gradients'));
  await assert.rejects(access('content/categories/guide/cover.webp'));
  const attr = (node, key) =>
    node.attrs?.find((item) => item.name === key)?.value;
  const find = (node, predicate) =>
    predicate(node)
      ? node
      : (node.childNodes ?? [])
          .map((child) => find(child, predicate))
          .find(Boolean);
  const text = (node) =>
    node.nodeName === '#text'
      ? node.value
      : (node.childNodes ?? []).map(text).join('');
  for (const lang of ['zh', 'en'])
    for (const route of ['links', 'posts', 'categories', 'archives']) {
      const source = await readFile(
        `content/pages/${route}/index.${lang}.md`,
        'utf8',
      );
      const title = source.match(/^title: '([^']+)'/m)[1];
      const description = source.match(/^description: '([^']+)'/m)[1];
      const tree = parse(
        await readFile(`dist/${lang}/${route}/index.html`, 'utf8'),
      );
      const heading = find(
        tree,
        (node) => attr(node, 'class') === 'page-heading',
      );
      assert.ok(heading);
      assert.equal(text(find(heading, (node) => node.tagName === 'h1')), title);
      assert.equal(
        text(find(heading, (node) => node.tagName === 'p')),
        description,
      );
      assert.equal(
        attr(
          find(
            tree,
            (node) =>
              node.tagName === 'meta' && attr(node, 'name') === 'description',
          ),
          'content',
        ),
        description,
      );
    }
  for (const lang of ['zh', 'en']) {
    const html = await readFile(
      `dist/${lang}/posts/article-enhancements/index.html`,
      'utf8',
    );
    const tree = parse(html);
    const wave = find(tree, (node) => node.tagName === 'bloggpt-sine-wave');
    assert.ok(wave);
    for (const name of ['amplitude', 'period', 'phase'])
      assert.ok(
        find(
          wave,
          (node) => node.tagName === 'input' && attr(node, 'name') === name,
        ),
      );
    assert.ok(
      find(
        wave,
        (node) =>
          node.tagName === 'path' && attr(node, 'data-sine-path') !== undefined,
      ),
    );
  }
});
