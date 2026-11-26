import { type Locale, localeMeta } from "./config.ts";

export function formatLocalizedDate(
	date: Date,
	locale: Locale,
	options: Intl.DateTimeFormatOptions,
): string {
	return new Intl.DateTimeFormat(localeMeta[locale].dateLocale, options).format(date);
}

/** Reading-time text emitted by the Markdown remark plugin. */
export function formatReadingTime(readingTime: string, locale: Locale): string {
	return locale === "zh" ? readingTime.replace(/([\d.]+)\s*min read/i, "$1 分钟阅读") : readingTime;
}
