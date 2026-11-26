import type { Element, ElementContent, Root } from 'hast';
import type { VFile } from 'vfile';
import { visit } from 'unist-util-visit';
import { splitSubwordTokens } from '../utils/title';

export interface RehypeA11yOptions {
  /** 站点语言（config.site.lang）；文章 frontmatter 的 lang 优先 */
  lang?: string;
}

/**
 * 补齐 Markdown 产物的无障碍与多语种排版属性：
 * - GFM 任务列表的 checkbox 没有可访问名称 → 用所在列表项的文字作 aria-label
 * - KaTeX 块级公式：role=group + aria-label「公式」/「Formula」
 * - KaTeX 行内公式紧接中文闭标点：标 data-wisp-kinsoku 避免标点落到行首
 * - 中日韩正文中紧邻西文/数字的链接：标 data-cjk-start / data-cjk-end 补齐间距
 * - 表格包一层 div.wisp-table：表格本身保持 display:table 铺满正文栏，列多时由外层横向滚动
 * - 纯西文 `<em>` / `<i>`（含拉丁字母且不含中日韩文字、未显式写 lang）补 `lang="en"`：
 *   读屏按英语发音（WCAG 3.1.2），中文页里的英文论文名与术语保持真斜体而不打中文着重号
 *
 * 键盘：只有确实横向溢出的容器才是 Tab 停靠点。这里给公式和表格容器写 `tabindex=0 data-wisp-tab`
 * （代码块的 pre 由 shiki.ts 写同样的属性）：这是无 JS 时的回落——不知道是否溢出，就让它们都能用键盘滚动。
 * 有 JS 时 Base 布局的脚本在首帧接管带 data-wisp-tab 的容器：不溢出的去掉 tabindex，溢出的补上
 * tabindex、role 与「…，可横向滚动」的名称，并随窗宽变化增删。
 */
const CJK_SCRIPT_RE =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Bopomofo}]/u;
const LATIN_LETTER_RE = /\p{Script=Latin}/u;
const KINSOKU_FOLLOW_RE = /^[，,。.、；;：:！!？?）》」』】〉…]/;

export default function rehypeA11y(options: RehypeA11yOptions = {}) {
  return (tree: Root, file?: VFile) => {
    const fm = (file?.data as { astro?: { frontmatter?: { lang?: unknown } } } | undefined)?.astro
      ?.frontmatter;
    const lang = typeof fm?.lang === 'string' && fm.lang ? fm.lang : (options.lang ?? 'zh-CN');
    const zh = /^zh\b/i.test(lang);

    visit(tree, 'element', (node: Element, index, parent) => {
      if (/^h[1-6]$/.test(node.tagName)) {
        splitHeadingSubwords(node);
        if (node.tagName !== 'h1' && node.properties.tabIndex === undefined) {
          node.properties.tabIndex = -1;
        }
      }
      if (node.tagName === 'table') {
        splitCellCode(node);
        addTableScopes(node);
      }
      if (node.tagName === 'table' && parent && index !== undefined && !isTableWrap(parent)) {
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['wisp-table'], tabIndex: 0, dataWispTab: '' },
          children: [node],
        };
        return 'skip';
      }
      const classes = getClassList(node);

      if (classes.includes('katex-display')) {
        node.properties.tabIndex = 0;
        node.properties.dataWispTab = '';
        node.properties.role = 'group';
        node.properties['ariaLabel'] = zh ? '公式' : 'Formula';
        return 'skip';
      }
      if (classes.includes('katex')) {
        if (parent && index !== undefined) {
          const next = parent.children[index + 1];
          if (next?.type === 'text' && KINSOKU_FOLLOW_RE.test(next.value)) {
            node.properties.dataWispKinsoku = '';
          }
        }
        return 'skip';
      }

      if (node.tagName === 'li' && classes.includes('task-list-item')) {
        const input =
          node.children.find(
            (c): c is Element =>
              c.type === 'element' && c.tagName === 'input' && c.properties?.type === 'checkbox',
          ) ?? findCheckbox(node);
        if (input && !input.properties['ariaLabel']) {
          const label = textOf(node).trim().slice(0, 120);
          if (label) input.properties['ariaLabel'] = label;
        }
      }

      if ((node.tagName === 'em' || node.tagName === 'i') && node.properties?.lang === undefined) {
        const text = textOf(node).trim();
        if (LATIN_LETTER_RE.test(text) && !CJK_SCRIPT_RE.test(text)) {
          node.properties.lang = 'en';
        }
      }

      if (
        node.tagName === 'a' &&
        parent &&
        index !== undefined &&
        node.properties?.dataFootnoteRef == null &&
        node.properties?.dataFootnoteBackref == null
      ) {
        const text = textOf(node).trim();
        if (text) {
          const prev = parent.children[index - 1];
          const next = parent.children[index + 1];
          if (
            /^[A-Za-z0-9]/.test(text) &&
            prev?.type === 'text' &&
            /[\p{Script=Han}]$/u.test(prev.value)
          ) {
            node.properties.dataCjkStart = '';
          }
          if (
            /[A-Za-z0-9]$/.test(text) &&
            next?.type === 'text' &&
            /^[\p{Script=Han}]/u.test(next.value)
          ) {
            node.properties.dataCjkEnd = '';
          }
        }
      }
    });
  };
}

