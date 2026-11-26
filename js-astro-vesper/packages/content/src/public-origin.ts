/**
 * The site's public origin, for every absolute URL a page, feed, sitemap or
 * share card makes. One resolver, so all of them (and EmDash's own SEO URLs)
 * agree. No imports: Node-loadable, safe in any runtime.
 *
 * Order: on a server build, at request time, `EMDASH_SITE_URL` then
 * `SITE_URL` from the runtime environment (EmDash's own order; behind a proxy
 * the request URL is internal); then `site` from astro.config.mjs (fixed at
 * build); then the request's origin. A static build uses `site`.
 *
 * A production server treats a placeholder `site` (astro.config.mjs's default
 * when SITE_URL is not set) as unset: it uses the request's origin and logs one
 * line asking for SITE_URL, because a placeholder would point every canonical,
 * feed and share image at a site that is not this one. `astro dev` and static
 * builds keep `site` as it is. `declaredOrigin` gives the address as configured.
 * The request's origin is `Astro.url`'s: `localhost` and the port unless Astro's
 * `security.allowedDomains` names the host.
 */
export type PublicOriginInput = {
	/** `Astro.site` (astro.config.mjs `site`). */
	site?: string | URL;
	/** The request URL (`Astro.url`). */
	url?: string | URL;
	/** The build output (`import.meta.env.CONTENT_OUTPUT`). */
	output?: string;
	/** The runtime environment. Default `process.env` where there is one. */
	env?: Record<string, string | undefined>;
	/** Where the one line asking for SITE_URL goes. Default `console.warn`. */
	warn?: (text: string) => void;
};

/** The origin of an http(s) URL, or undefined. */
function httpOrigin(value: string | URL | undefined): string | undefined {
	if (!value) return undefined;
	try {
		const url = new URL(value);
		return url.protocol === "http:" || url.protocol === "https:" ? url.origin : undefined;
	} catch {
		return undefined;
	}
}

/** The origin the runtime environment names, on a server build. */
function runtimeOrigin({ output, env }: PublicOriginInput): string | undefined {
	if (output !== "server") return undefined;
	const vars = env ?? (typeof process !== "undefined" ? process.env : {});
	return httpOrigin(vars.EMDASH_SITE_URL) ?? httpOrigin(vars.SITE_URL);
}

/** True for an origin no real site has: `example.com`, `.org`, `.net`, the `.example` domain, and their subdomains. */
function isPlaceholderOrigin(origin: string): boolean {
	const host = new URL(origin).hostname.replace(/\.$/, "");
	return /(^|\.)example(\.(com|org|net))?$/.test(host);
}

let warned = false;

/**
 * The address the site was given, placeholder included: the environment, then `site`, then the request. For a value that
 * must not come from a request's Host header, such as a form's redirect (a proxy's internal address would strand the
 * visitor). Compare it with the placeholder to see that no address is set.
 */
export function declaredOrigin(input: PublicOriginInput): string {
	const origin = runtimeOrigin(input) ?? httpOrigin(input.site) ?? httpOrigin(input.url);
	if (!origin) throw new Error("publicOrigin: no public origin. Set `site` in astro.config.mjs (or SITE_URL).");
	return origin;
}

export function publicOrigin(input: PublicOriginInput): string {
	const origin = declaredOrigin(input);
	const fromRequest = httpOrigin(input.url);
	if (input.output !== "server" || import.meta.env?.DEV || !fromRequest || runtimeOrigin(input) || !isPlaceholderOrigin(origin)) return origin;
	if (!warned) {
		warned = true;
		(input.warn ?? console.warn)(`Site address: SITE_URL is not set, so links use the address this server sees for the request (now ${fromRequest}). Set SITE_URL to your site's address.`);
	}
	return fromRequest;
}
