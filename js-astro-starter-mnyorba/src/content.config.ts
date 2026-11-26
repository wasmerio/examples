/**
 * Content collections configuration for Astro.
 *
 * Defines schemas and validation rules for blog posts and authors.
 * Content is loaded from markdown/MDX files and JSON data files.
 *
 * @see https://docs.astro.build/en/guides/content-collections/
 */

// Import utilities from "astro:content".
import { z, defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Blog posts collection schema
 *
 * Loads markdown and MDX files from ./src/data/blog/
 * Supports categories, tags, featured images, and author references.
 */
const blogCollection = defineCollection({
  loader: glob({
    pattern: ["**/[^_]*.md", "**/[^_]*.mdx"],
    base: "./src/data/blog",
  }),
  schema: z.object({
    /** Publication date (defaults to current date) */
    publishDate: z.date().default(new Date()),
    /** Last update date (optional) */
    updateDate: z.date().optional(),
    /** Hide from production if true */
    draft: z.boolean().optional(),

    /** Post title (required) */
    title: z.string(),
    /** Post description for SEO and previews */
    description: z.string(),
    /** Featured image with alt text */
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),

    /** Post categories for organization */
    category: z.array(z.string()).optional(),
    /** Post tags for filtering */
    tag: z.array(z.string()).optional(),
    /** Reference to author from authors collection */
    author: reference("authors"),
  }),
});

/**
 * Authors collection schema
 *
 * Loads author data from JSON files in ./src/data/authors/
 * Referenced by blog posts for author information.
 */
const authorsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.json", base: "./src/data/authors" }),
  schema: z.object({
    /** Author display name */
    name: z.string(),
    /** Author website URL */
    site: z.string().url(),
  }),
});

/**
 * Exported collections registry
 *
 * Register all content collections here to make them available
 * throughout the Astro application via astro:content APIs.
 */
export const collections = {
  blog: blogCollection,
  authors: authorsCollection,
};
