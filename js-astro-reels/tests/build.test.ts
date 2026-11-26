// Checks of the last build that hold for any fork: every expectation comes from src/config.ts and
// the content folder. The demo's own wording is checked in tests/demo/.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';
import { siteConfig } from '../src/config.ts';
import { PAGE_SIZE, feedHref, pageCount } from '../src/lib/feed.ts';
import { creatorOf, ownTitle, pieceWords, piecePath, sharedCreator } from '../src/lib/pieces.ts';
import { HOME_TITLE, PIECES_PATH, SITE_NAME, inSearch } from '../src/lib/seo.ts';
import { firstLine } from '../src/lib/verse.ts';
import { attr, built, capoWeight, cardLinks, dist, esc, headTags, html, htmlPages, jsonLd, origin, read, servedAt, sourcePieces, text } from './support.ts';

const pieces = sourcePieces();
const total = pieces.length;
const pages = pageCount(total);
const { name, label, book } = siteConfig.pieces;
const words = pieceWords();
const piece = (n: number) => pieces[n - 1]!;
/** A piece with neighbours on both sides, for the checks that need them. */
const mid = piece(Math.max(2, Math.ceil(total / 2)));
const lastPage = pages === 1 ? 'index.html' : `page/${pages}/index.html`;
const needs = (enough: boolean, what: string) => (enough ? false : `the collection has no ${what}`);

test('the pieces are numbered 1 to N, as the feed and piece pages link them', () => {
  assert.deepEqual(pieces.map((p) => p.number), Array.from({ length: total }, (_, i) => i + 1));
});

test('the home page has the site title, a self canonical and both colour schemes', () => {
  const page = read('index.html');
  assert.match(page, /<html lang="en">/);
  assert.match(page, /<meta name="color-scheme" content="dark light">/);
  assert.match(page, new RegExp(`<title>${esc(html(HOME_TITLE))}</title>`));
  assert.match(page, new RegExp(`<link rel="canonical" href="${esc(origin)}/">`));
});

test('the layout links the icons and the generated manifest', () => {
  const page = read('index.html');
  assert.match(page, /<link rel="icon" href="\/favicon\.ico" sizes="48x48">/);
  assert.match(page, /<link rel="icon" href="\/icon\.svg" type="image\/svg\+xml">/);
  assert.match(page, /<link rel="apple-touch-icon" href="\/apple-touch-icon\.png">/);
  assert.match(page, /<link rel="manifest" href="\/site\.webmanifest">/);
  const manifest = JSON.parse(read('site.webmanifest')) as { name: string; icons: { src: string }[] };
  assert.equal(manifest.name, SITE_NAME);
  for (const icon of manifest.icons) assert.ok(built(icon.src.slice(1)), icon.src);
});

test('the 404 page is noindex, has no canonical or share image, and leads home and to the contents', () => {
  const page = read('404.html');
  assert.match(page, /<meta name="robots" content="noindex">/);
  assert.doesNotMatch(page, /rel="canonical"|og:image/);
  assert.match(page, new RegExp(`<a href="/">Home page →</a><a href="${esc(PIECES_PATH)}">${esc(html(words.all))} →</a>`));
});

test('every page names Astro as its generator', () => {
  for (const path of htmlPages()) assert.match(read(path), /<meta name="generator" content="Astro v\d+\.\d+\.\d+">/, path);
});

test("every page's <head> is in capo.js order: charset and viewport, the title, the stylesheet, the rest", () => {
  for (const path of htmlPages()) {
    const tags = headTags(read(path));
    const weights = tags.map(capoWeight);
    assert.deepEqual(weights, [...weights].sort((a, b) => b - a), `${path}: ${tags.join(' ')}`);
    assert.deepEqual(weights.slice(0, 4), [10, 10, 9, 4], path);
  }
});

