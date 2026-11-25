/**
 * Internationalization (i18n) configuration.
 *
 * Off by default — when `enabled: false` or `locales` has a single entry,
 * Astro Rocket emits the same single-locale routes it always has and the
 * `LanguageSwitcher`/`hreflang` machinery is skipped, so there is no
 * runtime or bundle-size cost.
 *
 * Turn on by setting `enabled: true` and listing at least two `locales`.
 * The default locale stays at the site root (`/about`); additional
 * locales live under a prefix (`/nl/about`).
 *
 * Lives in its own file (not `site.config.ts`) so the i18n module can
 * be imported by unit tests without pulling in `astro:env/server`.
 */

export interface I18nConfig {
  /** Master switch — must be true AND `locales.length > 1` to take effect */
  enabled: boolean;
  /** BCP 47 code for the default locale, served at the site root */
  defaultLocale: string;
  /** All locales the site ships, including the default. Use BCP 47 codes (e.g. 'en', 'nl', 'de', 'fr-BE') */
  locales: string[];
  /** Display names for the LanguageSwitcher, keyed by locale code */
  localeNames?: Record<string, string>;
  /**
   * When true, Astro reads the visitor's `Accept-Language` header on
   * the root URL and redirects to a matching locale. Visitors can
   * always override via the LanguageSwitcher.
   */
  detectBrowserLocale?: boolean;
}

const i18nConfig: I18nConfig = {
  enabled: false,
  defaultLocale: 'en',
  locales: ['en'],
  localeNames: {
    en: 'English',
    nl: 'Nederlands',
    de: 'Deutsch',
    fr: 'Français',
    es: 'Español',
  },
  detectBrowserLocale: false,
};

export default i18nConfig;
