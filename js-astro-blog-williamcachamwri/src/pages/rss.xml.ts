import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

// Change back to uppercase GET to match what Astro is expecting in newer versions
export async function GET(context) {
  const posts = await getCollection('blog');
  
  // Sort posts by date in descending order
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf()
  );
  
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
      // Optional: include categories/tags as array
      categories: post.data.tags || [],
    })),
  });
}