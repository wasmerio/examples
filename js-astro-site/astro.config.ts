import { defineConfig } from "astro/config";
import pagefind from "./src/utils/integration/pagefind";
import jampack from "./src/utils/integration/jampack";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import markdownIntegration from "@astropub/md";
import remarkToc from "remark-toc";
import remarkUnwrapImages from "remark-unwrap-images";
import remarkCollapse from "remark-collapse";
import rehypeExternalLinks from "rehype-external-links";
import { SITE, ICON_INCLUDE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    jampack(),
    pagefind(),
    sitemap(),
    icon({
      include: ICON_INCLUDE,
      svgoOptions: {
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                cleanupIds: {
                  minify: false,
                },
              },
            },
          },
        ],
      },
    }),
    markdownIntegration(),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      remarkUnwrapImages,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: "nofollow, noopener, noreferrer",
          content: {
            type: "element",
            tagName: "svg",
            properties: {
              width: "1em",
              height: "1em",
              className: "w-5 h-5 ml-1 mb-1",
              viewBox: "0 0 24 24",
            },
            children: [
              {
                type: "element",
                tagName: "use",
                properties: { "xlink:href": "#ai:tabler:external-link" },
              },
            ],
          },
        },
      ],
    ],
    shikiConfig: {
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-mocha",
      },
      wrap: true,
    },
  },
  image: {
    service: {
      entrypoint: "./src/utils/assets/services/noop",
    },
  },
  build: {
    assets: "_assets",
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
    server: {
      watch: {
        ignored: ["**/.direnv/**"],
      },
    },
  },
  scopedStyleStrategy: "where",
  experimental: {
    clientPrerender: true,
    contentCollectionCache: true,
    contentCollectionJsonSchema: true,
    directRenderScript: true,
    security: {
      csrfProtection: {
        origin: true,
      },
    },
  },
});
