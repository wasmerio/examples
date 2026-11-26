// A route, not a static file: the sitemap line has to be an absolute URL, and the site URL
// comes from config.ts (or SITE_URL at build time). Lighthouse fails a relative one.
import type { APIContext } from 'astro';

export function GET({ site }: APIContext) {
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`,
  );
}
