import { defineConfig } from "astro/config";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import { SITE } from "./src/config";
import { remarkMermaid } from "./src/plugins/remark-mermaid";

export default defineConfig({
  site: SITE.url,
  base: SITE.base,
  integrations: [icon()],
  markdown: {
    remarkPlugins: [remarkMermaid],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
