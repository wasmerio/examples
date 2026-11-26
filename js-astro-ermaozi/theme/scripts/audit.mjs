import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { siteConfig } from '../../site.config.mjs'
import { withBase, withoutBase } from '../lib/client-utils.ts'
import { postCollectionsFor } from '../lib/collections.ts'
import { configuredLanguages, localePath } from '../lib/locales.ts'
import { sitemapOutputNames } from '../lib/sitemap-options.mjs'

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const output = path.join(project, 'dist')
const reportFile = path.join(project, '.astro/audit.json')
const siteOrigin = process.env.SITE_ORIGIN || siteConfig.origin
const base = process.env.BASE_PATH || siteConfig.base || '/'

/** @param {string} directory @returns {Promise<string[]>} */
const walk = async directory => {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walk(target))
    else files.push(target)
  }
  return files
}

/** @param {string} file */
const routeOf = file => {
  const relative = path.relative(output, file).split(path.sep).join('/')
  if (relative === 'index.html') return '/'
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -10)}`
  return `/${relative}`
}

const files = await walk(output)
const outputFiles = new Set(files.map(file => path.resolve(file)))
const htmlFiles = files.filter(file => file.endsWith('.html'))
const pages = new Map(await Promise.all(htmlFiles.map(async file => /** @type {[string, string]} */ ([routeOf(file), await readFile(file, 'utf8')]))))
const requiredRoutes = [...new Set(configuredLanguages().flatMap(lang => {
  return [
    localePath(lang),
    ...postCollectionsFor(lang).flatMap(collection => [
      collection.postList === false ? '' : collection.link,
      collection.categories === false ? '' : collection.categoriesLink,
      collection.tags === false ? '' : collection.tagsLink,
      collection.archives === false ? '' : collection.archivesLink,
    ]),
  ].filter(Boolean)
}))]
const missingRoutes = requiredRoutes.filter(route => !pages.has(route))

const seoErrors = []
const brokenLinks = []
const rawMarkers = [':::', '@tab', '<Airport', '<AdBoard', '<ClaudeEnv', '<StatsPage', '<AppleId']
const markerHits = []
for (const [route, html] of pages) {
  if (!/<title>[^<]+<\/title>/i.test(html)) seoErrors.push({ route, field: 'title' })
  if (!/<meta\s+name="description"\s+content="[^"]+"/i.test(html)) seoErrors.push({ route, field: 'description' })
  const canonicalTag = [...html.matchAll(/<link\b[^>]*>/gi)].find(([tag]) => /\brel="canonical"/i.test(tag))?.[0]
  const canonical = canonicalTag?.match(/\bhref="([^"]+)"/i)?.[1]
  if (canonical !== new URL(withBase(route, base), siteOrigin).toString()) seoErrors.push({ route, field: 'canonical' })
  const rendered = html.replace(/<(pre|code)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
  for (const marker of rawMarkers) if (rendered.includes(marker)) markerHits.push({ route, marker })

  for (const match of html.matchAll(/\shref="(\/[^"]*)"/g)) {
    const target = withoutBase(new URL(match[1], siteOrigin).pathname, base)
    if (outputFiles.has(path.resolve(output, target.replace(/^\/+/, '')))) continue
    if (/^\/(?:_astro|pagefind|img|api)\//.test(target) || /\.(?:md|xml|xsl|txt|json|svg|png|jpe?g|webp|ico)$/i.test(target)) continue
    if (!pages.has(target) && !pages.has(`${target.replace(/\/$/u, '')}/`)) brokenLinks.push({ route, target })
  }
}

const sitemapText = await readFile(path.join(output, sitemapOutputNames(siteConfig).sitemap), 'utf8')
const sitemapLocations = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1])
const sitemapErrors = sitemapLocations.filter(location => !location.startsWith(new URL(withBase('/', base), siteOrigin).toString()))

const personalTerms = [
  ['二', '毛'].join(''),
  ['er', 'mao', '.', 'net'].join(''),
  ['image', '.', 'er', 'mao', '.net'].join(''),
  ['科', '学', '上', '网'].join(''),
  ['翻', '墙'].join(''),
  ['机', '场', '推', '荐'].join(''),
  ['scam', 'vpn'].join(''),
  ['geo', '-', 'trust'].join(''),
]
const sourceFiles = [
  ...await walk(path.join(project, 'content')),
  ...await walk(path.join(project, 'theme')),
  ...await walk(path.join(project, 'public')),
  path.join(project, 'README.md'),
  path.join(project, 'package.json'),
  path.join(project, 'site.config.mjs'),
]
const personalHits = []
for (const file of sourceFiles.filter(file => !/\.(?:png|jpe?g|webp|gif|woff2?|ico)$/i.test(file))) {
  const value = (await readFile(file, 'utf8').catch(() => '')).replaceAll('https://astro.ermao.net', '')
  for (const term of personalTerms) if (value.toLowerCase().includes(term.toLowerCase())) {
    personalHits.push({ file: path.relative(project, file), term })
  }
}

const unsafe = []
const unsafePatterns = [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, /(?:api|secret|access)[_-]?token\s*[:=]\s*["'][^"']+/i]
for (const file of files.filter(file => !/\.(?:png|jpe?g|webp|gif|woff2?|ico)$/i.test(file))) {
  const value = await readFile(file, 'utf8').catch(() => '')
  for (const pattern of unsafePatterns) if (pattern.test(value)) unsafe.push({ file: path.relative(output, file), pattern: String(pattern) })
}

const failures = missingRoutes.length + seoErrors.length + brokenLinks.length + markerHits.length + sitemapErrors.length + personalHits.length + unsafe.length
const report = {
  generatedAt: new Date().toISOString(),
  counts: { html: pages.size, sitemap: sitemapLocations.length },
  missingRoutes,
  seoErrors,
  brokenLinks,
  markerHits,
  sitemapErrors,
  personalHits,
  unsafe,
  passed: failures === 0,
}

await mkdir(path.dirname(reportFile), { recursive: true })
await writeFile(reportFile, `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify({ ...report.counts, missingRoutes: missingRoutes.length, seoErrors: seoErrors.length, brokenLinks: brokenLinks.length, personalHits: personalHits.length, unsafe: unsafe.length, passed: report.passed }))
if (!report.passed) process.exitCode = 1
