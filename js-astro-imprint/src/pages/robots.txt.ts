import type { APIRoute } from 'astro';
import { SITE } from '../config';
import { pathFor } from '../utils/paths';

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ?? new URL(SITE.url);
  const sitemapUrl = new URL(pathFor('sitemap-index.xml'), siteUrl);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`);
};
