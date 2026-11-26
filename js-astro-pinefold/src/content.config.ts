// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const writing = defineCollection({
  // The old API inferred "read markdown files from this folder"
  // automatically from `type: "content"`. The new API makes that explicit
  // via a `loader` — here, `glob` just means "find files matching this
  // pattern in this folder," but the same mechanism could load from a
  // remote API or database instead, which is the actual point of the
  // redesign — collections aren't tied to local files anymore.
  loader: glob({ pattern: "**/*.md", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { writing };