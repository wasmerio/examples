// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

import sitemap from "@astrojs/sitemap";
import { wikilinkResolver, directiveToHtml, obsidianTextFormatting } from './src/plugins/satteri.ts';
import { resolveVaultImagePaths, imageAttributes, galleryGrouping } from './src/plugins/satteri-gallery.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://your-site.example', // ← replace with your domain (also update config.yaml)

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      minify: 'esbuild',
    },
  },

  integrations: [mdx(), sitemap()],

  experimental: {
    contentIntellisense: true,
  },
  
  fonts: [
    {
      name: "Literata",
      cssVariable: "--font-serif",
      provider: fontProviders.fontsource(),
      weights: [300, 400, 500, 600, 700],
      fallbacks: ["serif"],
      formats: ["woff", "ttf"],
    },
    {
      name: "DM Mono",
      cssVariable: "--font-mono",
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600, 700],
      fallbacks: ["monospace"],
      formats: ["woff", "ttf"],
    },
    {
      name: "Patrick Hand",
      cssVariable: "--font-hand",
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600, 700],
      fallbacks: ["serif"],
      formats: ["woff", "ttf"],
    },
  ],

  markdown: {
    processor: satteri({
      mdastPlugins: [directiveToHtml, obsidianTextFormatting, resolveVaultImagePaths],
      hastPlugins: [wikilinkResolver, imageAttributes, galleryGrouping],
      features: {
        wikilinks: true,
        directive: true,
        smartPunctuation: { quotes: true, dashes: true, ellipses: true },
        gfm: {
          footnotes: {
            label: "Footnotes",
            backContent: "↑",
            backLabel: "Back to reference {reference}",
          }
        },
        subscript: true,
        superscript: true,
      }
    })
  }
});