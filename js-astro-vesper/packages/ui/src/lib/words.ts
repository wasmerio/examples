/**
 * Splits a statement into words for word fill (Pro's Statement fill, the kit's word-fill utility): each word's
 * text and its place `p`, from 0 (the first) to 1 (the last), rounded to three places. Text only: the caller writes
 * each word as an escaped text node (Astro escapes it) with `data-word` and `--p`. Runs of white space split words
 * and are not kept; the caller puts one space between words.
 */
export interface Word {
	text: string;
	/** The word's place in the statement, 0 to 1. */
	p: number;
}

export function splitWords(text: string): Word[] {
	const words = text.trim().split(/\s+/).filter(Boolean);
	const last = words.length - 1;
	return words.map((word, i) => ({ text: word, p: last > 0 ? Math.round((i / last) * 1000) / 1000 : 0 }));
}
