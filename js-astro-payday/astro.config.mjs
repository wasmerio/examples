// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { siteConfig } from "./src/config/site.ts";

export default defineConfig({
  site: siteConfig.siteUrl,
  trailingSlash: "always",
  /* Class scoping lets a component's styles reach child components it passes `class` to. */
  scopedStyleStrategy: "class",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
