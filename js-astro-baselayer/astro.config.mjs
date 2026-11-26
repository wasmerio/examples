// @ts-check

import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://baselayer-pk4.pages.dev',
	integrations: [expressiveCode(), svelte(), mdx(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'Inter',
			cssVariable: '--font-inter',
			fallbacks: ['sans-serif'],
			weights: ['100 900'],
			styles: ['normal'],
			subsets: ['latin'],
		},
		{
			provider: fontProviders.google(),
			name: 'Newsreader',
			cssVariable: '--font-newsreader',
			fallbacks: ['serif'],
			weights: ['200 800'],
			styles: ['normal', 'italic'],
			subsets: ['latin'],
		},
	],
});
