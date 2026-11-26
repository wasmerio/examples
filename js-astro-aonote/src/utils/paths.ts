import { site } from '../site.config';

/** Internal path with optional GitHub Pages / repo subpath prefix. */
export function siteHref(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const base = site.repoSubpath.replace(/\/$/, '');
  return `${base}${normalized}`;
}

/** Absolute production URL for canonical links and feeds. */
export function absoluteUrl(path: string): string {
  const root = site.baseUrl.replace(/\/$/, '');
  return `${root}${siteHref(path)}`;
}
