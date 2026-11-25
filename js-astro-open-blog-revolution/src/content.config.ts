// 1. Import utilities from `astro:content`
import { defineCollection } from 'astro:content';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'node:path';
import { glob } from 'astro/loaders';

import { loadBlogroll } from './js/loadBlogroll.js';
import { z } from 'astro/zod';
import { success } from 'astro:schema';

// 1. Posts collection

const posts = defineCollection({
    loader: glob({ pattern: "**/*.(md|mdx)", base: "./src/content/posts" }),
    schema: ({ image }) => z.object({
        status: z.preprocess((val) => val === null ? undefined : val, z.enum(['published', 'draft']).default('draft')),
        title: z.preprocess((val) => val === null ? undefined : val, z.string().default('Post title')),
        description: z.preprocess((val) => val === null ? undefined : val, z.string().default('Post description')),
        pubDate: z.preprocess((val) => val === null ? undefined : val, z.date().default(new Date('2025-01-01'))),
        author: z.preprocess((val) => val === null ? undefined : val, z.string().default('Anonymous')),
        tags: z.preprocess((val) => val === null ? undefined : val, z.array(z.string()).default(['tag'])),

        cover: z.object({
            title: z.string().optional(),
            src: z.string().optional(),
            alt: z.string().optional()
        }).optional()

    }),
});

// 2. Blogroll collection

const loadBlogRollData = () => {
    const blogRollsConfigFile = path.join(process.cwd(), 'src', 'data', 'blogrolls.yaml');
    let yamlObject;

    try {
        const fileContents = fs.readFileSync(blogRollsConfigFile, 'utf8');
        yamlObject = yaml.load(fileContents);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return {success: false, error: `blogroll.yaml file not found at path: ${blogRollsConfigFile}`  };
        } else if (error.name === 'YAMLException') {
            return {success: false, error: `Invalid YAML syntax in ${blogRollsConfigFile}: ${error.message}`  };
        } else {
            return {success: false, error: `An unexpected error occurred: ${error.message}` };

        }
    }

    if (!yamlObject) {
        return {success: false, error: `Blogroll YAML is invalid` };
    }

    return {success: true, data: yamlObject };

}

const blogRollData = loadBlogRollData();

const blogRolls = blogRollData.success ? 
defineCollection({
    loader: async () => {
       

        const BlogRollSourceSchema = z.array(z.object({
            category: z.string(),
            urls: z.array(z.string().url())
        }));

        const blogRollObject = BlogRollSourceSchema.parse(blogRollData.data);

        const allBlogRollUrls = blogRollObject.flatMap( blogroll => 
            blogroll.urls.map(url => {
                return {category: blogroll.category, url: url}
            })
        )
        const blogRoll = await loadBlogroll(allBlogRollUrls);
        
        return blogRoll;

    },
    schema: z.object({
        category: z.string(),
        blogTitle: z.string(),
        title: z.string(),
        link: z.string(),
        description: z.string().optional(),
        pubDate: z.string()
    })
}) : null;

// 4. Export a single `collections` object to register your collection(s)
export const collections = { posts, ...(blogRolls ? {blogRolls} : {})};

