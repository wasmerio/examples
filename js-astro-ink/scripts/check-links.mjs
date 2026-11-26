import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import parseSrcset from '@prettier/parse-srcset'
import { parse } from 'parse5'

function readPage(html, report) {
  const page = { ids: new Set(), refs: [], canonical: undefined, base: undefined }
  function visit(node) {
    const attrs = Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]))
    if (attrs.id) page.ids.add(attrs.id)
    if (node.tagName === 'a') {
      if (attrs.name) page.ids.add(attrs.name)
      if (attrs.href !== undefined) page.refs.push(attrs.href)
    }
    if (node.tagName === 'base' && attrs.href !== undefined) page.base ??= attrs.href
    if (node.tagName === 'link' && attrs.rel === 'canonical') page.canonical ??= attrs.href
    if (node.tagName === 'img' && attrs.src) page.refs.push(attrs.src)
    if (node.tagName === 'meta' && attrs.content &&
        (attrs.property === 'og:image' || attrs.name === 'twitter:image')) {
      page.refs.push(attrs.content)
    }
    if ((node.tagName === 'img' || node.tagName === 'source') && attrs.srcset) {
      try {
        for (const candidate of parseSrcset(attrs.srcset)) page.refs.push(candidate.source.value)
      } catch {
        report(`invalid srcset: ${attrs.srcset}`)
      }
    }
    for (const child of node.childNodes ?? []) visit(child)
  }
  visit(parse(html))
  return page
}

// Resolve references against the URL of the emitted file. This also works for
// fragment-only links on 404.html, whose canonical URL may be /404.
export function checkLinks(directory) {
  const files = new Set()
  const pages = new Map()
  const errors = new Set()
  for (const entry of fs.readdirSync(directory, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile()) continue
    const absolute = path.join(entry.parentPath, entry.name)
    const file = path.relative(directory, absolute).split(path.sep).join('/')
    files.add(file)
    if (file.endsWith('.html')) {
      pages.set(
        file,
        readPage(fs.readFileSync(absolute, 'utf8'), (error) => errors.add(`${file}: ${error}`))
      )
    }
  }
  const home = pages.get('index.html')
  if (!home?.canonical) throw new Error('Expected a built index.html with a canonical site URL.')
  const root = new URL(home.canonical)
  root.pathname = root.pathname.replace(/\/?$/, '/')
  const prefix = decodeURIComponent(root.pathname)
  let checked = 0

  for (const [file, page] of pages) {
    const route = file
      .split('/')
      .map(encodeURIComponent)
      .join('/')
      .replace(/(^|\/)index\.html$/, '$1')
    const pageUrl = new URL(route, root)
    const base = page.base === undefined ? pageUrl : new URL(page.base, pageUrl)
    for (const ref of page.refs) {
      const fail = (reason) => errors.add(`${file} → ${ref} (${reason})`)
      try {
        const url = new URL(ref, base)
        if (url.origin !== root.origin) continue
        const pathname = decodeURIComponent(url.pathname)
        if (!pathname.startsWith(prefix) && pathname + '/' !== prefix) {
          // An explicit URL can point at a sibling project on the same host.
          if (!/^(?:https?:)?\/\//i.test(ref.trim())) fail('outside deployment base')
          continue
        }
        checked++
        const relative = pathname.slice(prefix.length)
        const target = files.has(relative) ? relative : path.posix.join(relative, 'index.html')
        if (!files.has(target)) {
          fail('missing page or file')
          continue
        }
        const fragment = decodeURIComponent(url.hash.slice(1).split(':~:')[0])
        const dest = pages.get(target)
        if (dest && fragment && fragment.toLowerCase() !== 'top' && !dest.ids.has(fragment)) {
          fail('missing heading or anchor')
        }
      } catch {
        fail('invalid URL or percent encoding')
      }
    }
  }
  return { pages: pages.size, checked, errors: [...errors].sort() }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const result = checkLinks(path.resolve(process.argv[2] ?? 'dist'))
    for (const error of result.errors) console.error(error)
    console.log(
      `Checked ${result.checked} local references across ${result.pages} pages; ${result.errors.length} issues.`
    )
    if (result.errors.length) process.exitCode = 1
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
