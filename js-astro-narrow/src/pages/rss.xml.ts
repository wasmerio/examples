import { getLocalizedEntries } from '../lib/content/entries';
import { defaultLocale } from '../config/i18n';
import { renderRss } from '../lib/content/rss';

export async function GET({ site, url }: { site?: URL; url: URL }) {
  const posts = await getLocalizedEntries('posts', defaultLocale);
  const origin = site?.origin || url.origin;

  return new Response(renderRss(posts, origin, '/'), {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8'
    }
  });
}
