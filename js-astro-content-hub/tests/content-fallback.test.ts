// Unit tests for the i18n fallback machinery in src/lib/content.ts.
//
// getLocalizedPaths / renderLocalizedPage / getLocalizedDocIndex /
// getLocalizedProductInfo / getPostLocalizedPaths implement the per-page
// fallback contract (a missing zh-Hans page renders the en body inside the
// zh-Hans shell). They call getCollection/render from 'astro:content', which
// we stub here with a tiny in-memory registry keyed by collection name.

import { describe, it, expect, vi, beforeEach } from 'vitest';

// In-memory collections: name -> entry[].
const store = new Map();

vi.mock('astro:content', () => ({
  getCollection: vi.fn(async (name) => store.get(name) ?? []),
  render: vi.fn(async (entry) => ({
    Content: () => `<div>${entry.data.title}</div>`,
    headings: [{ depth: 2, slug: 'x', text: entry.data.title }],
  })),
}));

// The module under test imports astro:content statically; vitest hoists the
// mock above, so this import resolves against the stub.
import {
  getLocalizedPaths,
  renderLocalizedPage,
  getLocalizedDocIndex,
  getLocalizedProductInfo,
  getPostLocalizedPaths,
  getLocalizedPosts,
} from '../src/lib/content';

import type { Locale } from '../src/lib/i18n';

const doc = (id, data = {}) => ({ id, data: { title: id, order: 0, ...data } });

/** Seed the store for a product's docs across locales. */
function seedDocs(product, { en, zh }) {
  const name = (l) => `${product}Docs${l === 'en' ? 'En' : 'ZhHans'}`;
  store.set(name('en'), en);
  store.set(name('zh-Hans'), zh);
}

const seedPosts = (en, zh) => {
  store.set('postsEn', en);
  store.set('postsZhHans', zh);
};

beforeEach(() => {
  store.clear();
  vi.clearAllMocks();
});

describe('getLocalizedPaths (fallback path generation)', () => {
  it('default locale: every doc becomes a path, index excluded', async () => {
    seedDocs('vite', { en: [doc('index'), doc('a'), doc('b')], zh: [] });
    const paths = await getLocalizedPaths('vite', '/vite/docs', 'en');
    expect(paths.map((p) => p.props.slug).sort()).toEqual(['a', 'b']);
    expect(paths.every((p) => p.props.isFallback === false)).toBe(true);
  });

  it('non-default locale: localized docs are primary, en-only docs are fallbacks', async () => {
    seedDocs('vite', {
      en: [doc('index'), doc('a'), doc('b'), doc('c')],
      zh: [doc('index'), doc('a')],
    });
    const paths = await getLocalizedPaths('vite', '/zh-Hans/vite/docs', 'zh-Hans');
    const bySlug = Object.fromEntries(paths.map((p) => [p.props.slug, p.props]));
    expect(bySlug['a'].isFallback).toBe(false);
    expect(bySlug['b'].isFallback).toBe(true);
    expect(bySlug['c'].isFallback).toBe(true);
    // index excluded entirely.
    expect(bySlug['index']).toBeUndefined();
  });

  it('non-default locale with full parity produces zero fallbacks', async () => {
    seedDocs('astro', { en: [doc('index'), doc('x')], zh: [doc('index'), doc('x')] });
    const paths = await getLocalizedPaths('astro', '/zh-Hans/astro/docs', 'zh-Hans');
    expect(paths.every((p) => p.props.isFallback === false)).toBe(true);
  });
});

describe('renderLocalizedPage', () => {
  it('renders the primary locale when present', async () => {
    seedDocs('vite', {
      en: [doc('index'), doc('a', { title: 'En A' })],
      zh: [doc('index'), doc('a', { title: 'Zh A' })],
    });
    const page = await renderLocalizedPage('vite', 'zh-Hans', 'a', '/zh-Hans/vite/docs');
    expect(page).not.toBeNull();
    expect(page.title).toBe('Zh A');
    expect(page.isFallback).toBe(false);
  });

  it('falls back to the default-locale body and flags isFallback', async () => {
    seedDocs('vite', {
      en: [doc('index'), doc('only-en', { title: 'En Only' })],
      zh: [doc('index')],
    });
    const page = await renderLocalizedPage('vite', 'zh-Hans', 'only-en', '/zh-Hans/vite/docs');
    expect(page).not.toBeNull();
    expect(page.title).toBe('En Only');
    expect(page.isFallback).toBe(true);
  });

  it('returns null when the doc does not exist in either locale', async () => {
    seedDocs('vite', { en: [doc('index')], zh: [doc('index')] });
    expect(await renderLocalizedPage('vite', 'zh-Hans', 'missing', '/zh-Hans/vite/docs')).toBeNull();
  });

  it('builds the sidebar nav from the source language (default for fallback pages)', async () => {
    seedDocs('vite', {
      en: [doc('index'), doc('a', { title: 'A-en', order: 0 }), doc('b', { title: 'B-en', order: 1 })],
      zh: [doc('index'), doc('a', { title: 'A-zh', order: 0 })],
    });
    const page = await renderLocalizedPage('vite', 'zh-Hans', 'b', '/zh-Hans/vite/docs');
    expect(page.isFallback).toBe(true);
    // Nav comes from the default-locale collection (en titles).
    expect(page.navItems.map((n) => n.label)).toEqual(['index', 'A-en', 'B-en']);
  });
});

