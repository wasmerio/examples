interface NavigablePost {
  id: string
  data: {
    aliases?: string[]
    series?: { name: string; order: number }
  }
}

/** Astro route params are unescaped. Reject separators and traversal after decoding each segment. */
function aliasSlug(path: string): string {
  const segments = path.replace(/\/$/, '').slice(1).split('/')
  const invalid = () =>
    new Error(`Invalid post alias "${path}". Use a site-relative path such as /blog/old-name/.`)
  if (!path.startsWith('/') || path.includes('?') || path.includes('#')) throw invalid()
  return segments
    .map((part) => {
      let segment: string
      try {
        segment = decodeURIComponent(part)
      } catch {
        throw invalid()
      }
      if (
        !segment ||
        segment === '.' ||
        segment === '..' ||
        /[\\/%?#:*"<>|\u0000-\u001f]/u.test(segment)
      ) {
        throw invalid()
      }
      return segment
    })
    .join('/')
}

export function getPostAliases(posts: NavigablePost[]) {
  const owners = new Map<string, string>()
  for (const post of posts) {
    owners.set(`blog/${post.id.replace(/\/index$/, '')}`.toLowerCase(), post.id)
  }
  return posts.flatMap((post) =>
    (post.data.aliases ?? []).map((path) => {
      const alias = aliasSlug(path)
      const key = alias.toLowerCase()
      if (owners.has(key)) {
        throw new Error(
          `Post alias "${path}" in "${post.id}" conflicts with a path already owned by "${owners.get(key)}".`
        )
      }
      owners.set(key, post.id)
      return { alias, postId: post.id }
    })
  )
}

/** The caller supplies published posts only, so draft titles never appear in public navigation. */
export function getSeriesNavigation<T extends NavigablePost>(post: T, published: T[]) {
  const series = post.data.series
  if (!series) return
  const parts = published
    .filter((part) => part.data.series?.name === series.name)
    .sort((a, b) => a.data.series!.order - b.data.series!.order)
  for (let i = 1; i < parts.length; i++) {
    if (parts[i - 1].data.series!.order === parts[i].data.series!.order) {
      throw new Error(
        `Duplicate order ${parts[i].data.series!.order} in series "${series.name}": ${parts[i - 1].id} and ${parts[i].id}.`
      )
    }
  }
  const index = parts.findIndex((part) => part.id === post.id)
  if (index === -1 || parts.length < 2) return
  return {
    name: series.name,
    position: index + 1,
    total: parts.length,
    previous: parts[index - 1],
    next: parts[index + 1]
  }
}
