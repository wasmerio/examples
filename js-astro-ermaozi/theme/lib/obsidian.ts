import GithubSlugger from 'github-slugger'
import type MarkdownIt from 'markdown-it'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { languageFromPath, routeFromSourcePath } from './locales.ts'

export type ObsidianOptions = false | true | {
  wikiLink?: boolean
  embedLink?: boolean
  callout?: boolean | {
    locales?: Record<string, Record<string, string>>
    openRender?: (...args: any[]) => string
    closeRender?: (...args: any[]) => string
    titleRender?: (...args: any[]) => string
  }
  comment?: boolean
  locales?: Record<string, Record<string, string>>
}

type Page = { file: string, relative: string, route: string, title: string, source: string }

const calloutGroups = {
  note: ['quote', 'cite'],
  tip: ['hint'],
  info: ['todo'],
  success: ['check', 'done'],
  warning: ['question', 'help', 'faq'],
  caution: ['attention', 'failure', 'fail', 'missing', 'danger', 'error', 'bug'],
  important: ['example'],
  details: ['abstract', 'summary', 'tldr'],
} as const

const calloutAlias = Object.fromEntries(
  Object.entries(calloutGroups).flatMap(([type, aliases]) => aliases.map(alias => [alias, type])),
) as Record<string, string>
const calloutTypes = new Set(Object.entries(calloutGroups).flatMap(([type, aliases]) => [type, ...aliases]))

const calloutLocales = {
  zh: {
    note: '笔记', quote: '引用', cite: '引文', tip: '提示', hint: '技巧', info: '信息', todo: '待办',
    success: '成功', check: '核对', done: '完成', warning: '警告', question: '疑问', help: '帮助', faq: '常见问题',
    caution: '注意', attention: '关注', failure: '失败', fail: '未通过', missing: '缺失', danger: '危险', error: '错误', bug: '缺陷',
    important: '重要', example: '示例', details: '详情', abstract: '摘要', summary: '总结', tldr: '太长不看',
  },
  en: {
    note: 'Note', quote: 'Quote', cite: 'Cite', tip: 'Tip', hint: 'Hint', info: 'Info', todo: 'Todo',
    success: 'Success', check: 'Check', done: 'Done', warning: 'Warning', question: 'Question', help: 'Help', faq: 'FAQ',
    caution: 'Caution', attention: 'Attention', failure: 'Failure', fail: 'Fail', missing: 'Missing', danger: 'Danger', error: 'Error', bug: 'Bug',
    important: 'Important', example: 'Example', details: 'Details', abstract: 'Abstract', summary: 'Summary', tldr: 'TL;DR',
  },
  'zh-TW': {
    note: '筆記', quote: '引用', cite: '引文', tip: '提示', hint: '技巧', info: '資訊', todo: '待辦',
    success: '成功', check: '核對', done: '完成', warning: '警告', question: '疑問', help: '幫助', faq: '常見問題',
    caution: '注意', attention: '關注', failure: '失敗', fail: '未通過', missing: '缺失', danger: '危險', error: '錯誤', bug: '缺陷',
    important: '重要', example: '範例', details: '詳情', abstract: '摘要', summary: '總結', tldr: '太長不看',
  },
  de: {
    note: 'Hinweis', quote: 'Zitat', cite: 'Quellenangabe', tip: 'Tipp', hint: 'Hinweis', info: 'Info', todo: 'Aufgabe',
    success: 'Erfolg', check: 'Prüfung', done: 'Erledigt', warning: 'Warnung', question: 'Frage', help: 'Hilfe', faq: 'FAQ',
    caution: 'Vorsicht', attention: 'Achtung', failure: 'Fehlschlag', fail: 'Gescheitert', missing: 'Fehlend', danger: 'Gefahr', error: 'Fehler', bug: 'Bug',
    important: 'Wichtig', example: 'Beispiel', details: 'Details', abstract: 'Zusammenfassung', summary: 'Zusammenfassung', tldr: 'TL;DR',
  },
  fr: {
    note: 'Note', quote: 'Citation', cite: 'Référence', tip: 'Astuce', hint: 'Indice', info: 'Info', todo: 'À faire',
    success: 'Succès', check: 'Vérification', done: 'Terminé', warning: 'Avertissement', question: 'Question', help: 'Aide', faq: 'FAQ',
    caution: 'Prudence', attention: 'Attention', failure: 'Échec', fail: 'Échoué', missing: 'Manquant', danger: 'Danger', error: 'Erreur', bug: 'Bug',
    important: 'Important', example: 'Exemple', details: 'Détails', abstract: 'Résumé', summary: 'Sommaire', tldr: 'En bref',
  },
  ru: {
    note: 'Заметка', quote: 'Цитата', cite: 'Ссылка', tip: 'Совет', hint: 'Подсказка', info: 'Информация', todo: 'Сделать',
    success: 'Успех', check: 'Проверка', done: 'Готово', warning: 'Предупреждение', question: 'Вопрос', help: 'Помощь', faq: 'ЧаВо',
    caution: 'Осторожно', attention: 'Внимание', failure: 'Неудача', fail: 'Сбой', missing: 'Отсутствует', danger: 'Опасность', error: 'Ошибка', bug: 'Баг',
    important: 'Важно', example: 'Пример', details: 'Подробности', abstract: 'Аннотация', summary: 'Итоги', tldr: 'Кратко',
  },
  ja: {
    note: 'ノート', quote: '引用', cite: '出典', tip: 'ヒント', hint: '助言', info: '情報', todo: 'やること',
    success: '成功', check: 'チェック', done: '完了', warning: '警告', question: '質問', help: 'ヘルプ', faq: 'よくある質問',
    caution: '注意', attention: '注目', failure: '失敗', fail: '未達', missing: '不明', danger: '危険', error: 'エラー', bug: 'バグ',
    important: '重要', example: '例', details: '詳細', abstract: '要約', summary: 'まとめ', tldr: '短縮版',
  },
  ko: {
    note: '참고', quote: '인용', cite: '인용문', tip: '팁', hint: '단서', info: '정보', todo: '할 일',
    success: '성공', check: '확인', done: '완료', warning: '경고', question: '질문', help: '도움말', faq: '자주 묻는 질문',
    caution: '주의', attention: '주목', failure: '실패', fail: '미달', missing: '누락', danger: '위험', error: '오류', bug: '버그',
    important: '중요', example: '예시', details: '세부사항', abstract: '요약', summary: '정리', tldr: '요약',
  },
} as const

