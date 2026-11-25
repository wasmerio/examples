import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import process from 'node:process'

// 主题升级脚本：遍历上游（官方仓库指定分支）的文件树，逐个文件覆盖进当前站点。
//
// 与旧版基于 git merge-base 的三向合并不同，本脚本不要求本地与上游共享 git 历史，
// 适合「独立仓库 + 手动拷文件同步」的二开站点。规则：
// - IGNORE 数组列出的是用户自己的内容，一律保留本地版本，不被上游覆盖、也不删除；
// - 其余上游文件：内容不同则覆盖，本地不存在则新增；
// - 本地有、上游没有的文件（如用户新增的文章）一律保留，脚本不会删除任何文件。
//
// 用法：
//   pnpm theme:update            # 预演（默认）：只输出报告，不动工作区
//   pnpm theme:update --apply    # 实际执行覆盖
//   pnpm theme:update --remote <name|url> --branch <name>

const DEFAULT_UPSTREAM = 'https://github.com/rightdoor/citrus-grid.git'
const DEFAULT_BRANCH = 'main'
const UPSTREAM_REF = 'refs/theme-update/upstream' // 固定本地跟踪 ref，fetch 结果落这里
const LIST_CAP = 40

// ── 用户私有内容：更新时保留本地版本，不被上游覆盖 ──
// 填写相对仓库根目录的路径或 glob（** 匹配任意层级，* 匹配单层，? 匹配单字符）。
// 与 UPGRADING.md「定制白名单」一致，另加 src/pages/**（用户自建页面 / 路由）。
// 注意：根目录 docs/ 不在清单内，属于主题文档，随主题一起覆盖。
const IGNORE = [
  'docs/**',
  'public/**',
  'README.md',
  'src/comments/**',
  'src/content/**',
  'src/stats/**',
  'src/components/views/AboutPage.astro',
  'src/site.config.ts',
]

const args = process.argv.slice(2)
const apply = args.includes('--apply')
const help = args.includes('--help') || args.includes('-h')
const remoteIdx = args.indexOf('--remote')
const branchIdx = args.indexOf('--branch')
const remote = remoteIdx !== -1 ? args[remoteIdx + 1] : DEFAULT_UPSTREAM
const branch = branchIdx !== -1 ? args[branchIdx + 1] : DEFAULT_BRANCH
const upstreamLabel = `${remote}@${branch}`

const PREFIX = '[theme:update]'

function fail(message, code = 1) {
  console.error(`${PREFIX} ${message}`)
  process.exit(code)
}

function git(repoArgs, options = {}) {
  // core.quotepath=off：非 ASCII 文件名按原样输出（ls-tree 另用 -z，不受 quoting 影响）
  return execFileSync('git', ['-c', 'core.quotepath=off', ...repoArgs], {
    maxBuffer: 256 * 1024 * 1024,
    ...options,
  })
}

function gitText(repoArgs, options = {}) {
  return git(repoArgs, { encoding: 'utf8', ...options })
}

function gitOk(repoArgs) {
  try {
    git(repoArgs)
    return true
  } catch {
    return false
  }
}

function globToRegExp(glob) {
  const escaped = glob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '\0')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '[^/]')
    .replace(/\0/g, '.*')
  return new RegExp(`^${escaped}$`)
}

const IGNORE_RE = IGNORE.map(globToRegExp)

function isIgnored(path) {
  const normalized = path.replaceAll('\\', '/')
  return IGNORE_RE.some((re) => re.test(normalized))
}

function listSection(title, items, emptyText = '无') {
  console.log(`\n── ${title} (${items.length})`)
  if (items.length === 0) {
    console.log(`  ${emptyText}`)
    return
  }
  for (const item of items.slice(0, LIST_CAP)) console.log(`  ${item}`)
  if (items.length > LIST_CAP) console.log(`  ... 以及另外 ${items.length - LIST_CAP} 个文件`)
}

function versionAt(rev) {
  try {
    const raw = rev ? gitText(['show', `${rev}:package.json`]) : readFileSync('package.json', 'utf8')
    return JSON.parse(raw).version ?? '?'
  } catch {
    return '?'
  }
}

