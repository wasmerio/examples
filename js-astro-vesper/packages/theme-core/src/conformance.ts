/**
 * The checks behind a theme's conformance and snapshot routes. The theme
 * keeps its field specs, its cross-collection rules and its queries, and
 * builds them from these:
 *
 * - field predicates and `fields` (one problem per bad field);
 * - `sortedTerms`, with the theme's string rule and label order;
 * - `duplicateSlugs`, `reservedRoutes` and `sortProblems`;
 * - the model snapshot: `plainRichText`, `normalizeSnapshot`,
 *   `snapshotCollections` and `snapshotList`;
 * - `authorPreviewProblems`, for gated collections' source records.
 */
import type { RichText, Term } from "@astronomic/content";
import { makePreview, previewCoverage } from "./content/preview.ts";

type Entry = Record<string, unknown>;
export type Predicate = (v: unknown) => boolean;
export type Fields = Record<string, Predicate>;

/** Any string, empty included. */
export const isString = (v: unknown) => typeof v === "string";
/** A string with at least one character. */
export const nonEmpty = (v: unknown) => typeof v === "string" && v.length > 0;
export const optStr = (v: unknown) => v === undefined || typeof v === "string";
export const optInt = (v: unknown) => v === undefined || Number.isInteger(v);
export const bool = (v: unknown) => typeof v === "boolean";
export const isImage = (v: unknown) => typeof (v as Entry)?.src === "string" && typeof (v as Entry)?.alt === "string";
export const optImage = (v: unknown) => v === undefined || isImage(v);
export const body = (v: unknown) => typeof (v as Entry)?.format === "string";
export const list = (item: Predicate) => (v: unknown) => Array.isArray(v) && v.every(item);
/** A list of objects whose `a` and `b` are non-empty strings. */
export const pairs = (a: string, b: string) => list((v) => nonEmpty((v as Entry)?.[a]) && nonEmpty((v as Entry)?.[b]));

/** Terms whose slug and label pass `str`, in `compare` order by label. */
export function sortedTerms({ str, compare }: { str: Predicate; compare: (a: string, b: string) => number }) {
	const isTerm = (t: unknown) => str((t as Term)?.slug) && str((t as Term)?.label);
	return (v: unknown) => list(isTerm)(v) && (v as Term[]).every((t, i, all) => i === 0 || compare(all[i - 1].label, t.label) <= 0);
}

/** One problem per field that fails its predicate. */
export function fields(e: unknown, spec: Fields): string[] {
	return Object.entries(spec)
		.filter(([k, ok]) => !ok((e as Entry)[k]))
		.map(([k]) => `bad "${k}": ${JSON.stringify((e as Entry)[k])?.slice(0, 80)}`);
}

/** A problem for each repeated slug in a routed collection. */
export function duplicateSlugs(name: string, items: { slug: string }[]): string[] {
	const problems: string[] = [];
	const seen = new Set<string>();
	for (const { slug } of items) {
		if (seen.has(slug)) problems.push(`${name}: duplicate slug "${slug}"`);
		seen.add(slug);
	}
	return problems;
}

/** A problem for each page on a first-level route the theme owns (it would never be reachable). */
export function reservedRoutes(pages: { slug: string }[], routes: readonly string[]): string[] {
	return pages.filter(({ slug }) => routes.includes(slug)).map(({ slug }) => `pages: "${slug}" collides with the theme's /${slug} route`);
}

/** A problem when a list is not already in `compare` order. */
export function sortProblems<T extends { slug: string }>(name: string, items: T[], compare: (a: T, b: T) => number): string[] {
	const want = [...items].sort(compare).map((i) => i.slug);
	const got = items.map((i) => i.slug);
	return want.join() === got.join() ? [] : [`${name}: order breaks the sort rules: got [${got.join(", ")}], want [${want.join(", ")}]`];
}

// The model snapshot. Every collection's mapped data in a normalized form, so
// the content tests can compare sources field by field:
// - `ref`, `edit` and `seo` are dropped (they describe the source, not the content);
// - images become `{ alt, ratio }` (width / height, 3 decimals) or `{ alt, present: true }`;
// - rich text becomes its plain text;
// - dates become ISO days;
// - a locked entry's preview becomes `{ preview: text }`, and its `reason` is dropped.

const DROP = new Set(["ref", "edit", "seo"]);

