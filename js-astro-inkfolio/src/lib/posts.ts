import { getCollection } from 'astro:content';
import type { Lang } from './config';

export const PER_PAGE = 4;

export interface PostRow {
  id: string;
  title: string;
  cover?: string;
  coverAlt?: string;
  description: string;
  date: Date;
  tags: string[];
}

export async function loadPosts(lang: Lang) {
  const collection = lang === 'zh' ? 'postsZh' : 'posts';
  const entries = (await getCollection(collection as 'posts' | 'postsZh'))
    .filter((e) => !e.data.draft)
    .sort((a, b) => {
      const pa = (a.data as any).pinned ?? 999;
      const pb = (b.data as any).pinned ?? 999;
      if (pa !== pb) return pa - pb;
      return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
    });

  const rows: PostRow[] = entries.map((e) => ({
    id: e.id,
    title: e.data.title,
    description: e.data.description,
    date: new Date(e.data.date),
    tags: e.data.tags ?? [],
    cover: (e.data as any).cover,
    pinned: (e.data as any).pinned,
    coverAlt: (e.data as any).coverAlt,
  }));

  return {
    total: rows.length,
    totalPages: Math.max(1, Math.ceil(rows.length / PER_PAGE)),
    page: (n: number) => rows.slice((n - 1) * PER_PAGE, n * PER_PAGE),
  };
}
