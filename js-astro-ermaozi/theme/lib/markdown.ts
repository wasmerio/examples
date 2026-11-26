import { attrs } from '@mdit/plugin-attrs'
import { alert as alertPlugin } from '@mdit/plugin-alert'
import { figure, type MarkdownItFigureOptions } from '@mdit/plugin-figure'
import { footnote } from '@mdit/plugin-footnote'
import { imgLazyload } from '@mdit/plugin-img-lazyload'
import { imgMark, type MarkdownItImgMarkOptions } from '@mdit/plugin-img-mark'
import { imgSize, obsidianImgSize } from '@mdit/plugin-img-size'
import * as imageSizePlugins from '@mdit/plugin-img-size'
import { katex, type MarkdownItKatexOptions } from '@mdit/plugin-katex-slim'
import { mark } from '@mdit/plugin-mark'
import { plantuml, type MarkdownItPlantumlOptions } from '@mdit/plugin-plantuml'
import { sub } from '@mdit/plugin-sub'
import { sup } from '@mdit/plugin-sup'
import { tasklist } from '@mdit/plugin-tasklist'
import { tocPlugin } from '@mdit-vue/plugin-toc'
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets'
import {
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRenderIndentGuides,
  transformerRenderWhitespace,
} from '@shikijs/transformers'
import { compileScript, compileStyleAsync, compileTemplate, parse as parseSfc } from '@vue/compiler-sfc'
import { build as buildScript } from 'esbuild'
import GithubSlugger from 'github-slugger'
import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import cjkFriendly from 'markdown-it-cjk-friendly'
import container from 'markdown-it-container'
import { full as emoji } from 'markdown-it-emoji'
import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { createHighlighter } from 'shiki'
import type { CompilerOptions } from 'typescript'
import { siteConfig } from '../../site.config.mjs'
import { defaultFile, defaultFolder, definitions, getFileIconName, getFileIconTypeFromExtension } from './file-icons.ts'
import { iconifySvg } from './iconify.ts'
import { encryptContent } from './encryption.ts'
import { globalAdminCredentials } from './encrypt-policy.ts'
import { installObsidian, resolveContentPage, transformObsidian, type ObsidianOptions } from './obsidian.ts'
import { injectImageSizes } from './image-size.ts'
import { languageFromPath, languageFromSourcePath, localeOf, routeFromSourcePath } from './locales.ts'
import { normalMarkdownSource } from './llm-markdown.ts'
import { withBaseInHtml } from './client-utils.ts'

const debugEnvironment = process.env.DEBUG
delete process.env.DEBUG
const { defaultTwoslashOptions, transformerTwoslash } = await import('@shikijs/twoslash')
if (debugEnvironment !== undefined) process.env.DEBUG = debugEnvironment

type MathConfiguration = MarkdownItKatexOptions & {
  type?: 'katex' | 'mathjax'
  copy?: boolean
  mhchem?: boolean
  output?: 'chtml' | 'svg'
  tex?: Record<string, unknown>
  chtml?: Record<string, unknown>
  svg?: Record<string, unknown>
}
const mathConfiguration = siteConfig.markdown.math as false | MathConfiguration
if (mathConfiguration && mathConfiguration.type !== 'mathjax' && mathConfiguration.mhchem) await import('@mdit/plugin-katex-slim/mhchem')
let mathjaxPlugin: typeof import('@mdit/plugin-mathjax-slim/sync').mathjax | undefined
let mathjaxInstance: import('@mdit/plugin-mathjax-slim').MathjaxInstance<true> | null | undefined
if (mathConfiguration && mathConfiguration.type === 'mathjax') {
  const mathjax = await import('@mdit/plugin-mathjax-slim/sync')
  const { type: _type, copy: _copy, mhchem: _mhchem, ...options } = mathConfiguration
  mathjaxPlugin = mathjax.mathjax
  mathjaxInstance = mathjax.createMathjaxInstance(options)
  if (mathjaxInstance) delete (mathjaxInstance.documentOptions as { enableAssistiveMml?: boolean }).enableAssistiveMml
}

const highlighter = siteConfig.codeHighlighter === false ? null : await createHighlighter({
  themes: ['vitesse-light', 'vitesse-dark'],
  langs: ['astro', 'bash', 'css', 'diff', 'go', 'html', 'javascript', 'json', 'markdown', 'python', 'rust', 'sql', 'tsx', 'typescript', 'vue', 'yaml'],
})

type WhitespacePosition = 'all' | 'boundary' | 'leading' | 'trailing'
const highlighterOptions = siteConfig.codeHighlighter as {
  twoslash?: boolean | ({ compilerOptions?: CompilerOptions, twoslashOptions?: { compilerOptions?: CompilerOptions } } & Record<string, any>)
  whitespace?: boolean | WhitespacePosition
  renderIndentGuides?: boolean | { indent?: number | false }
  colorizedBrackets?: boolean | Parameters<typeof transformerColorizedBrackets>[0]
  lineNumbers?: boolean | number | 'disable'
}
const copyCodeOptions = (siteConfig as unknown as { copyCode?: false | true | { duration?: number, showInMobile?: boolean, locales?: Record<string, { copy?: string, copied?: string }> } }).copyCode
const copyCodeLocaleEntries = [
  [['en', 'en-US'], ['Copy code', 'Copied']],
  [['zh', 'zh-CN', 'zh-Hans'], ['复制代码', '已复制']],
  [['zh-TW', 'zh-Hant'], ['複製代碼', '已複製']],
  [['de', 'de-DE', 'de-AT'], ['Kopiere den Code.', 'Kopiert']],
  [['vi', 'vi-VN'], ['Sao chép code', 'Đã sao chép']],
  [['uk'], ['Скопіюйте код', 'Скопійовано']],
  [['ru', 'ru-RU'], ['Скопировать код', 'Скопировано']],
  [['br'], ['Copiar o código', 'Copiado']],
  [['pl', 'pl-PL'], ['Skopiuj kod', 'Skopiowane']],
  [['sk', 'sk-SK'], ['Skopíruj kód', 'Skopírované']],
  [['fr', 'fr-FR'], ['Copier le code', 'Copié']],
  [['es', 'es-ES'], ['Copiar código', 'Copiado']],
  [['ja', 'ja-JP'], ['コードをコピー', 'コピーしました']],
  [['tr', 'tr-TR'], ['Kodu kopyala', 'Kopyalandı']],
  [['ko', 'ko-KO'], ['코드 복사', '복사됨']],
  [['fi', 'fi-FI'], ['Kopioi koodi', 'Kopioitu']],
  [['hu', 'hu-HU'], ['Kód másolása', 'Másolva']],
  [['id', 'id-ID'], ['Salin kode', 'Disalin']],
  [['nl', 'nl-NL'], ['Kopieer code', 'Gekopieerd']],
] as const
const copyCodeLocales = Object.fromEntries(copyCodeLocaleEntries.flatMap(([languages, [copy, copied]]) => languages.map(language => [language, { copy, copied }]))) as Record<string, { copy: string, copied: string }>
const configuredLocale = <T>(locales: Record<string, T> | undefined, sourcePath = '') => {
  const route = routeFromSourcePath(sourcePath)
  const path = Object.keys(locales ?? {}).filter(prefix => route.startsWith(prefix)).sort((left, right) => right.length - left.length)[0]
  return locales?.[path]
}
const copyCodeLocale = (sourcePath = '') => {
  const language = languageFromSourcePath(sourcePath)
  const preset = copyCodeLocales[language] ?? copyCodeLocales[language.split('-')[0]] ?? copyCodeLocales.en
  if (typeof copyCodeOptions !== 'object') return preset
  return { ...preset, ...configuredLocale(copyCodeOptions.locales, sourcePath) }
}
const markdownPowerEnabled = siteConfig.plugins.markdownPower !== false
const configuredObsidianLocales = Object.fromEntries(Object.entries((siteConfig.markdown as { locales?: Record<string, { obsidian?: Record<string, string> }> }).locales ?? {})
  .filter((entry): entry is [string, { obsidian: Record<string, string> }] => Boolean(entry[1].obsidian))
  .map(([route, locale]) => [route, locale.obsidian]))
const configuredObsidian = markdownPowerEnabled ? (siteConfig.markdown as { obsidian?: ObsidianOptions }).obsidian ?? true : false
const obsidianOptions = (configuredObsidian && Object.keys(configuredObsidianLocales).length
  ? { ...(typeof configuredObsidian === 'object' ? configuredObsidian : {}), locales: configuredObsidianLocales }
  : configuredObsidian) as ObsidianOptions
type PlotOptions = { trigger?: 'hover' | 'click', effect?: 'mask' | 'blur' }
type CanIUseOptions = { mode?: 'embed' | 'baseline' | 'image' | string }
type NpmToPackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun' | 'deno'
type ReplOptions = { theme?: string | { light: string, dark: string }, go?: boolean, kotlin?: boolean, rust?: boolean, python?: boolean }
type CodeTreeOptions = { icon?: 'simple' | 'colored', height?: string | number }
type IncludeOptions = {
  resolvePath?: (reference: string, cwd: string | null) => string
  deep?: boolean
  useComment?: boolean
  resolveImagePath?: boolean
  resolveLinkPath?: boolean
}
type MarkdownPowerLocale = {
  common?: { copy?: string, copied?: string }
  encrypt?: Partial<{ hint: string, placeholder: string, incPwd: string, noContent: string, warningTitle: string, warningText: string }>
  obsidian?: Record<string, string>
}
type MarkdownImageOptions = {
  figure?: boolean | MarkdownItFigureOptions
  lazyload?: boolean
  mark?: boolean | MarkdownItImgMarkOptions
  size?: boolean
  legacySize?: boolean
  obsidianSize?: boolean
}
const legacyImageSize = (imageSizePlugins as unknown as { legacyImgSize: typeof imgSize }).legacyImgSize
const markdownOptions = siteConfig.markdown as {
  hint?: boolean | Record<string, unknown>
  alert?: boolean | Record<string, unknown>
  abbr?: boolean | Record<string, string>
  annotation?: boolean | Record<string, string | string[]>
  plot?: boolean | PlotOptions
  caniuse?: boolean | CanIUseOptions
  qrcode?: boolean
  include?: boolean | IncludeOptions
  npmTo?: boolean | NpmToPackageManager[] | { tabs?: NpmToPackageManager[] }
  codeTabs?: { icon?: boolean | { named?: false | string[], extensions?: false | string[] } }
  codepen?: boolean
  codeSandbox?: boolean
  jsfiddle?: boolean
  replit?: boolean
  chartjs?: boolean
  echarts?: boolean
  flowchart?: boolean
  markmap?: boolean
  plantuml?: boolean | MarkdownItPlantumlOptions[]
  mermaid?: boolean
  acfun?: boolean
  bilibili?: boolean
  youtube?: boolean
  pdf?: boolean | { pdfjsUrl?: string }
  audioReader?: boolean
  artPlayer?: boolean
  demo?: boolean
  encrypt?: boolean | { password?: string }
  codeTree?: boolean | CodeTreeOptions
  collapse?: boolean
  fileTree?: boolean | Record<string, unknown>
  timeline?: boolean
  chat?: boolean
  field?: boolean
  env?: {
    references?: Record<string, string | { href: string, title?: string }>
    abbreviations?: Record<string, string>
    annotations?: Record<string, string | string[]>
  }
  locales?: Record<string, MarkdownPowerLocale>
}
const markdownPower = (markdownPowerEnabled ? markdownOptions : {}) as typeof markdownOptions
const codeTreeOptions = typeof markdownPower.codeTree === 'object' ? markdownPower.codeTree : {}
const markdownChart = markdownOptions
const markdownImage = typeof (siteConfig.markdown as { image?: unknown }).image === 'object'
  ? (siteConfig.markdown as { image: MarkdownImageOptions }).image
  : false
const markdownEnv = markdownPower.env ?? {}
const abbreviationPresets = {
  ...markdownEnv.abbreviations,
  ...(typeof markdownPower.abbr === 'object' ? markdownPower.abbr : {}),
}
const annotationPresets = {
  ...markdownEnv.annotations,
  ...(typeof markdownPower.annotation === 'object' ? markdownPower.annotation : {}),
}
const globalPlotOptions = typeof markdownPower.plot === 'object' ? markdownPower.plot : {}
const canIUseOptions = () => markdownPower.caniuse === true ? {} : typeof markdownPower.caniuse === 'object' ? markdownPower.caniuse : false
const encryptSnippetLocales = {
  en: { hint: 'The content is encrypted, please unlock to view.', placeholder: 'Enter password', incPwd: 'Incorrect password', warningTitle: '🚨 Security Warning:', warningText: 'Your connection is not encrypted with HTTPS, posing a risk of content leakage and preventing access to encrypted content.' },
  zh: { hint: '内容已加密，请解锁后查看。', placeholder: '输入密码', incPwd: '密码错误', warningTitle: '🚨 安全警告：', warningText: '您的连接未使用HTTPS加密，存在内容泄露风险，无法访问加密内容。' },
  'zh-TW': { hint: '內容已加密，請解鎖後查看。', placeholder: '輸入密碼', incPwd: '密碼錯誤', warningTitle: '🚨 安全警告：', warningText: '您的連線未使用 HTTPS 加密，可能導致內容洩露風險，無法存取加密內容。' },
  de: { hint: 'Der Inhalt ist verschlüsselt, bitte entsperren Sie ihn, um ihn anzuzeigen.', placeholder: 'Passwort eingeben', incPwd: 'Falsches Passwort', warningTitle: '🚨 Sicherheitswarnung:', warningText: 'Ihre Verbindung ist nicht mit HTTPS verschlüsselt, was ein Risiko für Inhaltslecks darstellt und den Zugriff auf verschlüsselte Inhalte verhindert.' },
  fr: { hint: 'Le contenu est chiffré, veuillez déverrouiller pour afficher.', placeholder: 'Entrez le mot de passe', incPwd: 'Mot de passe incorrect', warningTitle: '🚨 Avertissement de sécurité :', warningText: "Votre connexion n'est pas chiffrée avec HTTPS, ce qui présente un risque de fuite de contenu et empêche l'accès au contenu chiffré." },
  ru: { hint: 'Контент зашифрован, разблокируйте для просмотра.', placeholder: 'Введите пароль', incPwd: 'Неверный пароль', warningTitle: '🚨 Предупреждение безопасности:', warningText: 'Ваше соединение не защищено HTTPS, что создает риск утечки данных и блокирует доступ к зашифрованному контенту.' },
  ja: { hint: 'コンテンツは暗号化されています。閲覧するにはロックを解除してください。', placeholder: 'パスワードを入力', incPwd: 'パスワードが間違っています', warningTitle: '🚨 セキュリティ警告:', warningText: '接続がHTTPSで暗号化されていないため、コンテンツの漏洩リスクがあり、暗号化されたコンテンツへのアクセスができません。' },
  ko: { hint: '내용이 암호화되어 있습니다. 잠금 해제 후 확인하세요.', placeholder: '비밀번호 입력', incPwd: '잘못된 비밀번호', warningTitle: '🚨 보안 경고:', warningText: '연결이 HTTPS로 암호화되지 않아 내용 유출 위험이 있으며, 암호화된 콘텐츠에 접근할 수 없습니다.' },
} as const
const markdownPowerCommonLocales = {
  en: { copy: 'Copy', copied: 'Copied' }, zh: { copy: '复制', copied: '已复制' }, 'zh-TW': { copy: '複製', copied: '已複製' },
  de: { copy: 'Kopieren', copied: 'Kopiert' }, fr: { copy: 'Copier', copied: 'Copié' }, ru: { copy: 'Копировать', copied: 'Скопировано' },
  ja: { copy: 'コピー', copied: 'コピー済み' }, ko: { copy: '복사', copied: '복사됨' },
} as const
const markdownPowerLocaleKey = (lang: string) => lang === 'zh-TW' || lang === 'zh-Hant' ? 'zh-TW' : lang.split('-')[0]
const encryptSnippetLocale = (sourcePath = '') => {
  const lang = languageFromSourcePath(sourcePath)
  const key = markdownPowerLocaleKey(lang)
  const preset = encryptSnippetLocales[key as keyof typeof encryptSnippetLocales] ?? encryptSnippetLocales.en
  const custom = configuredLocale(markdownPower.locales, sourcePath)?.encrypt ?? markdownPower.locales?.[lang]?.encrypt
  return { ...preset, ...custom }
}
const markdownPowerCommonLocale = (sourcePath = '') => {
  const lang = languageFromSourcePath(sourcePath)
  const preset = markdownPowerCommonLocales[markdownPowerLocaleKey(lang) as keyof typeof markdownPowerCommonLocales] ?? markdownPowerCommonLocales.en
  const custom = configuredLocale(markdownPower.locales, sourcePath)?.common ?? markdownPower.locales?.[lang]?.common
  return { ...preset, ...custom }
}
const codeTabIcon = (filename: string) => {
  const option = markdownPower.codeTabs?.icon
  if (option === false) return undefined
  if (!option || option === true) return getFileIconName(filename)
  const { named, extensions } = option
  const extensionIcon = getFileIconTypeFromExtension(filename)
  if (named === false && definitions.named[filename]) return undefined
  if (extensions === false && extensionIcon) return undefined
  const hasNamed = Array.isArray(named) && named.length > 0
  const hasExtensions = Array.isArray(extensions) && extensions.length > 0
  if (!hasNamed && !hasExtensions) return getFileIconName(filename)
  if (hasNamed && named.includes(filename)) return definitions.named[filename]
  if (hasExtensions && extensions.some(extension => filename.endsWith(extension))) return extensionIcon
}
const includeOptions = (): Required<IncludeOptions> | false => markdownOptions.include === false ? false : {
  resolvePath: reference => reference,
  deep: false,
  useComment: true,
  resolveImagePath: true,
  resolveLinkPath: true,
  ...(typeof markdownOptions.include === 'object' ? markdownOptions.include : {}),
}
const twoslashConfig = typeof highlighterOptions.twoslash === 'object' ? highlighterOptions.twoslash : {}
const defaultTwoslash = defaultTwoslashOptions()
const { compilerOptions: legacyTwoslashCompilerOptions, twoslashOptions: configuredTwoslashOptions = {}, floatingVue: _floatingVue, ...twoslashTransformerOptions } = twoslashConfig
const codeTransformers = [
  ...(highlighterOptions.twoslash ? [transformerTwoslash({
    ...twoslashTransformerOptions,
    explicitTrigger: twoslashTransformerOptions.explicitTrigger ?? true,
    twoslashOptions: {
      ...defaultTwoslash,
      ...configuredTwoslashOptions,
      compilerOptions: { ...defaultTwoslash.compilerOptions, ...legacyTwoslashCompilerOptions, ...configuredTwoslashOptions.compilerOptions },
    },
  })] : []),
  transformerNotationDiff(),
  transformerNotationErrorLevel(),
  transformerNotationFocus({ classActiveLine: 'has-focus', classActivePre: 'has-focused-lines' }),
  transformerNotationHighlight(),
  transformerNotationWordHighlight(),
  transformerMetaWordHighlight(),
]

const whitespacePosition = (info: string): WhitespacePosition | false => {
  if (!highlighterOptions.whitespace) return false
  if (/(?:^|\s):no-whitespace(?:\s|$)/.test(info)) return false
  const configured = typeof highlighterOptions.whitespace === 'string' ? highlighterOptions.whitespace : false
  const local = info.match(/(?:^|\s):whitespace(?:=(all|boundary|leading|trailing))?(?:\s|$)/)?.[1]
  return local as WhitespacePosition || (/(?:^|\s):whitespace(?:\s|$)/.test(info) ? configured || 'all' : configured)
}

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')

const attributes = (source: string) => Object.fromEntries(
  [...source.matchAll(/([\w:-]+)=(?:"([^"]*)"|'([^']*)'|([^\s]+))/g)]
    .map(match => [match[1], match[2] ?? match[3] ?? match[4] ?? '']),
)

const hasFlag = (source: string, flag: string) => new RegExp(`(?:^|\\s)${flag}(?:\\s|$)`).test(source)
const boolOption = (source: string, props: Record<string, string>, kebab: string, camel: string, fallback: boolean) => {
  const value = props[`:${kebab}`] ?? props[`:${camel}`] ?? props[kebab] ?? props[camel]
  if (value !== undefined) return value !== 'false'
  return hasFlag(source, kebab) || hasFlag(source, camel) || fallback
}
const parseVueLiteral = (source: string): unknown => {
  try {
    return JSON.parse(source
      .replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":')
      .replace(/'/g, '"')
      .replace(/,\s*([}\]])/g, '$1'))
  } catch {
    return undefined
  }
}
const parseTableHighlight = (source: string) => {
  const result: Record<number, string> = {}
  for (const item of source.split(';')) {
    const [className, positions = '1'] = item.split(':')
    for (const position of positions.split(',')) {
      const index = Number(position.trim())
      if (className?.trim() && Number.isInteger(index) && index > 0) result[index] = className.trim()
    }
  }
  return result
}
const parseTableCells = (source: string) => {
  const result: Record<number, Record<number, string>> = {}
  for (const item of source.split(';')) {
    const [className, positions = ''] = item.split(':')
    for (const match of positions.matchAll(/\(\s*(\d+)\s*,\s*(\d+)\s*\)/g)) {
      const row = Number(match[1])
      const column = Number(match[2])
      if (!className?.trim() || row < 1 || column < 1) continue
      result[row] ??= {}
      result[row][column] = className.trim()
    }
  }
  return result
}
const cssSize = (value: string | undefined, fallback = '') => {
  if (!value) return fallback
  if (/^-?(?:\d+|\d*\.\d+)$/.test(value)) return `${value}px`
  return /^-?(?:\d+|\d*\.\d+)(?:px|rem|em|%|vh|vw|vmin|vmax|ch|ex)$/.test(value) ? value : fallback
}
const rectSize = (value: string) => Number.parseFloat(value) === Number(value) ? `${value}px` : value

type IconProvider = 'iconify' | 'iconfont' | 'fontawesome'
type IconOptions = {
  provider?: IconProvider
  prefix?: string
  size?: string | number
  color?: string
}

const iconOptions = () => ((siteConfig.markdown as { icon?: IconOptions }).icon ?? {})
const iconSize = (value: string | number | undefined) => {
  if (value === undefined || value === '') return {}
  const [width, height] = String(value).replaceAll('px', '[UNIT]').split('x').map((part) => {
    const restored = part.replaceAll('[UNIT]', 'px').trim()
    return String(Number(restored)) === restored ? `${restored}px` : restored
  })
  return { width, height: height || width }
}
const iconExtraAttrs = (props: Record<string, string>) => Object.entries(props)
  .filter(([name]) => /^(?:aria-|data-)[\w:-]+$/.test(name) || /^(?:id|title|role|tabindex)$/.test(name))
  .map(([name, value]) => ` ${name}="${escapeHtml(value)}"`)
  .join('')

