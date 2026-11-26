export interface SearchSection {
  id: string
  title: string
  start: number
}

export interface SearchItem {
  slug: string
  title: string
  description: string
  tags: string[]
  date: string
  content: string
  sections?: SearchSection[]
}

export function queryTerms(value: string): string[] {
  return [...new Set(value.toLowerCase().trim().split(/\s+/).filter(Boolean))]
}

/** Prefer title matches, then tags, descriptions and full article text. */
export function searchPosts(items: SearchItem[], value: string): SearchItem[] {
  const terms = queryTerms(value)
  if (!terms.length) return []
  const phrase = terms.join(' ')
  return items
    .flatMap((item) => {
      const title = item.title.toLowerCase()
      const tags = item.tags.map((tag) => tag.toLowerCase())
      const description = item.description.toLowerCase()
      const content = item.content.toLowerCase()
      let score = 0
      for (const term of terms) {
        if (title.includes(term)) score += 4
        else if (tags.some((tag) => tag.includes(term))) score += 3
        else if (description.includes(term)) score += 2
        else if (content.includes(term)) score += 1
        else return []
      }
      const exact =
        terms.length > 1 && [title, ...tags, description, content].some((s) => s.includes(phrase))
      return [{ item, score, exact }]
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        Number(b.exact) - Number(a.exact) ||
        Date.parse(b.item.date) - Date.parse(a.item.date)
    )
    .map(({ item }) => item)
}

/** Keep cross-section matches at article level unless one section covers the
 * query together with the article's title, tags or description. */
export function matchingSection(item: SearchItem, terms: string[]) {
  const sections = item.sections ?? []
  const metadata = [item.title, item.description, ...item.tags].map((s) => s.toLowerCase())
  const bodyTerms = terms.filter((term) => !metadata.some((s) => s.includes(term)))
  let best: { section: SearchSection; text: string } | undefined
  let bestScore = 0
  for (const [index, section] of sections.entries()) {
    const text = item.content.slice(section.start, sections[index + 1]?.start)
    const body = text.toLowerCase()
    if (!bodyTerms.every((term) => body.includes(term))) continue
    const title = section.title.toLowerCase()
    let score = 0
    for (const term of terms) {
      if (body.includes(term)) score += terms.length + 1
      if (title.includes(term)) score++
    }
    if (score > bestScore) {
      best = { section, text }
      bestScore = score
    }
  }
  return best
}
