/** Base-aware URL helpers.
 *
 *  A site can be served from a subpath: `base: '/my-community'` in
 *  astro.config.mjs, which is what a GitHub project page
 *  (user.github.io/repo/) needs. Astro rewrites the asset URLs it generates
 *  itself, but every path the theme writes by hand is a literal string Astro
 *  never sees, so it has to be prefixed here or it 404s on a subpath install.
 *  The Hugo twin does the same job with relURL/absURL (see PARITY.md).
 *
 *  Both helpers are deliberately tolerant: they pass through anything that is
 *  not a site-absolute path (external URLs, mailto:, tel:, #anchors, relative
 *  paths) and anything already carrying the base. That makes them safe to
 *  apply to adopter-authored values from popular.config.ts and to content
 *  front matter, neither of which knows the base, so adopters never have to
 *  rewrite their own links.
 */

/* BASE_URL is '/' when no base is configured, and '/my-community' when one
   is (with a trailing slash if trailingSlash is 'always', hence the strip).
   Normalizes to '' or '/my-community', so joining is plain concatenation. */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function withBase(path: string): string;
export function withBase(path: string | undefined | null): string | undefined;
export function withBase(path: string | undefined | null): string | undefined {
  if (!path || !BASE) return path ?? undefined;
  /* Not site-absolute (external, protocol-relative, anchor, relative): leave it. */
  if (path[0] !== '/' || path[1] === '/') return path;
  if (path === BASE || path.startsWith(`${BASE}/`)) return path;
  return BASE + path;
}

/** Absolute URL for canonicals, feeds and structured data: origin + base +
 *  path. `Astro.site` (and the `site` passed to endpoints) is the bare
 *  origin and does not carry the base, so a path resolved against it alone
 *  silently drops the subpath. */
export function absoluteUrl(path: string, site: URL | string | undefined): string {
  return new URL(withBase(path), site ?? 'https://example.com').href;
}