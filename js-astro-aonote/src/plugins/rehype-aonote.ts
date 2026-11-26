import { visit } from 'unist-util-visit';
import type { Parent } from 'unist';
import type { Element, Root, ElementContent } from 'hast';
import type { VFile } from 'vfile';
import { t, type Locale } from '../i18n';
import { readImageDimensions, resolveImagePath } from '../utils/image-dimensions';
import { parseTableCaptionLine } from '../utils/table-caption';

const LANG_LABELS: Record<string, string> = {
  python: 'PYTHON',
  py: 'PYTHON',
  javascript: 'JS',
  js: 'JS',
  typescript: 'TS',
  ts: 'TS',
  bash: 'SHELL',
  shell: 'SHELL',
  sh: 'SHELL',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  markdown: 'MD',
  md: 'MD',
  diff: 'DIFF',
  sql: 'SQL',
};

const ADMONITION_CLASS: Record<string, string> = {
  note: 'note',
  tip: 'tip',
  warning: 'warning',
  danger: 'danger',
  caution: 'warning',
  important: 'note',
};

function langLabel(lang: string): string {
  return LANG_LABELS[lang.toLowerCase()] ?? lang.toUpperCase();
}

function isElement(node: unknown): node is Element {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    (node as { type: string }).type === 'element'
  );
}

function isParent(node: unknown): node is Parent {
  return (
    typeof node === 'object' &&
    node !== null &&
    'children' in node &&
    Array.isArray((node as Parent).children)
  );
}

function hasClass(node: Element, name: string): boolean {
  const cls = node.properties?.className ?? node.properties?.class;
  if (!cls) return false;
  const list = Array.isArray(cls) ? cls.map(String) : String(cls).split(/\s+/);
  return list.includes(name);
}

function addClass(node: Element, name: string): void {
  const cls = node.properties?.className ?? node.properties?.class;
  const classes = Array.isArray(cls)
    ? cls.map(String)
    : cls
      ? String(cls).split(/\s+/).filter(Boolean)
      : [];
  if (classes.includes(name)) return;
  node.properties = {
    ...node.properties,
    className: [...classes, name],
    class: undefined,
  };
}

function hasProperty(node: Element, ...names: string[]): boolean {
  return names.some((name) => Object.prototype.hasOwnProperty.call(node.properties ?? {}, name));
}

function extractText(node: Element): string {
  let out = '';
  for (const child of node.children ?? []) {
    if (child.type === 'text') out += child.value;
    else if (child.type === 'element') out += extractText(child);
  }
  return out;
}

function parseMeta(meta?: string): { title?: string; hlLines: number[] } {
  if (!meta) return { hlLines: [] };
  const titleMatch = /title=(?:"([^"]*)"|'([^']*)'|([^\s]+))/.exec(meta);
  const title = titleMatch?.[1] ?? titleMatch?.[2] ?? titleMatch?.[3];
  const hlMatch = /hl_lines="([^"]*)"/.exec(meta);
  const hlLines = hlMatch
    ? hlMatch[1]!.split(/\s+/).map((n) => Number(n)).filter((n) => !Number.isNaN(n))
    : [];
  return { title, hlLines };
}

export function getLanguageFromPre(pre: Element): string | undefined {
  const dataLanguage = pre.properties?.['data-language'];
  if (typeof dataLanguage === 'string') return dataLanguage.toLowerCase();

  const dataLang = pre.properties?.dataLang;
  if (typeof dataLang === 'string') return dataLang.toLowerCase();

  const code = pre.children.find((c): c is Element => c.type === 'element' && c.tagName === 'code');
  if (!code?.properties?.className) return undefined;
  const classes = Array.isArray(code.properties.className)
    ? code.properties.className.map(String)
    : [String(code.properties.className)];
  for (const cls of classes) {
    if (cls.startsWith('language-')) return cls.slice(9);
    if (cls === 'diff') return 'diff';
  }
  return undefined;
}

