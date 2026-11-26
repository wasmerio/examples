// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: "https://astrolingo.josebolanos.xyz/",

	integrations: [mdx(), sitemap()],

	i18n: {
		defaultLocale: "en",
		locales: ["en", "es", "fi"],
		routing: {
			prefixDefaultLocale: false
		},
		fallback: {
      es: "en",
      fi: "en"
    }
	}

});
