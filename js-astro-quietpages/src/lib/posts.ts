import { getCollection, type CollectionEntry } from "astro:content";
import { authors } from "@/config/authors";
import { siteConfig } from "@/config/site";
import { categories, tags } from "@/config/taxonomy";

export type Post = CollectionEntry<"blog">["data"] & {
  slug: string;
  entry: CollectionEntry<"blog">;
  readingTime: number;
};

const estimateReadingTime = (text = "") => {
  const words = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / siteConfig.wordsPerMinute));
};

const toPost = (entry: CollectionEntry<"blog">): Post => ({
  ...entry.data,
  slug: entry.id,
  entry,
  readingTime: entry.data.readingTime ?? estimateReadingTime(entry.body),
});

let cache: Post[] | undefined;

/** Published posts, newest first. Drafts never leave this function. */
export const getPosts = async (): Promise<Post[]> => {
  if (!cache) {
    cache = (await getCollection("blog", ({ data }) => !data.draft))
      .map(toPost)
      .sort((a, b) => b.date.valueOf() - a.date.valueOf());
  }
  return cache;
};

export const getAuthor = (slug: string) => authors.find((author) => author.slug === slug);
export const getCategory = (slug: string) => categories.find((item) => item.slug === slug);
export const getTag = (slug: string) => tags.find((item) => item.slug === slug);

export const postUrl = (post: Pick<Post, "slug">) => `/blog/${post.slug}/`;
export const categoryUrl = (slug: string) => `/categories/${slug}/`;
export const tagUrl = (slug: string) => `/tags/${slug}/`;
export const authorUrl = (slug: string) => `/authors/${slug}/`;

/** The newest post flagged `featured`, or the newest post. */
export const getLeadPost = async () => {
  const posts = await getPosts();
  return posts.find((post) => post.featured) ?? posts[0];
};

/** Two points for a shared category, one per shared tag. */
export const getRelatedPosts = async (post: Post, count = 3) => {
  const score = (candidate: Post) =>
    (candidate.category === post.category ? 2 : 0) +
    candidate.tags.filter((tag) => post.tags.includes(tag)).length;
  return (await getPosts())
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({ candidate, score: score(candidate) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ candidate }) => candidate);
};

export const getAdjacentPosts = async (post: Post) => {
  const posts = await getPosts();
  const index = posts.findIndex((candidate) => candidate.slug === post.slug);
  return { newer: posts[index - 1], older: posts[index + 1] };
};

export const countBy = (posts: Post[], key: "category" | "author") =>
  posts.reduce<Record<string, number>>((counts, post) => {
    counts[post[key]] = (counts[post[key]] ?? 0) + 1;
    return counts;
  }, {});

export const formatDate = (date: Date, month: "long" | "short" = "long") =>
  date.toLocaleDateString(siteConfig.dateLocale, { year: "numeric", month, day: "numeric" });

export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export const plural = (count: number, one: string, many = `${one}s`) =>
  `${count} ${count === 1 ? one : many}`;
