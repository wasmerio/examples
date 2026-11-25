/**
 * Shared helpers for the blog listing pages (index, paginated, tag archives).
 *
 * Lives outside the page files so the index page, paginated pages, and tag
 * archive pages can share post fetching, page-size config, and tag-slug
 * conventions without drifting.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import siteConfig from '@/config/site.config';
import { defaultLocale, localizedPath, isEnabled, getLocales } from '@/i18n';
import { tagToSlug, findTagBySlug } from '@/lib/tags';

/** Number of regular (non-featured) posts shown per blog index page. */
export const BLOG_POSTS_PER_PAGE = siteConfig.blog?.postsPerPage ?? 12;

/**
 * How many of the most-used tags to surface in the blog tag cloud. Single
 * source for the index, paginated, and tag-archive routes so they can't drift.
 */
export const BLOG_TAG_CLOUD_LIMIT = siteConfig.blog?.tagCloudLimit ?? 10;

// Tag-slug helpers live in `lib/tags` so blog and project archives share one
// set of slug rules. Imported above so this module can build tag URLs, and
// re-exported here to keep existing import sites working.
export { tagToSlug, findTagBySlug };

/**
 * Strip the locale prefix from a blog entry's id to get its URL slug
 * (e.g. "en/welcome" → "welcome").
 */
export function getPostSlug(postId: string, locale: string = defaultLocale): string {
  // Strip the leading locale-folder segment, leaving a single-segment slug. The
  // prefix is normally `locale`, but we also strip any other configured locale,
  // so a folder/locale mismatch still yields a clean slug rather than one
  // containing a slash (which would break single-segment `[slug]` routes).
  const localePrefix = new RegExp(`^(${[locale, ...getLocales()].join('|')})/`);
  return postId.replace(localePrefix, '');
}

/**
 * URL path for an individual blog post, locale-aware. The default locale stays
 * at the site root (`/blog/<slug>`); additional locales are prefixed
 * (`/<locale>/blog/<slug>`), matching `localizedPath` and the
 * canonical-id resolver in `lib/post-links`.
 */
export function getPostUrl(postId: string, locale: string = defaultLocale): string {
  return localizedPath(`/blog/${getPostSlug(postId, locale)}`, locale);
}

/** URL of the blog index for a locale (`/blog` or `/<locale>/blog`). */
export function getBlogBaseUrl(locale: string = defaultLocale): string {
  return localizedPath('/blog', locale);
}

/**
 * URL for a blog index page number, locale-aware. Page 1 is the blog root
 * (no `/page/1` segment), matching the routing in `blog/page/[page].astro`.
 */
export function getBlogPageUrl(page: number, locale: string = defaultLocale): string {
  return page <= 1 ? getBlogBaseUrl(locale) : localizedPath(`/blog/page/${page}`, locale);
}

/** URL for a tag archive page, locale-aware. */
export function getTagUrl(tag: string, locale: string = defaultLocale): string {
  return localizedPath(`/blog/tag/${tagToSlug(tag)}`, locale);
}

/**
 * URL of the RSS feed for a locale (`/rss.xml` or `/<locale>/rss.xml`).
 *
 * There used to be one feed. It carried the default locale's posts and
 * declared `<language>` to match, but every page in every locale linked to it,
 * so a Dutch reader was offered a feed of English posts.
 */
export function getRssUrl(locale: string = defaultLocale): string {
  return localizedPath('/rss.xml', locale);
}

/**
 * The non-default locales that should get their own prefixed blog routes
 * (`/<locale>/blog/...`). Empty when i18n is off or only one locale is
 * configured, so the locale-prefixed `getStaticPaths` emit nothing and
 * single-locale builds stay byte-for-byte unchanged.
 */
export function getSecondaryLocales(): string[] {
  if (!isEnabled()) return [];
  return getLocales().filter((locale) => locale !== defaultLocale);
}

/**
 * Get all published posts for a locale, newest first. Drafts are filtered
 * out in production, kept visible in dev so authors can preview them.
 */
export async function getPublishedPosts(
  locale: string = defaultLocale,
): Promise<CollectionEntry<'blog'>[]> {
  const all = await getCollection('blog', ({ data }) => {
    return data.locale === locale && (import.meta.env.PROD ? data.draft !== true : true);
  });
  return all.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

/**
 * Total number of blog index pages for a locale. Page 1 carries the featured
 * posts plus the first slice of regular posts; pages 2..N hold the rest.
 * Shared by the default and locale-prefixed pagination routes so they agree
 * on the page count.
 */
export async function getBlogPageCount(locale: string = defaultLocale): Promise<number> {
  const posts = await getPublishedPosts(locale);
  const nonFeatured = posts.filter((p) => !p.data.featured);
  const regularPostsAll = nonFeatured.length > 0 ? nonFeatured : posts;
  return Math.max(1, Math.ceil(regularPostsAll.length / BLOG_POSTS_PER_PAGE));
}

/** All unique tags across the given posts, alphabetically sorted. */
export function collectTags(posts: CollectionEntry<'blog'>[]): string[] {
  return [...new Set(posts.flatMap((p) => p.data.tags))].sort();
}

/** Tag occurrence counts across the given posts, sorted by count desc then alpha. */
export function collectTagsWithCounts(
  posts: CollectionEntry<'blog'>[]
): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.data.tags) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** The most-used tags across the given posts, capped at `limit`. */
export function collectTopTags(
  posts: CollectionEntry<'blog'>[],
  limit: number
): string[] {
  return collectTagsWithCounts(posts)
    .slice(0, limit)
    .map((t) => t.tag);
}
