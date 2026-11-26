import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { siteConfig } from '../config/site';
import { getPosts } from '../utils/blog';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return rss({
    title: `${siteConfig.name} — Insights`,
    description: siteConfig.description,
    site: new URL(import.meta.env.BASE_URL, context.site ?? 'https://st-ai-agency.vercel.app').href,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `${base}/blog/${post.id}/`,
      categories: [post.data.category, ...post.data.tags],
      author: `${siteConfig.email} (${post.data.author})`,
    })),
    customData: `<language>${siteConfig.lang}</language>`,
  });
}
