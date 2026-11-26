import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

import { SITE_URL } from "./src/consts";

export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap(), mdx()],
  markdown: {
    shikiConfig: { theme: "css-variables" }
  }
});
