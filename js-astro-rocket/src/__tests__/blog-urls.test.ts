import { describe, it, expect, vi } from 'vitest';

// `lib/blog` imports `astro:content` at the top level for its data helpers.
// The URL helpers under test don't touch the content runtime, so a tiny stub
// is enough to let the module load in a plain Node test environment.
vi.mock('astro:content', () => ({
  getCollection: vi.fn(async () => []),
}));

import {
  getPostSlug,
  getPostUrl,
  getBlogBaseUrl,
  getBlogPageUrl,
  getTagUrl,
  getSecondaryLocales,
} from '@/lib/blog';

// These run with the default i18n config (single locale 'en', i18n off), so
// every URL must stay unprefixed — this is the non-breaking guarantee for the
// single-locale sites that make up the majority of installs.
describe('blog URL helpers (i18n disabled — default)', () => {
  it('strips the locale prefix from a post id to get its slug', () => {
    expect(getPostSlug('en/hello-world')).toBe('hello-world');
    expect(getPostSlug('nl/hallo-wereld', 'nl')).toBe('hallo-wereld');
    // No matching prefix → id returned unchanged.
    expect(getPostSlug('hello-world', 'en')).toBe('hello-world');
  });

  it('builds an unprefixed post URL', () => {
    expect(getPostUrl('en/hello-world')).toBe('/blog/hello-world');
    // Even a non-default locale stays unprefixed while i18n is off.
    expect(getPostUrl('nl/hallo-wereld', 'nl')).toBe('/blog/hallo-wereld');
  });

  it('builds the blog index base URL', () => {
    expect(getBlogBaseUrl()).toBe('/blog');
    expect(getBlogBaseUrl('nl')).toBe('/blog');
  });

  it('maps page 1 to the blog root and pages 2+ to /blog/page/N', () => {
    expect(getBlogPageUrl(1)).toBe('/blog');
    expect(getBlogPageUrl(2)).toBe('/blog/page/2');
    expect(getBlogPageUrl(5)).toBe('/blog/page/5');
  });

  it('builds a tag URL from the slugified tag', () => {
    expect(getTagUrl('astro-rocket')).toBe('/blog/tag/astro-rocket');
    expect(getTagUrl('Web Performance')).toBe('/blog/tag/web-performance');
  });

  it('exposes no secondary locales when i18n is off', () => {
    expect(getSecondaryLocales()).toEqual([]);
  });
});
