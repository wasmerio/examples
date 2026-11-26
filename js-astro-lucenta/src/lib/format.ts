import { siteConfig } from "@/config/site";

const dateFormat = new Intl.DateTimeFormat(siteConfig.dateLocale, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const formatDate = (date: Date) => dateFormat.format(date);

const shortDate = new Intl.DateTimeFormat(siteConfig.dateLocale, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** "14 Nov 2026". */
export const formatShortDate = (date: Date) => shortDate.format(date);

/** "A", "A and B", "A, B and C". */
export const joinNames = (names: string[]) =>
  names.length < 2 ? (names[0] ?? "") : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;

/** "01", "02" … for numbered lists. */
export const pad = (n: number) => String(n).padStart(2, "0");

/** Joins the last two words, so a paragraph never ends on a word alone. */
export const noOrphan = (text: string) => text.replace(/\s+(\S+)\s*$/, " $1");
