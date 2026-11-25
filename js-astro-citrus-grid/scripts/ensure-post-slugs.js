import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pinyin } from 'pinyin-pro'
import { resolveHrefTarget, toPostIndex } from '../src/lib/md/linkResolve.ts'

const THIS_FILE = fileURLToPath(import.meta.url)
const CONTENT_ROOT = path.join(path.dirname(THIS_FILE), '..', 'src', 'content')
const POSTS_DIR = path.join(CONTENT_ROOT, 'posts')
const GENERATED_DIR = path.join(path.dirname(THIS_FILE), '..', '.generated')
const INDEX_FILE = path.join(GENERATED_DIR, 'post-index.json')
const BACKLINKS_FILE = path.join(GENERATED_DIR, 'backlinks.json')
mkdirSync(GENERATED_DIR, { recursive: true })

export function titleToSlug(title) {
  const parts = pinyin(String(title), {
    toneType: 'none',
    type: 'array',
    nonZh: 'consecutive',
    v: true,
  })
  const slug = parts
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return slug || 'post'
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const MD_LINK_RE = /\[[^\]]*\]\(\s*([^)\s]+?)(?:\s+["'][^"']*["'])?\s*\)/g
const REF_LINK_RE = /^[ \t]{0,3}\[[^\]]+\]:[ \t]*(\S+)/gm
const RAW_HREF_RE = /\bhref=(["'])(.*?)\1/g

function collectMdFiles(dir) {
  const files = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...collectMdFiles(full))
    else if (entry.isFile() && /\.mdx?$/.test(entry.name)) files.push(full)
  }
  return files
}

function parseFrontmatter(raw) {
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
  // 先原样取出 slug 值，合规性单独判断：
  // 「没写 slug」与「写了但不合规」必须区分，后者不能静默改写
  const slugValue = fm.match(/^slug:\s*['"]?(.+?)['"]?\s*$/m)?.[1]
  return {
    title: fm.match(/^title:\s*['"]?(.+?)['"]?\s*$/m)?.[1] ?? '',
    slug: slugValue && /^[a-z0-9-]+$/.test(slugValue) ? slugValue : undefined,
    rawSlug: slugValue,
    draft: /^draft:\s*true\s*$/m.test(fm),
  }
}

function stripNonBody(raw) {
  const withoutFrontmatter = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
  const lines = withoutFrontmatter.split(/\r?\n/)
  const kept = []
  let fence = null
  for (const line of lines) {
    const open = line.match(/^[ \t]{0,3}(```|~~~)/)
    if (fence) {
      if (open && open[1] === fence) fence = null
      continue
    }
    if (open) {
      fence = open[1]
      continue
    }
    kept.push(line)
  }
  return kept.join('\n').replace(/`[^`\n]*`/g, '')
}

function collectHrefs(body) {
  const hrefs = new Set()
  for (const [re, group] of [
    [MD_LINK_RE, 1],
    [REF_LINK_RE, 1],
    [RAW_HREF_RE, 2],
  ]) {
    // 三个正则均带 /g，matchAll 不依赖也不改动 lastIndex
    for (const match of body.matchAll(re)) {
      const target = match[group]
      if (target) hrefs.add(target)
    }
  }
  return hrefs
}

function buildBacklinks(records, index) {
  const graph = new Map()
  for (const rec of records) {
    if (rec.draft && process.env.NODE_ENV === 'production') continue
    for (const href of collectHrefs(stripNonBody(rec.raw))) {
      const resolved = resolveHrefTarget(href, rec.full, index, () => {})
      const match = resolved && /^\/posts\/([^/]+)\//.exec(resolved)
      if (!match) continue
      const target = decodeURIComponent(match[1])
      if (!target || target === rec.slug) continue
      let sources = graph.get(target)
      if (!sources) {
        sources = new Set()
        graph.set(target, sources)
      }
      sources.add(rec.slug)
    }
  }

  const out = {}
  for (const target of [...graph.keys()].sort()) {
    out[target] = [...graph.get(target)].sort()
  }
  return out
}

export function ensurePostSlugs() {
  return {
    name: 'ensure-post-slugs',
    buildStart() {
      const records = []
      const used = new Set()
      for (const full of collectMdFiles(POSTS_DIR)) {
        const raw = readFileSync(full, 'utf-8')
        const fm = parseFrontmatter(raw)
        records.push({
          full,
          rel: path.relative(CONTENT_ROOT, full).split(path.sep).join('/'),
          raw,
          title: fm.title,
          slug: fm.slug,
          rawSlug: fm.rawSlug,
          draft: fm.draft,
        })
        if (fm.slug) used.add(fm.slug)
      }

      for (const rec of records) {
        if (rec.slug) continue
        if (rec.rawSlug) {
          // 用户已写 slug 但不合规（如 My-Post、hello_world）：
          // 保留原值供索引用，改写与否交给 content.config 的 schema 报错，
          // 静默替换会破坏用户自定义的链接地址
          console.warn(
            `[post-slug] ${rec.rel}: slug "${rec.rawSlug}" 不合规范，保留原值不做改写（schema 校验会报错）`,
          )
          rec.slug = rec.rawSlug
          continue
        }
        const base = titleToSlug(rec.title)
        let slug = base
        for (let n = 1; used.has(slug); n += 1) slug = `${base}-${n}`
        if (!SLUG_RE.test(slug)) slug = 'post'
        while (used.has(slug)) slug = `${slug}-${Date.now().toString(36).slice(-4)}`
        used.add(slug)
        rec.slug = slug

        const raw = rec.raw
        const eol = raw.includes('\r\n') ? '\r\n' : '\n'
        let updated
        if (/^slug:.*$/m.test(raw)) {
          updated = raw.replace(/^slug:.*$/m, `slug: ${slug}`)
        } else {
          updated = /^title:.*(?:\r?\n)/m.test(raw)
            ? raw.replace(/^title:.*(?:\r?\n)/m, (m) => `${m}slug: ${slug}${eol}`)
            : raw.replace(/^---\r?\n/, (m) => `${m}slug: ${slug}${eol}`)
        }
        writeFileSync(rec.full, updated, 'utf-8')
        console.log(`[post-slug] slug filled: ${path.relative(POSTS_DIR, rec.full)} -> ${slug}`)
      }

      const index = records
        .map(({ rel, slug, draft }) => ({ file: rel, slug, draft }))
        .sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0))
      const next = `${JSON.stringify(index, null, 2)}\n`
      if (!existsSync(INDEX_FILE) || readFileSync(INDEX_FILE, 'utf-8') !== next) {
        writeFileSync(INDEX_FILE, next, 'utf-8')
        console.log(`[post-slug] post-index written: ${index.length} entries`)
      }

      const backlinks = buildBacklinks(records, toPostIndex(index))
      const nextBacklinks = `${JSON.stringify(backlinks, null, 2)}\n`
      if (!existsSync(BACKLINKS_FILE) || readFileSync(BACKLINKS_FILE, 'utf-8') !== nextBacklinks) {
        writeFileSync(BACKLINKS_FILE, nextBacklinks, 'utf-8')
        console.log(`[post-slug] backlinks written: ${Object.keys(backlinks).length} entries`)
      }
    },
  }
}
