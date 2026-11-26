import type { APIRoute } from 'astro';
import { SITE } from '../consts.ts';

/** Generated so the Sitemap: line names the origin that was built — context.site
    rather than SITE.url, so a SITE_URL override reaches here too. */
export const GET: APIRoute = (context) => {
  // Concatenated, not new URL(): resolving against "https://host/repo" drops "/repo".
  const origin = (context.site ?? new URL(SITE.url)).href.replace(/\/$/, '');
  const sitemap = `${origin}/sitemap-index.xml`;

  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${sitemap}
`,
    { headers: { 'content-type': 'text/plain; charset=utf-8' } },
  );
};
