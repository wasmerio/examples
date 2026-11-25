const base = import.meta.env.BASE_URL;

/**
 * Prefix a site-root-absolute path (e.g. `/blog/`) with the configured `base`
 * so links and assets resolve when the site is served from a subpath — such as
 * a GitHub Pages project site at `/<repo>/`. With no `base` set, `BASE_URL` is
 * `/` and the path is returned unchanged.
 */
export function withBase(path: string): string {
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${trimmedBase}${path.startsWith('/') ? path : `/${path}`}`;
}
