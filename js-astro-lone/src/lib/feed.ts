import rss from '@astrojs/rss';
import { site } from 'lone/config';
import { published, hrefOf, opening, type Post } from './posts';

export const allPosts = published;

export function feed(posts: Post[], context: { site?: URL }, title: string, description: string) {
  return rss({
    title,
    description,
    site: context.site ?? site.url,
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: opening(post) || undefined,
        link: hrefOf(post),
      })),
    customData: `<language>${site.lang}</language>`,
  });
}