const calloutLocaleAliases: Record<string, keyof typeof calloutLocales> = {
  en: 'en', 'en-US': 'en', zh: 'zh', 'zh-CN': 'zh', 'zh-Hans': 'zh', 'zh-Hant': 'zh', 'zh-TW': 'zh-TW',
  de: 'de', 'de-DE': 'de', fr: 'fr', 'fr-FR': 'fr', ru: 'ru', 'ru-RU': 'ru', ja: 'ja', 'ja-JP': 'ja', ko: 'ko', 'ko-KR': 'ko',
}

const normalizedOptions = (options: ObsidianOptions) => options === false ? false : typeof options === 'object' ? options : {}
const enabled = (options: ObsidianOptions, feature: keyof Exclude<ObsidianOptions, boolean>) => {
  const normalized = normalizedOptions(options)
  return normalized !== false && normalized[feature] !== false
}

const frontmatter = (source: string) => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  const data: Record<string, string> = {}
  for (const line of match?.[1].split(/\r?\n/) ?? []) {
    const field = line.match(/^([\w-]+):\s*(.*?)\s*$/)
    if (field) data[field[1]] = field[2].replace(/^(['"])([\s\S]*)\1$/, '$2')
  }
  return { data, content: match ? source.slice(match[0].length) : source }
}

const markdownFiles = (directory: string): string[] => existsSync(directory)
  ? readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
      const file = path.join(directory, entry.name)
      return entry.isDirectory() ? markdownFiles(file) : entry.isFile() && /\.md$/i.test(entry.name) ? [file] : []
    })
  : []

const routeFromRelative = (relative: string) => {
  const route = relative.replaceAll(path.sep, '/').replace(/(?:^|\/)(?:index|README)\.md$/i, '').replace(/\.md$/i, '')
  return `/${route}${route ? '/' : ''}`.replace(/\/{2,}/g, '/')
}

const contentPages = (): Page[] => {
  const root = path.resolve(process.cwd(), 'content')
  return markdownFiles(root).map(file => {
    const source = readFileSync(file, 'utf8')
    const { data } = frontmatter(source)
    const relative = path.relative(root, file).replaceAll(path.sep, '/')
    return {
      file,
      relative,
      route: data.permalink || routeFromRelative(relative),
      title: data.title || path.basename(relative, path.extname(relative)),
      source,
    }
  }).sort((left, right) => left.relative.split('/').length - right.relative.split('/').length)
}