function transformDirectivesToAdmonitions(tree: Root) {
  visit(tree, 'element', (node, index, parent) => {
    if (!parent || index == null) return;
    const name = String(node.properties?.dataDirective ?? node.properties?.directiveName ?? '');
    const label = node.properties?.label ? String(node.properties.label) : undefined;
    const classes = Array.isArray(node.properties?.className)
      ? node.properties.className.map(String)
      : node.properties?.className
        ? [String(node.properties.className)]
        : [];

    const directiveName =
      name ||
      classes.find((c) => ADMONITION_CLASS[c]) ||
      classes.find((c) => c.startsWith('directive-'))?.replace('directive-', '');

    if (!directiveName || !ADMONITION_CLASS[directiveName]) return;
    if (node.tagName !== 'div' && node.tagName !== 'section' && node.tagName !== 'aside') return;

    const kind = ADMONITION_CLASS[directiveName]!;
    const children = [...node.children];
    let titleText = label;
    if (!titleText && children[0]?.type === 'element' && children[0].tagName === 'p') {
      titleText = extractText(children[0]);
      children.shift();
    }

    const admonitionChildren: ElementContent[] = [];
    if (titleText) {
      admonitionChildren.push({
        type: 'element',
        tagName: 'p',
        properties: { className: ['admonition-title'] },
        children: [{ type: 'text', value: titleText }],
      });
    }
    admonitionChildren.push(...children);

    const admonition: Element = {
      type: 'element',
      tagName: 'div',
      properties: { className: ['admonition', kind] },
      children: admonitionChildren,
    };
    parent.children[index] = admonition;
  });
}

export function wrapTables(tree: Root, locale: Locale) {
  const i18n = t(locale);
  const tableCaptionPrefix = i18n.tableCaptionPrefix;
  const fallbackLabel = i18n.tableScrollRegionFallbackLabel;

  visit(tree, 'element', (node, _index, parent) => {
    if (node.tagName !== 'table' || !isParent(parent)) return;
    let index = parent.children.indexOf(node);
    if (index === -1) return;
    if (isElement(parent) && parent.tagName === 'div' && hasClass(parent, 'table-wrapper')) return;

    const fromData =
      node.properties?.dataCaption ??
      node.properties?.['data-caption'];
    let captionText = fromData ? String(fromData).trim() : undefined;
    let captionIndex: number | undefined;

    if (!captionText) {
      for (let i = index - 1; i >= 0; i--) {
        const sib = parent.children[i];
        if (sib?.type === 'text' && !String(sib.value).trim()) continue;
        if (sib?.type === 'element' && sib.tagName === 'p') {
          const text = extractText(sib).trim();
          if (!text) continue;
          const parsed = parseTableCaptionLine(text);
          if (parsed) {
            captionText = parsed;
            captionIndex = i;
          }
          break;
        }
        break;
      }
    }
    if (captionIndex != null) {
      parent.children.splice(captionIndex, 1);
      if (captionIndex < index) index -= 1;
    }

    if (captionText && !node.children.some((c) => c.type === 'element' && c.tagName === 'caption')) {
      node.children.unshift({
        type: 'element',
        tagName: 'caption',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['table-caption-prefix'], ariaHidden: 'true' },
            children: [{ type: 'text', value: tableCaptionPrefix }],
          },
          { type: 'text', value: captionText },
        ],
      });
    }

    const wrapper: Element = {
      type: 'element',
      tagName: 'div',
      properties: {
        className: ['table-wrapper'],
        role: 'region',
        tabIndex: 0,
        ariaLabel: captionText
          ? i18n.tableScrollRegionLabel(captionText)
          : fallbackLabel,
      },
      children: [node],
    };
    parent.children[index] = wrapper;
  });
}

export function wrapCodeBlocks(tree: Root, locale: Locale) {
  const i18n = t(locale);
  visit(tree, 'element', (node, _index, parent) => {
    if (node.tagName !== 'pre' || !isParent(parent)) return;
    const index = parent.children.indexOf(node);
    if (index === -1) return;
    if (isElement(parent) && parent.tagName === 'div' && hasClass(parent, 'highlight')) return;

    const titleFromPre =
      node.properties?.['data-title'] ?? node.properties?.dataTitle;
    const metaAttr = node.properties?.dataMeta ?? node.properties?.meta;
    const meta = String(
      (Array.isArray(metaAttr) ? metaAttr.join(' ') : metaAttr) ??
        (node.data as { meta?: string } | undefined)?.meta ??
        '',
    );
    const { title: titleFromMeta, hlLines } = parseMeta(meta);
    const title = titleFromPre ? String(titleFromPre) : titleFromMeta;
    const lang = getLanguageFromPre(node);
    const label = lang ? langLabel(lang) : undefined;

    applyLineHighlights(node, hlLines);

    const wrapper: Element = {
      type: 'element',
      tagName: 'div',
      properties: { className: ['highlight'] },
      children: [node],
    };
    if (label) {
      (wrapper.properties as Record<string, unknown>).dataLang = label;
      node.properties = { ...node.properties, dataLang: label };
    }
    if (title) {
      (wrapper.properties as Record<string, unknown>).dataTitle = title;
      node.properties = { ...node.properties, dataTitle: title };
    }
    const hlFromPre =
      node.properties?.dataHlLines ?? node.properties?.['data-hl-lines'];
    if (hlFromPre) {
      (wrapper.properties as Record<string, unknown>)['data-hl-lines'] = hlFromPre;
    } else if (hlLines.length) {
      (wrapper.properties as Record<string, unknown>)['data-hl-lines'] = hlLines.join(' ');
    }
    if (hlLines.length) {
      node.properties = {
        ...node.properties,
        'data-hl-lines': hlLines.join(' '),
      };
    }
    node.properties = {
      ...node.properties,
      tabIndex: 0,
      ariaLabel: label ? i18n.codeBlockLanguageLabel(label) : i18n.codeBlockLabel,
    };

    parent.children[index] = wrapper;
  });
}

