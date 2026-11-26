import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { site } from '../config/site';
import { getPosts } from '../utils/posts';
import { url } from '../utils/url';

export const GET: APIRoute = async (context) => {
  const posts = await getPosts();
  return rss({
    title: `${site.name} Journal`,
    description: site.description,
    site: new URL(import.meta.env.BASE_URL, context.site ?? 'http://localhost:4321').href,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: url(`/blog/${post.id}/`),
      categories: [post.data.category, ...post.data.tags],
      author: post.data.author,
    })),
    customData: `<language>${site.lang}</language>`,
  });
};
