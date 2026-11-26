import { describe, expect, it } from 'vitest';
import { localeFromPath } from './locales.ts';

describe('404 page language', () => {
  it('reads the language from the first segment of a missing address', () => {
    expect(localeFromPath('/en/old-page/', ['fr', 'en', 'it', 'de'], 'fr')).toBe('en');
    expect(localeFromPath('/de/', ['fr', 'en', 'it', 'de'], 'fr')).toBe('de');
  });

  it('falls back to the default language', () => {
    expect(localeFromPath('/old-page/', ['fr', 'en'], 'fr')).toBe('fr');
    expect(localeFromPath('/it/page/', ['fr', 'en'], 'fr')).toBe('fr');
  });
});
