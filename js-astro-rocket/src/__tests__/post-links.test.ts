import { describe, it, expect } from 'vitest';
import { buildUidIndex, normalizeUid, type ResolvedPost } from '@/lib/post-links';

const post = (
  id: string,
  uid: string | undefined,
  title: string,
  locale = 'en'
) => ({ id, data: { locale, uid, title } });

describe('normalizeUid', () => {
  it('strips a leading post: prefix', () => {
    expect(normalizeUid('post:getting-started')).toBe('getting-started');
  });

  it('leaves a bare uid unchanged', () => {
    expect(normalizeUid('getting-started')).toBe('getting-started');
  });
});

describe('buildUidIndex', () => {
  it('indexes posts by uid then locale, deriving slug and title', () => {
    const index = buildUidIndex([
      post('en/astro-rocket-configuration-guide', 'configuration-guide', 'Config Guide'),
    ]);
    expect(index.get('configuration-guide')?.get('en')).toEqual({
      slug: 'astro-rocket-configuration-guide',
      title: 'Config Guide',
    } satisfies ResolvedPost);
  });

  it('skips posts without a uid', () => {
    const index = buildUidIndex([post('en/no-uid', undefined, 'No uid')]);
    expect(index.size).toBe(0);
  });

  it('allows the same uid across different locales (translations)', () => {
    const index = buildUidIndex([
      post('en/guide', 'guide', 'Guide', 'en'),
      post('es/guia', 'guide', 'Guía', 'es'),
    ]);
    expect(index.get('guide')?.get('en')?.slug).toBe('guide');
    expect(index.get('guide')?.get('es')?.slug).toBe('guia');
  });

  it('throws when two posts in the same locale claim the same uid', () => {
    expect(() =>
      buildUidIndex([post('en/a', 'dup', 'A'), post('en/b', 'dup', 'B')])
    ).toThrow(/Duplicate canonical id "dup"/);
  });
});
