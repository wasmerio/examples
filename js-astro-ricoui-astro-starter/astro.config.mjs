import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Get the site URL from environment variables, or use the default value if not set
// Note: After the first deployment, be sure to set the correct PUBLIC_SITE_URL in the .env file
const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://ricoui-astro-starter.vercel.app/';

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  base: '/',
  envPrefix: 'PUBLIC_',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  },

  server: {
    host: '127.0.0.1',
    port: 5200,
  },

  integrations: [mdx(), sitemap()],
});
