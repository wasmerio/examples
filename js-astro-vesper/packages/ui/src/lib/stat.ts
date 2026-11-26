// The stats family's size rule (Stats.astro, theme.css --text-stat): every value in one list takes the size at which
// the list's widest value fills its item, so a list of short values ("+38%", "14") gets large numbers and a list with
// "12,500,000+" keeps it on one line.

/**
 * A character's width in em, at least as wide as it sets in any kit preset's display face (measured with figures of
 * one width, Agency's 118% stretch the widest): figures and signs 0.72, a percent sign 1.06, narrow marks 0.34.
 */
function charEm(c: string): number {
	if (/[0-9+\-−–$€£¥#]/.test(c)) return 0.72;
	if (c === "%") return 1.06;
	if (/[.,:;/'’]/.test(c)) return 0.34;
	if (c === " ") return 0.3;
	if (/[MWmw@]/.test(c)) return 1;
	if (/[A-Z]/.test(c)) return 0.8;
	if (/[a-z]/.test(c)) return 0.68;
	return 0.8;
}

/** A value's width in em, from its characters (charEm), rounded up to a hundredth. At least one figure's width. */
export function statEms(value: string): number {
	const em = [...value].reduce((sum, c) => sum + charEm(c), 0);
	return Math.ceil(Math.max(em, 0.72) * 100) / 100;
}

/** The widest value in a list, in em (statEms); the value the list's --stat-ems carries. */
export function widestStatEms(values: string[]): number {
	return values.reduce((widest, v) => Math.max(widest, statEms(v)), 0.72);
}
