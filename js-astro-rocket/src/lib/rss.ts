import { getCollection } from 'astro:content';
import siteConfig from '@/config/site.config';
import { getPostUrl } from '@/lib/blog';
import { defaultLocale } from '@/i18n';

/**
 * RSS feed generation, shared by `/rss.xml` and `/<locale>/rss.xml`.
 *
 * The feed used to be built inline in the default-locale route, filtered to
 * the default locale's posts and hardcoded `/blog/<slug>` links. Every page in
 * every locale linked to it, so a reader on a translated page was offered a
 * feed in a language they had not asked for, with links to pages in that other
 * language. Moving the body here lets each locale have its own feed without
 * two copies of the XML drifting apart.
 */

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatRfc822Date(date: Date): string {
  return date.toUTCString();
}

interface BuildFeedOptions {
  /** The locale this feed is for. Decides the posts, the links and the language. */
  locale?: string;
  /** The site's own address, from `Astro.site` where available. */
  site?: string;
  /** Path this feed is served at, for the self-referencing atom:link. */
  feedPath?: string;
}

export async function buildRssFeed({
  locale = defaultLocale,
  site,
  feedPath = '/rss.xml',
}: BuildFeedOptions = {}): Promise<string> {
  const posts = await getCollection('blog', ({ data }) => data.locale === locale && !data.draft);

  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime()
  );

  const base = (site ?? siteConfig.url).replace(/\/$/, '');

  const items = sortedPosts
    .map((post) => {
      // getPostUrl prefixes the locale for every locale but the default one,
      // so a translated feed links to the translated pages.
      const link = `${base}${getPostUrl(post.id, locale)}/`;
      const categories = post.data.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join('\n        ');

      return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <description>${escapeXml(post.data.description)}</description>
      <pubDate>${formatRfc822Date(post.data.publishedAt)}</pubDate>
      <author>${escapeXml(post.data.author)}</author>
      ${categories}
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <description>${escapeXml(siteConfig.description)}</description>
    <link>${base}</link>
    <atom:link href="${base}${feedPath}" rel="self" type="application/rss+xml"/>
    <language>${locale}</language>
    <lastBuildDate>${formatRfc822Date(new Date())}</lastBuildDate>
${items}
  </channel>
</rss>`;
}
