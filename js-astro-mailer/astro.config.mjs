// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { siteConfig } from "./src/config/site.ts";
import { codeThemes, codeDefaultColor } from "./src/config/code.ts";

const noindexPages = ["/search/", "/styleguide/"];

const shikiConfig = /** @type {const} */ ({
  themes: codeThemes,
  defaultColor: codeDefaultColor,
});

export default defineConfig({
  site: siteConfig.siteUrl,
  integrations: [
    mdx(),
    sitemap({
      /* Listing a noindex page only earns a warning in Search Console. */
      filter: (page) =>
        !noindexPages.some((path) => page === new URL(path, siteConfig.siteUrl).toString()),
    }),
  ],
  markdown: {
    shikiConfig,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
