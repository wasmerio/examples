// UI strings, one module per language. Components ask for the strings of the page they are
// on -- `const ui = t(Astro.currentLocale)` -- so the same component prints correctly however
// the site is set.
//
// To add a language: write src/i18n/<code>.ts against the Strings type, import it here, and
// add it to `strings`. Set site.locale in config.ts to the one the site is written in.
import { site } from '../config';
import en from './en';
import ko from './ko';

export type Strings = typeof en;

const strings: Record<string, Strings> = { en, ko };

/** The chrome for a page. Anything unknown falls back to the language the site is set in. */
export const t = (locale: string | undefined = site.locale): Strings =>
  strings[locale ?? ''] ?? strings[site.locale] ?? en;
