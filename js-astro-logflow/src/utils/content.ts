import type { CollectionEntry } from "astro:content";

export function estimateReadingMinutes(body: string) {
  const plainText = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[>#*_~|\-]/g, " ");
  const cjk = plainText.match(
    /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu,
  )?.length ?? 0;
  const words = plainText
    .replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu, " ")
    .match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
  return Math.max(1, Math.ceil(cjk / 400 + words / 220));
}

export function taxonomySlug(value: string) {
  const slug = Array.from(value.trim().normalize("NFKC"))
    .map((character) => {
      if (/^[\p{L}\p{N}]$/u.test(character) || /^\s$/u.test(character)) return character;
      if (character === "-") return character;
      return `-${character.codePointAt(0)?.toString(16) ?? "item"}-`;
    })
    .join("")
    .replace(/\s+/g, " ")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .trim();
  return slug || "item";
}

export const tagPath = (tag: string) => `/blog/tags/${taxonomySlug(tag)}/`;
export const collectionPath = (name: string) => `/blog/collections/${taxonomySlug(name)}/`;

type BlogPost = CollectionEntry<"blog">;

export function getTagCounts(posts: BlogPost[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags ?? []) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
}

export function getCollectionSummaries(posts: BlogPost[]) {
  const summaries = new Map<string, { description: string; count: number }>();
  for (const post of posts) {
    const name = post.data.collection;
    if (!name) continue;
    const description = post.data.collectionDescription ?? "";
    const current = summaries.get(name);
    if (current) {
      current.count++;
      current.description ||= description;
    } else {
      summaries.set(name, { description, count: 1 });
    }
  }
  return Array.from(summaries.entries()).sort((a, b) => b[1].count - a[1].count);
}

export const sortByDateDesc = (posts: BlogPost[]) =>
  [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
