import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

function normalizeList(v: string | string[]): string[] {
  const items = typeof v === 'string' ? v.split(',') : v
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of items) {
    const t = raw.trim()
    if (!t) continue
    const key = t.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(t)
  }
  return out
}

function parseDateAsUtc(v: unknown) {
  if (v === undefined || v === null || v instanceof Date) return v
  const s = String(v).trim()
  return new Date(s.includes(' ') ? `${s.replace(' ', 'T')}Z` : `${s}T00:00:00Z`)
}

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(1),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .nullish(),
    index: z.number().int().min(0).default(0),
    description: z.string().min(1),
    category: z
      .union([z.string(), z.array(z.string())])
      .default('未分类')
      .transform((v) => normalizeList(v)[0] ?? '未分类'),
    tags: z
      .union([z.string(), z.array(z.string())])
      .default('')
      .transform((v) => normalizeList(v)),
    published: z.preprocess(parseDateAsUtc, z.date()),
    updated: z.preprocess(parseDateAsUtc, z.date()).optional(),
    draft: z.boolean().default(false),
    series: z.string().trim().optional(),
    series_order: z.number().int().min(1).optional(),
  }),
})

export const collections = { posts }
