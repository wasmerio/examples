import { getRelativeLocaleUrl } from 'astro:i18n';
import { villa } from '../config/index.ts';
import type { Localized } from '../config/schema.ts';
import { LOCALE_META, type Locale } from './locales.ts';
import { UI, type UiStrings } from './ui/index.ts';

export type PageKey = 'home' | 'legal' | 'privacy';

/** Pages of the layout: the real pages, plus the 404 page (links point to the home page). */
export type LayoutPage = PageKey | 'notFound';

export function linkablePage(page: LayoutPage): PageKey {
  return page === 'notFound' ? 'home' : page;
}

const PAGE_SLUGS: Record<PageKey, string> = { home: '', legal: 'legal', privacy: 'privacy' };

/** Languages other than the default one: they get a /xx/ prefix. */
export function prefixedLocales(): Locale[] {
  return villa.languages.active.filter((l) => l !== villa.languages.default);
}

/** Relative URL of a page in a language, e.g. "/en/legal/". */
export function pagePath(locale: Locale, page: PageKey, hash = ''): string {
  return getRelativeLocaleUrl(locale, PAGE_SLUGS[page]) + hash;
}

/** Absolute URL of a page in a language, for canonical and hreflang links. */
export function pageUrl(locale: Locale, page: PageKey): string {
  return villa.site.url + pagePath(locale, page);
}

export interface I18n {
  locale: Locale;
  ui: UiStrings;
  bcp47: string;
  /** Picks the text of the current language in a translated field. */
  t: (field: Localized | undefined) => string;
  money: (amount: number) => string;
  decimal: (value: number, digits?: number) => string;
  /** "août 2026" from "2026-08". */
  month: (yearMonth: string) => string;
}

/** French typography: a narrow no-break space before : ; ! ? and inside « », so they never start a line. */
export function frenchSpacing(text: string): string {
  return text.replace(/ ([:;!?»])/g, '\u202F$1').replace(/« /g, '«\u202F');
}

function deepMap<T>(value: T, fn: (s: string) => string): T {
  if (typeof value === 'string') return fn(value) as T;
  if (typeof value === 'function') {
    const original = value as (...args: unknown[]) => unknown;
    return ((...args: unknown[]) => deepMap(original(...args), fn)) as T;
  }
  if (Array.isArray(value)) return value.map((v) => deepMap(v, fn)) as T;
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, deepMap(v, fn)])) as T;
  }
  return value;
}

export function useI18n(locale: Locale): I18n {
  const base = UI[locale] ?? UI[villa.languages.default];
  if (!base) throw new Error(`No interface texts for "${locale}" in src/i18n/ui/`);
  const typo = locale === 'fr' ? frenchSpacing : (text: string) => text;
  const ui = locale === 'fr' ? deepMap(base, typo) : base;
  const bcp47 = LOCALE_META[locale].bcp47;
  const fallback = villa.languages.default;
  return {
    locale,
    ui,
    bcp47,
    t: (field) => typo(field?.[locale] ?? field?.[fallback] ?? ''),
    money: (amount) =>
      new Intl.NumberFormat(bcp47, {
        style: 'currency',
        currency: villa.property.currency,
        maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
      }).format(amount),
    decimal: (value, digits = 2) =>
      new Intl.NumberFormat(bcp47, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value),
    month: (yearMonth) => {
      const [y, m] = yearMonth.split('-').map(Number);
      return new Intl.DateTimeFormat(bcp47, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
        new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, 15)),
      );
    },
  };
}

/** Splits a title written with *stars* and line breaks into parts to render. */
export type RichPart = { text: string; em: boolean } | { br: true };

export function richTitle(source: string): RichPart[] {
  const parts: RichPart[] = [];
  source.split('\n').forEach((line, lineIndex) => {
    if (lineIndex > 0) parts.push({ br: true });
    line.split('*').forEach((chunk, i) => {
      if (chunk) parts.push({ text: chunk, em: i % 2 === 1 });
    });
  });
  return parts;
}
