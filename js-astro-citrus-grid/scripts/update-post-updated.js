import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// 按文件保存时间（mtime）同步文章 frontmatter 的 updated 字段。
// 通过 buildStart 触发：构建时和每次 dev 启动时都会同步一次；
// dev 运行中修改文章不触发同步，避免保存过程中的中间态污染 updated。

const POSTS_DIR = fileURLToPath(new URL('../src/content/posts', import.meta.url))
const STATE_FILE = fileURLToPath(new URL('../.generated/post-updated.json', import.meta.url))

// state: { "<posts 相对路径>": { mtime: <写入后文件 mtime 毫秒值>, stamp: <写入的 updated 值> } }
// 写入 updated 本身会刷新文件 mtime，所以用「mtime 是否与上次写入时一致」来判断
// 文件在同步之后有没有被再次保存，避免脚本自己的写入在每次启动时反复触发重写；
// 不能写完再把 mtime 改回去：Git for Windows 的索引按秒比对 mtime，恢复后
// 字节数相同的时间戳变更会被 git 误判为未修改，导致改动提交不上去。
let state = {}
let stateLoaded = false

function loadState() {
  if (stateLoaded) return
  stateLoaded = true
  try {
    state = JSON.parse(readFileSync(STATE_FILE, 'utf-8'))
  } catch {
    state = {}
  }
}

function saveState() {
  mkdirSync(path.dirname(STATE_FILE), { recursive: true })
  writeFileSync(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`, 'utf-8')
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

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatStamp(date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`
}

function syncPostUpdated(full, rel, log = false) {
  loadState()
  const stat = statSync(full)
  const mtime = Math.round(stat.mtimeMs)
  const cached = state[rel]
  // 同步之后文件没有被再次保存（mtime 一致），无需处理
  if (cached && cached.mtime === mtime) return false

  const raw = readFileSync(full, 'utf-8')
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fm) {
    state[rel] = { mtime, stamp: '' }
    return false
  }
  const stamp = formatStamp(stat.mtime)
  const current = fm[1].match(/^updated:\s*(['"]?)(.*)\1\s*$/m)?.[2]
  if (current !== undefined && current.trim() === stamp) {
    state[rel] = { mtime, stamp }
    return false
  }

  const eol = raw.includes('\r\n') ? '\r\n' : '\n'
  let body
  if (/^updated:.*$/m.test(fm[1])) {
    body = fm[1].replace(/^updated:.*$/m, `updated: ${stamp}`)
  } else {
    // 缺失时追加到元数据末尾；有 draft 字段时插到 draft 之前，
    // 与 format-post-meta 的规范字段顺序（...published、updated、draft）保持一致
    const lines = fm[1].split(/\r?\n/)
    let at = lines.length
    for (let i = lines.length - 1; i >= 0; i -= 1) {
      if (/^draft:/.test(lines[i])) {
        at = i
        break
      }
    }
    lines.splice(at, 0, `updated: ${stamp}`)
    body = lines.join(eol)
  }
  // 用函数式替换：body 中的 $&、$1 等序列在字符串替换里会被特殊展开而写坏文件
  writeFileSync(
    full,
    raw.replace(fm[0], () => `---${eol}${body}${eol}---`),
    'utf-8',
  )
  state[rel] = { mtime: Math.round(statSync(full).mtimeMs), stamp }
  if (log) console.log(`[post-updated] ${rel} -> ${stamp}`)
  return true
}

export function updatePostUpdated({ enabled = true } = {}) {
  if (!enabled) return null
  return {
    name: 'update-post-updated',
    buildStart() {
      loadState()
      const rels = collectMdFiles(POSTS_DIR).map((full) => ({
        full,
        rel: path.relative(POSTS_DIR, full).split(path.sep).join('/'),
      }))
      // 清理已删除文章残留的状态
      for (const rel of Object.keys(state)) {
        if (!rels.some((r) => r.rel === rel)) delete state[rel]
      }
      let count = 0
      for (const { full, rel } of rels) {
        if (syncPostUpdated(full, rel, true)) count += 1
      }
      if (count > 0) console.log(`[post-updated] synced ${count} posts`)
      saveState()
    },
  }
}
