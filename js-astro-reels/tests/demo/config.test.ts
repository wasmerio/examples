// The demo's settings in src/config.ts, word for word.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PAGE_SIZE, pageCount } from '../../src/lib/feed.ts';
import { pieceJsonLd } from '../../src/lib/identity.ts';
import { pieceWords } from '../../src/lib/pieces.ts';
import { HOME_TITLE, SITE_NAME } from '../../src/lib/seo.ts';
import { skip } from './demo.ts';

test('the demo is "Astro Reels Template: a vertical feed with zero JavaScript"', { skip }, () => {
  assert.equal(SITE_NAME, 'Astro Reels Template');
  assert.equal(HOME_TITLE, 'Astro Reels Template: a vertical feed with zero JavaScript');
});

test('154 sonnets make 8 pages of 20', { skip }, () => {
  assert.equal(PAGE_SIZE, 20);
  assert.equal(pageCount(154), 8);
});

test('the demo words: Sonnet, sonnets, Shakespeare', { skip }, () => {
  const words = pieceWords();
  assert.equal(words.piece(18), 'Sonnet 18');
  assert.equal(words.range(21, 40), 'sonnets 21–40');
  assert.equal(words.more, 'More sonnets');
  assert.equal(words.previousGroup, 'Previous sonnets');
  assert.equal(words.nextGroup, 'Next sonnets');
  assert.equal(words.pageDescription(21, 40, 154), "Sonnets 21 to 40 of William Shakespeare's 154, one per screen.");
  assert.equal(words.all, 'All sonnets');
  assert.equal(words.closing(154, 'William Shakespeare'), 'All 154 sonnets, by William Shakespeare.');
  assert.equal(words.contentsHeading, 'Sonnets');
  assert.equal(words.contentsDescription(154), "All 154 sonnets by William Shakespeare, each with its first line or title.");
});

test('a sonnet is a CreativeWork by Shakespeare, part of the 1609 book', { skip }, () => {
  const url = 'https://example.test/sonnets/18/';
  const ld = JSON.parse(pieceJsonLd({ url, name: 'Sonnet 18', description: 'Shall I compare thee to a summer’s day?' })) as { '@graph': unknown[] };
  assert.deepEqual(ld['@graph'], [{
    '@type': 'CreativeWork', '@id': `${url}#work`, url, name: 'Sonnet 18', description: 'Shall I compare thee to a summer’s day?',
    inLanguage: 'en', author: { '@type': 'Person', name: 'William Shakespeare' },
    isPartOf: { '@type': 'Book', name: "Shakespeare's Sonnets", datePublished: '1609' },
  }]);
});
