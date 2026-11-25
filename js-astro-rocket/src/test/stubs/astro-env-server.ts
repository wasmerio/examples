/**
 * Test stub for Astro's `astro:env/server` virtual module, which only exists
 * during an Astro build. `site.config.ts` reads these three values (each with
 * a fallback), so `undefined` is fine for unit tests. Wired up via the
 * `astro:env/server` alias in `vitest.config.ts`.
 */
export const SITE_URL: string | undefined = undefined;
export const GOOGLE_SITE_VERIFICATION: string | undefined = undefined;
export const BING_SITE_VERIFICATION: string | undefined = undefined;
