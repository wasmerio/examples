import type { CollectionEntry } from "astro:content";
import { categories, categorySlug, type Category } from "@/config/categories";
import { siteConfig } from "@/config/site";

export type Post = CollectionEntry<"posts">;
export { categories, categorySlug, type Category };

export const authorSlug = (author: string) =>
  author
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export const categoryHref = (category: string) => `/category/${categorySlug(category)}/`;

export const postSlug = (post: Post) => post.id.replace(/\/index$/, "");

export const postHref = (post: Post) => `/post/${postSlug(post)}/`;

export const byNewest = (a: Post, b: Post) => b.data.date.getTime() - a.data.date.getTime();

export const visiblePosts = (posts: Post[]) =>
  posts.filter((post) => !post.data.draft).sort(byNewest);

/**
 * Reading time from the raw Markdown body at 220 words per minute, so posts
 * never have to carry a hand-maintained `readMinutes` field.
 */
export const readingMinutes = (post: Post) => {
  const words = (post.body ?? "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
};

export const readingLabel = (post: Post) => `${readingMinutes(post)} min read`;

export const getFeatured = (posts: Post[], limit = 5) =>
  visiblePosts(posts)
    .filter((post) => post.data.featured)
    .slice(0, limit);

export const getPostsByCategory = (posts: Post[], category: string) =>
  visiblePosts(posts).filter((post) => post.data.category === category);

/** Categories in configured order, with post counts. Empty ones are dropped. */
export const getCategoryList = (posts: Post[]) => {
  const visible = visiblePosts(posts);

  return categories
    .map((category) => ({
      name: category,
      slug: categorySlug(category),
      count: visible.filter((post) => post.data.category === category).length,
    }))
    .filter((entry) => entry.count > 0);
};

export const getRelated = (posts: Post[], current: Post, limit = 3) =>
  visiblePosts(posts)
    .filter((post) => post.id !== current.id)
    .sort((a, b) => {
      const sameCategory =
        Number(b.data.category === current.data.category) -
        Number(a.data.category === current.data.category);
      return sameCategory || byNewest(a, b);
    })
    .slice(0, limit);

/** Previous/next in publication order, matching the article footer navigation. */
export const getAdjacent = (posts: Post[], current: Post) => {
  const ordered = visiblePosts(posts);
  const index = ordered.findIndex((post) => post.id === current.id);

  return {
    newer: index > 0 ? ordered[index - 1] : undefined,
    older: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : undefined,
  };
};

export const getAllAuthors = (posts: Post[]) =>
  Array.from(
    visiblePosts(posts)
      .reduce((authors, post) => {
        const slug = authorSlug(post.data.author.name);
        const current = authors.get(slug);
        authors.set(slug, {
          name: post.data.author.name,
          role: post.data.author.role,
          posts: [...(current?.posts ?? []), post],
        });
        return authors;
      }, new Map<string, { name: string; role: string; posts: Post[] }>())
      .entries(),
  )
    .map(([slug, author]) => ({ slug, ...author }))
    .sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name));

export const formatDate = (date: Date, style: "short" | "long" = "short") =>
  new Intl.DateTimeFormat(siteConfig.dateLocale, {
    month: style === "short" ? "short" : "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
