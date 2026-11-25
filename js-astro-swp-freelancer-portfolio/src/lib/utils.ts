/** Small helpers shared across pages and components. */

/** Resolve a site-relative path against the configured `site` origin. */
export function absoluteUrl(path: string, site: URL | undefined): string {
  const origin = site ?? new URL('http://localhost:4321');
  return new URL(path, origin).href;
}

/**
 * Canonical URL for the current page.
 *
 * `trailingSlash: 'always'` is set in `astro.config.mjs`, so the pathname
 * already carries its slash; this only guards against the odd edge case.
 */
export function canonicalUrl(url: URL, site: URL | undefined): string {
  const origin = site ?? new URL(url.origin);
  const pathname = url.pathname.endsWith('/') || url.pathname.includes('.')
    ? url.pathname
    : `${url.pathname}/`;
  return new URL(pathname, origin).href;
}

/** e.g. `22 Jul 2026` */
export function formatDate(date: Date, locale = 'en-GB'): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** `2026-07-22`, for `<time datetime>` and structured data. */
export function isoDate(date: Date): string {
  return date.toISOString().split('T')[0]!;
}

/** Hide drafts in production but keep them visible while developing. */
export function isVisible(entry: { data: { draft?: boolean } }): boolean {
  return import.meta.env.DEV || !entry.data.draft;
}

/** Pads a number for the `S/01` style labels. */
export function pad(n: number, width = 2): string {
  return String(n).padStart(width, '0');
}
