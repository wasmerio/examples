// @ts-check
import siteConfig from "./site.config";

import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import { satteri } from "@astrojs/markdown-satteri";

// https://astro.build/config
export default defineConfig({
  markdown: {
    processor: satteri({
      hastPlugins: [
        {
          name: "github-alerts",
          element: {
            filter: ["blockquote"],
            visit(node, context) {
              const firstParagraph = node.children.find(
                (child) => child.type === "element" && child.tagName === "p",
              );
              if (
                firstParagraph?.type !== "element" ||
                firstParagraph.tagName !== "p"
              ) {
                return;
              }

              const firstText = firstParagraph.children[0];
              if (firstText?.type !== "text") return;

              const match = firstText.value.match(
                /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?=$|[\t\r\n ])/,
              );
              if (!match) return;

              const alertType = match[1].toLowerCase();
              const remainingText = firstText.value
                .slice(match[0].length)
                .replace(/^[\t\r\n ]+/, "");
              const remainingChildren = [...firstParagraph.children];

              if (remainingText) {
                remainingChildren[0] = { ...firstText, value: remainingText };
              } else {
                remainingChildren.shift();
              }
              context.setProperty(
                firstParagraph,
                "children",
                remainingChildren,
              );

              const rawClasses = node.properties.className as unknown;
              const classNames = Array.isArray(rawClasses)
                ? rawClasses
                : typeof rawClasses === "string"
                  ? rawClasses.split(/\s+/)
                  : [];
              context.setProperty(node, "className", [
                ...classNames,
                "markdown-alert",
                `markdown-alert-${alertType}`,
              ]);
              context.insertBefore(firstParagraph, {
                type: "element",
                tagName: "p",
                properties: { className: ["markdown-alert-title"] },
                children: [{ type: "text", value: match[1] }],
              });

              if (remainingChildren.length === 0) {
                context.removeNode(firstParagraph);
              }
            },
          },
        },
      ],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
  site: siteConfig.url,
  integrations: [
    sitemap(),
    mdx(),
    icon({
      include: {
        lucide: ["*"],
      },
    }),
  ],
});
