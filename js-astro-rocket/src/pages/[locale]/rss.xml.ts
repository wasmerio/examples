import type { APIContext } from 'astro';
import { buildRssFeed } from '@/lib/rss';
import { getRssUrl, getSecondaryLocales } from '@/lib/blog';

/**
 * A feed per secondary locale, at `/<locale>/rss.xml`.
 *
 * Emits nothing when i18n is off or only one locale is configured, so
 * single-locale builds are unchanged — the same rule the locale-prefixed blog
 * routes follow. A locale with no posts yet still gets a feed rather than a
 * 404, so the link in the page head is never broken.
 */
export function getStaticPaths() {
  return getSecondaryLocales().map((locale) => ({ params: { locale } }));
}

export async function GET(context: APIContext) {
  const locale = context.params.locale as string;

  const rss = await buildRssFeed({
    locale,
    site: context.site?.toString(),
    feedPath: getRssUrl(locale),
  });

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
