import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// ─────────────────────────────────────────────────────────────────────────────
//  Projects collection.
//  Each case study is one markdown file in src/content/projects/. The filename
//  becomes the URL slug (acme.md → /work/acme). Frontmatter is validated against
//  the schema below, so a typo fails the build instead of shipping broken.
// ─────────────────────────────────────────────────────────────────────────────

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      /** Project name. Card heading, page <h1>, <title>. */
      title: z.string(),
      /** ≤140 chars. Shown on cards and used as the meta description. */
      oneLiner: z.string().max(140),
      /** 1–2 sentence intro shown at the top of the project page. */
      summary: z.string().max(320),
      /** Honest ownership line, e.g. "Founding engineer" / "Solo engineer". */
      role: z.string().optional(),
      /** Display period, e.g. "Jun 2025 – present". */
      period: z.string().optional(),
      /** Lower sorts first on /work. */
      order: z.number().int().default(99),
      /** Stack chips (text only, no logos). */
      tags: z.array(z.string()).default([]),
      /** Surface on the home page. */
      featured: z.boolean().default(false),
      /** Hide a work-in-progress entry without deleting it. */
      draft: z.boolean().default(false),
      /** Optional optimised cover image (place beside the .md file). */
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** Outbound links. url may be "#" for a placeholder with a `note`. */
      links: z
        .array(
          z.object({
            label: z.string(),
            url: z.string(),
            note: z.string().optional(),
          }),
        )
        .default([]),
    }),
});

// Blog posts. One markdown file per post in src/content/blog/.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    /** Post title. */
    title: z.string(),
    /** 1–2 sentence summary, shown on the blog index and used as the meta description. */
    description: z.string().max(200),
    /** Publish date (newest first). */
    date: z.coerce.date(),
    /** Optional tags. */
    tags: z.array(z.string()).default([]),
    /** Hide a draft post without deleting it. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };
