import type { APIRoute } from 'astro';

// A route, not a static file: the Sitemap line has to be an absolute URL built from
// `site` in astro.config.mjs. A relative one is what Lighthouse calls an invalid sitemap.
export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *
Allow: /

Sitemap: ${new URL('sitemap-index.xml', site)}
`,
    { headers: { 'Content-Type': 'text/plain' } },
  );
