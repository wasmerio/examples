import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../config';
import { pathFor } from '../utils/paths';
import { excerpt, postPath, sortPosts } from '../utils/posts';

export async function GET(context: { site?: URL }) {
  const posts = sortPosts(await getCollection('posts')).filter(post => !post.data.noindex);
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: new URL(pathFor(), context.site ?? new URL(SITE.url)),
    items: posts.map(post => ({
      title: post.data.title,
      description: excerpt(post, 220),
      pubDate: post.data.date,
      link: postPath(post),
    })),
  });
}
