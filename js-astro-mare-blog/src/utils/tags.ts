import type { CollectionEntry } from "astro:content";

type BlogPost = CollectionEntry<"blog">;

export interface TagSummary {
  name: string;
  slug: string;
  count: number;
}

export function getTagSlug(tag: string): string {
  return tag
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function getTagHref(tag: string): string {
  const slug = getTagSlug(tag);
  if (!slug) throw new Error(`Tag "${tag}" does not produce a valid URL slug.`);
  return `/blog/tags/${encodeURIComponent(slug)}`;
}

export function getTagSummaries(posts: BlogPost[]): TagSummary[] {
  const summaries = new Map<string, TagSummary>();

  for (const post of posts) {
    for (const name of new Set(post.data.tags)) {
      const slug = getTagSlug(name);
      if (!slug)
        throw new Error(`Tag "${name}" does not produce a valid URL slug.`);

      const existing = summaries.get(slug);
      if (existing && existing.name !== name) {
        throw new Error(
          `Tags "${existing.name}" and "${name}" resolve to the same URL slug "${slug}".`,
        );
      }

      if (existing) {
        existing.count += 1;
      } else {
        summaries.set(slug, { name, slug, count: 1 });
      }
    }
  }

  return [...summaries.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getPostsForTag(posts: BlogPost[], slug: string): BlogPost[] {
  return posts
    .filter((post) => post.data.tags.some((tag) => getTagSlug(tag) === slug))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
