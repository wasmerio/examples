/**
 * Base-path aware URLs. Deploying under a sub-path (GitHub project pages:
 * https://user.github.io/repo/) sets Astro's `base`; every internal link, image
 * and asset path in the theme goes through `url()` so it keeps working there.
 * With the default base `/` both helpers are no-ops on the path.
 */
const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');

/** Prefix a root-relative path ("/posts/x/") with the base. Leaves full URLs, protocol-relative and already-prefixed paths alone. */
export function url(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (BASE && (path === BASE || path.startsWith(`${BASE}/`))) return path;
  return BASE + path;
}

/** Absolute URL on the production site (feeds, sitemap, Open Graph). */
export const absolute = (path: string) => new URL(url(path), import.meta.env.SITE).href;
