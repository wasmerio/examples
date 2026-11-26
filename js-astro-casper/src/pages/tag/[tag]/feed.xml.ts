import { getCollection, getEntry } from 'astro:content';
import { SITE_CONFIG, getAssetUrl } from '../../../config';
import { generateAtomFeed } from '../../../utils/feed';

export async function getStaticPaths() {
  const allPosts = await getCollection('posts');
  const tagSlugs = new Set<string>();
  
  allPosts.forEach(post => {
    post.data.tags.forEach(t => {
      if (t) {
        tagSlugs.add(t.toLowerCase().replace(/\s+/g, '-'));
      }
    });
  });
  
  return Array.from(tagSlugs).map(tag => ({
    params: { tag }
  }));
}

export async function GET(context: any) {
  const { tag } = context.params;
  
  const allPosts = await getCollection('posts');
  const filteredPosts = allPosts.filter(post => 
    post.data.tags.some(t => t.toLowerCase().replace(/\s+/g, '-') === tag)
  );
  filteredPosts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
  
  const siteUrl = context.site || 'https://casper.leons.dev/';
  const feedUrl = new URL(getAssetUrl(`/tag/${tag}/feed.xml`), siteUrl).toString();
  const indexUrl = new URL(getAssetUrl(`/tag/${tag}/`), siteUrl).toString();

  // Tag info from the data collection
  const tagEntry = tag ? await getEntry('tags', tag) : null;
  const tagInfo = tagEntry ? tagEntry.data : null;
  const tagName = tagInfo?.name || tag.replace(/-/g, ' ');
  const tagDescription = typeof tagInfo?.description === 'string' ? tagInfo.description : `A collection of posts filed under ${tagName}`;

  return generateAtomFeed(filteredPosts, {
    title: `${SITE_CONFIG.title} | ${tagName.charAt(0).toUpperCase() + tagName.slice(1)}`,
    description: tagDescription,
    feedUrl,
    indexUrl,
    siteUrl
  });
}
