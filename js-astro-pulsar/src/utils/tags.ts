/** URL-safe slug for a tag, e.g. "Tailwind CSS" -> "tailwind-css" */
export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
