import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const POSTS_DIR = fileURLToPath(new URL('../src/content/posts', import.meta.url))

function collectMdFiles(dir) {
  const files = []
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name)
    if (name.isDirectory()) files.push(...collectMdFiles(full))
    else if (name.isFile() && /\.mdx?$/.test(name.name)) files.push(full)
  }
  return files
}

const ORDER = ['title', 'slug', 'index', 'description', 'category', 'tags', 'published']
const LAST = ['updated', 'draft']

let changed = 0
for (const full of collectMdFiles(POSTS_DIR)) {
  const file = path.relative(POSTS_DIR, full)
  const raw = readFileSync(full, 'utf-8')
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) continue

  const eol = raw.includes('\r\n') ? '\r\n' : '\n'
  const entries = new Map()
  const keys = []
  let current = null
  for (const line of m[1].split(/\r?\n/)) {
    const km = line.match(/^([A-Za-z_][\w-]*):/)
    if (km) {
      current = km[1]
      if (!entries.has(current)) {
        entries.set(current, [])
        keys.push(current)
      }
      entries.get(current).push(line)
    } else if (current) {
      entries.get(current).push(line)
    }
  }

  const sorted = [
    ...ORDER.filter((k) => entries.has(k)),
    ...keys.filter((k) => !ORDER.includes(k) && !LAST.includes(k)),
    ...LAST.filter((k) => entries.has(k)),
  ]
  if (sorted.join('\u0000') === keys.join('\u0000')) continue

  const rest = raw.slice(m[0].length)
  writeFileSync(
    full,
    `---${eol}${sorted.flatMap((k) => entries.get(k)).join(eol)}${eol}---${rest}`,
    'utf-8',
  )
  // 已格式化：
  console.log(`formatted: ${file}`)
  changed += 1
}

// 所有文章元数据均已是规范顺序 / 共格式化 N 篇文章
console.log(
  changed === 0 ? 'all post meta already in canonical order' : `formatted ${changed} posts`,
)
