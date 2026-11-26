/**
 * Markdown/MDX adapter factories. Read Astro content collections (defined in
 * src/content.config.ts) at build time. Model-independent: the product maps
 * entries into its own types in `src/content/sources/markdown.ts`.
 */
import type { ImageMetadata } from "astro";
import { getCollection, getEntry } from "astro:content";
import type { Collection, ContentImage, MenuItem, Renderers, RichText, SiteParts, SiteSettings, Term } from "../index";
import Image from "./Image.astro";
import RichTextRenderer from "./RichText.astro";

/** A loaded collection entry. Loose on purpose: each collection has its own schema. */
export type MarkdownEntry = {
	id: string;
	collection: string;
	body?: string;
	// biome-ignore lint/suspicious/noExplicitAny: frontmatter shape depends on the collection schema.
	data: Record<string, any>;
};

/** Helpers passed to `map`. */
export type MarkdownHelpers = {
	/** The entry's body as rich text. Rendered by `RichText.astro`. */
	richText(entry: MarkdownEntry): RichText;
	/** A local image (from `image()` in the schema). Undefined in, undefined out. */
	image: {
		(img: ImageMetadata, alt?: string): ContentImage;
		(img: ImageMetadata | undefined, alt?: string): ContentImage | undefined;
	};
	/** Plain text from the body, cut at a word boundary. */
	excerpt(entry: MarkdownEntry, max?: number): string;
	/** Terms for slugs, sorted by label. Labels come from the taxonomies collection. */
	terms(slugs: string[] | undefined, taxonomy: string): Promise<Term[]>;
	/**
	 * Resolves a reference to an entry of another collection, by its mapped
	 * `slug`. Takes a slug, or the `{ collection, id }` value that Astro's
	 * `reference()` gives (`id` must equal the target's mapped slug).
	 * `undefined` when the reference is empty or the target does not exist.
	 *
	 * The target's list loads once per mapping pass, so mapping N entries
	 * costs one `target.list()`, in dev and in production.
	 */
	lookup<T extends { slug: string }>(target: LookupTarget<T>, ref: string | { id: string } | undefined | null): Promise<T | undefined>;
};

/** Any collection that can list its entries. */
// biome-ignore lint/suspicious/noExplicitAny: any query type.
export type LookupTarget<T> = Pick<Collection<T, any>, "list">;

// biome-ignore lint/complexity/noBannedTypes: an empty query is valid.
export type MarkdownCollectionOptions<E extends { slug: string }, Q = {}> = {
	/** Astro collection name. */
	collection: string;
	/** Maps an entry to the model. */
	map(entry: MarkdownEntry, h: MarkdownHelpers): E | Promise<E>;
	/** Keeps entries matching `q`. Default: keep all. */
	filter?(entry: E, q: Q): boolean;
	/** Orders entries. Default: source order. */
	sort?(a: E, b: E, q: Q): number;
	/** Which raw entries exist. Default: hides `draft: true` in production builds. */
	include?(entry: MarkdownEntry): boolean;
	/**
	 * Collection that `h.terms()` reads labels from. Default "taxonomies".
	 * Must match `markdownSite({ taxonomies })`; `markdownKit` keeps them in sync.
	 */
	taxonomies?: string;
};

const TAXONOMIES = "taxonomies";

/** Default `include`: drafts show in dev, not in production builds. */
export const notDraftInProduction = (entry: MarkdownEntry) => !(import.meta.env.PROD && entry.data.draft === true);

