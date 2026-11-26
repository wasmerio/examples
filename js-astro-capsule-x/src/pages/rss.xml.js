import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '../config';

export async function GET(context) {
  // If RSS is disabled, return empty feed
  if (!siteConfig.features?.rss) {
    return rss({
      title: siteConfig.title,
      description: siteConfig.description,
      site: context.site,
      items: [],
    });
  }

  const blog = await getCollection('blog');

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    items: blog
      .filter(post => !post.data.draft)
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map(post => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/${post.id}/`,
      })),
    customData: `<language>en-us</language>`,
  });
}
