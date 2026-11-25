import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import config from '~/config';
import { getPosts } from '@assets/utils/posts';

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error('Astro site is required to generate RSS.');
  }

  const posts = await getPosts();
  const items = posts
    .map((post) => {
      const pubDate = new Date(post.data.publishDate);

      return {
        title: post.data.title,
        description: post.data.description,
        pubDate,
        link: `/posts/${post.id}`,
      };
    })
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: config.title,
    description: config.description ?? config.title,
    site,
    items,
    trailingSlash: false,
  });
};
