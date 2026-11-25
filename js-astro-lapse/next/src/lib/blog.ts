// GENERATED from src/lib/blog.ts
/** Blog helpers shared by /blog, the post pages and BlogRow. */
import type { Post } from './blog-loader';
export { getPosts, type Post } from './blog-loader';



/** The large card on /blog: featured posts first, then the newest. */
export function pickFeatured(posts: Post[]): Post | undefined {
  return [...posts].sort((a, b) => Number(b.data.featured) - Number(a.data.featured))[0];
}

export const postUrl = (post: Post) => `/blog/${post.id}`;

/** Framer's "medium" date style, e.g. "Sep 12, 2026". */
export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
