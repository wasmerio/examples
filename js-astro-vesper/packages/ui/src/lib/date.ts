/**
 * Dates for the kit's parts (Posts): a post's date is a strict date-only string, "YYYY-MM-DD", read in UTC, so the
 * day never moves with the reader's or the build machine's time zone. A Date is accepted too, as an instant read in
 * UTC: Astro content collections turn "2026-10-14" into UTC midnight, so the day stays the same. A Date made from
 * local parts (new Date(2026, 9, 14)) is local midnight, which is the day before in UTC east of Greenwich: pass the
 * string instead. A bad value throws at build time with the value in the message, so no page says "Invalid Date".
 */

/** A post's date: "YYYY-MM-DD" (the canonical form), or a Date read in UTC. */
export type DateInput = string | Date;

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** The input as a Date, read in UTC. Throws on anything but a real calendar day or a valid Date. */
export function toUtcDate(input: DateInput): Date {
	if (input instanceof Date) {
		if (Number.isNaN(input.getTime())) throw new Error("date: an invalid Date (its time is NaN); pass a date such as \"2026-10-14\"");
		return input;
	}
	const m = typeof input === "string" ? DATE_ONLY.exec(input) : null;
	if (m) {
		const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
		const date = new Date(0);
		// setUTCFullYear, not Date.UTC: Date.UTC reads the years 0 to 99 as 1900 to 1999.
		date.setUTCFullYear(year, month - 1, day);
		// A day that does not exist (2026-02-30) rolls over into the next month: reject it.
		if (date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day) return date;
	}
	throw new Error(`date: expected a date-only string like "2026-10-14", or a Date; got ${JSON.stringify(input)}`);
}

/**
 * The date as text, in UTC: medium style in English by default ("Oct 14, 2026"; "14.10.2026" in de). The
 * options are Intl.DateTimeFormat's; the time zone is always UTC.
 */
export function formatDate(input: DateInput, locale = "en", options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }): string {
	return new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" }).format(toUtcDate(input));
}

/** The date as `YYYY-MM-DD`, for `<time datetime>`. */
export function isoDate(input: DateInput): string {
	return toUtcDate(input).toISOString().slice(0, 10);
}
