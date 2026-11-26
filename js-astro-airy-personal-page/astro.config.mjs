import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';

import icon from 'astro-icon';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://demo.feevel.com', // 实际部署域名
  integrations: [preact(), icon(), sitemap()]
});