const renderIcon = (source: string) => {
  const options = iconOptions()
  if (source.trim()[0] === '{') {
    try {
      const icon = JSON.parse(source)
      if (typeof icon?.svg === 'string') return `<span class="vp-icon is-svg" aria-hidden="true">${icon.svg}</span>`
    } catch {}
  }
  let provider: IconProvider = options.provider ?? 'iconify'
  source = source.replace(/^(iconify|iconfont|fontawesome)\s+/, (_match, value: IconProvider) => {
    provider = value
    return ''
  })
  let size = options.size
  let color = options.color
  source = source
    .replace(/(?:^|\s)=([^\s]+)(?=\s|$)/, (_match, value) => { size = value; return '' })
    .replace(/(?:^|\s)\/([^\s]+)(?=\s|$)/, (_match, value) => { color = value; return '' })
    .trim()
  const separator = source.indexOf(' ')
  let name = separator < 0 ? source : source.slice(0, separator)
  const extra = separator < 0 ? '' : source.slice(separator + 1)
  if (!name) return ''
  const rect = iconSize(size)
  const extraProps = attributes(extra)
  const flags = extra
    .replace(/([\w:-]+)=(?:"[^"]*"|'[^']*'|[^\s]+)/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  const customClasses = extraProps.class?.split(/\s+/).filter(Boolean) ?? []
  const style = [color ? `color:${escapeHtml(color)}` : '', rect.width ? `width:${rect.width}` : '', rect.height ? `height:${rect.height}` : '', extraProps.style || ''].filter(Boolean).join(';')
  const styleAttr = style ? ` style="${style}"` : ''
  if (/^(?:https?:)?\/\//.test(name) || name.startsWith('/')) {
    return `<span class="vp-icon-img" aria-hidden="true"><img src="${escapeHtml(name)}" alt=""${rect.height ? ` style="height:${rect.height}"` : ''}></span>`
  }
  if (provider === 'iconfont') {
    const prefix = options.provider === 'iconfont' ? options.prefix : undefined
    const fontStyle = [color ? `color:${escapeHtml(color)}` : '', `font-size:${rect.height || '1em'}`, extraProps.style || ''].filter(Boolean).join(';')
    return `<i class="vp-icon ${escapeHtml(`${prefix || 'iconfont icon-'}${name}`)}${customClasses.length ? ` ${escapeHtml(customClasses.join(' '))}` : ''}" data-provider="iconfont" aria-hidden="true" style="${fontStyle}"${iconExtraAttrs(extraProps)}></i>`
  }
  if (provider === 'fontawesome') {
    const aliases: Record<string, string> = { fas: 'solid', s: 'solid', far: 'regular', r: 'regular', fal: 'light', l: 'light', fat: 'thin', t: 'thin', fads: 'duotone solid', ds: 'duotone solid', fass: 'sharp solid', ss: 'sharp solid', fasr: 'sharp regular', sr: 'sharp regular', fasl: 'sharp light', sl: 'sharp light', fast: 'sharp thin', st: 'sharp thin', fasds: 'sharp-duotone solid', sds: 'sharp-duotone solid', fab: 'brands', b: 'brands' }
    const [type, icon = type] = name.includes(':') ? name.split(':', 2) : [options.provider === 'fontawesome' ? options.prefix || 'fas' : 'fas', name]
    const family = aliases[type] ?? 'solid'
    const extraClasses = flags.map(value => value.startsWith('fa-') ? value : `fa-${value}`)
    const classes = [...family.split(' ').map(value => `fa-${value}`), `fa-${icon}`, ...extraClasses, ...customClasses].join(' ')
    return `<i class="vp-icon fontawesome ${escapeHtml(classes)}" data-provider="fontawesome" aria-hidden="true"${styleAttr}${iconExtraAttrs(extraProps)}></i>`
  }
  if (!name.includes(':') && options.provider === 'iconify' && options.prefix) name = `${options.prefix}:${name}`
  const svg = iconifySvg(name)
  const extraClasses = [...flags, ...customClasses].join(' ')
  return `<span class="vp-icon iconify${extraClasses ? ` ${escapeHtml(extraClasses)}` : ''}" data-provider="iconify"${svg ? '' : ` data-iconify-remote="${escapeHtml(name)}"`}${styleAttr}${iconExtraAttrs(extraProps)}>${svg}</span>`
}

const iconPlugin = (md: MarkdownIt) => {
  const rule = (deprecated = false) => (state: any, silent: boolean) => {
    const start = state.pos
    const open = deprecated ? ':[' : '::'
    const close = deprecated ? ']:' : '::'
    if (!state.src.startsWith(open, start)) return false
    const next = state.src[start + 2]
    if (!deprecated && (next === ' ' || next === ':')) return false
    const end = state.src.indexOf(close, start + 2)
    if (end < start + 3 || state.src[end - 1] === ' ') return false
    if (silent) return false
    const token = state.push('plume_icon', 'i', 0)
    token.content = state.src.slice(start + 2, end)
    token.meta = { deprecated }
    state.pos = end + 2
    return true
  }
  md.inline.ruler.before('link', 'plume_icon', rule())
  md.inline.ruler.before('link', 'plume_icon_deprecated', rule(true))
  md.renderer.rules.plume_icon = (tokens: any[], index: number) => {
    const token = tokens[index]
    if (!token.meta?.deprecated) return renderIcon(token.content)
    const [name, option = ''] = token.content.split(' ')
    const [size, color] = option.split('/')
    return renderIcon(`${name}${size ? ` =${size}` : ''}${color ? ` /${color}` : ''}`)
  }
}

const iconComponents = (source: string) => {
  let fence = ''
  return source.split('\n').map(line => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1]
    if (marker) {
      if (!fence) fence = marker[0]
      else if (fence === marker[0]) fence = ''
      return line
    }
    if (fence) return line
    return line.replace(/<(?:VPIcon|Icon)\b([^>]*?)\s*\/>/gi, (_match, raw: string) => {
      const props = attributes(raw)
      if (!props.name) return _match
      const forwarded = Object.entries(props)
        .filter(([name]) => /^(?:class|style|id|title|role|tabindex)$/.test(name) || /^(?:aria-|data-)[\w:-]+$/.test(name))
        .map(([name, value]) => `${name}="${value}"`)
        .join(' ')
      return renderIcon(`${props.provider ? `${props.provider} ` : ''}${props.name}${props.extra ? ` ${props.extra}` : ''}${props.size ? ` =${props.size}` : ''}${props.color ? ` /${props.color}` : ''}${forwarded ? ` ${forwarded}` : ''}`)
    })
  }).join('\n')
}

const linkComponents = (source: string, sourcePath?: string) => {
  const routeHint = routeFromSourcePath(sourcePath)
  const openNewWindowText = escapeHtml(localeOf(languageFromPath(routeHint)).openNewWindowText)
  const renderLink = (raw: string, body = '') => {
    const props = attributes(raw)
    const href = props.href ?? ''
    const external = props.target === '_blank' || /^(?:[a-z]+:)?\/\//i.test(href)
    const tag = ['a', 'span'].includes(props.tag) ? props.tag : href ? 'a' : 'span'
    const text = body || props.text || href
    const noIcon = hasFlag(raw, 'no-icon') || hasFlag(raw, 'noIcon') || props['no-icon'] === 'true' || props.noIcon === 'true'
    return `<${tag} class="vp-link${href ? ' link' : ''}${noIcon ? ' no-icon' : ''}${external ? ' vp-external-link-icon' : ''}"${href ? ` href="${escapeHtml(href)}"` : ''}${props.target || external ? ` target="${escapeHtml(props.target || '_blank')}"` : ''}${props.rel || external ? ` rel="${escapeHtml(props.rel || 'noopener noreferrer')}"` : ''}>${text}${external && !noIcon ? `<span class="visually-hidden">${openNewWindowText}</span>` : ''}</${tag}>`
  }
  const renderButton = (raw: string, body = '') => {
    const props = attributes(raw)
    const href = props.href ?? ''
    const external = props.target === '_blank' || /^(?:[a-z]+:)?\/\//i.test(href)
    const tag = ['a', 'button'].includes(props.tag) ? props.tag : href ? 'a' : 'button'
    const icon = props.icon ? renderIcon(props.icon) : ''
    const suffix = props.suffixIcon || props['suffix-icon'] ? renderIcon(props.suffixIcon || props['suffix-icon']) : ''
    return `<${tag} class="vp-button ${['medium', 'big'].includes(props.size) ? props.size : 'medium'} ${['brand', 'alt', 'sponsor'].includes(props.theme) ? props.theme : 'brand'}"${href ? ` href="${escapeHtml(href)}"` : ''}${tag === 'button' ? ' type="button"' : ''}${props.target || external ? ` target="${escapeHtml(props.target || '_blank')}"` : ''}${props.rel || external ? ` rel="${escapeHtml(props.rel || 'noopener noreferrer')}"` : ''}><span class="button-content">${icon}<span>${body || props.text || ''}</span>${external ? `<span class="visually-hidden">${openNewWindowText}</span>` : ''}${suffix}</span></${tag}>`
  }
  let fence = ''
  return source.split('\n').map(line => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1]
    if (marker) {
      if (!fence) fence = marker[0]
      else if (fence === marker[0]) fence = ''
      return line
    }
    if (fence) return line
    return line
      .replace(/<VPButton\b([^>]*?)>(.*?)<\/VPButton>/gi, (_match, raw: string, body: string) => renderButton(raw, body))
      .replace(/<VPButton\b([^>]*?)\s*\/>/gi, (_match, raw: string) => renderButton(raw))
      .replace(/<VPLink\b([^>]*?)>(.*?)<\/VPLink>/gi, (_match, raw: string, body: string) => renderLink(raw, body))
      .replace(/<VPLink\b([^>]*?)\s*\/>/gi, (_match, raw: string) => renderLink(raw))
  }).join('\n')
}

const selectLines = (source: string, ranges = '') => {
  if (!ranges) return source
  const lines = source.split('\n')
  const selected: string[] = []
  for (const part of ranges.split(',').map(value => value.trim()).filter(Boolean)) {
    const [rawStart, rawEnd] = part.split('-', 2)
    const start = rawStart ? Number(rawStart) : 1
    const end = rawEnd === undefined ? start : rawEnd ? Number(rawEnd) : lines.length
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start) continue
    selected.push(...lines.slice(start - 1, end))
  }
  return selected.join('\n')
}

const regionMarkers = [
  /^\/\/ ?#?(?<tag>(?:end)?region) (?<name>[\w*-]+)$/,
  /^\/\* ?#(?<tag>(?:end)?region) (?<name>[\w*-]+) ?\*\/$/,
  /^#pragma (?<tag>(?:end)?region) (?<name>[\w*-]+)$/,
  /^<!-- #?(?<tag>(?:end)?region) (?<name>[\w*-]+) -->$/,
  /^#(?<tag>(?:End )Region) (?<name>[\w*-]+)$/,
  /^::#(?<tag>(?:end)region) (?<name>[\w*-]+)$/,
  /^# ?(?<tag>(?:end)?region) (?<name>[\w*-]+)$/,
]

const regionMarker = (line: string, pattern: RegExp, name: string, end = false) => {
  const match = pattern.exec(line.trim())
  return match?.groups?.name === name && (end ? /^[Ee]nd ?[rR]egion$/.test(match.groups.tag) : /^[rR]egion$/.test(match.groups.tag))
}

const selectRegion = (source: string, region = '') => {
  if (!region) return source
  const lines = source.split('\n')
  let pattern: RegExp | undefined
  let first = -1
  for (let index = 0; index < lines.length && !pattern; index++) {
    pattern = regionMarkers.find(candidate => regionMarker(lines[index], candidate, region))
    if (pattern) first = index + 1
  }
  if (!pattern) return ''
  const last = lines.findIndex((line, index) => index >= first && regionMarker(line, pattern!, region, true))
  return last < 0 ? '' : lines.slice(first, last).join('\n')
}

const parseFileReference = (raw: string) => {
  const range = raw.match(/\{([\d,\-\s]+)\}\s*$/)?.[1] ?? ''
  const withoutRange = range ? raw.slice(0, raw.lastIndexOf('{')).trim() : raw.trim()
  const hash = withoutRange.lastIndexOf('#')
  return {
    file: hash > 0 ? withoutRange.slice(0, hash) : withoutRange,
    region: hash > 0 ? withoutRange.slice(hash + 1) : '',
    range,
  }
}

const resolveContentFile = (reference: string, sourcePath?: string) => {
  const resolved = path.resolve(sourcePath ? path.dirname(sourcePath) : process.cwd(), reference)
  const relative = path.relative(process.cwd(), resolved)
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`Markdown import escapes the project root: ${reference}`)
  return resolved
}

const dedent = (source: string) => {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const indentation = Math.min(...lines.filter(line => line.trim()).map(line => line.match(/^ */)?.[0].length ?? 0))
  return Number.isFinite(indentation) && indentation > 0 ? lines.map(line => line.slice(indentation)).join('\n') : lines.join('\n')
}

const stripIncludedFrontmatter = (source: string) => {
  const lines = source.split('\n')
  if (lines[0] !== '---') return source
  const end = lines.findIndex((line, index) => index > 0 && line === '---')
  return lines.slice(Math.max(end + 1, 1)).join('\n')
}

const unsupportedCodeTreeTypes = new Set([
  'jpg', 'jpeg', 'png', 'gif', 'avif', 'webp',
  'mp3', 'mp4', 'ogg', 'm3u8', 'm3u', 'flv', 'webm', 'wav', 'flac', 'aac',
  'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx',
])

const codeTreeDirectory = (reference: string, sourcePath?: string) => {
  const base = reference.startsWith('/')
    ? path.resolve(process.cwd(), 'content')
    : sourcePath ? path.dirname(sourcePath) : process.cwd()
  const resolved = path.resolve(base, reference.replace(/^\/+/, ''))
  const relative = path.relative(process.cwd(), resolved)
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`Code tree directory escapes the project root: ${reference}`)
  return resolved
}

const codeTreeFiles = async (root: string, directory = root): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name, 'en'))) {
    if (entry.name === 'node_modules' || entry.name === '.DS_Store' || entry.name === '.gitkeep') continue
    const filepath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await codeTreeFiles(root, filepath))
    else if (entry.isFile()) files.push(path.relative(root, filepath).split(path.sep).join('/'))
  }
  return files.sort((left, right) => right.split('/').length - left.split('/').length || left.localeCompare(right, 'en'))
}

const codeTreeFence = (source: string) => '~'.repeat(Math.max(3, Math.max(0, ...[...source.matchAll(/~+/g)].map(match => match[0].length)) + 1))

type NpmCommand = { cli: string, flags?: Record<string, string> }
type NpmCommandConfig = { pattern: RegExp } & Partial<Record<Exclude<NpmToPackageManager, 'npm'>, NpmCommand | false>>
type ParsedNpmLine = { env: string, cli: string, cmd: string, args?: string, scriptArgs?: string }

const npmManagers: NpmToPackageManager[] = ['npm', 'pnpm', 'yarn', 'bun', 'deno']
const npmDefaultTabs: NpmToPackageManager[] = ['npm', 'pnpm', 'yarn']
const npmBooleanFlags = ['--no-save', '-B', '--save-bundle', '--save-dev', '-D', '--save-prod', '-P', '--save-peer', '-O', '--save-optional', '-E', '--save-exact', '-y', '--yes', '-g', '--global']
const npmCommands: NpmCommandConfig[] = [
  { pattern: /(?:^|\s)npm\s+(?:install|i)$/, pnpm: { cli: 'pnpm install' }, yarn: { cli: 'yarn' }, bun: { cli: 'bun install' }, deno: { cli: 'deno install' } },
  {
    pattern: /(?:^|\s)npm\s+(?:install|i|add)(?:\s|$)/,
    pnpm: { cli: 'pnpm add', flags: { '--no-save': '', '-B': '', '--save-bundle': '' } },
    yarn: { cli: 'yarn add', flags: { '--save-dev': '--dev', '--save-prod': '--prod', '-P': '', '--save-peer': '--peer', '--save-optional': '--optional', '--no-save': '', '--save-exact': '--exact', '-B': '', '--save-bundle': '' } },
    bun: { cli: 'bun add', flags: { '--save-dev': '--development', '-P': '', '--save-prod': '', '--save-peer': '', '-O': '--optional', '--save-optional': '--optional', '--no-save': '', '--save-exact': '--exact', '-B': '', '--save-bundle': '' } },
    deno: { cli: 'deno add', flags: { '-g': '', '--global': '', '--save-dev': '--dev', '-P': '', '--save-prod': '', '--save-peer': '', '-O': '', '--save-optional': '', '--no-save': '', '-E': '', '--save-exact': '', '-B': '', '--save-bundle': '' } },
  },
  {
    pattern: /(?:^|\s)npm\s+(?:run|run-script|rum|urn)(?:\s|$)/,
    pnpm: { cli: 'pnpm', flags: { '-w': '-F', '--workspace': '--filter', '--': '' } },
    yarn: { cli: 'yarn', flags: { '-w': '', '--workspace': '' } },
    bun: { cli: 'bun run', flags: { '-w': '--filter', '--workspace': '--filter' } },
    deno: { cli: 'deno run', flags: { '-w': '', '--workspace': '' } },
  },
  { pattern: /(?:^|\s)npm\s+create\s/, pnpm: { cli: 'pnpm create', flags: { '-y': '', '--yes': '' } }, yarn: { cli: 'yarn create', flags: { '-y': '', '--yes': '' } }, bun: { cli: 'bun create', flags: { '-y': '', '--yes': '' } }, deno: { cli: 'deno run -A ', flags: { '-y': '', '--yes': '' } } },
  { pattern: /(?:^|\s)npm\s+init/, pnpm: { cli: 'pnpm init', flags: { '-y': '', '--yes': '' } }, yarn: { cli: 'yarn init', flags: { '-y': '', '--yes': '' } }, bun: { cli: 'bun init', flags: { '-y': '', '--yes': '' } }, deno: { cli: 'deno init', flags: { '-y': '', '--yes': '' } } },
  { pattern: /(?:^|\s)npx\s+/, pnpm: { cli: 'pnpm dlx' }, yarn: { cli: 'yarn dlx' }, bun: { cli: 'bunx' }, deno: { cli: 'deno run -A' } },
  {
    pattern: /(?:^|\s)npm\s+(?:uninstall|r|rm|remove|unlink|un)(?:\s|$)/,
    pnpm: { cli: 'pnpm remove', flags: { '--no-save': '', '--save': '', '-S': '' } },
    yarn: { cli: 'yarn remove', flags: { '--save-dev': '--dev', '--save': '', '-S': '', '-g': '', '--global': '' } },
    bun: { cli: 'bun remove', flags: { '--save-dev': '--development', '--save': '', '-S': '', '-g': '', '--global': '' } },
    deno: { cli: 'deno uninstall', flags: { '--save-dev': '--dev', '--save': '', '-S': '' } },
  },
  { pattern: /(?:^|\s)npm\s+ci$/, pnpm: { cli: 'pnpm install --frozen-lockfile' }, yarn: { cli: 'yarn install --immutable' }, bun: { cli: 'bun install --frozen-lockfile' }, deno: { cli: 'deno install --frozen' } },
]

const parseNpmArgs = (source: string) => {
  const [npmArgs, scriptArgs] = source.trim().split(/\s+--\s+/)
  let cmd = ''
  let args = ''
  if (npmArgs[0] !== '-') {
    if (npmArgs[0] === '"' || npmArgs[0] === "'") {
      const index = npmArgs.slice(1).indexOf(npmArgs[0])
      cmd = npmArgs.slice(0, index + 2)
      args = npmArgs.slice(index + 2)
    } else {
      const index = npmArgs.indexOf(' -')
      if (index === -1) cmd = npmArgs
      else {
        cmd = npmArgs.slice(0, index)
        args = npmArgs.slice(index + 1)
      }
    }
  } else {
    let output = ''
    let value = ''
    let quote = ''
    let quoted = false
    let nextValue = false
    for (let index = 0; index < npmArgs.length; index++) {
      const character = npmArgs[index]
      if (!quoted && (character === '"' || character === "'")) {
        quote = character
        quoted = true
        value += character
      } else if (quoted && character === quote) {
        quoted = false
        value += character
      } else if ((character === ' ' || character === '=' || index === npmArgs.length - 1) && !quoted && value) {
        if (index === npmArgs.length - 1) value += character
        const key = value[0] === '-'
        if (key) nextValue = !npmBooleanFlags.includes(value)
        if (!key && !nextValue) cmd += ` ${value}`
        else {
          output += `${value}${index !== npmArgs.length - 1 ? character : ''}`
          if (!key && nextValue) nextValue = false
        }
        value = ''
      } else value += character
    }
    args = output
  }
  return { cmd: cmd.trim(), args: args.trim(), scriptArgs }
}

const parseNpmLine = (line: string): ParsedNpmLine | false => {
  const match = line.match(/(.*)(npm|npx)\s+(.*)/)
  if (!match) return false
  const [, env, cli, rest] = match
  const index = rest.trim().indexOf(' ')
  if (cli === 'npx') return index === -1
    ? { env, cli, cmd: rest, scriptArgs: '' }
    : { env, cli, cmd: rest.slice(0, index), scriptArgs: rest.slice(index + 1).trim() }
  if (index === -1) return { env, cli: `${cli} ${rest.trim()}`, cmd: '' }
  return { env, cli: `${cli} ${rest.slice(0, index)}`, ...parseNpmArgs(rest.slice(index + 1)) }
}

const npmTabs = (requested: NpmToPackageManager[]) => {
  const tabs = requested.filter(tab => npmManagers.includes(tab))
  return tabs.length ? tabs : npmDefaultTabs
}

const renderNpmTo = (lines: string[], info: string, requested: NpmToPackageManager[]) => {
  const tabs = npmTabs(requested)
  const parsed = new Map<string, ParsedNpmLine | false>()
  const groups = tabs.map(tab => {
    const commands = lines.map(line => {
      const config = npmCommands.find(item => item.pattern.test(line))
      const manager = tab === 'npm' ? undefined : config?.[tab]
      if (!manager) return line
      const command = parsed.has(line) ? parsed.get(line) : parseNpmLine(line)
      parsed.set(line, command ?? false)
      if (!command) return line
      let result = `${command.env ? `${command.env} ` : ''}${manager.cli}`
      if (command.args && manager.flags) {
        let args = command.args
        for (const [key, value] of Object.entries(manager.flags)) args = args.replaceAll(key, value)
        result += ` ${args.replace(/\s+-/g, ' -').trim()}`
      }
      if (command.cmd) result += ` ${command.cmd}`
      if (command.scriptArgs) result += ` ${command.scriptArgs}`
      return result.trim()
    })
    return `@tab ${tab}\n\`\`\`${info}\n${commands.join('')}\n\`\`\``
  })
  return `::: code-tabs#npm-to-${tabs.join('-')}\n${groups.join('\n')}\n:::`
}

const npmToContainers = (source: string) => {
  const configured = markdownPower.npmTo
  if (!configured) return source
  const defaultTabs = Array.isArray(configured) ? configured : typeof configured === 'object' ? configured.tabs ?? npmDefaultTabs : npmDefaultTabs
  const lines = source.split('\n')
  const output: string[] = []
  let fence = ''
  for (let index = 0; index < lines.length; index++) {
    const marker = lines[index].match(/^\s*(`{3,}|~{3,})/)?.[1]
    if (marker) {
      if (!fence) fence = marker[0]
      else if (fence === marker[0]) fence = ''
      output.push(lines[index])
      continue
    }
    if (fence) {
      output.push(lines[index])
      continue
    }
    const open = lines[index].match(/^\s*(:{3,})\s*npm-to(?:\s+(.*))?$/)
    if (!open) {
      output.push(lines[index])
      continue
    }
    const body: string[] = []
    while (++index < lines.length && !new RegExp(`^\\s*${open[1]}\\s*$`).test(lines[index])) body.push(lines[index])
    const first = body.findIndex(line => line.trim())
    const fenceOpen = first >= 0 ? body[first].match(/^\s*(`{3,}|~{3,})(.*)$/) : undefined
    const close = fenceOpen ? body.findIndex((line, cursor) => cursor > first && line.trim() === fenceOpen[1]) : -1
    if (!fenceOpen || close < 0) {
      output.push(...body)
      continue
    }
    const props = attributes(open[2] ?? '')
    const tabs = (props.tabs ? props.tabs.split(/,\s*/) : defaultTabs) as NpmToPackageManager[]
    const commands = body.slice(first + 1, close).join('\n').split(/(\n|\s*&&\s*)/)
    output.push(...body.slice(0, first), renderNpmTo(commands, fenceOpen[2].trim(), tabs), ...body.slice(close + 1))
  }
  return output.join('\n')
}

const includeDirective = (line: string, options: Required<IncludeOptions>) => options.useComment
  ? line.match(/^( *)<!-{2,}\s*@include:\s*(.+?)\s*-{2,}>\s*$/)
  : line.match(/^( *)@include:\s*(.+?)\s*$/)

const markdownBlockLine = (line: string) => {
  const quote = line.match(/^((?:[ \t]*>[ \t]*)*)/)?.[1] ?? ''
  const remainder = line.slice(quote.length)
  const list = remainder.match(/^([ \t]*)((?:[-+*]|\d+[.)])([ \t]+))(.*)$/)
  if (list) return { content: list[4], firstPrefix: `${quote}${list[1]}${list[2]}`, continuationPrefix: `${quote}${list[1]}${' '.repeat(list[2].length)}` }
  const indent = remainder.match(/^[ \t]*/)?.[0] ?? ''
  return { content: remainder.slice(indent.length), firstPrefix: `${quote}${indent}`, continuationPrefix: `${quote}${indent}` }
}

const expandFileDirectives = async (source: string, sourcePath?: string, stack: string[] = [], allowInclude = true): Promise<string> => {
  const lines = source.split('\n')
  const output: string[] = []
  let fence = ''
  for (const line of lines) {
    const block = markdownBlockLine(line)
    const marker = block.content.match(/^(`{3,}|~{3,})/)?.[1]
    if (marker && (!fence || block.content.slice(marker.length).trim() === '')) {
      if (!fence) fence = marker
      else if (fence[0] === marker[0] && marker.length >= fence.length) fence = ''
      output.push(line)
      continue
    }
    if (fence) {
      output.push(line)
      continue
    }
    const codeTree = block.content.match(/^@\[code-tree(?:\s+([^\]]*))?\]\(([^)]*)\)$/)
    if (codeTree) {
      const info = codeTree[1]?.trim() ?? ''
      const root = codeTreeDirectory(codeTree[2].trim(), sourcePath)
      const files = await codeTreeFiles(root)
      const blocks = await Promise.all(files.map(async filename => {
        const extension = path.extname(filename).slice(1).toLowerCase()
        const quote = filename.includes('"') && !filename.includes("'") ? "'" : '"'
        const title = filename.replaceAll(quote, '')
        if (unsupportedCodeTreeTypes.has(extension)) return `~~~text title=${quote}${title}${quote} :tree-only\n~~~`
        const content = await readFile(path.join(root, filename), 'utf8')
        const marker = codeTreeFence(content)
        return `${marker}${extension || 'txt'} title=${quote}${title}${quote}\n${content}\n${marker}`
      }))
      const expanded = `::: code-tree${info ? ` ${info}` : ''}\n${blocks.filter(Boolean).join('\n\n')}\n:::`
      output.push(expanded.split('\n').map((value, index) => `${index ? block.continuationPrefix : block.firstPrefix}${value}`).join('\n'))
      continue
    }
    const settings = includeOptions()
    const include = allowInclude && settings ? includeDirective(line, settings) : null
    if (include && settings) {
      const reference = parseFileReference(include[2])
      const cwd = sourcePath ? path.dirname(sourcePath) : null
      const file = resolveContentFile(settings.resolvePath(reference.file, cwd), sourcePath)
      if (stack.includes(file)) throw new Error(`Circular Markdown include: ${[...stack, file].join(' -> ')}`)
      let content = ''
      try {
        content = await readFile(file, 'utf8')
      } catch {
        output.push(`${include[1]}File not found`)
        continue
      }
      let included = selectRegion(content, reference.region)
      included = selectLines(included, reference.range)
      if (!reference.region && !reference.range) included = stripIncludedFrontmatter(included)
      included = dedent(included).replace(/\n?$/, '\n')
      included = await expandFileDirectives(included, file, [...stack, file], settings.deep)
      if (file.endsWith('.md') && (settings.resolveImagePath || settings.resolveLinkPath)) {
        included = `<!-- #include-env-start: ${path.dirname(file)} -->\n${included}\n<!-- #include-env-end -->`
      }
      output.push(included.split('\n').map(value => `${include[1]}${value}`).join('\n'))
      continue
    }
    const code = line.match(/^( *)@\[code(?:\{(?:(?:(\d+)?-(\d+)?)|(\d+))\})?(?:\s+([^\]]+))?\]\(([^)]*)\)/)
    if (code) {
      const reference = code[6]
      let imported = 'File not found'
      try {
        const file = resolveContentFile(reference, sourcePath)
        imported = await readFile(file, 'utf8')
      } catch {}
      const range = code[4] || code[2] || code[3] ? code[4] || `${code[2] ?? ''}-${code[3] ?? ''}` : ''
      imported = selectLines(imported, range).replace(/\n?$/, '\n')
      const info = code[5]?.trim() || path.extname(reference).slice(1)
      output.push(`${code[1]}\`\`\`${info}\n${imported.slice(0, -1).split('\n').map(value => `${code[1]}${value}`).join('\n')}\n${code[1]}\`\`\``)
      continue
    }
    output.push(line)
  }
  return output.join('\n')
}

