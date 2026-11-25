import Prism from 'prismjs'

import { iconSvg } from '../icons'

// ---------- :::diff 容器的独立渲染（不与代码块渲染复用结构） ----------

export interface DiffLine {
  kind: 'add' | 'del' | 'meta' | 'ctx'
  sign: string
  text: string
  bodyHtml: string
}

interface WordOp {
  type: 'eq' | 'del' | 'add'
  text: string
}

// git 扩展头 / hunk 头 / "\ No newline" 等元信息行
const DIFF_META_RE =
  /^(?:@@|diff |index |new file|deleted file|old mode|new mode|similarity |rename |copy |Binary files|--- |\+\+\+ |\\ )/

export function escapeDiffText(value: string) {
  return Prism.util.encode(value) as string
}

function tokenizeWords(text: string): string[] {
  return text.match(/\s+|\S+/g) ?? []
}

// 基于 LCS 的词级 diff（构建期执行，输入过大时放弃词级高亮）
function diffWords(oldText: string, newText: string): WordOp[] | null {
  const a = tokenizeWords(oldText)
  const b = tokenizeWords(newText)
  const n = a.length
  const m = b.length
  if (n === 0 || m === 0) return null
  if (n * m > 1_000_000) return null
  const w = m + 1
  const dp = new Uint16Array((n + 1) * w)
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i * w + j] =
        a[i] === b[j]
          ? dp[(i + 1) * w + j + 1] + 1
          : Math.max(dp[(i + 1) * w + j], dp[i * w + j + 1])
    }
  }
  const ops: WordOp[] = []
  const push = (type: WordOp['type'], text: string) => {
    const last = ops[ops.length - 1]
    if (last && last.type === type) last.text += text
    else ops.push({ type, text })
  }
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      push('eq', a[i])
      i++
      j++
    } else if (dp[(i + 1) * w + j] >= dp[i * w + j + 1]) {
      push('del', a[i])
      i++
    } else {
      push('add', b[j])
      j++
    }
  }
  while (i < n) {
    push('del', a[i])
    i++
  }
  while (j < m) {
    push('add', b[j])
    j++
  }
  return ops
}

// 只保留一侧的词级变化，公共部分保持普通文本
function wordDiffHtml(ops: WordOp[], side: 'del' | 'add'): string {
  let html = ''
  for (const op of ops) {
    if (op.type === 'eq') html += escapeDiffText(op.text)
    else if (op.type === side)
      html += `<span class="diff-view-word diff-view-word-${side}">${escapeDiffText(op.text)}</span>`
  }
  return html
}

export function parseDiffLines(code: string): DiffLine[] {
  const lines: DiffLine[] = code
    // 统一 CRLF/CR 行尾：残留的 \r 会被 rehype-raw 的 HTML 解析归一化成 \n，混进行内容
    .replace(/\r\n?/g, '\n')
    .replace(/\n$/, '')
    .split('\n')
    .map((line): DiffLine => {
      if (DIFF_META_RE.test(line)) {
        return { kind: 'meta', sign: '', text: line, bodyHtml: escapeDiffText(line) }
      }
      if (line.startsWith('+')) {
        const text = line.slice(1)
        return { kind: 'add', sign: '+', text, bodyHtml: escapeDiffText(text) }
      }
      if (line.startsWith('-')) {
        const text = line.slice(1)
        return { kind: 'del', sign: '-', text, bodyHtml: escapeDiffText(text) }
      }
      if (line.startsWith('!')) {
        const text = line.slice(1)
        return { kind: 'meta', sign: '!', text, bodyHtml: escapeDiffText(text) }
      }
      // 上下文行保留一个空格符号，保证复制出的文本与源一致
      const ctxText = line.startsWith(' ') ? line.slice(1) : line
      return { kind: 'ctx', sign: ' ', text: ctxText, bodyHtml: escapeDiffText(ctxText) }
    })

  // 紧邻的 del 块与 add 块按较少一侧逐行配对，计算词级差异（同 VSCode 行内高亮）
  for (let i = 0; i < lines.length; ) {
    if (lines[i].kind !== 'del') {
      i++
      continue
    }
    let delEnd = i
    while (delEnd < lines.length && lines[delEnd].kind === 'del') delEnd++
    let addEnd = delEnd
    while (addEnd < lines.length && lines[addEnd].kind === 'add') addEnd++
    const delCount = delEnd - i
    const addCount = addEnd - delEnd
    const pairs = Math.min(delCount, addCount)
    if (pairs > 0 && pairs <= 30) {
      for (let k = 0; k < pairs; k++) {
        const ops = diffWords(lines[i + k].text, lines[delEnd + k].text)
        if (!ops) continue
        lines[i + k].bodyHtml = wordDiffHtml(ops, 'del')
        lines[delEnd + k].bodyHtml = wordDiffHtml(ops, 'add')
      }
    }
    i = addEnd === i ? i + 1 : addEnd
  }
  return lines
}

// 换行符包在 display:none 的 span 里：渲染时隐藏，复制（textContent）时保留
function renderDiffLinesHtml(lines: DiffLine[]) {
  let html = ''
  for (const line of lines) {
    const kindCls = line.kind === 'ctx' ? '' : ` diff-view-line-${line.kind}`
    html += `<span class="diff-view-line${kindCls}"><span class="diff-view-sign">${line.sign}</span><span class="diff-view-text">${line.bodyHtml}</span></span><span class="diff-view-nl">\n</span>`
  }
  return html
}

// :::diff 的独立视图：头部（标题 + 变更统计 + 复制）、diff 行
export function renderDiffViewHtml(code: string, title: string): string {
  const lines = parseDiffLines(code)
  const additions = lines.filter((line) => line.kind === 'add').length
  const deletions = lines.filter((line) => line.kind === 'del').length
  const label = title || 'diff'
  const stat = `<span class="diff-view-stat"><span class="diff-view-stat-add">+${additions}</span><span class="diff-view-stat-del">-${deletions}</span></span>`
  // 按钮结构与 code-copy 同构（图标 + 文字）：复制成功态由 __blogCopyDoneHtml 整体替换 innerHTML
  const copy = `<button class="diff-view-copy" type="button" onclick="window.__blogCopyCode(this)">${iconSvg('mdi-content-copy')}<span>复制</span></button>`
  return `<div class="diff-view"><div class="diff-view-header"><span class="diff-view-title">${iconSvg('mdi-file-compare')}${label}</span>${stat}${copy}</div><div class="diff-view-body"><div class="diff-view-lines">${renderDiffLinesHtml(lines)}</div></div></div>`
}
