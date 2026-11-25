import { describe, it, expect } from 'vitest';
import {
  collectSlugRecords,
  findSlugCollisions,
  formatSlugCollisions,
  type SlugRecord,
} from '@/lib/content-validation';

const post = (id: string, locale = 'en') => ({ id, data: { locale } });

describe('collectSlugRecords', () => {
  it('maps blog posts to /blog/<slug>, stripping the locale prefix', () => {
    const records = collectSlugRecords([post('en/getting-started')], []);
    expect(records).toEqual([
      { source: 'blog: en/getting-started', locale: 'en', path: '/blog/getting-started' },
    ]);
  });

  it('maps pages to /<slug> at the site root', () => {
    const records = collectSlugRecords([], [post('en/about')]);
    expect(records).toEqual([
      { source: 'pages: en/about', locale: 'en', path: '/about' },
    ]);
  });

  it('keeps nested slugs intact after the locale prefix', () => {
    const records = collectSlugRecords([post('en/guides/deploy')], []);
    expect(records[0].path).toBe('/blog/guides/deploy');
  });

  it('leaves ids without a matching locale prefix unchanged', () => {
    const records = collectSlugRecords([post('getting-started', 'en')], []);
    expect(records[0].path).toBe('/blog/getting-started');
  });
});

describe('findSlugCollisions', () => {
  it('returns nothing when every path is unique within its locale', () => {
    const records: SlugRecord[] = [
      { source: 'blog: en/a', locale: 'en', path: '/blog/a' },
      { source: 'blog: en/b', locale: 'en', path: '/blog/b' },
    ];
    expect(findSlugCollisions(records)).toEqual([]);
  });

  it('does not flag the same path across different locales', () => {
    const records: SlugRecord[] = [
      { source: 'blog: en/a', locale: 'en', path: '/blog/a' },
      { source: 'blog: es/a', locale: 'es', path: '/blog/a' },
    ];
    expect(findSlugCollisions(records)).toEqual([]);
  });

  it('flags two entries that resolve to the same path in one locale', () => {
    const records: SlugRecord[] = [
      { source: 'blog: en/a', locale: 'en', path: '/blog/a' },
      { source: 'blog: en/sub/a', locale: 'en', path: '/blog/a' },
    ];
    const collisions = findSlugCollisions(records);
    expect(collisions).toHaveLength(1);
    expect(collisions[0]).toMatchObject({ locale: 'en', path: '/blog/a' });
    expect(collisions[0].sources).toEqual(['blog: en/a', 'blog: en/sub/a']);
  });

  it('catches a blog post and a page colliding on the same root path', () => {
    const records = collectSlugRecords([post('en/about')], [post('en/about')]);
    // /blog/about and /about do not collide — different URL namespaces.
    expect(findSlugCollisions(records)).toEqual([]);
  });

  it('does collide when two pages share a slug', () => {
    const records = collectSlugRecords([], [post('en/about'), post('about')]);
    const collisions = findSlugCollisions(records);
    expect(collisions).toHaveLength(1);
    expect(collisions[0].path).toBe('/about');
  });
});

describe('formatSlugCollisions', () => {
  it('produces a readable, actionable message listing every source', () => {
    const message = formatSlugCollisions([
      { locale: 'en', path: '/blog/a', sources: ['blog: en/a', 'blog: en/sub/a'] },
    ]);
    expect(message).toContain('Duplicate slugs detected');
    expect(message).toContain('[en] /blog/a');
    expect(message).toContain('blog: en/a');
    expect(message).toContain('blog: en/sub/a');
  });
});
