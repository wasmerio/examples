const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Prefix site-relative paths with the configured `base` (for sub-path
 * deployments such as GitHub Pages). External, mailto:, tel: and pure
 * `#hash` links are returned unchanged.
 */
export function url(path: string): string {
  if (/^([a-z][a-z\d+.-]*:|#|\/\/)/i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

/** Path of the current request without the base prefix or trailing slash. */
export function currentPath(pathname: string): string {
  let path = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  path = path.replace(/\/$/, '');
  return path === '' ? '/' : path;
}

/** Absolute URL for canonical links, Open Graph and structured data. */
export function absoluteUrl(path: string, site: URL | undefined): string {
  if (/^https?:/i.test(path)) return path;
  return new URL(url(path), site ?? 'http://localhost:4321').href;
}
