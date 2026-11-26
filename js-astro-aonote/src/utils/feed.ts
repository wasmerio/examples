import { render } from 'astro:content';
import type { Post } from './posts';
import { getBlogPosts } from './posts';

export const FEED_ITEM_LIMIT = 10;

type RenderedPost = Post & {
  rendered?: { html?: string };
};

/** HTML body from the content layer cache, with one render() fallback. */
export async function getPostHtml(post: Post): Promise<string> {
  const entry = post as RenderedPost;
  if (entry.rendered?.html) return entry.rendered.html;
  await render(post);
  return (post as RenderedPost).rendered?.html ?? '';
}

export type FeedItem = {
  post: Post;
  html: string;
};

/** Blog posts prepared for RSS/Atom (limited, with rendered HTML). */
export async function getFeedItems(): Promise<FeedItem[]> {
  const posts = (await getBlogPosts()).slice(0, FEED_ITEM_LIMIT);
  return Promise.all(
    posts.map(async (post) => ({
      post,
      html: await getPostHtml(post),
    })),
  );
}
