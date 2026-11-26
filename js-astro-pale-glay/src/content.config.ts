// @ts-ignore
import { defineCollection} from 'astro:content';
import { glob,file } from 'astro/loaders';
import {z} from 'astro/zod';

const novel = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/novel" }),
    schema: z.object({
        title: z.string(),
        date: z.date().optional(),
        desc: z.string().optional(),
        draft: z.boolean().default(false),
        cc: z.string(),
        defaultName: z.string().optional(),
        tags: z.array(z.string()).default([]),
    })
});

const memo = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/memo" }),
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        draft: z.boolean().default(false),
    })
});

const settings = defineCollection({
    loader: file("./src/content/settings/index.json", {
        parser: (text) => [{ id: "index", ...JSON.parse(text) }]
    }),
    schema: z.object({
        siteTitle: z.string(),
        subTitle: z.string().optional(),
        headerImage: z.string().optional(),
        desc: z.string().optional(),
        about: z.string().optional(),
        favicon: z.string().optional(),
        lastUpdate: z.string().optional(),
        ogImage: z.string().optional(),
        prof: z.object({
            author: z.string(),
            bio: z.string().optional(),
        }),
        sns: z.array(z.object({
            platform: z.enum(["x", "bluesky", "pixiv", "github"]),
            url: z.string(),
        })).optional(),
    }),
});

export const collections = { novel,memo,settings };