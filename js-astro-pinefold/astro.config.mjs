// @ts-check
import { defineConfig } from 'astro/config';
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://anoopsmn.github.io",
  output: "static",
  integrations: [icon(), sitemap()]
});