import { describe, it, expect, vi } from 'vitest';

// A small blog collection covering the cases getPostTranslations must handle:
// a uid-matched translation at a *different* slug, a slug-matched translation,
// a post with no translation, and a draft that must be ignored. `de` is
// configured but has no posts, so it must never appear in results.
const MOCK_POSTS = [
  { id: 'en/hello', data: { locale: 'en', uid: 'greeting', title: 'Hello', draft: false } },
  { id: 'nl/hallo', data: { locale: 'nl', uid: 'greeting', title: 'Hallo', draft: false } },
  { id: 'en/about-us', data: { locale: 'en', title: 'About', draft: false } },
  { id: 'nl/about-us', data: { locale: 'nl', title: 'Over ons', draft: false } },
  { id: 'en/solo', data: { locale: 'en', title: 'Solo', draft: false } },
  // Draft translation of `solo` — must be ignored (never offered as a target).
  { id: 'nl/solo', data: { locale: 'nl', title: 'Solo NL', draft: true } },
];

vi.mock('astro:content', () => ({
  getCollection: vi.fn(async () => MOCK_POSTS),
}));

vi.mock('@/config/i18n.config', () => ({
  default: {
    enabled: true,
    defaultLocale: 'en',
    locales: ['en', 'nl', 'de'],
    localeNames: { en: 'English', nl: 'Nederlands', de: 'Deutsch' },
    detectBrowserLocale: false,
  },
}));

import { getPostTranslations } from '@/lib/post-links';

describe('getPostTranslations', () => {
  it('resolves a uid-matched translation that lives at a different slug', async () => {
    const result = await getPostTranslations('en/hello', 'en', 'greeting');
    expect(result).toEqual([
      { locale: 'en', url: '/blog/hello' },
      { locale: 'nl', url: '/nl/blog/hallo' },
    ]);
  });

  it('is symmetric from the secondary locale', async () => {
    const result = await getPostTranslations('nl/hallo', 'nl', 'greeting');
    expect(result).toEqual([
      { locale: 'en', url: '/blog/hello' },
      { locale: 'nl', url: '/nl/blog/hallo' },
    ]);
  });

  it('falls back to an identically-slugged translation when there is no uid', async () => {
    const result = await getPostTranslations('en/about-us', 'en');
    expect(result).toEqual([
      { locale: 'en', url: '/blog/about-us' },
      { locale: 'nl', url: '/nl/blog/about-us' },
    ]);
  });

  it('returns only the post itself when no translation exists', async () => {
    const result = await getPostTranslations('en/solo', 'en');
    expect(result).toEqual([{ locale: 'en', url: '/blog/solo' }]);
  });

  it('never points at a draft translation', async () => {
    const result = await getPostTranslations('en/solo', 'en');
    expect(result.some((t) => t.locale === 'nl')).toBe(false);
  });

  it('omits configured locales that have no matching post (no 404s)', async () => {
    const result = await getPostTranslations('en/hello', 'en', 'greeting');
    expect(result.some((t) => t.locale === 'de')).toBe(false);
  });
});
