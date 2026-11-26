/**
 * Link values from content (Markdown files or the CMS): one check, run by both sources before a value enters the
 * model, so no page puts an unchecked href on the page. Pages and components can then trust every href they get.
 *
 * - `safeHref(value)`: the value, trimmed, when it is a link a page may use, else undefined. Allowed: an `https:` URL
 *   with a host, a site path (`/about`), a fragment (`#notes`), `mailto:` and `tel:`. Anything else is refused: other
 *   schemes (`javascript:`, `data:`, `vbscript:`, `file:`, and plain `http:`, which the demo never uses), a
 *   protocol-relative `//host`, a relative path without the leading slash, and any value with a backslash (browsers
 *   read `\` as `/`), whitespace or a control character inside it.
 * - `checkedHref`, `checkedLink`, `checkedLinks`, `checkedMenu`: the fields that hold links, as both sources map them.
 *   A refused link is left out (a menu item with its children), and it is recorded under its place (`where`).
 * - `socialIcon(value)`: a social link's icon id, trimmed; "website" when it is missing or blank. Both sources use it.
 * - `linkProblems()`: the recorded values, one line each, for the setup check (src/utils/setup.ts), which stops a
 *   static build and answers an error in `astro dev`. A production server never checks: there a refused link is
 *   simply not shown.
 *
 * The record is kept per place, and each place is updated whenever its value is mapped again, so in `astro dev` a
 * fixed value stops being reported on the next request. (A place whose entry was deleted keeps its last report until
 * the dev server restarts.)
 *
 * Plain Node loads this file (the unit tests), so it imports nothing Node cannot load.
 */
import type { MenuItem } from "@astronomic/content";
import { liveHref } from "../utils/placeholders";
import type { Link } from "./model";

/** Whitespace, a backslash or a control character anywhere in the value. */
const UNSAFE_CHARS = /[\s\\\x00-\x1f\x7f]/;

/** True for a path on this site: one leading slash (not two), no whitespace, backslash or control character. */
export const isSitePath = (value: string) => value.startsWith("/") && !value.startsWith("//") && !UNSAFE_CHARS.test(value);

/**
 * The value, trimmed, when a page may use it as an href; undefined otherwise (see the file's header for the rule).
 * A string with nothing in it is undefined too.
 */
export function safeHref(value: unknown): string | undefined {
	if (typeof value !== "string") return undefined;
	const href = value.trim();
	if (!href || UNSAFE_CHARS.test(href)) return undefined;
	if (href.startsWith("#")) return href;
	if (href.startsWith("/")) return isSitePath(href) ? href : undefined;
	const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(href)?.[1]?.toLowerCase();
	if (scheme === "mailto" || scheme === "tel") return href.length > scheme.length + 1 ? href : undefined;
	if (scheme !== "https") return undefined;
	try {
		const url = new URL(href);
		return url.protocol === "https:" && url.hostname ? href : undefined;
	} catch {
		return undefined;
	}
}

// ---------------------------------------------------------------------------
// The record of refused values

const refused = new Map<string, string>();

/** Records `value` under `where` when it was refused, and clears the place when it was not. */
function note(where: string, value: unknown, ok: boolean) {
	if (ok || value === undefined || value === null || value === "") refused.delete(where);
	else refused.set(where, typeof value === "string" ? value : JSON.stringify(value) ?? String(value));
}

/** Clears every place under `prefix` (a list's items), before the list is mapped again. */
function clearUnder(prefix: string) {
	for (const where of refused.keys()) if (where.startsWith(prefix)) refused.delete(where);
}

/** Every refused value, one line each (sorted, so the setup check's output is stable). */
export function linkProblems(): string[] {
	return [...refused]
		.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
		.map(([where, value]) => `${where}: ${JSON.stringify(value)} is not a link a page may use. Use an https: URL, a site path (/…), #…, mailto: or tel:.`);
}

/** Forgets every record (the unit tests). */
export function clearLinkProblems() {
	refused.clear();
}

// ---------------------------------------------------------------------------
// The fields that hold links

/** A form's action, checked and recorded under `where`. The form's own guard (withoutPlaceholderForms, src/utils/setup.ts) decides on a placeholder address and names it. */
export function checkedAction(value: unknown, where: string): string | undefined {
	const href = safeHref(value);
	note(where, value, href !== undefined);
	return href;
}

/** One href, checked and recorded under `where`. A live server leaves out one on a placeholder address (liveHref). */
export function checkedHref(value: unknown, where: string): string | undefined {
	const href = checkedAction(value, where);
	return href && liveHref(href, where);
}

/** A `{ label, href }` link, or undefined when there is none or its href is refused. */
export function checkedLink<L extends Link>(link: L | undefined, where: string): L | undefined {
	if (!link) {
		refused.delete(`${where}.href`);
		return undefined;
	}
	const href = checkedHref(link.href, `${where}.href`);
	return href === undefined ? undefined : { ...link, href };
}

/** A social link's icon id, trimmed; "website" when it is missing or blank. */
export const socialIcon = (value: unknown): string => (typeof value === "string" && value.trim() !== "" ? value.trim() : "website");

/** A list of links (the socials), without the refused ones. */
export function checkedLinks<L extends Link>(links: L[] | undefined, where: string): L[] {
	clearUnder(`${where}[`);
	return (links ?? []).flatMap((link, i) => checkedLink(link, `${where}[${i}]`) ?? []);
}

/** A menu, at every level. An item whose own href is refused is left out with its children. */
export function checkedMenu(items: MenuItem[] | undefined, where: string): MenuItem[] {
	clearUnder(`${where}[`);
	const walk = (list: MenuItem[], at: string): MenuItem[] =>
		list.flatMap((item, i) => {
			const place = `${at}[${i}]`;
			const href = checkedHref(item.href, `${place}.href`);
			if (href === undefined) return [];
			return [{ ...item, href, ...(item.children ? { children: walk(item.children, `${place}.children`) } : {}) }];
		});
	return walk(items ?? [], where);
}
