// The feed carries every published piece, newest issue first. Pages advertise it in <head>.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../config';
import { articleHref, getIssueArticles, getIssues } from '../lib/content';

export async function GET(context: APIContext) {
  const items = [];
  for (const issue of await getIssues())
    for (const article of await getIssueArticles(issue))
      items.push({
        title: article.data.title,
        description: article.data.subtitle ?? issue.data.coverLine,
        link: articleHref(issue, article),
        // An issue dates its pieces: they are published together, not one by one.
        pubDate: issue.data.date,
        categories: [article.data.department],
      });

  return rss({
    title: site.name,
    description: site.description,
    site: context.site!,
    items,
  });
}
