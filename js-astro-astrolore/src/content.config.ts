import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

import { ProjectFrontmatter } from "$lib/schema/project";
import { ArticleFrontmatter } from "$lib/schema/codex-article";
import { MapImageSchema } from "$lib/schema/codex-map";
import { DocumentFrontmatter } from "$lib/schema/codex-document";

import { HandoutData } from "$lib/schema/binder-handout";
import { TimelineData } from "$lib/schema/codex-timeline";
import { TableData } from "$lib/schema/binder-table";
import { StatblockData } from "$lib/schema/binder-statblock";

const projects = defineCollection({
    loader: glob({ pattern: "*.(json|yaml|yml)", base: "./src/content" }),
    schema: ProjectFrontmatter,
});

const categories = defineCollection({
    loader: glob({ pattern: "*/categories/*.(md|mdx)", base: "./src/content" }),
    schema: ProjectFrontmatter,
});

const articles = defineCollection({
    loader: glob({ pattern: "*/articles/*.(md|mdx)", base: "./src/content" }),
    schema: ({ image }) => ArticleFrontmatter(image),
});

const maps = defineCollection({
    loader: glob({
        pattern: "*/maps/*.(json|yaml|yml)",
        base: "./src/content",
    }),
    schema: ({ image }) => MapImageSchema(image),
});

const timelines = defineCollection({
    loader: glob({
        pattern: "*/timelines/*.(json|yaml|yml)",
        base: "./src/content",
    }),
    schema: TimelineData,
});

const documents = defineCollection({
    loader: glob({ pattern: "*/documents/*.(md|mdx)", base: "./src/content" }),
    schema: DocumentFrontmatter,
});

const handouts = defineCollection({
    loader: glob({
        pattern: "*/handouts/*.(json|yaml|yml)",
        base: "./src/content",
    }),
    schema: HandoutData,
});

const tables = defineCollection({
    loader: glob({
        pattern: "*/tables/*.(json|yaml|yml)",
        base: "./src/content",
    }),
    schema: TableData,
});

const statblocks = defineCollection({
    loader: glob({
        pattern: "*/statblocks/*.(json|yaml|yml)",
        base: "./src/content",
    }),
    schema: ({ image }) => StatblockData(image),
});

export const collections = {
    projects,
    categories,
    articles,
    maps,
    timelines,
    documents,

    handouts,
    tables,
    statblocks,
};
