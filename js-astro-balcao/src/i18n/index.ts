import type { Locale } from '../site.config';
import { en, type Dict } from './en';
import { ptBr } from './pt-br';

export const dictionaries: Record<Locale, Dict> = { en, 'pt-br': ptBr };
export const localeNames: Record<Locale, string> = { en: 'English', 'pt-br': 'Português' };
export const localeShort: Record<Locale, string> = { en: 'EN', 'pt-br': 'PT' };

export function t(locale: Locale): Dict {
  return dictionaries[locale];
}
export type { Dict };
