// Relative import on purpose: astro.config.mjs also imports this module
// (footnote labels), and the config loader does not resolve the `@/` alias.
import SITE from "../config";
import en from "./en";
import zhTW from "./zh-TW";

const dicts = { en, "zh-TW": zhTW } as const;
export const t = dicts[SITE.locale];
export const LOCALE = SITE.locale; // BCP-47, used for toLocaleDateString + <html lang>
/** "{n} posts" -> fill({...}) */
export const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
