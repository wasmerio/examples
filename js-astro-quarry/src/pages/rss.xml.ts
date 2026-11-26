// The writing feed. Descriptions only, no rendered bodies: the posts contain code
// blocks and tables that no reader renders the same way twice.
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { site, ui } from '../config';
import { getPosts } from '../lib/content';

export const GET: APIRoute = async (context) => {
  const posts = await getPosts();
  return rss({
    title: ui.blog.feed,
    description: site.description,
    site: context.site!,
    items: posts.map(({ id, data }) => ({
      title: data.title,
      description: data.description,
      pubDate: data.pubDate,
      link: `/blog/${id}`,
      categories: data.tags,
    })),
  });
};
