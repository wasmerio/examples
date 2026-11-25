import { pageLocale } from '../../lib/i18n';
import type { APIRoute } from 'astro';
import {
  discoverablePosts,
  postHref,
  textEntriesFor,
  encodedSlug,
  isIntroOnly,
  introFor,
  taxonomy,
} from '../../lib/content';
import { href } from '../../lib/i18n';
import { introRoutes } from '../../lib/intro-config';
import type { SearchEntry } from '../../lib/search';
export const GET: APIRoute = async ({ routePattern }) => {
  const lang = pageLocale(routePattern);
  // Development-only fallback; production search uses Pagefind's chunked index.
  const posts = import.meta.env.DEV ? await discoverablePosts(lang) : [];
  const records: SearchEntry[] = posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    body: post.body ?? '',
    url: postHref(post, lang),
    kind: 'posts',
  }));
  if (import.meta.env.DEV) {
    for (const kind of ['pages', 'categories', 'tags'] as const) {
      const publicTerms =
        kind === 'pages'
          ? undefined
          : new Set((await taxonomy(kind, lang)).map((group) => group.slug));
      for (const entry of await textEntriesFor(kind, lang)) {
        if (
          entry.data.hidden ||
          entry.data.draft ||
          (publicTerms && !publicTerms.has(entry.data.slug)) ||
          (kind === 'pages' && isIntroOnly(entry.data.slug))
        )
          continue;
        records.push({
          title: entry.data.title,
          description: entry.data.description,
          body: entry.body ?? '',
          kind,
          url: href(
            lang,
            `${kind === 'pages' ? '' : `${kind}/`}${encodedSlug(entry.data.slug)}/`,
          ),
        });
      }
    }
    for (const route of introRoutes) {
      const entry = await introFor(route, lang);
      if (!entry || entry.data.hidden || entry.data.draft) continue;
      records.push({
        title: entry.data.title,
        description: entry.data.description,
        body: entry.body ?? '',
        kind: 'pages',
        url: href(lang, `${route}/`),
      });
    }
  }
  return new Response(JSON.stringify(records), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
