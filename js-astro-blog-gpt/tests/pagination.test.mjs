import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parse } from 'parse5';
import config from '../blog.config.ts';

const attr = (node, name) =>
  node.attrs?.find((item) => item.name === name)?.value;
const findAll = (node, predicate) => [
  ...(predicate(node) ? [node] : []),
  ...(node.childNodes ?? []).flatMap((child) => findAll(child, predicate)),
];

test('sidebar Recent includes every unpinned article in date order, with pinned posts shown separately', async () => {
  for (const lang of ['zh', 'en']) {
    const feed = await readFile(`dist/${lang}/rss.xml`, 'utf8');
    const articles = [...feed.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(
      ([, item]) => ({
        url: new URL(item.match(/<link>(.*?)<\/link>/)[1]).pathname,
        date: Date.parse(item.match(/<pubDate>(.*?)<\/pubDate>/)[1]),
      }),
    );
    const html = await readFile(`dist/${lang}/posts/index.html`, 'utf8');
    const tree = parse(html);
    const recent = findAll(
      tree,
      (node) => attr(node, 'id') === 'sidebar-recent-list',
    )[0];
    assert.ok(recent);
    const links = findAll(recent, (node) => node.tagName === 'a').map((node) =>
      attr(node, 'href'),
    );
    const pinned = findAll(
      tree,
      (node) => attr(node, 'id') === 'sidebar-pinned-list',
    )[0];
    const pinnedLinks = pinned
      ? findAll(pinned, (node) => node.tagName === 'a').map((node) =>
          attr(node, 'href'),
        )
      : [];
    assert.ok(pinnedLinks.every((url) => !links.includes(url)));
    assert.deepEqual(
      [...links, ...pinnedLinks].sort(),
      articles.map((article) => article.url).sort(),
    );
    const dates = new Map(
      articles.map((article) => [article.url, article.date]),
    );
    for (let i = 1; i < links.length; i++)
      assert.ok(dates.get(links[i - 1]) >= dates.get(links[i]));
    const home = parse(await readFile(`dist/${lang}/index.html`, 'utf8'));
    const random = findAll(
      home,
      (node) => attr(node, 'data-random-posts') !== undefined,
    )[0];
    assert.equal(
      JSON.parse(attr(random, 'data-random-posts')).length,
      Math.min(config.posts.randomLimit, articles.length),
      'Other recent controls retain their configured limit',
    );
  }
});

test('every list page exposes its actual page range and localized destination paths for jumping', async () => {
  for (const lang of ['zh', 'en']) {
    const first = parse(
      await readFile(`dist/${lang}/posts/index.html`, 'utf8'),
    );
    const form = findAll(
      first,
      (node) => attr(node, 'data-page-jump') !== undefined,
    )[0];
    const total = Number(attr(form, 'data-total-pages'));
    assert.ok(total > 1);
    for (let page = 1; page <= total; page++) {
      const route = page === 1 ? 'posts' : `posts/page/${page}`;
      const tree = parse(
        await readFile(`dist/${lang}/${route}/index.html`, 'utf8'),
      );
      const jump = findAll(
        tree,
        (node) => attr(node, 'data-page-jump') !== undefined,
      )[0];
      assert.equal(attr(jump, 'data-current-page'), String(page));
      assert.equal(attr(jump, 'data-total-pages'), String(total));
      assert.equal(attr(jump, 'data-first-page'), `/${lang}/posts/`);
      assert.equal(attr(jump, 'data-page-prefix'), `/${lang}/posts/page/`);
      const input = findAll(jump, (node) => node.tagName === 'input')[0];
      assert.equal(attr(input, 'value'), String(page));
      assert.equal(attr(input, 'inputmode'), 'numeric');
      assert.notEqual(attr(input, 'hidden'), undefined);
      const edit = findAll(
        jump,
        (node) => attr(node, 'data-page-edit') !== undefined,
      )[0];
      const last = findAll(jump, (node) => node.tagName === 'a')[0];
      assert.equal(attr(last, 'href'), `/${lang}/posts/page/${total}/`);
      assert.equal(
        attr(last, 'aria-current'),
        page === total ? 'page' : undefined,
      );
      for (const control of [edit, last]) {
        assert.ok(attr(control, 'data-tooltip'));
        assert.equal(
          attr(control, 'title'),
          undefined,
          'Use shared bubbles instead of native tooltips',
        );
      }
    }
  }
});
