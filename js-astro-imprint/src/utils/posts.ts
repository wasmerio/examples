import type { CollectionEntry } from 'astro:content';
import { SITE } from '../config';
import { pathFor } from './paths';

export type Post = CollectionEntry<'posts'>;

export function sortPosts(posts: Post[]) {
  return posts.toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function postPath(post: Post) {
  return pathFor(post.id);
}

export function normalizeTerms(value?: string | string[]) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function excerpt(post: Post, length = 132) {
  if (post.data.description) return post.data.description;
  const text = (post.body ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~\-|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > length ? `${text.slice(0, length).trim()}…` : text;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat(SITE.locale, {
    timeZone: SITE.timeZone,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
}

export function dateParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SITE.timeZone,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(date);
  return {
    year: parts.find(part => part.type === 'year')?.value ?? '',
    month: parts.find(part => part.type === 'month')?.value ?? '',
  };
}
