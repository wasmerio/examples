import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../site';
import { link } from '../lib/url';
import { getPosts, postPath } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: new URL(link('/'), context.site),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      categories: post.data.tags,
      author: SITE.author,
      link: link(postPath(post)),
    })),
    customData: `<language>${SITE.lang.toLowerCase()}</language>`,
  });
}
