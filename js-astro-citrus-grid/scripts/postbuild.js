import { spawn } from 'node:child_process'
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { transformSync } from 'esbuild'

const DIST_DIR = path.resolve(process.cwd(), 'dist')

// 遍历 dist 收集 HTML

function collectHtmlFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) collectHtmlFiles(full, out)
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full)
  }
  return out
}

// 内联脚本压缩

const SCRIPT_RE = /<script([^>]*)>([\s\S]*?)<\/script>/gi

const JS_TYPES = new Set(['', 'text/javascript', 'application/javascript', 'module'])

function shouldMinify(attrs) {
  if (/\ssrc\s*=/i.test(attrs)) return false
  const typeMatch = attrs.match(/\stype\s*=\s*["']?([^"'\s>]*)/i)
  const type = (typeMatch?.[1] ?? '').toLowerCase()
  return JS_TYPES.has(type)
}

function minifyInline(code, file) {
  if (!code.trim()) return code
  try {
    const result = transformSync(code, {
      loader: 'js',
      target: 'es2018',
      minifyWhitespace: true,
      minifySyntax: true,
      minifyIdentifiers: false,
    })
    if (/<\/script/i.test(result.code)) return code
    return result.code
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.warn(`[postbuild] skipped a script (${file}): ${message}`)
    return code
  }
}

function minifyHtml(html, file, stats) {
  return html.replace(SCRIPT_RE, (whole, attrs, code) => {
    if (!shouldMinify(attrs)) return whole
    const minified = minifyInline(code, file)
    if (minified === code) return whole
    stats.scriptCount++
    stats.savedBytes += Buffer.byteLength(code, 'utf-8') - Buffer.byteLength(minified, 'utf-8')
    return `<script${attrs}>${minified}</script>`
  })
}

// modulepreload 注入

const DEPS_RE = /__vite__mapDeps=\(i,m=__vite__mapDeps,d=\(m\.f\|\|\(m\.f=\[([^\]]*)\]\)/

const depsCache = new Map()
function readDeps(chunkUrl) {
  if (depsCache.has(chunkUrl)) return depsCache.get(chunkUrl)
  let deps = []
  try {
    const code = readFileSync(path.join(DIST_DIR, chunkUrl.replace(/^\//, '')), 'utf-8')
    const m = code.match(DEPS_RE)
    if (m) deps = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => `/${x[1]}`)
  } catch {}
  depsCache.set(chunkUrl, deps)
  return deps
}

function injectPreloads(html, stats) {
  const headEnd = html.indexOf('</head>')
  if (headEnd === -1) return html
  const head = html.slice(0, headEnd)

  const links = new Set()
  for (const m of head.matchAll(/<script type="module" src="([^"]+)"><\/script>/g)) {
    for (const dep of readDeps(m[1])) links.add(dep)
  }
  const toAdd = [...links].filter((href) => !head.includes(`rel="modulepreload" href="${href}"`))
  if (toAdd.length === 0) return html

  const tags = toAdd.map((href) => `<link rel="modulepreload" href="${href}">`).join('')
  stats.injectedLinks += toAdd.length
  return html.slice(0, headEnd) + tags + html.slice(headEnd)
}

const KATEX_LEGACY_FONT_RE = /^KaTeX_.*\.(ttf|woff)$/

function trimKatexFonts() {
  const astroDir = path.join(DIST_DIR, '_astro')
  if (!statSync(astroDir, { throwIfNoEntry: false })) return

  let count = 0
  let savedBytes = 0
  for (const entry of readdirSync(astroDir, { withFileTypes: true })) {
    if (!entry.isFile() || !KATEX_LEGACY_FONT_RE.test(entry.name)) continue
    const full = path.join(astroDir, entry.name)
    savedBytes += statSync(full).size
    rmSync(full)
    count++
  }

  if (count === 0) {
    console.log('[postbuild] katex fonts: no ttf/woff to trim (already trimmed)')
    return
  }
  console.log(
    `[postbuild] trimmed ${count} KaTeX font files (ttf/woff, woff2 kept), saved ${(savedBytes / 1024).toFixed(1)} KiB`,
  )
}

const BUDGET_BYTES = 60 * 1024 * 1024

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MiB`
  return `${(bytes / 1024).toFixed(1)} KiB`
}

function collectFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) collectFiles(full, out)
    else if (entry.isFile()) out.push({ file: full, size: statSync(full).size })
  }
  return out
}

function relativeName(file) {
  return path.relative(DIST_DIR, file).replace(/\\/g, '/')
}

function reportBudget() {
  const files = collectFiles(DIST_DIR)
  const total = files.reduce((sum, f) => sum + f.size, 0)
  const astroFiles = files.filter((f) => relativeName(f.file).startsWith('_astro/'))
  const astroTotal = astroFiles.reduce((sum, f) => sum + f.size, 0)
  const top = [...files].sort((a, b) => b.size - a.size).slice(0, 5)

  console.log(
    `[postbuild] dist total ${formatBytes(total)} (${files.length} files), ` +
      `_astro ${formatBytes(astroTotal)} (${astroFiles.length} files)`,
  )
  console.log(
    `[postbuild] top 5: ${top.map((f) => `${relativeName(f.file)} ${formatBytes(f.size)}`).join(' | ')}`,
  )

  if (total > BUDGET_BYTES) {
    console.warn(
      `[postbuild] budget exceeded: ${formatBytes(total)} > ${formatBytes(BUDGET_BYTES)} (audio included)`,
    )
    for (const f of top)
      console.warn(`[postbuild]   ${relativeName(f.file)} ${formatBytes(f.size)}`)
  }
}

async function main() {
  if (!statSync(DIST_DIR, { throwIfNoEntry: false })) {
    console.error('[postbuild] dist/ not found, run astro build first')
    process.exitCode = 1
    return
  }

  const pagefind = spawn('pagefind', ['--site', 'dist'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  const pagefindDone = new Promise((resolve) => {
    pagefind.on('close', (code) => resolve(code))
    pagefind.on('error', (err) => {
      console.error('[postbuild] pagefind failed to start:', err?.message ?? err)
      process.exitCode = 1
      resolve(null)
    })
  })

  const htmlFiles = collectHtmlFiles(DIST_DIR)
  const stats = { scriptCount: 0, savedBytes: 0, injectedLinks: 0, touchedFiles: 0 }

  trimKatexFonts()

  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf-8')
    let output = minifyHtml(html, file, stats)
    output = injectPreloads(output, stats)
    if (output !== html) {
      writeFileSync(file, output)
      stats.touchedFiles++
    }
  }

  const savedKiB = (stats.savedBytes / 1024).toFixed(1)
  console.log(
    `[postbuild] minified ${stats.scriptCount} inline scripts, saved ${savedKiB} KiB; ` +
      `injected ${stats.injectedLinks} preload links (${stats.touchedFiles}/${htmlFiles.length} HTML files touched)`,
  )

  const pagefindCode = await pagefindDone
  if (pagefindCode !== 0 && pagefindCode !== null) {
    console.error(`[postbuild] pagefind exited with code ${pagefindCode}`)
    process.exitCode = 1
  }

  reportBudget()
}

main().catch((err) => {
  console.error('[postbuild] failed:', err)
  process.exitCode = 1
})