function applyLineHighlights(pre: Element, lines: number[]) {
  if (!lines.length) return;
  const code = pre.children.find((c): c is Element => c.type === 'element' && c.tagName === 'code');
  if (!code) return;
  let lineNo = 0;
  visit(code, 'element', (child) => {
    const cls = child.properties?.className;
    const classes = Array.isArray(cls) ? cls.map(String) : cls ? [String(cls)] : [];
    if (classes.some((c) => c === 'line' || c.startsWith('line'))) {
      lineNo += 1;
      if (lines.includes(lineNo)) {
        child.properties = {
          ...child.properties,
          className: [...classes.filter((c) => c !== 'hll'), 'hll'],
        };
      }
    }
  });
}

function enhanceFootnotes(tree: Root, locale: Locale) {
  const i18n = t(locale);
  visit(tree, 'element', (node) => {
    if (
      node.tagName === 'section' &&
      (hasClass(node, 'footnotes') || hasProperty(node, 'dataFootnotes', 'data-footnotes'))
    ) {
      addClass(node, 'footnote');
    }

    if (/^h[1-6]$/.test(node.tagName) && hasClass(node, 'sr-only')) {
      addClass(node, 'visually-hidden');
    }

    if (
      node.tagName === 'a' &&
      (hasClass(node, 'footnote-ref') ||
        hasProperty(node, 'dataFootnoteRef', 'data-footnote-ref'))
    ) {
      addClass(node, 'footnote-ref');
      const num = extractText(node) || '1';
      node.properties = {
        ...node.properties,
        ariaLabel: i18n.footnoteRefLabel(num),
      };
    }
    if (
      node.tagName === 'a' &&
      (hasClass(node, 'footnote-backref') ||
        hasClass(node, 'data-footnote-backref') ||
        hasProperty(node, 'dataFootnoteBackref', 'data-footnote-backref'))
    ) {
      addClass(node, 'footnote-backref');
      const num =
        `${extractText(node)} ${String(node.properties?.ariaLabel ?? '')}`.replace(/[^\d]/g, '') ||
        '1';
      node.properties = {
        ...node.properties,
        ariaLabel: i18n.footnoteBackrefLabel(num),
      };
    }
  });
}

function enhanceTaskLists(tree: Root, locale: Locale) {
  const i18n = t(locale);
  visit(tree, 'element', (node) => {
    if (!hasClass(node, 'task-list-item')) return;
    const input = node.children.find(
      (c): c is Element => c.type === 'element' && c.tagName === 'input',
    );
    const checked = Boolean(input?.properties?.checked);
    const taskText = extractText(node).replace(/\s+/g, ' ').trim();
    const label = checked
      ? i18n.taskCompletedLabel(taskText)
      : i18n.taskIncompleteLabel(taskText);

    if (input) {
      input.properties = {
        ...input.properties,
        ariaDisabled: 'true',
      };
    }
    node.properties = {
      ...node.properties,
      dataTaskState: checked ? 'completed' : 'incomplete',
    };

    if (!node.children.some((c) => c.type === 'element' && hasClass(c, 'task-state-label'))) {
      node.children.unshift({
        type: 'element',
        tagName: 'span',
        properties: { className: ['task-state-label', 'visually-hidden'] },
        children: [{ type: 'text', value: label }],
      });
    }
  });
}

