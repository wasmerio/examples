/**
 * The assertions that protect the translation workflow.
 *
 * None of them need a network, a key or a build: they read the repository as
 * it is committed. What they are guarding against is the failure mode of every
 * multilingual site, which is not a crash but a page that renders correctly in
 * the wrong language, or a file that looks like shipped work and is served to
 * nobody.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const ROOT = path.resolve(import.meta.dirname, '..');
const read = (file) => readFileSync(path.join(ROOT, file), 'utf8');
const json = (file) => JSON.parse(read(file));

const { defaultLocale, locales, localeConfig, translationLanguage, localizedPath } = await import(
  '../src/i18n/config.ts'
);

const targets = locales.filter((locale) => locale !== defaultLocale);

test('every locale is fully declared', () => {
  for (const locale of locales) {
    const entry = localeConfig[locale];
    assert.ok(entry, `${locale} has no entry in localeConfig`);
    for (const field of ['name', 'short', 'language', 'locale']) {
      assert.ok(entry[field], `${locale}.${field} is missing`);
    }
  }
  for (const locale of targets) {
    assert.ok(
      translationLanguage[locale],
      `${locale} has no language name, so a translation run would not know what to ask for`,
    );
  }
});

test('the default locale keeps unprefixed URLs', () => {
  assert.equal(localizedPath(defaultLocale, '/'), '/');
  assert.equal(localizedPath(defaultLocale, '/about'), '/about');
  assert.equal(localizedPath('fr', '/'), '/fr');
  assert.equal(localizedPath('fr', '/blog/quiet-tools'), '/fr/blog/quiet-tools');
});

test('no translated post is an orphan', () => {
  /* A file nothing serves, nothing lists and nothing reports, sitting in the
     repository looking like work that shipped. A typo in a file name makes
     one, and only this check finds it. */
  const sources = new Set(readdirSync(path.join(ROOT, 'src/content/blog', defaultLocale)));
  for (const locale of targets) {
    const dir = path.join(ROOT, 'src/content/blog', locale);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir).filter((name) => name.endsWith('.md'))) {
      assert.ok(
        sources.has(file),
        `src/content/blog/${locale}/${file} has no source at src/content/blog/${defaultLocale}/${file}`,
      );
    }
  }
});

test('translated posts keep the data fields of their source', () => {
  const field = (source, key) => source.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))?.[1].trim();
  for (const locale of targets) {
    const dir = path.join(ROOT, 'src/content/blog', locale);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir).filter((name) => name.endsWith('.md'))) {
      const source = read(`src/content/blog/${defaultLocale}/${file}`);
      const translation = read(`src/content/blog/${locale}/${file}`);
      for (const key of ['date', 'author', 'glyph']) {
        /* `author` is optional. Asserting equality of two undefineds is
           harmless; asserting the key exists would fail every post on a site
           that does not use bylines. */
        assert.equal(
          field(translation, key),
          field(source, key),
          `${locale}/${file}: ${key} was translated, and it is data`,
        );
      }
    }
  }
});

test('no locale file invents a key English does not have', () => {
  /* The reverse direction is fine and expected: a missing key falls back to
     English. A key English does NOT have is dead weight that no page reads,
     and it usually means a rename happened on one side only. */
  const shape = (value, prefix = '', out = []) => {
    if (value && typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) {
        shape(child, prefix ? `${prefix}.${key}` : key, out);
      }
    } else out.push(prefix);
    return out;
  };

  const english = new Set(shape(json('src/i18n/strings/en.json')));
  for (const locale of targets) {
    const file = `src/i18n/strings/${locale}.json`;
    if (!existsSync(path.join(ROOT, file))) continue;
    for (const key of shape(json(file))) {
      assert.ok(english.has(key), `${file} has ${key}, which en.json does not`);
    }
  }
});

test('the lock file never claims a translation that does not exist', () => {
  const lockFile = 'src/content/blog/.i18n-lock.json';
  if (!existsSync(path.join(ROOT, lockFile))) return;
  const lock = json(lockFile);
  for (const [locale, posts] of Object.entries(lock)) {
    for (const slug of Object.keys(posts)) {
      assert.ok(
        existsSync(path.join(ROOT, 'src/content/blog', locale, `${slug}.md`)),
        `${lockFile} records ${locale}/${slug}, which is not a file. The lock would report it as current.`,
      );
    }
  }
});
