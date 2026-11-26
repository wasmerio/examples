import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, LOCALES, htmlLang, localizePath, switchLocalePath, toLocale } from './locales';
import { ui, useTranslations } from './ui';

describe('locales', () => {
  it('serves English by default and Brazilian Portuguese', () => {
    expect(DEFAULT_LOCALE).toBe('en');
    expect(LOCALES).toEqual(['en', 'pt-br']);
  });

  it('falls back to the default for unknown values', () => {
    expect(toLocale('pt-br')).toBe('pt-br');
    expect(toLocale(undefined)).toBe('en');
    expect(toLocale('fr')).toBe('en');
  });

  it('maps locales to BCP 47 html lang values', () => {
    expect(htmlLang('en')).toBe('en');
    expect(htmlLang('pt-br')).toBe('pt-BR');
  });
});

describe('localizePath', () => {
  it('keeps English paths unprefixed', () => {
    expect(localizePath('/ports', 'en')).toBe('/ports');
    expect(localizePath('/', 'en')).toBe('/');
  });

  it('prefixes other locales', () => {
    expect(localizePath('/ports/ghostty', 'pt-br')).toBe('/pt-br/ports/ghostty');
    expect(localizePath('/', 'pt-br')).toBe('/pt-br');
  });

  it('keeps the hash', () => {
    expect(localizePath('/docs#quickstart', 'pt-br')).toBe('/pt-br/docs#quickstart');
  });
});

describe('switchLocalePath', () => {
  it('moves the current page to another locale', () => {
    expect(switchLocalePath('/ports/ghostty', 'pt-br')).toBe('/pt-br/ports/ghostty');
    expect(switchLocalePath('/pt-br/ports/ghostty', 'en')).toBe('/ports/ghostty');
    expect(switchLocalePath('/pt-br', 'en')).toBe('/');
    expect(switchLocalePath('/pt-br/', 'en')).toBe('/');
    expect(switchLocalePath('/', 'pt-br')).toBe('/pt-br');
  });
});

describe('ui dictionary', () => {
  it('has the same keys in every locale', () => {
    const keys = Object.keys(ui.en).sort();
    for (const locale of LOCALES) {
      expect(Object.keys(ui[locale]).sort(), locale).toEqual(keys);
    }
  });

  it('has no empty strings', () => {
    for (const locale of LOCALES) {
      for (const [key, value] of Object.entries(ui[locale])) {
        expect(value.trim(), `${locale}.${key}`).not.toBe('');
      }
    }
  });

  it('interpolates {placeholders}', () => {
    const t = useTranslations('pt-br');
    expect(t('ports.count', { count: 11 })).toContain('11');
  });
});
