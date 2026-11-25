/** Blog helpers shared by /blog, the post pages and BlogRow. */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Every post, newest first (the Framer lists all sort by Date, descending). */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** The large card on /blog: featured posts first, then the newest. */
export function pickFeatured(posts: Post[]): Post | undefined {
  return [...posts].sort((a, b) => Number(b.data.featured) - Number(a.data.featured))[0];
}

export const postUrl = (post: Post) => `/blog/${post.id}`;

/** Framer's "medium" date style, e.g. "Sep 12, 2026". */
export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
