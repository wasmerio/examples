/**
 * Route helpers every theme shares.
 *
 * Every dynamic route exports `getStaticPaths`. Static builds (Markdown) use
 * it to prerender; server builds (EmDash) ignore it and render per request.
 * These helpers take slugs and counts, never full entries. Page size and the
 * route's param name are the theme's, so they are arguments.
 */

/** `undefined` → page 1, `"2"` → 2. `null` for anything that is not a page number ≥ 2. */
export function parsePage(param: string | undefined): number | null {
	if (param === undefined || param === "") return 1;
	if (!/^[1-9]\d*$/.test(param)) return null;
	const n = Number(param);
	return n >= 2 ? n : null;
}

/** Href for page `n` under `base` (page 1 is the bare `base`). */
export function pageHref(base: string, n: number) {
	return n <= 1 ? base : `${base.replace(/\/$/, "")}/${n}`;
}

/** Page numbers 2..last for `total` items (page 1 is the bare URL). */
export function extraPages(total: number, perPage: number): string[] {
	return Array.from({ length: Math.max(0, Math.ceil(total / perPage) - 1) }, (_, i) => String(i + 2));
}

/** `getStaticPaths` for pages 2..last of one list. `param` is the route's file name: `[n]` → "n". */
export function pagedPaths(total: number, { perPage, param }: { perPage: number; param: string }) {
	return extraPages(total, perPage).map((p) => ({ params: { [param]: p } }));
}

/**
 * `getStaticPaths` for paged term lists. `first: true` adds page 1 with the param undefined
 * (a rest route, `[...page]`); `first: false` leaves it to its own route.
 */
export function termPagePaths(
	terms: { slug: string; count: number }[],
	{ perPage, param, first }: { perPage: number; param: string; first: boolean },
) {
	return terms.flatMap((t) =>
		[...(first ? [undefined] : []), ...extraPages(t.count, perPage)].map((p) => ({ params: { slug: t.slug, [param]: p } })),
	);
}

/** `getStaticPaths` for a `[slug]` route. */
export function slugParams(slugs: readonly string[]) {
	return slugs.map((slug) => ({ params: { slug } }));
}

/**
 * Terms with their counts, in order, without empty ones: an empty term gets
 * no filter and no page. `count` may be async; all run at once.
 */
export async function withCounts<T>(terms: readonly T[], count: (term: T) => number | Promise<number>): Promise<(T & { count: number })[]> {
	const counts = await Promise.all(terms.map((t) => count(t)));
	return terms.map((t, i) => ({ ...t, count: counts[i] })).filter((t) => t.count > 0);
}

/** The page's path without a trailing slash (`/` stays `/`). */
export function currentPath(url: URL) {
	return url.pathname.replace(/\/$/, "") || "/";
}

/** True when `href` is the current page or a section that contains it. */
export function isCurrentPath(current: string, href: string): boolean {
	if (!href.startsWith("/")) return false;
	const target = href.replace(/\/$/, "") || "/";
	if (target === "/") return current === "/";
	return current === target || current.startsWith(`${target}/`);
}

/**
 * The trimmed `q` of a request. Empty on a prerendered page, which has no
 * query. It reads any page's `q`: a caller that searches only on its search
 * page checks the path itself.
 */
export function searchQuery({ isPrerendered, url }: { isPrerendered: boolean; url: URL }) {
	return isPrerendered ? "" : (url.searchParams.get("q") ?? "").trim();
}

/**
 * The not-found answer for a root route (`[slug]`, `[...section]`) whose segment has no entry: a rewrite to the
 * not-found page. When the segment is the not-found page's own (`/404` with no `404.astro`, so this route caught it),
 * a plain 404 instead: a rewrite would come back to this route and loop (a server build answers 508).
 * `return notFound(Astro, slug)`.
 */
export function notFound(astro: { rewrite(path: string): Promise<Response> }, segment: string | undefined, path = "/404"): Response | Promise<Response> {
	if (segment !== undefined && segment.replace(/^\/+|\/+$/g, "") === path.replace(/^\/+|\/+$/g, "")) {
		return new Response(null, { status: 404, statusText: "Not found" });
	}
	return astro.rewrite(path);
}
