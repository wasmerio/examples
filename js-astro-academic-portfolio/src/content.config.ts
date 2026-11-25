import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const publications = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
    schema: z.object({
        title: z.string(),
        author: z.string().optional(),
        date: z.string().optional(),
        journal: z.string().optional(),
        external_url: z.string().optional(),
        image: z.string().optional(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
    }),
});

const talks = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/talks" }),
    schema: z.object({
        title: z.string(),
        date: z.string().optional(),
        event: z.string().optional(),
        external_url: z.string().optional(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        image: z.string().optional(),
    }),
});

const posts = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
    schema: z.object({
        title: z.string(),
        date: z.string().optional(),
        description: z.string().optional(),
        author: z.string().optional(),
        tags: z.array(z.string()).optional(),
        external_url: z.string().optional(),
        image: z.string().optional(),
    }),
});

const teaching = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/teaching" }),
    schema: z.object({
        title: z.string(),
        institution: z.string().optional(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        external_url: z.string().url().optional(),
    }),
});

const bio = defineCollection({
    loader: glob({ pattern: "bio.md", base: "./src/content" }),
    schema: z.object({
        name: z.string(),
        avatar: z.string(),
        shortBio: z.string().optional(),
        institution: z.string().optional(),
    }),
});

const projects = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        external_url: z.string().optional(),
        image: z.string().optional(),
    }),
});

const cv = defineCollection({
    loader: glob({ pattern: "cv.md", base: "./src/content" }),
    schema: z.object({
        name: z.string(),
        title: z.string(),
        experience: z.array(z.object({
            role: z.string(),
            institution: z.string(),
            period: z.string(),
            description: z.string(),
        })).optional(),
        education: z.array(z.object({
            degree: z.string(),
            institution: z.string(),
            period: z.string(),
            thesis: z.string().optional(),
            description: z.string().optional(),
        })).optional(),
    }),
});

export const collections = {
    'publications': publications,
    'talks': talks,
    'posts': posts,
    'bio': bio,
    'projects': projects,
    'cv': cv,
    'teaching': teaching,
};
