/**
 * Every URL shape the site publishes; each index must agree with its directory
 * under `src/pages/`. `PAPERS` and `PROJECTS` are honoured everywhere; `/blog/`
 * and `/publications/` are still literals in a few back links. Renaming a
 * route: docs/Content.md.
 *
 * A constant for a switched-off route is harmless — the nav and footer rows
 * that would link to it are filtered by the same flag.
 */

/** The site's URL shape: docs/Deploying.md, "The URL policy". */
// `as`, not a type annotation: TypeScript narrows an annotated const to its
// literal initialiser, and then reports the comparison in paperPath() as
// unreachable.
export const URL_POLICY = 'directory' as 'directory' | 'preserve';

/** The published address of the page being rendered: under 'preserve'
    Astro.url.pathname is the FILE path ("/cv.html"). 404.html has no address,
    so it keeps its extension. */
export function routePath(pathname: string): string {
  if (pathname.endsWith('/index.html')) return pathname.slice(0, -'index.html'.length);
  if (pathname.endsWith('.html') && pathname !== '/404.html') return pathname.slice(0, -5);
  return pathname;
}

export const PAPERS = '/papers/';

/** The one helper whose shape follows URL_POLICY. */
export const paperPath = (slug: string) =>
  URL_POLICY === 'preserve' ? `${PAPERS}${slug}` : `${PAPERS}${slug}/`;

export const PROJECTS = '/projects/';
export const projectPath = (slug: string) => `${PROJECTS}${slug}/`;

export const BLOG = '/blog/';
export const tagPath = (slug: string) => `${BLOG}tag/${slug}/`;

export const PEOPLE = '/people/';

/** The anchor for one person on /people/ — `id` is the people.yml key. */
export const personAnchor = (id: string) => `${PEOPLE}#${id}`;

export const PUBLICATIONS = '/publications/';

/* The single-page routes: no slug, no helper, each linked from more than one place. */
export const CV = '/cv/';
export const PGP_KEY = '/pgp-key/';
export const REPOSITORIES = '/repositories/';
export const IMPRINT = '/imprint/';
