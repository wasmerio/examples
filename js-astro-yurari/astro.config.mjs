// @ts-check
import { defineConfig } from "astro/config";

import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import { satteri } from "@astrojs/markdown-satteri";
import ogp from "./src/plugins/ogp.mjs";
import callout from "./src/plugins/callout.mjs";
import base from "./src/plugins/base.mjs";

// Keystatic (ローカルモード) は開発サーバーでのみ有効にする。
// 管理画面のルートはサーバーレンダリングが必要で、静的ビルドにはアダプターが要るため。
const isDev = process.argv.includes("dev");

// 公開URLとサブパスは、ビルド時に環境変数で渡す (サブパスで公開するときだけ必要)。
// 未指定なら、ローカルでは http://localhost:4321/ そのまま動く。
//   SITE_URL  例: https://<user>.github.io
//   BASE_PATH 例: /<repo>
const site = process.env.SITE_URL ?? "https://example.com";
const basePath = process.env.BASE_PATH ?? "/";

// https://astro.build/config
export default defineConfig({
  site,
  base: basePath,
  integrations: [icon(), ...(isDev ? [react(), keystatic()] : [])],

  markdown: {
    processor: satteri({ mdastPlugins: [callout, ogp, base(basePath)] }),
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
