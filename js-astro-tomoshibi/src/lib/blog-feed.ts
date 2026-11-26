/**
 * Latest posts from an RSS 2.0 feed, read at build time. A few regexes cover
 * what the home page needs (title, link, pubDate per <item>), so there is no
 * XML dependency. Atom feeds are not supported. Any failure returns an empty
 * list and the home page omits the section; .github/workflows/scheduled-rebuild.yml
 * can redeploy daily so the list stays fresh.
 */

export type FeedItem = {
  title: string
  href: string
  /** `2026.08.03`, the mono-label date format. */
  date: string
}

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
}

function decode(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&(amp|lt|gt|quot|#39|apos);/g, (entity) => ENTITIES[entity] ?? entity)
    .trim()
}

function tag(xml: string, name: string): string | undefined {
  return xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`))?.[1]
}

function formatDate(pubDate: string | undefined): string {
  const date = pubDate ? new Date(pubDate) : new Date(Number.NaN)
  if (Number.isNaN(date.getTime())) return ''
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}.${m}.${d}`
}

export async function fetchLatestPosts(feedUrl: string, limit = 5): Promise<FeedItem[]> {
  try {
    const res = await fetch(feedUrl, { signal: AbortSignal.timeout(10_000) })
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    const xml = await res.text()
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
      .map(([, item]) => ({
        title: decode(tag(item, 'title') ?? ''),
        // Some feeds leave <link> empty and put the URL in <guid>.
        href: decode(tag(item, 'link') ?? '') || decode(tag(item, 'guid') ?? ''),
        date: formatDate(tag(item, 'pubDate')),
      }))
      .filter((item) => item.title !== '' && item.href.startsWith('http'))
      .slice(0, limit)
  } catch (error) {
    console.warn(`[blog-feed] could not read ${feedUrl}: ${String(error)}`)
    return []
  }
}
