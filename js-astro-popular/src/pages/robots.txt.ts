import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/url';

/* Generated so the Sitemap URL respects `site` + base path. @astrojs/sitemap
   emits sitemap-index.xml. */
export const GET: APIRoute = ({ site }) => {
  const sitemap = absoluteUrl('/sitemap-index.xml', site);
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain' },
  });
};
