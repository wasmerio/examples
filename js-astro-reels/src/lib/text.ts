export const WORDS_PER_MINUTE = 230;

export interface TitleSegment { text: string; code: boolean }

/** The author marks concepts with backticks; they render as inline code in headings and lists. */
export function titleSegments(title: string): TitleSegment[] {
  return title.split('`').map((text, i) => ({ text, code: i % 2 === 1 })).filter((segment) => segment.text !== '');
}

/** The title as plain text, for <title>, descriptions, share cards, JSON-LD and RSS. */
export function plainTitle(title: string): string {
  return title.replace(/`/g, '');
}

export function readingMinutes(markdown: string): number {
  const text = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ');
  const words = text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)?.length ?? 0;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function newestFirst<T extends { id: string; data: { pubDate: Date } }>(entries: readonly T[]): T[] {
  return [...entries].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.id.localeCompare(b.id));
}
