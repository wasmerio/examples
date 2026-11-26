import { getCollection, type CollectionEntry } from 'astro:content'
import { encryptionPolicy } from './encrypt-policy'
import { redactEncryptedSource } from './encryption'
import { langOf, routeOf } from './content'
import { llmMarkdownSource } from './llm-markdown'
import { configuredLanguages, localePath, rootLanguage } from './locales'
import { siteConfig } from '../../site.config.mjs'

type ContentEntry = CollectionEntry<'content'>
export type LlmsPage = {
  path: string
  title: string
  lang: string
  filePathRelative?: string
  frontmatter: Record<string, unknown>
  markdown?: string
  excerpt?: string
}
export type LlmsOptions = {
  domain?: string
  linkExtension?: '.html' | '.md'
  llmsTxt?: boolean
  llmsFullTxt?: boolean
  llmsPageTxt?: boolean
  stripHTML?: boolean
  locale?: string | 'all'
  filter?: (page: LlmsPage) => boolean
  transformMarkdown?: (markdown: string, page: LlmsPage) => string
  llmsTxtTemplate?: string
  llmsTxtTemplateGetter?: Record<string, string | ((pages: LlmsPage[], state: Record<string, unknown>) => string)>
}

export const llmstxtOptions = (): LlmsOptions | false => {
  const config = siteConfig as { llmstxt?: boolean | LlmsOptions, plugins?: { llmstxt?: boolean | LlmsOptions } }
  const value = config.llmstxt ?? config.plugins?.llmstxt ?? false
  return value === false ? false : typeof value === 'object' ? value : {}
}

export const llmstxtEnabled = (output: 'any' | 'full' | 'page' | 'toc' = 'any') => {
  const options = llmstxtOptions()
  if (!options) return false
  return output === 'toc' ? options.llmsTxt !== false
    : output === 'full' ? options.llmsFullTxt !== false
      : output === 'page' ? options.llmsPageTxt !== false
        : options.llmsTxt !== false || options.llmsFullTxt !== false || options.llmsPageTxt !== false
}

export const llmstxtLanguages = () => {
  const options = llmstxtOptions()
  if (!options) return []
  if (options.locale === 'all') return configuredLanguages()
  const target = options.locale ?? localePath(rootLanguage())
  return configuredLanguages().filter(lang => lang === target || localePath(lang) === target)
}

export const llmsPageOf = (entry: ContentEntry): LlmsPage => ({
  path: routeOf(entry),
  title: entry.data.title,
  lang: langOf(entry),
  filePathRelative: entry.id,
  frontmatter: entry.data,
})

export const llmstxtPageEnabled = (entry: ContentEntry) => {
  const options = llmstxtOptions()
  return Boolean(options && options.llmsPageTxt !== false && llmstxtEntryEnabled(entry))
}

export const llmstxtEntryEnabled = (entry: ContentEntry) => {
  const options = llmstxtOptions()
  if (!options || entry.data.llmstxt === false || entry.data.draft || encryptionPolicy(entry).pageEncrypted) return false
  if (!llmstxtLanguages().includes(langOf(entry))) return false
  return options.filter?.(llmsPageOf(entry)) !== false
}

const stripHtml = (source: string) => {
  let fence = ''
  let html = ''
  let comment = false
  return source.split('\n').map(line => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1] ?? ''
    if (marker) {
      if (!fence) fence = marker
      else if (marker[0] === fence[0] && marker.length >= fence.length) fence = ''
      return line
    }
    if (fence) return line
    if (comment) {
      if (line.includes('-->')) comment = false
      return ''
    }
    if (line.includes('<!--') && !line.includes('-->')) {
      comment = true
      return line.slice(0, line.indexOf('<!--'))
    }
    if (html) {
      if (line.includes('>')) html = ''
      return ''
    }
    if (/^\s*<[A-Za-z][\w:-]*(?:\s[^>]*)?$/u.test(line)) {
      html = 'tag'
      return ''
    }
    return line.replace(/<!--[\s\S]*?-->|<\/?[A-Za-z][\w:-]*(?=\s|\/?>)[^>]*>/gu, '')
  }).join('\n')
}

export const llmsMarkdown = (entry: ContentEntry) => {
  const options = llmstxtOptions()
  let markdown = llmMarkdownSource(redactEncryptedSource(entry.body?.trimStart() ?? ''))
  if (options && options.stripHTML !== false) markdown = stripHtml(markdown)
  return options && options.transformMarkdown ? options.transformMarkdown(markdown, llmsPageOf(entry)) : markdown
}

export const rawMarkdownEntries = async () => (await getCollection('content'))
  .filter(llmstxtPageEnabled)

export const rawMarkdownResponse = (entry: ContentEntry) => {
  const body = llmsMarkdown(entry)
  return new Response(body.startsWith('# ') ? body : `# ${entry.data.title}\n\n${body}`, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}

export const legacyRawPath = (entry: ContentEntry) => {
  const route = routeOf(entry)
  return route === '/' ? 'index' : route.replace(/^\//u, '').replace(/\/$/u, '')
}

export const plumeRawPath = (entry: ContentEntry) => {
  const route = routeOf(entry)
  return route === '/' ? 'index' : `${route.replace(/^\//u, '').replace(/\/$/u, '')}/index`
}
