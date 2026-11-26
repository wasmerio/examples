import { defaultLocale, type Locale } from "@/i18n/config";
import { formatLocalizedDate, formatReadingTime } from "@/i18n/format";
import { siteConfig } from "@/site-config";

const dateFormat = new Intl.DateTimeFormat(siteConfig.date.locale, siteConfig.date.options);

export function getFormattedDate(
	date: string | number | Date,
	options?: Intl.DateTimeFormatOptions,
): string {
	if (typeof options !== "undefined") {
		return new Date(date).toLocaleDateString(siteConfig.date.locale, {
			...(siteConfig.date.options as Intl.DateTimeFormatOptions),
			...options,
		});
	}

	return dateFormat.format(new Date(date));
}

/** Short rail date: `5 Mar 2026`. */
export function formatRailDate(date: Date, locale: Locale = defaultLocale): string {
	return formatLocalizedDate(date, locale, { day: "numeric", month: "short", year: "numeric" });
}

/** Featured-card stamp: `March 2026`. */
export function formatStampDate(date: Date, locale: Locale = defaultLocale): string {
	return formatLocalizedDate(date, locale, { month: "long", year: "numeric" });
}

/** Article byline date: `5 March 2026`. */
export function formatBylineDate(date: Date, locale: Locale = defaultLocale): string {
	return formatLocalizedDate(date, locale, { day: "numeric", month: "long", year: "numeric" });
}

/** Article eyebrow date: `March 2026`. */
export function formatEyebrowDate(date: Date, locale: Locale = defaultLocale): string {
	return formatLocalizedDate(date, locale, { month: "long", year: "numeric" });
}

export { formatReadingTime };
