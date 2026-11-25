import { getRssString } from '@astrojs/rss';

import { SITE, METADATA, APP_BLOG, I18N } from 'astrowind:config';
import { fetchPosts } from '~/utils/blog';
import { getPermalink } from '~/utils/permalinks';

// The feed is generated from the build-time content collection, so keep it
// prerendered even if the project opts into on-demand rendering.
export const prerender = true;

export const GET = async () => {
  if (!APP_BLOG.isEnabled) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const posts = await fetchPosts();

  const rss = await getRssString({
    title: `${SITE.name}’s Blog`,
    description: METADATA?.description || '',
    site: import.meta.env.SITE,

    items: posts.map((post) => ({
      link: getPermalink(post.permalink, 'post'),
      title: post.title,
      description: post.excerpt,
      pubDate: post.publishDate,
      ...(post.author ? { author: post.author } : {}),
      categories: [...(post.category ? [post.category.title] : []), ...(post.tags ?? []).map((tag) => tag.title)],
    })),

    trailingSlash: SITE.trailingSlash,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      `<language>${I18N?.language || 'en'}</language>`,
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
      `<atom:link href="${new URL(getPermalink('rss.xml', 'asset'), import.meta.env.SITE)}" rel="self" type="application/rss+xml" />`,
    ].join(''),
  });

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
