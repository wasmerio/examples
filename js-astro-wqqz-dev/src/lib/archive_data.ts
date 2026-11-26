import { getCollection, type CollectionEntry } from 'astro:content';
import type { Post } from './search';

export type ArchiveEntry = CollectionEntry<'archives'>;

export interface ArchiveDataOptions {
  includeDrafts?: boolean;
}

export const WORDS_PER_MINUTE = 230;

export function countWords(text?: string): number {
  if (!text) return 0;
  let count = 0;
  let inWord = false;

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code > 32) {
      if (!inWord) {
        count++;
        inWord = true;
      }
    } else {
      inWord = false;
    }
  }

  return count;
}

export function calculateReadMinutes(words: number, wordsPerMinute: number = WORDS_PER_MINUTE): number {
  return Math.max(1, Math.round(words / wordsPerMinute));
}

export function formatArchivePost(entry: ArchiveEntry): Post {
  const body = (entry as { body?: string }).body ?? '';
  const wordCount = countWords(body);
  const readMinutes = calculateReadMinutes(wordCount);

  const dateObj = entry.data.date instanceof Date ? entry.data.date : new Date(entry.data.date);
  const dateStr = !isNaN(dateObj.getTime())
    ? dateObj.toISOString().slice(0, 10)
    : String(entry.data.date ?? '');

  return {
    slug: entry.id,
    title: entry.data.title,
    date: dateStr,
    excerpt: entry.data.description,
    tags: entry.data.tags ?? [],
    wordCount,
    readMinutes,
  };
}

export async function getArchivePosts(options: ArchiveDataOptions = {}): Promise<Post[]> {
  const { includeDrafts = false } = options;

  const entries = await getCollection('archives', (entry) => {
    return includeDrafts || !entry.data.draft;
  });

  entries.sort((a, b) => {
    const timeA = a.data.date instanceof Date ? a.data.date.getTime() : new Date(a.data.date).getTime();
    const timeB = b.data.date instanceof Date ? b.data.date.getTime() : new Date(b.data.date).getTime();
    return timeB - timeA;
  });

  return entries.map(formatArchivePost);
}

export const getArchiveData = getArchivePosts;
