import type { APIRoute } from 'astro';
import { getPosts, postUrl, tagUrl, excerpt } from '@/lib/posts';
import { site, feed } from '@/config';
import { absolute } from '@/lib/url';
import { optimize, imagePresets } from '@/lib/images';

/**
 * Atom ids are permanent identifiers, not links. If an earlier feed minted them under
 * another origin (a Hexo `url: http://…`), `feed.idOrigin` keeps them byte-identical so
 * readers don't re-announce every post after a move.
 */
const feedId = (href: string) => (feed.idOrigin ? href.replace(new URL(href).origin, feed.idOrigin.replace(/\/$/, '')) : href);

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);

/** Atom feed at the Hexo-era address (/atom.xml), all posts, newest first. */
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const updated = posts.reduce((d, p) => (p.data.updated > d ? p.data.updated : d), new Date(0));

  const entries = posts
    .map((p) => {
      const link = absolute(postUrl(p));
      return `  <entry>
    <title>${esc(p.data.title)}</title>
    <link href="${link}"/>
    <id>${feedId(link)}</id>
    <published>${p.data.date.toISOString()}</published>
    <updated>${p.data.updated.toISOString()}</updated>
    <summary type="text">${esc(excerpt(p, 200))}</summary>
${p.data.categories.map((c) => `    <category term="${esc(c)}" scheme="${absolute('/categories/')}"/>`).join('\n')}
${p.data.tags.map((t) => `    <category term="${esc(t)}" scheme="${absolute(tagUrl(t))}"/>`).join('\n')}
  </entry>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${esc(site.title)}</title>
  <subtitle>${esc(site.subtitle)}</subtitle>
  <icon>${absolute((await optimize(site.logo, imagePresets.feedIcon)).src)}</icon>
  <link href="${absolute('/atom.xml')}" rel="self"/>
  <link href="${absolute('/')}"/>
  <updated>${updated.toISOString()}</updated>
  <id>${feedId(absolute('/'))}</id>
  <author><name>${esc(site.author)}</name></author>
  <generator uri="https://astro.build/">Astro</generator>
${entries}
</feed>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
};
