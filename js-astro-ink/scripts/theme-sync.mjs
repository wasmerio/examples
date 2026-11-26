import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

// Deliberately exclude articles, personal assets, public files and custom pages.
const directories = [
  'src/components/',
  'src/layouts/',
  'src/assets/styles/',
  'src/plugins/',
  'src/utils/',
  'src/scripts/',
  'src/pages/blog/',
  'src/pages/tags/',
  'src/pages/search/',
  'src/pages/archives/',
  'public/scripts/',
  'tests/'
]
const files = new Set([
  'astro.config.ts',
  '.nvmrc',
  'uno.config.ts',
  'tsconfig.json',
  'package.json',
  'pnpm-lock.yaml',
  'src/content.config.ts',
  'src/site-config.ts',
  'src/pages/index.astro',
  'src/pages/[...alias].astro',
  'src/pages/about/index.astro',
  'src/pages/links/index.astro',
  'src/pages/404.astro',
  'src/pages/rss.xml.ts',
  'src/pages/robots.txt.ts',
  'src/pages/search-index.json.ts',
  'scripts/theme-sync.mjs',
  'scripts/theme-sync-panel.mjs',
  'scripts/check-links.mjs',
  'scripts/optimize-avatar.mjs',
  'docs/theme-sync.md',
  'docs/blog-guide.md',
  'docs/blog-guide.zh-CN.md'
])
const manual = new Set([
  'src/site-config.ts',
  'src/pages/about/index.astro',
  'astro.config.ts',
  'src/content.config.ts',
  'package.json',
  'pnpm-lock.yaml'
])
const stateName = '.theme-sync.json'
const normalize = (text) => text.replace(/\r\n/g, '\n')
const hash = (text) => createHash('sha256').update(text).digest('hex')

// Some editors can leave literal line breaks inside a JSON string. Node
// correctly rejects that JSON, but the state is recoverable without losing
// the last source snapshot. Only control characters inside quoted strings are
// escaped; document whitespace and all other bytes stay untouched.
function escapeRawControlsInJsonStrings(text) {
  let escaped = false
  let inside = false
  let result = ''
  for (const char of text) {
    if (!inside) {
      result += char
      if (char === '"') inside = true
      continue
    }
    if (escaped) {
      result += char
      escaped = false
      continue
    }
    if (char === '\\') {
      result += char
      escaped = true
      continue
    }
    if (char === '"') {
      result += char
      inside = false
      continue
    }
    if (char === '\n') {
      result += '\\n'
      continue
    }
    if (char === '\r') {
      result += '\\r'
      continue
    }
    if (char === '\t') {
      result += '\\t'
      continue
    }
    if (char.charCodeAt(0) < 32) {
      result += `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`
      continue
    }
    result += char
  }
  return result
}

function readState(bytes) {
  if (!bytes) return { value: null, repaired: false }
  const raw = bytes.toString('utf8')
  try {
    return { value: JSON.parse(raw), repaired: false }
  } catch (originalError) {
    try {
      const value = JSON.parse(escapeRawControlsInJsonStrings(raw))
      console.warn(
        'Recovered invalid control characters in .theme-sync.json. Applying this run will rewrite a valid baseline.'
      )
      return { value, repaired: true }
    } catch {
      throw originalError
    }
  }
}

function allowed(name) {
  return (
    !name.includes('\\') &&
    !name.includes(':') &&
    !name.split('/').some((p) => p === '..' || p === '.' || !p) &&
    (files.has(name) || directories.some((dir) => name.startsWith(dir)))
  )
}

function git(cwd, args) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
  if (result.error || result.status !== 0)
    throw new Error(result.error?.message || result.stderr.trim())
  return result.stdout
}

