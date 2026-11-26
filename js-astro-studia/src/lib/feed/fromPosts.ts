import { publishedPosts, permalink } from '../blog.ts';
import type { FeedItem } from './types.ts';

/** Feed items from the blog (the default). publishedPosts() drops drafts — a
    feed is the one surface where publishing by accident cannot be undone. */
export async function feedItems(): Promise<FeedItem[]> {
  const posts = await publishedPosts();
  return posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.date,
    path: permalink(post.id),
    categories: post.data.tags,
  }));
}
