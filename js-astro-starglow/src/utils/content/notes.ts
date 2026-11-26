import { getRelativeLocaleUrl } from "astro:i18n";
import type { CollectionEntry } from "astro:content";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import config from "@/config";
import { resolveTimezone } from "@/utils/resolveTimezone";
import { getNoteParts } from "./entryIds";
import { getGitLastModified } from "./gitDates";

dayjs.extend(utc);
dayjs.extend(timezone);

/** The only place a note URL is built: `/notes/YYYY/<slug>/`. */
export function getNoteUrl(
  id: string,
  locale: string | undefined = config.site.lang
): string {
  const { year, slug } = getNoteParts(id);
  return getRelativeLocaleUrl(locale, `notes/${year}/${slug}`);
}

/**
 * Effective date of a note: frontmatter `updated`, else the file's git
 * last-modified date, else none (callers show the folder year alone).
 */
export function getNoteDate(note: CollectionEntry<"notes">): {
  date?: Date;
  year: string;
} {
  const { year } = getNoteParts(note.id);
  const date = note.data.updated ?? getGitLastModified(note.filePath);
  return { date, year };
}

/** `D MMM, YYYY` in the site timezone, plus the ISO value for `<time>`. */
export function formatNoteDate(date: Date): { iso: string; text: string } {
  const zoned = dayjs(date).tz(resolveTimezone(config.site.timezone));
  return { iso: zoned.toISOString(), text: zoned.format("D MMM, YYYY") };
}
