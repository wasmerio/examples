// Language registry. Adding a language means adding one entry here plus a
// content directory; no component markup changes.
import { site } from './config';

export interface LangDef {
  /** Short code used in URLs after the first one ('' means root). */
  key: string;
  /** URL prefix, always with trailing slash. Root language uses '/'. */
  prefix: string;
  /** BCP-47 tag for hreflang. Simplified Chinese must not claim plain 'zh'. */
  hreflang: string;
  /** Name as a reader of that language expects to see it. */
  label: string;
  /** English name, for the switcher on other languages. */
  labelEn: string;
  /** Content suffix: posts/ vs posts-zh/ vs posts-fr/. */
  contentSuffix: string;
  /** false until the UI dictionary and content exist. */
  available: boolean;
}

export const LANGS: LangDef[] = [
  { key: 'en', prefix: '/', hreflang: 'en', label: 'English', labelEn: 'English', contentSuffix: '', available: true },
  { key: 'zh', prefix: '/zh/', hreflang: 'zh-Hans', label: '简体中文', labelEn: 'Simplified Chinese', contentSuffix: '-zh', available: true },
  { key: 'zh-hant', prefix: '/zh-Hant/', hreflang: 'zh-Hant', label: '繁體中文', labelEn: 'Traditional Chinese', contentSuffix: '-zh-hant', available: true },
  { key: 'fr', prefix: '/fr/', hreflang: 'fr', label: 'Français', labelEn: 'French', contentSuffix: '-fr', available: false },
];

const cfg = ((site as any).i18n ?? {}) as { enabled?: boolean; languages?: string[] };
const enabledList = Array.isArray(cfg.languages) && cfg.languages.length ? cfg.languages : null;

/** Languages that are both implemented and switched on in site.config.yaml. */
export const availableLangs = () =>
  LANGS.filter((l) => l.available && (enabledList ? enabledList.includes(l.key) : true));

/** Whether the site publishes more than one language at all. */
export const multilang = () => cfg.enabled !== false && availableLangs().length > 1;

/** Language a reader with no preference lands on. */
export const defaultLang = (): string => (cfg as any).defaultLanguage ?? 'en';
export const langByKey = (key: string) => LANGS.find((l) => l.key === key);
