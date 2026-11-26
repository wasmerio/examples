/**
 * Every decision this site makes about languages, in one file.
 *
 * Adding a language is one entry here plus running `npm run i18n:translate`.
 * Nothing else in `src/` enumerates locales.
 */

export const defaultLocale = 'en' as const;

/**
 * Key order is the order of the language picker. The default locale first.
 *
 * `name` is what a reader sees, in their own language: a French speaker looking
 * for French finds "Français", never "French". `short` is the picker's
 * collapsed state. `language` is the `lang` attribute and `locale` the
 * `og:locale`, kept apart because the region is a decision rather than a
 * formality: `pt` is a choice between `pt-BR` and `pt-PT`, and readers notice
 * which one you made.
 */
export const localeConfig = {
  en: { name: 'English', short: 'EN', language: 'en', locale: 'en_US' },
  fr: { name: 'Français', short: 'FR', language: 'fr', locale: 'fr_FR' },
  de: { name: 'Deutsch', short: 'DE', language: 'de', locale: 'de_DE' },
  es: { name: 'Español', short: 'ES', language: 'es', locale: 'es_ES' },
} as const;

export type Locale = keyof typeof localeConfig;

export const locales = Object.keys(localeConfig) as Locale[];

/**
 * The language each locale is translated INTO, written the way a translator
 * would name it. This is the only place the string reaches AI Glot, and it is
 * deliberately a full language name rather than a code: "Brazilian Portuguese"
 * says something `pt` does not.
 */
export const translationLanguage: Record<Exclude<Locale, typeof defaultLocale>, string> = {
  fr: 'French',
  de: 'German',
  es: 'Spanish',
};

/**
 * What a locale does with a page it has not translated yet. Change this one
 * word to change the behaviour of the whole site.
 *
 * `fallback` — `/de/blog/a-post` exists and serves the English text, with a
 *   notice and a canonical pointing at `/blog/a-post`. Nobody meets a 404 for
 *   a page that exists, and the URL a colleague shared keeps working. This is
 *   what Starlight does, and the right long-run setting.
 *
 * `redirect` — `/de/blog/a-post` sends the reader to `/blog/a-post`. Honest
 *   about what is and is not translated, and it keeps a thin locale small.
 *   Right while a language is three pages old.
 *
 * Either way the page is never indexed as German: see `<Seo>` in
 * `src/components/Seo.astro`, which is what keeps three URLs from competing for
 * one page's ranking.
 */
export const untranslated: 'fallback' | 'redirect' = 'fallback';

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && (locales as string[]).includes(value));
}

/** `''` for English, `/fr` for the rest. */
export function localePrefix(locale: Locale): string {
  return locale === defaultLocale ? '' : `/${locale}`;
}

/**
 * The URL of `path` in `locale`. `path` is always written the English way,
 * starting with a slash: `/about`, `/blog/hello`, or `/` for the home page.
 *
 * The path after the locale segment IS the translation key. There is no
 * mapping table, on purpose: a localized slug reads better and turns "which
 * page is this a translation of" from string arithmetic into a table that
 * every link, the picker and the freshness check then read, each of them one
 * stale row from being wrong.
 */
export function localizedPath(locale: Locale, path: string): string {
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  return `${localePrefix(locale)}${clean}` || '/';
}
