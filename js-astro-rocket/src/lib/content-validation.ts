/**
 * Build-time content validation.
 *
 * Phase 0: fail the build when two pieces of content resolve to the same URL
 * within a locale. As the content set grows — and especially once slugs are
 * derived from filenames across many posts — duplicate slugs become an easy
 * mistake that otherwise fails silently (one post quietly shadows another).
 * Catching it at build time turns a silent content bug into a loud, actionable
 * error.
 *
 * The pure helpers (`collectSlugRecords`, `findSlugCollisions`,
 * `formatSlugCollisions`) take plain data so they can be unit-tested without
 * the Astro content runtime. `assertNoSlugCollisions` is the build-time entry
 * point that loads the collections and throws.
 */

/** A single URL a piece of content will be published at, within a locale. */
export interface SlugRecord {
  /** Human-readable origin for diagnostics, e.g. `blog: en/getting-started`. */
  source: string;
  /** Locale the entry belongs to; collisions are only checked within a locale. */
  locale: string;
  /** URL path within the locale, e.g. `/blog/getting-started` or `/about`. */
  path: string;
}

/** Two or more entries that resolve to the same path within a locale. */
export interface SlugCollision {
  locale: string;
  path: string;
  /** The `source` of every entry that landed on this path. */
  sources: string[];
}

/** Minimal shape shared by content-collection entries used here. */
interface ContentEntryLike {
  id: string;
  data: { locale: string };
}

/**
 * Strip a leading `<locale>/` segment from a collection entry id to get its
 * slug. Mirrors `getPostSlug` in `./blog`, kept here free of the
 * `astro:content` runtime import so it stays unit-testable and can be reused
 * by other build-time helpers (e.g. canonical-id resolution).
 */
export function localeStrippedSlug(id: string, locale: string): string {
  const prefix = `${locale}/`;
  return id.startsWith(prefix) ? id.slice(prefix.length) : id;
}

/**
 * Build the list of published URLs from the blog, pages, and projects
 * collections. Blog posts live under `/blog/<slug>`; projects under
 * `/projects/<slug>`; pages live at the site root `/<slug>`.
 */
export function collectSlugRecords(
  posts: ContentEntryLike[],
  pages: ContentEntryLike[],
  projects: ContentEntryLike[] = []
): SlugRecord[] {
  const records: SlugRecord[] = [];

  for (const post of posts) {
    const { locale } = post.data;
    records.push({
      source: `blog: ${post.id}`,
      locale,
      path: `/blog/${localeStrippedSlug(post.id, locale)}`,
    });
  }

  for (const project of projects) {
    const { locale } = project.data;
    records.push({
      source: `projects: ${project.id}`,
      locale,
      path: `/projects/${localeStrippedSlug(project.id, locale)}`,
    });
  }

  for (const page of pages) {
    const { locale } = page.data;
    records.push({
      source: `pages: ${page.id}`,
      locale,
      path: `/${localeStrippedSlug(page.id, locale)}`,
    });
  }

  return records;
}

/**
 * Group records by (locale, path) and return every path that more than one
 * entry resolves to. Output is sorted (locale, then path) and each collision's
 * sources are sorted, so error messages are deterministic.
 */
export function findSlugCollisions(records: SlugRecord[]): SlugCollision[] {
  const groups = new Map<string, SlugRecord[]>();
  for (const record of records) {
    const key = JSON.stringify([record.locale, record.path]);
    const existing = groups.get(key);
    if (existing) existing.push(record);
    else groups.set(key, [record]);
  }

  const collisions: SlugCollision[] = [];
  for (const group of groups.values()) {
    if (group.length > 1) {
      collisions.push({
        locale: group[0].locale,
        path: group[0].path,
        sources: group.map((r) => r.source).sort(),
      });
    }
  }

  return collisions.sort(
    (a, b) => a.locale.localeCompare(b.locale) || a.path.localeCompare(b.path)
  );
}

/** Render collisions as a single, actionable error message. */
export function formatSlugCollisions(collisions: SlugCollision[]): string {
  const blocks = collisions.map((c) => {
    const sources = c.sources.map((s) => `      - ${s}`).join('\n');
    return `  [${c.locale}] ${c.path}\n${sources}`;
  });
  return (
    `Duplicate slugs detected — every entry must resolve to a unique URL ` +
    `within its locale:\n\n${blocks.join('\n\n')}\n\n` +
    `Rename the offending file(s) so each resolves to a distinct slug.`
  );
}

/**
 * Build-time guard: throw if any two published entries collide on the same URL
 * within a locale. Drafts are excluded — they are not emitted in production, so
 * they cannot cause a real collision. Call this from a route's
 * `getStaticPaths`; a throw here aborts `astro build`.
 */
export async function assertNoSlugCollisions(): Promise<void> {
  const { getCollection } = await import('astro:content');
  const [posts, pages, projects] = await Promise.all([
    getCollection('blog'),
    getCollection('pages'),
    getCollection('projects'),
  ]);

  const publishablePosts = posts.filter((post) => post.data.draft !== true);
  const publishableProjects = projects.filter((project) => project.data.draft !== true);
  const collisions = findSlugCollisions(
    collectSlugRecords(publishablePosts, pages, publishableProjects)
  );

  if (collisions.length > 0) {
    throw new Error(formatSlugCollisions(collisions));
  }
}
