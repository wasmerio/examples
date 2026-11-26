import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteConfig } from '../config/site';
import { getCategoryName, getDocHref, getRecentDocs } from '../lib/docs';

export const GET: APIRoute = async (context) => {
  const docs = getRecentDocs(await getCollection('docs'), Infinity);

  return rss({
    title: `${siteConfig.name} Updates`,
    description: `Recent documentation updates from ${siteConfig.name}.`,
    site: context.site ?? siteConfig.siteUrl,
    items: docs.map((doc) => ({
      title: doc.data.title,
      description: doc.data.description ?? `${getCategoryName(doc.data.category)} update from ${siteConfig.name}.`,
      pubDate: doc.data.updatedAt,
      link: getDocHref(doc),
    })),
    customData: `<language>${siteConfig.language}</language>`,
  });
};
