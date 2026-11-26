import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import { site } from "./content/site";
import { blogRedirects } from "./src/integrations/redirects";

const path = (relative: string) => fileURLToPath(new URL(relative, import.meta.url));

export default defineConfig({
  // SITE_URL (for a preview or demo deploy) overrides the address in content/site.ts.
  site: process.env.SITE_URL || site.url,
  // Everything personal lives in content/; content/public holds the files served from the site root.
  publicDir: "content/public",
  // /blog, not /blog/: pages build to blog.html, matching the canonical URLs.
  trailingSlash: "never",
  build: { format: "file" },
  output: "static",
  integrations: [blogRedirects()],
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    // Keep og.png's native resvg binding out of dev pre-bundling, which cannot read a .node file.
    optimizeDeps: { exclude: ["@resvg/resvg-js"] },
    ssr: { optimizeDeps: { exclude: ["@resvg/resvg-js"] } },
    resolve: {
      alias: {
        $content: path("./content"),
        $lib: path("./src/lib"),
      },
    },
  },
});
