// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from "vite";
const env = loadEnv(process.env.NODE_ENV || "production", process.cwd(), "PUBLIC_");
import { isNoindexRoute } from "./src/utils/seo.ts";

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || env.PUBLIC_SITE_URL || "https://example.com",
  devToolbar: { enabled: false },
  integrations: [
    sitemap({
      filter: (page) => !isNoindexRoute(new URL(page).pathname),
    }),
  ],
  fonts: [
    {
      name: "Inter",
      cssVariable: "--font-inter",
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/inter-regular.woff2"],
          },
        ],
      },
    },
  ],
  vite: { build: { cssTarget: "safari15.4" } },
});
