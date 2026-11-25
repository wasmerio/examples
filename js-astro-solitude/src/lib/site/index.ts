import config from '../../../site.config.ts';
import zh from '@/i18n/zh-CN.json';
import tw from '@/i18n/zh-TW.json';
import en from '@/i18n/en.json';
import es from '@/i18n/es.json';
export { config };
export const cfg = config.theme;
export const t = (key: string) =>
  (
    ({ 'zh-CN': zh, 'zh-TW': tw, en, es })[config.locale] as Record<
      string,
      string
    >
  )[key] ??
  (en as Record<string, string>)[key] ??
  key;
export const url = (path = '/') =>
  /^(?:[a-z]+:|\/\/|#)/i.test(path)
    ? path
    : `${config.base}${path.replace(/^\//, '')}`;
export const absolute = (path: string) => new URL(url(path), config.site).href;
export const dateLabel = (date: Date | string) =>
  new Intl.DateTimeFormat(config.locale, {
    timeZone: config.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date));
export const isoDate = (date?: Date | string) =>
  date ? new Date(date).toISOString() : '';
export const json = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c');
export const termPath = (taxonomy: string, name: string) =>
  `/${taxonomy}/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}/`;
