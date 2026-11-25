import config from './config';
import { interfaceMessages, localeInfo } from './translations';
import type { Locale, Localized } from '../types/config';
import { resolveLocalized } from './localized';
import { localeHref, routeLocale } from './locale-routing';

export function localize(value: Localized, lang: Locale): string {
  return resolveLocalized(
    value,
    lang,
    config.site.defaultLocale,
    config.site.locales,
  );
}
export const t = (lang: Locale) => ({
  ...interfaceMessages(lang, config.site.defaultLocale),
  searchHelp: localize(config.text.searchHeading, lang),
});
export function withBase(path = ''): string {
  return `${config.site.base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
export function href(lang: Locale, route = ''): string {
  return localeHref(config.site, lang, route);
}
export const pageLocale = (pattern: string) =>
  routeLocale(pattern, config.site);
export const routeLocales = (pattern: string) => [pageLocale(pattern)];
export function dateLabel(date: Date, lang: Locale): string {
  return new Intl.DateTimeFormat(localeInfo(lang).lang, {
    ...config.posts.dateFormat,
    timeZone: config.site.timezone,
  }).format(date);
}
