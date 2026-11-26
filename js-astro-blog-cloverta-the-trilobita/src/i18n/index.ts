import zh from './zh';
import en from './en';
export const languages = ['zh', 'en'] as const;
export type Lang = (typeof languages)[number];
export const getTranslations = (lang: Lang) => lang === 'en' ? en : zh;
export const getLangFromUrl = (url: URL): Lang => url.pathname.split('/')[1] === 'en' ? 'en' : 'zh';
export const languagePaths = () => languages.map(lang => ({ params: { lang } }));
