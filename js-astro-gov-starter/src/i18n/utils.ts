import en from './en.json';
import es from './es.json';

export type Locale = 'en' | 'es';

/** All locales served by the site. Keep in sync with LOCALES in astro.config.mjs. */
export const locales: Locale[] = ['en', 'es'];

/** The unprefixed locale (served at `/`). Keep in sync with DEFAULT_LOCALE in astro.config.mjs. */
export const defaultLocale: Locale = 'en';

/**
 * Metadata for each locale, keyed off `locales` so the language selector,
 * og:locale tags, and hreflang links all stay in sync automatically when a
 * locale is added — see "Adding a new language" in README.md.
 */
export const localeMeta: Record<Locale, { label: string; ogLocale: string }> = {
  en: { label: 'English', ogLocale: 'en_US' },
  es: { label: 'Español', ogLocale: 'es_US' },
};

/** URL path segment for a locale: undefined for the default (unprefixed) locale. */
export function localeParam(locale: Locale): string | undefined {
  return locale === defaultLocale ? undefined : locale;
}

/**
 * getStaticPaths() entries for the [...lang] locale routes:
 * English at /, Spanish at /es/. Pages receive `locale` as a prop.
 */
export function localeStaticPaths() {
  return locales.map((locale) => ({
    params: { lang: localeParam(locale) },
    props: { locale },
  }));
}

const translations = { en, es } as const;

export type TranslationKeys = typeof en;

export function useTranslations(locale: Locale) {
  return function t(key: string): string {
    const keys = key.split('.');
    let value: unknown = translations[locale];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        // Fall back to English if key not found in requested locale
        value = keys.reduce<unknown>((acc, k2) => {
          if (acc && typeof acc === 'object' && k2 in acc) {
            return (acc as Record<string, unknown>)[k2];
          }
          return undefined;
        }, translations.en);
        break;
      }
    }

    return typeof value === 'string' ? value : key;
  };
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, first] = url.pathname.split('/');
  return locales.find((locale) => localeParam(locale) === first) ?? defaultLocale;
}

export function withBase(path: string): string {
  if (!path || !path.startsWith('/')) return path;
  const base = import.meta.env.BASE_URL; // always ends with / (normalized in astro.config.mjs)
  return base + path.slice(1);
}

/** Prefix an unlocalized path (e.g. `/services/`) with a locale's URL segment. */
export function localizePath(path: string, locale: Locale): string {
  // Only site-relative paths get a locale segment. Content authors can put an
  // external URL, tel:, mailto:, or #anchor in frontmatter link fields, and
  // prefixing those would corrupt them. Mirrors the guard in withBase().
  if (!path || !path.startsWith('/')) return path;
  const param = localeParam(locale);
  if (!param) return path;
  return path === '/' ? `/${param}/` : `/${param}${path}`;
}

export function localizeUrl(path: string, locale: Locale): string {
  return withBase(localizePath(path, locale));
}

/**
 * Remove any locale prefix from a path, e.g. `/es/services/` -> `/services/`.
 * Used to translate the *current* page's path into another locale, since the
 * current locale isn't necessarily the default one.
 */
export function stripLocaleFromPath(path: string): string {
  for (const locale of locales) {
    const param = localeParam(locale);
    if (!param) continue;
    if (path === `/${param}` || path === `/${param}/`) return '/';
    if (path.startsWith(`/${param}/`)) return path.slice(param.length + 1);
  }
  return path;
}

/** Build a tel: URL from a display phone number (strips formatting). */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, '')}`;
}
