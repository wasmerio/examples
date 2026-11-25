import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const THIS_FILE = fileURLToPath(import.meta.url)
const requireFromHere = createRequire(THIS_FILE)
const POSTS_DIR = path.join(path.dirname(THIS_FILE), '..', 'src', 'content', 'posts')
const CONTENT_ROOT = path.join(path.dirname(THIS_FILE), '..', 'src', 'content')
const OUT_FILE = path.join(path.dirname(THIS_FILE), '..', '.generated', 'lqips.json')
mkdirSync(path.dirname(OUT_FILE), { recursive: true })

const IMG_SRC_RE = /!\[[^\]]*\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g

function stripFencedCode(raw) {
  const out = []
  let fenceChar = ''
  let fenceLen = 0
  for (const line of raw.split('\n')) {
    if (fenceChar) {
      const close = line.match(/^ {0,3}(`{3,}|~{3,})\s*$/)
      if (close && close[1][0] === fenceChar && close[1].length >= fenceLen) fenceChar = ''
      continue
    }
    const open = line.match(/^ {0,3}(`{3,}|~{3,})/)
    if (open) {
      fenceChar = open[1][0]
      fenceLen = open[1].length
      continue
    }
    out.push(line)
  }
  return out.join('\n')
}

function stripInlineCode(raw) {
  return raw.replace(/`[^`\n]*`/g, ' ')
}

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

function contentImageKey(absPath) {
  const rel = path.relative(CONTENT_ROOT, absPath).split(path.sep).join('/')
  const ext = path.posix.extname(rel).toLowerCase()
  if (!IMAGE_EXT.has(ext)) return null
  const hash = createHash('sha1').update(rel).digest('hex').slice(0, 16)
  return `/content-images/${hash}${ext}`
}

function collectMdFiles(dir) {
  const files = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...collectMdFiles(full))
    else if (entry.isFile() && /\.mdx?$/.test(entry.name)) files.push(full)
  }
  return files
}

async function readImageInfo(sharp, input) {
  const image = sharp(input)
  const meta = await image.metadata()
  const raw = await image.resize(2, 2, { fit: 'fill' }).removeAlpha().raw().toBuffer()

  return {
    c: raw.toString('hex', 0, 3) + raw.toString('hex', 3, 6) + raw.toString('hex', 9, 12),
    w: Number(meta.width) || 0,
    h: Number(meta.height) || 0,
  }
}

function isCurrentEntry(value) {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    typeof value.c === 'string' &&
    value.c.length === 18 &&
    Number.isFinite(value.w) &&
    Number.isFinite(value.h)
  )
}

async function fetchBuffer(url, timeoutMs = 8000) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return Buffer.from(await res.arrayBuffer())
  } finally {
    clearTimeout(timer)
  }
}

async function main() {
  const force = process.env.LQIP_FORCE === '1'
  let existing = {}
  if (!force) {
    try {
      existing = JSON.parse(readFileSync(OUT_FILE, 'utf-8'))
    } catch {
      existing = {}
    }
  }

  const targets = new Map()
  for (const mdFile of collectMdFiles(POSTS_DIR)) {
    const raw = stripInlineCode(stripFencedCode(readFileSync(mdFile, 'utf-8')))
    for (const match of raw.matchAll(IMG_SRC_RE)) {
      const src = match[1]
      if (!src || src.startsWith('data:')) continue
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|\/|#)/i.test(src)) {
        if (/^https?:\/\//i.test(src) && !targets.has(src))
          targets.set(src, { kind: 'url', source: src })
        continue
      }
      // 非法百分号编码（如文件名含裸 %）时按原文处理，与 contentImages.safeDecode 一致，
      // 不能让单个坏文件名使整批 LQIP 失效
      let decoded = src
      try {
        decoded = decodeURIComponent(src)
      } catch {}
      const localPath = path.resolve(path.dirname(mdFile), decoded)
      const key = contentImageKey(localPath)
      if (key && existsSync(localPath) && !targets.has(key))
        targets.set(key, { kind: 'file', source: localPath })
    }
  }

  const pending = [...targets.entries()].filter(([key]) => !isCurrentEntry(existing[key]))
  if (pending.length > 0) {
    const sharp = requireFromHere('sharp')
    const failed = []
    for (const [key, target] of pending) {
      try {
        const input = target.kind === 'file' ? target.source : await fetchBuffer(target.source)
        existing[key] = await readImageInfo(sharp, input)
      } catch (err) {
        failed.push(`${key} (${err?.message ?? err})`)
      }
    }
    const sorted = Object.fromEntries(
      Object.entries(existing)
        .filter(([key]) => targets.has(key))
        .sort(([a], [b]) => (a < b ? -1 : 1)),
    )
    writeFileSync(OUT_FILE, `${JSON.stringify(sorted, null, 2)}\n`, 'utf-8')
    // 本次处理 N 张（成功 N），共 N 条
    console.log(
      `[lqip] processed ${pending.length} (ok ${pending.length - failed.length}), total ${Object.keys(sorted).length} entries`,
    )
    // 取色失败已跳过（运行时降级灰渐变）
    if (failed.length)
      console.warn(
        `[lqip] sampling failed, skipped (runtime falls back to gray gradient):\n  ${failed.join('\n  ')}`,
      )
  } else {
    const sorted = Object.fromEntries(
      Object.entries(existing)
        .filter(([key]) => targets.has(key))
        .sort(([a], [b]) => (a < b ? -1 : 1)),
    )
    if (Object.keys(sorted).length !== Object.keys(existing).length) {
      writeFileSync(OUT_FILE, `${JSON.stringify(sorted, null, 2)}\n`, 'utf-8')
    }
    // 增量命中，共 N 条，无新增
    console.log(`[lqip] incremental hit, total ${Object.keys(sorted).length} entries, nothing new`)
  }
}

let generatedInProcess = false

export function generateLqips() {
  return {
    name: 'generate-lqips',
    async buildStart() {
      if (generatedInProcess) return
      generatedInProcess = true
      try {
        await main()
      } catch (err) {
        // 生成失败，本次构建使用无 LQIP 降级骨架
        console.warn('[lqip] generation failed, building without LQIP fallback skeleton:', err)
      }
    },
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === THIS_FILE) {
  main().catch((err) => {
    // 生成失败:
    console.error('[lqip] generation failed:', err)
    process.exitCode = 1
  })
}
