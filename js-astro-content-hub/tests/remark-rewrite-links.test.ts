// Unit tests for the relative-.md link rewriter (src/lib/remark-rewrite-links.mjs).
//
// The pure URL-mapping helpers (urlForContentPath / urlForBaseDoc /
// isRewritable) are exported and tested directly; they are the contract the
// Sätteri plugin relies on. The plugin factory itself touches the filesystem
// (buildUrlMap scans src/content), which is exercised implicitly by the build.

import { describe, it, expect } from 'vitest';
import {
  urlForContentPath,
  urlForBaseDoc,
  localePrefix,
  isRewritable,
} from '../src/lib/remark-rewrite-links.mjs';

describe('urlForContentPath', () => {
  it('maps a default-locale post to /posts/<slug>', () => {
    expect(urlForContentPath('posts/en/hello.md')).toBe('/posts/hello');
  });

  it('maps a non-default-locale post to /<locale>/posts/<slug>', () => {
    expect(urlForContentPath('posts/zh-Hans/hello.md')).toBe('/zh-Hans/posts/hello');
  });

  it('maps docs slugs under the product, locale-prefixed when needed', () => {
    expect(urlForContentPath('docs/vite/en/why-vite.md')).toBe('/vite/docs/why-vite');
    expect(urlForContentPath('docs/vite/zh-Hans/why-vite.md')).toBe('/zh-Hans/vite/docs/why-vite');
  });

  it('special-cases docs index.md to the collection base', () => {
    expect(urlForContentPath('docs/vite/en/index.md')).toBe('/vite/docs');
    expect(urlForContentPath('docs/astro/zh-Hans/index.md')).toBe('/zh-Hans/astro/docs');
  });

  it('returns null for unknown locales', () => {
    expect(urlForContentPath('posts/fr/hello.md')).toBeNull();
    expect(urlForContentPath('docs/vite/fr/x.md')).toBeNull();
  });

  it('returns null for paths outside posts/docs', () => {
    expect(urlForContentPath('assets/readme.md')).toBeNull();
    expect(urlForContentPath('docs/vite.md')).toBeNull(); // missing locale segment
  });
});

describe('urlForBaseDoc', () => {
  it('injects the owning product into the URL', () => {
    expect(urlForBaseDoc('astro-content-hub', 'en/getting-started.md')).toBe(
      '/astro-content-hub/docs/getting-started',
    );
  });

  it('prefixes non-default locales', () => {
    expect(urlForBaseDoc('astro-content-hub', 'zh-Hans/getting-started.md')).toBe(
      '/zh-Hans/astro-content-hub/docs/getting-started',
    );
  });

  it('special-cases index.md', () => {
    expect(urlForBaseDoc('astro-content-hub', 'en/index.md')).toBe('/astro-content-hub/docs');
  });

  it('returns null for unknown locales or malformed paths', () => {
    expect(urlForBaseDoc('astro-content-hub', 'fr/x.md')).toBeNull();
    expect(urlForBaseDoc('astro-content-hub', 'just-a-file.md')).toBeNull();
  });
});

describe('localePrefix', () => {
  it('is empty for the default locale and /<locale> otherwise', () => {
    expect(localePrefix('en')).toBe('');
    expect(localePrefix('zh-Hans')).toBe('/zh-Hans');
  });
});

describe('isRewritable', () => {
  it('accepts relative .md links (with optional anchor/query)', () => {
    expect(isRewritable('./getting-started.md')).toBe(true);
    expect(isRewritable('../zh-Hans/index.md#top')).toBe(true);
    expect(isRewritable('docs/guide.md?raw')).toBe(true);
  });

  it('rejects external URLs, anchors, absolute paths, and non-md targets', () => {
    expect(isRewritable('https://example.com/a.md')).toBe(false);
    expect(isRewritable('mailto:a@b.c')).toBe(false);
    expect(isRewritable('#top')).toBe(false);
    expect(isRewritable('/vite/docs')).toBe(false);
    expect(isRewritable('guide.html')).toBe(false);
    expect(isRewritable('')).toBe(false);
  });
});
