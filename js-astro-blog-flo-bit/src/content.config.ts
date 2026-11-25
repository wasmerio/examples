import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog/" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    // title of the blog post, don't repeat this in the markdown part
    // REQUIRED
    title: z.string(),

    // will be shown in the blog post list
    // REQUIRED
    description: z.string(),

    // date published
    // REQUIRED
    pubDate: z.coerce.date(),

    // whether the post is published
    // defaults to true
    // if set to false the post will not be shown in the blog list nor be accessible by url
    published: z.boolean().optional(),

    // whether to hide the post from the blog list (can still be accessed by url)
    // useful for sharing drafts with other people
    hidden: z.boolean().optional(),

    // whether to disable bluesky comments
    disableComments: z.boolean().optional(),

    // whether to disable bluesky likes
    disableLikes: z.boolean().optional(),

    // short description will be used for og image (fallback to description)
    shortDescription: z.string().optional(),

    // date updated
    updatedDate: z.coerce.date().optional(),

    // path to the hero image, HAS TO BE IN /src/assets folder
    // and HAS TO START with `/src/assets/`
    heroImage: z.string().optional(),

    // array of tags
    tags: z.array(z.string()).optional(),

    // whether to hide the hero image in the blog post
    hideHero: z.boolean().optional(),

    // whether to hide the hero image in the blog post
    noImage: z.boolean().optional(),

    // replace the default og image with a custom one, will also not show the title and description in the og image (add it yourself)
    // has to be in /src/assets folder and has to start with `/src/assets/`
    customOGImage: z.string().optional(),
  }),
});

import { authorFeedLoader } from "@ascorbic/bluesky-loader";
import { BLUESKY_IDENTIFIER } from "./config.ts";

const posts = defineCollection({
  loader: authorFeedLoader({
    identifier: BLUESKY_IDENTIFIER,
  }),
});

export const collections = { blog, posts };
