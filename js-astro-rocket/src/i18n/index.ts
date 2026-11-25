import en from './en.json';
import i18nConfig from '../config/i18n.config';

export { i18nConfig };
export type { I18nConfig } from '../config/i18n.config';

export type Locale = string;

// `en.json` is the canonical dictionary every other locale mirrors, so it
// doubles as the type anchor for all dictionaries.
export type Dictionary = typeof en;

// Auto-load every locale dictionary in this folder. Adding a new language is
// just dropping a `src/i18n/<code>.json` file — no import or registration
// needed here. (The locale must still be listed in `i18n.config.ts` to be
// served.) The key is derived from the filename: `./nl.json` → `nl`.
const modules = import.meta.glob<{ default: Dictionary }>('./*.json', { eager: true });

const dictionaries: Record<string, Dictionary> = Object.fromEntries(
  Object.entries(modules).map(([filePath, mod]) => {
    const locale = filePath.slice(filePath.lastIndexOf('/') + 1).replace(/\.json$/, '');
    return [locale, mod.default];
  }),
);

export const defaultLocale: Locale = i18nConfig.defaultLocale;

export function isEnabled(): boolean {
  return i18nConfig.enabled === true && i18nConfig.locales.length > 1;
}

export function getLocales(): Locale[] {
  return i18nConfig.locales;
}

/**
 * The non-default locales that should get their own prefixed routes
 * (`/<locale>/about`, `/<locale>` …). Empty when i18n is off or only one
 * locale is configured, so locale-prefixed `getStaticPaths` emit nothing and
 * single-locale builds stay byte-for-byte unchanged. Mirrors the per-section
 * helpers in `lib/blog` and `lib/projects` so every content type derives its
 * extra locales the same way.
 */
export function getSecondaryLocales(): Locale[] {
  if (!isEnabled()) return [];
  return getLocales().filter((locale) => locale !== defaultLocale);
}

export function getLocaleName(locale: Locale): string {
  return i18nConfig.localeNames?.[locale] ?? locale;
}

export function isValidLocale(locale: string | undefined): locale is Locale {
  if (!locale) return false;
  return i18nConfig.locales.includes(locale);
}

export function resolveLocale(locale: string | undefined): Locale {
  return isValidLocale(locale) ? locale : defaultLocale;
}

function getNestedValue(dict: Dictionary, key: string): unknown {
  const parts = key.split('.');
  let value: unknown = dict;
  for (const part of parts) {
    if (value && typeof value === 'object' && part in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return value;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) => {
    const value = vars[name];
    return value !== undefined ? String(value) : match;
  });
}

/**
 * Look up a translation by dotted key. Falls back to the default locale's
 * value, then to the key itself, so missing translations are visible but
 * non-fatal. Supports `{name}` placeholders via `vars`.
 */
export function t(key: string, locale: Locale = defaultLocale, vars?: Record<string, string | number>): string {
  const dict = dictionaries[locale] ?? dictionaries[defaultLocale];
  const fallback = dictionaries[defaultLocale];
  const value = asString(getNestedValue(dict, key)) ?? asString(getNestedValue(fallback, key)) ?? key;
  return interpolate(value, vars);
}

/**
 * Look up a structured (array or object) translation value by dotted key, with
 * the same default-locale fallback as `t()`. Use this for localized lists and
 * page sections — an array of FAQ items, a list of feature cards — that `t()`,
 * which only returns strings, can't express. Returns the default-locale value
 * when the active locale hasn't translated the key, and `undefined` only when
 * neither locale defines it (so a missing translation degrades to the default
 * language instead of breaking the page).
 */
export function tData<T = unknown>(key: string, locale: Locale = defaultLocale): T | undefined {
  const dict = dictionaries[locale] ?? dictionaries[defaultLocale];
  const fallback = dictionaries[defaultLocale];
  const value = getNestedValue(dict, key) ?? getNestedValue(fallback, key);
  return value as T | undefined;
}

/**
 * Build a locale-prefixed URL. The default locale stays at the root
 * (no prefix) when `prefixDefaultLocale` is false, matching Astro's
 * native i18n routing behavior.
 */
export function localizedPath(path: string, locale: Locale = defaultLocale): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (!isEnabled()) return normalized;
  if (locale === defaultLocale) return normalized;
  return `/${locale}${normalized === '/' ? '' : normalized}`;
}

/**
 * Strip a leading `/<locale>` segment from a path if present. Returns
 * the path unchanged when the first segment is not a configured
 * locale. Always returns a path starting with `/`.
 *
 * `/nl/about` → `/about`, `/en` → `/`, `/about` → `/about`.
 */
export function stripLocaleFromPath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const match = normalized.match(/^\/([^/]+)(\/.*)?$/);
  if (!match) return normalized;
  const [, first, rest] = match;
  if (i18nConfig.locales.includes(first)) {
    return rest && rest.length > 0 ? rest : '/';
  }
  return normalized;
}

/**
 * Replace the locale segment of a path with a different locale.
 * Used by the LanguageSwitcher to build "same page, other language"
 * links. When the target is the default locale, no prefix is added.
 */
export function swapLocaleInPath(path: string, targetLocale: Locale): string {
  const base = stripLocaleFromPath(path);
  return localizedPath(base, targetLocale);
}

/**
 * Detect the active locale from a path's first segment. Returns the
 * default locale if no recognized locale prefix is present.
 */
export function getLocaleFromPath(path: string): Locale {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const first = normalized.split('/').filter(Boolean)[0];
  return first && i18nConfig.locales.includes(first) ? first : defaultLocale;
}
