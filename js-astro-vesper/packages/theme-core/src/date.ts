/** Dates render in UTC so a build-time (static) and a per-request (server) page agree. */
export function formatDate(date: Date) {
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC",
	});
}

const valid = (d: Date | undefined): d is Date => !!d && !Number.isNaN(d.getTime());
const day = (d: Date) => d.toISOString().slice(0, 10);

/** The later of two dates, ignoring a missing or invalid one: a post's last change (sitemap lastmod, dateModified). */
export function latestDate(a?: Date, b?: Date): Date | undefined {
	if (!valid(a)) return valid(b) ? b : undefined;
	if (!valid(b)) return a;
	return b.getTime() > a.getTime() ? b : a;
}

/** The update date to show ("Updated …"): only when it is on a later UTC day than the publish date. */
export function updatedAfter(date?: Date, updated?: Date): Date | undefined {
	return valid(date) && valid(updated) && day(updated) > day(date) ? updated : undefined;
}
