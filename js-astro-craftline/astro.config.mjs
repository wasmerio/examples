// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config.ts";

// https://astro.build/config
export default defineConfig({
  // SITE_URL lets a deploy (e.g. a live demo) set its own address without editing src/config.ts.
  site: process.env.SITE_URL || SITE.url,
  integrations: [
    sitemap({
      // The thank-you page is only reached after a form submission.
      filter: (page) => !page.includes("/thanks/"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
