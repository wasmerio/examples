import type { Element, ElementContent, Root } from 'hast';
import type { VFile } from 'vfile';
import { visit } from 'unist-util-visit';
import { iconHast } from '../lib/icons';

export interface RehypeCitationsOptions {
  /** 站点语言（config.site.lang）；文章 frontmatter 的 lang 优先 */
  lang?: string;
}

const addClass = (node: Element, name: string) => {
  const cls: unknown = node.properties.className;
  const list = Array.isArray(cls)
    ? cls.map(String)
    : typeof cls === 'string'
      ? cls.split(/\s+/)
      : [];
  if (!list.includes(name)) node.properties.className = [...list, name];
};

/**
 * GFM 脚注 → 引用（作者语法不变：`正文[^key]` + `[^key]: 出处`）。
 * - 文内标记：sup 加 .wisp-cite，链接加可读 aria-label（「参考 3」/「Reference 3」）、
 *   原生 interestfor="wisp-cite-pop-..."（鼠标悬停 / 键盘聚焦原生延迟显示预览），
 *   与 aria-describedby="wisp-cite-pop-..." 指向对应注释预览（替换 remark-gfm 默认的 footnote-label）；
 *   紧挨着的引用另加 .wisp-cite--joined / .wisp-cite--cont，样式合并成 [1, 2]
 * - 文末列表：section 加 .wisp-notes；可见标题（「参考与注释」/「References」）；
 *   每条注释生成独立的 `<div popover="hint" role="tooltip" class="wisp-cite-pop">` 预览卡片
 * - 回链：「↩」字符换成 Lucide arrow-up 图标（构建期内联 SVG），带序号区隔的 aria-label
 *   （「返回正文：参考 N」/「Back to text: reference N」）；多次引用保留唯一一枚回链，由 Citations 动态回指
 */
export default function rehypeCitations(options: RehypeCitationsOptions = {}) {
  return (tree: Root, file: VFile) => {
    const fm = (file.data as { astro?: { frontmatter?: { lang?: unknown } } }).astro?.frontmatter;
    const lang = typeof fm?.lang === 'string' && fm.lang ? fm.lang : (options.lang ?? 'zh-CN');
    const zh = /^zh\b/i.test(lang);
    const popByHref = new Map<string, string>();

    visit(tree, 'element', (node) => {
      if (node.tagName !== 'section' || node.properties?.dataFootnotes === undefined) return;
      addClass(node, 'wisp-notes');
      node.properties.ariaLabelledBy = ['footnote-label'];
      const label = node.children.find(
        (c): c is Element => c.type === 'element' && /^h[1-6]$/.test(c.tagName),
      );
      if (label) {
        label.properties.className = ['wisp-notes-title'];
        label.properties.id ??= 'footnote-label';
        label.children = [{ type: 'text', value: zh ? '参考与注释' : 'References' }];
      }
      const popovers: Element[] = [];
      let fnIndex = 0;
      visit(node, 'element', (li) => {
        if (li.tagName !== 'li') return;
        fnIndex += 1;
        let kept = false;
        visit(li, 'element', (el) => {
          for (let i = 0; i < el.children.length; i++) {
            const child = el.children[i];
            if (
              child.type !== 'element' ||
              child.tagName !== 'a' ||
              child.properties?.dataFootnoteBackref === undefined
            )
              continue;
            if (!kept) {
              kept = true;
              child.properties.className = ['wisp-backref'];
              child.properties.ariaLabel = zh
                ? `返回正文：参考 ${fnIndex}`
                : `Back to text: reference ${fnIndex}`;
              child.children = [iconHast('arrow-up')];
            } else {
              const prev = i > 0 ? el.children[i - 1] : undefined;
              if (prev && prev.type === 'text' && /^[ \t\r\n]+$/.test(prev.value)) {
                el.children.splice(i - 1, 2);
                i -= 2;
              } else {
                el.children.splice(i, 1);
                i -= 1;
              }
            }
          }
        });
        const liId = typeof li.properties?.id === 'string' ? li.properties.id : '';
        if (liId) {
          const popId = `wisp-cite-pop-${liId}`;
          popByHref.set(`#${liId}`, popId);
          popovers.push({
            type: 'element',
            tagName: 'div',
            properties: {
              id: popId,
              popover: 'hint',
              role: 'tooltip',
              className: ['wisp-cite-pop'],
            },
            children: cloneForPopover(li.children),
          });
        }
        return 'skip';
      });
      if (popovers.length) node.children.push(...popovers);
      return 'skip';
    });

    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'sup' && isCite(node)) {
        const a = node.children[0] as Element;
        const n = textOf(a).trim();
        a.properties.ariaLabel = zh ? `参考 ${n}` : `Reference ${n}`;
        const rawHref = typeof a.properties?.href === 'string' ? a.properties.href : '';
        let decodedHref = rawHref;
        try {
          decodedHref = decodeURIComponent(rawHref);
        } catch {}
        const popId = popByHref.get(rawHref) ?? popByHref.get(decodedHref);
        if (popId) {
          a.properties.interestfor = popId;
          a.properties.ariaDescribedBy = [popId];
        }
        addClass(node, 'wisp-cite');
        // 紧挨着的引用（中间没有任何文字，空白也不算）合并成 [1, 2]：前一个画逗号，后一个不画左括号。
        // CSS 的相邻选择器会跳过中间的文字，所以在这里按真实的兄弟节点判断。
        const next = parent && index !== undefined ? parent.children[index + 1] : undefined;
        if (next && next.type === 'element' && next.tagName === 'sup' && isCite(next)) {
          addClass(node, 'wisp-cite--joined');
          addClass(next, 'wisp-cite');
          addClass(next, 'wisp-cite--cont');
        }
      }
    });
  };
}

function cloneForPopover(nodes: ElementContent[]): ElementContent[] {
  const out: ElementContent[] = [];
  for (const node of nodes) {
    if (node.type === 'text') {
      out.push({ type: 'text', value: node.value });
      continue;
    }
    if (node.type !== 'element') continue;
    if (node.properties?.dataFootnoteBackref !== undefined) continue;
    const props: Element['properties'] = { ...node.properties };
    delete props.id;
    if (node.tagName === 'a' || node.tagName === 'button' || props.tabIndex !== undefined) {
      props.tabIndex = -1;
    }
    const children = cloneForPopover(node.children);
    if (
      node.tagName === 'p' &&
      children.every((c) => c.type === 'text' && /^[ \t\r\n]*$/.test(c.value))
    ) {
      continue;
    }
    out.push({
      type: 'element',
      tagName: node.tagName,
      properties: props,
      children,
    });
  }
  return out;
}

function isCite(node: Element): boolean {
  const a = node.children.length === 1 ? node.children[0] : undefined;
  return a?.type === 'element' && a.tagName === 'a' && a.properties?.dataFootnoteRef !== undefined;
}

function textOf(node: Element | ElementContent): string {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') return node.children.map(textOf).join('');
  return '';
}
