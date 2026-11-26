import en from './en.json';

export type Locale = 'pl' | 'en';
export const english = en;

export function getLocale(pathname: string): Locale {
  const basePath = import.meta.env.BASE_URL;
  const sitePath = pathname.startsWith(basePath) ? `/${pathname.slice(basePath.length)}` : pathname;
  return sitePath === '/pl' || sitePath.startsWith('/pl/') ? 'pl' : 'en';
}

export function getLocalePath(pathname: string, locale: Locale): string {
  const basePath = import.meta.env.BASE_URL;
  const sitePath = pathname.startsWith(basePath) ? `/${pathname.slice(basePath.length)}` : pathname;
  const pathWithoutLocale = sitePath.replace(/^\/(?:en|pl)(?=\/|$)/, '') || '/';
  const localePath = locale === 'pl'
    ? `/pl${pathWithoutLocale === '/' ? '/' : pathWithoutLocale}`
    : pathWithoutLocale;
  return localePath;
}
