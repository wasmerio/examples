// Ported from astro-theme-pure (Apache-2.0): build-time Shiki transformers
// that give code blocks titles, language labels, copy buttons and collapse —
// the exact look of ink.willimt.com. The box styling lives in global.css.
import { h } from 'hastscript'
import type { ElementContent } from 'hast'
import type { ShikiTransformer } from 'shiki'

// The icon sprite lives in `public/icons/code.svg`. It is prefixed with the
// Astro `base` (passed in from `astro.config.ts`) so the copy/collapse button
// icons keep working when the site is served from a sub-path (e.g. a GitHub
// Pages project URL like `/astro-theme-ink/`).
const iconUrl = (base: string, id: string): string =>
  `${base.replace(/\/+$/, '')}/icons/code.svg#${id}`

function parseMetaString(str = '') {
  return Object.fromEntries(
    str.split(' ').reduce(
      (acc: [string, string | true][], cur) => {
        const matched = cur.match(/(.+)?=("(.+)"|'(.+)')$/)
        if (matched === null) return acc
        const key = matched[1]
        const value = matched[3] || matched[4] || true
        acc.push([key, value])
        return acc
      },
      [] as [string, string | true][]
    )
  )
}

// Nest an inner <pre> in the outer layer: `div.astro-code > pre > code`
export const updateStyle = (): ShikiTransformer => {
  return {
    name: 'shiki-transformer-update-style',
    pre(node) {
      const container = h('pre', node.children)
      node.children = [container]
      node.tagName = 'div'
    }
  }
}

// Add a title to the code block (` ```ts title="test.ts" `)
export const addTitle = (): ShikiTransformer => {
  return {
    name: 'shiki-transformer-add-title',
    pre(node) {
      const rawMeta = this.options.meta?.__raw
      if (!rawMeta) return
      const meta = parseMetaString(rawMeta)
      if (!meta.title) return

      const div = h(
        'div',
        {
          class: 'title text-sm text-muted-foreground px-3 py-1 rounded-lg border'
        },
        meta.title.toString()
      )
      node.children.unshift(div)
    }
  }
}

// Add a language tag to the code block
export const addLanguage = (): ShikiTransformer => {
  return {
    name: 'shiki-transformer-add-language',
    pre(node) {
      const span = h(
        'span',
        { class: 'language ps-1 pe-3 text-sm bg-muted text-muted-foreground' },
        this.options.lang
      )
      node.children.push(span)
    }
  }
}

// Match the browser's code.textContent after notation transformers have run.
function codeText(node: ElementContent): string {
  if (node.type === 'text') return node.value
  return node.type === 'element' ? node.children.map(codeText).join('') : ''
}

export const addCopyButton = (timeout?: number, base = ''): ShikiTransformer => {
  return {
    name: 'shiki-transformer-copy-button',
    pre(node) {
      const button = h(
        'button',
        {
          class: 'copy text-muted-foreground p-1 box-content border rounded-lg bg-card',
          type: 'button',
          hidden: true,
          'aria-label': 'Copy code',
          'data-code': codeText(this.code) === this.source ? undefined : this.source,
          'data-copy-timeout': timeout && timeout !== 2000 ? timeout : undefined
        },
        [
          h('div', { class: 'ready' }, [
            h('svg', { class: 'size-5' }, [
              h('use', { href: iconUrl(base, 'mingcute-clipboard-line') })
            ])
          ]),
          h('div', { class: 'success hidden' }, [
            h('svg', { class: 'size-5' }, [
              h('use', { href: iconUrl(base, 'mingcute-file-check-line') })
            ])
          ])
        ]
      )
      node.children.push(button)
    }
  }
}

// Collapse long code blocks (> displayLineCount lines)
export const addCollapse = (displayLineCount?: number, base = ''): ShikiTransformer => {
  const line = displayLineCount || 15
  return {
    name: 'shiki-transformer-add-collapse',
    pre(node) {
      if (this.lines.length <= line) return
      const collapse = h(
        'button',
        {
          class: 'collapse-toggle bg-card text-muted-foreground rounded-lg m-2',
          type: 'button',
          hidden: true,
          'aria-label': 'Toggle collapse code block'
        },
        [
          h('svg', { class: 'size-5' }, [
            h('use', { href: iconUrl(base, 'mingcute-arrow-down-line') })
          ]),
          h('span', { class: 'desc' }, ' code')
        ]
      )
      node.children.push(collapse)
      node.children.push(h('div', { class: 'collapse-fade' }))
    }
  }
}
