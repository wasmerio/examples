/**
 * Private responses: a response that may differ by reader is never stored by a shared cache.
 *
 * Added by `privateResponses()` (`@astronomic/theme-core/astro`) with order "post". For every on-demand request:
 *
 * - Before the page: an EmDash edit-mode cookie (`emdash-edit-mode=true`) or a preview token (`?_preview=`) marks
 *   the request reader-private (the flag `markReaderPrivate` in @astronomic/content sets), so `useContent` drops
 *   every source cache hint from the start: an editor's draft data never reaches the route cache.
 * - After the page: a marked request (by the signals above, or by a page that depends on the reader) gets
 *   `cache.set(false)` and `Cache-Control: private, no-store`, and loses every CDN and edge cache header
 *   (`CDN-Cache-Control`, `Surrogate-*`, `Cache-Tag` and the hosts' own), whatever the page set, on every content type (HTML,
 *   XML, PNG, JSON). This is the last word: a direct `Astro.cache.set(...)` or a later header cannot undo it.
 *
 * Known limit: Astro's route cache answers a hit before any middleware runs, so an editor or a member can receive
 * a warm public copy of a page (stale public data, never private data). This middleware closes the other direction:
 * no private response is ever stored.
 *
 * Prerendered pages are left alone (no request at build time). No run-time imports: plain Node can load it.
 */

/** The same key as @astronomic/content's `READER_PRIVATE` (a test checks they match). */
export const PRIVATE_FLAG: unique symbol = Symbol.for("astronomic.content.readerPrivate");

const PRIVATE = "private, no-store";

/**
 * Headers that tell a CDN or edge cache to store a response, or tag it, apart from `Cache-Control`. A private
 * response loses every one of them, so no shared cache keeps it whatever the host reads.
 */
const SHARED_CACHE_HEADERS = [
	"CDN-Cache-Control",
	"Surrogate-Control",
	"Surrogate-Key",
	"Cache-Tag",
	"Vercel-CDN-Cache-Control",
	"Vercel-Cache-Tag",
	"Netlify-CDN-Cache-Control",
	"Netlify-Cache-Tag",
	"Netlify-Vary",
	"Cloudflare-CDN-Cache-Control",
	"Edge-Control",
	"Edge-Cache-Tag",
	"X-Accel-Expires",
];

type Context = {
	url: URL;
	locals: object;
	isPrerendered?: boolean;
	cookies?: { get(name: string): { value: string } | undefined };
	cache?: { enabled?: boolean; set(input: false): void };
};

export async function privateResponse(context: Context, next: () => Promise<Response>): Promise<Response> {
	if (context.isPrerendered) return next();
	const locals = context.locals as Record<PropertyKey, unknown>;
	if (context.cookies?.get("emdash-edit-mode")?.value === "true" || context.url.searchParams.has("_preview")) {
		locals[PRIVATE_FLAG] = true;
	}
	const response = await next();
	if (locals[PRIVATE_FLAG] !== true) return response;
	if (context.cache?.enabled) context.cache.set(false);
	const edge = SHARED_CACHE_HEADERS.filter((name) => response.headers.has(name));
	if (response.headers.get("Cache-Control") === PRIVATE && !edge.length) return response;
	const apply = (headers: Headers) => {
		headers.set("Cache-Control", PRIVATE);
		for (const name of edge) headers.delete(name);
	};
	try {
		apply(response.headers);
		return response;
	} catch {
		// Immutable headers (e.g. Response.redirect): copy the response.
		const copy = new Response(response.body, response);
		apply(copy.headers);
		return copy;
	}
}

export const onRequest = privateResponse;
