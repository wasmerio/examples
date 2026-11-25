/**
 * Do a built page's two claims about the site's own address agree?
 *
 * The theme reads that address from two places, and it has to, because
 * neither can do the other's job. `astro.config.mjs` sets `site` — which
 * writes every canonical tag, `og:url`, RSS link and sitemap entry — and it
 * runs before `astro:env` exists, so it can only read `process.env`.
 * `site.config.ts` sets `url` — which the JSON-LD, the share cards and the
 * footer read — and it uses `astro:env/server`, because Cloudflare Workers
 * have no `process.env` at runtime.
 *
 * Those two do not see the same values. `astro:env` loads `.env` files;
 * `process.env` in the config does not. A user who puts `SITE_URL` in `.env`,
 * as `.env.example` tells them to, configures one of the two — and ships
 * canonical tags pointing at the fallback domain while the JSON-LD names
 * their own. Reported as #643.
 *
 * Nothing about that build fails or looks wrong. Search engines follow
 * canonical tags, so a site can lose its own pages to a domain nobody owns
 * while its author sees a green deploy.
 *
 * The rule below is the one thing that stays true however the address is
 * configured: the two must name the same origin. Comparing the built output
 * catches every way they can drift apart, including ways that have nothing to
 * do with `.env` files.
 */

/** The `href` of the page's canonical link, or null. */
export function canonicalOf(html) {
  const match = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  return match ? match[1] : null;
}

/** The first `url` in the page's JSON-LD, or null. */
export function jsonLdUrlOf(html) {
  const blocks = html.matchAll(
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  );
  for (const [, body] of blocks) {
    let data;
    try {
      data = JSON.parse(body);
    } catch {
      continue; // a malformed block is not this check's problem
    }
    for (const entry of Array.isArray(data) ? data : [data]) {
      if (entry && typeof entry.url === 'string') return entry.url;
    }
  }
  return null;
}

function originOf(value) {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

/**
 * Compare one page's two addresses.
 *
 * Returns null when they agree, or when the page carries only one of them —
 * a page with no JSON-LD proves nothing either way, and a theme user is free
 * to remove it. Otherwise returns both values and the origins that differ.
 */
export function siteUrlDisagreement(html) {
  const canonical = canonicalOf(html);
  const jsonLd = jsonLdUrlOf(html);
  if (!canonical || !jsonLd) return null;

  const canonicalOrigin = originOf(canonical);
  const jsonLdOrigin = originOf(jsonLd);
  if (!canonicalOrigin || !jsonLdOrigin) return null;
  if (canonicalOrigin === jsonLdOrigin) return null;

  return { canonical, jsonLd, canonicalOrigin, jsonLdOrigin };
}

/** The message printed when a build is stopped by this check. */
export function disagreementMessage(page, found) {
  return (
    `verify-site-url: ${page} disagrees with itself about this site's address.\n` +
    `  canonical  ${found.canonical}\n` +
    `  JSON-LD    ${found.jsonLd}\n\n` +
    'Canonical tags, the sitemap and robots.txt come from `site` in ' +
    'astro.config.mjs, which reads process.env. The JSON-LD comes from `url` ' +
    'in src/config/site.config.ts, which reads astro:env/server. Those two do ' +
    'not read the same places, so SITE_URL has to reach both.\n\n' +
    'Set SITE_URL in your host\'s environment variables, where both see it. ' +
    'If you set it in a .env file, check that the file is one the build loads ' +
    '— astro.config.mjs does not read .env on its own.\n\n' +
    'Shipping this would put canonical tags for a domain you may not own on ' +
    'every page, which search engines act on.'
  );
}
