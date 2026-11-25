/**
 * Shared helpers for the project listing and tag-archive pages.
 *
 * Mirrors `lib/blog` so projects get the same locale support and tag
 * conventions (slugging, tag clouds, archives) without the two drifting apart.
 * The default locale stays at the site root (`/projects/...`); additional
 * locales live under a prefix (`/<locale>/projects/...`).
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import siteConfig from '@/config/site.config';
import { defaultLocale, localizedPath, isEnabled, getLocales } from '@/i18n';
import { tagToSlug, findTagBySlug } from '@/lib/tags';

// Re-export the shared tag-slug helpers so callers can import everything
// project-related from one place.
export { tagToSlug, findTagBySlug };

/** How many of the most-used tags to surface in a project tag cloud. */
export const PROJECT_TAG_CLOUD_LIMIT = siteConfig.projects?.tagCloudLimit ?? 10;

/** Number of projects shown per page on the projects listing. */
export const PROJECTS_PER_PAGE = siteConfig.projects?.perPage ?? 12;

/**
 * Strip the locale prefix (and any `.md`/`.mdx` extension) from a project id to
 * get its URL slug (e.g. "en/astro-rocket" → "astro-rocket"). Mirrors
 * `getPostSlug` in `./blog`.
 */
export function getProjectSlug(projectId: string, locale: string = defaultLocale): string {
  // Strip the leading locale-folder segment and any file extension, leaving a
  // single-segment slug. The prefix is normally `locale`, but we also strip any
  // other configured locale, so a folder/locale mismatch (e.g. content under
  // `en/` whose `locale` field resolved to a different default) still yields a
  // clean slug rather than one containing a slash — which would break the
  // single-segment `[slug]` routes such as the OG-image endpoints.
  const localePrefix = new RegExp(`^(${[locale, ...getLocales()].join('|')})/`);
  return projectId.replace(localePrefix, '').replace(/\.mdx?$/, '');
}

/**
 * URL path for an individual project, locale-aware. The default locale stays at
 * the site root (`/projects/<slug>`); additional locales are prefixed
 * (`/<locale>/projects/<slug>`), matching `localizedPath`.
 */
export function getProjectUrl(projectId: string, locale: string = defaultLocale): string {
  return localizedPath(`/projects/${getProjectSlug(projectId, locale)}`, locale);
}

/** URL of the projects index for a locale (`/projects` or `/<locale>/projects`). */
export function getProjectsBaseUrl(locale: string = defaultLocale): string {
  return localizedPath('/projects', locale);
}

/**
 * URL for a projects index page number, locale-aware. Page 1 is the projects
 * root (no `/page/1` segment), matching the routing in `projects/page/[page].astro`.
 */
export function getProjectsPageUrl(page: number, locale: string = defaultLocale): string {
  return page <= 1 ? getProjectsBaseUrl(locale) : localizedPath(`/projects/page/${page}`, locale);
}

/** URL for a project tag archive page, locale-aware. */
export function getProjectTagUrl(tag: string, locale: string = defaultLocale): string {
  return localizedPath(`/projects/tag/${tagToSlug(tag)}`, locale);
}

/**
 * The non-default locales that should get their own prefixed project routes
 * (`/<locale>/projects/...`). Empty when i18n is off or only one locale is
 * configured, so the locale-prefixed `getStaticPaths` emit nothing and
 * single-locale builds stay byte-for-byte unchanged.
 */
export function getSecondaryLocales(): string[] {
  if (!isEnabled()) return [];
  return getLocales().filter((locale) => locale !== defaultLocale);
}

/**
 * All visible projects for a locale, ordered by their `order` field. Drafts are
 * filtered out in production, kept visible in dev so authors can preview them.
 */
export async function getVisibleProjects(
  locale: string = defaultLocale,
): Promise<CollectionEntry<'projects'>[]> {
  const all = await getCollection('projects', ({ data }) => {
    return data.locale === locale && (import.meta.env.PROD ? data.draft !== true : true);
  });
  return all.sort((a, b) => a.data.order - b.data.order);
}

/**
 * Total number of project index pages for a locale. Shared by the default and
 * locale-prefixed pagination routes so they agree on the page count.
 */
/**
 * The projects that have a page of their own.
 *
 * `getVisibleProjects` includes entries marked `placeholder: true` — they show
 * as cards on the index but deliberately have no detail route, which is why
 * `ProjectCard` renders them without an href. Anything building links to
 * project pages has to apply the same filter, and the footer's derived Projects
 * column did not: it linked five, four of which 404ed.
 *
 * The rule lives here now so there is one copy of it.
 */
export async function getRoutableProjects(locale: string = defaultLocale) {
  return (await getVisibleProjects(locale)).filter((project) => !project.data.placeholder);
}

export async function getProjectPageCount(locale: string = defaultLocale): Promise<number> {
  const projects = await getVisibleProjects(locale);
  return Math.max(1, Math.ceil(projects.length / PROJECTS_PER_PAGE));
}

/**
 * Resolve a project's real per-locale URLs by matching slugs across locales.
 * Projects share one slug across locales (one folder per locale, same filename),
 * so unlike the blog — which links translations via canonical `uid`s — matching
 * the locale-stripped slug is enough. Returns one entry per locale that has a
 * project at this slug, used for hreflang tags and the language switcher.
 */
export async function getProjectTranslations(
  slug: string,
  _currentLocale: string = defaultLocale,
): Promise<{ locale: string; url: string }[]> {
  if (!isEnabled()) return [];
  const all = await getCollection('projects', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  const results: { locale: string; url: string }[] = [];
  for (const locale of getLocales()) {
    const match = all.find(
      (p) => p.data.locale === locale && getProjectSlug(p.id, locale) === slug,
    );
    if (match) results.push({ locale, url: getProjectUrl(match.id, locale) });
  }
  return results;
}

/** All unique tags across the given projects, alphabetically sorted. */
export function collectProjectTags(projects: CollectionEntry<'projects'>[]): string[] {
  return [...new Set(projects.flatMap((p) => p.data.tags))].sort();
}

/** Tag occurrence counts across the given projects, sorted by count desc then alpha. */
export function collectProjectTagsWithCounts(
  projects: CollectionEntry<'projects'>[]
): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of projects) {
    for (const t of p.data.tags) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** The most-used tags across the given projects, capped at `limit`. */
export function collectTopProjectTags(
  projects: CollectionEntry<'projects'>[],
  limit: number
): string[] {
  return collectProjectTagsWithCounts(projects)
    .slice(0, limit)
    .map((t) => t.tag);
}
