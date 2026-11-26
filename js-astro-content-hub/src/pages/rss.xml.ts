// Default-locale (en) posts feed at /rss.xml.
import type { APIContext } from 'astro';
import { buildPostsRss } from '../lib/feed';

export async function GET(context: APIContext) {
  return buildPostsRss('en', context);
}
