export type HeadItem = [string, Record<string, unknown>?, unknown?]

const voidTags = new Set(['base', 'link', 'meta'])
const escapeHtml = (value: unknown) => String(value ?? '').replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')

export const headMetaContent = (items: HeadItem[], name: string) => String(items.find(([tag, attributes]) => tag.toLowerCase() === 'meta' && String(attributes?.name ?? '').toLowerCase() === name.toLowerCase())?.[1]?.content ?? '')
export const hasRobotsDirective = (items: HeadItem[], directive: string) => headMetaContent(items, 'robots').split(',').some(part => part.trim().toLowerCase() === directive.toLowerCase())

export function serializeHeadItems(items: HeadItem[]) {
  return items.map(([tag, rawAttributes, content = '']) => {
    const normalizedTag = tag.toLowerCase()
    const attributes = rawAttributes && typeof rawAttributes === 'object' && !Array.isArray(rawAttributes) ? rawAttributes : {}
    if (!/^[a-z][\w-]*$/u.test(normalizedTag) || Object.keys(attributes).some(name => !/^[\w:-]+$/u.test(name))) return ''
    const serialized = Object.entries(attributes).flatMap(([name, value]) => value === false || value == null
      ? []
      : [value === true ? ` ${name}` : ` ${name}="${escapeHtml(value)}"`]).join('')
    return voidTags.has(normalizedTag)
      ? `<${normalizedTag} data-ermaozi-managed-head${serialized}>`
      : `<${normalizedTag} data-ermaozi-managed-head${serialized}>${normalizedTag === 'script' || normalizedTag === 'style' ? String(content ?? '') : escapeHtml(content)}</${normalizedTag}>`
  }).join('')
}
