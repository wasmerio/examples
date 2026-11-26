import type { Post } from "./posts";

export interface TagCount {
  tag: string;
  slug: string;
  count: number;
}

export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function tagUrl(tag: string): string {
  return `/tags/${tagSlug(tag)}/`;
}

export function collectTags(posts: Post[]): TagCount[] {
  const tags = new Map<string, TagCount>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = tagSlug(tag);
      const entry = tags.get(slug);
      if (entry) entry.count += 1;
      else tags.set(slug, { tag, slug, count: 1 });
    }
  }
  return [...tags.values()].sort((a, b) => a.tag.localeCompare(b.tag));
}
