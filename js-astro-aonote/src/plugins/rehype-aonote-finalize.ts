import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';
import { expandHlLinesTokens, parseHlLinesMeta } from '../utils/hl-lines';
import { addClass, getClasses, hasClass, setClasses } from '../utils/hast-classes';
import type { ElementContent } from 'hast';
import { t, type Locale } from '../i18n';
import { wrapCodeBlocks, wrapTables } from './rehype-aonote';

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

function langLabel(lang: string): string {
  return LANG_LABELS[lang.toLowerCase()] ?? lang.toUpperCase();
}

/** Run after Shiki: wrap blocks, then set data-lang / data-title on .highlight. */
export function rehypeAonoteFinalize(options: { locale?: Locale } = {}) {
  const locale = options.locale ?? 'en';
  const i18n = t(locale);
  return (tree: Root) => {
    wrapTables(tree, locale);
    wrapCodeBlocks(tree, locale);

    visit(tree, 'element', (node) => {
      if (node.tagName !== 'div') return;
      const cls = node.properties?.className ?? node.properties?.class;
      const list = Array.isArray(cls) ? cls.map(String) : cls ? [String(cls)] : [];
      if (!list.includes('highlight')) return;

      const pre = node.children.find(
        (c): c is Element => c.type === 'element' && c.tagName === 'pre',
      );
      if (!pre) return;

      const rawLang =
        pre.properties?.dataLanguage ??
        pre.properties?.['data-language'] ??
        pre.properties?.language;
      const lang = rawLang ? langLabel(String(rawLang)) : undefined;

      const titleFromPre =
        pre.properties?.dataTitle ?? pre.properties?.['data-title'];
      const title = titleFromPre ? String(titleFromPre) : undefined;

      if (lang) {
        node.properties = { ...node.properties, dataLang: lang };
        pre.properties = { ...pre.properties, dataLang: lang };
      }
      if (title) {
        node.properties = { ...node.properties, dataTitle: title };
        pre.properties = { ...pre.properties, dataTitle: title };
      }

      const hlRaw =
        pre.properties?.dataHlLines ?? pre.properties?.['data-hl-lines'];
      const metaRaw = pre.properties?.metastring ?? pre.properties?.dataMeta;
      const meta = String(
        Array.isArray(metaRaw) ? metaRaw.join(' ') : metaRaw ?? '',
      );
      const hlLines = hlRaw
        ? expandHlLinesTokens(String(hlRaw))
        : parseHlLinesMeta(meta);

      if (hlLines.length) {
        const code = pre.children.find(
          (c): c is Element => c.type === 'element' && c.tagName === 'code',
        );
        if (code) {
          let lineNo = 0;
          visit(code, 'element', (line) => {
            if (!hasClass(line, 'line')) return;
            lineNo += 1;
            if (hlLines.includes(lineNo)) {
              addClass(line, 'hll');
            }
          });
        }
      }

      if (lang === 'DIFF' || String(rawLang).toLowerCase() === 'diff') {
        const code = pre.children.find(
          (c): c is Element => c.type === 'element' && c.tagName === 'code',
        );
        if (!code) return;
        visit(code, 'element', (line) => {
          if (!hasClass(line, 'line')) return;
          const text = getText(line).trimStart();
          const classes = getClasses(line);
          if (text.startsWith('-')) {
            setClasses(line, [...classes.filter((c) => c !== 'gi'), 'gd']);
            prependLabel(line, i18n.diffRemovedLineLabel);
          } else if (text.startsWith('+')) {
            setClasses(line, [...classes.filter((c) => c !== 'gd'), 'gi']);
            prependLabel(line, i18n.diffAddedLineLabel);
          }
        });
      }
    });

    enhanceImageCaptions(tree);
  };
}

/** Unwrap `<p><img/><em/></p>` so caption CSS `img+em` applies. */
function enhanceImageCaptions(tree: Root) {
  const replacements: { parent: Element; index: number; remove: number; nodes: Element[] }[] =
    [];

  visit(tree, 'element', (node, index, parent) => {
    if (!parent || index == null || node.tagName !== 'p') return;

    const meaningful = node.children.filter((c) => c.type !== 'text' || c.value.trim());
    const imgEl = meaningful.find((c): c is Element => c.type === 'element' && c.tagName === 'img');
    const emEl = meaningful.find((c): c is Element => c.type === 'element' && c.tagName === 'em');

    if (imgEl && emEl && meaningful.every((c) => c === imgEl || c === emEl)) {
      replacements.push({ parent: parent as Element, index, remove: 1, nodes: [imgEl, emEl] });
    }
  });

  for (const { parent, index, remove, nodes } of replacements.sort((a, b) => b.index - a.index)) {
    parent.children.splice(index, remove, ...(nodes as ElementContent[]));
  }
}

function getText(node: Element): string {
  let s = '';
  for (const c of node.children) {
    if (c.type === 'text') s += c.value;
    else if (c.type === 'element') s += getText(c);
  }
  return s;
}

function prependLabel(line: Element, label: string) {
  if (line.children.some((c) => c.type === 'element' && hasClass(c, 'diff-line-label'))) {
    return;
  }
  line.children.unshift({
    type: 'element',
    tagName: 'span',
    properties: { class: ['diff-line-label', 'visually-hidden'] },
    children: [{ type: 'text', value: label }],
  });
}
