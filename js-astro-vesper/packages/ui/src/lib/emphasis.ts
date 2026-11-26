// Heading emphasis (Emphasis.astro, and the emphasis prop on Hero, SectionHead and TestimonialQuote): a buyer marks
// one phrase with asterisks, "Built for *the long run*", and the heading shows it as an <em>. The rule is narrow on
// purpose, so a heading that happens to hold an asterisk ("Rated 5* by clients") shows as typed: exactly two
// asterisks, with text between them that neither starts nor ends with a space. There is no escape. The helpers
// return text, never HTML: the part prints each piece in an Astro expression, which escapes it, so markup in a
// heading stays text.

/** One piece of a heading: plain text, or the one phrase to emphasise. */
export interface EmphasisPart {
	text: string;
	em: boolean;
}

/**
 * Splits a heading at its one emphasis marker: exactly two asterisks, the first followed by a non-space and the
 * second after a non-space, with text between them. Any other string (no asterisk, one, three or more, "**", "* x *")
 * comes back whole as one plain part, so its asterisks show as typed; "" gives no parts. Returns text only: Astro
 * escapes each part.
 */
export function emphasisParts(text: string): EmphasisPart[] {
	if (!text) return [];
	const open = text.indexOf("*");
	const close = open < 0 ? -1 : text.indexOf("*", open + 1);
	const whole = [{ text, em: false }];
	if (close < 0 || text.indexOf("*", close + 1) >= 0) return whole;
	const phrase = text.slice(open + 1, close);
	if (!phrase || /^\s|\s$/.test(phrase)) return whole;
	const parts = [
		{ text: text.slice(0, open), em: false },
		{ text: phrase, em: true },
		{ text: text.slice(close + 1), em: false },
	];
	return parts.filter((p) => p.em || p.text);
}

/**
 * The heading with its marker removed, for places that need plain text: <title>, meta tags, share cards, aria labels.
 * Every string with no marker comes back unchanged.
 *
 * Not a sanitizer: the result is raw text. Pass it only where Astro escapes it; never to set:html or hand-built XML
 * or SVG.
 */
export function plainHeading(text: string): string {
	return emphasisParts(text)
		.map((p) => p.text)
		.join("");
}
