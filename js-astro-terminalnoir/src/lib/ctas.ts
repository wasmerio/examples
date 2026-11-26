import { site } from '../config/site';
import type { Locale } from '../i18n/locales';
import { route } from './urls';

export function getCtas(locale: Locale, base: string) {
  const ctas = site.ctas[locale];
  const resolve = (action: { label: string; href: string }) => ({
    ...action,
    href:
      action.href === 'repository'
        ? site.repository
        : action.href.startsWith('/')
          ? route(action.href, locale, base)
          : action.href,
  });
  return {
    header: resolve(ctas.header),
    hero: { primary: resolve(ctas.hero.primary), secondary: resolve(ctas.hero.secondary) },
    box: { ...ctas.box, primary: resolve(ctas.box.primary), secondary: resolve(ctas.box.secondary) },
  };
}
