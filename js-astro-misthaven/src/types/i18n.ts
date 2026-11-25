import type { I18nKey } from "@/i18n/i18nKey";

export type Locale = "en-US" | "zh-CN";
export type Translation = Readonly<Record<I18nKey, string>>;
export type TranslationParams = Readonly<Record<string, string | number>>;
export type Translator = (key: I18nKey, params?: TranslationParams) => string;
