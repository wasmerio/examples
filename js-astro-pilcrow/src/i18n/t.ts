// UI strings for the page language. Components call `const t = useT(Astro.currentLocale)`.
// Without Astro i18n routing currentLocale is undefined, so site.locale is used.
// Every src/i18n/<locale>.ts is picked up here; adding a language needs no change to this file.
import { site } from '../config';
import type en from './en';

const dicts = Object.fromEntries(
  Object.entries(
    import.meta.glob<typeof en>(['./*.ts', '!./t.ts'], { eager: true, import: 'default' }),
  ).map(([path, dict]) => [path.slice(2, -3), dict]),
);

export const useT = (locale: string = site.locale) => dicts[locale] ?? dicts[site.locale];
