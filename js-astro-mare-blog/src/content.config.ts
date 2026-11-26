import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const dateOnly = z
  .union([
    z.date(),
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a YYYY-MM-DD date without a time."),
  ])
  .transform((value) =>
    typeof value === "string" ? new Date(`${value}T00:00:00Z`) : value,
  )
  .refine((date) => !Number.isNaN(date.getTime()), "Invalid date.")
  .refine(
    (date) =>
      date.getUTCHours() === 0 &&
      date.getUTCMinutes() === 0 &&
      date.getUTCSeconds() === 0 &&
      date.getUTCMilliseconds() === 0,
    "pubDate must be a date only (YYYY-MM-DD), not a date-time.",
  );

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: dateOnly,
    featured: z.boolean().default(false),
    tags: z.array(z.string().trim().min(1)).default([]),
  }),
});

const page = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/page" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

const journal = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/journal" }),
  schema: z.object({
    title: z.string(),
    pubDate: dateOnly,
  }),
});

const friend = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/friend" }),
  schema: z.object({
    name: z.string().trim().min(1),
    url: z.string().trim().min(1),
    description: z.string().trim().min(1),
    avatar: z.string().trim().min(1).optional(),
    darkAvatar: z.string().trim().min(1).optional(),
  }),
});

export const collections = { blog, page, journal, friend };
