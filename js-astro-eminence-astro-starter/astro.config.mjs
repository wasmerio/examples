import node from '@astrojs/node';
// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import { paraglideVitePlugin } from "@inlang/paraglide-js";

import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import eminencesuite from "eminence-astro-suite";

// https://astro.build/config
export default defineConfig({
  site: "https://eminence-astro-starter.xeffen25.com",
  adapter: node({ mode: 'standalone' }),
  output: "server",

  fonts: [
    {
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--astro-font-inter",
      weights: ["100 900"],
      styles: ["normal", "italic"],
    },
  ],

  integrations: [
    eminencesuite({
      icons: {
        source: "src/assets/icon.svg",
      },
    }),
    svelte(),
  ],

  vite: {
    optimizeDeps: {
      include: [
        "@astrojs/svelte/server.js",
        "astro/zod",
        "astro/actions/runtime/entrypoints/server.js",
      ],
    },
    plugins: [
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./src/paraglide",
        strategy: ["url", "baseLocale"],
        emitGitIgnore: false,
        emitPrettierIgnore: false,
      }),
      tailwindcss(),
    ],
  },
});
