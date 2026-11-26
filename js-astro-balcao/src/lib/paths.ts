import { site, type Locale } from '../site.config';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix a site-relative path with the configured base (works on GitHub Pages sub-paths). */
export function withBase(path = '/'): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}` || '/';
}

/** Home URL for a locale: "/" for the default language, "/pt-br/" for the others. */
export function localeHome(locale: Locale): string {
  return withBase(locale === site.defaultLocale ? '/' : `/${locale}/`);
}

/** BCP 47 tag for <html lang> and hreflang. */
export function langTag(locale: Locale): string {
  return locale === 'pt-br' ? 'pt-BR' : 'en';
}

export function waLink(text: string): string {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`;
}
