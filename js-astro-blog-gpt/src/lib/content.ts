import { postPath } from './post-path';
import { getCollection, type CollectionEntry } from 'astro:content';
import config from './config';
import type { Locale } from '../types/config';
import { canDiscover, canRender } from './policy';
import {
  chooseVariants,
  assertUniqueSlugs,
  assertMatchingSlugs,
} from './content-variants';
import { href } from './i18n';
import { introPageSlug, introRoutes } from './intro-config';

export type Post = CollectionEntry<'posts'>;
type TermKind = 'categories' | 'tags';
export type TextEntry =
  | CollectionEntry<'pages'>
  | CollectionEntry<'categories'>
  | CollectionEntry<'tags'>;
const choose = <
  T extends { data: { _key: string; _locale?: string; slug: string } },
>(
  entries: T[],
  lang: Locale,
  kind: string,
) =>
  assertUniqueSlugs(
    chooseVariants(
      entries,
      lang,
      config.site.defaultLocale,
      config.site.locales,
    ),
    `${lang}/${kind}`,
  );
export async function postsFor(
  lang: Locale,
  includeHidden = false,
): Promise<Post[]> {
  const posts = assertMatchingSlugs(await getCollection('posts')).filter(
    (post) =>
      canRender(post.data, import.meta.env.DEV, config.posts.showDraftsInDev),
  );
  return choose(posts, lang, 'posts')
    .filter((post) => includeHidden || !post.data.hidden)
    .sort(
      (a, b) =>
        Number(b.data.featured) - Number(a.data.featured) ||
        b.data.date.getTime() - a.data.date.getTime(),
    );
}
export async function textEntriesFor<K extends 'pages' | TermKind>(
  kind: K,
  lang: Locale,
) {
  const entries = assertMatchingSlugs(await getCollection(kind));
  return choose(
    entries.filter(
      (entry) =>
        !entry.data.draft ||
        (import.meta.env.DEV && config.posts.showDraftsInDev),
    ),
    lang,
    kind,
  );
}
export async function pageFor(slug: string, lang: Locale) {
  const pages = await textEntriesFor('pages', lang);
  return pages.find((page) => page.data.slug === slug);
}
function introSlug(route: string): string | undefined {
  return introPageSlug(config, route);
}
export async function introFor(route: string, lang: Locale) {
  const slug = introSlug(route);
  if (!slug) return undefined;
  const page = await pageFor(slug, lang);
  if (!page)
    throw new Error(`Missing pages content for ${route}: ${slug} (${lang}).`);
  return page;
}
export function isReservedPage(slug: string) {
  return /^(404|posts|categories|tags|search|archives|links|page-og|og|rss\.xml|search-data\.json)(\/|$)/.test(
    slug,
  );
}
export function isIntroOnly(slug: string) {
  return (
    introRoutes.some((route) => route === slug) ||
    (introRoutes.some((route) => introSlug(route) === slug) &&
      isReservedPage(slug))
  );
}
export async function discoverablePosts(lang: Locale): Promise<Post[]> {
  return (await postsFor(lang)).filter((post) => canDiscover(post.data));
}
export const encodedSlug = (slug: string) =>
  slug.split('/').map(encodeURIComponent).join('/');
export function postHref(post: Post, lang: Locale): string {
  return href(
    lang,
    `posts/${encodedSlug(postPath(post.data, config.posts.pathPrefix, config.site.timezone))}/`,
  );
}
export function readingMinutes(post: { body?: string }): number {
  const body = post.body ?? '';
  const chinese = (body.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const words = body
    .replace(/[\u4e00-\u9fff]/g, '')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(chinese / 350 + words / 220));
}
export async function taxonomy(
  kind: TermKind,
  lang: Locale,
  includeHidden = false,
) {
  const definitions = await textEntriesFor(kind, lang);
  const groups = new Map<string, Post[]>(
    definitions.map((entry) => [entry.data.slug, []]),
  );
  const hiddenReferences = new Set<string>();
  for (const post of await postsFor(lang, true))
    for (const key of post.data[kind]) {
      if (!groups.has(key)) groups.set(key, []);
      if (post.data.hidden) hiddenReferences.add(key);
      else groups.get(key)!.push(post);
    }
  return [...groups]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([slug, posts]) => {
      const entry = definitions.find((entry) => entry.data.slug === slug);
      return {
        slug,
        posts,
        entry,
        hidden:
          !!entry?.data.hidden ||
          (hiddenReferences.has(slug) && posts.length === 0),
      };
    })
    .filter((group) => includeHidden || !group.hidden);
}
export async function taxonomyLabels(lang: Locale) {
  const result: {
    categories: Record<string, string>;
    tags: Record<string, string>;
  } = { categories: Object.create(null), tags: Object.create(null) };
  for (const kind of ['categories', 'tags'] as const)
    for (const entry of await textEntriesFor(kind, lang))
      result[kind][entry.data.slug] = entry.data.title;
  return result;
}
