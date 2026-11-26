// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  // Change this to the real domain. Every canonical URL, sitemap entry and
  // schema `url` is derived from it, so it must be correct before deploying.
  site: 'https://astro-local-business.wasmer.app',

  // Pick one and be consistent: generated sitemap URLs and canonical tags
  // must match the URLs the site actually serves.
  trailingSlash: "always",

  build: {
    inlineStylesheets: "auto",
  },
});
