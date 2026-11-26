/**
 * robots.txt — generated at build time from site-config so the Sitemap URL
 * is always correct and stays in sync with the `site` value in astro.config.mjs.
 *
 * To block specific paths add them to the `Disallow` list below.
 * Docs: https://developers.google.com/search/docs/crawling-indexing/robots/intro
 */

import type { APIRoute } from 'astro';
import { siteConfig } from 'site-config';

// Prerender so this is emitted as a static file at build time.
export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  // `site` comes from astro.config.mjs → site option.
  // Fall back to siteConfig.site if Astro's site is not configured.
  const baseUrl = site?.toString().replace(/\/$/, '') ?? siteConfig.site;

  const content = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${baseUrl}/sitemap-index.xml`,
  ].join('\n');

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
