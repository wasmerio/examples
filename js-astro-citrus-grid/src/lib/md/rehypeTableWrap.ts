import type { Element, ElementContent, Nodes, Properties, Root } from 'hast'

// 构建期为每张表格生成「表头栏 + 表体容器」结构：
//
//   figure.md-table
//   ├── div.md-table-bar        表头栏：左侧开关（换行 / 横向滚动），右侧状态文案（客户端注入 i18n）
//   │   └── label.md-table-switch
//   │       ├── input.md-table-toggle
//   │       └── span.md-table-slider
//   └── div.md-table-wrap       表体容器：默认换行显示，勾选开关后出横向滚动条（见 markdown.css）
//       └── table
//
// 交互零依赖 JS：开关用 checkbox + :has() 纯 CSS 切换；状态文案与 aria-label
// 由 PostPage 注入 i18n 词条后由 lib/postContent.ts 的 bindTableModes() 回填。
function el(tagName: string, properties: Properties, children: ElementContent[]): Element {
  return { type: 'element', tagName, properties, children }
}

function wrapTable(table: Element): Element {
  const toggle = el('input', { type: 'checkbox', className: ['md-table-toggle'] }, [])
  const slider = el('span', { className: ['md-table-slider'], ariaHidden: 'true' }, [])
  const bar = el('div', { className: ['md-table-bar'] }, [
    el('label', { className: ['md-table-switch'] }, [toggle, slider]),
    el('span', { className: ['md-table-state'], ariaHidden: 'true' }, []),
  ])
  const wrap = el('div', { className: ['md-table-wrap'], tabIndex: 0 }, [table])
  return el('figure', { className: ['md-table'] }, [bar, wrap])
}

function walk(parent: { children: Nodes[] }) {
  const children = parent.children
  for (let i = 0; i < children.length; i += 1) {
    const node = children[i]
    if (node.type !== 'element') continue
    if (node.tagName === 'table') {
      children[i] = wrapTable(node)
      continue
    }
    walk(node)
  }
}

export function rehypeTableWrap() {
  return (tree: Root) => {
    walk(tree)
  }
}
