import type { APIRoute } from 'astro';
import { sitemapEntries } from '@/lib/sitemap';

export const GET: APIRoute = async () =>
  new Response(`${(await sitemapEntries()).map((e) => e.loc).join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
