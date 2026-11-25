// Astro 内容层（glob loader）只按 markdown 文件内容计算 digest，见
// astro/dist/content/loaders/glob.js: `generateDigest(contents)`。
// 因此修改 rehype/remark 插件、astro.config.mjs 里的插件顺序等「构建期渲染代码」时，
// 已经渲染过的文章不会重新编译，页面会一直停留在旧 HTML
// （典型症状：改了表格/代码块插件，只有恰好同期被编辑过的文章生效）。
//
// 本脚本在每次 dev / build 启动前比对渲染管线指纹，变化则清掉 Astro 内容缓存，
// 强制重新渲染全部文章；未变化则保留缓存，不影响增量构建速度。
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MD_DIR = path.join(ROOT, 'src', 'lib', 'md')

// 参与「markdown 源文件 → HTML」编译的文件。改动其中任何一个都必须让缓存失效。
const SOURCES = [
  'astro.config.mjs',
  'src/content.config.ts',
  'src/styles/markdown.css',
  'src/lib/icons.ts',
  'src/i18n/zh.json',
  'src/i18n/en.json',
  'src/i18n/ja.json',
  ...readdirSync(MD_DIR)
    .filter((name) => name.endsWith('.ts'))
    .sort()
    .map((name) => path.posix.join('src/lib/md', name)),
]

// 与 scripts/clean-cache.js 一致：两处内容层 data-store + jiti 配置缓存
const CACHE_TARGETS = [
  '.astro',
  path.join('node_modules', '.astro'),
  path.join('node_modules', '.cache', 'jiti'),
]

// 指纹放在不会被上面清理掉的位置，否则每次都会判定为「变化」
const STAMP = path.join(ROOT, 'node_modules', '.cache', 'citrus-grid', 'md-pipeline.hash')

function computeDigest() {
  const hash = createHash('sha256')
  for (const rel of SOURCES) {
    const abs = path.join(ROOT, rel)
    hash.update(rel)
    hash.update(existsSync(abs) ? readFileSync(abs) : Buffer.from('<missing>'))
  }
  return hash.digest('hex')
}

const digest = computeDigest()
if (existsSync(STAMP) && readFileSync(STAMP, 'utf8').trim() === digest) {
  console.log('[md-cache] 渲染管线未变化，保留内容缓存')
  process.exit(0)
}

let removed = 0
for (const rel of CACHE_TARGETS) {
  const abs = path.join(ROOT, rel)
  if (!existsSync(abs)) continue
  rmSync(abs, { recursive: true, force: true })
  removed++
  console.log(`[md-cache] removed ${rel}`)
}

mkdirSync(path.dirname(STAMP), { recursive: true })
writeFileSync(STAMP, digest)
console.log(
  removed
    ? '[md-cache] 渲染管线已变化 → 内容缓存已清理，本次将重新渲染全部文章'
    : '[md-cache] 已记录渲染管线指纹',
)
