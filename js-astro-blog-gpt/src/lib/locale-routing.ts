import type { BlogConfig, Locale } from '../types/config';

type LocaleSite = Pick<
  BlogConfig['site'],
  'defaultLocale' | 'locales' | 'localePrefixPolicy'
> & { base: string };

export function localeRoot(site: LocaleSite, lang: Locale): string {
  const prefix =
    site.localePrefixPolicy === 'omit-default-prefix' &&
    lang === site.defaultLocale
      ? ''
      : `${lang}/`;
  return `${site.base.replace(/\/$/, '')}/${prefix}`;
}

export function localeHref(site: LocaleSite, lang: Locale, route = ''): string {
  return `${localeRoot(site, lang)}${route.replace(/^\/+/, '')}`;
}

/** Route patterns use literal language segments, including for static endpoints. */
export function routeLocale(pattern: string, site: LocaleSite): Locale {
  return (
    site.locales.find(
      (locale) => pattern === `/${locale}` || pattern.startsWith(`/${locale}/`),
    ) ?? site.defaultLocale
  );
}

export function hasLocalePrefix(pathname: string, site: LocaleSite): boolean {
  const base = site.base.replace(/\/$/, '');
  if (!pathname.startsWith(`${base}/`)) return false;
  const first = pathname.slice(base.length + 1).split('/')[0];
  return site.locales.includes(first);
}

export function isRealTranslation(
  entry: { data: { lang: string } },
  locale: Locale,
): boolean {
  return entry.data.lang === locale;
}
