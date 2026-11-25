import { getCollection } from 'astro:content';
import { locales } from '../config/i18n';
import { getLocalePath } from '../config/i18n';
import { localizedEntryPath } from '../lib/content/entries';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function GET({ site, url }: { site?: URL; url: URL }) {
  const origin = (site?.origin || url.origin).replace(/\/$/, '');
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const pages = await getCollection('pages', ({ data }) => !data.draft);

  const staticPaths = locales.flatMap((locale) => [
    getLocalePath(locale, '/'),
    getLocalePath(locale, '/posts/'),
    getLocalePath(locale, '/projects/'),
    getLocalePath(locale, '/archives/'),
    getLocalePath(locale, '/rss.xml')
  ]);

  const postPaths = posts.map((entry) => localizedEntryPath('posts', entry));
  const pagePaths = pages.map((entry) => localizedEntryPath('pages', entry));
  const urls = [...new Set([...staticPaths, ...postPaths, ...pagePaths])]
    .map((path) => `<url><loc>${escapeXml(`${origin}${path}`)}</loc></url>`)
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    {
      headers: {
        'content-type': 'application/xml; charset=utf-8'
      }
    }
  );
}
