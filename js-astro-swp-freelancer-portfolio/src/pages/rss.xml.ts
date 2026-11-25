import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import siteConfig from '~/config/site';
import { isVisible } from '~/lib/utils';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog'))
    .filter(isVisible)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${siteConfig.name} — Journal`,
    description: siteConfig.description,
    site: context.site ?? siteConfig.url,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/journal/${post.id}/`,
      categories: [post.data.category, ...post.data.tags],
      author: post.data.author,
    })),
    customData: `<language>${siteConfig.locale}</language>`,
  });
}
