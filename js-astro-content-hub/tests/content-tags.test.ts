// Unit tests for the pure tag/related-post helpers in src/lib/tags.ts.
// These operate on plain post entries (TagPostEntry) and never touch
// astro:content, so no mocking is needed.

import { describe, it, expect } from 'vitest';
import {
  tagSlug,
  tagsOfEntries,
  filterEntriesByTagSlug,
  relatedEntries,
} from '../src/lib/tags';

const d = (iso: string) => new Date(iso);

/** Build a minimal post entry. */
const post = (id: string, tags: string[], date = '2026-01-01') => ({
  id,
  data: { title: id, date: d(date), tags },
});

describe('tagSlug', () => {
  it('lowercases and kebab-cases', () => {
    expect(tagSlug('Web Performance')).toBe('web-performance');
    expect(tagSlug('i18n')).toBe('i18n');
  });

  it('strips punctuation and leading/trailing dashes', () => {
    expect(tagSlug('  Astro, 5  ')).toBe('astro-5');
    expect(tagSlug('-meta-architecture-')).toBe('meta-architecture');
  });

  it('handles empty and whitespace-only input', () => {
    expect(tagSlug('')).toBe('');
    expect(tagSlug('   ')).toBe('');
  });

  it('normalizes non-ASCII tags to empty (ASCII-only contract)', () => {
    expect(tagSlug('中文')).toBe('');
  });
});

describe('tagsOfEntries', () => {
  it('aggregates counts across posts', () => {
    const entries = [
      post('a', ['astro', 'performance']),
      post('b', ['astro', 'i18n']),
      post('c', ['i18n']),
    ];
    const tags = tagsOfEntries(entries);
    expect(tags).toEqual([
      { slug: 'astro', label: 'astro', count: 2 },
      { slug: 'i18n', label: 'i18n', count: 2 },
      { slug: 'performance', label: 'performance', count: 1 },
    ]);
  });

  it('orders by count desc, then label asc', () => {
    const entries = [
      post('a', ['zzz']),
      post('b', ['aaa']),
      post('c', ['zzz']),
    ];
    const tags = tagsOfEntries(entries);
    expect(tags.map((t) => t.slug)).toEqual(['zzz', 'aaa']);
  });

  it('collapses tags that share a slug across locales', () => {
    const entries = [
      post('a', ['i18n']),
      post('b', ['I18N']),
    ];
    const tags = tagsOfEntries(entries);
    expect(tags).toHaveLength(1);
    expect(tags[0].count).toBe(2);
    // Label comes from the first post that used the tag.
    expect(tags[0].label).toBe('i18n');
  });
});

describe('filterEntriesByTagSlug', () => {
  it('matches by normalized slug and sorts newest first', () => {
    const entries = [
      post('old', ['Web Performance'], '2026-01-01'),
      post('new', ['web-performance'], '2026-02-01'),
      post('other', ['astro'], '2026-03-01'),
    ];
    const out = filterEntriesByTagSlug(entries, 'Web Performance');
    expect(out.map((p) => p.id)).toEqual(['new', 'old']);
  });

  it('returns [] when no post has the tag', () => {
    expect(filterEntriesByTagSlug([post('a', ['x'])], 'missing')).toEqual([]);
  });
});

describe('relatedEntries', () => {
  const entries = [
    post('base', ['astro', 'performance'], '2026-01-01'),
    post('shared', ['astro', 'performance', 'i18n'], '2026-01-02'),
    post('partial', ['astro'], '2026-01-03'),
    post('unrelated', ['design'], '2026-01-04'),
  ];

  it('ranks by shared-tag count, ties broken by recency', () => {
    const out = relatedEntries(entries, 'base');
    // shared(2 tags) then partial(1 tag); zero-score posts fill the rest
    // up to the default limit of 3.
    expect(out.map((p) => p.id)).toEqual(['shared', 'partial', 'unrelated']);
  });

  it('respects the limit', () => {
    expect(relatedEntries(entries, 'base', 1).map((p) => p.id)).toEqual(['shared']);
  });

  it('excludes the current post itself', () => {
    const out = relatedEntries(entries, 'base');
    expect(out.some((p) => p.id === 'base')).toBe(false);
  });

  it('falls back to newest posts when no tags overlap', () => {
    const lonely = [post('solo', ['x'], '2026-01-01'), post('newer', ['y'], '2026-01-05')];
    const out = relatedEntries(lonely, 'solo');
    expect(out.map((p) => p.id)).toEqual(['newer']);
  });

  it('handles a missing current slug by returning newest others', () => {
    const out = relatedEntries(entries, 'does-not-exist', 2);
    expect(out.map((p) => p.id)).toEqual(['unrelated', 'partial']);
  });
});
