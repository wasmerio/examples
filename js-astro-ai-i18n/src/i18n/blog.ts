import { getCollection, type CollectionEntry } from 'astro:content';

import { defaultLocale, type Locale } from './config';

export type Post = CollectionEntry<'blog'>;

/**
 * One post as a locale sees it: which entry to render, and whether that entry
 * is actually in that language.
 *
 * `slug` is the shared key ("quiet-tools"), `entry` is what renders, and
 * `translated` is false when `entry` is the English original standing in for a
 * translation that does not exist. Every route needs all three, and each one
 * deriving them separately is three chances to derive them differently.
 */
export interface LocalizedPost {
  slug: string;
  entry: Post;
  source: Post;
  translated: boolean;
}

const slugOf = (post: Post) => post.id.split('/').slice(1).join('/');
const localeOf = (post: Post) => post.id.split('/')[0] as Locale;

/**
 * Every post, in the order a reader should meet them.
 *
 * ENGLISH IS THE INDEX. The set of posts, their order and their dates come
 * from `en/`, so a locale cannot publish a post English does not have, and a
 * translation cannot quietly drop one. A French file with no English original
 * is a mistake worth catching rather than a page worth serving:
 * `npm run i18n:check` fails on it.
 */
export async function localizedPosts(locale: Locale): Promise<LocalizedPost[]> {
  const all = await getCollection('blog');
  const sources = all
    .filter((post) => localeOf(post) === defaultLocale)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return sources.map((source) => {
    const slug = slugOf(source);
    const translation =
      locale === defaultLocale
        ? undefined
        : all.find((post) => post.id === `${locale}/${slug}`);
    return {
      slug,
      source,
      entry: translation ?? source,
      translated: locale === defaultLocale || translation !== undefined,
    };
  });
}

export async function localizedPost(
  locale: Locale,
  slug: string,
): Promise<LocalizedPost | undefined> {
  const posts = await localizedPosts(locale);
  return posts.find((post) => post.slug === slug);
}
