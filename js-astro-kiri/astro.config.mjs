// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import path from 'path'

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
	site: process.env.SITE_URL || 'https://localhost:4321',
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				'@': path.resolve('./src'),
			}
		}
	},
	integrations: [
		sitemap(),
		mdx({
			syntaxHighlight: 'shiki',
			shikiConfig: {
				themes: {
					light: 'catppuccin-latte',
					dark: 'tokyo-night',
				},
			}
		})
	],
});