// /llms.txt - machine-readable corpus index (llmstxt.org convention): a
// plain-text list of the hub's pages so AI tools and agents can discover the
// aggregated content without scraping. Default locale only (v1 decision).
import { defaultLocale } from '../lib/i18n';
import { buildLlmsIndex } from '../lib/llms';

export async function GET() {
  const body = await buildLlmsIndex(defaultLocale);
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
