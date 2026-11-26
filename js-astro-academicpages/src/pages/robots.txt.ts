import type { APIRoute } from 'astro';

import { siteConfig } from '@data/siteConfig';
import { resolveUrl } from '@utils/url';

export const GET: APIRoute = ({ site }) => {
  const origin = site
    ? site.origin
    : siteConfig.url
      ? new URL(siteConfig.url).origin
      : '';
  const sitemapPath = resolveUrl('/sitemap-index.xml');
  const sitemapUrl = origin ? `${origin}${sitemapPath}` : sitemapPath;

  const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;

  return new Response(robotsTxt, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
