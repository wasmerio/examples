/**
 * Browse utilities.
 *
 * Purely mechanical: these functions read whatever key they're given out of
 * an entry's `meta` object and compare slugs. They assign no meaning to any
 * key — "place", "trip", or anything else is only ever a config value
 * passed in by the caller (see site.config.ts's `browse.indexes`).
 */

import type { Post, Note } from "./content";
import { slugify } from "./text";

export type Entry = Post | Note;

export interface BrowseValue {
  value: string;
  slug:  string;
}

function metaValuesOf(entry: Entry, key: string): string[] {
  const raw = entry.data.meta?.[key];

  if (!raw) return [];

  return Array.isArray(raw) ? raw : [raw];
}

/**
 * Every unique value configured `key` takes across the given entries,
 * sorted alphabetically. Each value carries its slug (for linking to
 * /browse/<indexSlug>/<valueSlug>).
 */
export function getMetaValues(entries: Entry[], key: string): BrowseValue[] {
  const bySlug = new Map<string, string>();

  for (const entry of entries) {
    for (const value of metaValuesOf(entry, key)) {
      const slug = slugify(value);
      if (slug && !bySlug.has(slug)) {
        bySlug.set(slug, value);
      }
    }
  }

  return Array.from(bySlug, ([slug, value]) => ({ slug, value })).sort(
    (a, b) => a.value.localeCompare(b.value)
  );
}

/** Entries whose `meta[key]` (flattened) includes the given value slug. */
export function filterByMetaSlug(
  entries: Entry[],
  key: string,
  valueSlug: string
): Entry[] {
  return entries.filter((entry) =>
    metaValuesOf(entry, key).some((value) => slugify(value) === valueSlug)
  );
}

/** Unique publication years across the given entries, newest first. */
export function getYears(entries: Entry[]): string[] {
  const years = new Set(
    entries.map((entry) => String(entry.data.published.getFullYear()))
  );

  return Array.from(years).sort((a, b) => Number(b) - Number(a));
}

/** Entries published in the given year. */
export function filterByYear(entries: Entry[], year: string): Entry[] {
  return entries.filter(
    (entry) => String(entry.data.published.getFullYear()) === year
  );
}
