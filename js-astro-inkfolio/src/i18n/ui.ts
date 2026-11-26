import { en } from './locales/en';
import { zh } from './locales/zh';
import { zhHant } from './locales/zh-hant';
import { toTrad } from '../lib/trad';

export const ui = { en, zh, zhHant } as const;

export type UiKey = keyof typeof en;

export function t(lang: string, key: UiKey): string {
  const dict =
    lang === 'zh-hant'
      ? (zhHant as Record<string, string>)
      : (ui as Record<string, Record<string, string>>)[lang] ?? ui.en;
  const value = dict[key] ?? (ui.en as Record<string, string>)[key] ?? String(key);
  return lang === 'zh-hant' ? toTrad(String(value)) : String(value);
}
