import interfaceLanguages from '../i18n/i18n.config.ts';
import en from '../i18n/en.ts';
import { canonicalLocale, localeChain } from './locale.ts';

export type Messages = { [K in keyof typeof en]: string };
export type LanguagePack = {
  label: string;
  dir?: 'ltr' | 'rtl';
  messages: Partial<Messages>;
};

function pack(locale: string): LanguagePack | undefined {
  const key = Object.keys(interfaceLanguages).find(
    (key) => canonicalLocale(key) === canonicalLocale(locale),
  );
  return key ? interfaceLanguages[key] : undefined;
}

/** Partial packs inherit default-locale messages, then the complete English baseline. */
export function interfaceMessages(
  locale: string,
  defaultLocale = 'en',
): Messages {
  const result: Messages = { ...en };
  for (const code of [
    ...localeChain(defaultLocale).reverse(),
    ...localeChain(locale).reverse(),
  ])
    Object.assign(result, pack(code)?.messages);
  return result;
}

export function localeInfo(locale: string) {
  const lang = canonicalLocale(locale);
  const definition = pack(lang);
  const inherited = localeChain(lang).map(pack).find(Boolean);
  const base = new Intl.Locale(lang);
  const direction = base as Intl.Locale & {
    getTextInfo?: () => { direction: 'ltr' | 'rtl' };
    textInfo?: { direction: 'ltr' | 'rtl' };
  };
  const dir =
    inherited?.dir ??
    direction.getTextInfo?.().direction ??
    direction.textInfo?.direction ??
    'ltr';
  return {
    lang,
    dir,
    label:
      definition?.label ??
      new Intl.DisplayNames([lang], { type: 'language' }).of(base.baseName) ??
      lang,
  };
}

/** Known locale spellings; file identity also recognizes unregistered BCP 47 suffixes. */
export function contentLocales(enabled: readonly string[]): string[] {
  return [
    ...new Set(
      [...Object.keys(interfaceLanguages), ...enabled].map(canonicalLocale),
    ),
  ];
}

export function formatMessage(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    String(values[key] ?? match),
  );
}
