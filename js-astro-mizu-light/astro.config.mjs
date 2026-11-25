import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import lottie from "astro-integration-lottie";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";

// https://astro.build/config
export default defineConfig({
  site: "https://mizu-theme.netlify.app",
  integrations: [
    icon(),
    sitemap(),
    lottie(),
    react(),
    markdoc(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
