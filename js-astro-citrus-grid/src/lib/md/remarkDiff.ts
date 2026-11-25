import type { BlockContent, Root } from 'mdast'

import { renderDiffViewHtml } from './diffRender'

// :::diff 容器：内容按原文行提取，不经过 markdown 内联/块级解析，
// 避免 +/- 行被解析成列表、```/--- 等字符被 markdown 语义干扰。
//   :::diff [标题]
//   ...diff 原文...
//   :::

const OPEN_TOKEN = ':::diff'
const CLOSE_LINE = ':::'

interface VFileLike {
  value: unknown
}

function isTrimmedOpen(line: string) {
  return line.trimStart().startsWith(OPEN_TOKEN)
}

function isCloseLine(line: string) {
  return line.trim() === CLOSE_LINE
}

export function remarkDiff() {
  return (tree: Root, file: VFileLike) => {
    const source = typeof file.value === 'string' ? file.value : ''
    if (!source.includes(OPEN_TOKEN)) return
    const lines = source.split('\n')
    const children = tree.children as BlockContent[]
    const out: BlockContent[] = []
    let i = 0
    while (i < children.length) {
      const node = children[i]
      // :::diff 必须独立成行；段落内的后续行可能被 +/- 打断成列表，
      // 所以起点只取「首行原文是 :::diff」的节点，终点向后逐节点找 ::: 行
      const startLine = node.position?.start.line
      if (startLine != null && isTrimmedOpen(lines[startLine - 1] ?? '')) {
        let endLine = -1
        let endIndex = -1
        for (let j = i; j < children.length; j++) {
          const s = children[j].position?.start.line
          const e = children[j].position?.end.line
          if (s == null || e == null) continue
          // 起点节点自身跳过 :::diff 首行，其余节点整段范围检查
          const from = j === i ? s + 1 : s
          for (let lineNo = from; lineNo <= e; lineNo++) {
            if (isCloseLine(lines[lineNo - 1] ?? '')) {
              endLine = lineNo - 1
              endIndex = j
              break
            }
          }
          if (endLine >= 0) break
        }
        if (endLine >= 0) {
          const title = (lines[startLine - 1] ?? '').trim().slice(OPEN_TOKEN.length).trim()
          // 剥离行尾 \r（CRLF 源文件），统一交给 diffRender 处理
          const code = lines
            .slice(startLine, endLine)
            .map((line) => line.replace(/\r$/, ''))
            .join('\n')
          out.push({
            type: 'html',
            value: renderDiffViewHtml(code, title),
          } as unknown as BlockContent)
          i = endIndex + 1
          continue
        }
      }
      out.push(node)
      i++
    }
    tree.children = out as unknown as Root['children']
  }
}
