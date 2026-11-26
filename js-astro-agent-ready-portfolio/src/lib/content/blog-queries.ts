import { blogPosts } from "$lib/content/blog";
import type { BlogPost } from "$lib/types/portfolio";

export const tagSlug = (tag: string) =>
  tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export type TagSummary = { tag: string; slug: string; count: number };

export function allTags(): TagSummary[] {
  const counts = new Map<string, TagSummary>();
  for (const post of blogPosts) {
    for (const tag of post.tags) {
      const slug = tagSlug(tag);
      const existing = counts.get(slug);
      if (existing) existing.count += 1;
      else counts.set(slug, { tag, slug, count: 1 });
    }
  }
  return [...counts.values()].sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag),
  );
}

export const postsWithTag = (slug: string) =>
  blogPosts.filter((post) => post.tags.some((tag) => tagSlug(tag) === slug));

// Newer posts first, so `newer` is the previous index and `older` the next.
export function adjacentPosts(slug: string) {
  const index = blogPosts.findIndex((post) => post.slug === slug);
  return {
    newer: index > 0 ? blogPosts[index - 1] : undefined,
    older:
      index >= 0 && index < blogPosts.length - 1
        ? blogPosts[index + 1]
        : undefined,
  };
}

// Posts sharing the most tags with `post`; ties go to the newer post.
export function relatedPosts(post: BlogPost, limit = 3) {
  const mine = new Set(post.tags.map(tagSlug));
  return blogPosts
    .filter((other) => other.slug !== post.slug)
    .map((other) => ({
      other,
      shared: other.tags.filter((tag) => mine.has(tagSlug(tag))).length,
    }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map(({ other }) => other);
}
