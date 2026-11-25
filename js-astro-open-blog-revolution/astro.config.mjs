// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { CONFIG as rawConfig } from "./src/js/load-config.js";
import { unified } from '@astrojs/markdown-remark';

/** @type {any} */
const CONFIG = rawConfig;

import { remarkExtendImage, remarkExtendBlockquote } from "./src/js/plugins/remark-plugins";

const isDev = process.argv.includes("dev");

let site = process.env.SITE_URL || CONFIG.URL || (isDev ? "http://localhost:4321" : undefined);

if (!site) {
  console.warn("RSS Warning: No 'site' configured. Defaulting to localhost.");
  site = "http://localhost:4321"; 
}
const base = process.env.BASE_URL || CONFIG.BASE || '/'

export default defineConfig({
  site: site,
  base: base,

  prefetch: {
    defaultStrategy: 'load'
  },

  devToolbar: {
      enabled: false
    },
  markdown:   {
    processor: unified ({
      remarkPlugins: [remarkExtendImage, remarkExtendBlockquote]
    })
  },
  integrations: [sitemap(), mdx()],
  vite: {
    resolve: {
      alias: {
        "@config": "src/js/load-config.js",
        "@media": "/src/media"
      }
    }
  }
});