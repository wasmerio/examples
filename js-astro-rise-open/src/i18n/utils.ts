const translationCache: Record<string, { common: Record<string, string>; page: Record<string, string> }> = {};

// Define the languages and their labels
export const LANGUAGES = {
  // direction is used to set the text direction for the language (e.g. rtl for Arabic)
  // en: { label: 'English', direction: 'ltr' },
  // ja: { label: '日本語', direction: 'ltr' },
  // Add more languages here
} as const;

// Extract the list of languages
export const LANG_LIST = Object.keys(LANGUAGES) as [keyof typeof LANGUAGES, ...(keyof typeof LANGUAGES)[]];

// Automatically set the default language to the first item in LANGUAGES,
// or null if LANGUAGES is empty
export const DEFAULT_LANG: keyof typeof LANGUAGES | null = LANG_LIST.length > 0 ? LANG_LIST[0] : null;

// Load translations for a specific language and page

export async function loadPageContents(
  lang: string | null,
  page?: string
): Promise<{ common: Record<string, string>; page: Record<string, string> }> {
  const isI18nEnabled = lang !== null;
  const cacheKey = `${isI18nEnabled ? lang : 'default'}-${page || 'common'}`;

  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    // load common translation data (used in all pages mostly on BaseLayout)
    let commonModule;
    let pageModule: { default: Record<string, string> } = { default: {} };

    if (isI18nEnabled) {
      commonModule = await import(`./${lang}/common.ts`);
      if (page) {
        try {
          pageModule = await import(`./${lang}/${page}.ts`);
        } catch (error) {
          console.warn(`No translation found for ${lang}/${page}.ts, using empty object.`);
        }
      }
    } else {
      const default_path = 'default';
      commonModule = await import(`./${default_path}/common.ts`);
      if (page) {
        try {
          pageModule = await import(`./${default_path}/${page}.ts`);
        } catch (error) {
          console.warn(`No translation found for ${page}.ts, using empty object.`);
        }
      }
    }

    const result = {
      common: commonModule.default || {},
      page: pageModule.default || {},
    };

    // save the result in the cache
    translationCache[cacheKey] = result;
    return result;
  } catch (error) {
    console.error(`Failed to load translations for ${lang ?? 'default'}`, error);
    return { common: {}, page: {} };
  }
}
