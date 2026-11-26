/** Helpers customers use to build, override and mix adapters. */
import type {
	AstroComponent,
	Collection,
	Collections,
	ContentAdapter,
	EntryOf,
	ModelSpec,
	QueryOf,
	Renderers,
	SiteParts,
	SiteSettings,
} from "./types";

/**
 * Type-checks an adapter against a model. Returns it unchanged. The model
 * cannot use names that `useContent()` reserves (`settings`, `search`, ...).
 */
export function defineAdapter<M extends ModelSpec, S extends SiteSettings = SiteSettings>() {
	return <A extends ContentAdapter<M, S>>(adapter: A): A => adapter;
}

// ---------------------------------------------------------------------------
// extend
// ---------------------------------------------------------------------------

/** Marks an optional part for removal in `extend`: `{ hooks: { Head: remove } }`. */
export const remove: unique symbol = Symbol("astronomic.content.remove");
export type Remove = typeof remove;

type Whole<T> = NonNullable<T> | Remove;

/**
 * What `extend` accepts. Written against the contract, not the base object:
 * - Collections: replace single methods. Collections cannot be removed.
 * - Renderers: add or replace by format/kind.
 * - Optional capabilities: replace with a COMPLETE value, or `remove`.
 * - `undefined` means "no change".
 */
export type AdapterOverrides<M, S extends SiteSettings = SiteSettings> = {
	name?: string;
	collections?: { [K in keyof M]?: Partial<Collection<EntryOf<M[K]>, QueryOf<M[K]>>> };
	renderers?: { richText?: Record<string, AstroComponent>; image?: Record<string, AstroComponent | Remove> };
	settings?: Whole<SiteParts<S>["settings"]>;
	menus?: Whole<SiteParts<S>["menus"]>;
	taxonomies?: Whole<SiteParts<S>["taxonomies"]>;
	search?: Whole<SiteParts<S>["search"]>;
	hooks?: { Head?: Whole<AstroComponent>; BodyStart?: Whole<AstroComponent>; BodyEnd?: Whole<AstroComponent> };
	components?: { WidgetArea?: Whole<AstroComponent> };
};

/** Shallow-merges one level; `remove` deletes, `undefined` keeps. */
function mergeLevel<T extends object>(base: T | undefined, over: object | undefined): T {
	const out: Record<string, unknown> = { ...base };
	for (const [k, v] of Object.entries(over ?? {})) {
		if (v === undefined) continue;
		if (v === remove) delete out[k];
		else out[k] = v;
	}
	return out as T;
}

/**
 * Overrides parts of an adapter:
 *
 *   export default extend<Model>()(base, {
 *     collections: { posts: { list: myList } },
 *     hooks: { BodyStart: remove },
 *   });
 */
export function extend<M extends ModelSpec, S extends SiteSettings = SiteSettings>() {
	return (base: ContentAdapter<M, S>, over: AdapterOverrides<M, S>): ContentAdapter<M, S> => {
		const out = mergeLevel<ContentAdapter<M, S>>(base, {
			name: over.name,
			settings: over.settings,
			menus: over.menus,
			taxonomies: over.taxonomies,
			search: over.search,
		});
		const collections: Record<string, unknown> = { ...base.collections };
		for (const [name, methods] of Object.entries(over.collections ?? {})) {
			if (!(name in collections)) throw new Error(`extend(): unknown collection "${name}".`);
			collections[name] = mergeLevel(collections[name] as object, methods as object);
		}
		out.collections = collections as Collections<M>;
		out.renderers = {
			richText: mergeLevel(base.renderers.richText, over.renderers?.richText),
			image: mergeLevel(base.renderers.image, over.renderers?.image),
		};
		if (over.hooks) out.hooks = mergeLevel(base.hooks, over.hooks);
		if (over.components) out.components = mergeLevel(base.components, over.components);
		return out;
	};
}

// ---------------------------------------------------------------------------
// compose
// ---------------------------------------------------------------------------

// biome-ignore lint/suspicious/noExplicitAny: any adapter can be a part.
type AnyAdapter = ContentAdapter<any, any>;

