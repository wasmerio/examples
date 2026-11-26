/**
 * Heading ids and the "On this page" list, from rendered rich text.
 *
 * Works on the HTML every renderer emits (Markdown, EmDash Portable Text,
 * plain HTML), so all sources get the same ids from the same heading text.
 * Any id a renderer already set on an h2 is replaced, for that reason.
 */

export type OutlineItem = { id: string; text: string };

/** The input id SearchForm sets by default. */
export const SEARCH_INPUT_ID = "site-search";
/** The label id OnThisPage (`list`) sets by default. */
export const ON_THIS_PAGE_LABEL_ID = "on-this-page-label";
/**
 * The ids theme-core parts set by default. A theme spreads them into the
 * `reserved` it passes to `outline`, so a heading never takes one. This file
 * has no imports, so plain Node (a theme's test scripts) can load it.
 */
export const PART_IDS = [ON_THIS_PAGE_LABEL_ID, SEARCH_INPUT_ID] as const;

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

/** Common HTML entities and numeric references decoded, once. */
export function decodeEntities(text: string) {
	return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
		if (e[0] !== "#") return ENTITIES[e.toLowerCase()] ?? m;
		const cp = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : Number(e.slice(1));
		return cp <= 0x10ffff ? String.fromCodePoint(cp) : m;
	});
}

/** Plain text of an HTML fragment: tags removed, common entities decoded. */
function plainText(html: string) {
	return decodeEntities(html.replace(/<[^>]*>/g, ""))
		.replace(/\s+/g, " ")
		.trim();
}

/** "Your rights (GDPR)" -> "your-rights-gdpr". Letters and digits in any script are kept; apostrophes are dropped ("client's" -> "clients"). */
export function slugify(text: string) {
	return (
		text
			.normalize("NFKD")
			.replace(/\p{M}/gu, "")
			.toLowerCase()
			.replace(/['\u2019]/g, "")
			.replace(/[^\p{L}\p{N}]+/gu, "-")
			.replace(/^-+|-+$/g, "") || "section"
	);
}

/**
 * The id rule of `outline`, for headings in order: the slugified text, then `-2`, `-3` for repeats, never one of
 * `reserved`. Returns a function to call once per heading. Shared with theme-core's preview outline.
 */
export function headingIds(reserved: readonly string[] = []): (text: string) => string {
	const seen = new Map<string, number>(reserved.map((id) => [id, 1]));
	return (text) => {
		const base = slugify(text);
		const n = (seen.get(base) ?? 0) + 1;
		seen.set(base, n);
		return n === 1 ? base : `${base}-${n}`;
	};
}

/**
 * Gives every h2 a stable id (its slugified text, `-2`, `-3` for repeats)
 * and returns the HTML and the list of h2s in order.
 * Pass the ids your layout and pages already use as `reserved`.
 * A heading with the same text gets "-2", so its link does not jump to them.
 */
export function outline(html: string, { reserved = [] }: { reserved?: readonly string[] } = {}): { html: string; items: OutlineItem[] } {
	const items: OutlineItem[] = [];
	const idFor = headingIds(reserved);
	const out = html.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (_m, attrs: string, inner: string) => {
		const text = plainText(inner);
		const id = idFor(text);
		items.push({ id, text });
		const rest = attrs.replace(/\s+id\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i, "");
		return `<h2 id="${id}"${rest}>${inner}</h2>`;
	});
	return { html: out, items };
}
