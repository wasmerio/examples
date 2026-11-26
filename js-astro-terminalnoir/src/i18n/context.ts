import { route } from '../lib/urls';
import { toLocale, type Locale } from './locales';
import { useTranslations, type Translate } from './ui';

export interface I18n {
  locale: Locale;
  t: Translate;
  path: (path: string) => string;
}

// Per-page i18n context, from the locale Astro resolved for the current URL.
export function getI18n(currentLocale: string | undefined): I18n {
  const locale = toLocale(currentLocale);
  return { locale, t: useTranslations(locale), path: p => route(p, locale, import.meta.env.BASE_URL) };
}