/** Some collections taken from one adapter, together with that adapter's renderers. */
export type ComposePart<C> = { name: string; collections: C; renderers: Renderers };

/**
 * Takes named collections from an adapter. Its renderers come along, so the
 * entries render with their own source's renderer.
 *
 *   from(shopify, ["products"])
 */
export function from<A extends AnyAdapter, const K extends readonly (keyof A["collections"] & string)[]>(
	adapter: A,
	names: K,
): ComposePart<Pick<A["collections"], K[number]>> {
	const collections: Record<string, unknown> = {};
	for (const name of names) {
		const col = adapter.collections[name];
		if (!col) throw new Error(`from(): "${adapter.name}" has no collection "${name}".`);
		collections[name] = col;
	}
	return { name: adapter.name, collections: collections as Pick<A["collections"], K[number]>, renderers: adapter.renderers };
}

/** Merges renderer registries. A key in `chosen` wins; any other conflict is an error. */
export function mergeRenderers(chosen: Partial<Renderers> | undefined, ...all: Renderers[]): Renderers {
	const out = { richText: { ...chosen?.richText }, image: { ...chosen?.image } } as Required<Renderers>;
	for (const kind of ["richText", "image"] as const) {
		const decided = new Set(Object.keys(chosen?.[kind] ?? {}));
		for (const r of all) {
			for (const [key, component] of Object.entries(r[kind] ?? {})) {
				if (decided.has(key)) continue;
				if (out[kind][key] && out[kind][key] !== component) {
					throw new Error(`compose(): two different ${kind} renderers for "${key}". Choose one in \`renderers\`.`);
				}
				out[kind][key] = component;
			}
		}
	}
	return out;
}

/** Keys whose value is really present (not optional, not possibly undefined). */
type PresentKeys<T> = { [K in keyof T]-?: undefined extends T[K] ? never : K }[keyof T];
type PartKeys<P> = P extends ComposePart<infer C> ? PresentKeys<C> : never;
type Missing<M, B, P> = Exclude<keyof M, PresentKeys<B> | PartKeys<P>>;

/**
 * Mixes sources. Collections come from `base` unless a part replaces them.
 * Settings, menus, taxonomies, search, hooks and components come from `base`.
 * Renderers merge from `base` and every part; `renderers` settles conflicts.
 *
 *   compose<Model>()({
 *     base: markdownSource,
 *     parts: [from(emdashSource, ["projects"])],
 *   });
 *
 * Fails to type-check, and throws, if a model collection is missing.
 */
export function compose<M extends ModelSpec, S extends SiteSettings = SiteSettings>() {
	return <B extends Partial<Collections<M>>, const P extends readonly ComposePart<Partial<Collections<M>>>[] = []>(
		opts: {
			base: Omit<ContentAdapter<M, S>, "collections"> & { collections: B };
			parts?: P;
			/** Settles renderer conflicts; wins over `base` and `parts`. */
			renderers?: Partial<Renderers>;
			name?: string;
			/** Model collection names, for the runtime completeness check. Defaults to base + parts. */
			expect?: (keyof M & string)[];
		} & ([Missing<M, B, P[number]>] extends [never] ? unknown : { missingCollections: Missing<M, B, P[number]> }),
	): ContentAdapter<M, S> => {
		const parts = opts.parts ?? [];
		const collections: Record<string, unknown> = { ...opts.base.collections };
		for (const part of parts) Object.assign(collections, part.collections);
		for (const [name, col] of Object.entries(collections)) {
			if (!col) throw new Error(`compose(): collection "${name}" is undefined.`);
		}
		for (const name of opts.expect ?? []) {
			if (!collections[name]) throw new Error(`compose(): collection "${name}" is missing.`);
		}
		return {
			...opts.base,
			name: opts.name ?? [opts.base.name, ...parts.map((p) => p.name)].join("+"),
			collections: collections as Collections<M>,
			renderers: mergeRenderers(opts.renderers, opts.base.renderers, ...parts.map((p) => p.renderers)),
		};
	};
}
