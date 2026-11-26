// Dates and numbers as the page's language writes them, for the server and the
// browser alike (this module has no Astro imports).

export type Lang = 'zh' | 'en';

/** The locale for numbers: 2,340 in both languages. */
export const numberLocale = (lang: Lang) => (lang === 'zh' ? 'zh-CN' : 'en-US');

/** A date, from a Date or an ISO day: 2026 年 10 月 10 日 (with spaces between digits and characters) or Oct 10, 2026. */
export function formatDate(date: Date | string, lang: Lang) {
  const d = typeof date === 'string' ? new Date(`${date}T00:00:00Z`) : date;
  if (lang === 'zh') return `${d.getUTCFullYear()} 年 ${d.getUTCMonth() + 1} 月 ${d.getUTCDate()} 日`;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/** A month's short name: 10 月, Oct. */
export const formatMonth = (date: Date | string, lang: Lang) => {
  const d = typeof date === 'string' ? new Date(`${date}T00:00:00Z`) : date;
  return lang === 'zh' ? `${d.getUTCMonth() + 1} 月` : d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
};

/** The UTC offset of an IANA time zone now (UTC+8, UTC-4); undefined for an unknown zone. */
export function utcOffset(timeZone: string, date = new Date()) {
  try {
    return new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'shortOffset' })
      .formatToParts(date)
      .find((p) => p.type === 'timeZoneName')
      ?.value.replace('GMT', 'UTC');
  } catch {
    return undefined;
  }
}