/**
 * 表格增强：
 * 1. 单元格里的行内代码按空格包进 span.wisp-tok（CSS 里 nowrap），记号之间的空格留在外面——
 *    长表达式只在空格处换行，不会在 `file.py:234-358` 的连字符处断开；复制出来的文字不变。
 * 2. 长描述单元格（视觉宽度 ≥ 22 半角单位，约 11 个汉字以上）标上 data-wisp-prose，
 *    避免在多列数据表里被挤成每行仅三四个字的竖条。
 */
function splitCellCode(table: Element) {
  visit(table, 'element', (cell: Element) => {
    if (cell.tagName !== 'td') return;
    if (cell.properties?.colSpan === undefined && cellVisualWidth(textOf(cell).trim()) >= 22) {
      cell.properties.dataWispProse = '';
    }
    visit(cell, 'element', (code: Element) => {
      if (code.tagName !== 'code') return;
      if (!code.children.every((c) => c.type === 'text')) return 'skip';
      const text = code.children.map((c) => (c as { value: string }).value).join('');
      code.children = text
        .split(/(\s+)/)
        .filter(Boolean)
        .map((part) =>
          /^\s+$/.test(part)
            ? { type: 'text' as const, value: part }
            : {
                type: 'element' as const,
                tagName: 'span',
                properties: { className: ['wisp-tok'] },
                children: [{ type: 'text' as const, value: part }],
              },
        );
      return 'skip';
    });
    return 'skip';
  });
}

function addTableScopes(table: Element) {
  let hasThead = false;
  for (const section of table.children) {
    if (section.type !== 'element') continue;
    if (section.tagName === 'thead') hasThead = true;
  }
  for (const section of table.children) {
    if (section.type !== 'element') continue;
    const rows =
      section.tagName === 'tr'
        ? [section]
        : section.children.filter((c): c is Element => c.type === 'element' && c.tagName === 'tr');
    rows.forEach((tr, rowIdx) => {
      const ths = tr.children.filter(
        (c): c is Element => c.type === 'element' && c.tagName === 'th',
      );
      if (!ths.length) return;
      const isColRow =
        section.tagName === 'thead' ||
        (!hasThead &&
          rowIdx === 0 &&
          tr.children.every((c) => c.type !== 'element' || c.tagName === 'th'));
      for (const th of ths) {
        if (th.properties.scope === undefined) {
          th.properties.scope = isColRow ? 'col' : 'row';
        }
      }
    });
  }
}

function cellVisualWidth(text: string): number {
  let w = 0;
  for (const ch of text) {
    w += CJK_SCRIPT_RE.test(ch) || (ch.codePointAt(0) ?? 0) > 0x2e80 ? 2 : 1;
  }
  return w;
}

function getClassList(node: Element): string[] {
  const cls: unknown = node.properties?.className;
  if (Array.isArray(cls)) return cls.map(String);
  if (typeof cls === 'string') return cls.split(/\s+/).filter(Boolean);
  return [];
}

/**
 * Splits long identifiers and slash paths inside Markdown headings (`h1`–`h6`,
 * including inline `<code>`) with `<wbr>` so narrow viewports wrap cleanly on
 * semantic subword boundaries without touching KaTeX or SVG subtrees.
 */
function splitHeadingSubwords(node: Element): void {
  const next: ElementContent[] = [];
  let changed = false;

  for (const child of node.children) {
    if (child.type === 'text') {
      const tokens = splitSubwordTokens(child.value);
      if (tokens.length <= 1) {
        next.push(child);
        continue;
      }
      changed = true;
      for (let i = 0; i < tokens.length; i += 1) {
        if (i > 0) {
          next.push({ type: 'element', tagName: 'wbr', properties: {}, children: [] });
        }
        next.push({ type: 'text', value: tokens[i]! });
      }
      continue;
    }

    if (child.type === 'element') {
      const classes = getClassList(child);
      const skip =
        child.tagName === 'svg' ||
        child.tagName === 'math' ||
        child.tagName === 'wbr' ||
        classes.some((c) => c === 'katex' || c.startsWith('katex-'));
      if (!skip) splitHeadingSubwords(child);
    }
    next.push(child);
  }

  if (changed) node.children = next;
}

function isTableWrap(node: { type: string; properties?: Element['properties'] }): boolean {
  if (node.type !== 'element') return false;
  return getClassList(node as Element).includes('wisp-table');
}

function findCheckbox(node: Element): Element | undefined {
  for (const c of node.children) {
    if (c.type !== 'element') continue;
    if (c.tagName === 'input' && c.properties?.type === 'checkbox') return c;
    if (c.tagName === 'p') {
      const hit = findCheckbox(c);
      if (hit) return hit;
    }
  }
}

function textOf(node: Root | Element): string {
  let out = '';
  visit(node, 'text', (t: { value: string }) => {
    out += t.value;
  });
  return out.replace(/\s+/g, ' ');
}
