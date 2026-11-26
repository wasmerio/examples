/**
 * URL and path resolution utilities for Astro base path support
 */

import { siteConfig } from '@data/siteConfig';

const RAW_BASE = import.meta.env.BASE_URL ?? '/';
const BASE_PATH = RAW_BASE.replace(/\/+$/, '');

/**
 * Strips the configured Astro base path from a pathname
 */
export function stripBasePath(pathname: string): string {
  const clean = pathname.replace(/\/$/, '');
  if (BASE_PATH && clean.startsWith(BASE_PATH))
    return clean.slice(BASE_PATH.length);

  return clean;
}

/**
 * Resolves the canonical site origin and page URL
 */
export function getSiteUrls(
  url: URL,
  site?: URL
): { siteBase: string; canonicalUrl: string } {
  const siteBase = site
    ? site.toString()
    : siteConfig.url
      ? new URL(siteConfig.url).origin
      : url.origin;
  const canonicalUrl = new URL(url.pathname, siteBase).toString();

  return { siteBase, canonicalUrl };
}

/**
 * Resolves an internal path or URL with the configured Astro base path
 * - External URLs (http://, https://, //) are returned unchanged
 * - Non-HTTP schemes (mailto:, tel:) and anchor links (#) are returned unchanged
 * - Relative and root-relative paths are prefixed with the base path
 * - Idempotent: calling resolveUrl on an already resolved path will not duplicate the base
 */
export function resolveUrl(path?: string): string {
  if (!path) return '';

  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:') ||
    path.startsWith('#') ||
    path.startsWith('//')
  )
    return path;

  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  if (
    BASE_PATH &&
    (cleanPath === BASE_PATH || cleanPath.startsWith(`${BASE_PATH}/`))
  )
    return cleanPath;

  const result = `${BASE_PATH}${cleanPath}`;

  return result || '/';
}

/**
 * Resolves a social or academic platform handle/ID or URL
 * - If already an HTTP/HTTPS URL, returns as-is
 * - If handle or username, prefixes with platform baseUrl and appends optional suffix
 * - Strips leading '@' if present
 */
export function resolveExternalUrl(
  val: string | undefined,
  baseUrl: string,
  suffix = ''
): string {
  if (!val) return '';
  if (val.startsWith('http://') || val.startsWith('https://')) return val;

  return `${baseUrl}${val.replace(/^@/, '')}${suffix}`;
}

/**
 * Resolves root-relative src and href attributes in HTML strings with the configured Astro base path
 */
export function resolveHtmlUrls(html?: string): string {
  if (!html || !BASE_PATH) return html ?? '';

  return html.replace(
    /\b(src|href)=(['"])(\/[^'"]*)\2/gi,
    (_match, attr, quote, path) => {
      const resolved = resolveUrl(path);

      return `${attr}=${quote}${resolved}${quote}`;
    }
  );
}

/**
 * Extracts the filename slug without extension
 */
export function getFileSlug(id: string): string {
  return id.replace(/\.(md|mdx)$/, '');
}

/**
 * Normalizes a custom frontmatter permalink relative to its collection route prefix
 */
export function cleanCollectionPermalink(
  collection: string,
  permalink: string
): string {
  const prefixPattern =
    collection === 'publications'
      ? /^\/?publications?\//
      : new RegExp(`^\\/?${collection}\\/`);

  return permalink
    .replace(prefixPattern, '')
    .replace(/\/$/, '')
    .replace(/^\//, '');
}

/**
 * Builds deduplicated static route entries for a content collection,
 * supporting both filename slugs and custom frontmatter permalinks
 */
export function buildCollectionPaths<
  T extends { id: string; data: { permalink?: string } },
>(collection: string, items: T[]): { slug: string; item: T }[] {
  const pathMap = new Map<string, T>();

  for (const item of items) {
    pathMap.set(getFileSlug(item.id), item);

    if (item.data.permalink) {
      const clean = cleanCollectionPermalink(collection, item.data.permalink);
      if (clean) pathMap.set(clean, item);
    }
  }

  return Array.from(pathMap.entries()).map(([slug, item]) => ({ slug, item }));
}

/**
 * Internal helper to resolve canonical URL for collection entries
 */
function getCollectionItemUrl(
  collection: string,
  item: { id: string; data: { permalink?: string } }
): string {
  if (item.data.permalink) {
    const clean = cleanCollectionPermalink(collection, item.data.permalink);
    if (clean) return resolveUrl(`/${collection}/${clean}/`);
  }

  return resolveUrl(`/${collection}/${getFileSlug(item.id)}/`);
}

/**
 * Resolves the canonical internal URL for a blog post
 */
export const getPostUrl = (post: {
  id: string;
  data: { permalink?: string };
}): string => getCollectionItemUrl('posts', post);

/**
 * Resolves the canonical internal URL for a publication
 */
export const getPublicationUrl = (pub: {
  id: string;
  data: { permalink?: string };
}): string => getCollectionItemUrl('publications', pub);

/**
 * Resolves the canonical internal URL for a talk
 */
export const getTalkUrl = (talk: {
  id: string;
  data: { permalink?: string };
}): string => getCollectionItemUrl('talks', talk);

/**
 * Resolves the canonical internal URL for a teaching entry
 */
export const getTeachingUrl = (item: {
  id: string;
  data: { permalink?: string };
}): string => getCollectionItemUrl('teaching', item);

/**
 * Resolves the canonical internal URL for a portfolio item
 */
export const getPortfolioUrl = (item: {
  id: string;
  data: { permalink?: string };
}): string => getCollectionItemUrl('portfolio', item);
