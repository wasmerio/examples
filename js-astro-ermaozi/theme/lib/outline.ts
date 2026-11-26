export type ThemeOutline = false | number | [number, number] | 'deep'

export type OutlineItem = {
  level: number
  id: string
  label: string
  children: OutlineItem[]
  lowLevel?: number
}

const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])
const ignoredClass = (value = '') => /(?:^|\s)(?:vp-bulletin|vp-demo-wrapper)(?:\s|$)/u.test(value)
const ignoredLabelClass = (value = '') => /(?:^|\s)(?:vp-badge|ignore-header)(?:\s|$)/u.test(value)

const attribute = (tag: string, name: string) => {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'iu'))
  return match?.[1] ?? match?.[2] ?? match?.[3]
}

const decodeHtml = (value: string) => value.replace(/&(?:#(\d+)|#x([\da-f]+)|([a-z]+));/giu, (entity, decimal, hex, named) => {
  if (decimal) return String.fromCodePoint(Number(decimal))
  if (hex) return String.fromCodePoint(Number.parseInt(hex, 16))
  return ({ amp: '&', apos: "'", gt: '>', lt: '<', nbsp: '\u00a0', quot: '"' } as Record<string, string>)[named.toLowerCase()] ?? entity
})

function nest(items: OutlineItem[], high: number) {
  const filtered = items.filter(item => item.level >= high)
  const roots: OutlineItem[] = []
  for (let index = 0; index < filtered.length; index += 1) {
    const current = filtered[index]
    let parent: OutlineItem | undefined
    for (let previous = index - 1; previous >= 0; previous -= 1) {
      if (filtered[previous].level < current.level) {
        parent = filtered[previous]
        break
      }
    }
    ;(parent?.children ?? roots).push(current)
  }
  return roots
}

function trimDepth(items: OutlineItem[], low: number): OutlineItem[] {
  return items.map(item => {
    const currentLow = item.lowLevel ? Math.max(item.lowLevel, low) : low
    item.children = trimDepth(item.children.filter(child => child.level <= currentLow), item.lowLevel || low)
    return item
  })
}

export function outlineOfHtml(source: string, range: ThemeOutline = [2, 3]): OutlineItem[] {
  if (range === false) return []
  const [high, low] = typeof range === 'number' ? [range, range] : range === 'deep' ? [2, 6] : range
  const html = source.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/giu, '')
  const stack: Array<{ name: string, ignored: boolean, labelIgnored: boolean }> = []
  const headings: OutlineItem[] = []
  let heading: (OutlineItem & { depth: number }) | undefined

  for (const token of html.match(/<\/?[a-z][^>]*>|[^<]+/giu) ?? []) {
    if (!token.startsWith('<')) {
      if (heading && !stack.at(-1)?.labelIgnored) heading.label += decodeHtml(token)
      continue
    }
    const parsed = token.match(/^<\s*(\/?)\s*([a-z][\w:-]*)\b/iu)
    if (!parsed) continue
    const closing = Boolean(parsed[1])
    const name = parsed[2].toLowerCase()
    if (closing) {
      const index = stack.findLastIndex(frame => frame.name === name)
      if (index < 0) continue
      if (heading && index < heading.depth) {
        heading.label = heading.label.replace(/\s+/gu, ' ').trim()
        headings.push(heading)
        heading = undefined
      }
      stack.splice(index)
      continue
    }

    const classes = decodeHtml(attribute(token, 'class') ?? '')
    const parent = stack.at(-1)
    const frame = {
      name,
      ignored: Boolean(parent?.ignored || ignoredClass(classes)),
      labelIgnored: Boolean(parent?.labelIgnored || ignoredLabelClass(classes)),
    }
    if (!VOID_TAGS.has(name) && !token.endsWith('/>')) stack.push(frame)
    const level = /^h[1-6]$/u.test(name) ? Number(name[1]) : 0
    const id = attribute(token, 'id')
    if (level && id && !frame.ignored) {
      const value = (attribute(token, 'data-outline') ?? attribute(token, 'outline') ?? '').trim()
      const configuredLow = Number(value)
      heading = {
        level,
        id: decodeHtml(id),
        label: '',
        children: [],
        ...(value && !Number.isNaN(configuredLow) && configuredLow >= level ? { lowLevel: configuredLow } : {}),
        depth: stack.length,
      }
    }
  }
  return trimDepth(nest(headings, high), low)
}
