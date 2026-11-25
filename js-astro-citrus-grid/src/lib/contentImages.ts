import { createHash } from 'node:crypto'
import path from 'node:path'

export const CONTENT_IMAGE_PREFIX = '/content-images'

const IMAGE_EXT = new Set([
  '.webp',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.avif',
  '.ico',
  '.bmp',
])

export function isContentImageFile(name: string): boolean {
  return IMAGE_EXT.has(path.extname(name).toLowerCase())
}

export function contentImageName(rel: string): string {
  const ext = path.posix.extname(rel)
  const hash = createHash('sha1').update(rel).digest('hex').slice(0, 16)
  return `${hash}${ext}`
}

export function isRelativeSrc(src: string): boolean {
  return Boolean(src) && !/^(?:[a-z][a-z0-9+.-]*:|\/\/|\/|#)/i.test(src)
}

export function isInContentDir(filePath: string): boolean {
  const segments = filePath.split(path.sep).join('/').split('/')
  return segments.some((s, i) => s === 'content' && segments[i - 1] === 'src')
}

function safeDecode(src: string): string {
  try {
    return decodeURIComponent(src)
  } catch {
    return src
  }
}

export function resolveContentPath(src: string, filePath: string): string | null {
  if (!isRelativeSrc(src)) return null
  const segments = filePath.split(path.sep).join('/').split('/')
  const contentIdx = segments.findIndex((s, i) => s === 'content' && segments[i - 1] === 'src')
  if (contentIdx === -1) return null

  const joined = segments.slice(0, -1)
  for (const part of safeDecode(src).split('/')) {
    if (part === '' || part === '.') continue
    if (part === '..') {
      joined.pop()
      continue
    }
    joined.push(part)
  }
  if (joined.length <= contentIdx + 1 || joined[contentIdx] !== 'content') return null

  return joined.slice(contentIdx + 1).join('/')
}

export function resolveContentImage(src: string, filePath: string): string | null {
  const rel = resolveContentPath(src, filePath)
  if (!rel || !isContentImageFile(rel)) return null
  return `${CONTENT_IMAGE_PREFIX}/${contentImageName(rel)}`
}
