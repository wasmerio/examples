import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config/site";

// `site` is REQUIRED for the sitemap and canonical URLs to be correct.
// It is read from the central config: one single place to change per site.
export default defineConfig({
  site: SITE.url,
  integrations: [sitemap()],
});
