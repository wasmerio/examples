import { readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import {
  isContentImageFile,
  isRelativeSrc,
  resolveContentImage,
  resolveContentPath,
} from '../contentImages'

export const POST_INDEX_REL = '.generated/post-index.json'
export const POST_INDEX_FILE = path.resolve(process.cwd(), POST_INDEX_REL)

const MD_EXT = /\.(md|markdown)$/i

export interface PostIndexEntry {
  file: string
  slug: string
  draft: boolean
}

export type PostIndex = Map<string, PostIndexEntry>

export type RelLinkWarn = (message: string, filePath: string, href: string) => void

export function toPostIndex(entries: PostIndexEntry[]): PostIndex {
  const map: PostIndex = new Map()
  for (const entry of entries) {
    if (entry?.file && entry.slug) map.set(entry.file, entry)
  }
  return map
}

let indexCache: { mtimeMs: number; map: PostIndex } | null = null

export function loadPostIndex(indexFile: string = POST_INDEX_FILE): PostIndex {
  try {
    const mtimeMs = statSync(indexFile).mtimeMs
    if (indexCache && indexCache.mtimeMs === mtimeMs) return indexCache.map
    const data = JSON.parse(readFileSync(indexFile, 'utf-8')) as PostIndexEntry[]
    const map = toPostIndex(data)
    indexCache = { mtimeMs, map }
    return map
  } catch {
    return new Map()
  }
}

export function readSlugFromFile(contentRel: string): string | null {
  try {
    const raw = readFileSync(path.join(process.cwd(), 'src', 'content', contentRel), 'utf-8')
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
    return fm.match(/^slug:\s*['"]?([a-z0-9-]+)['"]?\s*$/m)?.[1] ?? null
  } catch {
    return null
  }
}

export function warnRelLink(message: string, filePath: string, href: string): void {
  const rel = filePath.split(path.sep).join('/')
  const at = rel.includes('src/content/') ? rel.slice(rel.indexOf('src/content/')) : rel
  console.warn(`[rel-link] ${message}: "${href}" (${at})`)
}

export function resolveHrefTarget(
  href: string,
  filePath: string,
  index: PostIndex,
  onWarn: RelLinkWarn = warnRelLink,
): string | null {
  if (!href || !isRelativeSrc(href)) return null

  const suffixMatch = href.match(/[?#]/)
  let pathPart = href
  let suffix = ''
  if (suffixMatch && suffixMatch.index != null) {
    pathPart = href.slice(0, suffixMatch.index)
    suffix = href.slice(suffixMatch.index)
  }

  const contentRel = resolveContentPath(pathPart, filePath)
  if (!contentRel) {
    onWarn('relative link escapes src/content/, kept as-is', filePath, href)
    return null
  }

  const entry = index.get(contentRel)
  if (entry || MD_EXT.test(contentRel)) {
    const slug = entry?.slug ?? readSlugFromFile(contentRel)
    if (slug) {
      if (entry?.draft && process.env.NODE_ENV === 'production') {
        onWarn('links to a draft post which is not built in production', filePath, href)
      }
      return `/posts/${slug}/${suffix}`
    }
    onWarn('target post not found, kept as-is', filePath, href)
    return null
  }

  if (isContentImageFile(contentRel)) {
    const image = resolveContentImage(pathPart, filePath)
    if (image) return `${image}${suffix}`
  }

  onWarn('unsupported relative link target, kept as-is', filePath, href)
  return null
}
