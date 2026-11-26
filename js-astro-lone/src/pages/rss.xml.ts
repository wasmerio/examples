import { site } from 'lone/config';
import { allPosts, feed } from '../lib/feed';

export const prerender = true;

export async function GET(context: { site?: URL }) {
  return feed(
    await allPosts(),
    context,
    site.rssTitle || `${site.name} — ${site.motto}`,
    site.description,
  );
}
