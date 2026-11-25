import en from './en.ts';
import zh from './zh.ts';
import type { LanguagePack } from '../lib/translations.ts';

/** UI translations only. blog.config.ts independently selects the site's content languages. */
const languages: Record<string, LanguagePack> = {
  zh: { label: '简体中文', messages: zh },
  en: { label: 'English', messages: en },
};

export default languages;
