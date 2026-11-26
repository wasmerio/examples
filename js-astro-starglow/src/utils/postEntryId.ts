import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { resolveTimezone } from "./resolveTimezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const ENTRY_PATTERN = /^(\d{4})\/([a-z0-9]+(?:-[a-z0-9]+)*)\.mdx?$/;

/**
 * Content id of a post, `<year>/<slug>`, from its path under `src/content/blog/`.
 * The folder year must equal the `pubDatetime` year in the post's (or site's)
 * timezone. A missing or bad `pubDatetime` is left to the schema to report.
 */
export function postEntryId(
  entry: string,
  data: Record<string, unknown>,
  siteTimezone: string
): string {
  const match = ENTRY_PATTERN.exec(entry);
  if (!match) {
    throw new Error(
      `[blog] ${entry}: expected src/content/blog/YYYY/<kebab-case-slug>.md or .mdx`
    );
  }
  const [, folderYear, slug] = match;

  const raw = data.pubDatetime;
  if (raw instanceof Date || typeof raw === "string") {
    const parsed = dayjs(raw);
    if (parsed.isValid()) {
      const tz = resolveTimezone(
        (typeof data.timezone === "string" && data.timezone) || siteTimezone
      );
      const year = parsed.tz(tz).format("YYYY");
      if (year !== folderYear) {
        throw new Error(
          `[blog] ${entry}: folder year ${folderYear} does not match pubDatetime year ${year} (${tz})`
        );
      }
    }
  }

  return `${folderYear}/${slug}`;
}
