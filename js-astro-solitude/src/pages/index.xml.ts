import { getPosts } from '@/lib/content';
import { rss } from '@/lib/content/feeds';
export async function GET() {
  return new Response(rss(await getPosts()), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
