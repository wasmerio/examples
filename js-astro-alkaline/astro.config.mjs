// Astro config, you likely won't need to change this file. But if you do -> https://docs.astro.build/en/reference/configuration-reference/
import { SITE } from "./src/alkaline.config";
import robotsConfig from "./src/utils/robots-txt.config";

import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
	site: SITE.url,
	markdown: {
		shikiConfig: SITE.shikiConfig,
	},
	integrations: [mdx(), tailwind(), sitemap(), robotsTxt(robotsConfig), icon()],
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@import "src/styles/animations.css";`,
				},
			},
		},
	},
});
