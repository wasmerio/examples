/**
 * EmDash source kit. Model-independent: products describe their collections
 * with `emdashCollection()` and add `emdashSite()`, `emdashRenderers`,
 * `emdashHooks` and `emdashComponents`. See README.md.
 *
 * Needs the `emdash()` integration and server output (`emdash.setup.mjs`).
 */
import {
	type CacheHint,
	type CollectionFilter,
	type ContentEntry,
	extractPlainText,
	getEmDashCollection,
	getEmDashEntry,
	getContentSeo,
	getMenuWithCacheHint,
	getSeoMeta,
	getSiteSettingsWithCacheHint,
	getTaxonomyTermsWithCacheHint,
	getTermsForEntries,
	type MenuItem as EmDashMenuItem,
	search,
	type TaxonomyTerm,
	type WhereValue,
} from "emdash";
import type {
	Collection,
	ContentContext,
	ContentImage,
	MenuItem,
	PageQuery,
	Renderers,
	RichText as RichTextValue,
	SearchHit,
	Seo,
	SiteParts,
	SiteSettings,
	Term,
} from "../index";
import { publicOrigin } from "../public-origin";
import BodyEnd from "./BodyEnd.astro";
import BodyStart from "./BodyStart.astro";
import Head from "./Head.astro";
import Image from "./Image.astro";
import RichText from "./RichText.astro";
import WidgetArea from "./WidgetArea.astro";

export type { WhereValue };

/** Entry data. Loose on purpose: fields depend on the collection schema. */
export type EmDashData = {
	/** Database id (the route slug is `entry.id`). */
	id: string;
	terms?: Record<string, TaxonomyTerm[]>;
	// biome-ignore lint/suspicious/noExplicitAny: field shape depends on the collection schema.
	[field: string]: any;
};

export type EmDashEntry = ContentEntry<EmDashData>;

export const DEFAULT_MEDIA_BASE_URL = "/_emdash/api/media/file";

/** Per-entry helpers passed to `map`. */
export type EmDashHelpers = {
	/** Portable Text, tagged for `emdashRenderers`. */
	richText(value: unknown): RichTextValue;
	/** An EmDash image field value. `undefined` when empty. */
	image(value: unknown): ContentImage | undefined;
	/** Plain text from a string or Portable Text, cut at a word boundary. */
	excerpt(value: unknown, max?: number): string | undefined;
	/** The entry's terms in a taxonomy, sorted by label. */
	terms(taxonomy: string): Term[];
	/** Visual-editing attributes per model field: `{ title: "headline" }`. */
	edit<K extends string>(fieldMap: Record<K, string>): Record<K, Record<string, unknown>>;
	/** Source identity for page hooks. */
	ref(): { source: "emdash"; collection: string; id: string };
	/** SEO panel values. Only in `get` on a request; otherwise `undefined`. */
	seo(): Promise<Seo | undefined>;
	/**
	 * The first target of a reference field named in `references`. `undefined`
	 * when the field is empty, or its target is missing, deleted or unpublished.
	 */
	reference(field: string): EmDashEntry | undefined;
	/** Every published target of a reference field named in `references`, in the editor's order. */
	references(field: string): EmDashEntry[];
	/**
	 * The request context `map` runs in. Pass it to nested collection calls
	 * (`other.get(slug, h.ctx)`) so their cache hints reach the route cache.
	 */
	ctx: ContentContext | undefined;
};

// biome-ignore lint/complexity/noBannedTypes: an empty query is valid.
export type EmDashCollectionOptions<E extends { slug: string }, Q = {}> = {
	/** EmDash collection slug. */
	collection: string;
	/** Maps an entry into the model. Keep `slug: entry.id`: `get(slug)` looks it up. */
	map(entry: EmDashEntry, h: EmDashHelpers): E | Promise<E>;
	/** EmDash `where` for a query (fields or taxonomy names). */
	where?(q: Q): Record<string, WhereValue | undefined> | undefined;
	/** EmDash `orderBy` for a query. */
	orderBy?(q: Q): Record<string, "asc" | "desc">;
	/**
	 * Keeps mapped entries matching `q`, for queries `where` cannot express
	 * (e.g. a reference field). Turns on in-memory lists (see `sort`).
	 */
	filter?(entry: E, q: Q): boolean;
	/**
	 * Orders mapped entries in code, for orders `orderBy` cannot express
	 * (e.g. "empty values last"). With `filter` or `sort`, `list` maps every
	 * entry that matches `where`, then filters, sorts and pages in memory.
	 * Use it for small collections.
	 */
	sort?(a: E, b: E, q: Q): number;
	/** Taxonomies `h.terms()` reads. List results load each in one batched query if EmDash did not. */
	taxonomies?: string[];
	/** Must match `storage.baseUrl`. Used when an image has no `src`. */
	mediaBaseUrl?: string;
	/**
	 * Reference fields to load, by field slug. `h.reference()` and
	 * `h.references()` read them. `get` loads them with the entry; `list`
	 * loads them per entry, in parallel (EmDash 1.1 cannot batch them; see
	 * README). At most EmDash's page limit (50) targets per field.
	 */
	references?: string[];
};

