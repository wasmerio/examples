// /llms-full.txt - machine-readable full-text corpus (llmstxt.org
// convention): every page's markdown body concatenated, one per page with a
// `# <url>` separator, so AI tools and agents can ingest the hub's aggregated
// content without scraping. Default locale only (v1 decision).
import { defaultLocale } from '../lib/i18n';
import { buildLlmsFull } from '../lib/llms';

export async function GET() {
  const body = await buildLlmsFull(defaultLocale);
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
