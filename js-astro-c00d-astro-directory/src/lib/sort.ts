import type { CollectionEntry } from 'astro:content';

export type Listing = CollectionEntry<'listings'>;
export type SortKey = 'top' | 'popular' | 'newest' | 'name';

export const SORTS: Record<SortKey, string> = {
  top: 'Top rated',
  newest: 'Newest',
  name: 'A–Z',
  popular: 'Most visited',
};

/**
 * Order listings.
 *
 * Unrated entries sort last rather than being dropped — the same trap the other
 * editions hit, where ordering by rating quietly hid every listing nobody had
 * rated yet.
 *
 * `popular` needs click counts, which a static build does not have. It falls
 * back to rating rather than pretending, and the sort control hides it unless
 * an API is supplying real numbers.
 */
export function sortListings(items: Listing[], key: SortKey): Listing[] {
  const out = [...items];

  switch (key) {
    case 'name':
      return out.sort((a, b) => a.data.name.localeCompare(b.data.name));

    case 'newest':
      // Without dates from an API, id order is the closest honest proxy.
      return out.reverse();

    case 'top':
    case 'popular':
    default:
      return out.sort((a, b) => {
        const ar = a.data.rating;
        const br = b.data.rating;
        if (ar === null && br === null) return a.data.name.localeCompare(b.data.name);
        if (ar === null) return 1;
        if (br === null) return -1;
        if (br !== ar) return br - ar;
        return a.data.name.localeCompare(b.data.name);
      });
  }
}

/** "4.9" with the decimal styled smaller, matching the other editions. */
export function ratingParts(rating: number | null): { whole: string; dec: string } | null {
  if (rating === null) return null;
  const [whole, dec = '0'] = rating.toFixed(1).split('.');
  return { whole, dec };
}
