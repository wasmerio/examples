import { site } from '../site.config';
import { getFeedItems } from '../utils/feed';
import { absoluteUrl } from '../utils/paths';
import { postSlug } from '../utils/posts';
import type { APIContext } from 'astro';

export async function GET(_context: APIContext) {
  const items = await getFeedItems();
  const siteUrl = absoluteUrl('/');
  const atomUrl = absoluteUrl('/atom.xml');
  const rssUrl = absoluteUrl('/rss.xml');

  const entries = items
    .map(({ post, html }) => {
      const link = absoluteUrl(`/posts/${postSlug(post)}/`);
      const published = post.data.date.toISOString().replace('+00:00', 'Z');
      const categories = post.data.tags
        .map((tag) => `<category term="${escapeXml(tag)}" />`)
        .join('');
      const summary = escapeXml(post.data.summary ?? site.description);

      return `
  <entry>
    <title>${escapeXml(post.data.title)}</title>
    <link href="${link}" />
    <id>${link}</id>
    <published>${published}</published>
    <updated>${published}</updated>
    <author><name>${escapeXml(site.author)}</name></author>
    ${categories}
    <summary>${summary}</summary>
    <content type="html">${escapeXml(html)}</content>
  </entry>`;
    })
    .join('');

  const updated =
    items[0]?.post.data.date.toISOString().replace('+00:00', 'Z') ??
    new Date().toISOString().replace('+00:00', 'Z');

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(site.title)}</title>
  <subtitle>${escapeXml(site.description)}</subtitle>
  <link href="${siteUrl}" rel="alternate" type="text/html" />
  <link href="${atomUrl}" rel="self" type="application/atom+xml" />
  <link href="${rssUrl}" rel="alternate" type="application/rss+xml" />
  <id>${siteUrl}</id>
  <updated>${updated}</updated>
  <author><name>${escapeXml(site.author)}</name></author>
  ${entries}
</feed>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  });
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
