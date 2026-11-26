// Generated rather than static: the sitemap line has to be an absolute URL, and the
// site URL is only known at build time (SITE_URL overrides src/config.ts).
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`, {
    headers: { 'Content-Type': 'text/plain' },
  });
