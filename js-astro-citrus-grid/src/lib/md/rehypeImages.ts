import { readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import type { Nodes, Root } from 'hast'

import { resolveContentImage } from '../contentImages'
import { resolveFilePath, type VFileLike } from './vfile'

const LQIP_FILE = path.resolve(process.cwd(), '.generated/lqips.json')

interface ImageInfo {
  c: string
  w: number
  h: number
}

type ImageInfoMap = Record<string, ImageInfo>

let lqipCache: { mtimeMs: number; data: ImageInfoMap } | null = null

function normalizeEntry(value: unknown): ImageInfo | null {
  if (typeof value === 'string') {
    return value.length === 18 ? { c: value, w: 0, h: 0 } : null
  }
  if (value && typeof value === 'object') {
    const entry = value as Partial<ImageInfo>
    if (typeof entry.c === 'string' && entry.c.length === 18) {
      return { c: entry.c, w: Number(entry.w) || 0, h: Number(entry.h) || 0 }
    }
  }
  return null
}

function loadImageInfo(): ImageInfoMap {
  try {
    const mtimeMs = statSync(LQIP_FILE).mtimeMs
    if (lqipCache && lqipCache.mtimeMs === mtimeMs) return lqipCache.data
    const raw = JSON.parse(readFileSync(LQIP_FILE, 'utf-8')) as Record<string, unknown>
    const data: ImageInfoMap = {}
    for (const [key, value] of Object.entries(raw)) {
      const entry = normalizeEntry(value)
      if (entry) data[key] = entry
    }
    lqipCache = { mtimeMs, data }
    return data
  } catch {
    return {}
  }
}

function lqipGradient(compact: string): string {
  if (compact.length !== 18) return ''
  const c = (i: number) => `#${compact.slice(i, i + 6)}`
  return `linear-gradient(135deg, ${c(0)} 0%, ${c(6)} 50%, ${c(12)} 100%)`
}

function escapeAttr(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function transform(
  parent: { children: Nodes[] },
  filePath: string,
  state: { firstImgDone: boolean },
  info: ImageInfoMap,
) {
  const children = parent.children
  for (let i = 0; i < children.length; i++) {
    const node = children[i]
    if (node.type === 'element' && node.tagName === 'img') {
      const props = node.properties ?? {}
      const src = String(props.src ?? '')
      if (src && !src.startsWith('data:')) {
        const title = props.title != null ? String(props.title) : ''
        const alt = props.alt != null ? String(props.alt) : ''
        const finalSrc = resolveContentImage(src, filePath) || src
        const titleAttr = title ? ` title="${escapeAttr(title)}"` : ''
        const firstImg = !state.firstImgDone
        state.firstImgDone = true
        const loadingAttrs = firstImg
          ? ' loading="eager" fetchpriority="high"'
          : ' loading="lazy" decoding="async"'
        const entry = info[finalSrc]
        const sized = Boolean(entry && entry.w > 0 && entry.h > 0)
        const sizeAttrs = sized ? ` width="${entry?.w}" height="${entry?.h}"` : ''
        const lightboxAttrs = sized
          ? ` data-pswp-width="${entry?.w}" data-pswp-height="${entry?.h}"`
          : ''
        const img = `<img src="${escapeAttr(finalSrc)}" alt="${escapeAttr(alt)}"${titleAttr}${sizeAttrs}${loadingAttrs} />`
        const gradient = entry ? lqipGradient(entry.c) : ''
        const styleAttr = gradient ? ` style="--img-lqip:${gradient}"` : ''
        const frameClass = sized ? 'img-frame is-sized' : 'img-frame'
        children[i] = {
          type: 'raw',
          value: `<span class="${frameClass}"${styleAttr}><a class="img-lightbox" href="${escapeAttr(finalSrc)}"${titleAttr}${lightboxAttrs}>${img}</a></span>`,
        }
        continue
      }
    }
    if ('children' in node && Array.isArray((node as { children?: unknown }).children)) {
      transform(node as unknown as { children: Nodes[] }, filePath, state, info)
    }
  }
}

export function rehypeImages() {
  return (tree: Root, file: VFileLike) => {
    const filePath = resolveFilePath(file)
    if (!filePath) return
    transform(tree, filePath, { firstImgDone: false }, loadImageInfo())
  }
}
