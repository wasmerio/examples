/**
 * Member access in the content contract.
 *
 * Two models. Sources map into a **source model**: private records that hold a body. Pages read a **public
 * model**: in each gated collection an entry is either `Readable<R>` (the reader may read it, body included) or
 * `Locked<R>` (no body and no rich text at all, by type and by a run-time guard).
 *
 * A preview is not rich text. It is a few plain-text blocks, rendered by its own renderer (theme-core's
 * PreviewText), never by a rich text renderer: so markup, components and embeds of a locked body can never
 * reach a page through it.
 *
 * Fail closed. No request, a prerendered page, a static build, no `canRead`, a `canRead` that throws or returns
 * anything but the three decisions, and an unknown access level: the entry is locked.
 *
 * This file has no run-time imports (plain Node can load it).
 */
import type {
	Collection,
	ContentAdapter,
	ContentContext,
	EntryOf,
	ListResult,
	ModelSpec,
	ContentImage,
	RichText,
	SearchHit,
	SiteSettings,
} from "./types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Who may read an entry. An unknown value is treated as "paid" (see `accessOf`). */
export type Access = "public" | "members" | "paid";

/** What the buyer's `canRead` decides for one reader and one entry. */
export type ReadDecision = "allow" | "deny" | "preview";

/** The entry `canRead` decides about. It has no body: the function cannot leak what it never sees. */
export type AccessSubject = {
	collection: string;
	slug: string;
	access: "members" | "paid";
	ref?: { source: string; collection: string; id: string };
};

/** The reader of one request. EmDash and membership plugins put the signed-in user on `locals`. */
export type Reader = {
	request: Request;
	locals: Record<PropertyKey, unknown>;
	cookies: { get(name: string): { value: string } | undefined };
};

/** The buyer's access check. Asked only on a live server request for a gated entry's own page. */
export type CanRead = (subject: AccessSubject, reader: Reader) => ReadDecision | Promise<ReadDecision>;

/** Why an entry is locked. */
export type LockReason = "static" | "anonymous" | "no-reader" | "denied" | "preview" | "error";

/** Plain text only: no markup, no RichText. Rendered by theme-core's PreviewText, never by a rich text renderer. */
export type PreviewBlock = { type: "paragraph"; text: string } | { type: "heading"; level: 2 | 3; text: string };

/** The public start of a locked entry. `author`: the author wrote it to be shown; `auto`: cut from the body. */
export type Preview = { readonly kind: "preview"; readonly source: "author" | "auto"; readonly blocks: readonly PreviewBlock[] };

/** Top-level keys whose value is or may be RichText (a union such as `string | RichText`) removed. Shallow on purpose: a locked view is built from an allow list (see postAccess), and the runtime guard walks every depth. */
export type NoRichText<E> = { [K in keyof E as [Extract<NonNullable<E[K]>, RichText>] extends [never] ? K : never]: E[K] };

/** An entry the reader may read, body included. */
export type Readable<E> = E & { locked: false };

/** An entry the reader may not read: no body, no edit attributes, no top-level rich text. */
export type Locked<E> = NoRichText<Omit<E, "body" | "edit">> & { locked: true; reason: LockReason; body?: never };

/** What a projection is told about the reader. `showPreview` is false when `canRead` said "deny". */
export type ViewState = { locked: false } | { locked: true; reason: LockReason; showPreview: boolean };

/**
 * The hit a search shows, rebuilt from the view (never the source hit's own title or snippet for a locked view).
 * `image`: the view's own image object, a public field (withAccess keeps it only when it is the view's `image`).
 */
export type PublicHit = { collection: string; slug: string; title: string; excerpt?: string; href: string; image?: ContentImage };

/** How one gated collection maps a source record to its public view. */
export type AccessRule<R, V> = {
	access(record: R): Access;
	project(record: R, state: ViewState): V;
	/**
	 * Required: every shown field of a gated hit comes from the view; `href` is the source hit's, rebuilt from the
	 * slug by the source's own `href`. The source hit is passed only for its `collection` and `href`: its title and
	 * excerpt (a search snippet) may hold locked body text. Build the hit from the public view, as postAccess does.
	 */
	toHit(view: V, hit: SearchHit): PublicHit;
	matches?(view: V, query: string): boolean;
};

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

const ACCESS = new Set<unknown>(["public", "members", "paid"]);
const DECISIONS = new Set<unknown>(["allow", "deny", "preview"]);

/** True for the three decisions only. Anything else (a typo, `true`, `undefined`) locks the entry. */
export function isDecision(value: unknown): value is ReadDecision {
	return DECISIONS.has(value);
}

/** Fail closed: an unknown access level counts as "paid". */
export function accessOf(value: unknown): Access {
	return ACCESS.has(value) ? (value as Access) : "paid";
}

