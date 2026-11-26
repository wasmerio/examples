import { randomBytes } from 'node:crypto'
import { watch as watchFiles } from 'node:fs'
import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, join, matchesGlob, posix, relative, resolve, sep } from 'node:path'
import { parse, stringify } from 'yaml'

/** @typedef {import('../config-types.ts').SiteConfig} SiteConfig */
/** @typedef {import('../config-types.ts').LocaleConfig} LocaleConfig */
/** @typedef {import('./collections.ts').Collection} Collection */
/** @typedef {{ filepath: string, relativePath: string, content: string }} TransformContext */
/** @typedef {{ title?: boolean, createTime?: boolean, permalink?: boolean | 'filepath', transform?: (data: Record<string, unknown>, context: TransformContext, localeRoot: string) => Record<string, unknown> | Promise<Record<string, unknown>> }} AutoFrontmatterOptions */
/** @typedef {boolean | AutoFrontmatterOptions} AutoFrontmatterSetting */
/** @typedef {Collection & { autoFrontmatter?: AutoFrontmatterSetting }} AutoCollection */
/** @typedef {LocaleConfig & { collections?: AutoCollection[] }} AutoLocale */
/** @typedef {Omit<SiteConfig, 'locales' | 'autoFrontmatter'> & { locales: Record<string, AutoLocale>, collections?: AutoCollection[], autoFrontmatter?: AutoFrontmatterSetting }} AutoFrontmatterConfig */
/** @typedef {string | { link?: string, prefix?: string, dir?: string, items?: 'auto' | AutoSidebarItem[] }} AutoSidebarItem */

/** @param {string} value */
const slash = value => value.split(sep).join('/')
/** @param {AutoFrontmatterSetting | undefined} value @returns {false | AutoFrontmatterOptions} */
const normalizeOption = value => value === true || value === undefined ? {} : value
/** @param {string} value */
const trimNumber = value => value.replace(/^\d+\./u, '').trim()
/** @param {string} file */
const isIndex = file => /^(?:index|readme)\.md$/iu.test(basename(file))
/** @param {Date} value */
const formatTime = value => `${value.getFullYear()}/${String(value.getMonth() + 1).padStart(2, '0')}/${String(value.getDate()).padStart(2, '0')} ${[value.getHours(), value.getMinutes(), value.getSeconds()].map(part => String(part).padStart(2, '0')).join(':')}`
/** @param {...(string | undefined)} parts */
const joinRoute = (...parts) => `/${parts.flatMap(part => String(part ?? '').split('/')).filter(Boolean).join('/')}/`.replace(/\/{2,}/gu, '/')
/** @param {unknown} value */
const routeKey = value => `/${String(value ?? '').replaceAll('\\', '/').replace(/^\/+|\/+$/gu, '')}/`.replace(/\/{2,}/gu, '/')
/** @param {string | string[] | undefined} value @returns {string[]} */
const toArray = value => value === undefined ? [] : Array.isArray(value) ? value : [value]
/** @param {string} filepath @param {string | string[] | undefined} patterns */
const matchesAny = (filepath, patterns) => toArray(patterns).some(pattern => matchesGlob(filepath, pattern))

/** @param {string} directory @returns {Promise<string[]>} */
async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? markdownFiles(join(directory, entry.name))
    : entry.name.endsWith('.md') && !entry.name.endsWith('.snippet.md') ? [join(directory, entry.name)] : []))).flat()
}

/** @param {string} source @returns {{ data: Record<string, unknown>, content: string }} */
const splitFrontmatter = source => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/u)
  if (!match) return { data: {}, content: source }
  const parsed = parse(match[1])
  return {
    data: parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {},
    content: source.slice(match[0].length),
  }
}

