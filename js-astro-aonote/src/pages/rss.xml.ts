import rss from '@astrojs/rss';
import { site } from '../site.config';
import { getFeedItems } from '../utils/feed';
import { absoluteUrl } from '../utils/paths';
import { postSlug } from '../utils/posts';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const items = await getFeedItems();

  return rss({
    title: site.title,
    description: site.description,
    site: context.site!,
    items: items.map(({ post, html }) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: absoluteUrl(`/posts/${postSlug(post)}/`),
      content: html,
      categories: post.data.tags,
      author: site.author,
    })),
    customData: `<language>${site.language}</language>`,
    xmlns: {
      content: 'http://purl.org/rss/1.0/modules/content/',
    },
  });
}
