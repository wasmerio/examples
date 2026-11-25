// 极简 DOM 辅助
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Record<string, unknown> = {},
  children: (Node | string | null | undefined)[] = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined) continue
    if (key === 'class') node.className = String(value)
    else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value as EventListener)
    } else if (key in node) {
      try {
        // 直接赋值（value/checked/type 等）；失败说明是只读属性（如 input.list）
        ;(node as unknown as Record<string, unknown>)[key] = value
      } catch {
        // 回退为 HTML 属性（datalist 关联等依赖 attribute 生效）
        node.setAttribute(key, String(value))
      }
    } else {
      node.setAttribute(key, String(value))
    }
  }
  for (const child of children) {
    if (child === null || child === undefined) continue
    node.append(child)
  }
  return node
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (ch) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch] as string,
  )
}

export function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/')
}
