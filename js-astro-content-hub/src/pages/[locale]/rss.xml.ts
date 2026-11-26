// Per-locale posts feed for non-default locales (e.g. /zh-Hans/rss.xml).
// The default-locale feed is src/pages/rss.xml.ts (prefix-free /rss.xml).
// Adding a locale is picked up here automatically once it is in `locales`.
import type { APIContext } from 'astro';
import { buildPostsRss } from '../../lib/feed';
import { locales, defaultLocale, isLocale } from '../../lib/i18n';

export async function getStaticPaths() {
  return locales
    .filter((l) => l !== defaultLocale)
    .map((l) => ({ params: { locale: l } }));
}

export async function GET(context: APIContext) {
  const locale = context.params.locale;
  if (!locale || !isLocale(locale)) return new Response('Not found', { status: 404 });
  return buildPostsRss(locale, context);
}