/** Strips Markdown to plain text and cuts it at a word boundary. */
export function plainExcerpt(markdown: string, max = 160): string {
	const text = markdown
		.replace(/^---[\s\S]*?---/, "")
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/^(import|export)\s.*$/gm, "")
		.replace(/<[^>]+>/g, " ")
		.replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
		// A heading ends a sentence, so it does not run into the next paragraph.
		.replace(/^[ \t]{0,3}#{1,6}[ \t]+(.+?)(?:[ \t]+#+)?[ \t]*$/gm, (_, heading: string) =>
			/[.!?:…]$/.test(heading.replace(/[*_~`]+$/, "")) ? heading : `${heading}.`,
		)
		.replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
		.replace(/[*_~`]+/g, "")
		.replace(/\s+/g, " ")
		.trim();
	if (text.length <= max) return text;
	const cut = text.slice(0, max);
	const space = cut.lastIndexOf(" ");
	return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s.,;:!?-]+$/, "")}…`;
}

/** A local image as a ContentImage. Rendered by `Image.astro` via astro:assets. */
export function toImage(img: ImageMetadata | undefined, alt = ""): ContentImage | undefined {
	if (!img) return undefined;
	return { src: img.src, alt, width: img.width, height: img.height, source: { kind: "astro-image", value: img } };
}

/**
 * Production memoization. Markdown data is fixed for the life of a build or a
 * server process in production, so loaded data is kept. In dev, files change
 * under the running server, so nothing is cached.
 */
const CACHE = import.meta.env.PROD;

/** Keeps a promise while CACHE is on; a rejected promise is dropped so the next call retries. */
function memo<T>(cache: Map<string, Promise<T>>, key: string, load: () => Promise<T>): Promise<T> {
	if (!CACHE) return load();
	let hit = cache.get(key);
	if (!hit) {
		hit = load();
		cache.set(key, hit);
		hit.catch(() => cache.delete(key));
	}
	return hit;
}

const taxonomyCache = new Map<string, Promise<Map<string, Term[]>>>();

/** Loads every taxonomy from an Astro collection: `{ id: name, data: { terms } }`. */
function loadTaxonomies(collection = TAXONOMIES): Promise<Map<string, Term[]>> {
	return memo(taxonomyCache, collection, async () => {
		const entries = (await getCollection(collection as never)) as { id: string; data: { terms: Term[] } }[];
		return new Map(entries.map((e) => [e.id, e.data.terms]));
	});
}

/** Helpers for one mapping pass. Taxonomies load once, on first use. */
function createHelpers(taxonomies = TAXONOMIES): MarkdownHelpers {
	let loaded: Promise<Map<string, Term[]>> | undefined;
	// One index per target collection object, for this pass only.
	const indexes = new Map<object, Promise<Map<string, unknown>>>();
	return {
		richText: (entry) => ({ format: "markdown", value: entry }),
		image: ((img: ImageMetadata | undefined, alt?: string) => toImage(img, alt)) as MarkdownHelpers["image"],
		excerpt: (entry, max = 160) => plainExcerpt(entry.body ?? "", max),
		async terms(slugs, taxonomy) {
			if (!slugs?.length) return [];
			loaded ??= loadTaxonomies(taxonomies);
			const known = (await loaded).get(taxonomy) ?? [];
			return slugs
				.map((slug) => known.find((t) => t.slug === slug) ?? { slug, label: slug })
				.sort((a, b) => a.label.localeCompare(b.label));
		},
		async lookup<T extends { slug: string }>(target: LookupTarget<T>, ref: string | { id: string } | undefined | null) {
			const slug = typeof ref === "string" ? ref : ref?.id;
			if (!slug) return undefined;
			let index = indexes.get(target);
			if (!index) {
				index = target.list().then(({ items }) => new Map(items.map((item) => [item.slug, item] as const)));
				indexes.set(target, index);
			}
			return (await index).get(slug) as T | undefined;
		},
	};
}

/**
 * A collection over one Astro content collection. Every entry is mapped, then
 * filtered, sorted and paged in memory. Lookups use the mapped `slug`.
 *
 * In production the mapped list is built once per collection object and reused
 * by every call (`list`, `get`, `slugs`, `count`), so route enumeration maps
 * each file once per build. Returned entries are shared: do not mutate them.
 */
// biome-ignore lint/complexity/noBannedTypes: an empty query is valid.
export function markdownCollection<E extends { slug: string }, Q = {}>(
	opts: MarkdownCollectionOptions<E, Q>,
): Collection<E, Q> {
	const include = opts.include ?? notDraftInProduction;
	// Per collection object, not per collection name: two objects over the same
	// Astro collection can map it differently.
	const cache = new Map<string, Promise<E[]>>();

	function all(): Promise<E[]> {
		return memo(cache, "all", async () => {
			const entries = (await getCollection(opts.collection as never)) as MarkdownEntry[];
			const h = createHelpers(opts.taxonomies);
			return Promise.all(entries.filter(include).map((e) => opts.map(e, h)));
		});
	}

	async function matching(q?: Q): Promise<E[]> {
		const query = (q ?? {}) as Q;
		const base = await all();
		// Always a new array: the cached list is never filtered or sorted in place.
		const items = opts.filter ? base.filter((e) => opts.filter!(e, query)) : [...base];
		if (opts.sort) items.sort((a, b) => opts.sort!(a, b, query));
		return items;
	}

	return {
		async list(q) {
			const items = await matching(q);
			const total = items.length;
			const offset = Math.max(0, q?.offset ?? 0);
			const end = q?.limit === undefined ? total : offset + q.limit;
			return { items: items.slice(offset, end), hasMore: end < total, total };
		},
		async get(slug) {
			return (await all()).find((e) => e.slug === slug);
		},
		async slugs(q) {
			return (await matching(q)).map((e) => e.slug);
		},
		async count(q) {
			return (await matching(q)).length;
		},
	};
}

export type MarkdownSiteOptions = {
	/** Single-entry collection with id "site". Default "site". */
	settings?: string;
	/** One entry per menu. Default "menus". */
	menus?: string;
	/** One entry per taxonomy. Default "taxonomies". Must match `markdownCollection({ taxonomies })`. */
	taxonomies?: string;
};

/** Settings, menus and taxonomies from Astro collections. */
export function markdownSite(opts: MarkdownSiteOptions = {}): Required<Pick<SiteParts, "settings" | "menus" | "taxonomies">> {
	const settings = opts.settings ?? "site";
	const menus = opts.menus ?? "menus";
	const taxonomies = opts.taxonomies ?? TAXONOMIES;
	return {
		settings: {
			async get(): Promise<Partial<SiteSettings>> {
				const entry = (await getEntry(settings as never, "site" as never)) as MarkdownEntry | undefined;
				if (!entry) return {};
				const { title, tagline, logo, logoAlt } = entry.data;
				return { title, tagline, logo: toImage(logo, logoAlt ?? title ?? "") };
			},
		},
		menus: {
			async get(name) {
				const entry = (await getEntry(menus as never, name as never)) as MarkdownEntry | undefined;
				return (entry?.data.items as MenuItem[] | undefined) ?? [];
			},
		},
		taxonomies: {
			async list(name) {
				return (await loadTaxonomies(taxonomies)).get(name) ?? [];
			},
		},
	};
}

/** Renders Markdown rich text and local images. */
export const markdownRenderers: Renderers = {
	richText: { markdown: RichTextRenderer },
	image: { "astro-image": Image },
};

export type MarkdownKitOptions = MarkdownSiteOptions;

/**
 * One config for collections, site parts and renderers, so `h.terms()` and
 * `taxonomies.list()` read the same collection.
 *
 *   const md = markdownKit({ taxonomies: "labels" });
 *   const posts = md.collection<Post, PostQuery>({ collection: "posts", map });
 *   export default defineAdapter<Model>()({ name: "markdown", collections: { posts }, ...md.site, renderers: md.renderers });
 */
export function markdownKit(opts: MarkdownKitOptions = {}) {
	const taxonomies = opts.taxonomies ?? TAXONOMIES;
	return {
		// biome-ignore lint/complexity/noBannedTypes: an empty query is valid.
		collection<E extends { slug: string }, Q = {}>(c: Omit<MarkdownCollectionOptions<E, Q>, "taxonomies">): Collection<E, Q> {
			return markdownCollection<E, Q>({ ...c, taxonomies });
		},
		site: markdownSite({ ...opts, taxonomies }),
		renderers: markdownRenderers,
	};
}
