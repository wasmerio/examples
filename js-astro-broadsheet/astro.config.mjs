import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import pagefind from "astro-pagefind";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

// 站点地址：优先用 .env / 托管平台的 SITE_URL；
// 没设置时回退到 Vercel 注入的生产域名，这样一键部署也能生成正确的 sitemap 与 RSS。
const site =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:4321");

// https://astro.build/config
export default defineConfig({
  site,
  server: {
    host: true,
    port: 4321,
  },
  integrations: [
    sitemap(),
    mdx(),
    pagefind(),
    // 只打包这里登记的图标。新增图标时，把名字加进来即可；
    // 需要品牌图标可以安装 @iconify-json/simple-icons 并在下面新增一组。
    icon({
      include: {
        tabler: [
          "alert-circle",
          "alert-triangle",
          "arrow-left",
          "arrow-right",
          "arrow-up",
          "arrow-up-right",
          "bulb",
          "check",
          "device-desktop",
          "info-circle",
          "menu-2",
          "moon",
          "search",
          "rss",
          "sun",
          "x",
        ],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
  },
});
