/**
 * What a feed source hands back. `path` omits the base — feed.xml.ts adds it,
 * because an RSS <link> is an element, not an attribute, and base-paths cannot
 * reach it. `pubDate` may be undefined: the epoch files it under 1970.
 */
export type FeedItem = {
  title: string;
  description?: string;
  pubDate?: Date;
  path: string;
  categories?: string[];
};
