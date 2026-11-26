/**
 * 内容集合：站点在自己的 `src/content.config.ts` 中组合（Astro 的内容集合只能由站点声明）。
 *
 * ```ts
 * import { defineCollection } from 'astro:content';
 * import { postsLoader, postsSchema, pagesLoader, pagesSchema } from 'astro-wisp/content';
 *
 * export const collections = {
 *   posts: defineCollection({ loader: postsLoader(), schema: postsSchema() }),
 *   pages: defineCollection({ loader: pagesLoader(), schema: pagesSchema() }),
 * };
 * ```
 *
 * 扩展 frontmatter：`postsSchema({ extend: z.object({ series: z.object({ id: z.string(), order: z.number() }).optional() }) })`。
 */
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import type { SchemaContext } from 'astro:content';
import { postId } from './utils/post-id';

export { postId };

export interface LoaderOptions {
  /** 相对项目根的内容目录 */
  base?: string;
}

/** 文章：`<base>/<slug>/index.{md,mdx}` 或 `<base>/<slug>.{md,mdx}`。 */
export function postsLoader({ base = './src/content/posts' }: LoaderOptions = {}) {
  return glob({
    pattern: ['**/index.{md,mdx}', '*.{md,mdx}'],
    base,
    generateId: ({ entry }) => postId(entry),
  });
}

/** 独立页面（如 about.md）。 */
export function pagesLoader({ base = './src/content/pages' }: LoaderOptions = {}) {
  return glob({ pattern: '*.{md,mdx}', base, generateId: ({ entry }) => postId(entry) });
}

const postFields = ({ image }: SchemaContext) =>
  z.object({
    title: z.string().max(80),
    description: z.string().max(200),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    cover: image().optional(),
    lang: z.string().optional(),
    toc: z.boolean().default(true),
    series: z
      .object({
        id: z.string().min(1),
        order: z.number().int().min(1),
      })
      .optional(),
  });

const pageFields = z.object({
  title: z.string(),
  description: z.string().optional(),
});

type AnyObjectSchema = z.ZodObject<z.ZodRawShape>;
type Extend<E> = E extends AnyObjectSchema
  ? E
  : E extends (ctx: SchemaContext) => infer R
    ? R
    : never;

/** 文章 frontmatter。`extend` 可以是 zod object，也可以是 `({ image }) => z.object(...)`。 */
export function postsSchema<
  E extends AnyObjectSchema | ((ctx: SchemaContext) => AnyObjectSchema) = AnyObjectSchema,
>(opts: { extend?: E } = {}) {
  return (ctx: SchemaContext) => {
    const ext: AnyObjectSchema | undefined =
      typeof opts.extend === 'function' ? opts.extend(ctx) : opts.extend;
    const base = postFields(ctx);
    return (ext ? base.extend(ext.shape) : base) as ReturnType<typeof postFields> & Extend<E>;
  };
}

export function pagesSchema<E extends AnyObjectSchema = AnyObjectSchema>(
  opts: { extend?: E } = {},
) {
  return (opts.extend ? pageFields.extend(opts.extend.shape) : pageFields) as typeof pageFields & E;
}
