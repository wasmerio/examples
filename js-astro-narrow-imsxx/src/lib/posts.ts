import { url } from "./url"
import { getCollection, type CollectionEntry } from "astro:content"

export type Post = CollectionEntry<"posts">

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("posts", ({ data }) => !data.draft)
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

/** Plain-text word count for CJK + latin mixed content. */
export function wordCount(body: string): number {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*_~|-]/g, " ")
    .trim()
  const cjk = text.match(/[\u4e00-\u9fa5]/g)?.length ?? 0
  const latin = text
    .replace(/[\u4e00-\u9fa5]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length
  return cjk + latin
}

export function readingTime(body: string): number {
  return Math.max(1, Math.round(wordCount(body) / 300))
}

export function summaryOf(post: Post, limit = 180): string {
  if (post.data.summary) return post.data.summary
  const text = post.body
    ?.replace(/```[\s\S]*?```/g, " ")
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*_~`|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  if (!text) return ""
  return text.length > limit ? `${text.slice(0, limit)}…` : text
}

export async function getTags(): Promise<Map<string, Post[]>> {
  return groupBy(await getPosts(), (post) => post.data.tags)
}

export async function getCategories(): Promise<Map<string, Post[]>> {
  return groupBy(await getPosts(), (post) => post.data.categories)
}

export async function getSeries(): Promise<Map<string, Post[]>> {
  const posts = (await getPosts()).filter((post) => post.data.series)
  const grouped = groupBy(posts, (post) =>
    post.data.series ? [post.data.series] : [],
  )
  for (const [, list] of grouped) {
    list.sort(
      (a, b) =>
        (a.data.series_order ?? Infinity) - (b.data.series_order ?? Infinity) ||
        a.data.date.getTime() - b.data.date.getTime(),
    )
  }
  return grouped
}

/** Resolve the ordered parts of the series a post belongs to. */
export async function seriesInfo(post: Post) {
  const name = post.data.series
  if (!name) return null
  const series = await getSeries()
  const parts = series.get(name) ?? []
  const index = parts.findIndex((entry) => entry.id === post.id)
  if (index < 0 || parts.length < 2) return null
  return {
    name,
    href: url(`/series/${name}/`),
    parts,
    current: index + 1,
    total: parts.length,
    prev: parts[index - 1],
    next: parts[index + 1],
  }
}

export type SeriesContext = NonNullable<Awaited<ReturnType<typeof seriesInfo>>>

export async function getRelated(post: Post, limit = 3): Promise<Post[]> {
  const tags = new Set(post.data.tags)
  if (tags.size === 0) return []
  const posts = (await getPosts()).filter((entry) => entry.id !== post.id)
  return posts
    .map((entry) => ({
      entry,
      score: entry.data.tags.filter((tag) => tags.has(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.entry.data.date.getTime() - a.entry.data.date.getTime(),
    )
    .slice(0, limit)
    .map(({ entry }) => entry)
}

function groupBy(
  posts: Post[],
  keysOf: (post: Post) => string[],
): Map<string, Post[]> {
  const map = new Map<string, Post[]>()
  for (const post of posts) {
    for (const key of new Set(keysOf(post))) {
      const list = map.get(key)
      if (list) list.push(post)
      else map.set(key, [post])
    }
  }
  return new Map([...map].sort(([a], [b]) => a.localeCompare(b, "zh-Hans-CN")))
}