export const resolveContentPage = (reference: string, sourcePath = '', pages = contentPages()) => {
  const root = path.resolve(process.cwd(), 'content')
  const current = sourcePath ? path.relative(root, sourcePath).replaceAll(path.sep, '/') : ''
  const directory = path.posix.dirname(current)
  let filename = reference.startsWith('.') ? path.posix.join(directory, reference) : reference.replace(/^\/+/, '')
  const filenames = filename.endsWith('/')
    ? [`${filename}index.md`, `${filename}README.md`]
    : [path.posix.extname(filename) ? filename : `${filename}.md`]
  return pages.find(page => filenames.some(candidate => page.relative === candidate || page.relative.endsWith(candidate)))
}

const currentPage = (sourcePath = '', pages = contentPages()) => pages.find(page => path.resolve(page.file) === path.resolve(sourcePath))
const slugify = (value: string) => new GithubSlugger().slug(value)
const anchor = (parts: string[]) => parts.length ? `#${slugify(parts.at(-1)!)}` : ''
const linkText = (page: Page | undefined, filename: string, headings: string[], alias = '') => {
  if (alias) return alias
  const label = page?.title || filename
  return `${label}${headings.length ? ` > ${headings.join(' > ')}` : ''}`
}

const resolveAsset = (filename: string, sourcePath = '') => {
  if (/^(?:https?:)?\/\//i.test(filename) || filename.startsWith('/') || filename.startsWith('.')) return filename
  if (sourcePath) {
    const directory = path.dirname(sourcePath)
    const actual = [path.resolve(process.cwd(), 'content', filename), path.resolve(directory, filename)].find(existsSync)
    if (actual) {
      const relative = path.relative(directory, actual).replaceAll(path.sep, '/')
      return relative.startsWith('.') ? relative : `./${relative}`
    }
  }
  return `/${filename}`
}

const cssSize = (value: string) => /^-?(?:\d+|\d*\.\d+)$/.test(value) ? `${value}px` : /^-?(?:\d+|\d*\.\d+)(?:px|rem|em|%|vh|vw|vmin|vmax|ch|ex)$/.test(value) ? value : ''
const escapeHtml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

const transformCallouts = (source: string, markerSize = 64): string => {
  const lines = source.split('\n')
  const output: string[] = []
  let fence = ''
  for (let index = 0; index < lines.length; index++) {
    const fenceMarker = lines[index].match(/^\s*(`{3,}|~{3,})/)?.[1]
    if (fenceMarker) {
      if (!fence) fence = fenceMarker[0]
      else if (fence === fenceMarker[0]) fence = ''
      output.push(lines[index])
      continue
    }
    const open = fence ? null : lines[index].match(/^(\s*(?:>\s*)*)>\s*\[!([^\]]+)\]\s*([+-]?)(.*)$/)
    const type = open?.[2].toLowerCase()
    if (!open || !type || !calloutTypes.has(type)) {
      output.push(lines[index])
      continue
    }
    const outer = open[1]
    const body: string[] = []
    const quoted = new RegExp(`^${outer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}> ?(.*)$`)
    while (index + 1 < lines.length) {
      const next = lines[index + 1].match(quoted)
      if (!next) break
      body.push(next[1])
      index++
    }
    if (!body.some(line => line.trim())) {
      output.push(lines[index - body.length])
      output.push(...body.map(line => `${outer}> ${line}`))
      continue
    }
    const marker = ':'.repeat(Math.max(3, markerSize))
    const title = Buffer.from(open[4].trim()).toString('base64')
    const transformed = transformCallouts(body.join('\n'), markerSize - 1).split('\n').map(line => `${outer}${line}`)
    output.push(`${outer}${marker} obsidian-callout ${type} ${title}`, ...transformed, `${outer}${marker}`)
  }
  return output.join('\n')
}

const commentPlugin = (md: MarkdownIt) => {
  md.inline.ruler.before('html_inline', 'obsidian_inline_comment', (state, silent) => {
    const start = state.pos
    if (!state.src.startsWith('%%', start) || state.posMax - start < 5 || silent) return false
    const end = state.src.indexOf('%%', start + 2)
    if (end <= start + 2) return false
    state.push('obsidian_inline_comment', '', 0).content = state.src.slice(start + 2, end)
    state.pos = end + 2
    return true
  })
  md.block.ruler.before('html_block', 'obsidian_block_comment', (state, startLine, endLine, silent) => {
    const start = state.bMarks[startLine] + state.tShift[startLine]
    if (!state.src.startsWith('%%', start)) return false
    if (silent) return true
    let line = startLine
    while (++line < endLine && state.src.slice(state.bMarks[line], state.eMarks[line]).trim() !== '%%') {}
    if (line >= endLine) return false
    state.push('obsidian_block_comment', '', 0).map = [startLine, line + 1]
    state.line = line + 1
    return true
  })
  md.renderer.rules.obsidian_inline_comment = () => ''
  md.renderer.rules.obsidian_block_comment = () => ''
}

const wikiPlugin = (md: MarkdownIt) => {
  md.inline.ruler.before('emphasis', 'obsidian_wiki_link', (state, silent) => {
    const start = state.pos
    if (!state.src.startsWith('[[', start) || state.posMax - start < 5 || silent) return false
    const end = state.src.indexOf(']]', start + 2)
    if (end <= start + 2) return false
    const content = state.src.slice(start + 2, end).trim()
    const [file, alias = ''] = content.split('|')
    const [filename, ...headings] = file.trim().split('#').map(value => value.trim())
    const token = state.push('obsidian_wiki_link', '', 0)
    token.meta = { filename, headings, alias: alias.trim() }
    state.pos = end + 2
    return true
  })
  md.renderer.rules.obsidian_wiki_link = (tokens, index, _options, env: { sourcePath?: string, obsidianPages?: Page[] }) => {
    const { filename, headings, alias } = tokens[index].meta
    const suffix = anchor(headings)
    if (/^https?:\/\//i.test(filename)) {
      return `<a href="${escapeHtml(filename + suffix)}" target="_blank" rel="noopener noreferrer">${escapeHtml(alias || `${filename}${headings.length ? ` > ${headings.join(' > ')}` : ''}`)}</a>`
    }
    if (!filename) {
      const page = currentPage(env.sourcePath, env.obsidianPages)
      return `<a class="vp-link link" href="${suffix}">${escapeHtml(linkText(page, '', headings, alias))}</a>`
    }
    const page = resolveContentPage(filename, env.sourcePath, env.obsidianPages)
    if (page) return `<a class="vp-link link" href="${escapeHtml(page.route + suffix)}">${escapeHtml(linkText(page, filename, headings, alias))}</a>`
    const url = filename.startsWith('.') && env.sourcePath
      ? `/${path.posix.join(path.posix.dirname(path.relative(path.resolve(process.cwd(), 'content'), env.sourcePath).replaceAll(path.sep, '/')), filename)}`
      : `/${filename.replace(/^\/+/, '')}`
    return `<a href="${escapeHtml(url + suffix)}" target="_blank" rel="noopener noreferrer">${escapeHtml(alias || `${filename}${headings.length ? ` > ${headings.join(' > ')}` : ''}`)}</a>`
  }
}

const imageTypes = new Set(['.jpg', '.jpeg', '.png', '.gif', '.avif', '.webp', '.svg', '.bmp', '.ico', '.tiff', '.apng', '.jfif', '.pjpeg', '.pjp', '.xbm'])
const audioTypes = new Set(['.mp3', '.flac', '.wav', '.ogg', '.opus', '.webm', '.acc'])
const videoTypes = new Set(['.mp4', '.webm', '.mov', '.mpd', '.dash', '.m3u8', '.hls', '.ts', '.flv', '.mkv', '.ogv'])

const extractHeadings = (content: string, headings: string[]) => {
  if (!headings.length) return content
  const lines = content.split(/\r?\n/)
  const all: Array<{ line: number, level: number, text: string }> = []
  let fence = ''
  for (let index = 0; index < lines.length; index++) {
    const marker = lines[index].match(/^\s*(`{3,}|~{3,})/)?.[1]
    if (marker) {
      if (!fence) fence = marker[0]
      else if (fence === marker[0]) fence = ''
      continue
    }
    if (fence) continue
    const heading = lines[index].match(/^(#{1,6})\s+(.+?)(?:\s+\{[^}]*\})?\s*$/)
    if (heading) all.push({ line: index, level: heading[1].length, text: heading[2].trim() })
  }
  let target = -1
  for (let start = 0; start < all.length && target < 0; start++) {
    if (all[start].text !== headings[0]) continue
    let pointer = 1
    let level = all[start].level
    if (pointer === headings.length) target = start
    for (let cursor = start + 1; cursor < all.length && target < 0 && pointer < headings.length; cursor++) {
      if (all[cursor].level <= all[start].level) break
      if (all[cursor].level > level && all[cursor].text === headings[pointer]) {
        level = all[cursor].level
        if (++pointer === headings.length) target = cursor
      }
    }
  }
  if (target < 0) return ''
  const heading = all[target]
  const next = all.slice(target + 1).find(item => item.level <= heading.level)
  return lines.slice(heading.line + 1, next?.line ?? lines.length).join('\n').trim()
}

type EmbedRenderers = {
  artPlayer: (src: string) => string
  pdf: (src: string, page: string, height: string) => string
  markdown: (source: string, sourcePath: string, stack: string[], pages: Page[]) => string
}

const embedPlugin = (md: MarkdownIt, renderers: EmbedRenderers) => {
  const push = (state: any, content: string, inline: boolean) => {
    const [file, settings = ''] = content.split('|').map((value: string) => value.trim())
    const [filename, ...hashes] = file.split('#').map((value: string) => value.trim())
    const extension = path.extname(filename).toLowerCase()
    if (imageTypes.has(extension)) {
      const src = resolveAsset(filename, state.env.sourcePath)
      const token = state.push('image', 'img', 0)
      token.attrSet('src', src)
      token.attrSet('alt', filename)
      token.content = filename
      const text = new state.Token('text', '', 0)
      text.content = filename
      token.children = [text]
      if (settings) {
        const [width, height] = settings.split('x').map((value: string) => cssSize(value.trim()))
        token.attrSet('style', [width && `width:${width}`, height && `height:${height}`].filter(Boolean).join(';'))
      }
      return
    }
    if (audioTypes.has(extension)) {
      const src = resolveAsset(filename)
      const token = state.push('obsidian_audio', '', 0)
      token.meta = { src, filename }
      return
    }
    if (videoTypes.has(extension)) {
      const src = resolveAsset(filename)
      const token = state.push('obsidian_video', '', 0)
      token.meta = { src }
      return
    }
    if (extension === '.pdf') {
      const src = resolveAsset(filename)
      const token = state.push('obsidian_pdf', '', 0)
      token.meta = {
        src,
        page: hashes.find((value: string) => value.startsWith('page='))?.slice(5) || '1',
        height: hashes.find((value: string) => value.startsWith('height='))?.slice(7) || '',
      }
      return
    }
    if (/^https?:\/\//i.test(filename) || (extension && extension !== '.md')) {
      const token = state.push('obsidian_asset_link', '', 0)
      token.meta = { href: filename, text: filename }
      return
    }
    const token = state.push('obsidian_embed_link', '', 0)
    token.meta = { filename, hashes, settings, inline }
  }

  md.block.ruler.before('paragraph', 'obsidian_block_embed_link', (state, startLine, _endLine, silent) => {
    const start = state.bMarks[startLine] + state.tShift[startLine]
    const end = state.eMarks[startLine]
    const line = state.src.slice(start, end).trim()
    const match = line.match(/^!\[\[([\s\S]+)\]\]$/)
    if (!match) return false
    if (silent) return true
    push(state, match[1].trim(), false)
    state.line = startLine + 1
    return true
  }, { alt: ['paragraph', 'reference', 'blockquote', 'list'] })

  md.inline.ruler.before('image', 'obsidian_inline_embed_link', (state, silent) => {
    const start = state.pos
    if (!state.src.startsWith('![[', start) || state.posMax - start < 6 || silent) return false
    const end = state.src.indexOf(']]', start + 3)
    if (end <= start + 3) return false
    push(state, state.src.slice(start + 3, end).trim(), true)
    state.pos = end + 2
    return true
  })

  md.renderer.rules.obsidian_audio = (tokens, index) => {
    const { src, filename } = tokens[index].meta
    return `<audio controls="true" preload="metadata" aria-label="${escapeHtml(filename)}"><source src="${escapeHtml(src)}"></audio>`
  }
  md.renderer.rules.obsidian_video = (tokens, index) => renderers.artPlayer(tokens[index].meta.src)
  md.renderer.rules.obsidian_pdf = (tokens, index) => {
    const { src, page, height } = tokens[index].meta
    return renderers.pdf(src, page, height)
  }
  md.renderer.rules.obsidian_asset_link = (tokens, index) => {
    const { href, text } = tokens[index].meta
    return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`
  }
  md.renderer.rules.obsidian_embed_link = (tokens, index, _options, env: { sourcePath?: string, obsidianStack?: string[], obsidianPages?: Page[] }) => {
    const { filename, hashes, settings, inline } = tokens[index].meta
    const page = resolveContentPage(filename, env.sourcePath, env.obsidianPages)
    if (inline && page) return `<a class="vp-link link" href="${escapeHtml(page.route + anchor(hashes))}">${escapeHtml(linkText(page, filename, hashes, settings))}</a>`
    if (page) {
      if (env.obsidianStack?.includes(page.file)) return ''
      const content = extractHeadings(frontmatter(page.source).content, hashes)
      return content ? renderers.markdown(content, page.file, [...env.obsidianStack ?? [], page.file], env.obsidianPages ?? contentPages()) : ''
    }
    const href = `${filename.startsWith('/') ? filename : `/${filename}`}${anchor(hashes)}`
    return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(settings || `${filename}${hashes.length ? ` > ${hashes.join(' > ')}` : ''}`)}</a>`
  }
}

export const installObsidian = (
  md: MarkdownIt,
  containerPlugin: any,
  options: ObsidianOptions,
  renderers: EmbedRenderers,
) => {
  if (options === false) return
  if (enabled(options, 'wikiLink') || enabled(options, 'embedLink')) {
    md.core.ruler.before('block', 'obsidian_page_index', (state) => {
      state.env.obsidianPages ??= contentPages()
    })
  }
  if (enabled(options, 'comment')) commentPlugin(md)
  if (enabled(options, 'embedLink')) embedPlugin(md, renderers)
  if (enabled(options, 'wikiLink')) wikiPlugin(md)
  if (enabled(options, 'callout')) {
    const normalized = normalizedOptions(options)
    const callout = normalized !== false && typeof normalized.callout === 'object' ? normalized.callout : {}
    md.use(containerPlugin, 'obsidian-callout', {
      validate: (info: string) => /^obsidian-callout\s+/.test(info.trim()),
      render(tokens: any[], index: number, _options: unknown, env: { sourcePath?: string }) {
        if (tokens[index].nesting === -1) {
          tokens[index].markup = tokens[index].meta?.type ?? 'note'
          return callout.closeRender?.(tokens, index, {}, env, md.renderer) ?? (tokens[index].meta?.tag === 'details' ? '</details>\n' : '</div>\n')
        }
        const [, type = 'note', encodedTitle = ''] = tokens[index].info.trim().split(/\s+/, 3)
        const actual = calloutAlias[type] || type
        const tag = actual === 'details' ? 'details' : 'div'
        let depth = 1
        let close = index + 1
        for (; close < tokens.length; close++) {
          if (tokens[close].type === 'container_obsidian-callout_open') depth++
          if (tokens[close].type === 'container_obsidian-callout_close' && --depth === 0) break
        }
        tokens[close].meta = { tag, type }
        const custom = encodedTitle ? Buffer.from(encodedTitle, 'base64').toString() : ''
        const route = routeFromSourcePath(env.sourcePath)
        const language = languageFromPath(route)
        const locale = calloutLocales[calloutLocaleAliases[language] ?? calloutLocaleAliases[language.split('-')[0]] ?? 'en']
        const localePath = Object.keys(callout.locales ?? {}).filter(prefix => route.startsWith(prefix)).sort((left, right) => right.length - left.length)[0]
        const pluginLocalePath = Object.keys(normalized && normalized.locales || {}).filter(prefix => route.startsWith(prefix)).sort((left, right) => right.length - left.length)[0]
        const title = custom ? md.renderInline(custom) : callout.locales?.[localePath]?.[type] || normalized && normalized.locales?.[pluginLocalePath]?.[type] || locale[type as keyof typeof locale] || type[0].toUpperCase() + type.slice(1)
        const classes = [...new Set([actual, type])].join(' ')
        tokens[index].markup = type
        tokens[index].meta = { type, typeName: type, content: custom }
        const open = callout.openRender?.(tokens, index, {}, env, md.renderer) ?? `<${tag} class="hint-container ${classes}">\n`
        const heading = callout.titleRender?.(tokens, index, {}, env, md.renderer) ?? `<${tag === 'details' ? 'summary' : 'p'}${tag === 'details' ? '' : ' class="hint-container-title"'}>${title}</${tag === 'details' ? 'summary' : 'p'}>\n`
        return open + heading
      },
    })
  }
}

export const transformObsidian = (source: string, options: ObsidianOptions) => enabled(options, 'callout') ? transformCallouts(source) : source
