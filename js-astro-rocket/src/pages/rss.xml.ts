import type { APIContext } from 'astro';
import { buildRssFeed } from '@/lib/rss';
import { getRssUrl } from '@/lib/blog';
import { defaultLocale } from '@/i18n';

/**
 * The default locale's feed, at the site root. Secondary locales get their own
 * at `/<locale>/rss.xml` — see `src/pages/[locale]/rss.xml.ts`. The XML itself
 * lives in `lib/rss` so the two routes cannot drift.
 */
export async function GET(context: APIContext) {
  const rss = await buildRssFeed({
    locale: defaultLocale,
    site: context.site?.toString(),
    feedPath: getRssUrl(defaultLocale),
  });

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
