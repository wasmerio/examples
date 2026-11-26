// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import markdoc from "@astrojs/markdoc";
import mdx from "@astrojs/mdx";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://muhammad-fiaz.github.io",
  
  // Image optimization
  image: {
    domains: [
      "avatars.githubusercontent.com",
      "raw.githubusercontent.com",
      "github.com",
    ],
  },
  
  // Integrations
  integrations: [react(), // Sitemap generation with external sitemaps for VitePress docs
  sitemap({
    filter: (page) => !page.includes("/404") && !page.includes("/500"),
    customPages: [
      "https://muhammad-fiaz.github.io/",
      "https://muhammad-fiaz.github.io/works",
      "https://muhammad-fiaz.github.io/projects",
      "https://muhammad-fiaz.github.io/blog",
      "https://muhammad-fiaz.github.io/privacy-policy",
      "https://muhammad-fiaz.github.io/terms-of-service",
      "https://muhammad-fiaz.github.io/cookie-policy",
      "https://muhammad-fiaz.github.io/rss.xml",
    ],
    // External sitemaps from VitePress documentation sites
    // These will be included in sitemap-index.xml
    customSitemaps: [
      // Zig Libraries
      "https://muhammad-fiaz.github.io/args.zig/sitemap.xml",
      "https://muhammad-fiaz.github.io/logly.zig/sitemap.xml",
   
    ],
  }), markdoc(), mdx(), partytown()],
  
  // Vite configuration
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
      rollupOptions: {
        output: {
          /* manualChunks: {
             vendor: ['react', 'react-dom', 'framer-motion'],
             layout: ['src/components/layout/Footer.tsx', 'src/components/layout/Navbar.tsx'],
          }, */
        },
      },
    },
    ssr: {
      noExternal: ["framer-motion"],
    },
  },
  
  // Prefetch configuration
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
});