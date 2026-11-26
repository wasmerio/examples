/** Builds the request-bound `useContent(Astro)` for a product. */
import type {
	AnyAstro,
	Collection,
	ContentAdapter,
	ContentContext,
	EntryOf,
	MenuItem,
	ListResult,
	ModelSpec,
	PageQuery,
	QueryOf,
	SearchHit,
	SiteSettings,
	Term,
} from "./types";
import { isReaderPrivate } from "./access";

// biome-ignore lint/complexity/noBannedTypes: an empty query is valid.
export type BoundCollection<E, Q = {}> = {
	list(q?: Q & PageQuery): Promise<ListResult<E>>;
	get(slug: string): Promise<E | undefined>;
	slugs(q?: Q): Promise<string[]>;
	count(q?: Q): Promise<number>;
};

export type Content<M, S extends SiteSettings = SiteSettings> = {
	[K in keyof M]: BoundCollection<EntryOf<M[K]>, QueryOf<M[K]>>;
} & {
	adapter: ContentAdapter<M, S>;
	renderers: ContentAdapter<M, S>["renderers"];
	hooks: NonNullable<ContentAdapter<M, S>["hooks"]>;
	components: NonNullable<ContentAdapter<M, S>["components"]>;
	/** Source settings over `defaults`. Empty values fall back. */
	settings(): Promise<S>;
	/** Empty when the source has no menus. */
	menu(name: string): Promise<MenuItem[]>;
	/** Empty when the source has no taxonomies. */
	terms(taxonomy: string): Promise<Term[]>;
	/** Undefined when the source has no search. */
	search?: (q: string) => Promise<SearchHit[]>;
};

function bind<E, Q>(col: Collection<E, Q>, ctx: ContentContext): BoundCollection<E, Q> {
	return {
		list: (q) => col.list(q, ctx),
		get: (slug) => col.get(slug, ctx),
		slugs: (q) => col.slugs(q, ctx),
		count: async (q) => (col.count ? col.count(q, ctx) : (await col.slugs(q, ctx)).length),
	};
}

/**
 * Binds an adapter once. The product's `src/content/index.ts` does:
 *
 *   export const useContent = createUseContent<Model>(source, { title: "My Site" });
 *
 * Pages call `useContent(Astro)`; `getStaticPaths` calls `useContent()`.
 */
export function createUseContent<M extends ModelSpec, S extends SiteSettings = SiteSettings>(
	adapter: ContentAdapter<M, S>,
	defaults: S,
) {
	// Settings and menus are read by the layout, shared sections and the page,
	// each with its own `useContent(Astro)`. They are memoized per request
	// (keyed by the request object, so never shared across requests or across
	// pages of a static build). Without `Astro` (getStaticPaths) nothing is kept.
	const perRequest = new WeakMap<object, Map<string, Promise<unknown>>>();
	function once<T>(astro: AnyAstro | undefined, key: string, load: () => Promise<T>): Promise<T> {
		const request = astro?.request as object | undefined;
		if (!request) return load();
		let memo = perRequest.get(request);
		if (!memo) perRequest.set(request, (memo = new Map()));
		let hit = memo.get(key) as Promise<T> | undefined;
		if (!hit) {
			hit = load();
			memo.set(key, hit);
			// A failed load is not kept, so a later call can retry.
			hit.catch(() => memo!.delete(key));
		}
		return hit;
	}

	return function useContent(astro?: AnyAstro): Content<M, S> {
		const ctx: ContentContext = {
			astro,
			locale: astro?.currentLocale,
			// Dropped once the request is reader-private (markReaderPrivate): a later hint would turn the route
			// cache back on for a page that depends on the reader.
			cache(hint) {
				if (hint && astro?.cache?.enabled && !isReaderPrivate(astro.locals)) astro.cache.set(hint as never);
			},
		};
		const collections = Object.fromEntries(
			Object.entries(adapter.collections).map(([name, col]) => [name, bind(col as Collection<unknown, unknown>, ctx)]),
		);
		return {
			...collections,
			adapter,
			renderers: adapter.renderers,
			hooks: adapter.hooks ?? {},
			components: adapter.components ?? {},
			settings: () =>
				once(astro, "settings", async () => {
					const got = Object.entries((await adapter.settings?.get(ctx)) ?? {}).filter(
						([, v]) => v !== undefined && v !== null && v !== "",
					);
					return { ...defaults, ...Object.fromEntries(got) } as S;
				}),
			menu: (name) => once(astro, `menu:${name}`, async () => (await adapter.menus?.get(name, ctx)) ?? []),
			async terms(taxonomy) {
				return (await adapter.taxonomies?.list(taxonomy, ctx)) ?? [];
			},
			search: adapter.search ? (q) => adapter.search!(q, ctx) : undefined,
		} as Content<M, S>;
	};
}
