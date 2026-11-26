import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE } from '../consts.ts';
import { FEATURES, FEED_SOURCE, disabled } from '../features.ts';
import { feedItems as fromPosts } from '../lib/feed/fromPosts.ts';
import { feedItems as fromPapers } from '../lib/feed/fromPapers.ts';
import { siteText } from '../lib/pages.ts';

/** The feed, at /feed.xml. Deliberately not tied to the blog: FEED_SOURCE
    says which collection it lists, and a project site with no blog feeds its
    paper pages instead. */
export const GET: APIRoute = async (context) => {
  if (!FEATURES.feed) return disabled();

  const items = await (FEED_SOURCE === 'posts' ? fromPosts : fromPapers)();

  // Newest first, undated last: the source collection's order is not chronological.
  items.sort(
    (first, second) =>
      (second.pubDate?.getTime() ?? -Infinity) - (first.pubDate?.getTime() ?? -Infinity),
  );

  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const site = context.site ?? new URL(SITE.url);

  // The site's own title and description, from src/content/pages/site/site.md.
  const { title, description } = await siteText();

  return rss({
    title,
    description,
    site,
    items: items.map((item) => ({
      title: item.title,
      description: item.description,
      ...(item.pubDate ? { pubDate: item.pubDate } : {}),
      /*
       * Absolute, and built here: an RSS <link> is an element body, out of the
       * base-paths integration's reach, and @astrojs/rss re-shapes a relative
       * one to match `trailingSlash`. Either way the links 404.
       */
      link: new URL(`${base}${item.path}`, site).href,
      categories: item.categories,
    })),
    customData: `<language>${SITE.lang}</language>`,
  });
};
