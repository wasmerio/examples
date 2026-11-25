import type { Element, Nodes, Root } from 'hast'
import Prism from 'prismjs'

import { type IconName, iconSvg } from '../icons'

import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-diff'
import 'prismjs/components/prism-ini'
import 'prismjs/components/prism-toml'

function escapeAttr(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function normalizeLanguage(raw?: string) {
  if (!raw) return ''
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '')
  if (!cleaned) return ''
  return Prism.languages[cleaned] ? cleaned : ''
}

// 语言对应图标映射
const langIconMap: Record<string, IconName> = {
  javascript: 'mdi-language-javascript',
  js: 'mdi-language-javascript',
  typescript: 'mdi-language-typescript',
  ts: 'mdi-language-typescript',
  json: 'mdi-code-json',
  css: 'mdi-language-css3',
  html: 'mdi-language-html5',
  markup: 'mdi-language-html5',
  xml: 'mdi-xml',
  bash: 'mdi-bash',
  shell: 'mdi-bash',
  sh: 'mdi-bash',
  zsh: 'mdi-bash',
  yaml: 'mdi-file-cog-outline',
  yml: 'mdi-file-cog-outline',
  markdown: 'mdi-language-markdown',
  md: 'mdi-language-markdown',
  python: 'mdi-language-python',
  py: 'mdi-language-python',
  java: 'mdi-language-java',
  c: 'mdi-language-c',
  cpp: 'mdi-language-cpp',
  'c++': 'mdi-language-cpp',
  go: 'mdi-language-go',
  golang: 'mdi-language-go',
  rust: 'mdi-language-rust',
  rs: 'mdi-language-rust',
  sql: 'mdi-database',
  diff: 'mdi-file-compare',
  ini: 'mdi-file-cog-outline',
  toml: 'mdi-file-cog-outline',
}

// 无对应代码图标使用通用图标
function langIcon(rawLang: string): IconName {
  const key =
    rawLang
      .trim()
      .toLowerCase()
      .split(/[\s:{[]/)[0] || ''
  return langIconMap[key] ?? 'mdi-code-braces'
}

function buildLineNumbers(code: string) {
  const trimmed = code.replace(/\n$/, '')
  const lines = trimmed.split('\n')
  return lines.map((_, i) => `<span>${i + 1}</span>`).join('')
}

function renderCodeBlockHtml(code: string, rawLang: string) {
  const normalized = normalizeLanguage(rawLang)
  const grammar =
    (normalized && Prism.languages[normalized]) ||
    Prism.languages.plain ||
    Prism.languages.text ||
    Prism.languages.markup ||
    undefined
  const highlighted =
    normalized && grammar
      ? Prism.highlight(code, grammar, normalized)
      : (Prism.util.encode(code) as string)
  const langLabel = rawLang || 'text'
  const langClass = normalized ? `language-${normalized}` : 'language-text'
  const lineNumbers = buildLineNumbers(code)
  // 头部右侧动作区：换行切换 + 复制；换行默认关，勾选后 code-pre 折行并隐藏行号栏
  // （换行时长代码行占多行视觉行，行号会错位，故隐藏）；文案由 i18n 注入，见 postActions
  return `<div class="code-block"><div class="code-header"><span class="code-lang">${iconSvg(langIcon(rawLang))}${escapeAttr(langLabel)}</span><div class="code-actions"><button class="code-wrap" type="button" aria-pressed="false" onclick="window.__blogToggleCodeWrap(this)">${iconSvg('mdi-wrap')}</button><button class="code-copy" type="button" onclick="window.__blogCopyCode(this)">${iconSvg('mdi-content-copy')}<span>复制</span></button></div></div><div class="code-body"><div class="code-gutter">${lineNumbers}</div><pre class="code-pre"><code class="${langClass}">${highlighted}</code></pre></div></div>`
}

function extractLang(code: Element): string {
  const classNames = (code.properties?.className as string[] | undefined) ?? []
  for (const cls of classNames) {
    if (typeof cls === 'string' && cls.startsWith('language-')) {
      return cls.slice('language-'.length)
    }
  }
  return ''
}

function textContent(node: Nodes): string {
  if (node.type === 'text') return node.value
  if ('children' in node && Array.isArray(node.children)) {
    return node.children.map((child) => textContent(child as Nodes)).join('')
  }
  return ''
}

function transform(parent: { children: Nodes[] }) {
  const children = parent.children
  for (let i = 0; i < children.length; i++) {
    const node = children[i]
    if (node.type === 'element' && node.tagName === 'pre') {
      const code = node.children.find(
        (child): child is Element => child.type === 'element' && child.tagName === 'code',
      )
      if (code) {
        children[i] = {
          type: 'raw',
          value: renderCodeBlockHtml(textContent(code), extractLang(code)),
        }
        continue
      }
    }
    if ('children' in node && Array.isArray((node as { children?: unknown }).children)) {
      transform(node as unknown as { children: Nodes[] })
    }
  }
}

export function rehypeCodeBlock() {
  return (tree: Root) => {
    transform(tree)
  }
}