/** @param {string} filepath */
async function filepathSlug(filepath) {
  /** @type {undefined | ((value: string, options: { toneType: string, nonZh: string }) => string)} */
  let pinyin
  try {
    const packageName = 'pinyin-pro'
    ;({ pinyin } = await import(packageName))
  }
  catch { /* optional, matching Plume */ }
  const source = pinyin ? pinyin(filepath, { toneType: 'none', nonZh: 'consecutive' }) : filepath
  return source.split('/').map(part => trimNumber(part).replace(/\.md$/iu, '').trim().replace(/[^\p{Letter}\p{Number}]+/gu, '-').replace(/^-|-$/gu, '').toLowerCase()).filter(Boolean).join('/')
}

/** @param {string} filepath */
const currentName = filepath => trimNumber(isIndex(filepath) ? basename(dirname(filepath)) : basename(filepath, '.md')) || 'Home'

/** @param {'auto' | AutoSidebarItem[] | undefined} sidebar @param {string} collectionDir */
function sidebarLinks(sidebar, collectionDir) {
  /** @type {Record<string, string>} */
  const links = {}
  /** @param {'auto' | AutoSidebarItem[] | undefined} items @param {string} link @param {string} directory */
  const visit = (items, link = '/', directory = '') => {
    if (!Array.isArray(items)) return
    for (const item of items) {
      if (typeof item === 'string') links[routeKey(directory)] = link
      else if (item) {
        const prefix = item.prefix ?? ''
        visit(
          item.items,
          posix.join(link, item.link ?? '/'),
          prefix.startsWith('/') ? prefix : posix.join('/', directory, prefix || item.dir || ''),
        )
      }
    }
  }
  for (const item of Array.isArray(sidebar) ? sidebar : []) {
    if (typeof item !== 'string' && item) visit(item.items, item.link ?? '/', posix.join('/', collectionDir, item.prefix || item.dir || ''))
  }
  return links
}

