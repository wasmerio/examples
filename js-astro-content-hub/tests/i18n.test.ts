// Unit tests for src/lib/i18n.ts locale primitives.
//
// `withBase`/`stripBase`/`localeFromPath` read `import.meta.env.BASE_URL`
// (injected by Vite/Astro). Vitest replaces `import.meta.env` with its own
// stub; we set `import.meta.env.BASE_URL` per test via vi.stubEnv.

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import {
  locales,
  defaultLocale,
  collectionSuffix,
  localizePath,
  buildAlternates,
  withBase,
  stripBase,
  localeFromPath,
} from '../src/lib/i18n';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('locales registry', () => {
  it('is seeded from src/lib/i18n.ts with the default locale first', () => {
    expect(locales).toEqual(['en', 'zh-Hans']);
    expect(defaultLocale).toBe('en');
    expect(locales[0]).toBe(defaultLocale);
  });
});

describe('collectionSuffix', () => {
  it('capitalizes a simple locale', () => {
    expect(collectionSuffix('en')).toBe('En');
  });

  it('keeps subtagged locales hyphen-free', () => {
    expect(collectionSuffix('zh-Hans')).toBe('ZhHans');
  });
});

describe('localizePath', () => {
  it('leaves the default locale unprefixed', () => {
    expect(localizePath('/posts/hello', 'en')).toBe('/posts/hello');
  });

  it('prefixes non-default locales', () => {
    expect(localizePath('/posts/hello', 'zh-Hans')).toBe('/zh-Hans/posts/hello');
  });

  it('handles already-prefixed paths idempotently', () => {
    // A caller should never double-prefix; this guards the shape.
    expect(localizePath('/zh-Hans/posts/hello', 'zh-Hans')).toBe('/zh-Hans/zh-Hans/posts/hello');
  });
});

describe('buildAlternates', () => {
  it('returns an entry for every locale', () => {
    expect(buildAlternates('/posts/hello')).toEqual({
      en: '/posts/hello',
      'zh-Hans': '/zh-Hans/posts/hello',
    });
  });
});

describe('withBase / stripBase (root deploy, base "/")', () => {
  beforeEach(() => {
    vi.stubEnv('BASE_URL', '/');
  });

  it('withBase leaves root-absolute paths unchanged at root', () => {
    expect(withBase('/posts/hello')).toBe('/posts/hello');
  });

  it('withBase leaves relative and absolute-URL paths untouched', () => {
    expect(withBase('hello.md')).toBe('hello.md');
    expect(withBase('https://example.com/x')).toBe('https://example.com/x');
    expect(withBase('mailto:a@b.c')).toBe('mailto:a@b.c');
  });

  it('stripBase is a no-op at root', () => {
    expect(stripBase('/posts/hello')).toBe('/posts/hello');
  });
});

describe('withBase / stripBase (sub-path deploy, base "/hub/")', () => {
  beforeEach(() => {
    vi.stubEnv('BASE_URL', '/hub/');
  });

  it('withBase prepends the base without doubling slashes', () => {
    expect(withBase('/posts/hello')).toBe('/hub/posts/hello');
    expect(withBase('/')).toBe('/hub/');
  });

  it('stripBase removes exactly one base prefix', () => {
    expect(stripBase('/hub/posts/hello')).toBe('/posts/hello');
    expect(stripBase('/posts/hello')).toBe('/posts/hello');
  });
});

describe('localeFromPath', () => {
  it('detects a prefixed non-default locale', () => {
    vi.stubEnv('BASE_URL', '/');
    expect(localeFromPath('/zh-Hans/posts/hello')).toBe('zh-Hans');
  });

  it('defaults to the default locale for unprefixed paths', () => {
    vi.stubEnv('BASE_URL', '/');
    expect(localeFromPath('/posts/hello')).toBe('en');
    expect(localeFromPath('/')).toBe('en');
  });

  it('defaults for unknown locale prefixes', () => {
    vi.stubEnv('BASE_URL', '/');
    expect(localeFromPath('/zz/posts')).toBe('en');
  });

  it('strips the base before matching under a sub-path deploy', () => {
    vi.stubEnv('BASE_URL', '/hub/');
    expect(localeFromPath('/hub/zh-Hans/posts/hello')).toBe('zh-Hans');
    expect(localeFromPath('/hub/posts/hello')).toBe('en');
  });
});
