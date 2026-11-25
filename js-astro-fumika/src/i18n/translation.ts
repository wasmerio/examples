import { siteConfig } from "../config";
import { DEFAULT_LANG } from "../constants/constants";
import type I18nKey from "./i18nKey";
import { en } from "./languages/en";
import { es } from "./languages/es";
import { fa } from "./languages/fa";
import { fr } from "./languages/fr";
import { id } from "./languages/id";
import { ja } from "./languages/ja";
import { ko } from "./languages/ko";
import { th } from "./languages/th";
import { tr } from "./languages/tr";
import { vi } from "./languages/vi";
import { zh_CN } from "./languages/zh_CN";
import { zh_TW } from "./languages/zh_TW";

export type Translation = {
	[K in I18nKey]: string;
};

const defaultTranslation = en;

const map: { [key: string]: Translation } = {
	es: es,
	en: en,
	en_us: en,
	en_gb: en,
	en_au: en,
	zh_cn: zh_CN,
	zh_tw: zh_TW,
	ja: ja,
	ja_jp: ja,
	ko: ko,
	ko_kr: ko,
	th: th,
	th_th: th,
	vi: vi,
	vi_vn: vi,
	id: id,
	tr: tr,
	tr_tr: tr,
	fr: fr,
	fr_fr: fr,
	fa: fa,
	fa_ir: fa,
};

export function normalizeLang(lang: string): string {
	return lang.toLowerCase().replace("-", "_");
}

export function getTranslation(lang: string): Translation {
	return map[normalizeLang(lang)] || defaultTranslation;
}

export function i18n(key: I18nKey, lang?: string): string {
	const activeLang = lang || siteConfig.lang || DEFAULT_LANG;
	return getTranslation(activeLang)[key];
}
