import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";

// SITE_URL (set in your host's environment) overrides `url` in src/config.ts.
const site = process.env.SITE_URL ?? SITE.url;
if (site.includes("example.com")) {
  console.warn(
    "\n[inkline] Set your real address as `url` in src/config.ts (or the SITE_URL variable).\n" +
      "          RSS, the sitemap and social images use it.\n",
  );
}

export default defineConfig({
  site,
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },
});
