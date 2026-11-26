import { defineMdastPlugin } from "satteri";

// Markdown 内のサイト内リンク・画像 (`/about`, `/hero.svg` など) に base を付ける Sätteri (mdast) プラグイン。
// Astro は Markdown 中の絶対パスに base を付けないため、プロジェクトページ配下 (`/repo/`) で公開するときに必要。

export default function base(basePath = "/") {
  const prefix = basePath.replace(/\/$/, "");
  const needsPrefix = (url) => prefix && url.startsWith("/") && !url.startsWith("//") && url !== prefix && !url.startsWith(`${prefix}/`);

  return defineMdastPlugin({
    name: "base",
    link(node, ctx) {
      if (needsPrefix(node.url)) ctx.setProperty(node, "url", prefix + node.url);
    },
    image(node, ctx) {
      if (needsPrefix(node.url)) ctx.setProperty(node, "url", prefix + node.url);
    },
  });
}
