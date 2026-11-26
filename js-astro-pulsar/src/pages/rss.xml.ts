import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE_CONFIG } from '@/config';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => data.published === true);
  const sorted = posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    site: context.site!,
    items: sorted.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `${import.meta.env.BASE_URL}blog/${post.id}`,
    })),
    customData: `<language>${SITE_CONFIG.language}</language>`,
  });
}
