/**
 * Languages the theme knows how to render.
 *
 * To add a language (for example Spanish):
 * 1. add `'es'` to SUPPORTED_LOCALES and an entry in LOCALE_META below,
 * 2. create `src/i18n/ui/es.ts` (copy `en.ts` and translate it) and register it in `src/i18n/ui/index.ts`,
 * 3. add `es: '...'` next to every translated text in `villa.config.ts`,
 * 4. add `'es'` to `languages.active` in `villa.config.ts`.
 */
export const SUPPORTED_LOCALES = ['fr', 'en', 'it', 'de'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export interface LocaleMeta {
  /** Name of the language in that language, shown in the language switcher. */
  nativeName: string;
  /** Short label shown in the header (FR, EN...). */
  short: string;
  /** BCP 47 tag used for <html lang>, hreflang, Intl formatting and Open Graph. */
  bcp47: string;
  /** Open Graph locale (language_TERRITORY). */
  ogLocale: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  fr: { nativeName: 'Français', short: 'FR', bcp47: 'fr-FR', ogLocale: 'fr_FR' },
  en: { nativeName: 'English', short: 'EN', bcp47: 'en-GB', ogLocale: 'en_GB' },
  it: { nativeName: 'Italiano', short: 'IT', bcp47: 'it-IT', ogLocale: 'it_IT' },
  de: { nativeName: 'Deutsch', short: 'DE', bcp47: 'de-DE', ogLocale: 'de_DE' },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/** Language of a URL from its first segment (/en/...), or the default language. */
export function localeFromPath(pathname: string, active: readonly Locale[], fallback: Locale): Locale {
  const first = pathname.split('/')[1] ?? '';
  return active.find((l) => l === first) ?? fallback;
}
