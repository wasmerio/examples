import { SITE_CONFIG } from '../config/site.js';
import { renderSitemap } from '../lib/seo.js';

export function GET() {
  return new Response(renderSitemap(SITE_CONFIG.siteUrl, process.env.BASE_PATH ?? SITE_CONFIG.basePath), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
