/**
 * Utilities for handling Astro URLs according to project standards.
 */

/**
 * Formats an internal link so it always ends with a slash for SEO
 * and has a normalized path without duplicate slashes.
 * External links, mailto, tel and pathless anchors are returned unchanged.
 */
export function formatInternalLink(href: string | null | undefined): string {
  if (!href) return '/';

  // Leave external and special links unchanged.
  if (
    href.startsWith('http') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('javascript:')
  ) {
    return href;
  }

  // Preserve a standalone anchor.
  if (href.startsWith('#')) {
    return href;
  }

  // Split the path from its anchor and query parameters.
  const [base, ...rest] = href.split(/([#?])/);
  const suffix = rest.join('');

  // Normalize duplicate slashes in the path.
  let formattedBase = base.replace(/\/+/g, '/');

  if (!formattedBase.startsWith('/')) {
    formattedBase = '/' + formattedBase;
  }

  if (!formattedBase.endsWith('/')) {
    formattedBase = formattedBase + '/';
  }

  // Normalize the root path so it does not become //.
  if (formattedBase === '//') formattedBase = '/';

  return formattedBase + suffix;
}

/**
 * Checks whether a link is external.
 */
export function isExternal(href: string): boolean {
  return href.startsWith('http') || href.startsWith('//');
}
