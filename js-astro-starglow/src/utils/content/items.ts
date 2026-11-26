import { getCollection, type CollectionEntry } from "astro:content";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import config from "@/config";
import { getPostUrl } from "@/utils/getPostPaths";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { resolveTimezone } from "@/utils/resolveTimezone";
import { getNoteDate, getNoteUrl } from "./notes";
import { isVisible } from "./visibility";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * One list item for every listable content type. `key` (`type:id`) identifies
 * it: a post id and a note id can be equal, so the bare id is not unique.
 */
export type ContentItem = {
  type: "post" | "note";
  key: string;
  id: string;
  title: string;
  description?: string;
  /** Root-relative, trailing slash. */
  url: string;
  date?: Date;
  year: string;
  tags: string[];
  draft?: boolean;
  postDates?: {
    pubDatetime: Date;
    modDatetime?: Date | null;
    timezone?: string;
  };
};

export function postToItem(post: CollectionEntry<"posts">): ContentItem {
  const { title, description, tags, draft, pubDatetime, modDatetime } =
    post.data;
  return {
    type: "post",
    key: `post:${post.id}`,
    id: post.id,
    title,
    description,
    url: getPostUrl(post.id, post.filePath),
    date: modDatetime ?? pubDatetime,
    year: post.id.split("/")[0],
    tags,
    draft,
    postDates: {
      pubDatetime,
      modDatetime,
      timezone: post.data.timezone,
    },
  };
}

export function noteToItem(note: CollectionEntry<"notes">): ContentItem {
  const { date, year } = getNoteDate(note);
  return {
    type: "note",
    key: `note:${note.id}`,
    id: note.id,
    title: note.data.title,
    description: note.data.description,
    url: getNoteUrl(note.id),
    date,
    year,
    tags: note.data.tags,
    draft: note.data.draft,
  };
}

/** Sort time: the item's date, else 1 January of its folder year (site timezone). */
export function effectiveTime(item: ContentItem): number {
  if (item.date) return item.date.getTime();
  return dayjs
    .tz(`${item.year}-01-01 00:00`, resolveTimezone(config.site.timezone))
    .valueOf();
}

const seconds = (ms: number) => Math.floor(ms / 1000);

export function sortItems(items: ContentItem[]): ContentItem[] {
  return [...items].sort(
    (a, b) =>
      seconds(effectiveTime(b)) - seconds(effectiveTime(a)) ||
      a.title.localeCompare(b.title)
  );
}

/** Posts enter the item model only through getSortedPosts (postFilter). */
export async function getPostItems(): Promise<ContentItem[]> {
  return getSortedPosts(await getCollection("posts")).map(postToItem);
}

export async function getNoteItems(): Promise<ContentItem[]> {
  return sortItems(
    (await getCollection("notes")).filter(isVisible).map(noteToItem)
  );
}

export async function getAllItems(): Promise<ContentItem[]> {
  return sortItems([...(await getPostItems()), ...(await getNoteItems())]);
}

/**
 * The date a list row shows: `YYYY-MM-DD` of the item's date in its timezone
 * (a post's own, else the site's), or the folder year when there is none.
 */
export function itemTime(item: ContentItem): { iso: string; text: string } {
  if (!item.date) return { iso: item.year, text: item.year };
  const zoned = dayjs(item.date).tz(
    resolveTimezone(item.postDates?.timezone ?? config.site.timezone)
  );
  return { iso: zoned.toISOString(), text: zoned.format("YYYY-MM-DD") };
}
