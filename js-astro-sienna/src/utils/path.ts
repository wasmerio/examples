// Astro doesn't rewrite raw href/src values, so internal links must be
// prefixed with the base path manually.

const BASE = import.meta.env.BASE_URL;

function isAbsolute(path: string): boolean {
	return /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(path);
}

/** Prefix a root-relative path with the base; absolute URLs pass through. */
export function withBase(path = "/"): string {
	if (isAbsolute(path)) return path;
	const base = BASE.replace(/\/+$/, "");
	const rel = path.startsWith("/") ? path : `/${path}`;
	return `${base}${rel}`;
}

/** Absolute URL including the base path (for canonical/OG/schema). */
export function absoluteUrl(path: string, site: URL | string | undefined): string {
	if (isAbsolute(path)) return new URL(path).toString();
	return new URL(withBase(path), site).toString();
}
