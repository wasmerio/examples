import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

/** All published posts, newest first. Drafts are hidden in production builds. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("posts", ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function slugify(tag: string): string {
  return tag.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
}

export function tagCounts(posts: Post[]): { tag: string; slug: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of posts) for (const t of p.data.tags) map.set(t, (map.get(t) ?? 0) + 1);
  return [...map]
    .map(([tag, count]) => ({ tag, slug: slugify(tag), count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function readingTime(body = ""): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 225));
}

export function formatDate(date: Date, lang = "en"): string {
  return date.toLocaleDateString(lang, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export function formatShort(date: Date, lang = "en"): string {
  return date.toLocaleDateString(lang, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}
