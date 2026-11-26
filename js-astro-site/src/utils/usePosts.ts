import { type CollectionEntry, getCollection } from "astro:content";
import { SITE } from "@/config";

const posts = await getCollection("blog", ({ data }) => {
  const isPublishTimePassed =
    Date.now() > data.pubDatetime.getTime() - SITE.scheduledPostMargin;
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
});

export type Tag = CollectionEntry<"blog">["data"]["tags"][number];

export const usePostsByTag = (slug: string) =>
  allPosts.filter(post =>
    post.data.tags.map(({ slug }) => slug).includes(slug)
  );

export const useSortedPosts = (posts: CollectionEntry<"blog">[]) => {
  return posts.sort(
    (a, b) =>
      Math.floor((b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000) -
      Math.floor((a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000)
  );
};

export const allPosts = useSortedPosts(posts);

export const featuredPosts = allPosts.filter(({ data }) => data.featured);
export const recentPosts = allPosts.filter(({ data }) => !data.featured);

export const allTags = allPosts
  .flatMap(post => post.data.tags)
  .filter(
    (value, index, self) =>
      self.findIndex(tag => tag.slug === value.slug) === index
  )
  .sort((tagA, tagB) => tagA.slug.localeCompare(tagB.slug));
