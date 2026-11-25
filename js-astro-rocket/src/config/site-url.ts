/**
 * The URL used when the `SITE_URL` environment variable is not set.
 *
 * Two places need the site's own address and they must agree: `astro.config.mjs`
 * sets `site`, which produces every canonical tag, `og:url`, `og:image`, RSS
 * link and sitemap entry — and `site.config.ts` sets `url`, which the JSON-LD,
 * the share cards and the footer read. `astro.config.mjs` runs before
 * `astro:env` exists, so it cannot import `site.config.ts`; without a shared
 * constant the two drift, and a site ends up serving canonical URLs for one
 * domain while telling crawlers it lives at another.
 *
 * Set `SITE_URL` in your host's environment and this is never used. It stays a
 * placeholder on purpose: a site that ships without `SITE_URL` should be
 * obviously unconfigured rather than quietly claim someone else's domain.
 */
export const SITE_URL_FALLBACK = 'https://example.com';