describe('getLocalizedDocIndex', () => {
  it('resolves the index with locale-aware nav', async () => {
    seedDocs('vite', {
      en: [doc('index', { title: 'En Index' }), doc('a', { title: 'A' })],
      zh: [doc('index', { title: 'Zh Index' }), doc('a', { title: 'A' })],
    });
    const page = await getLocalizedDocIndex('vite', 'zh-Hans', '/zh-Hans/vite/docs');
    expect(page.title).toBe('Zh Index');
    expect(page.isFallback).toBe(false);
  });

  it('falls back to the en index when the locale has no index', async () => {
    seedDocs('vite', {
      en: [doc('index', { title: 'En Index' })],
      zh: [doc('a')], // docs exist but no index
    });
    const page = await getLocalizedDocIndex('vite', 'zh-Hans', '/zh-Hans/vite/docs');
    expect(page.title).toBe('En Index');
    expect(page.isFallback).toBe(true);
  });
});

describe('getPostLocalizedPaths & getLocalizedPosts', () => {
  it('excludes drafts and adds en-only posts as fallbacks in zh-Hans', async () => {
    const en = [
      { id: 'a', data: { title: 'A', date: new Date(), tags: [], draft: false } },
      { id: 'draft', data: { title: 'D', date: new Date(), tags: [], draft: true } },
      { id: 'only-en', data: { title: 'OE', date: new Date(), tags: [], draft: false } },
    ];
    seedPosts(en, [{ id: 'a', data: { title: 'A', date: new Date(), tags: [], draft: false } }]);

    const paths = await getPostLocalizedPaths('zh-Hans');
    const bySlug = Object.fromEntries(paths.map((p) => [p.props.slug, p.props]));
    expect(bySlug['a'].isFallback).toBe(false);
    expect(bySlug['only-en'].isFallback).toBe(true);
    expect(bySlug['draft']).toBeUndefined();

    const all = await getLocalizedPosts('zh-Hans');
    expect(all.map(({ entry }) => entry.id).sort()).toEqual(['a', 'only-en']);
    const onlyEn = all.find((p) => p.entry.id === 'only-en');
    expect(onlyEn.isFallback).toBe(true);
  });

  it('default locale has no fallbacks and no drafts', async () => {
    seedPosts(
      [
        { id: 'a', data: { title: 'A', date: new Date(), tags: [], draft: false } },
        { id: 'draft', data: { title: 'D', date: new Date(), tags: [], draft: true } },
      ],
      [],
    );
    const paths = await getPostLocalizedPaths('en');
    expect(paths.map((p) => p.props.slug)).toEqual(['a']);
  });
});

describe('getLocalizedProductInfo', () => {
  const info = (title, extra = {}) => ({
    id: title,
    body: `body ${title}`,
    data: {
      tagline: title,
      description: title,
      features: [],
      highlights: [],
      links: [],
      ...extra,
    },
  });
  const name = (l) => `productInfo${l === 'en' ? 'En' : 'ZhHans'}`;

  it('resolves the primary locale with fallback flag off', async () => {
    store.set(name('en'), [info('alpha')]);
    store.set(name('zh-Hans'), [info('alpha', { tagline: '中文' })]);
    const p = await getLocalizedProductInfo('alpha', 'zh-Hans');
    expect(p.tagline).toBe('中文');
    expect(p.isFallback).toBe(false);
  });

  it('falls back to the en info when the locale lacks the product', async () => {
    store.set(name('en'), [info('alpha')]);
    store.set(name('zh-Hans'), []);
    const p = await getLocalizedProductInfo('alpha', 'zh-Hans');
    expect(p.isFallback).toBe(true);
    expect(p.hasBody).toBe(true);
  });

  it('returns null when the product exists in no locale', async () => {
    store.set(name('en'), []);
    store.set(name('zh-Hans'), []);
    expect(await getLocalizedProductInfo('alpha', 'zh-Hans')).toBeNull();
  });
});
