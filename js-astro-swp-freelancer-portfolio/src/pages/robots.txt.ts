import type { APIContext } from 'astro';

/**
 * Generated rather than static so the sitemap URL always matches the
 * `site` value configured in `astro.config.mjs`.
 */
export function GET(context: APIContext) {
  const sitemap = new URL('sitemap-index.xml', context.site ?? 'http://localhost:4321').href;

  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
}
