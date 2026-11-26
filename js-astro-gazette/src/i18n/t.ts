// UI strings for the language of the page. Components call `const t = useT(Astro.currentLocale)`.
import { site } from '../config';
import en from './en';

const dicts: Record<string, typeof en> = { en };

export const useT = (locale: string = site.locale) => dicts[locale] ?? dicts[site.locale] ?? en;

/** fmt(t.issueNumber, { n: '04' }) → 'Issue 04'. Missing keys are left as they are. */
export const fmt = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
