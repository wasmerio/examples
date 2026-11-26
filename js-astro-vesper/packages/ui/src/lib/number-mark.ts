/**
 * A list's number mark: an item's place shown as a quiet mark before its title (Pro's WorkCard, WorkList and
 * ServicesList; a theme's own index marks may use it too). Two formats:
 * - `paren` (the default): the number in parentheses, "(01)".
 * - `slash`: the number then a slash, "01 /". The slash is part of the mark, so it takes the mark's type and color.
 *
 * Plain Node loads this file (the unit tests), so it imports nothing.
 */

/** How a list writes its number marks: "paren", "(01)" (the default), or "slash", "01 /". */
export type NumberFormat = "paren" | "slash";

/** The mark for place `n` (from 1), padded to `digits` figures: "(01)" or "01 /". */
export function numberMark(n: number, format: NumberFormat = "paren", digits = 2): string {
	const figures = String(n).padStart(digits, "0");
	return format === "slash" ? `${figures} /` : `(${figures})`;
}
