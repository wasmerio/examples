import settings from "../site.config.json" with { type: "json" };
import es from "./es.json" with { type: "json" };
import en from "./en.json" with { type: "json" };

export const languages = ["en", "es"] as const;
export type Language = (typeof languages)[number];
export type TranslationKey = keyof typeof es;
type Dictionary = Record<TranslationKey, string>;
export const dictionaries = { es, en } satisfies Record<Language, Dictionary>;

// The default language is served at the root; others live under /<lang>/.
export const defaultLanguage: Language = "en";
export const locales = { es: "es-ES", en: "en-US" } as const;
export const ogLocales = { es: "es_ES", en: "en_US" } as const;

export const isLanguage = (value: unknown): value is Language =>
  languages.some((language) => language === value);

export function getLanguage(value?: string): Language {
  return isLanguage(value) ? value : defaultLanguage;
}
export function getLanguageFromPath(pathname: string): Language {
  return getLanguage(pathname.split("/")[1]);
}
// "/en/posts/" -> "/posts/"
export function stripLanguage(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  return isLanguage(first) && first !== defaultLanguage
    ? `/${rest.join("/")}`
    : pathname;
}
// "/posts/" -> "/en/posts/" for English, unchanged for the default language.
export function localizePath(lang: Language, path: string): string {
  if (!path.startsWith("/") || lang === defaultLanguage) return path;
  return `/${lang}${path}`;
}

export function translate(
  lang: Language,
  key: TranslationKey,
  values: Record<string, string | number> = {},
): string {
  const dictionary: Dictionary = dictionaries[lang];
  const overrides = settings.text[lang] as Partial<Dictionary>;
  const singularKey = `${key}.one` as TranslationKey;
  const selectedKey =
    typeof values.count === "number" &&
    new Intl.PluralRules(locales[lang]).select(values.count) === "one" &&
    singularKey in dictionary
      ? singularKey
      : key;
  const text = overrides[selectedKey] ?? dictionary[selectedKey];
  if (typeof text !== "string")
    throw new Error(`Unknown translation key: ${selectedKey}`);
  const parameters = {
    site: settings.site.name,
    name: settings.author.name[lang],
    ...values,
  };
  return text.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    name in parameters
      ? String(parameters[name as keyof typeof parameters])
      : placeholder,
  );
}
export const useTranslations =
  (lang: Language) =>
  (key: TranslationKey, values?: Record<string, string | number>) =>
    translate(lang, key, values);

export function formatDate(
  lang: Language,
  value: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
): string {
  return new Intl.DateTimeFormat(locales[lang], {
    timeZone: "UTC",
    ...options,
  }).format(new Date(value));
}

// Static paths for routes under src/pages/[...lang]/.
export const languagePaths = () =>
  languages.map((lang) => ({
    params: { lang: lang === defaultLanguage ? undefined : lang },
  }));
