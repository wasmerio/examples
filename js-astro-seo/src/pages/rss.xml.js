import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const blog = await getCollection('blog');

  // Filter out drafts and sort by date
  const items = blog
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      // Astro 5 Content Layer API uses post.id for the slug
      link: `/blog/${post.id}/`,
    }));

  return rss({
    title: 'Astro SEO Theme Blog',
    description: 'Insights and strategies on technical SEO, B2B marketing, and web performance.',
    site: context.site || 'https://astro-seo-theme.vercel.app',
    items,
    customData: `<language>en-us</language>`,
  });
}
