import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import siteConfig from '../config/site';

export async function GET(context: APIContext) {
  const blog = await getCollection('blog');
  const sortedPosts = blog.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site || siteConfig.url,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id.replace(/\.(md|mdx)$/, '')}/`,
      categories: [post.data.category, ...(post.data.tags || [])],
      author: post.data.author || siteConfig.author.name,
    })),
    customData: `<language>en-us</language><copyright>© ${new Date().getFullYear()} ${siteConfig.footer.copyright}</copyright>`,
  });
}


