/**
 * Keeps anonymous callers and non-editors of EmDash's public search endpoints away from gated collections.
 *
 * EmDash indexes searchable fields of every entry, so a members post's body words are in its full-text index.
 * `/_emdash/api/search` resolves the session user; `/_emdash/api/search/suggest` resolves none. Both are public.
 *
 * Rules (GET and HEAD only; anything else goes on to EmDash), for `/_emdash/api/search` and every path under it
 * (decoded, lower case, slashes collapsed; a path that cannot be decoded is refused):
 * - Outside `/suggest`, a user with role 20 or more (`content:read_drafts`, a contributor) may search anything.
 * - A repeated `collections` param is refused (EmDash reads the last one, and a blank one means every collection).
 * - Otherwise the `collections` param (split on commas, trimmed, empty names dropped) must name only
 *   ungated collections. No names at all means "every searchable collection" to EmDash: refused. Names are
 *   compared without case (EmDash does not lowercase them, but SQLite table names ignore case): fail closed.
 * - Paths are read under the site's base path (`base` in astro.config.mjs); doubled and trailing slashes do not
 *   skip the guard.
 * - A refusal is a 403 in EmDash's error shape, `private, no-store`.
 *
 * Added by `emdashAccess()` (`@astronomic/content/emdash/access`) with order "post", so EmDash's auth middleware
 * (order "pre") has set `locals.user` before it runs.
 */
import type { MiddlewareHandler } from "astro";

const SEARCH = "/_emdash/api/search";
const SUGGEST = "/_emdash/api/search/suggest";
/** `content:read_drafts` needs `Role.CONTRIBUTOR` (@emdash-cms/auth rbac). */
const EDITOR_ROLE = 20;

type GuardContext = { request: Request; url: URL; locals: object };

function forbidden(): Response {
	return new Response(
		JSON.stringify({ success: false, error: { code: "FORBIDDEN", message: "Search of member posts is not public." } }),
		{ status: 403, headers: { "Content-Type": "application/json", "Cache-Control": "private, no-store" } },
	);
}

/** The guard's logic, pure: `gated` is the list of gated collection names. */
export function guardSearch(
	context: GuardContext,
	next: () => Promise<Response>,
	gated: readonly string[],
	{ base = "/" }: { base?: string } = {},
): Promise<Response> {
	const method = context.request.method.toUpperCase();
	if (method !== "GET" && method !== "HEAD") return next();
	// Compared on the decoded path (an encoded slash too), in lower case, with doubled and trailing slashes gone:
	// no spelling of the URL reaches the endpoints unchecked. A path that cannot be decoded is refused.
	let decoded: string;
	try {
		decoded = decodeURIComponent(context.url.pathname);
	} catch {
		return Promise.resolve(forbidden());
	}
	const full = decoded.toLowerCase().replace(/\/{2,}/g, "/").replace(/\/+$/, "");
	// The site's base path (`import.meta.env.BASE_URL`) comes off first; the bare path is guarded too (fail closed).
	const prefix = base.toLowerCase().replace(/\/+$/, "");
	const path = prefix && full.startsWith(`${prefix}/`) ? full.slice(prefix.length) : full;
	const under = (route: string) => path === route || path.startsWith(`${route}/`);
	// Every sub-path of the search API gets the same check, not only the two known routes.
	if (!under(SEARCH)) return next();

	const role = (context.locals as { user?: { role?: unknown } }).user?.role;
	if (!under(SUGGEST) && typeof role === "number" && role >= EDITOR_ROLE) return next();

	// EmDash keeps the last of repeated params, and a blank last one means every collection: refuse repeats.
	const values = context.url.searchParams.getAll("collections");
	if (values.length > 1) return Promise.resolve(forbidden());
	const names = values
		.flatMap((v) => v.split(","))
		.map((n) => n.trim().toLowerCase())
		.filter(Boolean);
	const closed = new Set(gated.map((n) => n.toLowerCase()));
	if (names.length === 0 || names.some((n) => closed.has(n))) return Promise.resolve(forbidden());
	return next();
}

export const onRequest: MiddlewareHandler = (context, next) => {
	const gated = import.meta.env.ASTRONOMIC_GATED_COLLECTIONS as unknown;
	if (!Array.isArray(gated)) throw new Error("search-guard: no gated collections. Add emdashAccess({ collections }) to the integrations.");
	return guardSearch(context, next, gated, { base: import.meta.env.BASE_URL });
};

export default onRequest;