test('robots.txt allows crawling and names the sitemap index', () => {
  assert.equal(read('robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap-index.xml\n`);
});

test('the sitemap lists exactly the pages meant for search, without unused namespaces', () => {
  const xml = read('sitemap-0.xml');
  const expected = htmlPages().map(servedAt).filter((path) => inSearch(path)).map((path) => `${origin}${path}`).sort();
  assert.deepEqual([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]).sort(), expected);
  assert.ok(expected.includes(`${origin}/`));
  assert.doesNotMatch(xml, /xmlns:(news|image|video|xhtml)/);
});

test('pages kept out of search are noindex, follow and keep their canonical', () => {
  for (const path of htmlPages().filter((p) => p !== '404.html')) {
    const page = read(path);
    if (inSearch(servedAt(path))) assert.doesNotMatch(page, /<meta name="robots"/, path);
    else assert.match(page, /<meta name="robots" content="noindex, follow">/, path);
    assert.match(page, new RegExp(`<link rel="canonical" href="${esc(origin)}${esc(servedAt(path))}">`), path);
  }
});

test('indexable pages carry Open Graph tags and a 1200x630 share image', async () => {
  const page = read('index.html');
  const hash = createHash('sha256').update('/').digest('hex');
  assert.match(page, new RegExp(`<meta property="og:image" content="${esc(origin)}/_social/${hash}\\.png">`));
  assert.match(page, new RegExp(`<meta property="og:site_name" content="${esc(attr(SITE_NAME))}">`));
  assert.match(page, /<meta property="og:image" content="[^"]+"><meta name="twitter:card" content="summary_large_image">/);
  assert.doesNotMatch(page, /og:image:(width|height)|data-starter-/);
  const { info } = await sharp(readFileSync(new URL(`_social/${hash}.png`, dist))).raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1200);
  assert.equal(info.height, 630);
});

test('the home page declares the WebSite, published by the configured author if there is one', () => {
  const { author } = siteConfig;
  assert.deepEqual(jsonLd('index.html'), [{
    '@type': 'WebSite', '@id': `${origin}/#website`, url: `${origin}/`, name: SITE_NAME, inLanguage: 'en',
    ...(author ? { publisher: { '@type': 'Person', '@id': author.id ?? new URL('#person', author.url).href, name: author.name, url: author.url } } : {}),
  }]);
});

test('every page ends with the author and source credit from the config', () => {
  const { author, repository } = siteConfig;
  const credits = [author && `By <a href="${author.url}">${html(author.name)}</a>`, repository && `<a href="${repository}">Source code</a>`].filter(Boolean);
  for (const path of htmlPages()) {
    const footer = read(path).match(/<footer class="site">(.*?)<\/footer>/s)?.[1];
    assert.equal(footer, credits.length ? `<p>${credits.join(' · ')}</p>` : undefined, path);
  }
});

test('every feed page and every piece page is built, and no more', () => {
  for (let p = 2; p <= pages; p++) assert.ok(built(`page/${p}/index.html`), `page ${p}`);
  assert.ok(!built(`page/${pages + 1}/index.html`));
  assert.ok(!built('page/1/index.html'));
  for (const { number } of pieces) assert.ok(built(`${name}/${number}/index.html`), `${label} ${number}`);
  assert.ok(!built(`${name}/${total + 1}/index.html`));
});

const feedIds = (page: string) => [...page.matchAll(/<section class="card piece" id="(\d+)"/g)].map((m) => Number(m[1]));

test('the first feed page holds the first pieces, with ids, and no previous card', () => {
  const page = read('index.html');
  assert.deepEqual(feedIds(page), pieces.slice(0, PAGE_SIZE).map((p) => p.number));
  assert.doesNotMatch(page, /class="card previous"/);
});

test('a page-turn card opens the next page at its first piece', { skip: needs(pages > 1, 'second feed page') }, () => {
  assert.match(read('index.html'), new RegExp(`<section class="card next"[^>]*><div class="poem"><p class="turn"><a href="${esc(feedHref(PAGE_SIZE + 1))}" rel="next">Next: ${esc(html(words.range(PAGE_SIZE + 1, Math.min(2 * PAGE_SIZE, total))))} →</a>`));
});

test('the last feed page holds the last pieces and no next card', () => {
  const page = read(lastPage);
  assert.deepEqual(feedIds(page), pieces.slice((pages - 1) * PAGE_SIZE).map((p) => p.number));
  assert.doesNotMatch(page, /class="card next"/);
});

