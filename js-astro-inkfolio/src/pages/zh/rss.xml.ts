import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../../lib/config';

export async function GET(context: APIContext) {
  const posts = (await getCollection('postsZh'))
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  return rss({
    title: site.nameZh,
    description: site.descriptionZh,
    site: context.site ?? site.url,
    items: posts.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: new Date(entry.data.date),
      link: `/zh/posts/${entry.id}/`,
    })),
  });
}
