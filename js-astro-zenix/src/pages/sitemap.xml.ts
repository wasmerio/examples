import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_URL } from '../config';

type SitemapEntry = {
  path: string;
  lastmod?: Date;
};

const staticEntries: SitemapEntry[] = [
  { path: '/' },
  { path: '/login/' },
  { path: '/signup/' },
  { path: '/pricing/' },
  { path: '/blog/' },
  { path: '/changelog/' },
  { path: '/privacy/' },
  { path: '/terms/' },
];

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', ({ data }) => data.draft !== true);
  const entries = [
    ...staticEntries,
    ...posts.map((post) => ({
      path: `/blog/${post.id}/`,
      lastmod: post.data.updatedDate ?? post.data.pubDate,
    })),
  ];

  const urls = entries
    .map((entry) => {
      const loc = new URL(entry.path, SITE_URL).href;
      const lastmod = entry.lastmod ? `\n    <lastmod>${formatDate(entry.lastmod)}</lastmod>` : '';

      return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod}
  </url>`;
    })
    .join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
