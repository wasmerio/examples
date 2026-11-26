import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseDocument, removeMarkerSpans } from '../src/integrations/documents.ts';

const page = `data-starter-page-v1='{"pathname":"/caf%C3%A9/%2F/","noindex":false}'`;
const social = 'data-starter-social-v1="https://example.test/_social/image.png"';
const content = '<title>A &amp; B</title><meta name="description" content="An &quot;image&quot;.">';
const document = (head = page, metadata = content) => `<!doctype html><!-- 🪴 --><html lang="en"><head ${head}>${metadata}</head><body>Keep 🪴 &amp; spaces.</body></html>`;

test('owned head metadata and marker JSON decode without changing text or route encoding', () => {
  const parsed = parseDocument(document());
  assert.equal(parsed.title, 'A & B');
  assert.equal(parsed.description, 'An "image".');
  assert.deepEqual(parsed.pagePolicy, { pathname: '/caf%C3%A9/%2F/', noindex: false });
  assert.equal(parsed.lang, 'en');
  assert.equal(parsed.robotsNoindex, false);
});

test('marker spans remove only their original UTF-16 source characters', () => {
  const html = document(`${page} ${social}`, content + '<meta property="og:image" content="https://example.test/_social/image.png">');
  const parsed = parseDocument(html);
  assert.ok(parsed.pageMarkerSpan);
  assert.ok(parsed.socialMarkerSpan);
  const first = removeMarkerSpans(html, [parsed.pageMarkerSpan]);
  assert.equal(first, html.replace(page, ''));
  assert.ok(first.includes(social));
  const reparsed = parseDocument(first);
  assert.equal(reparsed.pageMarkerSpan, undefined);
  assert.ok(reparsed.socialMarkerSpan);
  assert.equal(removeMarkerSpans(first, [reparsed.socialMarkerSpan]), html.replace(page, '').replace(social, ''));
});

test('owned documents require exactly one nonblank title and description', () => {
  for (const metadata of ['', '<title> </title><meta name="description" content="Details">',
    '<title>Page</title>', content + '<title>Duplicate</title>',
    content + '<meta name="description" content="Duplicate">',
    '<title>Page</title><meta name="description" content=" ">']) {
    assert.throws(() => parseDocument(document(page, metadata)), /title|description/);
  }
});

test('unknown, malformed, duplicate and invalid head marker schemas fail', () => {
  for (const marker of [
    'data-starter-page-v2="{}"', 'data-starter-unknown="x"', 'data-starter-page-v1="bad"',
    `data-starter-page-v1='{"pathname":"relative","noindex":false}'`,
    `data-starter-page-v1='{"pathname":"/a?query","noindex":false}'`,
    `data-starter-page-v1='{"pathname":"/a#fragment","noindex":false}'`,
    `data-starter-page-v1='{"pathname":"/a/","noindex":"false"}'`,
    `data-starter-page-v1='{"pathname":"/a/","noindex":false,"unknown":1}'`,
    `${page} ${page}`, 'data-starter-social-v1="javascript:bad"',
  ]) assert.throws(() => parseDocument(document(marker)), /marker/);
});

test('unmarked documents allow missing owned metadata and expose indexing signals', () => {
  const parsed = parseDocument(document('', '<meta name="robots" content="follow, NOINDEX"><meta http-equiv="refresh" content="0; url=/next"><link rel="canonical" href="https://example.test/next">'));
  assert.equal(parsed.title, undefined);
  assert.equal(parsed.pagePolicy, undefined);
  assert.equal(parsed.robotsNoindex, true);
  assert.equal(parsed.redirect, true);
  assert.equal(parsed.canonicalUrl, 'https://example.test/next');
});

test('bypassed HTML honors case-insensitive robots names and canonical rel tokens', () => {
  const parsed = parseDocument(document('', '<meta name="ROBOTS" content="none"><link rel="CANONICAL" href="https://example.test/main">'));
  assert.equal(parsed.robotsNoindex, true);
  assert.equal(parsed.canonicalUrl, 'https://example.test/main');
});

test('image alt remains opt-in with no title fallback', () => {
  const image = '<meta property="og:image" content="https://example.test/a.png">';
  for (const alt of ['', '<meta property="og:image:alt" content=" ">']) {
    assert.equal(parseDocument(document(page, content + image + alt)).imageAlt, undefined);
  }
  assert.equal(parseDocument(document(page, content + image + '<meta property="og:image:alt" content="A &amp; B">')).imageAlt, 'A & B');
});

test('overlapping and out-of-range removal spans fail instead of corrupting output', () => {
  for (const spans of [[{ start: -1, end: 2 }], [{ start: 0, end: 1000 }],
    [{ start: 1, end: 4 }, { start: 3, end: 5 }]]) {
    assert.throws(() => removeMarkerSpans('123456', spans), /span/);
  }
});