type FileTreeNode = {
  filename: string
  comment: string
  focus: boolean
  expanded: boolean
  type: 'folder' | 'file'
  diff?: 'add' | 'remove'
  generated?: boolean
  level: number
  children: FileTreeNode[]
}

const parseFileTreeNodeInfo = (source: string) => {
  let info = source.trim()
  let diff: FileTreeNode['diff']
  if (info.startsWith('++')) {
    diff = 'add'
    info = info.slice(2).trim()
  } else if (info.startsWith('--')) {
    diff = 'remove'
    info = info.slice(2).trim()
  }
  const focused = info.match(/^\*\*(.*?)\*\*(?:$|\s+)/)
  const sharp = info.indexOf('#')
  let filename = focused?.[1] ?? info.slice(0, sharp < 0 ? info.length : sharp).trim()
  const comment = (focused ? info.slice(focused[0].length) : sharp < 0 ? '' : info.slice(sharp)).trim()
  const folder = filename.endsWith('/')
  if (folder) filename = filename.slice(0, -1)
  return { filename, comment, focus: Boolean(focused), expanded: !folder, type: folder ? 'folder' as const : 'file' as const, diff }
}

type FileTreeIconMode = 'simple' | 'colored'
const fileTreeIcon = (filename: string, type: 'folder' | 'file', mode: FileTreeIconMode) => {
  const fallback = type === 'folder' ? defaultFolder : defaultFile
  const icon = mode === 'simple' ? fallback : getFileIconName(filename, type) ?? fallback
  return iconifySvg(icon)
}

const renderFileTreeIcon = (filename: string, type: 'folder' | 'file', mode: FileTreeIconMode) => filename === '…' || filename === '...'
  ? ''
  : `<span class="file-tree-icon vp-icon is-svg" aria-hidden="true">${fileTreeIcon(filename, type, mode)}</span>`

const parseFileTreeFence = (source: string) => {
  const root: FileTreeNode = { filename: '', comment: '', focus: false, expanded: true, type: 'folder', level: -1, children: [] }
  const stack = [root]
  const lines = source.trimEnd().split('\n')
  const start = lines[0]?.trim() === '.' ? 1 : 0
  for (let index = start; index < lines.length; index++) {
    const match = lines[index].match(/^((?:│ {3}| {4})*)[├└]── (.+)$/u)
    if (!match) continue
    const level = match[1].length / 4
    while (stack.at(-1)!.level >= level) stack.pop()
    const parent = stack.at(-1)!
    if (parent !== root) parent.type = 'folder'
    const node: FileTreeNode = { ...parseFileTreeNodeInfo(match[2]), level, children: [] }
    parent.children.push(node)
    stack.push(node)
  }
  return root.children
}

const renderFileTreeNodes = (nodes: FileTreeNode[], mode: FileTreeIconMode, renderInline: (source: string) => string): string => nodes.map(node => {
  const folder = node.children.length > 0 || node.type === 'folder'
  const expanded = folder && node.expanded
  const classes = [folder ? 'folder' : 'file', node.focus ? 'focus' : '', node.diff ?? '', node.diff ? 'diff' : '', expanded ? 'expanded' : ''].filter(Boolean).join(' ')
  const comment = node.comment ? `<span class="comment">${renderInline(node.comment.replaceAll('#', '\\#'))}</span>` : ''
  const children: string = folder ? `<div class="group">${node.children.length ? renderFileTreeNodes(node.children, mode, renderInline) : renderFileTreeNodes([{ filename: '…', comment: '', focus: false, expanded: false, type: 'file', level: node.level + 1, children: [], generated: true }], mode, renderInline)}</div>` : ''
  return `<div class="vp-file-tree-node${node.generated ? ' generated' : ''}"><p class="vp-file-tree-info ${classes}" style="--file-tree-level:${-node.level}"${folder ? ' role="button" tabindex="0" aria-expanded="' + expanded + '"' : ''}>${renderFileTreeIcon(node.filename, folder ? 'folder' : 'file', mode)}<span class="name ${folder ? 'folder' : 'file'}">${escapeHtml(node.filename)}</span>${comment}</p>${children}</div>`
}).join('')

const parseCodeTreeNodes = (paths: string[]) => {
  const root: FileTreeNode = { filename: '', comment: '', focus: false, expanded: true, type: 'folder', level: -1, children: [] }
  for (const path of paths) {
    let parent = root
    const parts = path.replace(/^\/+/, '').split('/').filter(Boolean)
    parts.forEach((filename, index) => {
      let node = parent.children.find(item => item.filename === filename)
      if (!node) {
        const folder = index < parts.length - 1
        node = { filename, comment: '', focus: false, expanded: true, type: folder ? 'folder' : 'file', level: index + 1, children: [] }
        parent.children.push(node)
      }
      if (index < parts.length - 1) parent = node
    })
  }
  return root.children
}

const renderCodeTreeNodes = (nodes: FileTreeNode[], prefix = '', mode: FileTreeIconMode = 'colored'): string => nodes.map(node => {
  const path = prefix ? `${prefix}/${node.filename}` : node.filename
  const folder = node.children.length > 0 || node.type === 'folder'
  const children = folder ? `<div class="group">${renderCodeTreeNodes(node.children, path, mode)}</div>` : ''
  return `<div class="vp-file-tree-node"><p class="vp-file-tree-info ${folder ? 'folder expanded' : 'file'}" style="--file-tree-level:${-node.level}"${folder ? ' role="button" tabindex="0" aria-expanded="true"' : ` role="button" tabindex="0" data-code-file="${escapeHtml(path)}"`}>${renderFileTreeIcon(node.filename, folder ? 'folder' : 'file', mode)}<span class="name ${folder ? 'folder' : 'file'}">${escapeHtml(node.filename)}</span></p>${children}</div>`
}).join('')

