// src/pages/robots.txt.ts
// Dynamic robots.txt so the Sitemap directive always tracks the configured
// `site` (and therefore the deploy base) without a hardcoded URL to maintain.
// Served at /robots.txt (under the deploy base, same as every other route).

import type { APIContext } from 'astro';
import { withBase } from '../lib/i18n';

export function GET(context: APIContext) {
  // `@astrojs/sitemap` writes sitemap-index.xml at the build root, served under
  // the deploy base. `withBase()` embeds the base into an absolute path
  // (/astro-content-hub/sitemap-index.xml), so resolving against `context.site`
  // yields the correct URL regardless of whether `site` has a trailing slash
  // (a bare relative ref would otherwise drop the base path segment).
  const sitemap = new URL(withBase('/sitemap-index.xml'), context.site).toString();
  const body = `User-agent: *
Allow: /

# Machine-readable corpus for AI tools: /llms.txt (index) and /llms-full.txt (full text).

Sitemap: ${sitemap}
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
