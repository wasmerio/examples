// Unit tests for skills/site-content/scripts/validate-hub-content.mjs.
//
// The script's `runValidation(root)` is pure (no process.exit/console), so we
// point it at a temp fixture hub: a minimal i18n.ts + site.config.ts registry
// and content trees that trigger each rule. We assert on the returned issue
// levels (error/warning/info) and the file names named in each issue.

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runValidation } from '../skills/site-content/scripts/validate-hub-content.mjs';
import { sectionTypesOf } from '../skills/site-content/scripts/validate-hub-content.mjs';

let root;
let cleanup;

const I18N_SRC = `export const locales = ['en', 'zh-Hans'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
`;

const SITE_CONFIG = `export const products: Product[] = [
  { slug: 'alpha', name: 'Alpha', github: 'https://example.com/alpha', badges: [], featured: true,
    description: { en: 'A', 'zh-Hans': 'A' } },
  { slug: 'beta', name: 'Beta', github: 'https://example.com/beta', badges: [], featured: false,
    base: './docs',
    description: { en: 'B', 'zh-Hans': 'B' } },
];
`;

/** Write a file under the fixture root, creating parent dirs. */
const w = (relPath, content = '') => {
  const full = join(root, relPath);
  mkdirSync(join(full, '..'), { recursive: true });
  writeFileSync(full, content);
  return full;
};

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'hub-validate-'));
  cleanup = () => rmSync(root, { recursive: true, force: true });

  w('src/lib/i18n.ts', I18N_SRC);
  w('site.config.ts', SITE_CONFIG);

  // --- posts/en: alpha-post (published), draft-post (draft) ---
  w('src/content/posts/en/alpha-post.md', '---\ntitle: Alpha\n---\n');
  w('src/content/posts/en/draft-post.md', '---\ntitle: Draft\ndraft: true\n---\n');

  // --- posts/zh-Hans: localized alpha-post + parity warning (beta-post en-only) ---
  w('src/content/posts/zh-Hans/alpha-post.md', '---\ntitle: Alpha\n---\n');
  w('src/content/posts/zh-Hans/beta-post.md', '---\ntitle: Beta\n---\n');

  // --- docs/alpha/en: index + getting-started; zh-Hans has docs but NO index ---
  w('src/content/docs/alpha/en/index.md', '---\ntitle: Alpha\norder: 0\n---\n');
  w('src/content/docs/alpha/en/getting-started.md', '---\ntitle: GS\norder: 1\n---\n');
  w('src/content/docs/alpha/zh-Hans/getting-started.md', '---\ntitle: GS\n---\n');

  // --- docs/alpha/en nested-dir duplicate: foo.md + foo/index.md (error) ---
  w('src/content/docs/alpha/en/foo.md', '---\ntitle: Foo\n---\n');
  w('src/content/docs/alpha/en/foo/index.md', '---\ntitle: Foo\n---\n');

  // --- product-info: en/alpha (registered) + zh-Hans/ghost (unregistered product) ---
  w('src/content/product-info/en/alpha.md', '---\ntagline: A\ndescription: A\n---\n');
  w('src/content/product-info/zh-Hans/ghost.md', '---\ntagline: G\ndescription: G\n---\n');
  w('src/content/product-info/zh-Hans/alpha.md', '---\ntagline: A\ndescription: A\n---\n');

  // --- product-info sections with a type that has no registered component ---
  w('src/content/product-info/en/beta.md', '---\ntagline: B\ndescription: B\nsections:\n  - type: bogus-section\n  - type: hero\n---\n');

  // --- a registered landing-section component ---
  w('src/components/landing-sections/hero.astro', '<div></div>');
});

afterAll(() => cleanup());

describe('runValidation on a fixture hub', () => {
  it('reports the expected issue profile (1 duplicate error, warnings/info elsewhere)', () => {
    const { counts, summary } = runValidation(root);
    // The fixture is deliberately dirty: foo.md + foo/index.md collide (error);
    // the rest are warnings/info (parity, missing zh index, ghost product-info,
    // bogus section type, draft).
    expect(counts.error).toBe(1);
    expect(counts.warning).toBeGreaterThan(0);
    expect(summary.locales).toEqual(['en', 'zh-Hans']);
    expect(summary.products.map((p) => p.slug)).toEqual(['alpha', 'beta']);
  });
});

describe('duplicate slug detection (errors)', () => {
  it('flags foo.md + foo/index.md in the same collection+locale', () => {
    const { issues } = runValidation(root);
    const dupes = issues.error.filter((e) => e[0].includes('duplicate slug'));
    expect(dupes.length).toBe(1);
    expect(dupes[0][0]).toContain("'foo'");
    expect(dupes[0].slice(1).join('\n')).toContain('foo.md');
    expect(dupes[0].slice(1).join('\n')).toContain('foo/index.md');
  });
});

describe('parity warnings', () => {
  it('warns about a zh-Hans-only post with no en counterpart', () => {
    const { issues } = runValidation(root);
    const parity = issues.warning.filter((e) => e[0].includes('no en counterpart'));
    expect(parity.some((e) => e[0].includes('beta-post'))).toBe(true);
    // alpha-post exists in both locales -> no parity warning.
    expect(parity.some((e) => e[0].includes('alpha-post'))).toBe(false);
  });
});

describe('missing docs index warnings', () => {
  it('warns when a locale has docs but no index.md', () => {
    const { issues } = runValidation(root);
    const missing = issues.warning.filter((e) => e[0].includes('missing index.md'));
    expect(missing.some((e) => e[0].includes('alpha, zh-Hans'))).toBe(true);
    // en index exists -> no warning.
    expect(missing.some((e) => e[0].includes('alpha, en'))).toBe(false);
  });
});

describe('unknown product-info slugs', () => {
  it('warns about a product-info file for an unregistered product', () => {
    const { issues } = runValidation(root);
    const unknown = issues.warning.filter((e) => e[0].includes('not a registered product'));
    expect(unknown.some((e) => e[0].includes('ghost'))).toBe(true);
  });
});

describe('unknown section types', () => {
  it('warns about a sections type with no registered component', () => {
    const { issues } = runValidation(root);
    const unknown = issues.warning.filter((e) => e[0].includes('has no registered component'));
    expect(unknown.some((e) => e[0].includes('bogus-section'))).toBe(true);
    // hero is registered -> no warning for it.
    expect(unknown.some((e) => e[0].includes("type 'hero'"))).toBe(false);
  });
});

describe('draft detection (info)', () => {
  it('reports drafts as info and excludes them from parity checks', () => {
    const { issues } = runValidation(root);
    const drafts = issues.info.filter((e) => e[0].includes('is a draft'));
    expect(drafts.some((e) => e[0].includes('draft-post'))).toBe(true);
  });
});

describe('sectionTypesOf', () => {
  it('extracts - type: <name> entries from sections frontmatter', () => {
    const f = w('src/content/product-info/en/tmp-section.md', [
      '---',
      'tagline: X',
      'sections:',
      '  - type: hero',
      '  - type: features',
      '  - plain-item',
      '---',
    ].join('\n'));
    expect(sectionTypesOf(f)).toEqual(['hero', 'features']);
  });
});
