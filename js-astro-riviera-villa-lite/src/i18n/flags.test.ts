import { describe, expect, it } from 'vitest';
import { villa as shipped } from '../../villa.config.ts';
import { validateVilla } from '../config/validate.ts';
import { DEFAULT_FLAGS, FLAG_CODES, FLAG_SVG, flagFor } from './flags.ts';
import { SUPPORTED_LOCALES } from './locales.ts';

const options = { uiLocales: [...SUPPORTED_LOCALES] };

describe('language flags', () => {
  it('has a flag for every language and a drawing for every flag', () => {
    for (const locale of SUPPORTED_LOCALES) expect(FLAG_CODES).toContain(DEFAULT_FLAGS[locale]);
    for (const code of FLAG_CODES) expect(FLAG_SVG[code]).toMatch(/^<(rect|path)/);
  });

  it('shows the UK flag for English unless the config asks for another one', () => {
    expect(flagFor('en')).toBe('gb');
    expect(flagFor('en', { en: 'us' })).toBe('us');
    expect(flagFor('fr', { en: 'us' })).toBe('fr');
  });

  it('accepts a flag choice in the config without asking for translations', () => {
    const config = structuredClone(shipped);
    config.languages = { ...config.languages, flags: { en: 'us' } };
    expect(validateVilla(config, options).villa.languages.flags).toEqual({ en: 'us' });
  });

  it('refuses a flag that the theme cannot draw', () => {
    const config = structuredClone(shipped);
    const languages: Record<string, unknown> = { ...config.languages, flags: { en: 'xx' } };
    expect(() => validateVilla({ ...config, languages }, options)).toThrow(/languages\.flags/);
  });
});
