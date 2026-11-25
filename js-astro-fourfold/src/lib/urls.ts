import { site, type Locale } from '../data/site';

export function sitePath(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}` || '/';
}

export function assetPath(src: string) {
  return /^https?:\/\//.test(src) ? src : sitePath(src);
}

export function absoluteUrl(path: string, base = site.url) {
  return new URL(sitePath(path), base).toString();
}

export function localePath(path: string, locale: Locale = site.locale) {
  return locale === site.locale ? path : `/en${path}`;
}
