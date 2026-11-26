import type { LanguageCode } from "$lib/schema/project";
import type { Translations } from "./types";
import { en } from "./locales/en";
import { it } from "./locales/it";

export type { Translations } from "./types";

const locales: Record<LanguageCode, Translations> = { en, it };

export function getTranslations(lang?: string): Translations {
    return locales[(lang as LanguageCode) ?? "en"] ?? locales.en;
}
