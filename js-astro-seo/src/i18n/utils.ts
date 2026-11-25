/**
 * i18n utility functions for Astro SEO Theme.
 *
 * Usage in .astro components:
 *   import { getLangFromUrl, useTranslations, getLocalizedPath } from '../i18n/utils';
 *   const lang = getLangFromUrl(Astro.url);
 *   const t = useTranslations(lang);
 *   const localPath = getLocalizedPath(lang, '/about');
 */

import { ui, defaultLang, type Lang } from './ui';

/**
 * Extract the current language from the URL pathname.
 * Returns 'es' for /es/..., otherwise returns 'en'.
 */
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

/**
 * Returns a translation function for the given language.
 * Falls back to defaultLang if a key is missing.
 */
export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return (ui[lang] as Record<string, string>)?.[key] ?? ui[defaultLang][key];
  };
}

/**
 * Generate a localized path.
 * - For 'en' (default): returns path as-is (e.g. '/about')
 * - For 'es': prepends /es (e.g. '/es/about')
 */
export function getLocalizedPath(lang: Lang, path: string): string {
  if (lang === defaultLang) return path;
  return `/${lang}${path}`;
}

/**
 * Get the alternate language path for hreflang tags.
 * If current lang is 'en', returns the /es/ version and vice versa.
 */
export function getAlternateLocales(currentPath: string): { lang: Lang; href: string }[] {
  // Strip any existing locale prefix
  const cleanPath = currentPath.replace(/^\/(es)\//, '/').replace(/^\/(es)$/, '/');

  return [
    { lang: 'en', href: cleanPath },
    { lang: 'es', href: `/es${cleanPath === '/' ? '' : cleanPath}` },
  ];
}
