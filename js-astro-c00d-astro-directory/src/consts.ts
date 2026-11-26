/**
 * Site-wide settings.
 *
 * Each can be overridden by an environment variable at build time, which is
 * what a CI deploy usually wants — edit the defaults here for a site you own.
 */

const env = (key: string, fallback: string): string =>
  (import.meta.env[key] as string | undefined)?.trim() || fallback;

export const SITE_TITLE = env('SITE_TITLE', 'A c00d Directory');
export const SITE_TAGLINE = env('SITE_TAGLINE', 'A hand-curated directory of good things.');
export const SITE_DESCRIPTION = env(
  'SITE_DESCRIPTION',
  'A ranked link directory: categories of listings with ratings, search and filtering.'
);

/** Listings shown inside each category box on the home page. */
export const PER_CATEGORY = Number(env('PER_CATEGORY', '10'));

/** Rows per page on a category page. */
export const PER_PAGE = Number(env('PER_PAGE', '30'));

/**
 * Where outbound links point.
 *
 * A static site cannot count a click. With a c00d Directory behind it, set
 * DIRECTORY_API and clicks route through its counter; otherwise listings link
 * straight out, which is the honest static behaviour.
 */
export const COUNT_CLICKS = Boolean(import.meta.env.DIRECTORY_API);