test('a later feed page opens with a card back to the end of the page before', { skip: needs(pages > 1, 'second feed page') }, () => {
  const last = Math.min(2 * PAGE_SIZE, total);
  const page2 = read('page/2/index.html');
  assert.match(page2, new RegExp(`<title>Page 2: ${PAGE_SIZE + 1}–${last} - ${esc(html(SITE_NAME))}</title>`));
  assert.match(page2, new RegExp(`<section class="card previous" aria-label="${esc(attr(words.previousGroup))}"><div class="poem"><h1 class="number">${esc(html(words.range(PAGE_SIZE + 1, last)))}</h1><p class="turn"><a href="${esc(feedHref(PAGE_SIZE))}" rel="prev">← Previous: ${esc(html(words.range(1, PAGE_SIZE)))}</a>`));
  assert.match(page2, new RegExp(`<meta name="description" content="${esc(attr(words.pageDescription(PAGE_SIZE + 1, last, total)))}">`));
});

test('the last piece of a feed page leads to the first of the next', { skip: needs(pages > 1, 'second feed page') }, () => {
  const card = read('index.html').match(new RegExp(`<section class="card piece" id="${PAGE_SIZE}".*?</section>`, 's'))?.[0] ?? '';
  assert.match(card, new RegExp(`<a href="${esc(feedHref(PAGE_SIZE + 1))}">Next<span class="visually-hidden">: ${esc(html(words.piece(PAGE_SIZE + 1)))}</span> ↓</a>`));
});

test("a piece's page: its title, description, every line of its body, and the link into the feed", () => {
  const page = read(`${name}/${mid.number}/index.html`);
  assert.match(page, new RegExp(`<title>${esc(html(mid.title))} - ${esc(html(SITE_NAME))}</title>`));
  assert.match(page, new RegExp(`<meta name="description" content="${esc(attr(mid.description))}">`));
  const lines = mid.body.split(/\r?\n/).filter((line) => line.trim());
  assert.equal([...page.matchAll(/<span class="line(?: indent)?">/g)].length, lines.length);
  assert.match(page, new RegExp(`<a href="${esc(feedHref(mid.number))}">See it in the feed</a>`));
});

test("a piece's page names the piece and its creator in view", () => {
  const page = read(`${name}/${mid.number}/index.html`);
  const title = ownTitle(mid.title, mid.number);
  const h1 = page.match(/<h1\b[^>]*>(.*?)<\/h1>/s)?.[1] ?? '';
  assert.equal(text(h1), html(title ?? words.piece(mid.number)));
  assert.doesNotMatch(h1, /visually-hidden/);
  if (title) assert.match(page, new RegExp(`<p class="number">${esc(html(words.piece(mid.number)))}</p>`));
  assert.match(page, new RegExp(`<p class="byline">${esc(html(creatorOf(mid)))}</p>`));
});

