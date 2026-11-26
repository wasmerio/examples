import type { APIRoute } from 'astro';

import { site } from '../data/site';

export const prerender = true;

export const GET: APIRoute = () => {
  const origin = new URL(site.seo.url).origin;
  const urls = [`${origin}/`];

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n') +
    `\n</urlset>\n`;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
