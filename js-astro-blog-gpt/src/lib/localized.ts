import { canonicalLocale, localeChain } from './locale.ts';
import type { Locale, Localized } from '../types/config';

/** Interface copy prefers the requested locale, the default, then available locales. */
export function resolveLocalized(
  value: Localized,
  lang: Locale,
  defaultLocale: Locale,
  locales: readonly Locale[] = [],
): string {
  if (typeof value === 'string') return value;
  const values = new Map(
    Object.entries(value).map(([code, text]) => [canonicalLocale(code), text]),
  );
  for (const code of [
    ...localeChain(lang),
    ...localeChain(defaultLocale),
    ...locales.flatMap(localeChain),
  ]) {
    const text = values.get(code);
    if (text !== undefined) return text;
  }
  return Object.values(value).find((text) => text !== undefined) ?? '';
}
