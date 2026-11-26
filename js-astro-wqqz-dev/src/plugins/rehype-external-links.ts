import type {Root as HastRoot} from 'hast'
import {visit} from 'unist-util-visit'

const EXTERNAL_HREF = /^(?:https?:)?\/\//i

function isExternal(href: unknown): href is string {
    return typeof href === 'string' && EXTERNAL_HREF.test(href.trim())
}

export function rehypeExternalLinks(): (tree: HastRoot) => void {
    return (tree) => {
        visit(tree, 'element', (node) => {
            if (node.tagName !== 'a') return

            const properties = node.properties ?? {}
            if (!isExternal(properties.href)) return

            const rel = new Set(
                String(properties.rel ?? '')
                    .split(/\s+/)
                    .filter(Boolean),
            )
            rel.add('noopener')
            rel.add('noreferrer')

            node.properties = {
                ...properties,
                target: '_blank',
                rel: [...rel],
            }
        })
    }
}
