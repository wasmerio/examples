import type { Locale } from '../config/i18n';
import { defaultLang, ui, type UiKey } from './ui';

export function useTranslations(locale: Locale) {
  return function t(key: UiKey) {
    return ui[locale][key] || ui[defaultLang][key] || key;
  };
}
