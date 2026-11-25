import type { APIRoute } from 'astro';
import { getPosts } from '@assets/utils/posts';

/** Development-only manifest consumed by the Pagefind integration. */
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  return Response.json(
    posts
      .filter((post) => !post.data.exclude_in_search)
      .map((post) => `/posts/${post.id}`),
  );
};
