import type { CollectionEntry } from 'astro:content';

type Pub = CollectionEntry<'publications'>;

/** Newest first, and deterministic: venue and title break the ties year and
    month leave, so the order cannot follow the loader's emission order. */
export function byNewest(a: Pub, b: Pub) {
  return (
    b.data.year - a.data.year ||
    (b.data.month ?? 0) - (a.data.month ?? 0) ||
    (a.data.abbr?.id ?? '').localeCompare(b.data.abbr?.id ?? '') ||
    a.data.title.localeCompare(b.data.title)
  );
}

/** Group into year buckets, newest year first, each bucket already sorted. */
export function byYear(pubs: Pub[]): { year: number; items: Pub[] }[] {
  const buckets = new Map<number, Pub[]>();
  for (const p of [...pubs].sort(byNewest)) {
    const list = buckets.get(p.data.year);
    if (list) list.push(p);
    else buckets.set(p.data.year, [p]);
  }
  return [...buckets.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({ year, items }));
}

/**
 * A Date for a publication: the first of its month, in UTC. Three traps, all of
 * which have shipped: Date.UTC takes a ZERO-BASED month while the schema stores
 * 1-12; a zone west of UTC shifts the day backwards, so the same commit dates
 * differently depending on where it was built; and Date.UTC maps a year of 0-99
 * onto 1900-1999, which only setUTCFullYear undoes.
 */
export function publicationDate(d: { year: number; month?: number }): Date {
  const date = new Date(Date.UTC(d.year, (d.month ?? 1) - 1, 1));
  if (d.year >= 0 && d.year <= 99) date.setUTCFullYear(d.year);
  return date;
}
