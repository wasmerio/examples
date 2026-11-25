import type { BlockContent, Paragraph, PhrasingContent, Root } from 'mdast'

const CONTAINER_TYPES = new Set(['info', 'tip', 'warning', 'danger', 'details'])

const OPEN_RE = /^:::([a-zA-Z]+)[ \t]*(.*)$/

type QueueItem = { kind: 'line'; p: Paragraph } | { kind: 'block'; node: BlockContent }

function paragraphText(p: Paragraph): string {
  return p.children
    .map((c) => (c.type === 'text' ? c.value : c.type === 'break' ? '\n' : ''))
    .join('')
}

function lineText(p: Paragraph): string {
  return paragraphText(p).trim()
}

function hasContainerMarker(p: Paragraph): boolean {
  return paragraphText(p)
    .split('\n')
    .some((line) => {
      const t = line.trim()
      return t === ':::' || OPEN_RE.test(t)
    })
}

function splitLines(p: Paragraph): Paragraph[] {
  const lines: PhrasingContent[][] = [[]]
  const push = (node: PhrasingContent) => lines[lines.length - 1].push(node)
  for (const child of p.children) {
    if (child.type === 'text') {
      const parts = child.value.split('\n')
      for (let i = 0; i < parts.length; i++) {
        if (i > 0) lines.push([])
        if (parts[i]) push({ type: 'text', value: parts[i] })
      }
    } else if (child.type === 'break') {
      lines.push([])
    } else {
      push(child)
    }
  }
  return lines
    .filter((children) => children.length > 0)
    .map((children) => ({ type: 'paragraph', children }) as Paragraph)
}

function mergeLineRuns(items: QueueItem[]): BlockContent[] {
  const out: BlockContent[] = []
  let buf: PhrasingContent[] = []
  const flush = () => {
    if (buf.length > 0) {
      out.push({ type: 'paragraph', children: buf } as Paragraph)
      buf = []
    }
  }
  for (const item of items) {
    if (item.kind === 'line') {
      if (buf.length > 0) buf.push({ type: 'break' })
      buf.push(...item.p.children)
    } else {
      flush()
      out.push(item.node)
    }
  }
  flush()
  return out
}

function makeContainer(type: string, title: string, body: BlockContent[]): BlockContent {
  const isDetails = type === 'details'
  const titleNode = {
    type: 'paragraph',
    data: {
      hName: isDetails ? 'summary' : 'p',
      hProperties: { className: ['md-container-title'] },
    },
    children: [{ type: 'text', value: title || type }],
  }
  const bodyNode = {
    type: 'paragraph',
    data: { hName: 'div', hProperties: { className: ['md-container-body'] } },
    children: body,
  }
  const children = isDetails ? [titleNode, bodyNode] : [titleNode, ...body]
  return {
    type: 'paragraph',
    data: {
      hName: isDetails ? 'details' : 'div',
      hProperties: { className: ['md-container', `md-container-${type}`] },
    },
    children,
  } as unknown as Paragraph
}

export function remarkContainers() {
  return (tree: Root) => {
    const queue: QueueItem[] = []
    for (const node of tree.children as BlockContent[]) {
      if (node.type === 'paragraph' && hasContainerMarker(node)) {
        for (const lineP of splitLines(node)) queue.push({ kind: 'line', p: lineP })
      } else {
        queue.push({ kind: 'block', node })
      }
    }

    const out: QueueItem[] = []
    let k = 0
    while (k < queue.length) {
      const item = queue[k]
      const text = item.kind === 'line' ? lineText(item.p) : ''
      const openM = item.kind === 'line' ? OPEN_RE.exec(text) : null
      if (openM && CONTAINER_TYPES.has(openM[1] as string)) {
        const type = openM[1] as string
        const title = (openM[2] ?? '').trim()
        const body: QueueItem[] = []
        let closed = false
        k++
        while (k < queue.length) {
          const cur = queue[k]
          const t = cur.kind === 'line' ? lineText(cur.p) : ''
          if (cur.kind === 'line' && t === ':::') {
            closed = true
            k++
            break
          }
          body.push(cur)
          k++
        }
        const merged = mergeLineRuns(body)
        if (closed) {
          out.push({ kind: 'block', node: makeContainer(type, title, merged) })
        } else {
          // 未闭合：opener 行按普通文本保留（与未知 :::foo 类型的行为一致），
          // 不能静默吞掉，否则作者看不到自己的容器语法为什么没生效
          out.push(item)
          out.push(...(merged.map((node) => ({ kind: 'block', node })) as QueueItem[]))
        }
        continue
      }
      out.push(item)
      k++
    }

    tree.children = mergeLineRuns(out) as unknown as Root['children']
  }
}
