import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../site';
import { slugify } from './url';

export type Post = CollectionEntry<'posts'>;

/** Published posts, newest first. Each one carries its issue number (oldest is 1). */
export async function getPosts(): Promise<Array<Post & { number: number }>> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return posts.map((post, index) => Object.assign(post, { number: posts.length - index }));
}

export function postPath(post: Post): string {
  return `/posts/${post.id}/`;
}

export function tagPath(tag: string): string {
  return `/tags/${slugify(tag)}/`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString(SITE.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function readingTime(text: string = ''): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

export function pad(number: number): string {
  return String(number).padStart(2, '0');
}

/** Every tag in use, with its posts, sorted by name. */
export async function getTags() {
  const posts = await getPosts();
  const tags = new Map<string, { name: string; slug: string; posts: typeof posts }>();
  for (const post of posts) {
    for (const name of post.data.tags) {
      const slug = slugify(name);
      const entry = tags.get(slug) ?? { name, slug, posts: [] };
      entry.posts.push(post);
      tags.set(slug, entry);
    }
  }
  return [...tags.values()].sort((a, b) => a.name.localeCompare(b.name));
}
