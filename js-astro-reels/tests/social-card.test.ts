import { test } from 'node:test';
import assert from 'node:assert/strict';
import { siteConfig } from '../src/config.ts';
import { cardText, createCard, eyebrowFor } from '../src/lib/social-card.ts';
import { SITE_NAME, TAGLINE } from '../src/lib/seo.ts';

test('the card shows the page title without the site name, and the tagline on the home page', () => {
  assert.equal(cardText(`Sonnet 18 - ${SITE_NAME}`), 'Sonnet 18');
  assert.equal(cardText(`${SITE_NAME}: ${TAGLINE}`), TAGLINE);
  assert.equal(cardText('Untouched'), 'Untouched');
});

test('piece pages get the label as eyebrow; home and list pages get none', () => {
  assert.equal(eyebrowFor('https://example.test/'), undefined);
  assert.equal(eyebrowFor('https://example.test/about/'), undefined);
  assert.equal(eyebrowFor(`https://example.test/${siteConfig.pieces.name}/18/`), siteConfig.pieces.label);
});

test('the card is 1200x630 and carries the mark', () => {
  const card = createCard({ title: 'A title', pageUrl: 'https://example.test/', icon: 'data:image/png;base64,AA==' });
  assert.equal(card.props.style['width'], 1200);
  assert.equal(card.props.style['height'], 630);
  assert.match(JSON.stringify(card), /"src":"data:image\/png;base64,AA=="/);
});
