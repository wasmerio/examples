// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { config } from "./src/config";

export default defineConfig({
  // The production URL lives in src/config.ts and feeds canonical links, the sitemap and the feed
  site: config.url,
  output: "static",
  // The whole stylesheet is about 15 KB, so inlining it saves a render blocking request on every page
  build: { inlineStylesheets: "always" },
  integrations: [
    mdx(),
    // Keeps the 404 page and the /blog redirect out of the sitemap
    sitemap({ filter: (page) => !/\/(404|blog)\/?$/.test(page) }),
  ],
  // The post list lives on the front page, so /blog simply points there
  redirects: { "/blog": "/" },
  markdown: {
    // Code blocks carry both themes; src/styles/global.css picks the one matching the site theme
    shikiConfig: {
      themes: { light: "vitesse-light", dark: "vitesse-dark" },
      defaultColor: false,
      wrap: false,
    },
    // Footnotes get a visible "Notes" heading and a plain arrow as the back link
    remarkRehype: {
      footnoteLabel: "Notes",
      footnoteLabelProperties: { className: ["footnotes-label"] },
      footnoteBackContent: "↑",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
