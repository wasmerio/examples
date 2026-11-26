import { expect, it } from 'vitest';
import { parseIntegrations } from './integrations';

const entry = {
  slug: 'editor',
  locale: 'en',
  name: 'Editor',
  description: 'Example integration',
  category: 'editor',
  icon: 'lucide:terminal',
  homepage: 'https://example.com',
  featured: true,
};

it('accepts paired locales without screenshots', () => {
  expect(parseIntegrations([entry, { ...entry, locale: 'pt-br' }])).toHaveLength(2);
});

it('rejects unsafe links and slugs', () => {
  expect(() => parseIntegrations([{ ...entry, homepage: 'javascript:alert(1)' }])).toThrow();
  expect(() => parseIntegrations([{ ...entry, slug: '../escape' }])).toThrow();
});

it('rejects duplicates and missing translations', () => {
  expect(() => parseIntegrations([entry, entry])).toThrow();
  expect(() => parseIntegrations([entry])).toThrow(/translation/);
});

it('allows an empty catalogue', () => expect(parseIntegrations([])).toEqual([]));
