import { type CollectionEntry, getCollection } from "astro:content";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CollectionName } from "@consts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, "");
  const wordCount = textOnly.split(/\s+/).length;
  const readingTimeMinutes = (wordCount / 200 + 1).toFixed();
  return `${readingTimeMinutes} min read`;
}

export function sortByLastUpdateDate<T extends CollectionName>(
  a: CollectionEntry<T>,
  b: CollectionEntry<T>,
) {
  return (
    (b.data.lastUpdateDate ?? b.data.date).getTime() -
    (a.data.lastUpdateDate ?? a.data.date).getTime()
  );
}

export async function getFilteredCollectionEntries<T extends CollectionName>(
  collectionName: T
): Promise<{
  entries: CollectionEntry<T>[];
}> {
  const data = (await getCollection(collectionName))
    .filter((post: CollectionEntry<T>) => !post.data.draft)
    .sort(
      sortByLastUpdateDate
    );

  return { entries: data };
}

export async function getNavigationEntries<T extends CollectionName>(
  collectionName: T,
  referenceSlug: string | undefined,
): Promise<{ nextPost?: CollectionEntry<T>; prevPost?: CollectionEntry<T> }> {
  if (!referenceSlug) {
    return {};
  }

  const { entries } = await getFilteredCollectionEntries(collectionName);
  const currentIndex = entries.findIndex(
    (entry) => entry.slug === referenceSlug,
  );

  return {
    nextPost: entries[currentIndex + 1],
    prevPost: entries[currentIndex - 1],
  };
}

export function resolvePath(href: string | undefined | null, currentPath?: string | undefined) {
  if (!href) {
    return "";
  }

  if (href.startsWith("http")) {
    return href;
  }

  const baseUrl = import.meta.env.BASE_URL;

  if (!baseUrl) {
    return href;
  }

  const base = baseUrl.replace(/\/$/, "");

  const resolvedPath = href.startsWith("/")
    ? base + href
    : (currentPath ?? "").replace(/\/$/, "") + "/" + href;

  return resolvedPath;
}

export function formatDateWithLastUpdateDate(date: Date, lastUpdateDate?: Date): string {
  const formattedDate = date.toISOString().substring(0, 10);

  if (lastUpdateDate) {
    const formattedLastUpdateDate = lastUpdateDate.toISOString().substring(0, 10);
    return `${formattedDate} (updated: ${formattedLastUpdateDate})`;
  }
  return formattedDate;
}

export async function getAllEntriesWithTags() {
  const entries = [
    ...(await getFilteredCollectionEntries("blog")).entries,
    ...(await getFilteredCollectionEntries("talks")).entries,
    ...(await getFilteredCollectionEntries("projects")).entries,
  ].sort(sortByLastUpdateDate);

  const tags = [
    ...new Set(entries.flatMap((entry) => entry.data.tags || [])),
  ].sort();

  return { tags, entries }
}