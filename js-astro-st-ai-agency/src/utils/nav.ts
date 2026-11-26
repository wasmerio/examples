import type { NavigationItem } from '../types';
import { url } from './url';

/**
 * aria-current for real page links only. Homepage section anchors never get it.
 * "page" on an exact match, "true" when the visitor is on a child page (e.g. a blog post).
 */
export function ariaCurrent(item: NavigationItem, pathname: string): 'page' | 'true' | undefined {
  if (!item.matchPath) return undefined;
  const strip = (p: string) => p.replace(/\/+$/, '') || '/';
  const current = strip(pathname);
  const target = strip(url(item.matchPath));
  if (current === target) return 'page';
  if (current.startsWith(`${target}/`)) return 'true';
  return undefined;
}