/** True for "members", "paid" and any unknown value. */
export function isGatedAccess(value: unknown): boolean {
	return accessOf(value) !== "public";
}

/** True only for a Preview: kind "preview", a known source, and paragraph or h2/h3 text blocks. */
export function isPreview(value: unknown): value is Preview {
	if (!value || typeof value !== "object") return false;
	const v = value as Record<string, unknown>;
	if (v.kind !== "preview" || (v.source !== "author" && v.source !== "auto") || !Array.isArray(v.blocks)) return false;
	return v.blocks.every((b) => {
		if (!b || typeof b !== "object" || typeof (b as { text?: unknown }).text !== "string") return false;
		const block = b as { type?: unknown; level?: unknown };
		if (block.type === "paragraph") return true;
		return block.type === "heading" && (block.level === 2 || block.level === 3);
	});
}

function isRichTextShape(v: object): boolean {
	return typeof (v as { format?: unknown }).format === "string" && "value" in v;
}

/**
 * Throws when `value` holds, at any depth, a RichText (`{ format, value }`), any key named `body`, or a function
 * (a render callback or getter could hand out the body). `where` names the entry in the message (e.g. "posts/a"),
 * with the key path. Iterative (no depth limit), walks arrays, own enumerable string keys of objects, Map and Set
 * values, and ends on cycles.
 *
 * Out of scope: symbol keys, non-enumerable properties, Map keys and class internals (private fields). A locked
 * view is a plain object built from an allow list (see postAccess); this guard catches mistakes in that list, it
 * does not inspect arbitrary objects.
 */
export function assertNoRichText(value: unknown, where: string): void {
	const seen = new WeakSet<object>();
	const stack: Array<[unknown, string]> = [[value, ""]];
	const fail = (path: string, what: string): never => {
		throw new Error(`A locked view must not hold ${what}: ${where} at ${path || "(root)"}.`);
	};
	while (stack.length) {
		const [v, path] = stack.pop()!;
		if (typeof v === "function") fail(path, "a function");
		if (!v || typeof v !== "object" || v instanceof Date) continue;
		if (seen.has(v)) continue;
		seen.add(v);
		if (isRichTextShape(v)) fail(path, "rich text");
		if (Array.isArray(v)) {
			v.forEach((item, i) => stack.push([item, `${path}[${i}]`]));
		} else if (v instanceof Map) {
			for (const [k, item] of v) stack.push([item, `${path}.get(${String(k)})`]);
		} else if (v instanceof Set) {
			let i = 0;
			for (const item of v) stack.push([item, `${path}{${i++}}`]);
		} else {
			for (const [k, item] of Object.entries(v)) {
				const at = path ? `${path}.${k}` : k;
				if (k === "body") fail(at, "a body");
				stack.push([item, at]);
			}
		}
	}
}

// ---------------------------------------------------------------------------
// Reader-private requests
// ---------------------------------------------------------------------------

/**
 * The flag on `Astro.locals` that says this request's response depends on the reader. A `Symbol.for` key, so
 * theme-core's middleware writes the same flag without importing this package.
 */
export const READER_PRIVATE: unique symbol = Symbol.for("astronomic.content.readerPrivate");

/** What `markReaderPrivate` needs of a page's `Astro` or an endpoint's context. */
export type PrivateTarget = {
	/** `App.Locals`. */
	locals: object;
	cache?: { enabled?: boolean; set(input: false): void };
	response?: { headers: Headers };
};

/**
 * Marks the request reader-private: turns Astro's route cache off for it, sends `Cache-Control: private,
 * no-store`, and makes every later source cache hint of the same request a no-op (`useContent` checks the flag),
 * so nothing can turn the shared cache back on. Astro's `cache.set(hint)` after `set(false)` would.
 */
export function markReaderPrivate(astro: PrivateTarget): void {
	(astro.locals as Record<PropertyKey, unknown>)[READER_PRIVATE] = true;
	if (astro.cache?.enabled) astro.cache.set(false);
	astro.response?.headers.set("Cache-Control", "private, no-store");
}

/** True when this request was marked by `markReaderPrivate` (or theme-core's middleware). */
export function isReaderPrivate(locals: object | undefined): boolean {
	return (locals as Record<PropertyKey, unknown> | undefined)?.[READER_PRIVATE] === true;
}

// ---------------------------------------------------------------------------
// withAccess
// ---------------------------------------------------------------------------

type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

/** Collections whose entry type differs between the models: each must have a rule. */
type GatedKeys<SM, PM> = { [K in keyof PM & keyof SM]: Same<EntryOf<SM[K]>, EntryOf<PM[K]>> extends true ? never : K }[keyof PM &
	keyof SM];

