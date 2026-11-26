import { SITE_CONFIG } from '../config/site.js';
import { renderRobots } from '../lib/seo.js';

export function GET() {
  return new Response(renderRobots(SITE_CONFIG.siteUrl, process.env.BASE_PATH ?? SITE_CONFIG.basePath), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
