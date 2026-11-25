import type { CollectionEntry } from 'astro:content';

// Route slug for a post: its file id without the markdown extension.
// Used everywhere a /blog/<slug>/ URL is built, so the rule lives once.
export function postSlug(post: CollectionEntry<'blog'>): string {
  return post.id.replace(/\.(md|mdx)$/i, '');
}

// The one date format posts display, e.g. "January 1, 2026".
export function formatPostDate(date: Date): string {
  return date.toLocaleDateString('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
