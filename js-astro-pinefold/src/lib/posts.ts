import { getCollection, type CollectionEntry } from "astro:content";

export async function getSortedPosts(): Promise<CollectionEntry<"writing">[]> {
  return (await getCollection("writing", ({ data }) => import.meta.env.DEV || !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}