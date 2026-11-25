import { describe, it, expect, vi } from 'vitest';

// Exercise the blog URL helpers with i18n turned ON and two locales. The
// default locale stays at the site root; the secondary locale is prefixed.
// This guards the locale-prefixed blog routing wired up for #422.
vi.mock('astro:content', () => ({
  getCollection: vi.fn(async () => []),
}));

vi.mock('@/config/i18n.config', () => ({
  default: {
    enabled: true,
    defaultLocale: 'en',
    locales: ['en', 'nl'],
    localeNames: { en: 'English', nl: 'Nederlands' },
    detectBrowserLocale: false,
  },
}));

import {
  getPostUrl,
  getBlogBaseUrl,
  getBlogPageUrl,
  getTagUrl,
  getSecondaryLocales,
} from '@/lib/blog';

describe('blog URL helpers (i18n enabled — en default, nl secondary)', () => {
  it('keeps default-locale post URLs at the site root', () => {
    expect(getPostUrl('en/hello-world')).toBe('/blog/hello-world');
    expect(getPostUrl('en/hello-world', 'en')).toBe('/blog/hello-world');
  });

  it('prefixes secondary-locale post URLs with the locale', () => {
    expect(getPostUrl('nl/hallo-wereld', 'nl')).toBe('/nl/blog/hallo-wereld');
  });

  it('prefixes the blog index base URL for the secondary locale only', () => {
    expect(getBlogBaseUrl()).toBe('/blog');
    expect(getBlogBaseUrl('en')).toBe('/blog');
    expect(getBlogBaseUrl('nl')).toBe('/nl/blog');
  });

  it('prefixes paginated URLs for the secondary locale', () => {
    expect(getBlogPageUrl(1, 'nl')).toBe('/nl/blog');
    expect(getBlogPageUrl(2, 'nl')).toBe('/nl/blog/page/2');
    expect(getBlogPageUrl(2)).toBe('/blog/page/2');
  });

  it('prefixes tag URLs for the secondary locale', () => {
    expect(getTagUrl('Astro Rocket', 'nl')).toBe('/nl/blog/tag/astro-rocket');
    expect(getTagUrl('Astro Rocket')).toBe('/blog/tag/astro-rocket');
  });

  it('lists the non-default locales as needing prefixed routes', () => {
    expect(getSecondaryLocales()).toEqual(['nl']);
  });
});
