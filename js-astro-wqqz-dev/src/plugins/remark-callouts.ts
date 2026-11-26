import type {Root as MdastRoot} from 'mdast'
import type {Blockquote, Text} from 'mdast'

const DEFAULT_TITLES: Record<string, string> = {
    note: 'Note',
    tip: 'Tip',
    important: 'Important',
    warning: 'Warning',
    caution: 'Caution',
    info: 'Info',
    success: 'Success',
}

const MARKER_RE = /^\[!([A-Za-z]+)\][+-]?[ \t]*([^\n]*)/

function collectBlockquotes(node: unknown, out: Blockquote[]) {
    if (!node || typeof node !== 'object') return
    const n = node as {type?: string; children?: unknown[]}
    if (n.type === 'blockquote') out.push(n as Blockquote)
    if (Array.isArray(n.children)) {
        for (const child of n.children) collectBlockquotes(child, out)
    }
}

export function remarkCallouts(): (tree: MdastRoot) => void {
    return (tree) => {
        const blockquotes: Blockquote[] = []
        collectBlockquotes(tree, blockquotes)

        for (const node of blockquotes) {
            const nodeTyped = node as unknown as {
                children: any[]
                data?: Record<string, unknown>
            }
            const first = nodeTyped.children?.[0]
            if (!first || first.type !== 'paragraph') continue

            const firstText = first.children?.[0] as Text | undefined
            if (!firstText || firstText.type !== 'text') continue

            const match = MARKER_RE.exec(firstText.value ?? '')
            if (!match) continue

            const type = match[1].toLowerCase()
            if (!DEFAULT_TITLES[type]) continue

            const title = match[2].trim() || DEFAULT_TITLES[type]
            const content = (firstText.value ?? '').slice(match[0].length).replace(/^\r?\n/, '')

            if (content) {
                firstText.value = content
            } else {
                first.children.shift()
                if (first.children.length === 0) nodeTyped.children.shift()
            }

            nodeTyped.data = {
                ...(nodeTyped.data ?? {}),
                hName: 'aside',
                hProperties: {className: ['prose-callout', `prose-callout-${type}`]},
            }
            nodeTyped.children = [
                {
                    type: 'paragraph',
                    data: {hName: 'p', hProperties: {className: ['prose-callout-title']}},
                    children: [{type: 'text', value: title}],
                },
                {
                    type: 'blockquoteBody',
                    data: {hName: 'div', hProperties: {className: ['prose-callout-body']}},
                    children: node.children as unknown[],
                },
            ]
        }
    }
}