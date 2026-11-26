import { getCollection } from 'astro:content';
import { publicationDate } from '../publications.ts';
import { paperDescription, paperPublication, paperYear } from '../papers.ts';
import { paperPath } from '../paths.ts';
import type { FeedItem } from './types.ts';

/** Feed items from the paper pages, for a site with no blog: set FEED_SOURCE
    to 'papers' in src/features.ts. A page with no BibTeX entry is dated by its
    own year; undated, a reader files it at the bottom for ever. */
export async function feedItems(): Promise<FeedItem[]> {
  const papers = await getCollection('papers');

  const items = await Promise.all(
    papers.map(async (paper) => {
      const pub = await paperPublication(paper);
      const year = paperYear(paper, pub);
      return {
        title: paper.data.title,
        // The same fallback the page's meta description uses, so the two agree.
        description: paperDescription(paper, pub),
        pubDate: year === undefined ? undefined : publicationDate({ year, month: pub?.data.month }),
        path: paperPath(paper.id),
        categories: pub?.data.keywords ?? [],
      };
    }),
  );

  return items;
}
