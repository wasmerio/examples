/**
 * Converts a tag string into a URL-safe slug.
 * Non-alphanumeric characters are collapsed into a single hyphen,
 * and leading/trailing hyphens are removed.
 *
 * Examples:
 *   "open source" → "open-source"
 *   "C++" → "C"
 *   " foo bar " → "foo-bar"
 *
 * Note: tags that differ only in non-alphanumeric characters will produce
 * the same slug (e.g. "C" and "C++" both become "C"). Avoid creating such tags.
 */
export function tagToSlug(tag: string): string {
  return tag.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/**
 * Extracts all unique tags from a collection of posts.
 * Posts without tags are safely ignored.
 * Order reflects the order tags are first encountered across posts.
 */
export function getUniqueTags(
  posts: { data: { tags?: string[] } }[],
): string[] {
  return [...new Set(posts.flatMap((post) => post.data.tags ?? []))];
}