/** A rule for every collection whose entry differs; a collection with the same entry in both models may have one. */
export type AccessRules<SM, PM> = { [K in GatedKeys<SM, PM>]: AccessRule<EntryOf<SM[K]>, EntryOf<PM[K]>> } & {
	[K in Exclude<keyof PM & keyof SM, GatedKeys<SM, PM>>]?: AccessRule<EntryOf<SM[K]>, EntryOf<PM[K]>>;
};

export type AccessOptions<SM, PM> = {
	/** `import.meta.env.CONTENT_OUTPUT` (or Astro's `output`). Only "server" ever asks `canRead`. */
	output: string | undefined;
	canRead?: CanRead;
	collections: AccessRules<SM, PM>;
	/**
	 * The source's search names for model collections, when they differ (e.g. `{ articles: "posts" }` for a model
	 * collection read from EmDash's "articles"). A hit named by a collection the model does not have is dropped.
	 */
	searchAliases?: Record<string, string>;
};

// biome-ignore lint/suspicious/noExplicitAny: rules are checked by AccessRules; at run time any record goes.
type AnyRule = AccessRule<any, any>;
type View = { slug?: unknown; locked?: unknown };

const DECIDED = Symbol.for("astronomic.content.readDecisions");
const WARNED = Symbol.for("astronomic.content.readWarnings");

/** Per request (its locals): one decision per collection and slug. */
function memo<T>(locals: object, key: symbol): Map<string, T> {
	const bag = locals as Record<PropertyKey, unknown>;
	let map = bag[key] as Map<string, T> | undefined;
	if (!map) bag[key] = map = new Map();
	return map;
}

function guardView(view: View | undefined, state: ViewState, where: string): void {
	if (!state.locked || view === undefined) return;
	if (view.locked !== true) throw new Error(`A locked entry was projected as readable: ${where}.`);
	assertNoRichText(view, where);
}

const words = (q: string) => q.toLowerCase().split(/\s+/).filter(Boolean);

/** The default `matches`: every word of the query is in the view's title, excerpt or preview text. */
function defaultMatches(view: unknown, query: string): boolean {
	const v = (view ?? {}) as { title?: unknown; excerpt?: unknown; preview?: unknown };
	const parts = [v.title, v.excerpt].filter((x): x is string => typeof x === "string");
	if (isPreview(v.preview)) parts.push(...v.preview.blocks.map((b) => b.text));
	const text = parts.join(" ").toLowerCase();
	const terms = words(query);
	return terms.length > 0 && terms.every((t) => text.includes(t));
}

/**
 * Turns a source adapter (source model: records with a body) into an adapter of the public model:
 *
 *   export const content = withAccess<SourceModel, PublicModel>()(source, {
 *   	output: import.meta.env.CONTENT_OUTPUT,
 *   	canRead,
 *   	collections: { posts: postAccess() },
 *   });
 *
 * In each gated collection, `list` is always the anonymous view (members and paid entries locked, never asks
 * `canRead`). `get` asks `canRead` only on a live server request (`output: "server"`, an `astro` in the context,
 * not prerendered) and then marks the request reader-private, whatever the decision. Every locked view is checked
 * by `assertNoRichText`. Request search keeps a locked hit only when its public text matches the query, and
 * rebuilds every gated hit from its view. Everything else passes through as the same objects.
 */
