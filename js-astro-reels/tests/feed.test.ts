import { test } from 'node:test';
import assert from 'node:assert/strict';
import { siteConfig } from '../src/config.ts';
import { PAGE_SIZE, feedHref, pageCount, pageHref, pageOf, pageRange } from '../src/lib/feed.ts';

const base = siteConfig.feedBase;

test('pieces fill pages of PAGE_SIZE, the last page taking the rest', () => {
  const total = 7 * PAGE_SIZE + 3;
  assert.equal(pageCount(total), 8);
  assert.equal(pageCount(PAGE_SIZE), 1);
  assert.deepEqual(pageRange(1, total), { first: 1, last: PAGE_SIZE });
  assert.deepEqual(pageRange(8, total), { first: 7 * PAGE_SIZE + 1, last: total });
});

test('pages and deep links', () => {
  assert.equal(pageOf(1), 1);
  assert.equal(pageOf(PAGE_SIZE), 1);
  assert.equal(pageOf(PAGE_SIZE + 1), 2);
  assert.equal(pageHref(1), base);
  assert.equal(pageHref(2), `${base}page/2/`);
  assert.equal(feedHref(1), `${base}#1`);
  assert.equal(feedHref(PAGE_SIZE + 5), `${base}page/2/#${PAGE_SIZE + 5}`);
});
