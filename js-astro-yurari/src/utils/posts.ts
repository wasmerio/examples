import { getCollection } from "astro:content";
import { siteConfig } from "@/config";

export async function getSortedPosts() {
  const posts = await getCollection("posts", (p) => !p.data.draft);
  return posts.sort((a, b) => b.data.published.getTime() - a.data.published.getTime());
}

export function countBy(values: string[]) {
  const map = new Map<string, number>();
  for (const v of values) map.set(v, (map.get(v) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/**
 * 日付を siteConfig の書式で整形する。トークン: YYYY YY MMMM MMM MM M DD D ([ ] で囲むとそのまま出力)。
 * published は UTC 0時でパースされるので、UTC のまま扱って日付がずれないようにする。
 */
export function formatDate(date: Date, format: string = siteConfig.dateFormat) {
  const month = (style: "long" | "short") => date.toLocaleDateString(siteConfig.dateLocale, { month: style, timeZone: "UTC" });
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  const pad = (n: number) => String(n).padStart(2, "0");

  const tokens: Record<string, () => string> = {
    YYYY: () => String(y),
    YY: () => pad(y % 100),
    MMMM: () => month("long"),
    MMM: () => month("short"),
    MM: () => pad(m),
    M: () => String(m),
    DD: () => pad(d),
    D: () => String(d),
  };
  return format.replace(/\[([^\]]*)\]|YYYY|YY|MMMM|MMM|MM|M|DD|D/g, (match, literal) =>
    literal !== undefined ? literal : tokens[match](),
  );
}
