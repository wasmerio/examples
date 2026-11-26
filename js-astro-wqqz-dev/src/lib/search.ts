export type Post = {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  wordCount?: number
  readMinutes?: number
}

export interface IndexedPost<T extends Post = Post> {
  post: T
  searchableContent: string
  tokens: Set<string>
  dateTime: number
  lowerTitle: string
  lowerExcerpt: string
  lowerSlug: string
  lowerTags: string[]
}

const MONTH_NAMES = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
]

const MONTH_SHORT_NAMES = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
]

export function getSearchableContent(post: Post): string {
  if (!post) return ''
  const dateStr = post.date ? String(post.date) : ''
  const d = new Date(dateStr)
  const isValidDate = !isNaN(d.getTime())

  let dateParts: string[] = []
  if (isValidDate) {
    const year = d.getUTCFullYear().toString()
    const month = d.getUTCMonth()
    const day = d.getUTCDate().toString()
    const isoDate = dateStr.slice(0, 10)
    dateParts = [
      year,
      MONTH_NAMES[month] ?? '',
      MONTH_SHORT_NAMES[month] ?? '',
      day,
      isoDate,
    ]
  } else if (dateStr) {
    dateParts = [dateStr]
  }

  const slugParts = post.slug ? String(post.slug).replace(/[-_/]/g, ' ') : ''
  const tags = Array.isArray(post.tags) ? post.tags : []
  const tagParts = tags.flatMap(t => {
    const str = String(t ?? '')
    return [str, str.replace(/[-_/]/g, ' ')]
  })

  return [
    post.title ? String(post.title) : '',
    post.excerpt ? String(post.excerpt) : '',
    slugParts,
    ...tagParts,
    ...dateParts,
  ]
    .join(' ')
    .toLowerCase()
}

const postIndexCache = new WeakMap<Post, IndexedPost<any>>()

export function indexPost<T extends Post>(post: T): IndexedPost<T> {
  const cached = postIndexCache.get(post)
  if (cached) return cached as IndexedPost<T>

  const searchableContent = getSearchableContent(post)
  const words = searchableContent.split(/\s+/).filter(Boolean)
  const tokens = new Set(words)
  const d = new Date(post?.date || 0)
  const dateTime = isNaN(d.getTime()) ? 0 : d.getTime()

  const indexed: IndexedPost<T> = {
    post,
    searchableContent,
    tokens,
    dateTime,
    lowerTitle: String(post?.title || '').toLowerCase(),
    lowerExcerpt: String(post?.excerpt || '').toLowerCase(),
    lowerSlug: String(post?.slug || '').toLowerCase().replace(/[-_/]/g, ' '),
    lowerTags: (Array.isArray(post?.tags) ? post.tags : []).map(t => String(t || '').toLowerCase()),
  }

  postIndexCache.set(post, indexed)
  return indexed
}

export function indexPosts<T extends Post>(posts: T[]): IndexedPost<T>[] {
  if (!Array.isArray(posts)) return []
  return posts.filter(Boolean).map(indexPost)
}

export function searchPosts<T extends Post>(posts: T[], query?: string): T[] {
  if (!posts || !Array.isArray(posts) || posts.length === 0) return []

  const trimmed = typeof query === 'string' ? query.trim().toLowerCase() : ''
  if (!trimmed) {
    return [...posts].sort((a, b) => {
      const timeA = new Date(a?.date || 0).getTime() || 0
      const timeB = new Date(b?.date || 0).getTime() || 0
      return timeB - timeA
    })
  }

  const queryTokens = trimmed.split(/\s+/).filter(Boolean)
  const indexedList = indexPosts(posts)
  const matched: { post: T; score: number; dateTime: number }[] = []

  for (const item of indexedList) {
    const { post, searchableContent, dateTime, lowerTitle, lowerExcerpt, lowerSlug, lowerTags } = item

    let allTokensMatch = true
    let score = 0

    if (lowerTitle === trimmed) {
      score += 100
    } else if (lowerTitle.includes(trimmed)) {
      score += 60
    }

    for (const token of queryTokens) {
      if (!searchableContent.includes(token)) {
        allTokensMatch = false
        break
      }
      if (lowerTitle.includes(token)) {
        score += 25
      }
      if (lowerTags.some(t => t === token || t.includes(token))) {
        score += 20
      }
      if (lowerSlug.includes(token)) {
        score += 10
      }
      if (lowerExcerpt.includes(token)) {
        score += 5
      }
    }

    if (allTokensMatch) {
      matched.push({ post, score, dateTime })
    }
  }

  matched.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score
    }
    return b.dateTime - a.dateTime
  })

  return matched.map(m => m.post)
}

export const filterPosts = searchPosts
