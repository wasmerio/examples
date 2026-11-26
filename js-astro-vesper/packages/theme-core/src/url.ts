/** True for `https://…` and other scheme URLs. */
export function isAbsoluteUrl(value: string): boolean {
	return /^[a-z][a-z\d+.-]*:/i.test(value);
}

/**
 * A path on the site as an absolute URL; an absolute URL stays as it is; `//host/x` gets `https:`.
 * `site` is an origin only: paths are root-relative, so a base path in `site` (`https://a.dev/blog/`) is dropped.
 */
export function absoluteUrl(site: string | URL, pathOrUrl: string): string {
	if (pathOrUrl.startsWith("//")) return `https:${pathOrUrl}`;
	if (isAbsoluteUrl(pathOrUrl)) return pathOrUrl;
	return new URL(pathOrUrl, site).href;
}
