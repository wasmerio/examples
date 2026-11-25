import type { APIRoute } from 'astro';
import { SITE_URL } from '../config';

export const GET: APIRoute = () => {
  const sitemapURL = new URL('/sitemap.xml', SITE_URL);

  return new Response(`User-agent: *
Allow: /
Sitemap: ${sitemapURL.href}
`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
