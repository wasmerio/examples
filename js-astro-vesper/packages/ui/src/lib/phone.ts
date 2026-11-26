/**
 * Phone helpers for the parts that show a number to call (PhoneLink, EmergencyBanner, CallBar, AreaCheck's "not yet"
 * line). Plain functions with no imports, so they run under node --test.
 */

/** The phone keypad's digit for each letter, A to Z (2 ABC, 3 DEF, 4 GHI, 5 JKL, 6 MNO, 7 PQRS, 8 TUV, 9 WXYZ). */
const KEYPAD = "22233344455566677778889999";

/**
 * Where an extension starts: "ext", "ext.", "extension", "x" or "#" (any case) right before its digits. A letter
 * before "ext" or "x" makes it part of a word ("1-800-FLAX"), not a marker.
 */
const EXTENSION = /(?<![a-z])(?:ext(?:ension)?|x)[.:]?\s*(?=\d)|#\s*(?=\d)/i;

/**
 * The tel: link for a number as you write it: a leading + kept, letters read as their keypad digits, every other
 * character dropped ("(555) 010-0142" -> "tel:5550100142", "+1 555 010 0142" -> "tel:+15550100142", "1-800-FLOWERS"
 * -> "tel:18003569377"). An extension ("ext. 23", "x23", "#23") follows the number after a comma, the pause a phone
 * waits through before it dials the rest ("(614) 555-0147 ext. 23" -> "tel:6145550147,23"). An empty string for a
 * number written with fewer than 3 digits (letters do not count), so the caller shows no link.
 */
export function telHref(number: string | undefined | null): string {
	// An extension marker with no digits after it ("(614) 555-0147 ext.") is dropped, not read as keypad letters.
	const text = String(number ?? "").trim().replace(/(?<![a-z])(?:(?:ext(?:ension)?|x)[.:]?|#)\s*$/i, "").trim();
	const marker = text.match(EXTENSION);
	const main = marker ? text.slice(0, marker.index) : text;
	if (main.replace(/\D/g, "").length < 3) return "";
	const digits = main.toUpperCase().replace(/[A-Z]/g, (c) => KEYPAD[c.charCodeAt(0) - 65]).replace(/\D/g, "");
	const extension = marker ? text.slice(marker.index).replace(/\D/g, "") : "";
	return `tel:${text.startsWith("+") ? "+" : ""}${digits}${extension ? `,${extension}` : ""}`;
}

/**
 * The accessible name of a link to call: "Call (555) 010-0142", or with your words first, "24/7 emergency:
 * (555) 010-0199". The number stays as written, so a screen reader says it the way the page shows it.
 */
export function phoneLabel(number: string, words?: string): string {
	return words ? `${words}: ${number}` : `Call ${number}`;
}

/**
 * A number's width in em, for a size that fits it to its box (EmergencyBanner's --stat-ems): figures and a plus 0.7,
 * a hyphen or dash 0.6, parentheses 0.42, a space or dot 0.3, anything else 0.72. Each is at least as wide as it sets
 * in any kit preset's body face in bold (measured; Clean's hyphen and Ink's figures the widest), so "1-800-555-0119"
 * gets more room than "(614) 555-0119". Rounded up to a tenth, at least one figure's width.
 */
export function phoneEms(number: string): number {
	const em = [...String(number ?? "")].reduce((sum, c) => sum + (/[0-9+]/.test(c) ? 0.7 : /[-‐‑–—]/.test(c) ? 0.6 : /[()]/.test(c) ? 0.42 : /[ .]/.test(c) ? 0.3 : 0.72), 0);
	return Math.ceil(Math.max(em, 0.7) * 10 - 1e-9) / 10;
}