const renderLinkCard = (rawAttributes: string, body = ''): string => {
  const props = attributes(rawAttributes)
  const href = props.href ?? ''
  const external = /^(?:https?:)?\/\//.test(href)
  const target = props.target ?? (external ? '_blank' : '')
  const rel = props.rel ?? (external ? 'noopener noreferrer' : '')
  const titleSlot = body.match(/<template\s+#title\s*>([\s\S]*?)<\/template>/i)?.[1]?.trim() ?? ''
  const content = body.replace(/<template\s+#title\s*>[\s\S]*?<\/template>/i, '').trim()
  const title: string = titleSlot ? renderPlain(titleSlot, false).trim().replace(/^<p>([\s\S]*)<\/p>$/, '$1') : props.title ?? ''
  const icon = props.icon ? renderIcon(props.icon) : ''
  const link: string = href
    ? `<a class="link no-icon" href="${escapeHtml(href)}"${target ? ` target="${escapeHtml(target)}"` : ''}${rel ? ` rel="${escapeHtml(rel)}"` : ''}>${titleSlot ? title : `${icon}${title ? `<span class="text">${title}</span>` : ''}`}</a>`
    : `<span class="link no-icon">${titleSlot ? title : `${icon}${title ? `<span class="text">${title}</span>` : ''}`}</span>`
  const description: string = content ? renderPlain(content, false).trim() : props.description ? `<p>${props.description}</p>` : ''
  return `<div class="vp-link-card"><span class="body">${link}${description}</span><span class="vpi-arrow-right" aria-hidden="true"></span></div>`
}

const linkCards = (source: string): string => source.replace(
  /<(?:VP)?LinkCard\s+([^>]*?)\s*\/>/g,
  (_match, rawAttributes: string) => renderLinkCard(rawAttributes),
)

const pairedLinkCards = (source: string) => {
  const lines = source.split('\n')
  const output: string[] = []
  let fence = ''
  for (let index = 0; index < lines.length; index++) {
    const marker = lines[index].match(/^\s*(`{3,}|~{3,})/)?.[1]
    if (marker) {
      if (!fence) fence = marker[0]
      else if (fence === marker[0]) fence = ''
      output.push(lines[index])
      continue
    }
    const open = !fence && lines[index].match(/^\s*<(?:VP)?LinkCard\s+([^>]*?)>\s*$/)
    if (!open || /\/\>\s*$/.test(lines[index])) {
      output.push(lines[index])
      continue
    }
    const body: string[] = []
    while (++index < lines.length && !/^\s*<\/(?:VP)?LinkCard>\s*$/.test(lines[index])) body.push(lines[index])
    output.push(renderLinkCard(open[1], body.join('\n')))
  }
  return output.join('\n')
}

const badges = (source: string) => source.replace(
  /<(?:VP)?Badge\s+([^>]*?)\s*\/>/g,
  (_match, rawAttributes: string) => {
    const props = attributes(rawAttributes)
    const color = props.color
    const background = props.bgColor ?? props['bg-color']
    const border = props.borderColor ?? props['border-color'] ?? 'transparent'
    const style = color || background ? ` style="${color ? `color:${escapeHtml(color)};` : ''}${background ? `background-color:${escapeHtml(background)};` : ''}border-color:${escapeHtml(border)}"` : ''
    return `<span class="vp-badge ${escapeHtml(props.type ?? 'tip')}"${style}>${escapeHtml(props.text ?? props.title ?? '')}</span>`
  },
)

type ResponsiveCols = number | { sm: number, md: number, lg: number }
const responsiveCols = (value: string | undefined, defaults: ResponsiveCols): ResponsiveCols => {
  if (!value) return defaults
  const numeric = Number(value)
  if (Number.isInteger(numeric) && numeric > 0) return numeric
  try {
    const parsed = JSON.parse(value.replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":').replace(/'/g, '"'))
    if (!parsed || typeof parsed !== 'object') return defaults
    const base = typeof defaults === 'number' ? { sm: defaults, md: defaults, lg: defaults } : defaults
    return Object.fromEntries(['sm', 'md', 'lg'].map(key => [key, Number.isInteger(Number(parsed[key])) && Number(parsed[key]) > 0 ? Number(parsed[key]) : base[key as keyof typeof base]])) as ResponsiveCols
  } catch { return defaults }
}
const cardGridOpen = (raw = '') => {
  const props = attributes(raw)
  const columns = responsiveCols(props[':cols'] ?? props.cols, { sm: 1, md: 2, lg: 2 })
  const initial = typeof columns === 'number' ? columns : 1
  return `<div class="vp-card-grid cols-${initial}" data-card-grid-cols="${escapeHtml(JSON.stringify(columns))}" style="grid-template-columns:repeat(${initial},1fr)">`
}
const cardMasonryOpen = (raw = '') => {
  const props = attributes(raw)
  const columns = responsiveCols(props[':cols'] ?? props.cols, { sm: 2, md: 2, lg: 3 })
  return `<div class="vp-card-masonry" data-masonry-cols="${escapeHtml(JSON.stringify(columns))}" data-masonry-gap="${escapeHtml(props.gap ?? '16')}">`
}
const cardOpen = (raw = '') => {
  const props = attributes(raw)
  const icon = props.icon ? renderIcon(props.icon) : ''
  const title = props.title ?? ''
  const header = icon || title ? `<header class="title">${icon}${title ? `<span class="text">${title}</span>` : ''}</header>` : ''
  return `<article class="vp-card-wrapper">${header}<section class="body">`
}

const cardSlots = (body: string) => {
  const title = body.match(/<template\s+(?:#title|v-slot:title)\s*>([\s\S]*?)<\/template>/i)?.[1]?.trim() ?? ''
  return { title, body: body.replace(/<template\s+(?:#title|v-slot:title)\s*>[\s\S]*?<\/template>/i, '').trim() }
}

const pairedCards = (source: string): string => {
  const lines = source.split('\n')
  const output: string[] = []
  let fence = ''
  for (let index = 0; index < lines.length; index++) {
    const marker = lines[index].match(/^\s*(`{3,}|~{3,})/)?.[1]
    if (marker) {
      if (!fence) fence = marker[0]
      else if (fence === marker[0]) fence = ''
      output.push(lines[index])
      continue
    }
    const open = !fence && lines[index].match(/^\s*<(?:VP)?Card(?:\s+([^>]*))?>\s*$/)
    if (!open) {
      output.push(lines[index])
      continue
    }
    const body: string[] = []
    while (++index < lines.length && !/^\s*<\/(?:VP)?Card>\s*$/.test(lines[index])) body.push(lines[index])
    const slots = cardSlots(body.join('\n'))
    const title = slots.title ? renderPlain(slots.title, false).trim().replace(/^<p>([\s\S]*)<\/p>$/, '$1') : ''
    output.push(`${title ? `<article class="vp-card-wrapper">${title}` : cardOpen(open[1] ?? '')}${title ? '<section class="body">' : ''}${renderPlain(slots.body, false).trim()}</section></article>`)
  }
  return output.join('\n')
}

const renderNpmBadge = (props: Record<string, string>) => {
  props = { ...props, labelColor: props.labelColor ?? props['label-color'] }
  const type = props.type ?? ''
  const repo = props.repo ?? ''
  const name = props.name || repo.split('/')[1] || ''
  const branch = props.branch || 'main'
  const directory = props.dir || ''
  const theme = props.theme || ''
  const color = props.color || '#32A9C3'
  const labelColor = props.labelColor || props['label-color'] || '#1B3C4A'
  const params = new URLSearchParams()
  let badgeUrl = 'https://img.shields.io/badge/unknown'
  let link = ''
  let alt = 'unknown'
  const githubLink = repo ? `https://github.com/${repo}${directory ? `/tree/${branch}/${directory}` : ''}` : ''
  const npmLink = `https://www.npmjs.com/package/${name}`
  if (!['source', 'stars', 'forks'].includes(type)) {
    params.set('style', theme || 'flat')
    params.set('color', color)
    params.set('labelColor', labelColor)
  }
  if (type === 'source') {
    params.set('logo', 'github')
    params.set('color', labelColor)
    badgeUrl = `https://img.shields.io/badge/source-a?${params}`
    link = githubLink
    alt = 'github source'
  } else if (type === 'stars' || type === 'forks') {
    params.set('style', theme || 'social')
    badgeUrl = `https://img.shields.io/github/${type}/${repo}?${params}`
    link = githubLink
    alt = `github ${type}`
  } else if (type === 'license') {
    badgeUrl = `https://img.shields.io/github/license/${repo}?${params}`
    link = githubLink
    alt = 'license'
  } else if (type === 'version') {
    params.set('label', props.label || name || 'npm')
    badgeUrl = `https://img.shields.io/npm/v/${encodeURIComponent(name)}?${params}`
    link = npmLink
    alt = 'npm version'
  } else if (['dt', 'd18m', 'dm', 'dy', 'dw'].includes(type)) {
    params.set('label', props.label || 'downloads')
    badgeUrl = `https://img.shields.io/npm/${type === 'dt' ? 'd18m' : type}/${encodeURIComponent(name)}?${params}`
    link = npmLink
    alt = 'npm downloads'
  }
  if (!['source', 'stars', 'forks', 'license', 'version', 'dt', 'd18m', 'dm', 'dy', 'dw'].includes(type)) badgeUrl = `https://img.shields.io/badge/unknown?${params}`
  const image = `<img src="${escapeHtml(badgeUrl)}"${link ? '' : ' class="no-view"'} alt="${escapeHtml(alt)}">`
  return `<span class="vp-npm-badge">${link ? `<a href="${escapeHtml(link)}" target="_blank" rel="noreferrer" class="no-icon">${image}</a>` : image}</span>`
}

const npmGroupProps = (props: Record<string, string>) => ({
  ...Object.fromEntries(['name', 'repo', 'branch', 'dir', 'color', 'theme'].filter(name => props[name] !== undefined).map(name => [name, props[name]])),
  ...(props.labelColor !== undefined || props['label-color'] !== undefined ? { labelColor: props.labelColor ?? props['label-color'] } : {}),
})
const npmBadgeItems = (props: Record<string, string>) => {
  const value = props.items ?? props[':items'] ?? ''
  return value.trim().startsWith('[')
    ? [...value.matchAll(/['"]([^'"]+)['"]/g)].map(match => match[1])
    : value.split(',').map(type => type.trim()).filter(Boolean)
}

const renderNpmBadges = (source: string) => {
  const spans: string[] = []
  source = source.replace(/(`+)([\s\S]*?)\1/g, match => `\0npm-code-${spans.push(match) - 1}\0`)
  const rendered = source
    .replace(/<NpmBadgeGroup(?:\s+([^>]*?))?>([\s\S]*?)<\/NpmBadgeGroup>/g, (_match, raw: string = '', body: string) => {
    const group = attributes(raw)
    const inherited = npmGroupProps(group)
    const badges = [...body.matchAll(/<NpmBadge(?:\s+([^>]*?))?\s*\/>/g)].map(match => {
      const badge = attributes(match[1] ?? '')
      return renderNpmBadge({ ...badge, ...inherited })
    })
    const fallback = npmBadgeItems(group).map(type => renderNpmBadge({ ...group, type }))
    return `<p class="vp-npm-badge-group">${(badges.length ? badges : fallback).join('')}</p>`
  })
    .replace(/<NpmBadgeGroup(?:\s+([^>]*?))?\s*\/>/g, (_match, raw: string = '') => {
      const props = attributes(raw)
      return `<p class="vp-npm-badge-group">${npmBadgeItems(props).map(type => renderNpmBadge({ ...props, type })).join('')}</p>`
    })
    .replace(/<NpmBadge(?:\s+([^>]*?))?\s*\/>/g, (_match, raw: string = '') => renderNpmBadge(attributes(raw)))
  return rendered.replace(/\0npm-code-(\d+)\0/g, (_match, index) => spans[Number(index)] ?? '')
}

const npmBadges = (source: string) => {
  let fence = ''
  let pending: string[] = []
  const output: string[] = []
  const flush = () => {
    if (pending.length) output.push(renderNpmBadges(pending.join('\n')))
    pending = []
  }
  for (const line of source.split('\n')) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1]
    if (marker) {
      flush()
      output.push(line)
      if (!fence) fence = marker[0]
      else if (fence === marker[0]) fence = ''
    } else if (fence) output.push(line)
    else pending.push(line)
  }
  flush()
  return output.join('\n')
}

const qrCodeText = (rawText: string, sourcePath = '') => {
  const text = rawText.trim()
  if (text === '.') return { text, link: true, internal: true }
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(text)) return { text, link: true, internal: false }
  if (!text.startsWith('/') && !text.startsWith('./')) return { text, link: false, internal: false }
  const suffixAt = text.search(/[?#]/)
  const suffix = suffixAt < 0 ? '' : text.slice(suffixAt)
  const reference = suffixAt < 0 ? text : text.slice(0, suffixAt)
  const page = resolveContentPage(reference, sourcePath)
  return page ? { text: `${page.route}${suffix}`, link: true, internal: true } : { text, link: false, internal: false }
}

const renderQrCode = (raw: string, text: string, sourcePath = '') => {
  const props = attributes(raw)
  const mode = props.mode || (boolOption(raw, props, 'card', 'card', false) ? 'card' : 'img')
  const align = props.align || 'left'
  const parsedWidth = Number.parseInt(props.width || '')
  const width = parsedWidth ? `${parsedWidth}px` : ''
  const title = props.title ? escapeHtml(props.title) : ''
  const resolved = qrCodeText(text, sourcePath)
  return `<div class="vp-qrcode${mode === 'card' ? ' card' : ''}${boolOption(raw, props, 'reverse', 'reverse', false) ? ' reverse' : ''} ${escapeHtml(align)}" data-qrcode data-qrcode-text="${escapeHtml(resolved.text).replaceAll('\n', '&#10;')}" data-qrcode-is-link="${resolved.link}" data-qrcode-internal="${resolved.internal}" data-qrcode-logo="${escapeHtml(props.logo || '')}" data-qrcode-logo-size="${escapeHtml(props.logoSize || props['logo-size'] || '0.2')}" data-qrcode-level="${escapeHtml(props.level || '')}" data-qrcode-version="${escapeHtml(props.version || '')}" data-qrcode-mask="${escapeHtml(props.mask || '')}" data-qrcode-margin="${escapeHtml(props.margin || '2')}" data-qrcode-scale="${escapeHtml(props.scale || '4')}" data-qrcode-light="${escapeHtml(props.light || '')}" data-qrcode-dark="${escapeHtml(props.dark || '')}"><div class="qrcode-content"><img class="qrcode-img" alt="" title="" width="300" height="300"${width ? ` style="--vp-qrcode-size:${width}"` : ''} hidden>${title && mode !== 'card' ? `<div class="qrcode-label">${title}</div>` : ''}</div>${mode === 'card' ? `<div class="qrcode-info">${title ? `<p class="qrcode-title">${title}</p>` : ''}<p><a data-qrcode-link rel="noopener noreferrer" target="_blank" hidden></a><span data-qrcode-value></span></p></div>` : ''}</div>`
}

const qrCodeContainers = (source: string, sourcePath = '') => {
  const lines = source.split('\n')
  const output: string[] = []
  let fence = ''
  for (let index = 0; index < lines.length; index++) {
    const codeMarker = lines[index].match(/^\s*(`{3,}|~{3,})/)?.[1]
    if (codeMarker) {
      if (!fence) fence = codeMarker[0]
      else if (fence === codeMarker[0]) fence = ''
      output.push(lines[index])
      continue
    }
    if (fence) {
      output.push(lines[index])
      continue
    }
    const open = lines[index].match(/^\s*(:{3,})\s+qrcode(?:\s+(.*))?$/)
    if (!open) {
      output.push(lines[index])
      continue
    }
    const body: string[] = []
    while (++index < lines.length && !new RegExp(`^\\s*${open[1]}\\s*$`).test(lines[index])) body.push(lines[index])
    output.push(renderQrCode(open[2] || '', body.join('\n'), sourcePath))
  }
  return output.join('\n')
}

const renderEncryptedSnippet = async (raw: string, source: string, sourcePath?: string) => {
  const props = attributes(raw)
  const password = props.password || props.pwd || (typeof markdownPower.encrypt === 'object' ? markdownPower.encrypt.password : '') || (siteConfig.markdown as { encryptPassword?: string }).encryptPassword
  if (!password) return renderPlain(source, false, sourcePath)
  const html = renderPlain(source, false, sourcePath)
  const scope = `snippet:${sourcePath ?? ''}:${createHash('sha256').update(source).digest('hex')}`
  const credentials = [{ password, scope }, ...globalAdminCredentials()]
    .filter((credential, index, list) => list.findIndex(item => item.password === credential.password && item.scope === credential.scope) === index)
  const payloads = await Promise.all(credentials.map(credential => encryptContent(html, credential.password, credential.scope)))
  const payload = payloads[0]
  const locale = encryptSnippetLocale(sourcePath)
  const hint = escapeHtml(props.hint || locale.hint)
  const button = localeOf(languageFromSourcePath(sourcePath)).encryptButtonText
  return `<div class="vp-encrypt-snippet" data-encrypt-snippet data-encrypt-ciphertext="${payload.ciphertext}" data-encrypt-iv="${payload.iv}" data-encrypt-salt="${payload.salt}" data-encrypt-payloads="${escapeHtml(JSON.stringify(payloads))}"><div class="snippet-hint"><span class="vpi-lock" aria-hidden="true"></span><span>${hint}</span></div><div class="snippet-warning" hidden><strong>${escapeHtml(locale.warningTitle)}</strong> ${escapeHtml(locale.warningText)}</div><div class="snippet-form"><label><input name="password" type="password" autocomplete="off" placeholder="${escapeHtml(locale.placeholder)}"></label><button type="button" disabled aria-label="${escapeHtml(button)}"><span class="vpi-unlock" aria-hidden="true"></span></button><p class="snippet-error" hidden>${escapeHtml(locale.incPwd)}</p></div></div>`
}

const encryptContainers = async (source: string, sourcePath?: string) => {
  const lines = source.split('\n')
  const output: string[] = []
  let fence = ''
  for (let index = 0; index < lines.length; index++) {
    const codeMarker = lines[index].match(/^\s*(`{3,}|~{3,})/)?.[1]
    if (codeMarker) {
      if (!fence) fence = codeMarker[0]
      else if (fence === codeMarker[0]) fence = ''
      output.push(lines[index])
      continue
    }
    if (fence) {
      output.push(lines[index])
      continue
    }
    const open = lines[index].match(/^\s*(:{3,})\s+encrypt(?:\s+(.*))?$/)
    if (!open) {
      output.push(lines[index])
      continue
    }
    const body: string[] = []
    while (++index < lines.length && !new RegExp(`^\\s*${open[1]}\\s*$`).test(lines[index])) body.push(lines[index])
    output.push(await renderEncryptedSnippet(open[2] || '', body.join('\n'), sourcePath))
  }
  return output.join('\n')
}

const fieldContainers = (source: string) => {
  const lines = source.split('\n')
  const output: string[] = []
  let fence = ''
  let groupOpen = false
  for (let index = 0; index < lines.length; index++) {
    const marker = lines[index].match(/^\s*(`{3,}|~{3,})/)?.[1]
    if (marker) {
      if (!fence) fence = marker[0]
      else if (fence === marker[0]) fence = ''
      output.push(lines[index])
      continue
    }
    if (fence) {
      output.push(lines[index])
      continue
    }
    if (/^\s*::::\s+field-group\s*$/.test(lines[index])) {
      groupOpen = true
      output.push('<div class="vp-field-group">')
      continue
    }
    if (groupOpen && /^\s*::::\s*$/.test(lines[index])) {
      groupOpen = false
      output.push('</div>')
      continue
    }
    const open = lines[index].match(/^\s*:::\s+field\s+(.+?)\s*$/)
    if (!open) {
      output.push(lines[index])
      continue
    }
    const body: string[] = []
    while (++index < lines.length && !/^\s*:::\s*$/.test(lines[index])) body.push(lines[index])
    const legacy = attributes(open[1])
    const field: { name: string, type?: string, defaultValue?: string, required?: boolean, optional?: boolean, deprecated?: boolean, description: string } = {
      name: open[1].includes('=') ? legacy.name ?? '' : open[1].trim(),
      type: legacy.type,
      defaultValue: legacy.default,
      required: boolOption(open[1], legacy, 'required', 'required', false),
      optional: boolOption(open[1], legacy, 'optional', 'optional', false),
      deprecated: boolOption(open[1], legacy, 'deprecated', 'deprecated', false),
      description: '',
    }
    const descriptions: string[] = []
    let current = ''
    const flush = () => {
      if (!current) return
      descriptions.push(current)
      current = ''
    }
    for (const raw of body) {
      const line = raw.trim()
      if (!line.startsWith('@')) {
        if (current) current += '\n'
        current += line
        continue
      }
      const separator = line.indexOf(' ')
      const tag = separator < 0 ? line.slice(1) : line.slice(1, separator).toLowerCase()
      const value = separator < 0 ? '' : line.slice(separator + 1).trim()
      if (!['name', 'type', 'default', 'required', 'optional', 'deprecated', 'description'].includes(tag)) {
        if (current) current += '\n'
        current += line
        continue
      }
      flush()
      if (tag === 'name' && value) field.name = value.replace(/^`|`$/g, '')
      else if (tag === 'type' && value) field.type = value.replace(/^`|`$/g, '')
      else if (tag === 'default' && value) field.defaultValue = value.replace(/^`|`$/g, '')
      else if (tag === 'required') field.required = true
      else if (tag === 'optional') field.optional = true
      else if (tag === 'deprecated') field.deprecated = true
      else if (tag === 'description') current = value
    }
    flush()
    field.description = descriptions.join('\n')
    const classes = [field.required ? 'required' : '', field.optional ? 'optional' : '', field.deprecated ? 'deprecated' : ''].filter(Boolean).join(' ')
    const state = field.required ? '<span class="required">Required</span>' : field.optional ? '<span class="optional">Optional</span>' : ''
    const deprecated = field.deprecated ? '<span class="deprecated">Deprecated</span>' : ''
    const type = field.type ? `<span class="type"><code>${escapeHtml(field.type)}</code></span>` : ''
    const defaultValue = field.defaultValue ? `<p class="default-value"><code>${escapeHtml(field.defaultValue)}</code></p>` : ''
    const description = field.description
    output.push(`<div class="vp-field${classes ? ` ${classes}` : ''}"><p class="field-meta"><span class="name">${escapeHtml(field.name)}</span>${state}${deprecated}${type}</p>${defaultValue}${description ? `<div class="description">\n\n${description}\n\n</div>` : ''}</div>`)
  }
  return output.join('\n')
}

const chatContainers = (source: string) => {
  const lines = source.split('\n')
  const output: string[] = []
  let fence = ''
  for (let index = 0; index < lines.length; index++) {
    const marker = lines[index].match(/^\s*(`{3,}|~{3,})/)?.[1]
    if (marker) {
      if (!fence) fence = marker[0]
      else if (fence === marker[0]) fence = ''
      output.push(lines[index])
      continue
    }
    if (fence) {
      output.push(lines[index])
      continue
    }
    const open = lines[index].match(/^\s*(:{3,})\s+chat(?:\s+(.*))?$/)
    if (!open) {
      output.push(lines[index])
      continue
    }
    const body: string[] = []
    while (++index < lines.length && !new RegExp(`^\\s*${open[1]}\\s*$`).test(lines[index])) body.push(lines[index])
    const messages: Array<{ sender: 'user' | 'self', username: string, date: string, content: string[] }> = []
    let date = ''
    let message: typeof messages[number] | undefined
    for (const raw of body) {
      const line = raw.trim()
      if (line.startsWith('{:') && line.endsWith('}')) {
        date = line.slice(2, -1).trim()
      } else if (line.startsWith('{') && line.endsWith('}')) {
        const username = line.slice(1, -1).trim()
        message = { sender: username === '.' ? 'self' : 'user', username, date, content: [] }
        messages.push(message)
      } else if (message) message.content.push(raw)
    }
    let currentDate = ''
    const content = messages.map(item => {
      const dateNode = !currentDate || currentDate !== item.date ? `<div class="vp-chat-date"><span>${escapeHtml(item.date)}</span></div>` : ''
      currentDate = item.date
      const username = item.sender === 'user' ? `<p class="vp-chat-username">${escapeHtml(item.username)}</p>` : ''
      return `${dateNode}<div class="vp-chat-message ${item.sender}"><div class="vp-chat-message-body">${username}<div class="message-content">${renderPlain(item.content.join('\n'), false).trim()}</div></div></div>`
    }).join('\n')
    const title = attributes(open[2] ?? '').title || 'Chat'
    output.push(`<div class="vp-chat"><div class="vp-chat-header"><p class="vp-chat-title">${escapeHtml(title)}</p></div><div class="vp-chat-content">${content}</div></div>`)
  }
  return output.join('\n')
}

type DemoType = 'normal' | 'vue' | 'markdown'

type DemoMeta = {
  title: string
  desc: string
  codeSetting: string
  expanded: boolean
}

type NormalDemoSource = {
  html: string
  script: string
  style: string
  jsType: 'js' | 'ts'
  cssType: 'css' | 'less' | 'scss' | 'stylus'
  jsLib: string[]
  cssLib: string[]
}

const encoded = (value: string) => Buffer.from(value).toString('base64')

const demoMeta = (raw = ''): DemoMeta => {
  const props = attributes(raw)
  return {
    title: props.title ?? '',
    desc: props.desc ?? '',
    codeSetting: props['code-setting'] ?? props.codeSetting ?? '',
    expanded: hasFlag(raw, 'expanded') || props[':expanded'] === 'true' || props.expanded === 'true',
  }
}

const normalizeDemoLanguage = (language = '') => {
  const name = language.trim().split(/[\s:{]/)[0].toLowerCase()
  if (name === 'javascript') return 'js'
  if (name === 'typescript') return 'ts'
  if (name === 'markdown') return 'md'
  if (name === 'styl') return 'stylus'
  if (name === 'sass') return 'scss'
  return name
}

const demoCodeFence = (source: string) => '~'.repeat(Math.max(3, Math.max(0, ...[...source.matchAll(/~+/g)].map(match => match[0].length)) + 1))

const renderDemoInfo = ({ title, desc }: DemoMeta) => title || desc
  ? `<div class="demo-info">${title ? `<p class="title">${escapeHtml(title)}</p>` : ''}${desc ? `<p class="desc">${escapeHtml(desc)}</p>` : ''}</div>`
  : ''

const renderDemoToggle = (expanded: boolean) => `<button type="button" aria-label="Toggle Code" aria-expanded="${expanded}"><span class="vpi-demo-code"></span></button>`

const renderDemoSource = (source: string, language: string, codeSetting = '', sourcePath?: string) => {
  const fence = demoCodeFence(source)
  return renderPlain(`${fence}${language}${codeSetting ? ` ${codeSetting}` : ''}\n${source}\n${fence}`, false, sourcePath).trim()
}

const compileDemoStyle = async (source: string, language: string, filename: string, id: string, scoped = false, modules = false) => {
  if (!source) return { code: '', modules: {} as Record<string, string> }
  const type = normalizeDemoLanguage(language) as NormalDemoSource['cssType']
  const result = await compileStyleAsync({
    source,
    filename,
    id,
    scoped,
    modules,
    preprocessLang: type === 'css' ? undefined : type,
  })
  if (result.errors.length) throw new Error(`Demo style compilation failed in ${filename}: ${result.errors.map(String).join('\n')}`)
  return { code: result.code, modules: result.modules ?? {} }
}

const compileNormalScript = async (source: string, language: 'js' | 'ts', filename: string) => {
  if (!source) return ''
  const result = await buildScript({
    stdin: { contents: source, loader: language, resolveDir: path.dirname(filename), sourcefile: filename },
    bundle: true,
    format: 'iife',
    logLevel: 'silent',
    minify: true,
    platform: 'browser',
    write: false,
  })
  return result.outputFiles[0]?.text ?? ''
}

const compileVueDemo = async (source: string, filename: string, language = path.extname(filename).slice(1), scopeFirstStyle = false) => {
  const styles: string[] = []
  const compileSource = async (code: string, filepath: string, scopeStyle = false) => {
    const cssModules: Record<string, Record<string, string>> = {}
    const id = `data-v-${createHash('sha256').update(`${filepath}:${code}`).digest('hex').slice(0, 8)}`
    const { descriptor, errors } = parseSfc(code, { filename: filepath })
    if (errors.length) throw new Error(`Vue demo compilation failed in ${filepath}: ${errors.map(String).join('\n')}`)
    const scoped = descriptor.styles.some(style => style.scoped) || scopeStyle && descriptor.styles.length > 0
    for (const [index, style] of descriptor.styles.entries()) {
      const compiled = await compileDemoStyle(style.content, style.lang ?? 'css', filepath, id, style.scoped || scopeStyle && index === 0, style.module !== undefined)
      styles.push(compiled.code)
      if (style.module !== undefined) Object.assign(cssModules[typeof style.module === 'string' && style.module ? style.module : '$style'] ??= {}, compiled.modules)
    }
    const cssModulesCode = Object.keys(cssModules).length ? `__demo_component__.__cssModules = ${JSON.stringify(cssModules)}\n` : ''
    if (descriptor.script || descriptor.scriptSetup) {
      const script = compileScript(descriptor, {
        id,
        inlineTemplate: true,
        genDefaultAs: '__demo_component__',
        templateOptions: { compilerOptions: scoped ? { scopeId: id } : {} },
      })
      return {
        code: `${script.content}\n${scoped ? `__demo_component__.__scopeId = ${JSON.stringify(id)}\n` : ''}${cssModulesCode}export default __demo_component__`,
        loader: (script.lang === 'ts' || script.lang === 'tsx' ? script.lang : 'js') as 'js' | 'ts' | 'tsx',
      }
    }
    const template = compileTemplate({
      source: descriptor.template?.content ?? '',
      filename: filepath,
      id,
      scoped,
      compilerOptions: scoped ? { scopeId: id } : {},
    })
    if (template.errors.length) throw new Error(`Vue demo template compilation failed in ${filepath}: ${template.errors.map(String).join('\n')}`)
    return {
      code: `${template.code}\nconst __demo_component__ = { render }\n${scoped ? `__demo_component__.__scopeId = ${JSON.stringify(id)}\n` : ''}${cssModulesCode}export default __demo_component__`,
      loader: 'js' as const,
    }
  }

  const extension = normalizeDemoLanguage(language)
  let entry = { code: source, loader: (extension === 'ts' ? 'ts' : 'js') as 'js' | 'ts' | 'tsx' }
  if (extension === 'vue') entry = await compileSource(source, filename, scopeFirstStyle)
  const result = await buildScript({
    stdin: { contents: entry.code, loader: entry.loader, resolveDir: path.dirname(filename), sourcefile: filename },
    bundle: true,
    external: ['vue'],
    format: 'cjs',
    logLevel: 'silent',
    minify: true,
    platform: 'browser',
    plugins: [{
      name: 'ermaozi-vue-demo',
      setup(builder) {
        builder.onLoad({ filter: /\.vue$/ }, async ({ path: filepath }) => {
          const compiled = await compileSource(await readFile(filepath, 'utf8'), filepath)
          return { contents: compiled.code, loader: compiled.loader, resolveDir: path.dirname(filepath) }
        })
      },
    }],
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.css', '.json', '.vue'],
    write: false,
  })
  return { script: result.outputFiles[0]?.text ?? '', style: styles.join('\n') }
}

const dynamicImageCards = async (source: string, sourcePath?: string) => {
  const setup = source.match(/<script\s+setup(?:\s+lang=(?:"([^"]+)"|'([^']+)'))?[^>]*>([\s\S]*?)<\/script>/i)
  if (!setup || !/\bv-(?:for|bind)\b/.test(source)) return source
  const lines = source.split('\n')
  const targets: Array<{ id: string, tag: string }> = []
  const output: string[] = []
  let fence = ''
  for (let index = 0; index < lines.length; index++) {
    const marker = lines[index].match(/^\s*(`{3,}|~{3,})/)?.[1]
    if (marker) {
      if (!fence) fence = marker[0]
      else if (fence === marker[0]) fence = ''
      output.push(lines[index])
      continue
    }
    if (fence || !/^\s*<(?:VP)?ImageCard\b/.test(lines[index])) {
      output.push(lines[index])
      continue
    }
    let tag = lines[index]
    while (!/\/>\s*$/.test(tag) && index + 1 < lines.length) tag += ` ${lines[++index].trim()}`
    if (!/\bv-(?:for|bind)\b/.test(tag)) {
      output.push(tag)
      continue
    }
    const id = `dynamic-image-card-${createHash('sha256').update(`${sourcePath ?? ''}:${targets.length}`).digest('hex').slice(0, 10)}`
    targets.push({ id, tag: tag.replace(/<(?:VP)?ImageCard\b/, '<ImageCard') })
    output.push(`<span class="dynamic-image-card-target" data-dynamic-card-target="${id}"></span>`)
  }
  if (!targets.length) return source
  const component = `
import { defineComponent as __defineComponent, h as __h } from 'vue'
const ImageCard = __defineComponent({
  inheritAttrs: false,
  props: { image: { type: String, required: true }, title: String, description: String, href: String, author: String, date: [String, Date, Number], width: [String, Number], center: Boolean },
  setup(props, { attrs }) {
    return () => {
      const instance = props.date instanceof Date ? props.date : props.date ? new Date(props.date) : undefined
      const date = instance && !Number.isNaN(instance.getTime()) ? new Intl.DateTimeFormat(document.documentElement.lang, { year: 'numeric', month: 'short', day: 'numeric' }).format(instance) : ''
      const title = props.title ? __h('h3', { class: 'title' }, props.href ? __h('a', { href: props.href, target: '_blank', rel: 'noopener noreferrer', class: 'no-icon' }, props.title) : __h('span', props.title)) : null
      const copyright = props.author || date ? __h('p', { class: 'copyright' }, [props.author ? __h('span', props.author) : null, props.author && date ? __h('span', ' | ') : null, date ? __h('span', date) : null]) : null
      const description = props.description ? __h('p', { class: 'description' }, props.description) : null
      const info = title || copyright || description ? __h('div', { class: 'image-info' }, [title, copyright, description]) : null
      const width = props.width ? (String(Number(props.width)) === String(props.width) ? props.width + 'px' : String(props.width)) : undefined
      return __h('div', { ...attrs, class: ['vp-image-card', attrs.class, { center: props.center }], style: [{ width }, attrs.style] }, [__h('div', { class: 'image-container' }, [__h('img', { src: props.image, alt: props.title || '', loading: 'lazy' }), info])])
    }
  },
})
${setup[3]}
`
  const template = targets.map(({ id, tag }) => `<Teleport to="[data-dynamic-card-target='${id}']">${tag}</Teleport>`).join('\n')
  const filename = sourcePath ?? path.resolve('content/dynamic-image-cards.md')
  const compiled = await compileVueDemo(`<script setup lang="${setup[1] ?? setup[2] ?? 'js'}">${component}</script><template>${template}</template>`, `${filename}.vue`, 'vue')
  return `<span hidden data-dynamic-cards-app data-dynamic-cards-code="${encoded(compiled.script)}"></span>\n${output.join('\n')}`
}

const parseNormalFile = (source: string): NormalDemoSource => {
  let body = source
  let config = ''
  let script = ''
  let style = ''
  let jsType: NormalDemoSource['jsType'] = 'js'
  let cssType: NormalDemoSource['cssType'] = 'css'
  body = body.replace(/<script\s+type=["']config["']\s*>([\s\S]*?)<\/script>/i, (_match, value) => {
    config = value.trim()
    return ''
  })
  body = body.replace(/<script(?:\s+lang=["']?(\w+)["']?)?\s*>([\s\S]*?)<\/script>/i, (_match, language, value) => {
    script = value.trim()
    jsType = normalizeDemoLanguage(language) === 'ts' ? 'ts' : 'js'
    return ''
  })
  body = body.replace(/<style(?:\s+lang=["']?(\w+)["']?)?\s*>([\s\S]*?)<\/style>/i, (_match, language, value) => {
    style = value.trim()
    const normalized = normalizeDemoLanguage(language)
    cssType = ['less', 'scss', 'stylus'].includes(normalized) ? normalized as NormalDemoSource['cssType'] : 'css'
    return ''
  })
  const imports = config ? JSON.parse(config) as { jsLib?: unknown, cssLib?: unknown } : {}
  return {
    html: body.trim(),
    script,
    style,
    jsType,
    cssType,
    jsLib: Array.isArray(imports.jsLib) ? imports.jsLib.filter((value): value is string => typeof value === 'string') : [],
    cssLib: Array.isArray(imports.cssLib) ? imports.cssLib.filter((value): value is string => typeof value === 'string') : [],
  }
}

const renderResourceList = (source: NormalDemoSource) => {
  const groups = [
    ['JavaScript', source.jsLib],
    ['CSS', source.cssLib],
  ].filter((entry): entry is [string, string[]] => entry[1].length > 0)
  if (!groups.length) return ''
  const lists = groups.map(([name, items]) => `<div class="demo-resources-list"><p>${name}</p><ul>${items.map(url => `<li><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="no-icon" aria-label="${escapeHtml(url.slice(url.lastIndexOf('/') + 1))}">${escapeHtml(url.slice(url.lastIndexOf('/') + 1))}</a></li>`).join('')}</ul></div>`).join('')
  return `<div class="demo-resources"><button type="button" class="demo-resources-toggle" title="Resources" aria-label="Resources" aria-expanded="false"><span class="vpi-demo-resources"></span></button><div class="demo-resources-container" hidden>${lists}</div></div>`
}

const renderPlaygroundForms = (source: NormalDemoSource, meta: DemoMeta) => {
  const codepen = JSON.stringify({
    title: meta.title || 'Demo',
    description: meta.desc,
    html: source.html,
    css: source.style,
    js: source.script,
    js_pre_processor: source.jsType === 'ts' ? 'typescript' : 'none',
    css_pre_processor: source.cssType,
    css_external: source.cssLib.join(';'),
    js_external: source.jsLib.join(';'),
  })
  const resources = [...source.jsLib, ...source.cssLib].join(',')
  return `<div class="extra"><form action="https://codepen.io/pen/define" method="POST" target="_blank" enctype="application/x-www-form-urlencoded;charset=utf-8"><input type="hidden" name="data" value="${escapeHtml(codepen)}"><button type="submit" title="CodePen" aria-label="CodePen"><span class="vpi-demo-codepen"></span></button></form><form action="https://jsfiddle.net/api/post/library/pure/" method="POST" target="_blank" enctype="application/x-www-form-urlencoded;charset=UTF-8" accept-charset="UTF-8"><button type="submit" title="jsFiddle" aria-label="jsFiddle"><span class="vpi-demo-jsfiddle bg"></span></button><input type="hidden" name="wrap" value="b"><input type="hidden" name="html" value="${escapeHtml(source.html)}"><input type="hidden" name="js" value="${escapeHtml(source.script)}"><input type="hidden" name="css" value="${escapeHtml(['css', 'scss'].includes(source.cssType) ? source.style : '')}"><input type="hidden" name="panel_css" value="${source.cssType === 'scss' ? '1' : '0'}"><input type="hidden" name="panel_js" value="${source.jsType === 'ts' ? '4' : '0'}"><input type="hidden" name="title" value="${escapeHtml(meta.title || 'Demo')}"><input type="hidden" name="description" value="${escapeHtml(meta.desc)}"><input type="hidden" name="resources" value="${escapeHtml(resources)}"></form></div>`
}

const renderNormalDemo = async (source: NormalDemoSource, meta: DemoMeta, filename: string, sourcePath?: string) => {
  const script = await compileNormalScript(source.script, source.jsType, filename)
  const { code: style } = await compileDemoStyle(source.style, source.cssType, filename, 'data-v-normal-demo')
  const tabs = [
    source.html && `@tab HTML\n${demoCodeFence(source.html)}html${meta.codeSetting ? ` ${meta.codeSetting}` : ''}\n${source.html}\n${demoCodeFence(source.html)}`,
    source.script && `@tab ${source.jsType === 'ts' ? 'Typescript' : 'Javascript'}\n${demoCodeFence(source.script)}${source.jsType}${meta.codeSetting ? ` ${meta.codeSetting}` : ''}\n${source.script}\n${demoCodeFence(source.script)}`,
    source.style && `@tab ${source.cssType === 'stylus' ? 'Stylus' : source.cssType.toUpperCase()}\n${demoCodeFence(source.style)}${source.cssType}${meta.codeSetting ? ` ${meta.codeSetting}` : ''}\n${source.style}\n${demoCodeFence(source.style)}`,
  ].filter(Boolean).join('\n')
  const resources = renderResourceList(source)
  return `<div class="vp-demo-wrapper normal" data-demo data-demo-html="${encoded(source.html)}" data-demo-css="${encoded(style)}" data-demo-js="${encoded(script)}" data-demo-js-lib="${encoded(JSON.stringify(source.jsLib))}" data-demo-css-lib="${encoded(JSON.stringify(source.cssLib))}"><div class="demo-draw"><iframe title="${escapeHtml(meta.title || 'Demo')}" class="draw-iframe" allow="accelerometer *; bluetooth *; camera *; encrypted-media *; display-capture *; geolocation *; gyroscope *; microphone *; midi *; clipboard-read *; clipboard-write *; web-share *; serial *; xr-spatial-tracking *" allowfullscreen allowpaymentrequest allowtransparency sandbox="allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups-to-escape-sandbox allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation"></iframe></div>${renderDemoInfo(meta)}<div class="demo-ctrl">${renderPlaygroundForms(source, meta)}${resources}${renderDemoToggle(meta.expanded)}</div><div class="demo-code"${meta.expanded ? '' : ' hidden'}>${renderPlain(`::: tabs\n${tabs}\n:::`, false, sourcePath).trim()}</div></div>`
}

const renderMarkdownDemo = (source: string, meta: DemoMeta, sourcePath?: string) => `<div class="vp-demo-wrapper markdown" data-basic-demo><div class="demo-draw">${renderPlain(source, false, sourcePath).trim()}</div>${renderDemoInfo(meta)}<div class="demo-ctrl">${renderDemoToggle(meta.expanded)}</div><div class="demo-code"${meta.expanded ? '' : ' hidden'}>${renderDemoSource(source, 'md', meta.codeSetting, sourcePath)}</div></div>`

const renderVueDemo = async (source: string, language: string, meta: DemoMeta, filename: string, sourcePath?: string, displaySource = source, displayHtml = '', scopeFirstStyle = false) => {
  const compiled = await compileVueDemo(source, filename, language, scopeFirstStyle)
  const style = compiled.style ? `<style>${compiled.style.replace(/<\/style/gi, '<\\/style')}</style>` : ''
  return `<div class="vp-demo-wrapper vue" data-vue-demo data-demo-vue-code="${encoded(compiled.script)}"><div class="demo-draw"><div class="demo-draw-vue" data-demo-vue-mount></div></div>${renderDemoInfo(meta)}<div class="demo-ctrl">${renderDemoToggle(meta.expanded)}</div><div class="demo-code"${meta.expanded ? '' : ' hidden'}>${displayHtml || renderDemoSource(displaySource, normalizeDemoLanguage(language) || 'vue', meta.codeSetting, sourcePath)}</div>${style}</div>`
}

const resolveDemoFile = (reference: string, sourcePath?: string) => reference.startsWith('/')
  ? path.resolve(process.cwd(), 'content', reference.replace(/^\/+/, ''))
  : resolveContentFile(reference, sourcePath)

const demoContainers = async (source: string, sourcePath?: string) => {
  const lines = source.split('\n')
  const output: string[] = []
  let sourceFence = ''
  for (let index = 0; index < lines.length; index++) {
    const block = markdownBlockLine(lines[index])
    const marker = block.content.match(/^(`{3,}|~{3,})/)?.[1]
    if (marker) {
      if (!sourceFence) sourceFence = marker[0]
      else if (sourceFence === marker[0]) sourceFence = ''
      output.push(lines[index])
      continue
    }
    if (sourceFence) {
      output.push(lines[index])
      continue
    }

    const embed = block.content.match(/^@\[demo(?:\s+([^\]]*))?\]\(([^)]*)\)$/)
    if (embed) {
      const info = embed[1]?.trim() ?? ''
      const type = (hasFlag(info, 'vue') ? 'vue' : hasFlag(info, 'markdown') ? 'markdown' : 'normal') as DemoType
      const meta = demoMeta(info)
      const reference = embed[2].trim()
      let rendered = `<p style="color:red;">@[demo ${type}] filepath is empty</p>`
      if (reference) {
        const filename = resolveDemoFile(reference, sourcePath)
        const imported = await readFile(filename, 'utf8')
        rendered = type === 'normal'
          ? await renderNormalDemo(parseNormalFile(imported), meta, filename, sourcePath)
          : type === 'markdown'
            ? renderMarkdownDemo(imported, meta, filename)
            : await renderVueDemo(imported, path.extname(filename).slice(1), meta, filename, sourcePath)
      }
      output.push(rendered.split('\n').map((value, offset) => `${offset ? block.continuationPrefix : block.firstPrefix}${value}`).join('\n'))
      continue
    }

    const open = lines[index].match(/^\s*(:{3,})\s+demo(?:\s+(normal|vue|markdown))?(?:\s+(.*))?$/)
    if (!open) {
      output.push(lines[index])
      continue
    }
    const body: string[] = []
    while (++index < lines.length && !new RegExp(`^\\s*${open[1]}\\s*$`).test(lines[index])) body.push(lines[index])
    const code: Record<string, string> = {}
    for (let cursor = 0; cursor < body.length; cursor++) {
      const fence = body[cursor].match(/^\s*(`{3,}|~{3,})(.*)$/)
      if (!fence) continue
      const content: string[] = []
      while (++cursor < body.length && !new RegExp(`^\\s*${fence[1]}\\s*$`).test(body[cursor])) content.push(body[cursor])
      code[normalizeDemoLanguage(fence[2])] = content.join('\n').trim()
    }
    const type = (open[2] ?? 'normal') as DemoType
    const meta = demoMeta(open[3])
    const filename = sourcePath ? `${sourcePath}.demo-${index}.${type === 'vue' ? 'vue' : 'html'}` : path.join(process.cwd(), `demo-${index}.${type === 'vue' ? 'vue' : 'html'}`)
    if (type === 'markdown') {
      const markdown = code.md ?? ''
      if (markdown) output.push(renderMarkdownDemo(markdown, meta, sourcePath))
      else output.push(lines[index - body.length - 1], ...body, lines[index])
      continue
    }
    if (type === 'vue') {
      const language = code.vue ? 'vue' : code.ts ? 'ts' : 'js'
      const component = code[language] ?? ''
      if (!component) {
        output.push(lines[index - body.length - 1], ...body, lines[index])
        continue
      }
      const extraStyle = code.css || code.scss || code.less || code.stylus
      const compiledStyle = extraStyle ? (await compileDemoStyle(extraStyle, code.scss ? 'scss' : code.less ? 'less' : code.stylus ? 'stylus' : 'css', filename, 'data-v-vue-demo')).code : ''
      const display = renderPlain(body.join('\n'), false, sourcePath).trim()
      const rendered = await renderVueDemo(component, language, meta, filename, sourcePath, component, display, true)
      output.push(compiledStyle ? rendered.replace('</div>', `</div><style>${compiledStyle.replace(/<\/style/gi, '<\\/style')}</style>`) : rendered)
      continue
    }
    const config = code.json ? JSON.parse(code.json) as { jsLib?: unknown, cssLib?: unknown } : {}
    const normal: NormalDemoSource = {
      html: code.html ?? '',
      script: code.ts ?? code.js ?? '',
      style: code.scss ?? code.less ?? code.stylus ?? code.css ?? '',
      jsType: code.ts ? 'ts' : 'js',
      cssType: code.scss ? 'scss' : code.less ? 'less' : code.stylus ? 'stylus' : 'css',
      jsLib: Array.isArray(config.jsLib) ? config.jsLib.filter((value): value is string => typeof value === 'string') : [],
      cssLib: Array.isArray(config.cssLib) ? config.cssLib.filter((value): value is string => typeof value === 'string') : [],
    }
    if (normal.html || normal.script || normal.style) output.push(await renderNormalDemo(normal, meta, filename, sourcePath))
    else output.push(lines[index - body.length - 1], ...body, lines[index])
  }
  return output.join('\n')
}

const imageCards = (source: string, sourcePath?: string) => {
  const lines = source.split('\n')
  const output: string[] = []
  let fence = ''
  for (let index = 0; index < lines.length; index++) {
    const marker = lines[index].match(/^\s*(`{3,}|~{3,})/)?.[1]
    if (marker) {
      if (!fence) fence = marker[0]
      else if (fence === marker[0]) fence = ''
      output.push(lines[index])
      continue
    }
    if (fence || !/^\s*<(?:VP)?ImageCard\b/.test(lines[index])) {
      output.push(lines[index])
      continue
    }
    let tag = lines[index]
    while (!/\/?>\s*$/.test(tag) && index + 1 < lines.length) tag += ` ${lines[++index].trim()}`
    const props = attributes(tag)
    if (!props.image) {
      output.push(tag)
      continue
    }
    const numericWidth = props.width && String(Number(props.width)) === props.width ? `${props.width}px` : props.width
    const title = props.title ? escapeHtml(props.title) : ''
    const titleNode = title ? `<h3 class="title">${props.href ? `<a href="${escapeHtml(props.href)}" target="_blank" rel="noopener noreferrer" class="no-icon">${title}</a>` : `<span>${title}</span>`}</h3>` : ''
    let date = ''
    if (props.date) {
      const instance = new Date(/^\d+$/.test(props.date) ? Number(props.date) : props.date)
      if (!Number.isNaN(instance.getTime())) date = new Intl.DateTimeFormat(languageFromSourcePath(sourcePath), { year: 'numeric', month: 'short', day: 'numeric' }).format(instance)
    }
    const copyright = props.author || date ? `<p class="copyright">${props.author ? `<span>${escapeHtml(props.author)}</span>` : ''}${props.author && date ? '<span> | </span>' : ''}${date ? `<span>${escapeHtml(date)}</span>` : ''}</p>` : ''
    const description = props.description ? `<p class="description">${escapeHtml(props.description)}</p>` : ''
    const info = titleNode || copyright || description ? `<div class="image-info">${titleNode}${copyright}${description}</div>` : ''
    output.push(`<div class="vp-image-card${/(?:^|\s)center(?:\s|\/?>)/.test(tag) ? ' center' : ''}"${numericWidth ? ` style="width:${escapeHtml(numericWidth)}"` : ''}><div class="image-container"><img src="${escapeHtml(props.image)}" alt="${title}" loading="lazy">${info}</div></div>`)
  }
  return output.join('\n')
}

const swiperComponents = (source: string) => {
  const lines = source.split('\n')
  const output: string[] = []
  let fence = ''
  for (let index = 0; index < lines.length; index++) {
    const marker = lines[index].match(/^\s*(`{3,}|~{3,})/)?.[1]
    if (marker) {
      if (!fence) fence = marker[0]
      else if (fence === marker[0]) fence = ''
      output.push(lines[index])
      continue
    }
    if (fence || !/^\s*<Swiper\b/.test(lines[index])) {
      output.push(lines[index])
      continue
    }
    let tag = lines[index]
    while (!/\/?>\s*$/.test(tag) && index + 1 < lines.length) tag += ` ${lines[++index].trim()}`
    const props = attributes(tag)
    const rawItems = props[':items'] ?? props.items ?? '[]'
    const items = parseVueLiteral(rawItems) as Array<string | { link: string, href?: string, alt?: string }>
    if (!Array.isArray(items) || !items.length) {
      output.push(tag)
      continue
    }
    const value = (...names: string[]) => names.flatMap(name => [`:${name}`, name]).map(name => props[name]).find(item => item !== undefined)
    const number = (raw: string | undefined, fallback: number) => raw !== undefined && Number.isFinite(Number(raw)) ? Number(raw) : fallback
    const numberOrString = (raw: string | undefined, fallback: number | string) => raw === undefined ? fallback : Number.isFinite(Number(raw)) ? Number(raw) : raw
    const mode = ['banner', 'carousel', 'broadcast'].includes(props.mode) ? props.mode : 'banner'
    const effect = ['slide', 'fade', 'cube', 'flip', 'coverflow', 'cards', 'creative'].includes(props.effect) ? props.effect : 'slide'
    const creativeEffect = parseVueLiteral(value('creative-effect', 'creativeEffect') ?? '')
    const options = {
      mode,
      effect,
      navigation: boolOption(tag, props, 'navigation', 'navigation', true),
      delay: number(value('delay'), 3000),
      speed: number(value('speed'), 300),
      loop: boolOption(tag, props, 'loop', 'loop', true),
      pauseOnMouseEnter: boolOption(tag, props, 'pause-on-mouse-enter', 'pauseOnMouseEnter', false),
      swipe: boolOption(tag, props, 'swipe', 'swipe', true),
      mousewheel: boolOption(tag, props, 'mousewheel', 'mousewheel', false),
      slidesPerView: numberOrString(value('slides-per-view', 'slidesPerView'), 1),
      spaceBetween: numberOrString(value('space-between', 'spaceBetween'), 0),
      ...(creativeEffect && typeof creativeEffect === 'object' ? { creativeEffect } : {}),
    }
    const slides = items.map(item => {
      const slide = typeof item === 'string' ? { link: item } : item
      if (!slide?.link) return ''
      const image = `<img class="swiper-slide-img" src="${escapeHtml(slide.link)}" alt="${escapeHtml(slide.alt ?? '')}" loading="lazy">`
      return `<div class="swiper-slide">${slide.href ? `<a href="${escapeHtml(slide.href)}" target="_blank" rel="noopener noreferrer" class="swiper-slide-link no-icon">${image}</a>` : image}</div>`
    }).join('')
    const rawWidth = value('width')
    const rawHeight = value('height')
    const width = cssSize(rawWidth, rawWidth || '100%')
    const height = cssSize(rawHeight, rawHeight || '100%')
    output.push(`<div class="swiper vp-swiper${mode === 'carousel' || (mode === 'banner' && !options.swipe) ? ' swiper-no-swiping' : ''}" style="width:${escapeHtml(width)};height:${escapeHtml(height)}" data-swiper-options="${escapeHtml(JSON.stringify(options))}"><div class="swiper-wrapper">${slides}</div>${options.navigation && mode !== 'carousel' ? '<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>' : ''}${mode !== 'carousel' ? '<div class="swiper-pagination"></div>' : ''}</div>`)
  }
  return output.join('\n')
}

const renderCanIUse = (raw: string, rawFeature: string, index: number, defaultMode = 'embed') => {
  const feature = rawFeature.trim().replace(/_+/g, '_')
  if (!feature) return ''
  const mode = raw.replace(/\{.*$/, '').trim() || defaultMode
  if (mode === 'image') {
    const url = `https://caniuse.bitsofco.de/image/${encodeURIComponent(feature)}`
    const alt = escapeHtml(`Data on support for the ${feature} feature across the major browsers from caniuse.com`)
    return `<p><picture><source type="image/webp" srcset="${url}.webp"><source type="image/png" srcset="${url}.png"><img src="${url}.jpg" alt="${alt}" width="100%"></picture></p>`
  }
  const versions = raw.match(/\{(.*)\}/)?.[1] ?? ''
  const periods = versions.split(',').map(value => Number(value.trim())).filter(value => Number.isFinite(value) && value >= -5 && value <= 3)
  periods.push(0)
  const unique = [...new Set(periods)].sort((a, b) => b - a)
  const future = versions ? unique[0] : 1
  const past = versions ? Math.abs(unique.at(-1) ?? 0) : 2
  const baseline = mode === 'baseline'
  const meta = `ermaozi-${index}-${feature.replace(/[^\w-]/g, '-')}`
  const hash = baseline ? `meta=${meta}&theme=light` : `past=${past}&future=${future}&meta=${meta}&theme=light`
  return `<div class="ciu_embed${baseline ? ' baseline' : ''}" data-caniuse data-feature="${escapeHtml(feature)}" data-past="${past}" data-future="${future}" data-meta="${meta}" data-baseline="${baseline}"><iframe src="https://caniuse.pengzhanbo.cn/${encodeURIComponent(feature)}${baseline ? '/baseline' : ''}#${hash}" style="height:${baseline ? 150 : 350}px" title="Can I use ${escapeHtml(feature)}" loading="lazy"></iframe></div>`
}

const renderCodeEmbed = (type: string, raw: string, source: string) => {
  const props = attributes(raw)
  const width = cssSize(props.width, '100%')
  const dark = props.theme === 'dark'
  const themeLocked = props.theme === 'dark' || props.theme === 'light'
  if (type === 'codepen') {
    const [user = '', slash = ''] = source.split('/')
    const query = new URLSearchParams()
    if (hasFlag(raw, 'editable')) query.set('editable', 'true')
    query.set('default-tab', props.tab || 'result')
    query.set('theme-id', dark ? 'dark' : 'light')
    const mode = hasFlag(raw, 'preview') ? 'embed/preview' : 'embed'
    const src = `https://codepen.io/${encodeURIComponent(user)}/${mode}/${encodeURIComponent(slash)}?${query}`
    return `<iframe src="${escapeHtml(src)}" class="code-pen-iframe" title="${escapeHtml(props.title || 'Code Pen')}" style="width:${width};height:${cssSize(props.height, '400px')}" frameborder="0" loading="lazy" allowtransparency="true" allowfullscreen="true" data-code-embed="codepen"${themeLocked ? ' data-theme-locked' : ''}></iframe>`
  }
  if (type === 'jsfiddle') {
    const allowedTabs = ['js', 'css', 'html', 'result']
    const requestedTabs = (props.tab || '').split(',').map(item => item.trim()).filter(item => allowedTabs.includes(item))
    const tab = (requestedTabs.length ? requestedTabs : allowedTabs).join(',')
    const encodedSource = source.split('/').map(encodeURIComponent).join('/')
    const src = `https://jsfiddle.net/${encodedSource}/embedded/${tab}/${dark ? 'dark/' : ''}`
    return `<iframe class="js-fiddle-iframe" src="${escapeHtml(src)}" title="${escapeHtml(props.title || 'JS Fiddle')}" style="width:${width};height:${cssSize(props.height, '400px')}" frameborder="0" allowfullscreen="true" allowpaymentrequest="true" data-code-embed="jsfiddle" data-code-source="${escapeHtml(encodedSource)}" data-code-tab="${tab}"${themeLocked ? ' data-theme-locked' : ''}></iframe>`
  }
  if (type === 'codesandbox') {
    const [profile, filepath = ''] = source.split('#')
    const [user, id] = profile.includes('/') ? profile.split('/') : ['', profile]
    const button = hasFlag(raw, 'button')
    const query = new URLSearchParams()
    if (filepath) query.set(button ? 'file' : 'module', encodeURIComponent(filepath))
    if (button) query.set('from-embed', '')
    else {
      query.set('view', (props.layout || 'Editor+Preview').replaceAll(',', '+'))
      if (hasFlag(raw, 'console') || props.console === 'true') query.set('expanddevtools', '1')
      if (props.navbar === 'false') query.set('hidenavigation', '1')
    }
    const workspace = button && user ? `${user}-${id}` : id
    const src = `https://codesandbox.io/${button ? 'p/sandbox' : 'embed'}/${encodeURIComponent(workspace)}?${query}`
    if (button) return `<p><a class="code-sandbox-link no-icon" href="${escapeHtml(src)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(props.title || 'CodeSandbox')}"><svg xmlns="http://www.w3.org/2000/svg" width="165" height="32" viewBox="0 0 165 32" role="img" aria-hidden="true"><rect width="165" height="32" rx="4" fill="#e3ff73"/><path fill="#191919" fill-rule="evenodd" d="M10 10h13v13H10zm1.33 1.33v10.34h10.34V11.33z"/><text x="39" y="21" fill="#191919" font-family="system-ui,sans-serif" font-size="13" font-weight="600">Edit in CodeSandbox</text></svg></a></p>`
    const allow = 'accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking'
    const sandbox = 'allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts'
    return `<iframe src="${escapeHtml(src)}" class="code-sandbox-iframe" title="${escapeHtml(props.title || 'CodeSandbox')}" allow="${allow}" sandbox="${sandbox}" style="width:${width};height:${cssSize(props.height, '500px')}"></iframe>`
  }
  const normalized = source.startsWith('@') ? source : `@${source}`
  const [profile, hash = ''] = normalized.split('#')
  const encodedProfile = profile.split('/').map(encodeURIComponent).join('/')
  const query = new URLSearchParams({ embed: 'true', theme: dark ? 'dark' : 'light' })
  if (hash) query.set('file', hash)
  const src = `https://replit.com/${encodedProfile}?${query}`
  return `<iframe class="replit-iframe-wrapper" src="${escapeHtml(src)}" title="${escapeHtml(props.title || 'Replit')}" style="width:${width};height:${cssSize(props.height, '450px')}" allowtransparency="true" allowfullscreen="true" data-code-embed="replit"${themeLocked ? ' data-theme-locked' : ''}></iframe>`
}

const timeToSeconds = (time = '') => {
  if (!time) return 0
  if (Number.parseFloat(time) === Number(time)) return Number(time)
  const [seconds, minutes, hours = 0] = time.split(/\s*:\s*/).reverse().map(value => Number(value) || 0)
  return seconds + minutes * 60 + hours * 3600
}

const renderVideoEmbed = (type: 'acfun' | 'bilibili' | 'youtube', raw: string, source: string) => {
  const props = attributes(raw)
  const params = new URLSearchParams()
  let src = ''
  let title = props.title || type[0].toUpperCase() + type.slice(1)
  let ratio = props.ratio || ''
  if (type === 'acfun') {
    src = `https://www.acfun.cn/player/${source}`
    title = props.title || 'AcFun'
    ratio ||= '16:10'
  } else if (type === 'bilibili') {
    const ids = source.trim().split(/\s+/)
    const bvid = ids.find(id => id.startsWith('BV'))
    const [aid, cid] = ids.filter(id => !id.startsWith('BV'))
    const page = raw.split(/\s+/).map(value => value.match(/^p(\d+)$/)?.[1]).find(Boolean)
    if (bvid) params.set('bvid', bvid)
    if (aid) params.set('aid', aid)
    if (cid) params.set('cid', cid)
    if (page) params.set('p', page)
    const time = timeToSeconds(props.time)
    if (time) params.set('t', String(time))
    params.set('autoplay', hasFlag(raw, 'autoplay') || props.autoplay === 'true' ? '1' : '0')
    params.set('high_quality', '1')
    src = `https://player.bilibili.com/player.html?${params}`
    title = props.title || 'Bilibili'
  } else {
    if (hasFlag(raw, 'autoplay') || props.autoplay === 'true') params.set('autoplay', '1')
    if (hasFlag(raw, 'loop') || props.loop === 'true') params.set('loop', '1')
    const start = timeToSeconds(props.start)
    const end = timeToSeconds(props.end)
    if (start) params.set('start', String(start))
    if (end) params.set('end', String(end))
    src = `https://www.youtube.com/embed//${source}?${params}`
    title = props.title || 'YouTube'
  }
  const width = cssSize(props.width, '100%')
  const height = cssSize(props.height)
  const allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture'
  return `<iframe class="video-iframe ${type}" src="${escapeHtml(src)}" title="${escapeHtml(title)}" style="width:${width};height:auto" allow="${allow}" data-video-embed data-video-height="${escapeHtml(height)}" data-video-ratio="${escapeHtml(ratio)}"></iframe>`
}

const renderPdfEmbed = (raw: string, src: string) => {
  const props = attributes(raw)
  const page = raw.split(/\s+/).find(value => /^\d+$/.test(value)) || '1'
  const zoom = Number(props.zoom) || 50
  const width = cssSize(props.width, '100%')
  const height = cssSize(props.height)
  const ratio = props.ratio || ''
  const title = src.split(/[/?#]/).filter(Boolean).at(-1) || 'PDF Viewer'
  const pdf = markdownPower.pdf
  const pdfjsUrl = typeof pdf === 'object' ? pdf.pdfjsUrl ?? 'https://static.pengzhanbo.cn/pdfjs/' : 'https://static.pengzhanbo.cn/pdfjs/'
  return `<div class="pdf-viewer-wrapper" style="width:${width};height:auto" data-pdf-viewer data-pdf-src="${escapeHtml(src)}" data-pdf-page="${page}" data-pdf-toolbar="${hasFlag(raw, 'no-toolbar') ? '0' : '1'}" data-pdf-zoom="${zoom}" data-pdf-height="${escapeHtml(height)}" data-pdf-ratio="${escapeHtml(ratio)}" data-pdf-title="${escapeHtml(title)}" data-pdfjs-url="${escapeHtml(pdfjsUrl)}"></div>`
}

const audioReaderIcon = '<span class="icon-audio" aria-hidden="true"><svg fill="currentcolor" width="16" height="16" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill-rule="evenodd"><path d="M24.1538 5.86289C24.8505 5.23954 25.738 4.95724 26.6005 5.00519C27.463 5.05313 28.3137 5.43204 28.9371 6.12878C29.4928 6.74989 29.8 7.55405 29.8 8.38746V46.28C29.8 47.2149 29.4186 48.0645 28.8078 48.6754C28.197 49.2862 27.3474 49.6675 26.4125 49.6675C25.5843 49.6675 24.7848 49.3641 24.1651 48.8147L13.0526 38.9618C12.5285 38.4971 11.8523 38.2405 11.1518 38.2405H5.3875C4.45261 38.2405 3.603 37.8591 2.99218 37.2483C2.38135 36.6375 2 35.7879 2 34.853V19.7719C2 18.837 2.38135 17.9874 2.99218 17.3766C3.603 16.7658 4.45262 16.3844 5.3875 16.3844H11.2991C12.004 16.3844 12.6841 16.1246 13.2095 15.6546L24.1538 5.86289ZM25.8 9.75731L15.8766 18.6356C14.6178 19.7618 12.9881 20.3844 11.2991 20.3844H6V34.2405H11.1518C12.8302 34.2405 14.4505 34.8553 15.7064 35.9688L25.8 44.9184V9.75731Z"/><path class="audio-wave wave-1" d="M38.1519 17.8402L36.992 16.2108L33.7333 18.5304L34.8931 20.1598C36.2942 22.1281 37.1487 24.6457 37.1487 27.4131C37.1487 30.1933 36.2862 32.7214 34.8736 34.6937L33.709 36.3197L36.9609 38.6488L38.1255 37.0229C40.0285 34.366 41.1487 31.0221 41.1487 27.4131C41.1487 23.8207 40.0388 20.4911 38.1519 17.8402Z"/><path class="audio-wave wave-2" d="M43.617 8.17398L44.9714 9.64556C49.0913 14.1219 51.6179 20.3637 51.6179 27.2257C51.6179 34.0838 49.0943 40.3223 44.9787 44.798L43.6249 46.2702L40.6805 43.5627L42.0343 42.0905C45.4542 38.3714 47.6179 33.1061 47.6179 27.2257C47.6179 21.3419 45.4516 16.0739 42.0282 12.3544L40.6738 10.8828L43.617 8.17398Z"/></g></svg></span>'

const safeMediaSource = (value: string) => value !== '' && value === value.trim() && !/^(?:data|javascript|vbscript):/i.test(value)

const renderAudioReader = (raw: string, src: string, content = '') => {
  const props = attributes(raw)
  const title = content || (props.title ? escapeHtml(props.title) : '')
  return `<span class="vp-audio-reader" role="button" tabindex="0" aria-pressed="false" data-audio-reader data-audio-src="${escapeHtml(src.trim())}" data-audio-type="${escapeHtml(props.type || '')}" data-audio-autoplay="${hasFlag(raw, 'autoplay') ? 'true' : 'false'}" data-audio-start="${escapeHtml(props['start-time'] ?? props.startTime ?? '')}" data-audio-end="${escapeHtml(props['end-time'] ?? props.endTime ?? '')}" data-audio-volume="${escapeHtml(props.volume ?? '')}">${title}${audioReaderIcon}</span>`
}

const renderArtPlayer = (raw: string, src: string, markdownSyntax = true) => {
  const props = attributes(raw)
  const enabled = (kebab: string, camel = kebab) => hasFlag(raw, kebab) || props[kebab] === 'true' || props[camel] === 'true'
  const autoplay = enabled('autoplay')
  const options: Record<string, unknown> = {
    type: props.type || src.split(/[?#]/)[0].split('.').pop() || '',
    volume: props.volume === undefined ? .75 : Number(props.volume),
  }
  if (markdownSyntax) Object.assign(options, {
    autoplay,
    muted: enabled('muted') || autoplay,
    autoMini: enabled('auto-mini', 'autoMini'),
    loop: enabled('loop'),
    poster: props.poster || undefined,
    fullscreen: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    setting: true,
    pip: true,
  })
  else {
    const structural = new Set(['src', 'type', 'width', 'height', 'ratio', 'volume'])
    const value = (rawValue: string) => {
      if (rawValue === 'true' || rawValue === 'false') return rawValue === 'true'
      if (String(Number(rawValue)) === rawValue) return Number(rawValue)
      return parseVueLiteral(rawValue) ?? rawValue
    }
    for (const [rawKey, rawValue] of Object.entries(props)) {
      const key = rawKey.replace(/^:/, '').replace(/-([a-z])/g, (_match, letter: string) => letter.toUpperCase())
      if (!structural.has(key)) options[key] = value(rawValue)
    }
    for (const match of raw.matchAll(/(?:^|\s)([\w-]+)(?=\s|\/>|$)/g)) {
      const key = match[1].replace(/-([a-z])/g, (_matched, letter: string) => letter.toUpperCase())
      if (!structural.has(key)) options[key] = true
    }
  }
  const data = Buffer.from(JSON.stringify(options)).toString('base64')
  return `<div class="vp-artplayer-wrapper" data-artplayer data-artplayer-src="${escapeHtml(src.trim())}" data-artplayer-options="${data}" data-artplayer-ratio="${escapeHtml(props.ratio || '16:9')}" data-artplayer-height="${escapeHtml(props.height ? rectSize(props.height) : '')}"><div class="vp-artplayer" style="width:${escapeHtml(props.width ? rectSize(props.width) : '100%')}"></div><div class="md-power-loading absolute"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="15" stroke-dashoffset="15" stroke-linecap="round" stroke-width="2" d="M12 3C16.9706 3 21 7.02944 21 12"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="15;0"></animate><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"></animateTransform></path></svg></div></div>`
}

const artPlayerComponents = (source: string) => {
  const lines = source.split('\n')
  const output: string[] = []
  let fence = ''
  for (let index = 0; index < lines.length; index++) {
    const marker = lines[index].match(/^\s*(`{3,}|~{3,})/)?.[1]
    if (marker) {
      if (!fence) fence = marker[0]
      else if (fence === marker[0]) fence = ''
      output.push(lines[index])
      continue
    }
    if (fence || !/^\s*<ArtPlayer\b/i.test(lines[index])) {
      output.push(lines[index])
      continue
    }
    let tag = lines[index]
    while (!/\/>\s*$/.test(tag) && index + 1 < lines.length) tag += ` ${lines[++index].trim()}`
    const props = attributes(tag)
    output.push(props.src ? renderArtPlayer(tag, props.src, false) : tag)
  }
  return output.join('\n')
}

const renderEmbedDirective = (source: string, sourcePath: string | undefined, index: number) => {
  const match = source.match(/^@\[([A-Za-z][\w-]*)(?:\s+((?:"[^"]*"|'[^']*'|[^\]])*))?\]\(([^)]*)\)$/)
    ?? source.match(/^@\[(caniuse)(\{[^\]]*\})\]\(([^)]*)\)$/)
  if (!match) return
  const [, rawType, rawInfo = '', rawValue] = match
  const type = rawType === 'artPlayer' ? 'artplayer' : rawType
  const info = rawInfo.trim()
  const value = rawValue.trim()
  if (type === 'caniuse' && canIUseOptions()) return renderCanIUse(info, value, index, (canIUseOptions() || {}).mode)
  if (['codepen', 'jsfiddle', 'codesandbox', 'replit'].includes(type)) {
    const enabled = markdownPower[type === 'codesandbox' ? 'codeSandbox' : type as 'codepen' | 'jsfiddle' | 'replit']
    return enabled ? renderCodeEmbed(type, info, value) : undefined
  }
  if (type === 'artplayer') return markdownPower.artPlayer ? renderArtPlayer(info, value) : undefined
  if (['youtube', 'bilibili', 'acfun'].includes(type)) return markdownPower[type as 'youtube' | 'bilibili' | 'acfun']
    ? renderVideoEmbed(type as 'youtube' | 'bilibili' | 'acfun', info, value)
    : undefined
  if (type === 'video' && /^(?:https?:\/\/|\/)/.test(value)) return `<video class="vp-media" src="${escapeHtml(value)}" controls preload="metadata"></video>`
  if (type === 'audio' && /^(?:https?:\/\/|\/)/.test(value)) return `<audio class="vp-media" src="${escapeHtml(value)}" controls preload="metadata"></audio>`
  if (type === 'pdf') return markdownPower.pdf ? renderPdfEmbed(info, value) : undefined
  if (type === 'qrcode') return markdownPower.qrcode ? renderQrCode(info, value, sourcePath) : undefined
}

const cleanSource = (source: string, removeTitle = true, plotOptions: PlotOptions = {}, sourcePath = ''): string => {
  let fence = ''
  let scriptSetup = false
  let titleRemoved = false
  return npmBadges(source).split('\n').map((line) => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1]
    if (marker) {
      if (!fence) fence = marker[0]
      else if (fence === marker[0]) fence = ''
      return line
    }
    if (fence) return line
    if (/^\s*<script\s+setup[^>]*>/i.test(line)) scriptSetup = true
    if (scriptSetup) {
      if (/<\/script>\s*$/i.test(line)) scriptSetup = false
      return ''
    }
    if (removeTitle && !titleRemoved && /^\s*#\s+/.test(line)) {
      titleRemoved = true
      return ''
    }
    return badges(linkCards(line
      .replace(/^\s*<(?:VP)?CardGrid(?:\s+([^>]*))?>\s*$/i, (_match, raw = '') => cardGridOpen(raw))
      .replace(/^\s*<\/(?:VP)?CardGrid>\s*$/i, '</div>')
      .replace(/^\s*<(?:VP)?CardMasonry(?:\s+([^>]*))?>\s*$/i, (_match, raw = '') => cardMasonryOpen(raw))
      .replace(/^\s*<\/(?:VP)?CardMasonry>\s*$/i, '</div>')
      .replace(/^\s*<(?:VP)?Card(?:\s+([^>]*))?>\s*$/i, (_match, raw = '') => cardOpen(raw))
      .replace(/^\s*<\/(?:VP)?Card>\s*$/i, '</section></article>')
      .replace(markdownPower.audioReader ? /@\[audioReader((?:"[^"]*"|'[^']*'|[^\]])*)\]\(([^)]*)\)/gi : /(?!)/, (_match, raw: string, src: string) => safeMediaSource(src) ? renderAudioReader(raw.trim(), src) : _match)
      .replace(markdownPower.audioReader ? /<AudioReader\b([^>]*)>(.*?)<\/AudioReader>/gi : /(?!)/, (_match, raw: string, content: string) => safeMediaSource(attributes(raw).src || '') ? renderAudioReader(raw, attributes(raw).src, content) : _match)
      .replace(/<Plot\b([^>]*)>(.*?)<\/Plot>/gi, (_match, raw: string, content: string) => {
        const props = attributes(raw)
        const classes = new Set((props.class ?? '').split(/\s+/).filter(Boolean))
        const defaultTrigger = !classes.has('hover') && !classes.has('click') && !props.trigger
        if (!classes.has('hover') && !classes.has('click')) classes.add(props.trigger === 'click' ? 'click' : props.trigger === 'hover' ? 'hover' : plotOptions.trigger ?? 'hover')
        if (!classes.has('mask') && !classes.has('blur')) classes.add(props.effect === 'blur' ? 'blur' : props.effect === 'mask' ? 'mask' : plotOptions.effect ?? 'mask')
        return `<span class="vp-plot ${[...classes].join(' ')}"${defaultTrigger ? ' data-plot-default-trigger="true"' : ''}>${content}</span>`
      })
      .replace(/^\s*<RepoCard\b([^>]*)\/?>\s*$/i, (_match, raw: string) => {
        const props = attributes(raw)
        if (!props.repo) return _match
        const provider = props.provider === 'gitee' ? 'gitee' : 'github'
        const fullname = props.fullname ?? props[':fullname'] ?? (hasFlag(raw, 'fullname') ? 'true' : '')
        return `<div class="vp-repo-card" data-repo-card data-repo="${escapeHtml(props.repo)}" data-provider="${provider}"${fullname ? ` data-fullname="${escapeHtml(fullname)}"` : ''} hidden></div>`
      })
      .replace(markdownPower.qrcode ? /^\s*<VPQRCode\b([^>]*)\/?>\s*$/i : /(?!)/, (_match, raw: string) => {
        const props = attributes(raw)
        return renderQrCode(raw, props.text || '', sourcePath)
      })
      .replace(/<!--\s*more\s*-->/i, '')))
  }).join('\n')
}

const abbrPlugin = (md: MarkdownIt, defaults: Record<string, string> = {}) => {
  const definition = (state: any, startLine: number, _endLine: number, silent: boolean) => {
    let position = state.bMarks[startLine] + state.tShift[startLine]
    const end = state.eMarks[startLine]
    if (position + 2 >= end || state.src[position++] !== '*' || state.src[position++] !== '[') return false
    const labelStart = position
    let labelEnd = -1
    while (position < end) {
      if (state.src[position] === '[') return false
      if (state.src[position] === ']') {
        labelEnd = position
        break
      }
      if (state.src[position] === '\\') position++
      position++
    }
    if (labelEnd < 0 || state.src[labelEnd + 1] !== ':') return false
    if (silent) return true
    const label = state.src.slice(labelStart, labelEnd).replace(/\\(.)/g, '$1')
    const title = state.src.slice(labelEnd + 2, end).trim()
    if (!label || !title) return false
    state.env.abbreviations ??= {}
    state.env.abbreviations[label] ??= title
    state.line = startLine + 1
    return true
  }

  md.block.ruler.before('reference', 'abbr_definition', definition, { alt: ['paragraph', 'reference'] })
  md.core.ruler.after('linkify', 'abbr_replace', (state: any) => {
    const entries = Object.entries<string>({ ...defaults, ...state.env.abbreviations }).sort(([left], [right]) => right.length - left.length)
    if (!entries.length) return
    const { escapeRE, lib } = md.utils as typeof md.utils & { escapeRE: (value: string) => string, lib: { ucmicro: { P: RegExp, Z: RegExp } } }
    const labels = entries.map(([label]) => escapeRE(label)).join('|')
    const other = ' \r\n$+<=>^`|~'.split('').map(escapeRE).join('')
    const boundary = `${lib.ucmicro.P.source}|${lib.ucmicro.Z.source}|[${other}]`
    const quick = new RegExp(`(?:${labels})`)
    const matcher = new RegExp(`(^|${boundary})(${labels})($|${boundary})`, 'g')
    const titles = Object.fromEntries(entries)
    for (const token of state.tokens) {
      if (token.type !== 'inline') continue
      const children = token.children as any[]
      for (let index = children.length - 1; index >= 0; index--) {
        const child = children[index]
        if (child.type !== 'text' || !quick.test(child.content)) continue
        matcher.lastIndex = 0
        let match: RegExpExecArray | null
        let position = 0
        const replacements = []
        while ((match = matcher.exec(child.content))) {
          const [, before, label, after] = match
          if (match.index > 0 || before) {
            const text = new state.Token('text', '', 0)
            text.content = child.content.slice(position, match.index + before.length)
            replacements.push(text)
          }
          const abbreviation = new state.Token('abbreviation', 'span', 0)
          abbreviation.content = label
          abbreviation.meta = { title: titles[label] }
          replacements.push(abbreviation)
          matcher.lastIndex -= after.length
          position = matcher.lastIndex
        }
        if (!replacements.length) continue
        if (position < child.content.length) {
          const text = new state.Token('text', '', 0)
          text.content = child.content.slice(position)
          replacements.push(text)
        }
        children.splice(index, 1, ...replacements)
      }
    }
  })
  md.renderer.rules.abbreviation = (tokens: any[], index: number, _options, env: any) => {
    const label = escapeHtml(tokens[index].content)
    const rendered = md.renderInline(tokens[index].meta.title, {
      references: env.references,
      abbreviations: env.abbreviations,
      annotations: env.annotations,
    })
    const title = escapeHtml(rendered.replace(/<[^>]*>/g, ''))
    return `<span class="vp-abbr" role="tooltip" tabindex="0" aria-label="${title}" data-abbr-content="${encoded(rendered)}">${label}</span>`
  }
}

const annotationPlugin = (md: MarkdownIt, defaults: Record<string, string | string[]> = {}) => {
  const preset = Object.fromEntries(Object.entries(defaults).map(([label, value]) => [label, Array.isArray(value) ? value : [value]]))
  const definition = (state: any, startLine: number, endLine: number, silent: boolean) => {
    const start = state.bMarks[startLine] + state.tShift[startLine]
    const max = state.eMarks[startLine]
    const line = state.src.slice(start, max)
    const match = line.match(/^\[\+([^\]\s]+)\]:\s*(.*)$/)
    if (!match) return false
    if (silent) return true
    let content = match[2]
    let nextLine = startLine + 1
    while (nextLine < endLine) {
      const nextStart = state.bMarks[nextLine] + state.tShift[nextLine]
      const nextMax = state.eMarks[nextLine]
      const source = state.src.slice(nextStart, nextMax).trim()
      if (state.sCount[nextLine] < state.blkIndent + 2 && source) break
      content += `\n${source}`
      nextLine++
    }
    state.env.annotations ??= {}
    state.env.annotations[match[1]] ??= []
    state.env.annotations[match[1]].push(content)
    state.line = nextLine
    return true
  }
  const reference = (state: any, silent: boolean) => {
    const match = state.src.slice(state.pos, state.posMax).match(/^\[\+([^\]\s]+)\]/)
    if (!match || !(state.env.annotations?.[match[1]]?.length || preset[match[1]]?.length)) return false
    if (!silent) {
      const token = state.push('annotation_ref', '', 0)
      token.meta = { label: match[1] }
    }
    state.pos += match[0].length
    return true
  }
  md.block.ruler.before('reference', 'annotation_definition', definition, { alt: ['paragraph', 'reference'] })
  md.inline.ruler.before('image', 'annotation_reference', reference)
  md.renderer.rules.annotation_ref = (tokens: any[], index: number, _options, env: any) => {
    const label = tokens[index].meta.label
    const sources = (env.annotations?.[label] ?? preset[label]) as string[]
    const content = sources.map(source => `<div class="annotation">${md.render(source, {
      imageIndex: 0,
      abbreviations: env.abbreviations,
      annotations: env.annotations,
    })}</div>`).join('')
    return `<button class="vp-annotation ignore-header bottom" aria-label="${escapeHtml(label)}" aria-expanded="false" data-annotation-content="${encoded(content)}" data-annotation-total="${sources.length}"><span class="vpi-annotation"></span></button>`
  }
}

const envPresetPlugin = (md: MarkdownIt) => {
  const references = Object.fromEntries(Object.entries(markdownEnv.references ?? {}).map(([label, value]) => [
    md.utils.normalizeReference(label),
    typeof value === 'string' ? { href: value, title: '' } : { title: '', ...value },
  ]))
  if (!Object.keys(references).length) return
  const render = md.render.bind(md)
  md.render = (source, env = {}) => {
    env.references = { ...references, ...env.references }
    return render(source, env)
  }
  const renderInline = md.renderInline.bind(md)
  md.renderInline = (source, env = {}) => {
    env.references = { ...references, ...env.references }
    return renderInline(source, env)
  }
}

const plotPlugin = (md: MarkdownIt) => {
  md.inline.ruler.before('emphasis', 'plot', (state: any, silent: boolean) => {
    const start = state.pos
    const max = state.posMax
    if (state.src.charCodeAt(start) !== 0x21 || state.src.charCodeAt(start + 1) !== 0x21) return false
    const next = state.src.charCodeAt(start + 2)
    if (next === 0x20 || next === 0x21 || max - start < 5 || silent) return false
    state.pos = start + 2
    while (state.pos < max && !(state.src.charCodeAt(state.pos) === 0x21 && state.src.charCodeAt(state.pos + 1) === 0x21)) state.md.inline.skipToken(state)
    if (state.pos >= max || start + 2 === state.pos || state.src.charCodeAt(state.pos - 1) === 0x20) {
      state.pos = start
      return false
    }
    const end = state.pos
    state.posMax = end
    state.pos = start + 2
    state.push('plot_inline_open', 'span', 1).markup = '!!'
    const content = state.push('text', '', 0)
    content.content = state.src.slice(start + 2, end)
    state.push('plot_inline_close', 'span', -1).markup = '!!'
    state.pos = end + 2
    state.posMax = max
    return true
  })
  md.renderer.rules.plot_inline_open = (tokens: any[], index: number, _options, env: { plot?: PlotOptions }, self) => {
    const token = tokens[index]
    const classes = new Set((token.attrGet('class') ?? '').split(/\s+/).filter(Boolean))
    const defaultTrigger = !classes.has('hover') && !classes.has('click')
    if (defaultTrigger) classes.add(env.plot?.trigger ?? globalPlotOptions.trigger ?? 'hover')
    if (!classes.has('mask') && !classes.has('blur')) classes.add(env.plot?.effect ?? globalPlotOptions.effect ?? 'mask')
    classes.add('vp-plot')
    token.attrSet('class', [...classes].join(' '))
    if (defaultTrigger) token.attrSet('data-plot-default-trigger', 'true')
    return `<span${self.renderAttrs(token)}>`
  }
  md.renderer.rules.plot_inline_close = () => '</span>'
}

const parseCollapse = (tokens: any[], index: number, expandAll: boolean) => {
  const listStack: number[] = []
  let itemIndex = -1
  for (let cursor = index + 1; cursor < tokens.length; cursor++) {
    const token = tokens[cursor]
    if (token.type === 'container_collapse_close') break
    if (token.type === 'bullet_list_open' || token.type === 'ordered_list_open') {
      listStack.push(cursor)
      if (listStack.length === 1) token.hidden = true
    } else if (token.type === 'bullet_list_close' || token.type === 'ordered_list_close') {
      listStack.pop()
      if (!listStack.length) token.hidden = true
    } else if (token.type === 'list_item_open' && listStack.length === 1) {
      itemIndex++
      const title = tokens[cursor + 2]?.children?.[0]
      let expanded = expandAll
      if (title?.type === 'text') title.content = title.content.trim().replace(/^:[+\-]\s*/, (flag: string) => {
        expanded = flag.trim() === ':+'
        return ''
      })
      token.type = 'collapse_item_open'
      token.meta = { expanded, itemIndex }
      tokens[cursor + 1].type = 'collapse_item_title_open'
      tokens[cursor + 1].meta = token.meta
      tokens[cursor + 3].type = 'collapse_item_title_close'
      tokens[cursor + 3].meta = token.meta
    } else if (token.type === 'list_item_close' && listStack.length === 1) {
      token.type = 'collapse_item_close'
    }
  }
}

const collapsePlugin = (md: MarkdownIt) => {
  md.use(container, 'collapse', {
    render(tokens: any[], index: number) {
      if (tokens[index].nesting === -1) return '</div>\n'
      const info = tokens[index].info.slice('collapse'.length)
      parseCollapse(tokens, index, /(?:^|\s)expand(?:\s|$|=)/.test(info))
      return `<div class="vp-collapse"${/(?:^|\s)accordion(?:\s|$|=)/.test(info) ? ' data-accordion' : ''}>\n`
    },
  })
  md.renderer.rules.collapse_item_open = (tokens: any[], index: number) => {
    const { expanded } = tokens[index].meta
    return `<div class="vp-collapse-item${expanded ? ' expanded' : ''}">`
  }
  md.renderer.rules.collapse_item_title_open = (tokens: any[], index: number) => {
    const { expanded, itemIndex } = tokens[index].meta
    return `<button class="vp-collapse-header" type="button" aria-expanded="${expanded}" data-collapse-index="${itemIndex}"><span class="vpi-chevron-right" aria-hidden="true"></span><span class="vp-collapse-title">`
  }
  md.renderer.rules.collapse_item_title_close = (tokens: any[], index: number) => {
    const { expanded } = tokens[index].meta
    return `</span></button><div class="vp-collapse-content"${expanded ? '' : ' hidden'}><div class="vp-collapse-content-inner">`
  }
  md.renderer.rules.collapse_item_close = () => '</div></div></div>'
}

const parseFileTree = (tokens: any[], index: number, mode: FileTreeIconMode) => {
  let depth = 0
  for (let cursor = index + 1; cursor < tokens.length; cursor++) {
    const token = tokens[cursor]
    if (token.type === 'container_file-tree_close') break
    if (token.type === 'bullet_list_open') {
      depth++
      if (depth === 1) token.hidden = true
      else token.type = 'file_tree_group_open'
    } else if (token.type === 'bullet_list_close') {
      if (depth === 1) token.hidden = true
      else token.type = 'file_tree_group_close'
      depth--
    } else if (token.type === 'list_item_open') {
      const close = tokens.findIndex((candidate, candidateIndex) => candidateIndex > cursor && candidate.type === 'list_item_close' && candidate.level === token.level)
      const label = tokens[cursor + 2]
      const parsed = parseFileTreeNodeInfo(label?.content ?? '')
      const folder = parsed.type === 'folder' || tokens.slice(cursor, close < 0 ? cursor : close).some(candidate => candidate.type === 'bullet_list_open')
      token.type = 'file_tree_node_open'
      token.meta = { depth: depth - 1, folder, emptyFolder: folder && parsed.type === 'folder' && !tokens.slice(cursor, close < 0 ? cursor : close).some(candidate => candidate.type === 'bullet_list_open'), mode, ...parsed, expanded: folder && parsed.expanded }
      const paragraph = tokens[cursor + 1]
      const paragraphClose = tokens[cursor + 3]
      if (paragraph?.type === 'paragraph_open') paragraph.hidden = true
      if (label?.type === 'inline') {
        label.type = 'file_tree_label'
        label.meta = token.meta
      }
      if (paragraphClose?.type === 'paragraph_close') paragraphClose.hidden = true
    } else if (token.type === 'list_item_close') {
      token.type = 'file_tree_node_close'
    }
  }
}

const fileTreePlugin = (md: MarkdownIt) => {
  md.use(container, 'file-tree', {
    render(tokens: any[], index: number, _options: unknown, env: { sourcePath?: string }) {
      if (tokens[index].nesting === -1) return '</div>\n'
      const raw = tokens[index].info.trim().slice('file-tree'.length).trim()
      const props = attributes(raw)
      const title = props.title ?? (raw.includes('=') ? '' : raw)
      const mode = (props.icon === 'simple' ? 'simple' : (siteConfig.markdown as { fileTree?: { icon?: FileTreeIconMode } }).fileTree?.icon ?? 'colored') as FileTreeIconMode
      const locale = markdownPowerCommonLocale(env.sourcePath)
      parseFileTree(tokens, index, mode)
      return `<div class="vp-file-tree">${title ? `<p class="vp-file-tree-title">${escapeHtml(title)}</p>` : ''}<button type="button" class="vp-copy-code-button" data-copy-tree aria-label="${escapeHtml(locale.copy)}" data-copied="${escapeHtml(locale.copied)}"></button>\n`
    },
  })
  md.renderer.rules.file_tree_group_open = () => '<div class="group">'
  md.renderer.rules.file_tree_group_close = () => '</div>'
  md.renderer.rules.file_tree_node_open = (tokens: any[], index: number) => {
    const { depth, folder, filename, focus, diff, expanded, mode } = tokens[index].meta
    const classes = [folder ? 'folder' : 'file', focus ? 'focus' : '', diff ?? '', diff ? 'diff' : '', expanded ? 'expanded' : ''].filter(Boolean).join(' ')
    return `<div class="vp-file-tree-node"><p class="vp-file-tree-info ${classes}" style="--file-tree-level:${-depth}"${folder ? ` role="button" tabindex="0" aria-expanded="${expanded}"` : ''}>${renderFileTreeIcon(filename, folder ? 'folder' : 'file', mode)}<span class="name ${folder ? 'folder' : 'file'}">`
  }
  md.renderer.rules.file_tree_label = (tokens: any[], index: number) => {
    const { filename, comment, emptyFolder, depth } = tokens[index].meta
    const omitted = emptyFolder ? `<div class="group"><div class="vp-file-tree-node generated"><p class="vp-file-tree-info file" style="--file-tree-level:${-(depth + 1)}"><span class="name file">…</span></p></div></div>` : ''
    return `${escapeHtml(filename)}</span>${comment ? `<span class="comment">${md.renderInline(comment.replaceAll('#', '\\#'))}</span>` : ''}</p>${omitted}`
  }
  md.renderer.rules.file_tree_node_close = () => '</div>'
}

const timelinePlugin = (md: MarkdownIt) => {
  md.use(container, 'timeline', {
    render(tokens: any[], index: number) {
      if (tokens[index].nesting === -1) return '</div></div>\n'
      const info = tokens[index].info.slice('timeline'.length).trim()
      const props = attributes(info)
      const defaults = {
        horizontal: boolOption(info, props, 'horizontal', 'horizontal', false),
        card: boolOption(info, props, 'card', 'card', false),
        placement: props.placement ?? 'left',
        line: props.line ?? 'solid',
      }
      const stack: number[] = []
      let current: Record<string, string | boolean> = {}
      for (let cursor = index + 1; cursor < tokens.length; cursor++) {
        const token = tokens[cursor]
        if (token.type === 'container_timeline_close') break
        if (token.type === 'bullet_list_open') {
          stack.push(cursor)
          if (stack.length === 1) token.hidden = true
        } else if (token.type === 'bullet_list_close') {
          stack.pop()
          if (!stack.length) token.hidden = true
        } else if (token.type === 'list_item_open' && stack.length === 1) {
          const inline = tokens[cursor + 2]
          const softbreak = inline?.children?.findLastIndex((child: any) => child.type === 'softbreak') ?? -1
          const last = inline?.children?.at(-1)
          const item: Record<string, string> = {}
          let buffer = softbreak >= 0 && last?.type === 'text' ? last.content.trim() : ''
          while (buffer) {
            const key = buffer.match(/(\w+)=\s*/)
            if (!key || !['time', 'type', 'icon', 'line', 'color', 'card', 'placement'].includes(key[1].toLowerCase())) break
            buffer = buffer.slice((key.index ?? 0) + key[0].length)
            const end = buffer.search(/\s+\w+=\s*|$/)
            item[key[1].toLowerCase()] = buffer.slice(0, end < 0 ? buffer.length : end).trim().replace(/(?<quote>["'])(.*?)(\k<quote>)/, '$2')
            buffer = buffer.slice(end < 0 ? buffer.length : end)
          }
          if (Object.keys(item).length) inline.children = inline.children.slice(0, softbreak)
          current = { ...item, timelineHorizontal: defaults.horizontal, timelineCard: defaults.card, timelinePlacement: defaults.placement, timelineLine: defaults.line }
          token.type = 'timeline_item_open'
          token.meta = current
          tokens[cursor + 1].type = 'timeline_item_title_open'
          tokens[cursor + 3].type = 'timeline_item_title_close'
        } else if (token.type === 'list_item_close' && stack.length === 1) {
          token.type = 'timeline_item_close'
          token.meta = current
        }
      }
      return `<div class="vp-timeline${defaults.horizontal ? ' horizontal' : ''}"><div class="vp-timeline-box">\n`
    },
  })
  md.renderer.rules.timeline_item_open = (tokens: any[], index: number) => {
    const meta = tokens[index].meta
    const horizontal = meta.timelineHorizontal === true
    const between = !horizontal && meta.timelinePlacement === 'between'
    const itemPlacement = meta.placement === 'right' ? 'right' : 'left'
    const placement = between ? itemPlacement : meta.timelinePlacement === 'between' ? 'left' : meta.timelinePlacement
    const card = meta.card === undefined ? meta.timelineCard === true : meta.card !== 'false'
    const type = meta.type ?? 'info'
    const line = meta.line ?? meta.timelineLine ?? 'solid'
    const classes = ['vp-timeline-item', card ? 'card' : '', horizontal ? 'horizontal' : '', type, `line-${line}`, !between && !horizontal ? `placement-${placement}` : '', between ? 'between' : '', between ? `between-${placement}` : ''].filter(Boolean).join(' ')
    const style = meta.color ? ` style="--vp-timeline-c-line:${escapeHtml(meta.color)};--vp-timeline-c-point:${escapeHtml(meta.color)}"` : ' style=""'
    const responsive = between ? ` data-timeline-between="${itemPlacement}"` : ''
    const icon = meta.icon ? renderIcon(`iconify ${meta.icon}`) : ''
    return `<div class="${classes}"${responsive}${style}><div class="${meta.icon ? 'has-icon ' : ''}vp-timeline-line"><span class="vp-timeline-point">${icon}</span></div><div class="vp-timeline-container"><div class="vp-timeline-content">`
  }
  md.renderer.rules.timeline_item_title_open = () => '<p class="vp-timeline-title">'
  md.renderer.rules.timeline_item_title_close = () => '</p>'
  md.renderer.rules.timeline_item_close = (tokens: any[], index: number) => `${tokens[index].meta.time ? `</div><p class="vp-timeline-time">${escapeHtml(tokens[index].meta.time)}</p>` : '</div>'}</div></div>`
}

const chartPlugin = (md: MarkdownIt) => {
  let index = 0
  let flowIndex = 0
  let markmapIndex = 0
  const loading = (className: string, height: number) => `<div class="${className}" style="display:flex;align-items:center;justify-content:center;height:${height}px"><span class="vp-loading-icon"></span></div>`
  const allowScript = (sourcePath = '') => {
    if (!siteConfig.markdown?.DANGEROUS_ALLOW_SCRIPT_EXECUTION) return false
    const allowlist = siteConfig.markdown.DANGEROUS_SCRIPT_EXECUTION_ALLOWLIST as '*' | string[]
    if (allowlist === '*') return true
    const relative = routeFromSourcePath(sourcePath).replace(/^\//, '')
    return Array.isArray(allowlist) && allowlist.some((entry: string) => {
      const normalized = entry.replaceAll('\\', '/').replace(/^\//, '')
      return relative === (normalized.endsWith('.md') ? normalized : `${normalized}.md`)
    })
  }
  const render = (type: 'chartjs' | 'echarts', title: string, config: string, configType: 'json' | 'js' = 'json') => {
    const data = Buffer.from(config).toString('base64')
    const heading = title ? `<div class="${type}-title">${escapeHtml(title)}</div>` : ''
    return type === 'chartjs'
      ? `${heading}${loading('chartjs-loading', 192)}<div class="chartjs-wrapper" style="display:none" data-chartjs data-chart-type="${configType}" data-chart-config="${data}" data-chart-index="${index++}"><canvas height="400"></canvas></div>`
      : `${heading}<div class="echarts-wrapper" data-echarts data-chart-type="${configType}" data-chart-config="${data}" data-chart-index="${index++}"><div class="echarts-container"></div>${loading('echarts-loading', 360)}</div>`
  }
  for (const type of ['chartjs', 'echarts'] as const) {
    if (!markdownChart[type]) continue
    md.use(container, type, {
      render(tokens: any[], tokenIndex: number, _options: unknown, env: { sourcePath?: string }) {
        if (tokens[tokenIndex].nesting === -1) return ''
        const title = tokens[tokenIndex].info.trim().slice(type.length).trim()
        let config = '{}'
        let configType: 'json' | 'js' = 'json'
        for (let cursor = tokenIndex + 1; cursor < tokens.length; cursor++) {
          if (tokens[cursor].type === `container_${type}_close`) break
          if (tokens[cursor].type === 'fence') {
            const language = tokens[cursor].info.trim()
            if (language === 'json') config = tokens[cursor].content
            else if (language === 'js' || language === 'javascript') {
              config = tokens[cursor].content
              configType = 'js'
            }
          }
          tokens[cursor].type = 'chart_empty'
          tokens[cursor].hidden = true
        }
        return configType === 'js' && !allowScript(env.sourcePath) ? '' : render(type, title, config, configType)
      },
    })
  }
  md.renderer.rules.chart_empty = () => ''
  if (markdownChart.flowchart) md.renderer.rules.flowchart = (tokens, tokenIndex) => {
    const configuredPreset = tokens[tokenIndex].info.trim().split(':', 2)[1]
    const preset = configuredPreset === 'ant' || configuredPreset === 'pie' || configuredPreset === 'vue' ? configuredPreset : 'vue'
    const data = Buffer.from(tokens[tokenIndex].content).toString('base64')
    const id = `flowchart-${flowIndex++}`
    return `${loading('flowchart-loading', 192)}<div class="flowchart-wrapper ${preset}" style="display:none" id="${id}" data-flowchart data-flow-code="${data}" data-flow-preset="${preset}"></div>\n`
  }
  if (markdownChart.markmap) md.renderer.rules.markmap = (tokens, tokenIndex) => {
    const data = Buffer.from(tokens[tokenIndex].content).toString('base64')
    return `<div class="markmap-wrapper" data-markmap data-markmap-content="${data}" data-markmap-index="${markmapIndex++}"><svg class="markmap-svg"></svg>${loading('markmap-loading', 360)}</div>\n`
  }
  const fence = md.renderer.rules.fence
  md.renderer.rules.fence = (tokens, tokenIndex, options, env, self) => {
    const [type, title = ''] = tokens[tokenIndex].info.trim().split(':', 2)
    if (markdownChart.echarts && type === 'echarts') return render('echarts', title, tokens[tokenIndex].content)
    return fence ? fence(tokens, tokenIndex, options, env, self) : self.renderToken(tokens, tokenIndex, options)
  }
}

const createMarkdown = () => {
  const slugger = new GithubSlugger()
  let tabGroup = 0
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: false,
  })

  if (markdownPowerEnabled) md.block.ruler.before('paragraph', 'plume_embed', (state, startLine, _endLine, silent) => {
    const start = state.bMarks[startLine] + state.tShift[startLine]
    const rendered = renderEmbedDirective(state.src.slice(start, state.eMarks[startLine]), state.env.sourcePath, startLine)
    if (rendered === undefined) return false
    if (silent) return true
    const token = state.push('html_block', '', 0)
    token.content = `${rendered}\n`
    token.map = [startLine, startLine + 1]
    state.line = startLine + 1
    return true
  }, { alt: ['paragraph', 'reference', 'blockquote', 'list'] })

  const includeEnvironmentRule = (start: boolean) => (state: any, startLine: number, _endLine: number, silent: boolean) => {
    const line = state.src.slice(state.bMarks[startLine] + state.tShift[startLine], state.eMarks[startLine])
    const match = start ? line.match(/^<!-- #include-env-start: (.*?) -->$/) : line === '<!-- #include-env-end -->' ? [line] : null
    if (!match) return false
    if (silent) return true
    state.line = startLine + 1
    const token = state.push(start ? 'include_start' : 'include_end', '', 0)
    token.map = [startLine, state.line]
    token.info = start ? match[1] : ''
    return true
  }
  md.block.ruler.before('table', 'md_include_start', includeEnvironmentRule(true), { alt: ['paragraph', 'reference', 'blockquote', 'list'] })
  md.block.ruler.before('table', 'md_include_end', includeEnvironmentRule(false), { alt: ['paragraph', 'reference', 'blockquote', 'list'] })
  md.renderer.rules.include_start = (tokens, index, _options, env: any) => {
    ;(env.includedPaths ??= []).push(tokens[index].info)
    return ''
  }
  md.renderer.rules.include_end = (_tokens, _index, _options, env: any) => {
    env.includedPaths?.pop()
    return ''
  }
  const resolveIncludedPath = (attribute: 'href' | 'src', token: any, env: any) => {
    const settings = includeOptions()
    if (!settings || (attribute === 'href' ? !settings.resolveLinkPath : !settings.resolveImagePath)) return
    const value = token.attrGet(attribute)
    const includedPath = env.includedPaths?.at(-1)
    if (!value?.startsWith('.') || !includedPath || !env.sourcePath) return
    const suffixAt = value.search(/[?#]/)
    const suffix = suffixAt < 0 ? '' : value.slice(suffixAt)
    const reference = suffixAt < 0 ? value : value.slice(0, suffixAt)
    let resolved = path.relative(path.dirname(env.sourcePath), path.resolve(includedPath, reference)).replaceAll(path.sep, '/')
    if (!resolved.startsWith('.')) resolved = `./${resolved}`
    token.attrSet(attribute, `${resolved}${suffix}`)
  }

  if (markdownPowerEnabled) {
    md.use(cjkFriendly)
    md.use(attrs)
    md.use(footnote)
  }
  if (mathjaxPlugin && mathjaxInstance) md.use(mathjaxPlugin, mathjaxInstance)
  else if (mathConfiguration !== false) {
    const { type: _mathType, copy: _mathCopy, mhchem: _mathMhchem, ...mathOptions } = mathConfiguration
    md.use(katex, {
      ...mathOptions,
      transformer: (content: string) => content.replaceAll(/^(?<tag><[a-z]+ )/gu, '$<tag>v-pre '),
    })
  }
  md.use(emoji)
  if (markdownPowerEnabled) {
    md.use(mark)
    md.use(sub)
    md.use(sup)
    md.use(tasklist)
    md.use(iconPlugin)
    md.use(envPresetPlugin)
    if (markdownPower.abbr) md.use(abbrPlugin, abbreviationPresets)
    if (markdownPower.annotation) md.use(annotationPlugin, annotationPresets)
    if (markdownPower.plot !== false) md.use(plotPlugin)
    installObsidian(md, container, obsidianOptions, {
      artPlayer: src => markdownPower.artPlayer ? renderArtPlayer('', src) : `<ArtPlayer src="${escapeHtml(src)}" />`,
      pdf: (src, page, height) => markdownPower.pdf ? renderPdfEmbed(`${page}${height ? ` height="${height}"` : ''}`, src) : `<PDFViewer src="${escapeHtml(src)}" width="100%" page="${escapeHtml(page)}"${height ? ` height="${escapeHtml(height)}"` : ''} />`,
      markdown: (source, sourcePath, stack, pages) => renderPlain(source, false, sourcePath, stack, pages),
    })
  }
  const plantumlOptions = markdownChart.plantuml
  if (Array.isArray(plantumlOptions)) plantumlOptions.forEach(options => md.use(plantuml, options))
  else if (plantumlOptions) for (const name of ['chronology', 'gantt', 'json', 'latex', 'math', 'mindmap', 'regex', 'salt', 'uml', 'wbs', 'yaml']) md.use(plantuml, { name })

  if (markdownImage) {
    if (markdownImage.figure) md.use(figure, typeof markdownImage.figure === 'object' ? markdownImage.figure : {})
    if (markdownImage.lazyload) md.use(imgLazyload)
    if (markdownImage.size) md.use(imgSize)
    if (markdownImage.legacySize) md.use(legacyImageSize)
    if (markdownImage.obsidianSize) md.use(obsidianImgSize)
    if (markdownImage.mark) md.use(imgMark, typeof markdownImage.mark === 'object' ? markdownImage.mark : {})
  }

  md.use(anchor, {
    slugify: (value: string) => slugger.slug(value),
    permalink: anchor.permalink.headerLink({
      class: 'header-anchor',
      safariReaderFix: true,
    }),
  })
  md.use(tocPlugin)

  const linkOpen = md.renderer.rules.link_open
  md.renderer.rules.link_open = (tokens, index, options, env, self) => {
    resolveIncludedPath('href', tokens[index], env)
    let href = tokens[index].attrGet('href') ?? ''
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) {
      tokens[index].attrSet('target', '_blank')
      tokens[index].attrSet('rel', 'noopener noreferrer')
    } else if (href && !href.startsWith('#')) {
      const suffixAt = href.search(/[?#]/)
      const suffix = suffixAt < 0 ? '' : href.slice(suffixAt)
      let reference = suffixAt < 0 ? href : href.slice(0, suffixAt)
      if (reference.endsWith('.html')) reference = `${reference.slice(0, -5)}.md`
      if (/(?:\.md|\/$)/i.test(reference)) {
        const page = resolveContentPage(reference, env.sourcePath, env.obsidianPages)
        if (page) {
          href = `${page.route}${suffix}`
          tokens[index].attrSet('href', href)
        }
      }
      tokens[index].attrJoin('class', 'vp-link link')
    }
    return linkOpen ? linkOpen(tokens, index, options, env, self) : self.renderToken(tokens, index, options)
  }

  const hintTypes = ['info', 'note', 'tip', 'warning', 'caution', 'important'] as const
  const hintLocaleEntries = [
    [['en', 'en-US'], ['Important', 'Info', 'Note', 'Tips', 'Warning', 'Caution', 'Details']],
    [['zh', 'zh-CN', 'zh-Hans'], ['重要', '相关信息', '注', '提示', '注意', '警告', '详情']],
    [['zh-TW', 'zh-Hant'], ['重要', '相關信息', '注', '提示', '注意', '警告', '詳情']],
    [['de', 'de-DE', 'de-AT'], ['Wichtig', 'Information', 'Notiz', 'Tips', 'Warnung', 'Gefahr', 'Details']],
    [['vi', 'vi-VN'], ['Quan trọng', 'Thông tin', 'Note', 'Tips', 'Lưu ý', 'Cẩn thận', 'Chi tiết']],
    [['uk'], ['Важливо', 'Інформація', 'Note', 'Поради', 'Примітка', 'Увага', 'Деталь']],
    [['ru', 'ru-RU'], ['Важно', 'Инфо', 'Заметка', 'Совет', 'Примечание', 'Предупреждение', 'Подробности']],
    [['br'], ['Importante', 'Informativo', 'Note', 'Dicas', 'Avisos', 'Cuidado', 'Detalhe']],
    [['pl', 'pl-PL'], ['Ważne', 'Info', 'Notatka', 'Porady', 'Ostrzeżenie', 'Uwaga', 'Dane']],
    [['sk', 'sk-SK'], ['Dôležité', 'Info', 'Poznámka', 'Tip', 'Upozornenie', 'Pozor', 'Podrobnosti']],
    [['fr', 'fr-FR'], ['Important', 'Info', 'Note', 'Conseil', 'Avertissement', 'Attention', 'Details']],
    [['es', 'es-ES'], ['Importante', 'Información', 'Nota', 'Consejos', 'Aviso', 'Advertencia', 'Detalles']],
    [['ja', 'ja-JP'], ['重要', '関連情報', '注', 'ヒント', '注意', '警告', '詳細']],
    [['tr', 'tr-TR'], ['Önemli', 'Bilgi', 'Not', 'Tavsiye', 'Uyarı', 'Tehlike', 'Detay']],
    [['ko', 'ko-KO'], ['중요', '정보', '노트', '팁', '경고', '위험', '세부사항']],
    [['fi', 'fi-FI'], ['Tärkeä', 'Tietoa', 'Huomautus', 'Vinkki', 'Varoitus', 'Vaara', 'Yksityiskohdat']],
    [['hu', 'hu-HU'], ['Fontos', 'Információ', 'Megjegyzés', 'Tipp', 'Figyelem', 'Veszély', 'Részletek']],
    [['id', 'id-ID'], ['Penting', 'Pemberitahuan', 'Catatan', 'Tips', 'Penting', 'Peringatan', 'Rincian']],
    [['nl', 'nl-NL'], ['Belangrijk', 'Info', 'Notitie', 'Tips', 'Notitie', 'Waarschuwing', 'Details']],
  ] as const
  const hintLocales = Object.fromEntries(hintLocaleEntries.flatMap(([languages, values]) => languages.map(language => [language, Object.fromEntries(['important', 'info', 'note', 'tip', 'warning', 'caution', 'details'].map((key, index) => [key, values[index]]))]))) as Record<string, Record<typeof hintTypes[number] | 'details', string>>
  const hintLocale = (env: { sourcePath?: string }) => {
    const language = languageFromSourcePath(env.sourcePath)
    return hintLocales[language] ?? hintLocales[language.split('-')[0]] ?? hintLocales.en
  }

  const alertEnabled = obsidianOptions === false ? markdownOptions.alert !== false : typeof obsidianOptions === 'object' && obsidianOptions.callout === false
  if (alertEnabled) md.use(alertPlugin, {
    alertNames: hintTypes,
    deep: true,
    openRender: (tokens: any[], index: number) => `<div class="hint-container ${tokens[index].markup}">\n`,
    titleRender: (tokens: any[], index: number, _options: unknown, env: { sourcePath?: string }) => {
      const type = tokens[index].markup as typeof hintTypes[number]
      return `<p class="hint-container-title">${hintLocale(env)[type]}</p>\n`
    },
    closeRender: () => '</div>\n',
  })

  if (markdownOptions.hint !== false) for (const type of hintTypes) {
    md.use(container, type, {
      render(tokens: any[], index: number, _options: unknown, env: { sourcePath?: string }) {
        if (tokens[index].nesting === -1) return '</div>\n'
        const title = tokens[index].info.trim().slice(type.length).trim()
        return `<div class="hint-container ${type}">\n<p class="hint-container-title">${title ? md.renderInline(title) : hintLocale(env)[type]}</p>\n`
      },
    })
  }

  if (markdownOptions.hint !== false) md.use(container, 'danger', {
    render(tokens: any[], index: number, _options: unknown, env: { sourcePath?: string }) {
      if (tokens[index].nesting === -1) return '</div>\n'
      const title = tokens[index].info.trim().slice('danger'.length).trim()
      return `<div class="hint-container caution">\n<p class="hint-container-title">${title ? md.renderInline(title) : hintLocale(env).caution}</p>\n`
    },
  })

  if (markdownOptions.hint !== false) md.use(container, 'details', {
    render(tokens: any[], index: number, _options: unknown, env: { sourcePath?: string }) {
      if (tokens[index].nesting === -1) return '</details>\n'
      const summary = tokens[index].info.trim().slice('details'.length).trim()
      return `<details class="hint-container details"><summary>${summary ? md.renderInline(summary) : hintLocale(env).details}</summary>\n`
    },
  })

  md.use(chartPlugin)

  if (markdownPowerEnabled) {
  const tableSetting = (siteConfig.markdown as { table?: boolean | { align?: 'left' | 'center' | 'right', copy?: boolean | 'all' | 'html' | 'md', maxContent?: boolean, fullWidth?: boolean } }).table
  if (tableSetting) {
    const defaults = typeof tableSetting === 'object' ? tableSetting : {}
    md.use(container, 'table', {
      render(tokens: any[], index: number) {
        const token = tokens[index]
        if (token.nesting === -1) return token.meta?.close ?? '</div></div></div></div>\n'
        const info = token.info.trim().slice('table'.length).trim()
        const props = attributes(info)
        const align = ['left', 'center', 'right'].includes(props.align) ? props.align : defaults.align ?? 'left'
        const rawCopy = String(props.copy ?? (hasFlag(info, 'copy') ? 'all' : defaults.copy ?? true))
        const copy = rawCopy === 'false' ? false : ['all', 'html', 'md'].includes(rawCopy) ? rawCopy : 'all'
        const maxContent = boolOption(info, props, 'max-content', 'maxContent', defaults.maxContent ?? false)
        const fullWidth = boolOption(info, props, 'full-width', 'fullWidth', defaults.fullWidth ?? false)
        const title = props.title ? `<p class="table-title">${md.renderInline(props.title)}</p>` : ''
        const toolbar = copy
          ? `<div class="table-toolbar">${copy === 'all' || copy === 'html' ? '<button type="button" aria-label="Copy Table as HTML" data-copy-table="html"><span class="vpi-table-copy" aria-hidden="true"></span><span>HTML</span></button>' : ''}${copy === 'all' || copy === 'md' ? '<button type="button" aria-label="Copy Table as Markdown" data-copy-table="md"><span class="vpi-table-copy" aria-hidden="true"></span><span>Markdown</span></button>' : ''}</div>`
          : ''
        let depth = 1
        let closeIndex = index + 1
        for (; closeIndex < tokens.length; closeIndex++) {
          if (tokens[closeIndex].type === 'container_table_open') depth++
          if (tokens[closeIndex].type === 'container_table_close' && --depth === 0) break
        }
        tokens[closeIndex].meta = { close: `</div></div>${title}</div></div>\n` }
        const rows = parseTableHighlight(props['hl-rows'] ?? '')
        const columns = parseTableHighlight(props['hl-cols'] ?? '')
        const cells = parseTableCells(props['hl-cells'] ?? '')
        let inTable = false
        let row = 0
        let column = 0
        for (let cursor = index + 1; cursor < closeIndex; cursor++) {
          const current = tokens[cursor]
          if (current.type === 'table_open') inTable = true
          else if (current.type === 'table_close') inTable = false
          else if (inTable && current.type === 'tr_open') { row++; column = 0 }
          else if (inTable && (current.type === 'th_open' || current.type === 'td_open')) {
            column++
            const className = cells[row]?.[column] ?? rows[row] ?? columns[column]
            if (className) current.attrJoin('class', className)
          }
        }
        return `<div class="vp-table ${align}${fullWidth ? ' full' : ''}"><div class="table-container"><div class="table-content">${toolbar}<div class="table-inner${maxContent ? ' max-content' : ''}">`
      },
    })
  }

  const configuredCanIUse = canIUseOptions()
  if (configuredCanIUse) {
    const configuredMode = configuredCanIUse.mode ?? 'embed'
    const legacyMode = ['image', 'embed', 'baseline'].includes(configuredMode) ? configuredMode : 'image'
    md.use(container, 'caniuse', {
      render(tokens: any[], index: number) {
        if (tokens[index].nesting === -1) return ''
        const info = tokens[index].info.trim().slice('caniuse'.length).trim()
        const feature = info.split(/\s+/)[0]
        return feature ? renderCanIUse(info.match(/\{.*\}/)?.[0] ?? '', feature, index, legacyMode) : ''
      },
    })
  }

  if (markdownPower.collapse) md.use(collapsePlugin)

  const repl = (siteConfig.markdown as { repl?: false | ReplOptions }).repl
  for (const lang of ['go', 'kotlin', 'rust', 'python'] as const) {
    if (!repl || !repl[lang]) continue
    md.use(container, `${lang}-repl`, {
      render(tokens: any[], index: number) {
        if (tokens[index].nesting === -1) {
          return '</div><div class="code-repl-pin"></div><div class="code-repl-output" hidden><div class="output-head"><span class="vpi-console" aria-hidden="true"></span><span class="title">console</span><span class="output-version"></span><button class="icon-close" type="button" aria-label="Close output">×</button></div><div class="output-content"></div></div></div>\n'
        }
        const info = tokens[index].info.slice(`${lang}-repl`.length).trim()
        const props = attributes(info)
        const editable = hasFlag(info, 'editable') || props.editable === 'true'
        const title = props.title || `${lang} playground`
        return `<div class="code-repl" data-code-repl data-repl-lang="${lang}"${editable ? ' data-repl-editable="true"' : ''}><div class="code-repl-title"><h4>${escapeHtml(title)}</h4><button class="icon-run" type="button" title="Run Code" aria-label="Run Code"><span class="vpi-play" aria-hidden="true"></span></button></div><div class="code-repl-editor${editable ? ' editable' : ''}">\n`
      },
    })
  }

  if (markdownPower.fileTree !== false) md.use(fileTreePlugin)

  if (markdownPower.timeline) md.use(timelinePlugin)

  md.use(container, 'steps', {
    render(tokens: any[], index: number) {
      return tokens[index].nesting === -1 ? '</div>\n' : '<div class="vp-steps">\n'
    },
  })

  for (const alignment of ['left', 'center', 'right', 'justify']) {
    md.use(container, alignment, {
      render(tokens: any[], index: number) {
        return tokens[index].nesting === -1 ? '</div>\n' : `<div style="text-align:${alignment}">\n`
      },
    })
  }

  md.use(container, 'flex', {
    render(tokens: any[], index: number) {
      if (tokens[index].nesting === -1) return '</div>\n'
      const info = tokens[index].info.slice('flex'.length).trim()
      const props = attributes(info)
      const styles = ['margin:16px 0', 'display:flex']
      const enabled = (name: string) => boolOption(info, props, name, name, false)
      const align = enabled('start') ? 'flex-start' : enabled('end') ? 'flex-end' : enabled('center') ? 'center' : ''
      const justify = enabled('between') ? 'space-between' : enabled('around') ? 'space-around' : enabled('center') ? 'center' : ''
      if (align) styles.push(`align-items:${align}`)
      if (justify) styles.push(`justify-content:${justify}`)
      if (enabled('column')) styles.push('flex-direction:column')
      if (enabled('wrap')) styles.push('flex-wrap:wrap')
      styles.push(`gap:${rectSize(props.gap || '16')}`)
      return `<div style="${styles.join(';')}">\n`
    },
  })

  const windowContainer = (name: 'window' | 'demo-wrapper') => ({
    render(tokens: any[], index: number) {
      if (tokens[index].nesting === -1) return '</section></article>\n'
      const info = tokens[index].info.slice(name.length).trim()
      const props = attributes(info)
      const body: any[] = []
      for (let cursor = index + 1; cursor < tokens.length && tokens[cursor].type !== `container_${name}_close`; cursor++) body.push(tokens[cursor])
      const onlyImage = body.length === 1 && body[0].type === 'html_block' && /^<(?:img|picture)\b/.test(body[0].content.trim())
        || body.length === 3 && body[0].type === 'paragraph_open' && body[1].type === 'inline' && body[2].type === 'paragraph_close' && /^!?\[[^\]]*\]\([^)]+\)$/.test(body[1].content.trim())
      if (onlyImage && body.length === 3) {
        body[0].hidden = true
        body[2].hidden = true
      }
      const gap = props.gap !== undefined ? rectSize(props.gap) : onlyImage || boolOption(info, props, 'no-padding', 'noPadding', false) ? '0' : '20px'
      const height = props.height ? rectSize(props.height) : ''
      const title = props.title ? escapeHtml(props.title) : ''
      return `<article class="window-wrapper${title ? ' has-title' : ''}"><header class="window-header"><div class="window-left"><i></i><i></i><i></i></div>${title ? `<div class="window-center"><h4 class="window-title ignore-header"><span>${title}</span><i class="vpi-window-reload"></i></h4></div>` : ''}<div class="window-right"><i class="vpi-window-share"></i><i class="vpi-window-add"></i><i class="vpi-window-copy"></i></div></header><section class="window-content" style="--window-gap:${gap};${height ? `--window-height:${height}` : ''}">\n`
    },
  })
  md.use(container, 'window', windowContainer('window'))
  md.use(container, 'demo-wrapper', windowContainer('demo-wrapper'))

  if (markdownPower.codeTree) md.use(container, 'code-tree', {
    render(tokens: any[], index: number) {
      if (tokens[index].nesting === -1) return '<div class="code-tree-empty" hidden><span class="vpi-code-tree-empty"></span></div></div></div>\n'
      const info = tokens[index].info.slice('code-tree'.length).trim()
      const props = attributes(info)
      const files: string[] = []
      let activeFile = ''
      for (let cursor = index + 1; cursor < tokens.length && tokens[cursor].type !== 'container_code-tree_close'; cursor++) {
        const token = tokens[cursor]
        if (token.type !== 'fence') continue
        const title = attributes(token.info).title
        if (!title) continue
        files.push(title)
        if (token.info.includes(':active')) activeFile = title
      }
      const entry = activeFile || props.entry || files[0] || ''
      const height = cssSize(props.height ?? String(codeTreeOptions.height ?? ''), '320px')
      const title = props.title ? `<div class="code-tree-title" title="${escapeHtml(props.title)}"><span>${escapeHtml(props.title)}</span></div>` : ''
      const iconMode = props.icon === 'simple' || props.icon === 'colored' ? props.icon : codeTreeOptions.icon ?? 'colored'
      return `<div class="vp-code-tree" data-code-tree data-entry-file="${escapeHtml(entry)}"><div class="code-tree-panel" style="max-height:${height}">${title}<div class="vp-file-tree">${renderCodeTreeNodes(parseCodeTreeNodes(files), '', iconMode)}</div></div><div class="code-panel" style="height:${height}">\n`
    },
  })

  md.use(container, 'card-grid', {
    render(tokens: any[], index: number) {
      if (tokens[index].nesting === -1) return '</div>\n'
      return `${cardGridOpen(tokens[index].info.slice('card-grid'.length).trim())}\n`
    },
  })

  md.use(container, 'card-masonry', {
    render(tokens: any[], index: number) {
      if (tokens[index].nesting === -1) return '</div>\n'
      return `${cardMasonryOpen(tokens[index].info.slice('card-masonry'.length).trim())}\n`
    },
  })

  md.use(container, 'card', {
    render(tokens: any[], index: number) {
      if (tokens[index].nesting === -1) return '</section></article>\n'
      return `${cardOpen(tokens[index].info.slice('card'.length).trim())}\n`
    },
  })

  const registerTabs = (name: 'tabs' | 'code-tabs', code = false) => md.use(container, name, {
    validate: (info: string) => new RegExp(`^${name}(?:#[^\\s]+)?(?:\\s|$)`).test(info.trim()),
    render(tokens: any[], index: number) {
      if (tokens[index].nesting === -1) return tokens[index].meta?.hasTabs ? '</div></div>\n' : '</div>\n'
      const group = tabGroup++
      const closeType = `container_${name}_close`
      const tabId = tokens[index].info.trim().match(new RegExp(`^${name}#([^\\s]+)`))?.[1] ?? ''
      const tabs: Array<{ label: string, value: string, index: number, marker: number, active: boolean }> = []
      let closeIndex = index + 1
      for (let cursor = index + 1; cursor < tokens.length; cursor++) {
        closeIndex = cursor
        if (tokens[cursor].type === closeType) break
        if (tokens[cursor].type !== 'inline') continue
        const match = tokens[cursor].content.match(/^@tab(:active)?\s+(.+?)(?:\s*<!--.*-->)?$/)
        if (!match) continue
        const raw = match[2].trim()
        const hash = raw.lastIndexOf('#')
        const label = (hash > 0 ? raw.slice(0, hash) : raw).trim()
        const value = (hash > 0 ? raw.slice(hash + 1) : label).trim()
        if (!label || !value) continue
        const tabIndex = tabs.length
        tabs.push({ label, value, index: tabIndex, marker: cursor, active: Boolean(match[1]) })
        tokens[cursor - 1].type = 'tab_switch'
        tokens[cursor].type = 'tab_hidden'
        tokens[cursor + 1].type = 'tab_hidden'
      }
      const activeIndex = Math.max(0, tabs.findIndex(tab => tab.active))
      for (const tab of tabs) {
        tokens[tab.marker - 1].meta = { code, group, index: tab.index, label: tab.label, activeIndex }
        if (!code) continue
        const end = tabs[tab.index + 1]?.marker - 1 || closeIndex
        let foundFence = false
        for (let cursor = tab.marker + 2; cursor < end; cursor++) {
          if (tokens[cursor].type === 'fence' && !foundFence) {
            foundFence = true
            continue
          }
          tokens[cursor].type = 'tab_hidden'
        }
      }
      tokens[closeIndex].meta = { hasTabs: tabs.length > 0 }
      const rootClass = code ? 'vp-code-tabs' : 'vp-tabs'
      if (!tabs.length) return `<div class="${rootClass}">\n`
      const navClass = code ? 'vp-code-tabs-nav' : 'vp-tabs-nav'
      const buttonClass = code ? 'vp-code-tab-nav' : 'vp-tab-nav'
      const panelClass = code ? 'vp-code-tab' : 'vp-tab'
      const prefix = code ? 'codetab' : 'tab'
      const store = code ? 'VUEPRESS_CODE_TAB_STORE' : 'VUEPRESS_TAB_STORE'
      const buttons = tabs.map(tab => {
        const active = tab.index === activeIndex
        const title = md.renderInline(tab.label)
        const iconName = code ? codeTabIcon(tab.label) : undefined
        const icon = iconName ? `<span class="vp-icon is-svg" aria-hidden="true">${iconifySvg(iconName)}</span>` : ''
        return `<button id="vp-tab-${group}-${tab.index}" type="button" class="${buttonClass}${active ? ' active' : ''}" role="tab" aria-controls="${prefix}-${group}-${tab.index}" aria-selected="${active}" tabindex="${active ? 0 : -1}" data-tab-index="${tab.index}" data-tab-value="${escapeHtml(tab.value)}">${icon}${title}</button>`
      }).join('')
      const firstActive = activeIndex === 0
      return `<div class="${rootClass}" data-tabs data-tab-kind="${code ? 'code' : 'content'}" data-tab-store="${store}"${tabId ? ` data-tab-id="${escapeHtml(tabId)}"` : ''}><div class="${navClass}" role="tablist">${buttons}</div><div id="${prefix}-${group}-0" class="${panelClass}${firstActive ? ' active' : ''}" role="tabpanel" aria-expanded="${firstActive}"><div class="${panelClass}-title">${md.renderInline(tabs[0].label)}</div>`
    },
  })
  registerTabs('tabs')
  registerTabs('code-tabs', true)
  md.renderer.rules.tab_hidden = () => ''
  md.renderer.rules.tab_switch = (tokens: any[], index: number) => {
    const { code, group, index: tabIndex, label, activeIndex } = tokens[index].meta
    if (tabIndex === 0) return ''
    const panelClass = code ? 'vp-code-tab' : 'vp-tab'
    const prefix = code ? 'codetab' : 'tab'
    const active = tabIndex === activeIndex
    return `</div><div id="${prefix}-${group}-${tabIndex}" class="${panelClass}${active ? ' active' : ''}" role="tabpanel" aria-expanded="${active}"><div class="${panelClass}-title">${md.renderInline(label ?? '')}</div>`
  }
  }

  const originalImage = md.renderer.rules.image
  md.renderer.rules.image = (tokens, index, options, env: any, self) => {
    const token = tokens[index]
    resolveIncludedPath('src', token, env)
    const src = token.attrGet('src') ?? ''
    const width = token.attrGet('width') ?? ''
    if (siteConfig.mediaOrigin && src.startsWith(`${siteConfig.mediaOrigin}/`) && /^\d+$/.test(width)) {
      const path = new URL(src).pathname
      const widths = [480, 768, 1080, 1440].filter(candidate => candidate < Number(width))
      token.attrSet('srcset', [
        ...widths.map(candidate => `${siteConfig.mediaOrigin}/cdn-cgi/image/width=${candidate}%2Cformat=auto${path} ${candidate}w`),
        `${src} ${width}w`,
      ].join(', '))
      token.attrSet('sizes', '(max-width: 768px) calc(100vw - 32px), 770px')
    }
    const imageIndex = env.imageIndex++
    token.attrSet('decoding', 'async')
    if (markdownImage && markdownImage.lazyload) token.attrSet('loading', 'lazy')
    if (!token.attrGet('loading')) token.attrSet('loading', imageIndex === 0 ? 'eager' : 'lazy')
    if (imageIndex === 0 && token.attrGet('loading') !== 'lazy') token.attrSet('fetchpriority', 'high')
    return originalImage
      ? originalImage(tokens, index, options, env, self)
      : self.renderToken(tokens, index, options)
  }

  const originalFence = md.renderer.rules.fence
  md.renderer.rules.fence = (tokens, index, options, env, self) => {
    const info = tokens[index].info.trim()
    if (info === 'math' && mathConfiguration && mathConfiguration.mathFence) return originalFence ? originalFence(tokens, index, options, env, self) : self.renderToken(tokens, index, options)
    if (markdownPowerEnabled && /(?:^|\s):tree-only(?:\s|$)/.test(info)) return ''
    if (markdownChart.echarts && info.split(':', 2)[0] === 'echarts') return originalFence!(tokens, index, options, env, self)
    if (markdownChart.flowchart && ['flow', 'flowchart'].includes(info.split(':', 1)[0])) {
      return md.renderer.rules.flowchart!(tokens, index, options, env, self)
    }
    if (markdownChart.markmap && /^markmap(?:\s|$)/.test(info)) return md.renderer.rules.markmap!(tokens, index, options, env, self)
    if (markdownPowerEnabled && markdownPower.fileTree !== false && /^(?:file-)?tree(?:\s|$)/.test(info)) {
      const props = attributes(info.replace(/^(?:file-)?tree/, '').trim())
      const nodes = parseFileTreeFence(tokens[index].content)
      const mode = (props.icon === 'simple' ? 'simple' : (siteConfig.markdown as { fileTree?: { icon?: FileTreeIconMode } }).fileTree?.icon ?? 'colored') as FileTreeIconMode
      const locale = markdownPowerCommonLocale(env.sourcePath)
      const copyText = Buffer.from(tokens[index].content.trim()).toString('base64')
      return `<div class="vp-file-tree">${props.title ? `<p class="vp-file-tree-title">${escapeHtml(props.title)}</p>` : ''}<button type="button" class="vp-copy-code-button" data-copy-tree data-copy-tree-text="${copyText}" aria-label="${escapeHtml(locale.copy)}" data-copied="${escapeHtml(locale.copied)}"></button>${renderFileTreeNodes(nodes, mode, source => md.renderInline(source))}</div>\n`
    }
    if (markdownChart.mermaid && info.split(/\s+/)[0] === 'mermaid') {
      const title = attributes(info.slice('mermaid'.length)).title ?? ''
      const source = Buffer.from(tokens[index].content).toString('base64')
      return `<div class="mermaid-actions"><button class="preview-button" type="button" title="preview" aria-label="preview"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1316 1024" fill="currentColor" aria-hidden="true"><path d="M658.286 0C415.89 0 0 297.106 0 512c0 214.82 415.89 512 658.286 512 242.322 0 658.285-294.839 658.285-512S900.608 0 658.286 0zm0 877.714c-161.573 0-512-221.769-512-365.714 0-144.018 350.427-365.714 512-365.714 161.572 0 512 217.16 512 365.714s-350.428 365.714-512 365.714z"/><path d="M658.286 292.571a219.429 219.429 0 1 0 0 438.858 219.429 219.429 0 0 0 0-438.858zm0 292.572a73.143 73.143 0 1 1 0-146.286 73.143 73.143 0 0 1 0 146.286z"/></svg></button><button class="download-button" type="button" title="download" aria-label="download"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor" aria-hidden="true"><path d="M828.976 894.125H190.189c-70.55 0-127.754-57.185-127.754-127.753V606.674c0-17.634 14.31-31.933 31.933-31.933h63.889c17.634 0 31.932 14.299 31.932 31.933v95.822c0 35.282 28.596 63.877 63.877 63.877h511.033c35.281 0 63.877-28.595 63.877-63.877v-95.822c0-17.634 14.298-31.933 31.943-31.933h63.878c17.635 0 31.933 14.299 31.933 31.933v159.7c0 70.566-57.191 127.751-127.754 127.751zM249.939 267.51c12.921-12.92 33.885-12.92 46.807 0l148.97 148.972V94.893c0-17.634 14.302-31.947 31.934-31.947h63.876c17.638 0 31.946 14.313 31.946 31.947v321.589l148.97-148.972c12.922-12.92 33.876-12.92 46.797 0l46.814 46.818c12.922 12.922 12.922 33.874 0 46.807L552.261 624.93c-1.14 1.138-21.664 13.684-42.315 13.693-20.877.01-41.88-12.542-43.021-13.693L203.122 361.135c-12.923-12.934-12.923-33.885 0-46.807l46.817-46.818z"/></svg></button></div><div class="mermaid-wrapper" data-mermaid-source="${source}" data-mermaid-title="${escapeHtml(title)}" data-mermaid-id="mermaid-${index}"><div class="mermaid-content"></div></div>\n`
    }
    if (!highlighter) return originalFence ? originalFence(tokens, index, options, env, self) : self.renderToken(tokens, index, options)
    const rawLanguage = (info.split(/\s+/)[0] || 'text').replace(/\{[\d,\-\s]+\}$/, '')
    const aliases: Record<string, string> = { js: 'javascript', ts: 'typescript', md: 'markdown', py: 'python', sh: 'bash', shell: 'bash', yml: 'yaml' }
    const language = aliases[rawLanguage] ?? rawLanguage
    const title = info.match(/title=(?:"([^"]+)"|'([^']+)')/)?.slice(1).find(Boolean)
    const rangeAttribute = tokens[index].attrs?.map(([name]: [string, string]) => name).find((name: string) => /^[\d,\-\s]+$/.test(name))
    const ranges = info.match(/\{([\d,\-\s]+)\}/)?.[1] ?? rangeAttribute ?? ''
    const highlighted = new Set<number>()
    for (const part of ranges.split(',').map(value => value.trim()).filter(Boolean)) {
      const [start, end = start] = part.split('-').map(Number)
      if (!Number.isInteger(start) || !Number.isInteger(end)) continue
      for (let line = start; line <= end; line++) highlighted.add(line)
    }
    const lineNumberStart = info.match(/(?:^|\s):line-numbers=(\d+)(?:\s|$)/)?.[1]
    const lineNumberOverride = /(?:^|\s):no-line-numbers(?:\s|$)/.test(info)
      ? false
      : lineNumberStart || /(?:^|\s):?line-numbers(?:\s|$)/.test(info) ? true : undefined
    const whitespace = whitespacePosition(info)
    const bracketOptions = highlighterOptions.colorizedBrackets
    const indentOptions = highlighterOptions.renderIndentGuides
    let html: string
    try {
      html = highlighter.codeToHtml(tokens[index].content, {
        lang: highlighter.getLoadedLanguages().includes(language) ? language : 'text',
        themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
        defaultColor: false,
        meta: { __raw: info },
        transformers: [
          ...codeTransformers,
          ...(whitespace ? [transformerRenderWhitespace({ position: whitespace })] : []),
          ...(bracketOptions ? [transformerColorizedBrackets(typeof bracketOptions === 'object' ? bracketOptions : {})] : []),
          ...(indentOptions ? [transformerRenderIndentGuides(typeof indentOptions === 'object' ? indentOptions : {})] : []),
        ],
      })
    } catch {
      return originalFence ? originalFence(tokens, index, options, env, self) : self.renderToken(tokens, index, options)
    }
    let line = 0
    html = html
      .replace('<pre class="', '<pre class="vp-code ')
      .replace(' tabindex="0"', '')
      .replace(/<span class="line([^\"]*)">/g, (_match, classes: string) => `<span class="line${classes}${highlighted.has(++line) && !classes.includes('highlighted') ? ' highlighted' : ''}">`)
    const lineNumberSetting = highlighterOptions.lineNumbers
    const lineNumbers = !/\btwoslash\b/.test(info) && (lineNumberOverride ?? (typeof lineNumberSetting === 'number' ? line >= lineNumberSetting : lineNumberSetting !== false && lineNumberSetting !== 'disable' && Boolean(lineNumberSetting)))
    const extension = escapeHtml(rawLanguage.replace(/[^\w+-]/g, ''))
    const numbers = lineNumbers ? `<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number ${Number(lineNumberStart ?? 1) - 1}">${Array.from({ length: line }, () => '<div class="line-number"></div>').join('')}</div>` : ''
    const collapsed = info.match(/(?:^|\s):collapsed-lines(?:=(\d+))?(?:\s|$)/)
    const collapsedAt = Number(collapsed?.[1] ?? 15)
    const hasCollapsedLines = Boolean(collapsed && line >= collapsedAt)
    const collapseControl = hasCollapsedLines ? '<div class="collapsed-lines" role="button" tabindex="0" aria-expanded="false"></div>' : ''
    const copyLocale = copyCodeLocale(env.sourcePath)
    const copyButton = copyCodeOptions === false ? '' : `<button type="button" class="vp-copy-code-button" data-copy-code data-copy-duration="${typeof copyCodeOptions === 'object' ? copyCodeOptions.duration ?? 2000 : 2000}"${typeof copyCodeOptions === 'object' && copyCodeOptions.showInMobile ? ' data-copy-mobile="true"' : ''} aria-label="${escapeHtml(copyLocale.copy)}" data-copied="${escapeHtml(copyLocale.copied)}"></button>`
    const block = `<div class="language-${extension}${lineNumbers ? ' line-numbers-mode' : ''}${hasCollapsedLines ? ' has-collapsed-lines collapsed' : ''}" data-highlighter="shiki" data-ext="${extension}"${hasCollapsedLines ? ` style="--vp-collapsed-lines:${collapsedAt}"` : ''}>${copyButton}${html}${numbers}${collapseControl}</div>`
    const titleIconName = title ? getFileIconName(title) : undefined
    const titleIcon = titleIconName ? `<span class="vp-icon is-svg" aria-hidden="true">${iconifySvg(titleIconName)}</span>` : ''
    return title ? `<div class="code-block-title" data-title="${escapeHtml(title)}"><div class="code-block-title-bar"><span class="title">${titleIcon}${escapeHtml(title)}</span></div>${block}</div>` : block
  }

  return md
}

const renderPlain = (source: string, removeTitle = true, sourcePath?: string, obsidianStack: string[] = [], obsidianPages?: unknown, plotOptions: PlotOptions = {}): string => {
  let transformed = markdownPowerEnabled ? transformObsidian(source, obsidianOptions) : source
  if (markdownPower.artPlayer) transformed = artPlayerComponents(transformed)
  transformed = iconComponents(transformed)
  transformed = linkComponents(transformed, sourcePath)
  transformed = npmToContainers(transformed)
  if (markdownPower.qrcode) transformed = qrCodeContainers(transformed, sourcePath)
  transformed = imageCards(transformed, sourcePath)
  transformed = pairedCards(transformed)
  transformed = pairedLinkCards(transformed)
  if (markdownPower.field) transformed = fieldContainers(transformed)
  transformed = swiperComponents(transformed)
  if (markdownPower.chat) transformed = chatContainers(transformed)
  const plot = { ...globalPlotOptions, ...plotOptions }
  return createMarkdown().render(cleanSource(transformed, removeTitle, plot, sourcePath), { imageIndex: 0, sourcePath, obsidianStack, obsidianPages, plot })
}

export const renderMarkdown = async (source: string, options: { sourcePath?: string, plot?: PlotOptions, removeTitle?: boolean, base?: string } = {}) => {
  const expanded = await dynamicImageCards(normalMarkdownSource(await expandFileDirectives(source, options.sourcePath)), options.sourcePath)
  const encrypted = markdownPower.encrypt ? await encryptContainers(expanded, options.sourcePath) : expanded
  const demos = markdownPower.demo ? await demoContainers(encrypted, options.sourcePath) : encrypted
  let html = renderPlain(demos, options.removeTitle ?? true, options.sourcePath, [], undefined, options.plot)
  html = await injectImageSizes(html, {
    sourcePath: options.sourcePath,
    mode: markdownPowerEnabled ? (siteConfig.markdown as { imageSize?: boolean | 'all' }).imageSize : false,
  })
  html = withBaseInHtml(html, options.base)
  if (!mathjaxInstance) return html
  const style = mathjaxInstance.outputStyle()
  mathjaxInstance.reset()
  return `<style class="mathjax-output-style">${style}</style>${html}`
}
