import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import preact from "@astrojs/preact";
import { loadConfig } from "./scripts/helpers.mjs";

// 域名单一来源：只从 projects.yaml 顶层的 网址/url 读（v2 拍平了配置，没有 site 块），
// 别处不写死。用共享的 loadConfig（CORE_SCHEMA）解析，与其余解析路径保持一致。
// 没填则 siteUrl 为 undefined —— canonical / sitemap / og 整体略过，不指错。
const data = loadConfig(readFileSync("./src/data/projects.yaml", "utf8"));
const siteUrl = (data?.网址 ?? data?.url) || undefined;

export default defineConfig({
  site: siteUrl,
  output: "static",
  devToolbar: { enabled: false },
  integrations: [preact()],
  vite: {
    plugins: [tailwindcss()],
  },
});
