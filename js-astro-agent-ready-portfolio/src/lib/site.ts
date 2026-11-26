import { site as content } from "$content/site";

// content/site.ts, with `url` taken from the build. A SITE_URL environment variable overrides
// the address in content/site.ts (astro.config.ts), so a preview or demo deploy links to itself.
export const site = {
  ...content,
  url: (import.meta.env.SITE ?? content.url).replace(/\/$/, ""),
};
