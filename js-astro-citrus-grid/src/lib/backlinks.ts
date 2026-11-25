import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Post } from './posts'

export type BacklinkMap = Record<string, string[]>

const BACKLINKS_FILE = path.resolve(process.cwd(), '.generated/backlinks.json')

export function loadBacklinks(file: string = BACKLINKS_FILE): BacklinkMap {
  try {
    return JSON.parse(readFileSync(file, 'utf-8')) as BacklinkMap
  } catch {
    return {}
  }
}

export function resolveBacklinks(map: BacklinkMap, posts: Post[]): Map<string, Post[]> {
  const bySlug = new Map(posts.map((post) => [post.id, post]))
  const out = new Map<string, Post[]>()
  for (const [target, sources] of Object.entries(map)) {
    const refs = sources
      .map((slug) => bySlug.get(slug))
      .filter((post): post is Post => Boolean(post))
      .sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf())
    if (refs.length) out.set(target, refs)
  }
  return out
}
