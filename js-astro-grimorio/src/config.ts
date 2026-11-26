import settings from "./site.config.json" with { type: "json" };
import {
  localizePath,
  locales,
  ogLocales,
  translate,
  type Language,
  type TranslationKey,
} from "./i18n";

// Configure identity in site.config.json; edit copy in i18n/*.json.
export function getSiteInfo(lang: Language) {
  return {
    title: settings.site.name,
    titleSuffix: translate(lang, "site.titleSuffix"),
    language: lang,
    locale: ogLocales[lang],
    dateLocale: locales[lang],
    favicon: settings.site.favicon,
    description: translate(lang, "site.description"),
    keywords: settings.site.keywords[lang],
    // SITE comes from astro.config.mjs and is shared by all generated metadata.
    url: import.meta.env.SITE,
  };
}

export function getHeaderConfig(lang: Language) {
  return {
    title: settings.site.logoText,
    navLinks: settings.navigation.map(({ label, url }) => ({
      name: translate(lang, label as TranslationKey),
      url: localizePath(lang, url),
    })),
  };
}

export function getPersonalInfo(lang: Language) {
  return {
    name: settings.author.name[lang],
    englishName: settings.author.handle,
    role: translate(lang, "author.role"),
    github: settings.author.github,
    socialLinks: settings.socialLinks.map(({ name, label, icon, url }) => ({
      name: label ? translate(lang, label as TranslationKey) : name,
      icon,
      url:
        url === "$author.github"
          ? settings.author.github
          : localizePath(lang, url),
    })),
  };
}
