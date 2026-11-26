import { getCollection } from 'astro:content';
import { SITE_CONFIG, getAssetUrl } from '../config';
import { generateAtomFeed } from '../utils/feed';

export async function GET(context: any) {
  const posts = await getCollection('posts');
  posts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
  
  const siteUrl = context.site || 'https://casper.leons.dev/';
  
  return generateAtomFeed(posts, {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    feedUrl: new URL(getAssetUrl('/feed.xml'), siteUrl).toString(),
    indexUrl: new URL(getAssetUrl('/'), siteUrl).toString(),
    siteUrl
  });
}
