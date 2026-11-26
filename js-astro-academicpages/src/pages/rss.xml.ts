import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

import { siteConfig } from '@data/siteConfig';
import { getPostUrl, getPublicationUrl } from '@utils/url';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const publications = await getCollection('publications');

  const postItems = posts.map((post) => ({
    title: post.data.title,
    pubDate: post.data.date,
    description: post.data.description || '',
    link: getPostUrl(post),
  }));

  const publicationItems = publications.map((pub) => ({
    title: pub.data.title,
    pubDate: pub.data.date,
    description: pub.data.description || pub.data.citation || '',
    link: getPublicationUrl(pub),
  }));

  const allItems = [...postItems, ...publicationItems].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site?.toString() || siteConfig.url,
    items: allItems,
    customData: `<language>${siteConfig.locale}</language>`,
  });
}