/** Loaded reference targets, by field slug. */
type LoadedReferences = Record<string, EmDashEntry[]>;

/**
 * Plain text of Portable Text blocks. A heading ends a sentence, so it does
 * not run into the next paragraph.
 */
function blocksText(blocks: unknown[]): string {
	return blocks
		.map((block) => {
			const text = extractPlainText([block] as Parameters<typeof extractPlainText>[0]).trim();
			const style = (block as { style?: unknown } | null)?.style;
			const heading = typeof style === "string" && /^h[1-6]$/.test(style);
			return heading && text && !/[.!?:…]$/.test(text) ? `${text}.` : text;
		})
		.filter(Boolean)
		.join(" ");
}

/** Cuts plain text at a word boundary. */
export function trimExcerpt(text: string, max = 160): string {
	const clean = text.replace(/\s+/g, " ").trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max);
	const space = cut.lastIndexOf(" ");
	return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s.,;:!?-]+$/, "")}…`;
}

type RawImage = { id?: string; src?: string; alt?: string; width?: number; height?: number; meta?: Record<string, unknown> };

/** Maps an EmDash image value. `source.value` keeps it for `Image.astro`. */
export function toImage(value: unknown, mediaBaseUrl = DEFAULT_MEDIA_BASE_URL): ContentImage | undefined {
	const img = value as RawImage | null | undefined;
	if (!img || typeof img !== "object" || (!img.id && !img.src)) return undefined;
	const key = (img.meta?.storageKey as string | undefined) ?? img.id;
	return {
		src: img.src ?? `${mediaBaseUrl}/${key}`,
		alt: img.alt ?? "",
		width: img.width,
		height: img.height,
		source: { kind: "emdash", value: img },
	};
}

const byLabel = (a: Term, b: Term) => a.label.localeCompare(b.label);

function toTerms(terms: TaxonomyTerm[] | undefined): Term[] {
	return (terms ?? []).map((t) => ({ slug: t.slug, label: t.label })).sort(byLabel);
}

function toMenuItems(items: EmDashMenuItem[]): MenuItem[] {
	return items.map((item) => ({
		label: item.label,
		href: item.url,
		target: item.target || undefined,
		children: item.children?.length ? toMenuItems(item.children) : undefined,
	}));
}

function fail(what: string, error: Error): never {
	throw new Error(`[content/emdash] ${what}: ${error.message}`, { cause: error });
}

/** EmDash's "hide from search engines" for an entry that has its SEO data loaded (single-entry queries). */
function noIndexOf(entry: EmDashEntry): boolean | undefined {
	const seo = getContentSeo(entry as Parameters<typeof getContentSeo>[0]);
	return seo ? Boolean(seo.noIndex) : undefined;
}

/** `{ noindex: true }` when set, else undefined. */
const noindexOnly = (noindex: boolean | undefined): Seo | undefined => (noindex ? { noindex: true } : undefined);

/**
 * The SEO known without the request: `noindex`, and the SEO panel's canonical when it is an absolute http(s) URL
 * (a relative one needs the request's origin), so a sitemap can leave out a page whose canonical points elsewhere.
 */
function bareSeo(entry: EmDashEntry, noindex = noIndexOf(entry)): Seo | undefined {
	const raw = getContentSeo(entry as Parameters<typeof getContentSeo>[0])?.canonical;
	const canonical = typeof raw === "string" && /^https?:\/\/[^/]/i.test(raw.trim()) ? raw.trim() : undefined;
	if (!canonical) return noindexOnly(noindex);
	return { canonical, ...(noindex ? { noindex: true } : {}) };
}

/**
 * SEO from EmDash's SEO panel and fields. The URLs need the request;
 * without it only `noindex` is known (read from the entry's SEO data).
 */
async function seoFor(entry: EmDashEntry, ctx?: ContentContext): Promise<Seo | undefined> {
	const noindex = noIndexOf(entry);
	const astro = ctx?.astro;
	if (!astro) return bareSeo(entry, noindex);
	const meta = getSeoMeta(entry, {
		// The public origin, as the product layout uses (SITE_URL at run time, then `site`), so the URLs agree.
		siteUrl: publicOrigin({ site: astro.site, url: astro.url, output: "server" }),
		path: astro.url.pathname.replace(/\/$/, ""),
	});
	// Only the SEO panel's own title, as a Markdown entry's `seo.title` is only an explicit one: EmDash's
	// `ogTitle` falls back to the entry's title, which would hide a page's own computed title. Pages pass
	// `seo.title ?? title`; the product layout adds " — Site" for <title>.
	const panelTitle = getContentSeo(entry as Parameters<typeof getContentSeo>[0])?.title;
	return {
		title: (typeof panelTitle === "string" && panelTitle.trim()) || undefined,
		description: meta.description ?? undefined,
		image: meta.ogImage ?? undefined,
		canonical: meta.canonical ?? undefined,
		...(noindex ? { noindex: true } : {}),
	};
}

/** A collection backed by one EmDash collection. */
// biome-ignore lint/complexity/noBannedTypes: an empty query is valid.
export function emdashCollection<E extends { slug: string }, Q = {}>(
	opts: EmDashCollectionOptions<E, Q>,
): Collection<E, Q> {
	const name = opts.collection;
	const taxonomies = opts.taxonomies ?? [];
	const referenceFields = opts.references ?? [];

	function helpers(
		entry: EmDashEntry,
		terms: Record<string, TaxonomyTerm[]>,
		refs: LoadedReferences,
		ctx?: ContentContext,
		withSeo = false,
		listNoindex = false,
	): EmDashHelpers {
		function targets(field: string): EmDashEntry[] {
			if (!referenceFields.includes(field)) {
				throw new Error(`[content/emdash] ${name}: reference field "${field}" is not in \`references\`.`);
			}
			return refs[field] ?? [];
		}
		return {
			richText: (value) => ({ format: "portable-text", value: Array.isArray(value) ? value : [] }),
			image: (value) => toImage(value, opts.mediaBaseUrl),
			excerpt(value, max = 160) {
				const text = typeof value === "string" ? value : Array.isArray(value) ? blocksText(value) : "";
				return trimExcerpt(text, max) || undefined;
			},
			terms: (taxonomy) => toTerms(terms[taxonomy]),
			edit(fieldMap) {
				// EditProxy only answers property reads; copy each field's attributes.
				const out = {} as Record<keyof typeof fieldMap, Record<string, unknown>>;
				for (const [field, sourceField] of Object.entries(fieldMap) as [keyof typeof fieldMap, string][]) {
					const attrs = entry.edit?.[sourceField];
					if (attrs) out[field] = { ...attrs };
				}
				return out;
			},
			ref: () => ({ source: "emdash", collection: name, id: entry.data.id }),
			seo: async () => (withSeo ? seoFor(entry, ctx) : listNoindex ? listSeo(entry, ctx) : undefined),
			reference: (field) => targets(field)[0],
			references: (field) => [...targets(field)],
			ctx,
		};
	}

	/**
	 * SEO for an entry in a list: only `noindex` and an absolute canonical (the
	 * sitemaps and search index need them; the rest needs the request). EmDash 1.1 loads SEO data only for
	 * single-entry queries and exposes no batched read, so this runs one
	 * `getEmDashEntry` per entry. Only lists queried with `seo: true` pay
	 * (the sitemap and the feed); other lists' entries carry no SEO.
	 */
	async function listSeo(entry: EmDashEntry, ctx: ContentContext | undefined): Promise<Seo | undefined> {
		const known = noIndexOf(entry);
		if (known !== undefined) return bareSeo(entry, known);
		const result = await getEmDashEntry(name, entry.id);
		if (result.error) fail(`${name}.seo(${entry.id})`, result.error);
		ctx?.cache(result.cacheHint);
		return result.entry ? bareSeo(result.entry as EmDashEntry) : undefined;
	}

	/** The `references` selection for `getEmDashEntry`: the first page of each field. */
	const selection = referenceFields.length
		? { references: Object.fromEntries(referenceFields.map((field) => [field, true as const])) }
		: undefined;

	/**
	 * Reference targets for many entries. EmDash 1.1 has no batched form:
	 * `getEmDashCollection` takes no `references` option and refuses reference
	 * fields in `where`/`orderBy` (their links are not stored on the entry). So
	 * this runs one `getEmDashEntry(name, slug, { references })` per entry, all
	 * at once. That path uses EmDash's object cache and returns a cache hint
	 * that covers the targets. Missing, deleted and unpublished targets are
	 * left out.
	 */
	async function loadReferences(entries: EmDashEntry[], ctx: ContentContext | undefined): Promise<LoadedReferences[]> {
		if (!selection) return entries.map(() => ({}));
		return Promise.all(
			entries.map(async (entry) => {
				const result = await getEmDashEntry(name, entry.id, selection);
				if (result.error) fail(`${name}.references(${entry.id})`, result.error);
				ctx?.cache(result.cacheHint);
				return result.entry ? attached(result.entry as EmDashEntry) : {};
			}),
		);
	}

	/** References `getEmDashEntry` attached, by field slug. */
	function attached(entry: EmDashEntry): LoadedReferences {
		const pages = (entry as { references?: Record<string, { entries: unknown[] }> }).references ?? {};
		return Object.fromEntries(referenceFields.map((field) => [field, (pages[field]?.entries ?? []) as EmDashEntry[]]));
	}

	function filter(q: Q & PageQuery = {} as Q & PageQuery): CollectionFilter {
		const where = Object.fromEntries(
			Object.entries(opts.where?.(q) ?? {}).filter(([, v]) => v !== undefined),
		) as Record<string, WhereValue>;
		return {
			...(opts.orderBy ? { orderBy: opts.orderBy(q) } : {}),
			...(Object.keys(where).length ? { where } : {}),
			...(q.limit ? { limit: q.limit } : {}),
			...(q.offset ? { offset: q.offset } : {}),
		};
	}

	async function query(q: (Q & PageQuery) | undefined, ctx: ContentContext | undefined, what: string) {
		const result = await getEmDashCollection(name, filter(q));
		if (result.error) fail(`${name}.${what}`, result.error);
		ctx?.cache(result.cacheHint);
		return result;
	}

	/** Maps raw entries. Terms and references load in batches first. */
	/** `listNoindex`: the query asked for `seo: true`, so `h.seo()` loads each entry's noindex. */
	async function mapEntries(entries: EmDashEntry[], ctx: ContentContext | undefined, listNoindex = false): Promise<E[]> {
		// EmDash usually folds terms into the list query. If it did not, load each taxonomy in one batch.
		const missing = taxonomies.length > 0 && entries.some((e) => !e.data.terms);
		const ids = entries.map((e) => e.data.id);
		const [batched, refs] = await Promise.all([
			missing ? Promise.all(taxonomies.map((tax) => getTermsForEntries(name, ids, tax))) : Promise.resolve([]),
			loadReferences(entries, ctx),
		]);
		return Promise.all(
			entries.map((entry, n) => {
				const terms = missing
					? Object.fromEntries(taxonomies.map((tax, i) => [tax, batched[i]?.get(entry.data.id) ?? []]))
					: (entry.data.terms ?? {});
				return opts.map(entry, helpers(entry, terms, refs[n] ?? {}, ctx, false, listNoindex));
			}),
		);
	}

	// With `filter` or `sort`, lists are built in memory: every entry that
	// matches `where` is mapped, then filtered, sorted and paged here.
	const inMemory = Boolean(opts.filter || opts.sort);

	async function matching(q: Q | undefined, ctx: ContentContext | undefined, what: string): Promise<E[]> {
		const wanted = (q ?? {}) as Q;
		const { limit: _l, offset: _o, ...rest } = wanted as Q & PageQuery;
		const result = await query(rest as Q & PageQuery, ctx, what);
		const items = await mapEntries(result.entries as EmDashEntry[], ctx, Boolean((wanted as PageQuery).seo));
		const kept = opts.filter ? items.filter((e) => opts.filter!(e, wanted)) : items;
		if (opts.sort) kept.sort((a, b) => opts.sort!(a, b, wanted));
		return kept;
	}

	return {
		async list(q, ctx) {
			if (inMemory) {
				const items = await matching(q, ctx, "list");
				const total = items.length;
				const offset = Math.max(0, q?.offset ?? 0);
				const end = q?.limit === undefined ? total : offset + q.limit;
				return { items: items.slice(offset, end), hasMore: end < total, total };
			}
			const result = await query(q, ctx, "list");
			const items = await mapEntries(result.entries as EmDashEntry[], ctx, Boolean(q?.seo));
			const hasMore = q?.limit ? (result.hasMore ?? Boolean(result.nextCursor)) : false;
			return { items, hasMore };
		},
		async get(slug, ctx) {
			const result = await getEmDashEntry(name, slug, selection);
			if (result.error) fail(`${name}.get(${slug})`, result.error);
			// The hint covers the referenced entries too (EmDash folds them in).
			ctx?.cache(result.cacheHint satisfies CacheHint);
			if (!result.entry) return undefined;
			const entry = result.entry as EmDashEntry;
			return opts.map(entry, helpers(entry, entry.data.terms ?? {}, attached(entry), ctx, true));
		},
		// EmDash has no slug-only or count query; one unpaged query is the cheapest.
		// `filter` and `sort` need mapped entries, so then every match is mapped
		// (the same path as `list`, so the order matches too).
		async slugs(q, ctx) {
			if (inMemory) return (await matching(q, ctx, "slugs")).map((e) => e.slug);
			const result = await query(q as Q & PageQuery, ctx, "slugs");
			return result.entries.map((e) => e.id);
		},
		async count(q, ctx) {
			if (inMemory) return (await matching(q, ctx, "count")).length;
			const result = await query(q as Q & PageQuery, ctx, "count");
			return result.entries.length;
		},
	};
}

