import type { Element, ElementContent } from 'hast';
import { getIconData, iconToSVG, iconToHTML, replaceIDs } from '@iconify/utils';
// 用包的 ESM 入口（它自己带 import attribute），在 Vite、vitest 与 Node（tsx）下都能加载
import { icons as lucide } from '@iconify-json/lucide';

/**
 * Lucide 图标（构建期内联 SVG，零 JS）。供 Icon.astro 与需要输出 HTML 字符串的地方
 * （remark 插件、render-diagram、内联脚本模板）共用。
 *
 * - 颜色跟随 currentColor，尺寸默认 1em，与文字对齐
 * - 默认 aria-hidden；传 label 时改为 role="img" + aria-label
 */
export interface IconOptions {
  size?: number | string;
  label?: string;
  class?: string;
  strokeWidth?: number;
}

export function iconSvg(name: string, opts: IconOptions = {}): string {
  const data = getIconData(lucide, name);
  if (!data) throw new Error(`[wisp] 未知 Lucide 图标：${name}`);
  const size = opts.size ?? '1em';
  const svg = iconToSVG(data, { width: String(size), height: String(size) });
  let body = svg.body;
  if (opts.strokeWidth)
    body = body.replace(/stroke-width="[^"]*"/g, `stroke-width="${opts.strokeWidth}"`);
  const attrs: Record<string, string> = {
    ...svg.attributes,
    class: ['wisp-icon', opts.class].filter(Boolean).join(' '),
    ...(opts.label
      ? { role: 'img', 'aria-label': opts.label }
      : { 'aria-hidden': 'true', focusable: 'false' }),
  };
  return iconToHTML(replaceIDs(body), attrs);
}

export function hasIcon(name: string): boolean {
  return getIconData(lucide, name) != null;
}

/**
 * 同一个图标的 hast 节点：给 rehype 插件用（MDX 管线里不能插入 raw HTML 字符串）。
 * Lucide 的 SVG 只由 path / circle / line / rect / polyline / g 这类元素组成，这里做最小的标签解析。
 */
export function iconHast(name: string, opts: Omit<IconOptions, 'label'> = {}): Element {
  const data = getIconData(lucide, name);
  if (!data) throw new Error(`[wisp] 未知 Lucide 图标：${name}`);
  const size = String(opts.size ?? '1em');
  const svg = iconToSVG(data, { width: size, height: size });
  const root: Element = {
    type: 'element',
    tagName: 'svg',
    properties: {
      ...svg.attributes,
      xmlns: 'http://www.w3.org/2000/svg',
      className: ['wisp-icon', ...(opts.class ? [opts.class] : [])],
      ariaHidden: 'true',
      focusable: 'false',
    },
    children: [],
  };
  const stack: Element[] = [root];
  const tag = /<(\/?)([a-zA-Z][\w-]*)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>/g;
  for (const m of svg.body.matchAll(tag)) {
    const [, close, tagName, rawAttrs, self] = m;
    if (close) {
      if (stack.length > 1) stack.pop();
      continue;
    }
    const properties: Record<string, string> = {};
    for (const a of rawAttrs!.matchAll(/([\w:-]+)="([^"]*)"/g)) properties[a[1]!] = a[2]!;
    if (opts.strokeWidth && 'stroke-width' in properties)
      properties['stroke-width'] = String(opts.strokeWidth);
    const el: Element = { type: 'element', tagName: tagName!, properties, children: [] };
    (stack[stack.length - 1]!.children as ElementContent[]).push(el);
    if (!self) stack.push(el);
  }
  return root;
}