function enhanceImages(tree: Root, contentFilePath?: string) {
  const projectRoot = process.cwd();
  visit(tree, 'element', (node) => {
    if (node.tagName !== 'img') return;
    const src = String(node.properties?.src ?? '');
    const resolved = resolveImagePath(src, contentFilePath, projectRoot);
    const dims = resolved ? readImageDimensions(resolved) : null;

    node.properties = {
      ...node.properties,
      loading: node.properties?.loading ?? 'lazy',
      decoding: node.properties?.decoding ?? 'async',
      ...(dims
        ? { width: dims.width, height: dims.height }
        : {}),
    };
  });
}

/** Split image + caption into sibling `img` + `em` for `.post-content img+em` caption CSS. */
function enhanceImageCaptions(tree: Root) {
  const replacements: { parent: Element; index: number; nodes: Element[]; removeCount: number }[] =
    [];

  visit(tree, 'element', (node, index, parent) => {
    if (!parent || index == null || node.tagName !== 'p') return;

    const meaningful = node.children.filter((c) => c.type !== 'text' || c.value.trim());
    const imgEl = meaningful.find((c): c is Element => c.type === 'element' && c.tagName === 'img');
    const emEl = meaningful.find((c): c is Element => c.type === 'element' && c.tagName === 'em');

    if (imgEl && emEl && meaningful.every((c) => c === imgEl || c === emEl)) {
      replacements.push({
        parent: parent as Element,
        index,
        nodes: [imgEl, emEl],
        removeCount: 1,
      });
      return;
    }

    if (meaningful.length === 1 && imgEl) {
      const next = parent.children[index + 1];
      if (!next || next.type !== 'element' || next.tagName !== 'p') return;
      const nextKids = next.children.filter((c) => c.type !== 'text' || c.value.trim());
      const nextEm = nextKids.find((c): c is Element => c.type === 'element' && c.tagName === 'em');
      if (nextEm && nextKids.every((c) => c === nextEm)) {
        replacements.push({
          parent: parent as Element,
          index,
          nodes: [imgEl, nextEm],
          removeCount: 2,
        });
      }
    }
  });

  for (const { parent, index, nodes, removeCount } of replacements.sort((a, b) => b.index - a.index)) {
    parent.children.splice(index, removeCount, ...nodes);
  }
}

const ADMONITION_TAGS = new Set(['note', 'tip', 'warning', 'danger', 'caution', 'important']);

function toAdmonitionElement(kind: string, children: ElementContent[]): Element {
  const body = [...children];
  let titleText: string | undefined;
  if (body[0]?.type === 'element' && body[0].tagName === 'p') {
    const first = body[0];
    if (hasClass(first, 'directive-label') || extractText(first).length < 80) {
      titleText = extractText(first);
      body.shift();
    }
  }
  const admonitionChildren: ElementContent[] = [];
  if (titleText) {
    admonitionChildren.push({
      type: 'element',
      tagName: 'p',
      properties: { className: ['admonition-title'] },
      children: [{ type: 'text', value: titleText }],
    });
  }
  admonitionChildren.push(...body);
  return {
    type: 'element',
    tagName: 'div',
    properties: { className: ['admonition', kind] },
    children: admonitionChildren,
  };
}

/** Map remark-directive output (<tip>, etc.) to Aonote admonition markup. */
function mapDirectiveContainers(tree: Root) {
  visit(tree, 'element', (node, index, parent) => {
    if (!parent || index == null) return;

    if (ADMONITION_TAGS.has(node.tagName)) {
      const kind = ADMONITION_CLASS[node.tagName] ?? 'note';
      parent.children[index] = toAdmonitionElement(kind, node.children as ElementContent[]);
      return;
    }

    const cls = node.properties?.className;
    const list = Array.isArray(cls) ? cls.map(String) : cls ? [String(cls)] : [];
    const directiveClass = list.find((c) => ADMONITION_CLASS[c]);
    if (!directiveClass) return;
    if (!['div', 'section', 'aside'].includes(node.tagName)) return;

    parent.children[index] = toAdmonitionElement(
      ADMONITION_CLASS[directiveClass]!,
      node.children as ElementContent[],
    );
  });
}

export function rehypeAonoteEnhance(options: { locale?: Locale } = {}) {
  const locale = options.locale ?? 'en';
  return (tree: Root, file?: VFile) => {
    mapDirectiveContainers(tree);
    transformDirectivesToAdmonitions(tree);
    enhanceImages(tree, file?.path);
    enhanceImageCaptions(tree);
    enhanceFootnotes(tree, locale);
    enhanceTaskLists(tree, locale);
  };
}
