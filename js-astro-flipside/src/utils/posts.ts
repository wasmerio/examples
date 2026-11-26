import { getCollection, type CollectionEntry } from "astro:content";

/**
 * Sorted (newest first); drafts only visible in dev.
 * Every post listing (index, slug paths, tags, RSS, pagination) should
 * route through this so draft filtering stays consistent site-wide.
 */
export async function getPosts(): Promise<CollectionEntry<"blog">[]> {
  const posts = await getCollection("blog", ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}
