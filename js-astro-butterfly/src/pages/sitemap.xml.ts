import type { APIRoute } from 'astro';
import { sitemapEntries } from '@/lib/sitemap';

export const GET: APIRoute = async () => {
  const urls = (await sitemapEntries())
    .map((e) => `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod.toISOString()}</lastmod>\n  </url>`)
    .join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
