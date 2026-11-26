import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { journalCategoryKeys } from "@/config/journal";
import { disciplineKeys } from "@/config/work";

/** Entries live in a folder each, so the folder name is the id that references use. */
const folderId = ({ entry }: { entry: string }) => entry.replace(/\/index\.mdx?$/, "");

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a six-digit hex colour");

/** One folder per project: `index.md`, the cover, and any stills it lists. */
const work = defineCollection({
  loader: glob({ base: "./src/content/work", pattern: "*/index.{md,mdx}", generateId: folderId }),
  schema: ({ image }) =>
    z.object({
      /** The client's name, set huge on cards and the project page. */
      title: z.string().max(24),
      /** The line under the name. */
      headline: z.string().max(60),
      summary: z.string().min(40).max(240),
      disciplines: z.array(z.enum(disciplineKeys)).min(1),
      sector: z.string(),
      year: z.number().int(),
      location: z.string().optional(),
      /** The project's own colour: the page header and the hover wash on cards. */
      color: hex,
      /** Text on `color`. Pick whichever of light or dark reads best. */
      ink: z.enum(["light", "dark"]).default("light"),
      cover: image(),
      coverAlt: z.string(),
      stills: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      results: z
        .array(z.object({ value: z.string(), label: z.string() }))
        .max(4)
        .default([]),
      testimonial: z.object({ quote: z.string(), name: z.string(), role: z.string() }).optional(),
      credits: z.array(z.object({ role: z.string(), name: z.string() })).default([]),
      website: z.string().optional(),
      /** Stacked on the homepage, by `order`. */
      featured: z.boolean().default(false),
      order: z.number().default(100),
      draft: z.boolean().default(false),
    }),
});

/** One folder per person: `index.md` holding a short bio, beside the portrait it names. */
const people = defineCollection({
  loader: glob({ base: "./src/content/people", pattern: "*/index.{md,mdx}", generateId: folderId }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      portrait: image(),
      location: z.string(),
      linkedin: z.string().optional(),
      instagram: z.string().optional(),
      /** Lower comes first. */
      order: z.number().default(100),
    }),
});

/** One folder per entry: `index.md` or `index.mdx`, with any cover image beside it. */
const journal = defineCollection({
  loader: glob({
    base: "./src/content/journal",
    pattern: "*/index.{md,mdx}",
    generateId: folderId,
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().max(110),
        description: z.string().min(40).max(220),
        date: z.coerce.date(),
        updated: z.coerce.date().optional(),
        category: z.enum(journalCategoryKeys),
        /** People, by folder name. The first is the lead author. */
        authors: z.array(reference("people")).min(1),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        /** Projects the entry discusses, by folder name. */
        work: z.array(reference("work")).default([]),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
      })
      .refine((data) => !data.cover || data.coverAlt, {
        error: "Add `coverAlt` to describe the cover",
        path: ["coverAlt"],
      }),
});

export const collections = { work, people, journal };
