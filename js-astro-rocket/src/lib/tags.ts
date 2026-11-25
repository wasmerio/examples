/**
 * Tag-slug conventions shared across content types (blog, projects).
 *
 * Kept here — rather than inside `lib/blog` — so blog and project tag
 * archives derive identical, collision-free slugs from the same rules.
 */

/**
 * Convert a human-readable tag (e.g. "Web Performance") to a URL slug
 * (e.g. "web-performance"). Two-way deterministic — pair with `findTagBySlug`.
 */
export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Find the original tag string given its slug, from a list of known tags. */
export function findTagBySlug(slug: string, allTags: string[]): string | undefined {
  return allTags.find((tag) => tagToSlug(tag) === slug);
}
