// i18n primitives - single source of truth for locales and the machinery
// around them. Instance copy (site name, UI strings, landing copy, product
// copy) lives in src/config/copy.ts and is re-exported at the bottom of this
// file, so every `from './i18n'` import keeps working unchanged.
//
// Adding a language: append to `locales` and fill in every `Record<Locale, …>`
// table here (`localeLabel`, `localeCode`) plus the locale tables in
// src/config/copy.ts. Collection/route code is generic over `locales`, so no
// per-language files are needed. Because every table is typed
// `Record<Locale, …>`, forgetting a locale (or letting its keys drift from
// the `en` seed) is a compile error.

export const locales = ['en', 'zh-Hans'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function isLocale(x: string): x is Locale {
  return (locales as readonly string[]).includes(x);
}

/** Build the PascalCase suffix for a content collection name from a locale
 *  code: `en` -> `En`, `zh` -> `Zh`, `zh-Hans` -> `ZhHans`. Splitting on `-`
 *  and capitalizing each part keeps subtagged locales (script/region) free of
 *  hyphens, which would otherwise leak into collection names (`postsZh-Hans`).
 *  Used by content.config.ts and content.ts to name the per-locale collections. */
export function collectionSuffix(locale: Locale): string {
  return locale
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/** Prefix a path with the locale segment, unless it is the default locale. */
export function localizePath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path}`;
}

/** Prefix a root-absolute path with the deploy base path. The base comes from
 *  `import.meta.env.BASE_URL` (Vite, derived from `base` in astro.config.mjs),
 *  so it stays in sync with the build automatically. Relative and absolute-URL
 *  paths are returned unchanged. Use for every internal <a href>, <img src>,
 *  <link href>, and Astro.redirect() target so they resolve under a sub-path
 *  deploy (e.g. base: '/<repo>/'). */
export function withBase(path: string): string {
  if (!path.startsWith('/')) return path;
  // BASE_URL always ends with '/' (Vite convention); strip it to avoid '//'.
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;
}

/** Inverse of withBase: strip the deploy base prefix from a path. */
export function stripBase(path: string): string {
  const prefix = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (prefix && path.startsWith(prefix)) return path.slice(prefix.length) || '/';
  return path;
}

/** Build the alternates map for a page given its default-locale path.
 *  Every locale gets an entry (localized pages always exist, even as fallbacks). */
export function buildAlternates(defaultLocalePath: string): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = {};
  for (const l of locales) {
    out[l] = localizePath(defaultLocalePath, l);
  }
  return out;
}

/** Infer the current locale from a URL pathname (default locale if no prefix matches).
 *  Strips the deploy base prefix first so locale detection works under a sub-path
 *  deploy (e.g. /astro-content-hub/zh-Hans/ -> zh-Hans). The optional `-Script`
 *  subtag lets prefixed locales like `zh-Hans` match, while plain 2-letter prefixes
 *  (`en`, `ja`) still work. */
export function localeFromPath(pathname: string): Locale {
  const m = stripBase(pathname).match(/^\/([a-z]{2}(?:-[A-Z][a-z]+)?)(?:\/|$)/i);
  if (m && isLocale(m[1])) return m[1];
  return defaultLocale;
}

/** Human-readable label per locale, shown in the locale switcher.
 *  Data-driven (like `localeCode`) so adding a locale forces adding its label. */
export const localeLabel: Record<Locale, string> = {
  en: 'English',
  'zh-Hans': '中文',
};

/** BCP-47 locale code per locale, for `toLocaleDateString` and friends.
 *  Centralized so adding a locale doesn't require hunting down date calls. */
export const localeCode: Record<Locale, string> = {
  en: 'en-US',
  'zh-Hans': 'zh-Hans',
};

// ---------------------------------------------------------------------------
// Instance copy (site name, UI strings, landing copy, product copy) lives in
// src/config/copy.ts - edit that file to rebrand. Re-exported here so every
// existing `from './i18n'` import keeps working unchanged.
// ---------------------------------------------------------------------------
export { siteName, t, home, productCopy, org } from '../config/copy';
export type { UIStrings, HomeCopy, ProductCopy, OrgCopy } from '../config/copy';
