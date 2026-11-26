import { test } from 'node:test';
import assert from 'node:assert/strict';
import { siteConfig } from '../src/config.ts';
import { HOME_TITLE, MAX_DESCRIPTION, SITE_NAME, inSearch, resolveSeo, type SeoContext, PIECES_PATH } from '../src/lib/seo.ts';

const site = new URL('https://example.test');
const ctx = (pathname: string, extra: Partial<SeoContext> = {}): SeoContext =>
  ({ site, pathname, mode: 'dev', socialImages: false, ...extra });

test('the home page title is the site name, a colon and the tagline', async () => {
  const seo = await resolveSeo({ description: 'A description.' }, ctx('/'));
  assert.equal(SITE_NAME, siteConfig.name);
  assert.equal(HOME_TITLE, `${siteConfig.name}: ${siteConfig.tagline}`);
  assert.equal(seo.title, HOME_TITLE);
  assert.equal(seo.ogTitle, SITE_NAME);
  assert.equal(seo.canonicalUrl, 'https://example.test/');
});

test('other pages lead with their title, end in " - <site name>" and get a self canonical', async () => {
  const seo = await resolveSeo({ title: 'About', description: 'About this site.' }, ctx('/about/'));
  assert.equal(seo.title, `About - ${SITE_NAME}`);
  assert.equal(seo.robots, undefined);
  assert.equal(seo.ogTitle, 'About');
  assert.equal(seo.canonicalUrl, 'https://example.test/about/');
});

test('noindex pages have no canonical', async () => {
  const seo = await resolveSeo({ title: 'Page not found', description: 'Not here.', noindex: true }, ctx('/404'));
  assert.equal(seo.noindex, true);
  assert.equal(seo.robots, 'noindex');
  assert.equal(seo.canonicalUrl, undefined);
});

const demoLike = { indexPieces: false, feedBase: '/', pieces: { name: 'poems' } };

test('with indexPieces false, only the first feed page and other pages are in search', () => {
  for (const path of ['/', '/about/']) assert.equal(inSearch(path, demoLike), true, path);
  for (const path of ['/page/2/', '/page/8/', '/poems/', '/poems/1/', '/poems/154/', '/404/', '/404.html']) assert.equal(inSearch(path, demoLike), false, path);
  const reels = { ...demoLike, feedBase: '/reels/' };
  assert.equal(inSearch('/reels/', reels), true);
  assert.equal(inSearch('/reels/page/2/', reels), false);
});

test('with indexPieces true, every page but the 404 is in search', () => {
  const own = { ...demoLike, indexPieces: true };
  for (const path of ['/', '/page/2/', '/poems/', '/poems/18/']) assert.equal(inSearch(path, own), true, path);
  for (const path of ['/404/', '/404.html']) assert.equal(inSearch(path, own), false, path);
});

test('piece pages and later feed pages are noindex, follow but keep their canonical and share image', { skip: siteConfig.indexPieces && 'indexPieces is true, so every page is in search' }, async () => {
  for (const path of [`/${siteConfig.pieces.name}/18/`, '/page/2/']) {
    const seo = await resolveSeo({ title: 'A piece', description: 'x' }, ctx(path, { mode: 'build', socialImages: true }));
    assert.equal(seo.robots, 'noindex, follow', path);
    assert.equal(seo.noindex, false, path);
    assert.equal(seo.canonicalUrl, `https://example.test${path}`);
    assert.equal(seo.social?.url, `https://example.test${path}`);
  }
});

test('blank or overlong metadata fails loudly', async () => {
  await assert.rejects(() => resolveSeo({ title: ' ', description: 'x' }, ctx('/x/')), /title/);
  await assert.rejects(() => resolveSeo({ description: '' }, ctx('/')), /description/);
  await assert.rejects(() => resolveSeo({ description: 'x'.repeat(MAX_DESCRIPTION + 1) }, ctx('/')), /160/);
});

test('an indexable page without a trailing slash fails loudly', async () => {
  await assert.rejects(() => resolveSeo({ title: 'About', description: 'x' }, ctx('/about')), /trailing slash/);
});

test('a missing site fails loudly', async () => {
  await assert.rejects(() => resolveSeo({ description: 'x' }, ctx('/', { site: undefined })), /site/);
});

test('indexable build pages get a generated share image; noindex pages do not', async () => {
  const seo = await resolveSeo({ title: 'About', description: 'x' }, ctx('/about/', { mode: 'build', socialImages: true }));
  assert.match(seo.generatedImageUrl ?? '', /^https:\/\/example\.test\/_social\/[0-9a-f]{64}\.png$/);
  assert.equal(seo.social?.url, 'https://example.test/about/');
  assert.equal(seo.ogTitle, 'About');
  const off = await resolveSeo({ title: 'Gone', description: 'x', noindex: true }, ctx('/404', { mode: 'build', socialImages: true }));
  assert.equal(off.social, undefined);
});

test('the piece pages live under the configured name', () => {
  assert.equal(PIECES_PATH, `/${siteConfig.pieces.name}/`);
});
