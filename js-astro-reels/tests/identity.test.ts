import { test } from 'node:test';
import assert from 'node:assert/strict';
import { homeJsonLd, pieceJsonLd } from '../src/lib/identity.ts';
import { SITE_NAME } from '../src/lib/seo.ts';

const nodes = (json: string): Record<string, unknown>[] => {
  const ld = JSON.parse(json) as { '@context': string; '@graph': Record<string, unknown>[] };
  assert.equal(ld['@context'], 'https://schema.org');
  return ld['@graph'];
};

test('the home page is one WebSite published by the configured author', () => {
  const author = { name: 'A. Writer', url: 'https://example.com/' };
  assert.deepEqual(nodes(homeJsonLd(new URL('https://example.test'), { author })), [{
    '@type': 'WebSite', '@id': 'https://example.test/#website', url: 'https://example.test/', name: SITE_NAME, inLanguage: 'en',
    publisher: { '@type': 'Person', '@id': 'https://example.com/#person', name: 'A. Writer', url: 'https://example.com/' },
  }]);
});

test('an author with a fixed id keeps it', () => {
  const [site] = nodes(homeJsonLd(new URL('https://example.test'), { author: { id: 'https://a.test/me#i', name: 'A. Writer', url: 'https://a.test/' } }));
  assert.deepEqual(site?.['publisher'], { '@type': 'Person', '@id': 'https://a.test/me#i', name: 'A. Writer', url: 'https://a.test/' });
});

test('with no author, the WebSite names no publisher', () => {
  const [site] = nodes(homeJsonLd(new URL('https://example.test'), {}));
  assert.ok(site);
  assert.equal('publisher' in site, false);
});

test('a piece credits the creator named in the config', () => {
  const [work] = nodes(pieceJsonLd({ url: 'https://example.test/sonnets/1/', name: 'Sonnet 1', description: 'x' }, { pieces: { creator: 'A. Poet' } }));
  assert.deepEqual(work?.['author'], { '@type': 'Person', name: 'A. Poet' });
});

test('a piece belongs to the book named in the config, or to none', () => {
  const input = { url: 'https://example.test/poems/1/', name: 'Poem 1', description: 'x' };
  const [inBook] = nodes(pieceJsonLd(input, { pieces: { creator: 'A. Poet', book: { name: 'Collected Poems', datePublished: '2024' } } }));
  assert.deepEqual(inBook?.['isPartOf'], { '@type': 'Book', name: 'Collected Poems', datePublished: '2024' });
  const [loose] = nodes(pieceJsonLd(input, { pieces: { creator: 'A. Poet' } }));
  assert.ok(loose);
  assert.equal('isPartOf' in loose, false);
});

test("a piece's own creator is its author", () => {
  const [work] = nodes(pieceJsonLd({ url: 'https://example.test/quotes/1/', name: 'On time', description: 'x', creator: 'Ann Other' }, { pieces: { creator: 'A. Poet' } }));
  assert.deepEqual(work?.['author'], { '@type': 'Person', name: 'Ann Other' });
});

test('a "<" in the data cannot close the script element', () => {
  const json = pieceJsonLd({ url: 'https://example.test/sonnets/1/', name: '</script>', description: 'a < b' });
  assert.doesNotMatch(json, /</);
  assert.equal(nodes(json)[0]?.['name'], '</script>');
});
