import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllArticles } from '../lib/content';

export async function GET(context: APIContext) {
  const articles = await getAllArticles();

  return rss({
    title: 'The Headless Journal',
    description: 'Modern publishing, powered by WordPress and Astro.',
    site: context.site || 'https://demo.headless-journal.local',
    items: articles.map((article) => ({
      title: article.title,
      pubDate: new Date(article.publishedAt),
      description: article.excerpt,
      link: `/blog/${article.slug}`,
      categories: [article.category.name],
    })),
    customData: `<language>en-us</language>`,
  });
}