/** Plain text of a rich text value, in any of the formats the sources use. */
export function plainRichText(value: { format: string; value: unknown }): string {
	let text = "";
	if (value.format === "markdown") {
		text = String((value.value as { body?: string })?.body ?? "")
			.replace(/```[\s\S]*?```/g, " ")
			.replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
			.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
			.replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
			// A code span keeps its text (`/*` stays /*); marks elsewhere go.
			.replace(/(`+)([^`]*?)\1|[*_~`]+/g, (_, tick, code) => (tick ? code : ""));
	} else if (value.format === "portable-text") {
		const blocks = Array.isArray(value.value) ? (value.value as Entry[]) : [];
		text = blocks.map((b) => (Array.isArray(b.children) ? (b.children as Entry[]).map((c) => c.text ?? "").join("") : "")).join(" ");
	} else {
		text = String(value.value ?? "").replace(/<[^>]+>/g, " ");
	}
	return text.replace(/\s+/g, " ").trim();
}

/** A value in snapshot form (see above). */
export function normalizeSnapshot(v: unknown): unknown {
	if (v instanceof Date) return v.toISOString().slice(0, 10);
	if (Array.isArray(v)) return v.map(normalizeSnapshot);
	if (!v || typeof v !== "object") return v;
	const o = v as Entry;
	if (typeof o.format === "string" && "value" in o) return { text: plainRichText(o as { format: string; value: unknown }) };
	if (o.kind === "preview" && Array.isArray(o.blocks)) return { preview: (o.blocks as Entry[]).map((b) => b.text).join(" ") };
	if (typeof o.src === "string" && typeof o.alt === "string") {
		const w = Number(o.width);
		const h = Number(o.height);
		return w > 0 && h > 0 ? { alt: o.alt, ratio: Math.round((w / h) * 1000) / 1000 } : { alt: o.alt, present: true };
	}
	const out: Entry = {};
	for (const [k, child] of Object.entries(o)) {
		if (DROP.has(k) || child === undefined) continue;
		// Why an entry is locked depends on the build (static or server), not on the content.
		if (k === "reason" && o.locked === true) continue;
		out[k] = normalizeSnapshot(child);
	}
	return out;
}

/** The collection methods the snapshot calls, for any model. */
export type SnapshotCollection = {
	list(q?: object, c?: object): Promise<{ items: { slug: string }[]; hasMore?: boolean }>;
	get(slug: string, c?: object): Promise<unknown>;
	slugs(q?: object, c?: object): Promise<string[]>;
	count?(q?: object, c?: object): Promise<number>;
};

/** Each collection's list, each entry through `get(slug)`, and its `slugs()` and `count()`. */
export async function snapshotCollections(cols: Record<string, SnapshotCollection>, ctx: object) {
	const collections: Entry = {};
	const entries: Entry = {};
	const slugs: Entry = {};
	for (const [name, col] of Object.entries(cols)) {
		const { items } = await col.list(undefined, ctx);
		collections[name] = normalizeSnapshot(items);
		// `get(slug)` for every entry: the single-entry path pages use (references, SEO-free).
		entries[name] = Object.fromEntries(await Promise.all(items.map(async (i) => [i.slug, normalizeSnapshot(await col.get(i.slug, ctx))])));
		slugs[name] = { slugs: await col.slugs(undefined, ctx), count: await col.count?.(undefined, ctx) };
	}
	return { collections, entries, slugs };
}

/** `list(name, q)`: one filtered query in snapshot form. */
export function snapshotList(cols: Record<string, SnapshotCollection>, ctx: object) {
	return async (name: string, q: object) => {
		const r = await cols[name].list(q, ctx);
		// `total` is optional in the contract (in-memory lists set it, paged EmDash lists do not), so it is not compared.
		return { slugs: r.items.map((i) => i.slug), hasMore: r.hasMore, items: normalizeSnapshot(r.items) };
	};
}

/**
 * A problem for each members or paid record whose author preview shows more than half of its body (by sentence,
 * `previewCoverage`). The author may mean it: the message says how to keep it public or shorten it. Pass the
 * source records (with their bodies), not the public views.
 */
export function authorPreviewProblems(
	name: string,
	records: readonly { slug: string; access?: unknown; preview?: string | RichText; body: RichText }[],
	{ max = 0.5 }: { max?: number } = {},
): string[] {
	const problems: string[] = [];
	for (const r of records) {
		if (r.access === "public" || r.preview === undefined) continue;
		const preview = makePreview({ author: r.preview, body: r.body });
		if (preview?.source !== "author") continue;
		const share = previewCoverage(preview, r.body);
		if (share > max) {
			problems.push(
				`${name} ${r.slug}: the author preview shows ${Math.round(share * 100)}% of the body. To show it all, set access: "public"; else shorten the preview.`,
			);
		}
	}
	return problems;
}
