import type { APIContext } from 'astro';
import { site, withBase } from '../data/site';

export function GET(context: APIContext) {
  const sitemapUrl = new URL(withBase('/sitemap-index.xml'), context.site ?? site.url);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
