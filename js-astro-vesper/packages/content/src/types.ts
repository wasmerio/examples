/**
 * Content adapter contract. Model-independent: no CMS imports, no product
 * collections. Products define their model; adapters map sources into it.
 *
 * Planned home: `@astronomic/content`.
 */
import type { AstroGlobal } from "astro";

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

/**
 * An image. `src`/`alt` work everywhere. `source` keeps the source's native
 * value, tagged with `kind`, so the matching image renderer can do responsive
 * or local optimization. Without a renderer for `kind`, a plain <img> is used.
 */
export type ContentImage = {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	source?: { kind: string; value: unknown };
};

/**
 * Rich text in a named format ("markdown", "portable-text", "html", ...).
 * The renderer registered for `format` renders it.
 */
export type RichText = { format: string; value: unknown };

export type Term = { slug: string; label: string };

export type MenuItem = {
	label: string;
	href: string;
	target?: string;
	children?: MenuItem[];
};

export type SiteSettings = { title: string; tagline?: string; logo?: ContentImage };

export type Seo = {
	title?: string;
	description?: string;
	image?: string;
	canonical?: string;
	/** "Hide from search engines": the page renders robots noindex and stays out of sitemaps and the search index. */
	noindex?: boolean;
};

/** A search hit. `image`: the entry's public picture (a gated hit's comes from its public view only). */
export type SearchHit = { collection: string; slug: string; title: string; excerpt?: string; href: string; image?: ContentImage };

/** Optional per-entry extras. Pages may use them; they must never be required. */
export type EntryMeta = {
	/** Where the entry came from, e.g. for EmDash page contributions. */
	ref?: { source: string; collection: string; id: string };
	/** Visual-editing attributes per model field. Spread one: `{...post.edit?.title}`. */
	edit?: Record<string, Record<string, unknown>>;
	seo?: Seo;
};

// ---------------------------------------------------------------------------
// Model and collections
// ---------------------------------------------------------------------------

/** Names `useContent()` uses itself. A model cannot use them for collections. */
export type ReservedName =
	| "adapter"
	| "renderers"
	| "hooks"
	| "components"
	| "settings"
	| "menu"
	| "terms"
	| "search";

/** One collection in a product model: its entry type and its query type. */
export type CollectionSpec = { entry: { slug: string }; query?: object };

/** A product model: `{ posts: { entry: Post; query: PostQuery }, ... }`. */
export type ModelSpec = Record<string, CollectionSpec> & { [K in ReservedName]?: never };

export type EntryOf<S> = S extends { entry: infer E } ? E : never;
// biome-ignore lint/complexity/noBannedTypes: an empty query is valid.
export type QueryOf<S> = S extends { query: infer Q } ? Q : {};

export type PageQuery = {
	limit?: number;
	offset?: number;
	/**
	 * Each list entry's `seo` carries `noindex` (for the sitemap, the feed and the search index). Off by default:
	 * a source may need a lookup per entry for it (EmDash does).
	 */
	seo?: boolean;
};

/** One page of results. `hasMore` is always set; `total` only if the source knows it cheaply. */
export type ListResult<T> = { items: T[]; hasMore: boolean; total?: number };

/**
 * Per-request (or per-build) context. `useContent(Astro)` creates it.
 * Adapters may ignore it.
 */
export type ContentContext = {
	/** The current request's Astro global. Undefined in `getStaticPaths`. */
	astro?: AnyAstro;
	/** The current locale, if the site uses Astro i18n. Reserved; not used yet. */
	locale?: string;
	/** Forward a source cache hint to Astro's route cache (no-op if disabled). */
	cache(hint: unknown): void;
};

/**
 * A collection. Adapters throw on backend errors. `get` returns `undefined`
 * only when the entry does not exist.
 */
