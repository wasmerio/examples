import type { BacklinkMap } from './backlinks'
import type { Post } from './posts'

export interface RelatedOptions {
  limit?: number
  backlinks?: BacklinkMap
}

// 只依赖 post 自身的评分上下文：ownTags / series / 指向 post 的反链源集合，
// 每次调用构建一次，避免在 n 篇候选的两两比较中重复构建
interface ScoreContext {
  ownTags: Set<string>
  series: string
  incoming: Set<string>
  backlinkSets: Map<string, Set<string>>
}

function scoreOf(post: Post, other: Post, ctx: ScoreContext): number {
  let score = 0
  if (post.data.category === other.data.category) score += 3
  for (const tag of other.data.tags) {
    if (ctx.ownTags.has(tag.toLowerCase())) score += 2
  }
  if (ctx.series && ctx.series === (other.data.series ?? '').trim()) score += 2
  if (ctx.incoming.has(other.id) || ctx.backlinkSets.get(other.id)?.has(post.id)) score += 4
  return score
}

export function relatedPostsOf(post: Post, posts: Post[], options: RelatedOptions = {}): Post[] {
  const { limit = 5, backlinks = {} } = options
  const backlinkSets = new Map<string, Set<string>>()
  for (const [id, list] of Object.entries(backlinks)) {
    backlinkSets.set(id, new Set(list))
  }
  const ctx: ScoreContext = {
    ownTags: new Set(post.data.tags.map((tag) => tag.toLowerCase())),
    series: (post.data.series ?? '').trim(),
    incoming: backlinkSets.get(post.id) ?? new Set(),
    backlinkSets,
  }
  return posts
    .filter((other) => other.id !== post.id)
    .map((other) => ({ post: other, score: scoreOf(post, other, ctx) }))
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.post.data.published.valueOf() - a.post.data.published.valueOf(),
    )
    .slice(0, limit)
    .map((entry) => entry.post)
}