export type EmDashSiteOptions = {
	/** Enables `search`. `href` builds the link for a hit. `limit` caps the hits (EmDash's default is 20). */
	search?: { collections: string[]; href(collection: string, slug: string): string; limit?: number };
	/** Must match `storage.baseUrl`. Used for the logo when it has no URL. */
	mediaBaseUrl?: string;
};

const ENTITIES: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" };

/** Settings, menus, taxonomies and (optionally) search from EmDash. */
export function emdashSite(opts: EmDashSiteOptions = {}): SiteParts<SiteSettings> {
	const parts: SiteParts<SiteSettings> = {
		settings: {
			async get(ctx) {
				const { data, cacheHint } = await getSiteSettingsWithCacheHint();
				ctx?.cache(cacheHint);
				const logo = data.logo?.url
					? {
							src: data.logo.url,
							alt: data.logo.alt ?? "",
							width: data.logo.width,
							height: data.logo.height,
							source: { kind: "emdash", value: data.logo.url },
						}
					: undefined;
				// Empty values stay undefined, so the product's defaults apply.
				return { title: data.title || undefined, tagline: data.tagline || undefined, logo };
			},
		},
		menus: {
			async get(name, ctx) {
				const { data, cacheHint } = await getMenuWithCacheHint(name);
				ctx?.cache(cacheHint);
				return toMenuItems(data?.items ?? []);
			},
		},
		taxonomies: {
			async list(name, ctx) {
				const { data, cacheHint } = await getTaxonomyTermsWithCacheHint(name, { includeCounts: false });
				ctx?.cache(cacheHint);
				return toTerms(data);
			},
		},
	};
	const searchOpts = opts.search;
	if (searchOpts) {
		parts.search = async (q): Promise<SearchHit[]> => {
			const { items } = await search(q, { collections: searchOpts.collections, limit: searchOpts.limit });
			// Hits without a slug are dropped after `limit` applies, so a caller may get fewer.
			return items
				.filter((hit) => hit.slug)
				.map((hit) => ({
					collection: hit.collection,
					slug: hit.slug as string,
					title: hit.title ?? (hit.slug as string),
					excerpt: hit.snippet?.replace(/<[^>]+>/g, "").replace(/&(amp|lt|gt|quot|#39);/g, (m) => ENTITIES[m] ?? m),
					href: searchOpts.href(hit.collection, hit.slug as string),
				}));
		};
	}
	return parts;
}

/** Portable Text and EmDash media renderers. */
export const emdashRenderers = {
	richText: { "portable-text": RichText },
	image: { emdash: Image },
} satisfies Renderers;

/** EmDash page contributions (plugins, JSON-LD, Twitter cards, favicon). Never duplicates the product's tags. */
export const emdashHooks = { Head, BodyStart, BodyEnd };

/** Admin-managed widget areas. Props: `{ name }`. */
export const emdashComponents = { WidgetArea };
