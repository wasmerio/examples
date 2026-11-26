/**
 * Prefixes an internal path with the configured `base` so links keep working
 * when the site is deployed to a sub-path (for example GitHub Pages project sites).
 *
 *   url('/blog')       -> '/blog'          (base = '/')
 *   url('/blog')       -> '/my-repo/blog'  (base = '/my-repo')
 *   url('/#pricing')   -> '/#pricing'
 *
 * External URLs, mailto:, tel: and pure #hash links are returned unchanged.
 */
export function url(path: string): string {
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}` || '/';
}

/** Absolute URL (including the site origin) for canonical / Open Graph usage. */
export function absoluteUrl(path: string, site: URL | undefined): string {
  return new URL(url(path), site).toString();
}

/** Keeps a phone number on one line: non-breaking spaces and hyphens. */
export function phoneDisplay(phone: string): string {
  return phone.replace(/ /g, '\u00A0').replace(/-/g, '\u2011');
}
