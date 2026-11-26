import path from "node:path";
import { fileURLToPath } from "node:url";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import rehypeFigure from "@microflash/rehype-figure";
import playformCompress from "@playform/compress";
import { defineConfig, fontProviders } from "astro/config";
import expressiveCode from "astro-expressive-code";
import pagefind from "astro-pagefind";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";
import { CONTENT_DIR } from "./src/config/content-dir";
import { SITE } from "./src/config/site";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDirAbsolute = path.resolve(__dirname, CONTENT_DIR);

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  compressHTML: true,
  trailingSlash: "never",
  build: {
    format: "file", // generate `page.html` instead of `page/index.html`
  },
  prefetch: {
    // Keep prefetch, but only prefetch for links with `data-astro-prefetch`
    prefetchAll: false,
  },
  image: {
    layout: "constrained",
    responsiveStyles: true,
  },
  markdown: {
    // Keep the remark/rehype pipeline for existing plugins
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        // LaTeX math support
        rehypeKatex,
        // Transform alt text into figure captions
        rehypeFigure,
        // Open external links in a new tab for security
        [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }],
        // Add id attributes to headings (rehypeAutolinkHeadings)
        rehypeSlug,
        // Add anchor links to headings
        [rehypeAutolinkHeadings, { behavior: "append" }],
      ],
    }),
    // Use ExpressiveCode instead of built-in syntax highlighting
    syntaxHighlight: false,
  },
  integrations: [
    // Syntax highlighting
    expressiveCode({
      plugins: [
        pluginLineNumbers(),
        {
          name: "a11y-pre-tabindex",
          hooks: {
            postprocessRenderedBlock: ({ renderData }) => {
              const findPre = (
                node: typeof renderData.blockAst,
              ): typeof renderData.blockAst | undefined => {
                if (node.tagName === "pre") return node;
                for (const child of node.children ?? []) {
                  if (typeof child === "object" && "tagName" in child) {
                    const found = findPre(child as typeof renderData.blockAst);
                    if (found) return found;
                  }
                }
              };
              const pre = findPre(renderData.blockAst);
              if (pre) pre.properties.tabindex = 0;
            },
          },
        },
      ],
      // https://expressive-code.com/guides/themes/
      themes: ["catppuccin-latte", "one-dark-pro"],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) => {
        if (theme.type === "dark") return '[data-theme="dark"]';
        return false;
      },
      defaultProps: {
        wrap: false,
        showLineNumbers: false,
        overridesByLang: {
          "bash,cmd,powershell,ps,sh,shell,zsh": { frame: "none" },
        },
      },
      styleOverrides: {
        codeFontFamily: "var(--font-mono)",
        uiFontFamily: "var(--font-body)",
        borderWidth: "0",
        textMarkers: {
          backgroundOpacity: "33%",
          inlineMarkerBorderWidth: "0.1px",
        },
        frames: {
          editorTabBarBackground: "transparent",
          frameBoxShadowCssValue: "transparent",
          tooltipSuccessBackground: "var(--color-700)",
        },
      },
    }),
    // Sitemap generation
    sitemap({
      // Exclude list pages from the sitemap
      filter: (page) => {
        const path = new URL(page).pathname;
        return !/^\/(tags|categories|archives|search)(\/|$)|^\/posts(\/\d+)?$/.test(path);
      },
      serialize(item) {
        if (/\/posts\//.test(item.url)) {
          // Blog posts
          item.priority = 0.9;
        } else if (/\/$/.test(item.url)) {
          // Home page
          item.priority = 0.8;
        } else {
          // Default priority for all other pages
          item.priority = 0.2;
        }
        return item;
      },
    }),
    // Search engine
    pagefind(),
    // Compression
    playformCompress({ Image: false }),
  ],
  // https://docs.astro.build/en/guides/fonts/
  fonts: [
    {
      cssVariable: "--font-body",
      name: "Geist",
      weights: [400, 700],
      styles: ["normal"],
      fallbacks: ["sans-serif"],
      formats: ["woff2"],
      provider: fontProviders.fontsource(),
    },
    {
      cssVariable: "--font-mono",
      name: "Fira Mono",
      weights: [400, 700],
      styles: ["normal"],
      fallbacks: ["monospace"],
      formats: ["woff2"],
      provider: fontProviders.fontsource(),
    },
    {
      cssVariable: "--font-og",
      name: "Noto Sans",
      weights: [400],
      styles: ["normal"],
      formats: ["woff"], // Satori doesn't support woff2
      provider: fontProviders.fontsource(),
    },
  ],
  vite: {
    server: {
      allowedHosts: ["host.containers.internal"],
      fs: {
        allow: [contentDirAbsolute, path.resolve(__dirname, "..")],
      },
    },
  },
});
