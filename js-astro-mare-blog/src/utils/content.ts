import { getCollection } from "astro:content";

export async function getBlogPosts() {
  const posts = await getCollection("blog");

  return posts.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}

export async function getFeaturedPosts() {
  const posts = await getBlogPosts();

  return posts.filter((post) => post.data.featured);
}

export async function getJournalEntries() {
  const entries = await getCollection("journal");

  return entries.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}

export function getPostHref(id: string): string {
  return `/blog/${id}`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatMonthDay(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  })
    .formatToParts(date)
    .filter((part) => part.type === "month" || part.type === "day")
    .map((part) => part.value)
    .join("-");
}

export function formatISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}