// Reject links/junctions, including ancestors, so a sync cannot escape either repository.
function safePath(root, name) {
  if (name !== stateName && !allowed(name)) throw new Error(`Path outside sync scope: ${name}`)
  let current = root
  for (const part of name.split('/')) {
    current = path.join(current, part)
    try {
      if (fs.lstatSync(current).isSymbolicLink())
        throw new Error(`Symlink/junction is not supported: ${current}`)
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
  }
  return current
}

function read(root, name) {
  const filename = safePath(root, name)
  try {
    return fs.readFileSync(filename)
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

function textOf(bytes, name) {
  if (bytes === null) return null
  const text = bytes.toString('utf8')
  if (text.includes('\0') || !Buffer.from(text).equals(bytes))
    throw new Error(`Only UTF-8 text is supported: ${name}`)
  return normalize(text)
}

function snapshot(root) {
  const names = [
    ...new Set(
      git(root, ['ls-files', '-z', '--cached', '--others', '--exclude-standard']).split('\0')
    )
  ]
    .filter(allowed)
    .sort()
  return Object.fromEntries(
    names.flatMap((name) => {
      const text = textOf(read(root, name), name)
      return text === null ? [] : [[name, text]]
    })
  )
}

function merge(ours, base, theirs) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ink-merge-'))
  try {
    const names = ['ours', 'base', 'theirs'].map((name) => path.join(temp, name))
    names.forEach((name, i) => fs.writeFileSync(name, [ours, base, theirs][i]))
    const result = spawnSync('git', ['merge-file', '-p', ...names], {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024
    })
    if (result.error) throw result.error
    if (result.status === 0) return result.stdout
    if (result.status > 0 && result.status <= 127) return null
    throw new Error(result.stderr || 'git merge-file failed')
  } finally {
    // Only files created above; no recursive deletion or computed directory traversal.
    for (const name of ['ours', 'base', 'theirs']) fs.rmSync(path.join(temp, name), { force: true })
    fs.rmdirSync(temp)
  }
}

// git diff --no-index uses the same line diff readers see in their checkout and
// also works for first syncs where the two Git repositories share no history.
function lineDiff(before, after) {
  if (before === after) return '内容相同。'
  const change = before === null ? '新增文件\n' : after === null ? '删除文件\n' : ''
  if ((before ?? '') === (after ?? '')) return change + '空文件'
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ink-diff-'))
  const original = path.join(temp, 'before')
  const updated = path.join(temp, 'after')
  try {
    fs.writeFileSync(original, before ?? '')
    fs.writeFileSync(updated, after ?? '')
    const result = spawnSync(
      'git',
      [
        '-c',
        'core.autocrlf=false',
        'diff',
        '--no-index',
        '--text',
        '--no-color',
        '--no-ext-diff',
        '--no-textconv',
        '--unified=3',
        '--',
        'before',
        'after'
      ],
      { cwd: temp, encoding: 'utf8', maxBuffer: 512 * 1024, timeout: 10000, windowsHide: true }
    )
    if (result.error?.code === 'ETIMEDOUT') return '差异计算超时，请在本地编辑器中查看此文件。'
    const overflow = result.error?.code === 'ENOBUFS'
    if (!overflow && (result.error || result.status !== 1))
      throw new Error(result.error?.message || result.stderr.trim() || 'Unable to compute diff.')
    const patch = result.stdout.slice(result.stdout.indexOf('\n@@') + 1)
    const excerpt = patch
      .slice(0, 32 * 1024)
      .split('\n')
      .slice(0, 300)
      .join('\n')
    return (
      change +
      excerpt +
      (overflow || excerpt.length < patch.length ? '\n… 差异较长，余下内容已省略。' : '')
    )
  } finally {
    fs.rmSync(original, { force: true })
    fs.rmSync(updated, { force: true })
    fs.rmdirSync(temp)
  }
}

function options(args) {
  const opts = {
    source: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'),
    target: null,
    apply: false,
    init: false,
    allowDirty: false,
    local: new Set(),
    theme: new Set()
  }
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--') continue
    if (arg === '--apply') opts.apply = true
    else if (arg === '--init') opts.init = true
    else if (arg === '--allow-dirty') opts.allowDirty = true
    else if (['--target', '--source', '--accept-local', '--accept-theme', '--diff'].includes(arg)) {
      const value = args[++i]
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`)
      if (arg === '--target') opts.target = path.resolve(value)
      if (arg === '--source') opts.source = path.resolve(value)
      if (arg === '--accept-local') opts.local.add(value)
      if (arg === '--accept-theme') opts.theme.add(value)
      if (arg === '--diff') opts.diff = value
    } else throw new Error(`Unknown argument: ${arg}`)
  }
  if (!opts.target)
    throw new Error(
      'Specify --target <blog-directory>. Without --apply, this is a read-only preview.'
    )
  if (opts.diff && (opts.apply || opts.local.size || opts.theme.size || !allowed(opts.diff)))
    throw new Error('--diff requires a managed file and runs only in read-only mode.')
  for (const name of [...opts.local, ...opts.theme]) {
    if (!allowed(name)) throw new Error(`Path outside sync scope: ${name}`)
    if (opts.local.has(name) && opts.theme.has(name))
      throw new Error(`Conflicting choices: ${name}`)
  }
  return opts
}

function main() {
  if (process.argv.includes('--help')) {
    console.log(
      'Theme sync: node scripts/theme-sync.mjs --target ../Blog [--apply]\n' +
        'First sync: add --init; review existing differences with --accept-theme <file> or --accept-local <file>.\n' +
        'Conflicts: merge the file yourself, then use --accept-local <file> to record that resolution.\n' +
        'Diff: --diff <managed-file> prints line differences as JSON.\n' +
        'Options: --source <theme-directory>, --allow-dirty (explicitly permit uncommitted blog changes).\n' +
        'See docs/theme-sync.md. Preview is the default; no commits, install, build or deployment is automatic.'
    )
    return
  }
  const opts = options(process.argv.slice(2))
  const source = fs.realpathSync.native(opts.source)
  const target = fs.realpathSync.native(opts.target)
  const overlaps = (a, b) => {
    const rel = path.relative(a, b)
    return !rel || (!rel.startsWith('..') && !path.isAbsolute(rel))
  }
  if (overlaps(source, target) || overlaps(target, source))
    throw new Error('Source and target must be separate, non-nested repositories.')
  for (const root of [source, target]) {
    if (fs.realpathSync.native(git(root, ['rev-parse', '--show-toplevel']).trim()) !== root)
      throw new Error(`Not a repository root: ${root}`)
  }
  const stateBytes = read(target, stateName)
  const stateInfo = readState(stateBytes)
  const state = stateInfo.value
  if (
    state &&
    (state.schema !== 1 ||
      state.theme !== 'astro-theme-ink' ||
      !state.files ||
      typeof state.files !== 'object')
  )
    throw new Error('Invalid sync state.')
  if (!state && !opts.init)
    throw new Error(
      'No baseline. Run --init to preview the first sync; review every existing difference.'
    )
  if (state && opts.init)
    throw new Error(
      'Baseline already exists. Omit --init; it must not be reset during normal updates.'
    )
  const latest = snapshot(source)
  if (
    !latest['package.json'] ||
    JSON.parse(latest['package.json']).name !== 'astro-theme-ink' ||
    !latest['src/components/PostCard.astro']
  )
    throw new Error('Source is not an astro-theme-ink checkout.')
  const previous = state?.files ?? {}
  if (state && state.snapshotHash !== hash(JSON.stringify(previous))) {
    throw new Error('Baseline checksum mismatch. Restore .theme-sync.json from version control.')
  }
  const names = [...new Set([...Object.keys(previous), ...Object.keys(latest)])].sort()
  if (opts.diff) {
    const name = opts.diff
    if (!names.includes(name)) throw new Error(`Not a managed file: ${name}`)
    const base = previous[name] ?? null
    if (base !== null && typeof base !== 'string')
      throw new Error(`Invalid baseline entry: ${name}`)
    const theirs = latest[name] ?? null
    const ours = textOf(read(target, name), name)
    const sections = state
      ? [
          { title: '上次主题 → 当前主题', text: lineDiff(base, theirs) },
          { title: '上次主题 → 当前博客', text: lineDiff(base, ours) }
        ]
      : [{ title: '首次同步 · 当前主题 → 当前博客', text: lineDiff(theirs, ours) }]
    console.log(JSON.stringify(sections))
    return
  }
  for (const name of [...opts.local, ...opts.theme]) {
    if (!names.includes(name)) throw new Error(`Choice does not match a managed file: ${name}`)
  }
  const changes = []
  const conflicts = []
  for (const name of names) {
    if (!allowed(name) || (previous[name] !== undefined && typeof previous[name] !== 'string'))
      throw new Error(`Invalid baseline entry: ${name}`)
    const base = previous[name] ?? null
    const theirs = latest[name] ?? null
    const before = read(target, name)
    const ours = textOf(before, name)
    if (state && base === theirs) continue
    let next = ours
    let action = 'baseline'
    if (opts.local.has(name)) action = 'keep local (reviewed)'
    else if (opts.theme.has(name)) {
      next = theirs
      action = 'use theme (reviewed)'
    } else if (ours === theirs) action = 'already aligned'
    else if (manual.has(name) || (!state && ours !== null)) {
      conflicts.push(name)
      console.log(`REVIEW ${name}`)
      continue
    } else if (ours === base) {
      next = theirs
      action = theirs === null ? 'delete' : ours === null ? 'add' : 'update'
    } else if (base !== null && ours !== null && theirs !== null) {
      next = merge(ours, base, theirs)
      if (next === null) {
        conflicts.push(name)
        console.log(`CONFLICT ${name}`)
        continue
      }
      action = 'merge'
    } else {
      conflicts.push(name)
      console.log(`CONFLICT ${name}`)
      continue
    }
    console.log(`${action.toUpperCase()} ${name}`)
    if (next !== ours) changes.push({ name, before, next })
  }
  if (conflicts.length) {
    console.log(
      `\n${conflicts.length} file(s) need review. Nothing written. Use --accept-local after manual merging, or --accept-theme to take the whole theme file.`
    )
    process.exitCode = 2
    return
  }
  const sourceDirty = !!git(source, ['status', '--porcelain']).trim()
  const revision = `${git(source, ['rev-parse', 'HEAD']).trim()}${sourceDirty ? '+dirty' : ''}`
  const nextState =
    JSON.stringify(
      {
        schema: 1,
        theme: 'astro-theme-ink',
        sourceRevision: revision,
        sourceDirty,
        snapshotHash: hash(JSON.stringify(latest)),
        files: latest
      },
      null,
      2
    ) + '\n'
  const baselineChanged =
    stateInfo.repaired || !state || state.snapshotHash !== hash(JSON.stringify(latest))
  console.log(
    `\n${changes.length} blog file(s) to change; baseline ${baselineChanged ? 'will advance' : 'unchanged'}.`
  )
  if (!opts.apply) {
    console.log('Preview only. Add --apply to write.')
    return
  }
  if (!baselineChanged && !changes.length) {
    console.log('Already up to date.')
    return
  }
  if (!opts.allowDirty && git(target, ['status', '--porcelain', '--untracked-files=all']).trim())
    throw new Error(
      'Blog has uncommitted changes. Commit them first, or explicitly use --allow-dirty after review.'
    )
  if (JSON.stringify(snapshot(source)) !== JSON.stringify(latest))
    throw new Error('Theme changed during planning; rerun.')
  const writes = [...changes, { name: stateName, before: stateBytes, next: nextState }]
  for (const item of writes) {
    const now = read(target, item.name)
    if ((now === null) !== (item.before === null) || (now && !now.equals(item.before)))
      throw new Error(`Blog changed during planning: ${item.name}`)
  }
  const backupDir = path.resolve(
    target,
    git(target, ['rev-parse', '--git-path', 'theme-sync-backups']).trim()
  )
  fs.mkdirSync(backupDir, { recursive: true })
  const backupPath = path.join(backupDir, `${Date.now()}-${process.pid}.json`)
  fs.writeFileSync(
    backupPath,
    JSON.stringify(
      {
        target,
        files: writes.map((item) => ({
          path: item.name,
          before: item.before?.toString('base64') ?? null
        }))
      },
      null,
      2
    ),
    { flag: 'wx' }
  )
  const done = []
  try {
    for (const item of writes) {
      const dest = safePath(target, item.name)
      done.push(item)
      if (item.next === null) fs.rmSync(dest, { force: true })
      else {
        fs.mkdirSync(path.dirname(dest), { recursive: true })
        fs.writeFileSync(dest, item.next)
      }
    }
  } catch (error) {
    for (const item of done.reverse()) {
      const dest = safePath(target, item.name)
      if (item.before === null) fs.rmSync(dest, { force: true })
      else fs.writeFileSync(dest, item.before)
    }
    throw error
  }
  console.log(
    `Applied. Backup: ${backupPath}\nNext: review git diff, run pnpm install and pnpm build in the blog, then commit the changes together with ${stateName}.`
  )
}

try {
  main()
} catch (error) {
  console.error(`Theme sync: ${error.message}`)
  process.exitCode = 1
}
