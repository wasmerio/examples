/**
 * Generic adapter conformance check. Calls an adapter the way pages do and
 * returns every problem it finds. Empty array = conforms.
 *
 * Model-independent: it checks the contract (paging, slugs, lookups,
 * renderers). Products add their own field checks with `validate`.
 */
import { assertNoRichText } from "./access.ts";
import type { Collection, ContentAdapter, ContentContext, Renderers, Term } from "./types";

const ctx: ContentContext = { cache() {} };

export type CheckOptions = {
	collections?: Record<
		string,
		{
			/** Return problems with one entry's fields. */
			validate?(entry: unknown): string[];
			/** Queries to check: each must return a subset, and `slugs(q)` must match `list(q)`. */
			queries?: object[];
			/** At least one entry expected. Default true. */
			required?: boolean;
		}
	>;
	/** Taxonomies to check, e.g. ["tag", "category"]. */
	taxonomies?: string[];
	/** Menus to check, e.g. ["primary"]. */
	menus?: string[];
	/** Collection names the model requires, e.g. ["posts", "pages"]. Each must exist on the adapter. */
	expect?: string[];
	/**
	 * Gated collections (member access, see withAccess). Checked without a reader, as a static build reads them:
	 * every entry has `access` (public, members or paid) and a boolean `locked`; members and paid entries come back
	 * locked from `list` and `get`; a locked entry holds no body and no rich text; and no entry of any collection
	 * holds a raw members or paid record (one with a body or rich text) at any depth.
	 */
	gated?: string[];
};

function isTerm(t: unknown): t is Term {
	return !!t && typeof (t as Term).slug === "string" && typeof (t as Term).label === "string";
}

/** Finds RichText and ContentImage values anywhere in an entry and checks a renderer exists. */
function checkRenderers(where: string, value: unknown, renderers: Renderers, problems: string[], depth = 0) {
	if (!value || typeof value !== "object" || depth > 4) return;
	const v = value as Record<string, unknown>;
	if (typeof v.format === "string" && "value" in v && !renderers.richText[v.format]) {
		problems.push(`${where}: no richText renderer for format "${v.format}"`);
	}
	const source = v.source as { kind?: unknown } | undefined;
	if (typeof v.src === "string" && source && typeof source.kind !== "string") {
		problems.push(`${where}: image source needs a string "kind"`);
	}
	for (const [k, child] of Object.entries(v)) {
		if (k === "edit" || k === "value" || k === "source") continue;
		checkRenderers(`${where}.${k}`, child, renderers, problems, depth + 1);
	}
}

const sortedSlugs = (items: { slug: string }[]) => items.map((i) => i.slug).sort();
const same = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);

async function checkCollection(
	name: string,
	col: Collection<{ slug: string }, object>,
	opts: NonNullable<CheckOptions["collections"]>[string],
	renderers: Renderers,
	problems: string[],
) {
	const all = await col.list(undefined, ctx);
	if (!Array.isArray(all.items)) return problems.push(`${name}.list(): items must be an array`);
	if (typeof all.hasMore !== "boolean") problems.push(`${name}.list(): hasMore must be a boolean`);
	if (all.hasMore) problems.push(`${name}.list() without a limit must return everything (hasMore false)`);
	if (all.items.length === 0 && opts.required !== false) problems.push(`${name}.list(): no entries (seed content?)`);

	for (const [i, e] of all.items.entries()) {
		if (typeof e.slug !== "string" || !e.slug) problems.push(`${name}[${i}]: slug must be a non-empty string`);
		for (const p of opts.validate?.(e) ?? []) problems.push(`${name}[${i}] ${e.slug}: ${p}`);
		checkRenderers(`${name}[${i}]`, e, renderers, problems);
		const got = await col.get(e.slug, ctx);
		if (got?.slug !== e.slug) problems.push(`${name}.get("${e.slug}") did not return that entry`);
	}

	const slugs = await col.slugs(undefined, ctx);
	if (!same([...slugs].sort(), sortedSlugs(all.items))) problems.push(`${name}.slugs() does not match list()`);
	if (col.count && (await col.count(undefined, ctx)) !== all.items.length) problems.push(`${name}.count() is wrong`);
	if (typeof all.total === "number" && all.total !== all.items.length) problems.push(`${name}.list(): total is wrong`);

	const one = await col.list({ limit: 1 }, ctx);
	if (one.items.length > 1) problems.push(`${name}.list({ limit: 1 }) returned ${one.items.length} items`);
	if (one.hasMore !== all.items.length > 1) problems.push(`${name}.list({ limit: 1 }): hasMore is wrong`);
	if (all.items.length > 1) {
		const second = await col.list({ limit: 1, offset: 1 }, ctx);
		if (second.items[0]?.slug !== all.items[1]?.slug) problems.push(`${name}.list({ offset: 1 }) skipped the wrong entry`);
	}
	const past = await col.list({ offset: all.items.length }, ctx);
	if (past.items.length !== 0 || past.hasMore) problems.push(`${name}.list({ offset: total }) must be empty`);
	if ((await col.get("__no-such-entry__", ctx)) !== undefined) problems.push(`${name}.get(missing) must return undefined`);

	const allSlugs = new Set(slugs);
	for (const q of opts.queries ?? []) {
		const label = `${name}.list(${JSON.stringify(q)})`;
		const res = await col.list(q, ctx);
		if (res.items.length === 0) problems.push(`${label}: no results (pick a query that matches)`);
		if (!res.items.every((e) => allSlugs.has(e.slug))) problems.push(`${label}: returned unknown entries`);
		if (res.items.length >= all.items.length && all.items.length > 1) problems.push(`${label}: did not filter`);
		if (!same([...(await col.slugs(q, ctx))].sort(), sortedSlugs(res.items))) problems.push(`${name}.slugs(${JSON.stringify(q)}) does not match list`);
	}
}

