import type { APIContext } from 'astro';

export function GET({ site }: APIContext) {
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`,
  );
}
