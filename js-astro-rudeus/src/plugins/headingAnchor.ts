/**
 * 标题锚点插件
 * 注：由 GPT-5.4 生成
 */
import { visit } from 'unist-util-visit'

const headingTags = new Set(['h1', 'h2', 'h3'])

const normalizeId = (id: unknown): string | undefined => {
    if (typeof id === 'string' && id.length > 0) return id
    if (Array.isArray(id) && typeof id[0] === 'string' && id[0].length > 0) return id[0]
    return undefined
}

const getText = (node: any): string => {
    if (!node || typeof node !== 'object') return ''
    if (node.type === 'text' && typeof node.value === 'string') return node.value
    if (Array.isArray(node.children)) return node.children.map(getText).join('')
    return ''
}

const slugBase = (value: string): string => {
    return value
        .trim()
        .toLowerCase()
        .replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '')
}

const createUniqueSlug = (base: string, used: Map<string, number>): string => {
    const safeBase = base || 'heading'
    const index = used.get(safeBase) || 0
    used.set(safeBase, index + 1)
    return index === 0 ? safeBase : `${safeBase}-${index}`
}

const hasAnchorClass = (node: any, className: string): boolean => {
    const cls = node?.properties?.className
    if (typeof cls === 'string') return cls.split(/\s+/).includes(className)
    if (Array.isArray(cls)) return cls.includes(className)
    return false
}

export const headingAnchor = () => {
    return (tree: any) => {
        const used = new Map<string, number>()

        visit(tree, 'element', (node: any) => {
            if (!headingTags.has(node?.tagName)) return

            let id = normalizeId(node?.properties?.id)
            if (!id) {
                const base = slugBase(getText(node))
                id = createUniqueSlug(base, used)
                node.properties ||= {}
                node.properties.id = id
            }

            const firstChild = node.children?.[0]
            if (
                firstChild?.type === 'element' &&
                firstChild?.tagName === 'a' &&
                hasAnchorClass(firstChild, 'r-heading-anchor')
            )
                return

            node.children ||= []
            node.children.unshift({
                type: 'element',
                tagName: 'a',
                properties: {
                    href: `#${id}`,
                    className: ['r-heading-anchor'],
                    ariaLabel: '链接到此标题',
                },
                children: [{ type: 'text', value: '#' }],
            })
        })
    }
}
