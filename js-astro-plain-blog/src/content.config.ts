import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { isCalendarDate, validateSlug } from "./lib/publication.mjs";

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/posts",
    generateId: ({ entry }) => {
      if (entry.includes("/"))
        throw new Error(`Article must be a flat file: ${entry}`);
      return validateSlug(entry.replace(/\.md$/, ""));
    },
  }),
  schema: z.object({
    title: z.string().trim().min(1),
    date: z
      .string()
      .refine(isCalendarDate, "Expected real YYYY-MM-DD calendar date"),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
