import { SITE } from "../config";

/** "5 August 2026" — used in prose contexts. */
export function formatDate(date: Date, lang: string = SITE.lang): string {
  return new Intl.DateTimeFormat(lang, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** "2026.08.05" — used in the monospace metadata rows. */
export function formatDateStamp(date: Date): string {
  const iso = date.toISOString().slice(0, 10);
  return iso.replaceAll("-", ".");
}

/** Value for <time datetime>. */
export function isoDate(date: Date): string {
  return date.toISOString();
}
