import config from './config';
import {
  postsFor,
  postHref,
  textEntriesFor,
  taxonomy,
  isIntroOnly,
  encodedSlug,
} from './content';
import { href } from './i18n';
import type { Locale } from '../types/config';

/** Actual rendered HTML destinations, including unlisted but routable content. */
export async function htmlRoutes(lang: Locale): Promise<string[]> {
  const paths = [
    '',
    'posts/',
    'archives/',
    'links/',
    'search/',
    'categories/',
    'tags/',
  ].map((route) => href(lang, route));
  for (const post of await postsFor(lang, true))
    paths.push(postHref(post, lang));
  const pages = Math.ceil((await postsFor(lang)).length / config.posts.perPage);
  for (let page = 2; page <= pages; page++)
    paths.push(href(lang, `posts/page/${page}/`));
  for (const page of await textEntriesFor('pages', lang))
    if (!isIntroOnly(page.data.slug))
      paths.push(href(lang, `${encodedSlug(page.data.slug)}/`));
  for (const kind of ['categories', 'tags'] as const)
    for (const group of await taxonomy(kind, lang, true))
      paths.push(href(lang, `${kind}/${encodedSlug(group.slug)}/`));
  return paths;
}
