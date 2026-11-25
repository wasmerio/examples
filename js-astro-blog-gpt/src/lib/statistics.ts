import type { StatisticsOptions } from '../types/config';
import { characterCount } from './footer.ts';
export const statisticsOptions = (
  options: Partial<StatisticsOptions> = {},
): StatisticsOptions => ({
  enabled: true,
  articleCount: true,
  wordCount: true,
  days: true,
  languages: true,
  averageWords: true,
  updateFrequency: true,
  firstPublication: true,
  lastUpdate: true,
  heatmap: true,
  recentWords: true,
  recentLimit: 12,
  ...options,
});
export function dayKey(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone,
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)!.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
export function blogStatistics<
  T extends {
    body?: string;
    data: { date: Date; updated?: Date; title: string };
  },
>(posts: T[], timeZone: string, now = new Date()) {
  const entries = posts
    .map((post) => ({ post, words: characterCount(post.body ?? '') }))
    .sort((a, b) => b.post.data.date.getTime() - a.post.data.date.getTime());
  const words = entries.reduce((sum, entry) => sum + entry.words, 0);
  const first = entries.at(-1)?.post.data.date.getTime();
  const last = entries[0]?.post.data.date.getTime();
  const publications = new Map<string, typeof entries>();
  for (const entry of entries) {
    const day = dayKey(entry.post.data.date, timeZone);
    publications.set(day, [...(publications.get(day) ?? []), entry]);
  }
  const today = Date.parse(`${dayKey(now, timeZone)}T00:00:00Z`);
  const start = today - 364 * 86400000;
  const offset = new Date(start).getUTCDay();
  const heatmap = Array.from({ length: 365 }, (_, index) => {
    const date = new Date(start + index * 86400000).toISOString().slice(0, 10);
    return {
      date,
      count: publications.get(date)?.length ?? 0,
      entries: publications.get(date) ?? [],
      column: Math.floor((index + offset) / 7),
      row: (index + offset) % 7,
    };
  });
  return {
    entries,
    words,
    averageWords: posts.length ? Math.round(words / posts.length) : 0,
    firstPublication: first === undefined ? undefined : new Date(first),
    lastUpdate: entries.length
      ? new Date(
          Math.max(
            ...entries.map(({ post }) =>
              Math.max(
                post.data.date.getTime(),
                post.data.updated?.getTime() ?? 0,
              ),
            ),
          ),
        )
      : undefined,
    intervalDays:
      posts.length > 1
        ? (last! - first!) / 86400000 / (posts.length - 1)
        : undefined,
    heatmap,
  };
}
