import { getCollection, getEntry } from 'astro:content';
import { SITE_CONFIG, getAssetUrl } from '../../../config';
import { generateAtomFeed } from '../../../utils/feed';

export async function getStaticPaths() {
  const allAuthors = await getCollection('authors');
  return allAuthors.map(authorEntry => ({
    params: { author: authorEntry.id }
  }));
}

export async function GET(context: any) {
  const { author } = context.params;
  
  const authorEntry = author ? await getEntry('authors', author) : null;
  const authorData = authorEntry ? authorEntry.data : null;

  if (!authorData) {
    return new Response('Author not found', { status: 404 });
  }

  const allPosts = await getCollection('posts');
  const filteredPosts = allPosts.filter(post => post.data.author && post.data.author.id === author);
  filteredPosts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
  
  const siteUrl = context.site || 'https://casper.leons.dev/';
  const feedUrl = new URL(getAssetUrl(`/author/${author}/feed.xml`), siteUrl).toString();
  const indexUrl = new URL(getAssetUrl(`/author/${author}/`), siteUrl).toString();

  return generateAtomFeed(filteredPosts, {
    title: `${SITE_CONFIG.title} | ${authorData.name}`,
    description: authorData.bio || `Posts by ${authorData.name}`,
    feedUrl,
    indexUrl,
    siteUrl
  });
}
