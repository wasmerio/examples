/** 所有日期按 UTC 解释（frontmatter 的 `2026-11-06` 会被解析为 UTC 零点），避免时区漂移。 */

/** zh 系语言：2026年11月6日；其他语言用 Intl 的长格式（en: November 6, 2026）。 */
export function formatDate(date: Date, lang = 'zh-CN'): string {
  if (/^zh\b/i.test(lang)) {
    return `${date.getUTCFullYear()}年${date.getUTCMonth() + 1}月${date.getUTCDate()}日`;
  }
  return new Intl.DateTimeFormat(lang, { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}

/** YYYY-MM-DD，用于 `<time datetime>`。 */
export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** 完整 ISO 8601 字符串，用于 RSS、JSON-LD。 */
export function toISOString(date: Date): string {
  return date.toISOString();
}
