// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import { satteri, satteriHeadingIdsPlugin } from "@astrojs/markdown-satteri";
import { mdastAbstract } from "./src/satteri/mdast-abstract.mjs";
import { mdastDate } from "./src/satteri/mdast-date.mjs";
import { mdastMapImage } from "./src/satteri/mdast-map-image.mjs";
import { mdastRngTable } from "./src/satteri/mdast-rng-table.mjs";
import { mdastStatblock } from "./src/satteri/mdast-statblock.mjs";
import { mdastGoto } from "./src/satteri/mdast-goto.mjs";
import { mdastTimeline } from "./src/satteri/mdast-timeline.mjs";
import { mdastAbstractOf } from "./src/satteri/mdast-abstract-of.mjs";
import { mdastFamilyTree } from "./src/satteri/mdast-family-tree.mjs";
import { mdastLink } from "./src/satteri/mdast-link.mjs";

// https://astro.build/config
export default defineConfig({
    output: "static",
    integrations: [svelte(), mdx()],

    markdown: {
        processor: satteri({
            features: {
                gfm: true,
                smartPunctuation: true,
                headingAttributes: true,
                directive: true,
                wikilinks: true,
            },
            mdastPlugins: [
                mdastLink,
                mdastDate,
                mdastMapImage,
                mdastTimeline,
                mdastFamilyTree,
                mdastRngTable,
                mdastStatblock,
                mdastGoto,
                mdastAbstract,
                mdastAbstractOf,
            ],
            hastPlugins: [satteriHeadingIdsPlugin()],
        }),
    },

    vite: {
        plugins: [tailwindcss()],
    },
});
