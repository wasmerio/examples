import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { parseInline } from '@utils/marked';
import {
  getPortfolioUrl,
  getPostUrl,
  getPublicationUrl,
  getTalkUrl,
  getTeachingUrl,
  resolveUrl,
} from '@utils/url';

export const GET: APIRoute = async () => {
  const [posts, publications, talks, teaching, portfolio, pages] =
    await Promise.all([
      getCollection('blog', ({ data }) => !data.draft),
      getCollection('publications'),
      getCollection('talks'),
      getCollection('teaching'),
      getCollection('portfolio'),
      getCollection('pages'),
    ]);

  const searchData = [
    ...posts.map((p) => ({
      title: parseInline(p.data.title),
      url: getPostUrl(p),
      type: 'Blog Post',
      date: p.data.date,
      description: parseInline(p.data.description),
    })),
    ...publications.map((p) => ({
      title: parseInline(p.data.title),
      url: getPublicationUrl(p),
      type: 'Publication',
      date: p.data.date,
      description: parseInline(p.data.description),
    })),
    ...talks.map((t) => ({
      title: parseInline(t.data.title),
      url: getTalkUrl(t),
      type: 'Talk',
      date: t.data.date,
      description: parseInline(t.data.description),
    })),
    ...teaching.map((t) => ({
      title: parseInline(t.data.title),
      url: getTeachingUrl(t),
      type: 'Teaching',
      description: parseInline(t.data.description),
    })),
    ...portfolio.map((p) => ({
      title: parseInline(p.data.title),
      url: getPortfolioUrl(p),
      type: 'Portfolio',
      description: parseInline(p.data.description),
    })),
    ...pages.map((p) => ({
      title: parseInline(p.data.title),
      url: resolveUrl(p.id === 'about' ? '/' : `/${p.id}/`),
      type: 'Page',
      description: parseInline(p.data.description),
    })),
    {
      title: 'CV',
      url: resolveUrl('/cv/'),
      type: 'Page',
      description: 'Curriculum Vitae',
    },
    {
      title: 'Sitemap',
      url: resolveUrl('/sitemap/'),
      type: 'Page',
      description: 'Overview of all pages and collections',
    },
  ];

  return new Response(JSON.stringify(searchData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
