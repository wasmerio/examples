import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { BASE_CONFIG } from '../config.ts';

export async function GET(context) {
  const posts = await getCollection('posts');
  
  // 按发布时间倒序排序
  const sortedPosts = posts
    .filter(post => !!post.data.published)
    .sort((a, b) => {
      const dateA = new Date(a.data.published);
      const dateB = new Date(b.data.published);
      return dateB - dateA;
    });
  
  return rss({
    title: BASE_CONFIG.title,
    description: BASE_CONFIG.subtitle,
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.published,
      description: post.data.description,
      link: `/post/${post.data.id ?? post.id}/`,
    })),
    customData: `<language>zh-cn</language>`,
  });
}