/** @param {{ root?: string, config: AutoFrontmatterConfig }} options */
export async function generateAutoFrontmatter({ root = resolve('content'), config }) {
  const globalOption = normalizeOption(config.autoFrontmatter ?? true)
  const localeEntries = Object.entries(config.locales ?? {}).map(([lang, locale], index) => ({
    lang,
    locale,
    path: locale.path ?? (typeof locale.home === 'string' ? locale.home : index === 0 ? '/' : `/${lang.split('-')[0]}/`),
  }))
  const rootLang = localeEntries.find(item => item.path === '/')?.lang ?? localeEntries[0]?.lang
  const changed = []

  for (const filepath of await markdownFiles(root)) {
    const relativePath = slash(relative(root, filepath))
    const localeMatch = localeEntries
      .filter(item => item.path !== '/')
      .sort((left, right) => right.path.length - left.path.length)
      .find(item => relativePath.startsWith(`${item.path.replace(/^\//u, '').replace(/\/$/u, '')}/`))
    const locale = localeMatch?.locale ?? (rootLang ? config.locales[rootLang] : undefined) ?? /** @type {AutoLocale} */ ({})
    const localeRoot = localeMatch?.path ?? localeEntries.find(item => item.lang === rootLang)?.path ?? '/'
    const localeDirectory = localeRoot.replace(/^\//u, '').replace(/\/$/u, '')
    const localPath = localeDirectory && relativePath.startsWith(`${localeDirectory}/`) ? relativePath.slice(localeDirectory.length + 1) : relativePath
    const collections = locale.collections ?? config.collections ?? []
    const ownedCollection = collections.find(item => localPath === `${item.dir}/index.md` || localPath === `${item.dir}/README.md` || localPath.startsWith(`${item.dir}/`))
    const collection = collections.find(item => {
      const inDirectory = localPath === `${item.dir}/index.md` || localPath === `${item.dir}/README.md` || localPath.startsWith(`${item.dir}/`)
      if (item.type !== 'post') return inDirectory
      return (inDirectory || matchesAny(relativePath, item.include)) && !matchesAny(relativePath, item.exclude)
    })
    if (!collection && (ownedCollection || globalOption === false)) continue
    const collectionOption = collection?.autoFrontmatter
    if (collectionOption === false) continue
    const collectionEnabled = collection ? (collectionOption ?? globalOption) !== false : globalOption !== false
    if (!collectionEnabled) continue
    const options = {
      ...(globalOption === false ? {} : globalOption),
      ...(collectionOption && collectionOption !== true ? collectionOption : {}),
    }
    const source = await readFile(filepath, 'utf8')
    let { data, content } = splitFrontmatter(source)
    const before = JSON.stringify(data)
    const rootPage = isIndex(localPath) && dirname(localPath) === '.'
    const collectionRoot = collection && isIndex(localPath) && dirname(localPath) === collection.dir

    if (rootPage) data.pageLayout = 'home'
    if ((options.title ?? true) && !Object.hasOwn(data, 'title')) data.title = rootPage ? 'Home' : collectionRoot ? collection.title ?? trimNumber(collection.dir) : currentName(localPath)
    if ((options.createTime ?? true) && !rootPage && !Object.hasOwn(data, 'createTime')) {
      const info = await stat(filepath)
      data.createTime = formatTime(info.birthtime.getFullYear() === 1970 ? info.atime : info.birthtime)
    }
    if ((options.permalink ?? true) && !rootPage && !Object.hasOwn(data, 'permalink')) {
      const prefix = collection?.linkPrefix ?? (collection?.type === 'post' ? collection.link : undefined) ?? collection?.dir
      if (collection?.type === 'doc' && collectionRoot) data.permalink = joinRoute(localeRoot, prefix)
      else if (collection?.type === 'doc' && Array.isArray(collection.sidebar)) {
        const link = sidebarLinks(collection.sidebar, collection.dir)[routeKey(dirname(localPath))] ?? '/'
        const slug = isIndex(localPath) ? '' : options.permalink === 'filepath'
          ? await filepathSlug(link === '/' ? localPath.slice(collection.dir.length + 1) : basename(localPath))
          : randomBytes(6).toString('base64url').slice(0, 8)
        data.permalink = joinRoute(localeRoot, prefix, link, slug)
      }
      else {
        const collectionRelative = collection && localPath.startsWith(`${collection.dir}/`) ? localPath.slice(collection.dir.length + 1) : localPath
        const slug = options.permalink === 'filepath' ? await filepathSlug(collectionRelative) : randomBytes(6).toString('base64url').slice(0, 8)
        data.permalink = joinRoute(localeRoot, prefix, slug)
      }
    }
    const localOption = normalizeOption(collectionOption)
    const transform = collection
      ? localOption === false ? undefined : localOption.transform
      : globalOption === false ? undefined : globalOption.transform
    data = await transform?.(data, { filepath, relativePath, content }, localeRoot) ?? data
    if (JSON.stringify(data) === before) continue
    await writeFile(filepath, `---\n${stringify(data, { lineWidth: 0 })}---\n${content}`)
    changed.push(relativePath)
  }
  return changed
}

/** @param {AutoFrontmatterConfig} config @param {string} [root] @returns {import('astro').AstroIntegration} */
export function autoFrontmatterIntegration(config, root = resolve('content')) {
  return {
    name: 'ermaozi:auto-frontmatter',
    hooks: {
      'astro:server:setup': ({ server }) => {
        if ((config.autoFrontmatter ?? true) === false) return
        /** @type {ReturnType<typeof setTimeout> | undefined} */
        let timer
        const watcher = watchFiles(root, { recursive: true }, (event, filename) => {
          if (event !== 'rename' || !filename?.endsWith('.md') || filename.endsWith('.snippet.md')) return
          clearTimeout(timer)
          timer = setTimeout(() => { void generateAutoFrontmatter({ root, config }) }, 50)
        })
        server.httpServer?.once('close', () => { clearTimeout(timer); watcher.close() })
      },
    },
  }
}
