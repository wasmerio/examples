import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { imageMetadata } from 'astro/assets/utils'

const decoder = new TextDecoder()
const unsafeBrands = new Set(['avif', 'avis', 'mif1', 'msf1', 'heic', 'heix', 'hevc', 'hevx'])

async function imageSize(input: Uint8Array) {
  const signature = (start: number, end: number) => decoder.decode(input.subarray(start, end))
  if (signature(0, 4) === 'icns' || signature(4, 8) === 'JXL ' || (signature(4, 8) === 'ftyp' && unsafeBrands.has(signature(8, 12)))) {
    throw new TypeError('Automatic sizing is disabled for this image format')
  }
  return imageMetadata(input)
}

const badges = ['https://img.shields.io', 'https://badge.fury.io', 'https://badgen.net', 'https://forthebadge.com', 'https://vercel.com/button']
const cache = new Map<string, { width: number, height: number } | null>()

async function remoteSize(url: string) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 3000)
  try {
    const response = await fetch(url.startsWith('//') ? `https:${url}` : url, { signal: controller.signal })
    if (!response.ok || !response.body) return null
    const chunks: Uint8Array[] = []
    for await (const chunk of response.body) {
      chunks.push(chunk)
      try {
        const size = await imageSize(Buffer.concat(chunks))
        if (size.width && size.height) return { width: size.width, height: size.height }
      } catch { /* keep reading until the header is complete */ }
    }
  } catch { /* unavailable images do not fail the build */ }
  finally { clearTimeout(timeout); controller.abort() }
  return null
}

async function originalSize(src: string, sourcePath: string | undefined, publicDir: string, remote: boolean) {
  const remoteUrl = /^(?:https?:)?\/\//u.test(src)
  const key = remoteUrl ? src : src.startsWith('/') ? resolve(publicDir, src.slice(1)) : sourcePath ? resolve(dirname(sourcePath), src) : ''
  if (!key || src.startsWith('data:') || (remoteUrl && (!remote || badges.some(badge => src.startsWith(badge))))) return null
  if (cache.has(key)) return cache.get(key) ?? null
  try {
    const size = remoteUrl ? await remoteSize(src) : await imageSize(await readFile(key))
    const value = size?.width && size?.height ? { width: size.width, height: size.height } : null
    cache.set(key, value)
    return value
  } catch {
    cache.set(key, null)
    return null
  }
}

export async function injectImageSizes(html: string, { sourcePath, mode, publicDir = resolve('public'), build = process.env.NODE_ENV === 'production' }: { sourcePath?: string, mode?: boolean | 'local' | 'all', publicDir?: string, build?: boolean }) {
  if (!build || !mode) return html
  const matches = [...html.matchAll(/<img\b([^>]*)>/gu)]
  const replacements = await Promise.all(matches.map(async match => {
    const attrs = match[1]
    const src = attrs.match(/\bsrc=(['"])(.*?)\1/u)?.[2] ?? attrs.match(/\bsrcset=(['"])(.*?)\1/u)?.[2]
    const width = attrs.match(/\bwidth=(['"])(\d+)\1/u)?.[2]
    const height = attrs.match(/\bheight=(['"])(\d+)\1/u)?.[2]
    if (!src || (width && height)) return match[0]
    const original = await originalSize(src, sourcePath, publicDir, mode === 'all')
    if (!original) return match[0]
    const resolvedWidth = width ? Number(width) : height ? Math.round(Number(height) * original.width / original.height) : original.width
    const resolvedHeight = height ? Number(height) : width ? Math.round(Number(width) * original.height / original.width) : original.height
    return `<img${attrs}${width ? '' : ` width="${resolvedWidth}"`}${height ? '' : ` height="${resolvedHeight}"`}>`
  }))
  let offset = 0
  return html.replace(/<img\b([^>]*)>/gu, () => replacements[offset++])
}