export function withAccess<SM extends ModelSpec, PM extends ModelSpec, S extends SiteSettings = SiteSettings>() {
	return (adapter: ContentAdapter<SM, S>, opts: AccessOptions<SM, PM>): ContentAdapter<PM, S> => {
		const { output, canRead } = opts;
		const rules = opts.collections as Record<string, AnyRule | undefined>;
		const sources = adapter.collections as Record<string, Collection<unknown, unknown>>;
		for (const name of Object.keys(rules)) {
			if (!sources[name]) throw new Error(`withAccess: the source has no collection "${name}".`);
		}

		const anonymous = (record: unknown, rule: AnyRule): ViewState =>
			isGatedAccess(rule.access(record))
				? { locked: true, reason: output === "static" ? "static" : "anonymous", showPreview: true }
				: { locked: false };

		async function decide(name: string, slug: string, record: unknown, rule: AnyRule, ctx: ContentContext | undefined) {
			const access = accessOf(rule.access(record));
			if (access === "public") return { locked: false } satisfies ViewState;
			const astro = ctx?.astro;
			if (output !== "server") return anonymous(record, rule);
			if (!astro) return { locked: true, reason: "no-reader", showPreview: true } satisfies ViewState;
			if (astro.isPrerendered) return { locked: true, reason: "static", showPreview: true } satisfies ViewState;
			if (!canRead) return anonymous(record, rule);

			// The response now depends on the reader, whatever the decision.
			markReaderPrivate(astro);
			const decisions = memo<Promise<ReadDecision | "error">>(astro.locals, DECIDED);
			const key = `${name}/${slug}`;
			let pending = decisions.get(key);
			if (!pending) {
				const ref = (record as { ref?: AccessSubject["ref"] }).ref;
				const subject: AccessSubject = {
					collection: name,
					slug,
					access,
					...(ref ? { ref: { source: ref.source, collection: ref.collection, id: ref.id } } : {}),
				};
				const reader: Reader = {
					request: astro.request,
					locals: astro.locals as Record<PropertyKey, unknown>,
					cookies: astro.cookies,
				};
				pending = (async () => {
					try {
						const d = await canRead(subject, reader);
						return isDecision(d) ? d : "error";
					} catch {
						return "error";
					}
				})();
				decisions.set(key, pending);
			}
			const decision = await pending;
			if (decision === "allow") return { locked: false } satisfies ViewState;
			if (decision === "deny") return { locked: true, reason: "denied", showPreview: false } satisfies ViewState;
			if (decision === "preview") return { locked: true, reason: "preview", showPreview: true } satisfies ViewState;
			const warned = memo<true>(astro.locals, WARNED);
			if (!warned.has(key)) {
				warned.set(key, true);
				// Never the error's text: it may hold what the buyer's check knows about the reader.
				console.warn(`[astronomic] canRead failed for ${name}/${slug}; the entry is locked.`);
			}
			return { locked: true, reason: "error", showPreview: true } satisfies ViewState;
		}

		function gated(name: string, col: Collection<unknown, unknown>, rule: AnyRule): Collection<unknown, unknown> {
			const where = (record: unknown, slug?: string) => `${name}/${(record as View)?.slug ?? slug}`;
			return {
				async list(q, ctx) {
					const res = await col.list(q, ctx);
					const items = res.items.map((record) => {
						const state = anonymous(record, rule);
						const view = rule.project(record, state);
						guardView(view, state, where(record));
						return view;
					});
					return { ...res, items } as ListResult<unknown>;
				},
				async get(slug, ctx) {
					const record = await col.get(slug, ctx);
					if (record === undefined) return undefined;
					const state = await decide(name, slug, record, rule, ctx);
					const view = rule.project(record, state);
					guardView(view, state, where(record, slug));
					return view;
				},
				slugs: (q, ctx) => col.slugs(q, ctx),
				...(col.count ? { count: (q: unknown, ctx?: ContentContext) => col.count!(q, ctx) } : {}),
			};
		}

		for (const [from, to] of Object.entries(opts.searchAliases ?? {})) {
			if (rules[from]) throw new Error(`withAccess: searchAliases may not rename the gated collection "${from}".`);
			if (!sources[to]) throw new Error(`withAccess: searchAliases maps "${from}" to "${to}", which the model does not have.`);
		}
		const wrapped: Record<string, Collection<unknown, unknown>> = { ...sources };
		for (const [name, rule] of Object.entries(rules)) if (rule) wrapped[name] = gated(name, sources[name], rule);

		const out = { ...adapter, collections: wrapped } as unknown as ContentAdapter<PM, S>;
		const search = adapter.search;
		if (search) {
			out.search = async (q, ctx) => {
				const hits = await search(q, ctx);
				// Views for hits are always the anonymous ones: no request, so canRead is never asked.
				const anon: ContentContext = { locale: ctx?.locale, cache: ctx?.cache ?? (() => {}) };
				const kept = await Promise.all(
					hits.map(async (source): Promise<SearchHit | undefined> => {
						// The model's name for the hit's collection; a name the model does not have fails closed.
						const name = opts.searchAliases?.[source.collection] ?? source.collection;
						if (!Object.hasOwn(wrapped, name)) return undefined;
						// A name that has a rule is never renamed past it (drop when in doubt).
						if (name !== source.collection && rules[source.collection]) return undefined;
						const hit = name === source.collection ? source : { ...source, collection: name };
						const rule = rules[name];
						if (!rule) return hit;
						const view = (await wrapped[hit.collection].get(hit.slug, anon)) as View | undefined;
						if (!view || view.slug !== hit.slug) return undefined;
						if (view.locked !== false && !(rule.matches ?? defaultMatches)(view, q)) return undefined;
						const h = rule.toHit(view, hit);
						if (h.collection !== hit.collection || h.slug !== hit.slug) return undefined;
						return {
							collection: h.collection,
							slug: h.slug,
							title: h.title,
							...(h.excerpt !== undefined ? { excerpt: h.excerpt } : {}),
							href: h.href,
							// Only the view's own image (a public field), never one carried over from the source hit.
							...(h.image !== undefined && h.image === (view as { image?: unknown }).image ? { image: h.image } : {}),
						};
					}),
				);
				return kept.filter((h): h is SearchHit => h !== undefined);
			};
		}
		return out;
	};
}
