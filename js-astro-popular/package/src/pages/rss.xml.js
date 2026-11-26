import rss from '@astrojs/rss';
import { safeCollection } from '../lib/collections';
import { withBase, absoluteUrl } from '../lib/url';
import { SITE, SECTIONS_MAP } from 'popular:config';

const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function GET(context) {
  const posts = (await safeCollection('blog'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => +b.data.date - +a.data.date);
  const allAuthors = await safeCollection(SECTIONS_MAP.authors);
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: absoluteUrl('/', context.site),
    xmlns: { dc: 'http://purl.org/dc/elements/1.1/' },
    items: posts.map((post) => {
      const names = [
        ...post.data.authors.map((slug) => allAuthors.find((a) => a.id === slug)?.data.title ?? slug),
        ...post.data.guestAuthors.map((g) => g.name),
      ];
      if (!names.length && post.data.author) names.push(post.data.author);
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: withBase(`/blog/${post.id}/`),
        categories: post.data.tags,
        customData: names.length ? `<dc:creator>${escapeXml(names.join(', '))}</dc:creator>` : undefined,
      };
    }),
  });
}
