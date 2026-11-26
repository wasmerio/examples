import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import rehypePrettyCode from "rehype-pretty-code";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";

function externalLinksPlugin() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === "element" && node.tagName === "a" && typeof node.properties?.href === "string" && /^https?:\/\//.test(node.properties.href)) {
        node.properties.target = "_blank";
        node.properties.rel = ["noopener", "noreferrer"];
      }
      for (const child of node.children ?? []) visit(child);
    };
    visit(tree);
  };
}

export default defineConfig({
  site: "https://example.com",
  devToolbar: { enabled: false },
  vite: { plugins: [tailwindcss()] },
  integrations: [sitemap()],
  markdown: { processor: unified({ rehypePlugins: [externalLinksPlugin, [rehypePrettyCode, { theme: "github-dark" }]] }) },
});
