import type { APIRoute } from 'astro';

// The sitemap URL comes from site.url in lemma.config.mjs (Astro's `site`).
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