const ACCESS = new Set(["public", "members", "paid"]);

/** Problems with one entry of a gated collection, read without a reader. */
function gatedEntryProblems(where: string, e: Record<string, unknown>, from: "list" | "get"): string[] {
	const problems: string[] = [];
	// The field checks once, on the list entry; get adds its own lock and rich text checks.
	if (from === "list" && !ACCESS.has(e.access as string)) problems.push(`${where}: access must be public, members or paid (got ${JSON.stringify(e.access)})`);
	if (from === "list" && typeof e.locked !== "boolean") problems.push(`${where}: locked must be a boolean`);
	if (e.access !== "public" && e.locked !== true) problems.push(`${where}: a ${String(e.access)} entry must be locked without a reader (${from})`);
	if (e.locked === true) {
		try {
			assertNoRichText(e, where);
		} catch (err) {
			problems.push(`${where}: ${(err as Error).message}`);
		}
	}
	return problems;
}

/** A problem for each members or paid record with a body or rich text, at any depth of an entry. */
function rawRecordProblems(where: string, entry: unknown): string[] {
	const problems: string[] = [];
	const seen = new WeakSet<object>();
	const stack: Array<[unknown, string]> = [[entry, ""]];
	while (stack.length) {
		const [v, path] = stack.pop()!;
		if (!v || typeof v !== "object" || v instanceof Date || seen.has(v)) continue;
		seen.add(v);
		const access = (v as { access?: unknown }).access;
		if (access === "members" || access === "paid") {
			try {
				assertNoRichText(v, where);
			} catch {
				problems.push(`${where}: at ${path || "(root)"}, a raw ${access} record with a body or rich text`);
				continue;
			}
		}
		const children: Array<[string, unknown]> = Array.isArray(v)
			? v.map((item, i) => [`${path}[${i}]`, item])
			: v instanceof Map || v instanceof Set
				? [...v.values()].map((item, i) => [`${path}{${i}}`, item])
				: Object.entries(v).map(([k, item]) => [path ? `${path}.${k}` : k, item]);
		for (const [p, item] of children) stack.push([item, p]);
	}
	return problems;
}

// biome-ignore lint/suspicious/noExplicitAny: works for any model.
async function checkGated(adapter: ContentAdapter<any, any>, gated: string[], problems: string[]) {
	const gatedSet = new Set(gated);
	for (const name of gated) if (!adapter.collections?.[name]) problems.push(`gated collection "${name}" is missing`);
	for (const [name, col] of Object.entries(adapter.collections ?? {}) as [string, Collection<{ slug: string }, object>][]) {
		try {
			const { items } = await col.list(undefined, ctx);
			for (const [i, e] of items.entries()) {
				const where = `${name}[${i}] ${e.slug}`;
				if (gatedSet.has(name)) problems.push(...gatedEntryProblems(where, e as Record<string, unknown>, "list"));
				problems.push(...rawRecordProblems(where, e));
				const got = await col.get(e.slug, ctx);
				if (got === undefined) continue;
				const at = `${name}.get("${e.slug}")`;
				if (gatedSet.has(name)) problems.push(...gatedEntryProblems(at, got as Record<string, unknown>, "get"));
				problems.push(...rawRecordProblems(at, got));
			}
		} catch (err) {
			problems.push(`${name}: threw ${String(err)}`);
		}
	}
}

// biome-ignore lint/suspicious/noExplicitAny: works for any model.
export async function checkAdapter(adapter: ContentAdapter<any, any>, opts: CheckOptions = {}): Promise<string[]> {
	const problems: string[] = [];
	if (typeof adapter.name !== "string") problems.push("name must be a string");
	if (!adapter.renderers || typeof adapter.renderers.richText !== "object") problems.push("renderers.richText is required");

	for (const name of opts.expect ?? []) {
		if (!adapter.collections?.[name]) problems.push(`collection "${name}" is missing`);
	}
	for (const [name, col] of Object.entries(adapter.collections ?? {})) {
		try {
			await checkCollection(name, col as Collection<{ slug: string }, object>, opts.collections?.[name] ?? {}, adapter.renderers, problems);
		} catch (err) {
			problems.push(`${name}: threw ${String(err)}`);
		}
	}

	if (opts.gated) await checkGated(adapter, opts.gated, problems);

	for (const tax of opts.taxonomies ?? []) {
		const terms = (await adapter.taxonomies?.list(tax, ctx)) ?? [];
		if (!terms.length || !terms.every(isTerm)) problems.push(`taxonomies.list("${tax}") must return { slug, label }[]`);
	}
	if (adapter.settings) {
		const s = await adapter.settings.get(ctx);
		if (s.title !== undefined && typeof s.title !== "string") problems.push("settings.get(): title must be a string");
	}
	for (const menu of opts.menus ?? []) {
		const m = (await adapter.menus?.get(menu, ctx)) ?? [];
		if (!m.length || !m.every((i) => typeof i.label === "string" && typeof i.href === "string"))
			problems.push(`menus.get("${menu}") must return { label, href }[]`);
	}
	return problems;
}
