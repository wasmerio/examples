import type { APIRoute } from 'astro';
import { site } from 'lone/config';

export const prerender = true;

export const GET: APIRoute = () => {
  const origin = site.url.replace(/\/$/, '');
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap-index.xml\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
