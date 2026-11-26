import { getCollection } from 'astro:content';

/**
 * Aggregate rating computed from the reviews collection — used by the
 * hero trust strip, the reviews carousel/page, and the AggregateRating
 * JSON-LD, so the number is always consistent everywhere it appears.
 */
export async function getAggregateRating() {
  const reviews = await getCollection('reviews');
  const count = reviews.length;
  const sum = reviews.reduce((total, r) => total + r.data.rating, 0);
  const average = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
  return { average, count };
}
