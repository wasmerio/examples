// The feed, advertised in every page's <head>. It reads the same query the pages do, so a
// draft cannot reach it: if something unpublished ever turns up here, the filter has been
// copied somewhere it should not have been.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../config';
import { articleHref, getArticles } from '../lib/content';

export async function GET(context: APIContext) {
  const articles = await getArticles();

  return rss({
    title: site.name,
    description: site.description,
    site: context.site!,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.standfirst ?? article.data.deck,
      link: articleHref(article),
      pubDate: article.data.date,
      categories: [article.data.desk.id, ...(article.data.tags ?? [])],
    })),
  });
}
