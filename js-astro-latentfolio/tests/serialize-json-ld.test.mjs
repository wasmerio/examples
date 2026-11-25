import assert from 'node:assert/strict';
import test from 'node:test';
import { serializeJsonLd } from '../src/utils/serialize-json-ld.mjs';

test('schema text cannot close its JSON-LD script element or introduce HTML', () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: '</ScRiPt><script>alert("injected")</script>',
    description: '<!-- </script><img src=x onerror=alert(1)> -->',
  };

  const serialized = serializeJsonLd(schema);
  const html = `<script type="application/ld+json">${serialized}</script>`;

  assert.equal((html.match(/<script\b/gi) ?? []).length, 1);
  assert.equal((html.match(/<\/script\s*>/gi) ?? []).length, 1);
  assert.equal(html.includes('<img'), false);
  assert.deepEqual(JSON.parse(serialized), schema);
});

test('Unicode, punctuation, nested schema arrays and data types round-trip', () => {
  const schema = [
    { name: 'Dharani — தமிழ்', description: 'R&D <research>\u2028line\u2029paragraph' },
    { quote: '"quoted" \\ path', count: 0, active: false, optional: null },
  ];

  assert.deepEqual(JSON.parse(serializeJsonLd(schema)), schema);
});

test('values that are not JSON serializable fail explicitly', () => {
  assert.throws(() => serializeJsonLd(undefined), TypeError);
  const circular = {};
  circular.self = circular;
  assert.throws(() => serializeJsonLd(circular), TypeError);
});
