// The demo's build, word for word: Shakespeare's 154 sonnets and the welcome cards about the
// template. tests/build.test.ts checks the same pages for any fork.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { siteConfig } from '../../src/config.ts';
import { cardLinks, esc, html, jsonLd, origin, read, text } from '../support.ts';
import { skip } from './demo.ts';

test('154 sonnets on 8 feed pages', { skip }, () => {
  const contents = read('sonnets/index.html');
  assert.equal([...contents.matchAll(/<li><a href="\/sonnets\/\d+\/">/g)].length, 154);
  assert.match(read('page/8/index.html'), /<section class="card piece" id="154"/);
  assert.match(read('page/8/index.html'), /<link rel="canonical" href="[^"]+\/page\/8\/">/);
});

test('the sitemap lists only the home page: the sonnets are published elsewhere', { skip }, () => {
  assert.equal(siteConfig.indexPieces, false);
  assert.deepEqual([...read('sitemap-0.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]), [`${origin}/`]);
});

test('Sonnet 18: title, first-line description, couplet indentation and the feed link', { skip }, () => {
  const page = read('sonnets/18/index.html');
  assert.match(page, /<title>Sonnet 18 - Astro Reels Template<\/title>/);
  assert.match(page, /<meta name="description" content="Shall I compare thee to a summer’s day\?">/);
  assert.match(page, /<h1 class="number" id="piece-18">Sonnet 18<\/h1><p class="byline">William Shakespeare<\/p>/);
  assert.match(page, /<span class="line">Shall I compare thee to a summer’s day\?<\/span>/);
  assert.match(page, /<span class="line indent">So long as men can breathe, or eyes can see,<\/span>/);
  assert.match(page, /<a href="\/sonnets\/17\/" rel="prev">← Sonnet 17<\/a><a href="\/sonnets\/19\/" rel="next">Sonnet 19 →<\/a><a href="\/#18">See it in the feed<\/a>/);
  assert.match(read('sonnets/25/index.html'), /<a href="\/page\/2\/#25">See it in the feed<\/a>/);
});

test('Sonnet 18 in the feed: "18 of 154", with Shakespeare in the desktop margin', { skip }, () => {
  const card = read('index.html').match(/<section class="card piece" id="18".*?<\/section>/s)?.[0] ?? '';
  assert.match(card, /<h2 class="number" id="piece-18"><span class="visually-hidden">Sonnet <\/span>18 of 154<\/h2><p class="byline margin-only">William Shakespeare<\/p>/);
  assert.equal(cardLinks(card)[0], '<a href="#19">Next<span class="visually-hidden">: Sonnet 19</span> ↓</a><a href="/sonnets/18/">Sonnet page<span class="visually-hidden">: Sonnet 18</span> →</a>');
});

test('page turns name the sonnets on either side', { skip }, () => {
  assert.match(read('index.html'), /<a href="\/page\/2\/#21" rel="next">Next: sonnets 21–40 →<\/a>/);
  assert.match(read('page/2/index.html'), /<title>Page 2: 21–40 - Astro Reels Template<\/title>/);
  assert.match(read('page/2/index.html'), /<h1 class="number">sonnets 21–40<\/h1><p class="turn"><a href="\/#20" rel="prev">← Previous: sonnets 1–20<\/a>/);
  assert.match(read('page/2/index.html'), /<meta name="description" content="Sonnets 21 to 40 of William Shakespeare's 154, one per screen\.">/);
  assert.match(read('page/7/index.html'), /<a href="\/page\/8\/#141" rel="next">Next: sonnets 141–154 →<\/a>/);
});

test('the closing card counts all 154 sonnets by Shakespeare', { skip }, () => {
  assert.match(read('page/8/index.html'), /<p class="closing">All 154 sonnets, by William Shakespeare\.<\/p>/);
  assert.match(read('page/8/index.html'), /<a href="\/#1">Back to the first ↑<\/a>/);
});

test('the contents: "Sonnets", by first line, credited to Shakespeare and the 1609 book', { skip }, () => {
  const page = read('sonnets/index.html');
  assert.match(page, /<title>Sonnets - Astro Reels Template<\/title>/);
  assert.match(page, /<h1 id="contents-title">Sonnets<\/h1><p class="byline">William Shakespeare, Shakespeare&#39;s Sonnets \(1609\)<\/p>/);
  assert.match(page, /<li><a href="\/sonnets\/18\/"><span class="n">18<\/span> <span>Shall I compare thee to a summer’s day\?<\/span><\/a><\/li>/);
});

test('the 404 page leads to "All sonnets"', { skip }, () => {
  assert.match(read('404.html'), /<a href="\/">Home page →<\/a><a href="\/sonnets\/">All sonnets →<\/a>/);
});

test('Sonnet 18 is a CreativeWork by William Shakespeare, part of the 1609 Sonnets', { skip }, () => {
  assert.deepEqual(jsonLd('sonnets/18/index.html'), [{
    '@type': 'CreativeWork', '@id': `${origin}/sonnets/18/#work`, url: `${origin}/sonnets/18/`, name: 'Sonnet 18',
    description: 'Shall I compare thee to a summer’s day?', inLanguage: 'en',
    author: { '@type': 'Person', name: 'William Shakespeare' },
    isPartOf: { '@type': 'Book', name: "Shakespeare's Sonnets", datePublished: '1609' },
  }]);
});

test('the demo credits a placeholder author on example.com', { skip }, () => {
  assert.deepEqual(siteConfig.author, { name: 'Your Name', url: 'https://example.com/' });
  assert.match(read('index.html'), /<footer class="site"><p>By <a href="https:\/\/example\.com\/">Your Name<\/a> · <a href="https:\/\/github\.com\/cevdetch\/astro-reels-template">Source code<\/a><\/p><\/footer>/);
  assert.deepEqual(jsonLd('index.html')[0]!['publisher'], { '@type': 'Person', '@id': 'https://example.com/#person', name: 'Your Name', url: 'https://example.com/' });
});

/** The welcome cards: everything in <main> before the first piece. */
const welcome = () => {
  const page = read('index.html');
  return page.slice(page.indexOf('<main'), page.indexOf('<section class="card piece"'));
};

test('the welcome cards take their line and source credit from the config', { skip }, () => {
  const own = welcome();
  assert.match(own, new RegExp(`<p class="lead">${esc(html(siteConfig.intro))}</p>`));
  const { credit } = siteConfig;
  assert.ok(credit);
  assert.match(own, new RegExp(`<a href="${esc(credit.href)}">${esc(html(credit.text))}</a>`));
});

test('the home page explains the template in its own words, before the first sonnet', { skip }, () => {
  const own = welcome();
  const words = text(own.replace(/<[^>]+>/g, ' ')).split(' ').filter((w) => /\w/.test(w));
  assert.ok(words.length >= 250, `${words.length} words`);
  assert.match(own, /<code>pnpm create astro@latest --template <span class="nowrap">cevdetch\/astro-reels-template<\/span><\/code>/);
  assert.match(own, /Shakespeare's 154 sonnets/);
  assert.match(own, new RegExp(`<a href="${esc(siteConfig.repository!)}">The source code and documentation</a>`));
  assert.doesNotMatch(own, /Made by/);
});