test("a piece's page keeps previous and next together, before the feed link", { skip: needs(total > 2, 'piece with two neighbours') }, () => {
  const links = cardLinks(read(`${name}/${mid.number}/index.html`))[0] ?? '';
  const hrefs = [...links.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(hrefs, [piecePath(mid.number - 1), piecePath(mid.number + 1), feedHref(mid.number)]);
  assert.match(links, new RegExp(`rel="prev">← ${esc(html(words.piece(mid.number - 1)))}</a>`));
  assert.match(links, new RegExp(`rel="next">${esc(html(words.piece(mid.number + 1)))} →</a>`));
  assert.match(read(`${name}/${mid.number}/index.html`), new RegExp(`<nav class="card-links" aria-label="${esc(attr(words.more))}">`));
});

test('the first piece has no previous piece and the last no next', () => {
  assert.doesNotMatch(read(`${name}/1/index.html`), /rel="prev"/);
  assert.doesNotMatch(read(`${name}/${total}/index.html`), /rel="next"/);
});

test('a feed card names the piece and shows its place in the collection', () => {
  const page = read('index.html');
  const card = page.match(/<section class="card piece" id="1".*?<\/section>/s)?.[0] ?? '';
  const first = piece(1);
  const title = ownTitle(first.title, 1);
  const head = card.match(/<(?:h2|p) class="number"[^>]*>(.*?)<\/(?:h2|p)>/s)?.[1] ?? '';
  assert.equal(text(head), `${html(label)} 1 of ${total}`);
  assert.match(head, new RegExp(`^<span class="visually-hidden">${esc(html(label))} </span>1 of ${total}$`));
  if (title) assert.match(card, new RegExp(`<h2 class="title" id="piece-1">${esc(html(title))}</h2>`));
  // The byline is in the feed too: on phones only for a piece's own creator, always in the desktop margin.
  assert.match(card, new RegExp(`<p class="byline${first.creator ? '' : ' margin-only'}">${esc(html(creatorOf(first)))}</p>`));
});

test('feed card links say where they go, with arrows, and name the piece for screen readers', { skip: needs(total > 1, 'second piece') }, () => {
  const links = cardLinks(read('index.html')).find((l) => l.includes(`"${piecePath(1)}"`));
  assert.equal(links, `<a href="#2">Next<span class="visually-hidden">: ${html(words.piece(2))}</span> ↓</a><a href="${piecePath(1)}">${html(label)} page<span class="visually-hidden">: ${html(words.piece(1))}</span> →</a>`);
  assert.match(read('index.html'), new RegExp(`<nav class="card-links" aria-label="${esc(attr(words.piece(1)))}">`));
});

test('no two links in the feed share a name', () => {
  const names = cardLinks(read('index.html')).flatMap((l) => [...l.matchAll(/<a\b[^>]*>(.*?)<\/a>/gs)].map((m) => text(m[1]!)));
  assert.ok(names.length >= 2 * Math.min(PAGE_SIZE, total));
  assert.equal(new Set(names).size, names.length);
});

test('the last piece leads back to the first instead of onward', () => {
  const last = cardLinks(read(lastPage)).find((l) => l.includes(`"${piecePath(total)}"`));
  assert.ok(last);
  assert.match(last, new RegExp(`<a href="${esc(feedHref(1))}">Back to the first ↑</a>`));
  assert.doesNotMatch(last, />Next</);
});

test('the last page ends with a closing card: the whole collection, the contents and the start', () => {
  const end = read(lastPage).match(/<section class="card end"[^>]*>(.*?)<\/section>/s)?.[1] ?? '';
  assert.match(end, /<h2 class="number" id="the-end">The end<\/h2>/);
  assert.match(end, new RegExp(`<p class="closing">${esc(html(words.closing(total, sharedCreator(pieces))))}</p>`));
  assert.match(end, new RegExp(`<a href="${esc(PIECES_PATH)}">Contents →</a><a href="${esc(feedHref(1))}">Start again ↑</a>`));
  if (pages > 1) assert.doesNotMatch(read('index.html'), /class="card end"/);
});

test('the contents page lists every piece in order by its title or first line', () => {
  const page = read(`${name}/index.html`);
  assert.match(page, new RegExp(`<title>${esc(html(words.contentsHeading))} - ${esc(html(SITE_NAME))}</title>`));
  assert.match(page, new RegExp(`<h1 id="contents-title">${esc(html(words.contentsHeading))}</h1>`));
  const items = [...page.matchAll(/<li><a href="([^"]+)"><span class="n">(\d+)<\/span> <span>([^<]*)<\/span><\/a><\/li>/g)].map((m) => m.slice(1));
  assert.deepEqual(items, pieces.map((p) => [piecePath(p.number), String(p.number), html(ownTitle(p.title, p.number) ?? firstLine(p.body) ?? p.description)]));
});

test('every page header links to the contents, marked current on the contents page only', () => {
  for (const path of htmlPages()) {
    const header = read(path).match(/<header class="site">(.*?)<\/header>/s)?.[1] ?? '';
    const current = path === `${name}/index.html` ? ' aria-current="page"' : '';
    assert.match(header, new RegExp(`<a href="${esc(PIECES_PATH)}"${current}>Contents</a>`), path);
  }
});

test("a piece's page is a CreativeWork by its creator, part of the configured book", () => {
  const url = `${origin}${piecePath(mid.number)}`;
  assert.deepEqual(jsonLd(`${name}/${mid.number}/index.html`), [{
    '@type': 'CreativeWork', '@id': `${url}#work`, url, name: mid.title, description: mid.description, inLanguage: 'en',
    author: { '@type': 'Person', name: creatorOf(mid) },
    ...(book ? { isPartOf: { '@type': 'Book', ...book } } : {}),
  }]);
});

test('no page ships JavaScript', () => {
  for (const path of htmlPages()) {
    const scripts = [...read(path).matchAll(/<script\b[^>]*>/g)].filter((m) => !/type="application\/ld\+json"/.test(m[0]));
    assert.deepEqual(scripts, [], path);
  }
});
