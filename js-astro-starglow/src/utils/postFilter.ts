import type { CollectionEntry } from "astro:content";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import config from "@/config";
import { resolveTimezone } from "./resolveTimezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Whether a post is listed and rendered. Dev shows everything; production
 * drops drafts and posts whose `pubDatetime` day (in the post's or site's
 * timezone) is after the build date. Publishing is day-granular by design.
 */
export function postFilter({ data }: CollectionEntry<"posts">) {
  if (import.meta.env.DEV) return true;
  if (data.draft) return false;

  const tz = resolveTimezone(data.timezone ?? config.site.timezone);
  const publishDay = dayjs(data.pubDatetime).tz(tz).startOf("day");
  const buildDay = dayjs().tz(tz).startOf("day");

  return !publishDay.isAfter(buildDay);
}
