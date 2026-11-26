/**
 * Resolves a root-relative path against Astro's configured base URL.
 * Handles subpaths (e.g. GitHub Pages "/<repo-name>") and root paths ("/")
 * while preserving external URLs, anchors, emails, and data URLs.
 */
export function url(path: string = ''): string {
  if (!path) return import.meta.env.BASE_URL || '/';

  // Return unchanged if it's already an absolute external link, anchor, mailto, etc.
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:') ||
    path.startsWith('#') ||
    path.startsWith('data:')
  ) {
    return path;
  }

  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${cleanBase}${cleanPath}` || '/';
}

export default url;
