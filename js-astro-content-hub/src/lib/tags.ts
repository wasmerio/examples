// Pure tag/related-post helpers, extracted from content.ts so they are
// unit-testable without the astro:content runtime. All functions here operate
// on plain post entries and never touch collections or rendering.

/** Minimal shape of a post entry consumed by these helpers. */
export interface TagPostEntry {
  id: string;
  data: { title: string; date: Date; tags: string[] };
}

/** Normalize a tag into a URL-safe slug (lowercase, kebab-case, ASCII-only).
 *  Mirrors the slug a reader can type, and keeps tags that share text on the
 *  same page across locales (ASCII tags collapse onto one page). */
export function tagSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface TagInfo {
  /** URL slug for the tag page. */
  slug: string;
  /** Original (display) tag text, from the first post that used it. */
  label: string;
  /** Number of posts with this tag (in this locale, incl. fallback). */
  count: number;
}

/** Every tag across the given post entries (incl. fallback), with counts.
 *  The label shown is from the first post encountered that uses the tag, so it
 *  reflects the locale's own wording when present. */
export function tagsOfEntries(entries: TagPostEntry[]): TagInfo[] {
  const map = new Map<string, TagInfo>();
  for (const entry of entries) {
    for (const tag of entry.data.tags) {
      const slug = tagSlug(tag);
      const existing = map.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(slug, { slug, label: tag, count: 1 });
      }
    }
  }
  // Most-used first, then alphabetical by label for a stable order.
  return [...map.values()].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label),
  );
}

/** Filter entries by a tag slug and sort newest-first. */
export function filterEntriesByTagSlug(
  entries: TagPostEntry[],
  tag: string,
): TagPostEntry[] {
  const slug = tagSlug(tag);
  return entries
    .filter(({ data }) => data.tags.some((t) => tagSlug(t) === slug))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Up to `limit` entries sharing the most tags with `slug`, excluding itself.
 *  Falls back to the newest other entries when no tags overlap. */
export function relatedEntries(
  entries: TagPostEntry[],
  slug: string,
  limit = 3,
): TagPostEntry[] {
  const current = entries.find((p) => p.id === slug);
  const currentTags = current
    ? new Set(current.data.tags.map(tagSlug))
    : new Set<string>();
  const others = entries.filter((p) => p.id !== slug);
  return others
    .map((p) => ({
      p,
      score: p.data.tags.filter((t) => currentTags.has(tagSlug(t))).length,
    }))
    .sort((a, b) => b.score - a.score || b.p.data.date.getTime() - a.p.data.date.getTime())
    .slice(0, limit)
    .map(({ p }) => p);
}
