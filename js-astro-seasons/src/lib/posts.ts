import type { CollectionEntry } from 'astro:content';

export function postSlug(post: CollectionEntry<'blog'>): string {
  return post.id.replace(/\.(md|mdx)$/i, '');
}

export function formatPostDate(date: Date): string {
  return date.toLocaleDateString('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
