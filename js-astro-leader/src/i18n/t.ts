// UI strings in the language of the page. Components call `const t = useT(Astro.currentLocale)`;
// with locale routing off currentLocale is undefined, so site.locale is used. A language
// without a dictionary here prints English: add src/i18n/<code>.ts and list it below.
import { site } from '../config';
import en from './en';
import ko from './ko';

/** A count that reads differently at one: Intl.PluralRules picks the form. */
export type Plural = { one?: string; other: string };

const dicts: Record<string, typeof en> = { en, ko };

export const useT = (locale: string = site.locale) => dicts[locale] ?? dicts[site.locale] ?? en;

/** fmt(t.notesOn, { title: 'Cusp' }) → 'Notes on Cusp'. A missing key is left as it is. */
export const fmt = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));

const rules = new Map<string, Intl.PluralRules>();
/** count(t.products, 3, locale) → '3 products'. Other variables ride along in `vars`. */
export const count = (
  forms: Plural,
  n: number,
  locale: string = site.locale,
  vars: Record<string, string | number> = {},
) => {
  const rule = rules.get(locale) ?? rules.set(locale, new Intl.PluralRules(locale)).get(locale)!;
  return fmt((rule.select(n) === 'one' && forms.one) || forms.other, { ...vars, n });
};
