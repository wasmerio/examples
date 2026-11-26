/**
 * What a fallback page says in its head, read from the build.
 *
 * `npm test` builds first, so dist/ is the real output. A fallback page is
 * English words at a locale URL: it must canonicalise to the English page, be
 * kept out of the index, and a translated page must do none of that.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const DIST = path.resolve(import.meta.dirname, '..', 'dist');
const { defaultLocale, locales } = await import('../src/i18n/config.ts');
const targets = locales.filter((locale) => locale !== defaultLocale);

function pages(directory, found = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) pages(full, found);
    else if (entry.name.endsWith('.html')) found.push(full);
  }
  return found;
}

const head = (file) => readFileSync(file, 'utf8').split('</head>')[0];
const canonicalOf = (html) => html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '';

test('fallback pages are noindex and canonical on the original; translated pages are neither', { skip: !existsSync(DIST) }, () => {
  let fallbacks = 0;
  let translated = 0;
  for (const locale of targets) {
    const dir = path.join(DIST, locale);
    if (!existsSync(dir)) continue;
    for (const file of pages(dir)) {
      const html = head(file);
      const canonical = new URL(canonicalOf(html)).pathname;
      const own = canonical.startsWith(`/${locale}/`) || canonical === `/${locale}`;
      const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
      if (own) {
        translated += 1;
        assert.ok(!noindex, `${path.relative(DIST, file)} is translated and must stay indexable`);
      } else {
        fallbacks += 1;
        assert.ok(noindex, `${path.relative(DIST, file)} is a fallback and must say noindex, follow`);
      }
    }
  }
  assert.ok(fallbacks > 0, 'no fallback page in the build: the deliberate Spanish gap is gone, update this test');
  assert.ok(translated > 0, 'no translated page found');
});