if (help) {
  console.log(`用法：pnpm theme:update [--apply] [--remote <name|url>] [--branch <name>]

  遍历覆盖式更新：用上游主题文件覆盖本地，IGNORE 中的用户内容保留。
  默认预演：只输出报告，不改工作区。
  --apply    实际执行覆盖
  --remote   上游来源（remote 名或仓库 URL），默认 ${DEFAULT_UPSTREAM}
  --branch   上游分支名，默认 ${DEFAULT_BRANCH}

忽略清单（保留本地、不覆盖、不删除）：
${IGNORE.map((i) => `  ${i}`).join('\n')}`)
  process.exit(0)
}

// ── 前置检查 ────────────────────────────────────────────────
try {
  git(['rev-parse', '--is-inside-work-tree'])
} catch {
  fail('not inside a git repository')
}

const dirty = gitText(['status', '--porcelain'])
  .split('\n')
  .filter((l) => l.trim() && !l.startsWith('??'))
if (dirty.length > 0) {
  console.error(`${PREFIX} working tree has uncommitted changes; commit or stash them first:`)
  for (const line of dirty.slice(0, 20)) console.error(`  ${line}`)
  fail('refusing to run on a dirty tree')
}

// ── 拉取上游到固定 ref ──────────────────────────────────────
console.log(`${PREFIX} fetching ${remote} ${branch} ...`)
try {
  git(['fetch', remote, `+${branch}:${UPSTREAM_REF}`])
} catch {
  fail(`git fetch ${upstreamLabel} failed — check your network or the remote/URL`)
}
if (!gitOk(['rev-parse', '-q', '--verify', `${UPSTREAM_REF}^{commit}`])) {
  fail(`upstream ref ${upstreamLabel} not found`)
}

console.log(`${PREFIX} theme version: local v${versionAt(null)} / upstream v${versionAt(UPSTREAM_REF)}`)

// ── 遍历上游文件树 ──────────────────────────────────────────
// -z 以 NUL 分隔，中文 / 空格路径都不受 quoting 影响
const upstreamFiles = gitText(['ls-tree', '-r', '--name-only', '-z', UPSTREAM_REF])
  .split('\0')
  .filter(Boolean)

const willOverwrite = [] // 上游有、非忽略、本地内容不同 -> 覆盖
const willAdd = [] // 上游有、非忽略、本地不存在 -> 新增
const unchanged = [] // 上游有、非忽略、内容与本地一致
const preserved = [] // 命中 IGNORE -> 保留本地

for (const path of upstreamFiles) {
  if (isIgnored(path)) {
    preserved.push(path)
    continue
  }
  let upstreamBuf
  try {
    upstreamBuf = git(['show', `${UPSTREAM_REF}:${path}`])
  } catch {
    continue // gitlink 等无法读取的条目跳过
  }
  if (!existsSync(path)) {
    willAdd.push(path)
    continue
  }
  let localBuf = null
  try {
    localBuf = readFileSync(path)
  } catch {
    // 读取失败视为需覆盖
  }
  if (localBuf && localBuf.equals(upstreamBuf)) unchanged.push(path)
  else willOverwrite.push(path)
}

// ── 报告 ────────────────────────────────────────────────────
console.log(`\n${PREFIX} upstream: ${upstreamLabel}`)
listSection('覆盖本地（内容不同）', willOverwrite, '无')
listSection('新增文件（本地不存在）', willAdd, '无')
listSection('保留本地（命中 IGNORE）', preserved, '无')
listSection('无需改动（内容一致）', unchanged, '无')
console.log(
  `\n${PREFIX} 汇总：覆盖 ${willOverwrite.length} / 新增 ${willAdd.length} / 保留 ${preserved.length} / 一致 ${unchanged.length}（上游共 ${upstreamFiles.length} 个文件）`,
)
console.log(`${PREFIX} 说明：本地有而上游没有的文件不会被删除；IGNORE 中的文件不覆盖、不删除。`)

if (!apply) {
  console.log(`\n${PREFIX} 预演结束，未改动任何文件。确认无误后执行：pnpm theme:update --apply`)
  process.exit(0)
}

// ── 执行覆盖 ────────────────────────────────────────────────
for (const path of [...willOverwrite, ...willAdd]) {
  const buf = git(['show', `${UPSTREAM_REF}:${path}`])
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, buf)
}

console.log(
  `\n${PREFIX} 更新完成：覆盖 ${willOverwrite.length} 个、新增 ${willAdd.length} 个、保留 ${preserved.length} 个（共写入 ${willOverwrite.length + willAdd.length} 个文件）`,
)
if (willAdd.length > 0 || willOverwrite.includes('package.json')) {
  console.log(`${PREFIX} 建议下一步：pnpm install && pnpm verify && pnpm build`)
}
