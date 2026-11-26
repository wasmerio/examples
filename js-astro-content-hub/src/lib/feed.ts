// Shared RSS builder for the posts feed. Both /rss.xml (default locale) and
// /[locale]/rss.xml (non-default locales, e.g. /zh-Hans/rss.xml) delegate
// here so the locale is the only difference.
//
// Links are prefixed with the deploy base via `withBase()` before being handed
// to `@astrojs/rss`, which resolves each item link against `site` with
// `new URL(link, site)`. Because the base path is already embedded in the link
// (e.g. /astro-content-hub/posts/foo), the resolved absolute URL keeps the base
// under a sub-path deploy.

import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getLocalizedPosts } from './content';
import { siteName, localizePath, withBase, type Locale } from './i18n';

export async function buildPostsRss(locale: Locale, context: APIContext) {
  const items = await getLocalizedPosts(locale);
  // Newest first; cap at 20 to keep the feed lean.
  const sorted = items
    .sort((a, b) => b.entry.data.date.getTime() - a.entry.data.date.getTime())
    .slice(0, 20);

  const site = context.site ?? new URL('http://localhost');

  return rss({
    title: `${siteName} - Posts`,
    description: 'Technical articles from the content hub - guides, notes, and announcements.',
    site,
    items: sorted.map(({ entry }) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: withBase(localizePath(`/posts/${entry.id}`, locale)),
    })),
  });
}
