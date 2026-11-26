export const LANGUAGE_STORAGE_KEY = 'site-language';
export const DEFAULT_LANGUAGE = 'en';

export function localize(value, language = DEFAULT_LANGUAGE) {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';
  return value[language] ?? value.en ?? value.zh ?? '';
}

export function activeLanguage(root = globalThis.document?.documentElement) {
  const value = root?.dataset?.language;
  return value === 'zh' || value === 'en' ? value : DEFAULT_LANGUAGE;
}

export function createLanguageController(document, storage = globalThis.localStorage) {
  const root = document.documentElement;
  let language = DEFAULT_LANGUAGE;

  const setLanguage = (nextLanguage, { persist = true } = {}) => {
    language = nextLanguage === 'en' ? 'en' : 'zh';
    root.dataset.language = language;
    root.lang = language === 'en' ? 'en' : 'zh-CN';
    if (root.dataset.pageTitleZh) document.title = root.dataset.pageTitleEn && language === 'en' ? root.dataset.pageTitleEn : root.dataset.pageTitleZh;
    const description = document.querySelector('meta[name="description"]');
    if (description?.dataset.localeZh) description.content = language === 'en' ? description.dataset.localeEn ?? description.dataset.localeZh : description.dataset.localeZh;

    for (const copy of document.querySelectorAll('[data-locale-copy]')) {
      copy.hidden = copy.dataset.localeCopy !== language;
    }
    for (const element of document.querySelectorAll('[data-language-choice]')) {
      element.setAttribute('aria-pressed', String(element.dataset.languageChoice === language));
    }
    const localizedAttributes = [
      ['alt', 'localeAlt'],
      ['aria-label', 'localeAriaLabel'],
      ['placeholder', 'localePlaceholder'],
      ['title', 'localeTitle'],
    ];
    for (const element of document.querySelectorAll('[data-locale-alt-zh], [data-locale-aria-label-zh], [data-locale-placeholder-zh], [data-locale-title-zh]')) {
      for (const [attribute, prefix] of localizedAttributes) {
        const suffix = language === 'en' ? 'En' : 'Zh';
        const value = element.dataset[`${prefix}${suffix}`];
        if (value !== undefined) element.setAttribute(attribute, value);
      }
    }
    for (const option of document.querySelectorAll('[data-locale-option-zh]')) {
      option.textContent = language === 'en' ? option.dataset.localeOptionEn ?? option.dataset.localeOptionZh : option.dataset.localeOptionZh;
    }

    if (persist) storage?.setItem(LANGUAGE_STORAGE_KEY, language);
    document.dispatchEvent(new document.defaultView.CustomEvent('site:language-change', { detail: { language } }));
    return language;
  };

  for (const choice of document.querySelectorAll('[data-language-choice]')) {
    choice.addEventListener('click', () => setLanguage(choice.dataset.languageChoice));
  }

  const savedLanguage = storage?.getItem(LANGUAGE_STORAGE_KEY);
  setLanguage(savedLanguage === 'zh' ? 'zh' : DEFAULT_LANGUAGE, { persist: false });

  return { getLanguage: () => language, setLanguage };
}
