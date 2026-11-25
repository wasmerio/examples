// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import react from "@astrojs/react";
import svelte from "@astrojs/svelte";
import vue from "@astrojs/vue";
import solidJs from "@astrojs/solid-js";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://ultimate-astro-template.vercel.app/",
  output: "static",
  integrations: [
    tailwind({
      applyBaseStyles: true,
    }),
    icon(),
    react({
      include: ["**/React/**/*.{jsx,tsx}"],
    }),
    svelte(),
    vue(),
    solidJs({
      include: ["**/Solid/**/*.{jsx,tsx}"],
    }),
    sitemap(),
  ],

  build: {
    inlineStylesheets: "auto",
  },

  vite: {
    optimizeDeps: {
      include: ["react", "react-dom", "solid-js"],
      exclude: ["@astrojs/solid-js/client.js"],
    },
    ssr: {
      noExternal: ["@astrojs/*"],
    },
  },
});