// biome-ignore lint/complexity/noBannedTypes: an empty query is valid.
export type Collection<E, Q = {}> = {
	list(q?: Q & PageQuery, ctx?: ContentContext): Promise<ListResult<E>>;
	/** Looks up by the entry's route `slug` (the one the model exposes). */
	get(slug: string, ctx?: ContentContext): Promise<E | undefined>;
	/** Every route slug matching `q`, for `getStaticPaths`. Avoid loading full entries. */
	slugs(q?: Q, ctx?: ContentContext): Promise<string[]>;
	/** Number of entries matching `q`. Defaults to `slugs(q).length`. */
	count?(q?: Q, ctx?: ContentContext): Promise<number>;
};

export type Collections<M> = {
	[K in keyof M]: Collection<EntryOf<M[K]>, QueryOf<M[K]>>;
};

// ---------------------------------------------------------------------------
// The adapter
// ---------------------------------------------------------------------------

// biome-ignore lint/suspicious/noExplicitAny: accept any page's or component's Astro global.
export type AnyAstro = AstroGlobal<any, any, any>;

// biome-ignore lint/suspicious/noExplicitAny: Astro components accept any props.
export type AstroComponent = (props: any) => any;

/** Props the `hooks` components receive. */
export type PageMeta = {
	title: string;
	pageTitle: string;
	description?: string;
	image?: string;
	canonical?: string;
	/** The page's own URL for `og:url`. */
	url?: string;
	/** `og:type`. */
	type?: "website" | "article";
	/** `og:image:alt`. */
	imageAlt?: string;
	/** The RSS feed for `<link rel="alternate">`. */
	feed?: { title: string; href: string };
	siteName: string;
	ref?: { source: string; collection: string; id: string; slug?: string };
	/** A locked entry's page; hooks must not load the entry by its identity. Never rendered. */
	locked?: true;
	/**
	 * The page's JSON-LD graph, set only when the product layout renders it (`baseMeta` lists "jsonld"): with a public
	 * origin, a non-empty graph and no noindex. The one source the layout's script is written from.
	 */
	jsonLd?: { "@context": "https://schema.org"; "@graph": readonly { "@type": string; [key: string]: unknown }[] };
	/**
	 * The tags the product layout already rendered, e.g. ["description",
	 * "canonical", "og:title"]. Hooks must not render these again; anything
	 * else (like a source's default og:image) they may add.
	 */
	baseMeta: string[];
};

export type Renderers = {
	/** By `RichText.format`. Props: `{ value: RichText }`. */
	richText: Record<string, AstroComponent>;
	/**
	 * By `ContentImage.source.kind`. Props: `{ image: ContentImage, priority?, class?, widths?, sizes?, style? }`.
	 * `widths` (srcset widths) and `sizes` are hints; a renderer may ignore `widths`. `style` (a focal point's
	 * object-position) goes on the <img> when set.
	 */
	image?: Record<string, AstroComponent>;
};

export type SiteParts<S extends SiteSettings = SiteSettings> = {
	settings?: { get(ctx?: ContentContext): Promise<Partial<S>> };
	menus?: { get(name: string, ctx?: ContentContext): Promise<MenuItem[]> };
	taxonomies?: { list(name: string, ctx?: ContentContext): Promise<Term[]> };
	/** Needs server output: a static build has no request to search with. */
	search?: (q: string, ctx?: ContentContext) => Promise<SearchHit[]>;
};

export type ContentAdapter<M, S extends SiteSettings = SiteSettings> = SiteParts<S> & {
	name: string;
	collections: Collections<M>;
	renderers: Renderers;
	/**
	 * Additive page hooks (analytics, plugin output, edit toolbars). The
	 * product always renders its own title and meta tags; hooks only add.
	 * Props: `{ page: PageMeta }`.
	 */
	hooks?: { Head?: AstroComponent; BodyStart?: AstroComponent; BodyEnd?: AstroComponent };
	/** Source-managed layout pieces. Props: `{ name: string }`. Pages fall back when absent. */
	components?: { WidgetArea?: AstroComponent };
};
