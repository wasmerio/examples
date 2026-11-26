/** "/system" style: one leading slash, no trailing slash. The site root is not allowed. */
export function normalizeRoute(route = "/system") {
	const clean = `/${String(route).replace(/^\/+|\/+$/g, "")}`;
	if (clean === "/") throw new Error('astronomicSystem: `route` cannot be the site root. Use a prefix such as "/system".');
	return clean;
}

/** A link to a system page, from import.meta.env.BASE_URL, the route, and an optional page. */
export function systemHref(base, route, page = "") {
	const b = base.endsWith("/") ? base : `${base}/`;
	return `${b}${route.slice(1)}${page ? `/${page}` : ""}`;
}

/** A link to one of the site's own pages: a root-relative path ("/work?x=1") under BASE_URL. */
export function screenHref(base, path) {
	const b = base.endsWith("/") ? base : `${base}/`;
	return `${b}${path.replace(/^\/+/, "")}`;
}
