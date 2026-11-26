// Citations: `\cite{key}`, `\cite{a,b}`, `\cite[Thm.~3]{key}` in prose become
// numbered links ([1], [1, 2], [1, Thm. 3]), numbered in order of first
// citation, and a reference list in AMS style is appended to the post.
//
// Entries come from BibTeX files (option `bibliographies`, file URLs; missing
// files are skipped). A key in several files is taken from the first.
// Must run after remark-theorems, which restores the ":key" in keys with a colon.
import { existsSync, readFileSync } from 'node:fs';
import { Cite, plugins } from '@citation-js/core';
import '@citation-js/plugin-bibtex';
import '@citation-js/plugin-csl';
import { fromHtml } from 'hast-util-from-html';
import { select } from 'hast-util-select';
import { visit } from 'unist-util-visit';

// The reference list style: options.style (a CSL file URL), by default AMS
// numeric from the CSL styles repository (CC BY-SA 3.0).
const STYLE = 'lemma';
const DEFAULT_STYLE = new URL('./ams-numeric.csl', import.meta.url);

const CITE = /\\cite(?:\[([^\]]*)\])?\{([^}]+)\}/g;
// citation-js mangles TeX in titles, so math is swapped for tokens before
// parsing and put back as inline math (rendered by MathJax) afterwards. The
// braces around a token keep its case in title-case styles; TOKEN also ignores
// case, as a fallback.
const TOKEN = /mathph(\d+)x/gi;

const HEADING = { zh: '参考文献', en: 'References' };

const text = (value) => ({ type: 'text', value });

let library;
function load(urls) {
  const id = urls.map((u) => u.href).join(' ');
  if (library?.id === id) return library;
  const math = [];
  const data = [];
  for (const url of urls.filter((u) => existsSync(u))) {
    // \$ is a literal dollar sign, not math.
    const bib = readFileSync(url, 'utf8').replace(/(?<!\\)\$((?:\\.|[^$\\])+)\$/g, (_, tex) => `{mathph${math.push(tex) - 1}x}`);
    // An empty export (no entries yet) is valid; citation-js rejects it.
    if (!/@\w+\s*\{/.test(bib)) continue;
    for (const entry of new Cite(bib).data) {
      if (data.some((d) => d.id === entry.id)) console.warn(`[cite] ${url.pathname}: duplicate key ${entry.id}, using the first`);
      else data.push(entry);
    }
  }
  const cite = new Cite(data);
  library = { id, cite, math, ids: new Set(data.map((d) => d.id)) };
  return library;
}

// Hast text nodes with math tokens become text + inline-math code elements.
function restoreMath(tree, math) {
  visit(tree, 'text', (node, index, parent) => {
    if (!node.value.match(TOKEN)) return;
    const parts = node.value.split(TOKEN).map((part, i) =>
      i % 2 ? { type: 'element', tagName: 'code', properties: { className: ['math-inline'] }, children: [text(math[part])] } : text(part),
    );
    const kept = parts.filter((p) => p.type !== 'text' || p.value);
    parent.children.splice(index, 1, ...kept);
    return index + kept.length;
  });
}

/** @param {{ bibliographies: URL[], style?: URL }} options */
export default function remarkCite({ bibliographies, style = DEFAULT_STYLE }) {
  plugins.config.get('@csl').styles.add(STYLE, readFileSync(style, 'utf8'));
  return (tree, file) => {
    const lang = /[/\\]en\.md$/.test(file.path ?? '') ? 'en' : 'zh';
    const order = [];
    let lib;

    visit(tree, 'text', (node, index, parent) => {
      if (!node.value.includes('\\cite')) return;
      lib ??= load(bibliographies);
      const parts = [];
      let last = 0;
      for (const m of node.value.matchAll(CITE)) {
        if (m.index > last) parts.push(text(node.value.slice(last, m.index)));
        parts.push(text('['));
        m[2].split(',').forEach((raw, i) => {
          const key = raw.trim();
          if (i) parts.push(text(', '));
          if (!lib.ids.has(key)) {
            console.warn(`[cite] ${file.path}: unknown key ${key}`);
            parts.push(text('?'));
            return;
          }
          if (!order.includes(key)) order.push(key);
          parts.push({
            type: 'link',
            url: `#ref-${key}`,
            data: { hProperties: { className: ['xref'] } },
            children: [text(String(order.indexOf(key) + 1))],
          });
        });
        if (m[1]) parts.push(text(`, ${m[1].replaceAll('~', ' ')}`));
        parts.push(text(']'));
        last = m.index + m[0].length;
      }
      if (!parts.length) return;
      if (last < node.value.length) parts.push(text(node.value.slice(last)));
      parent.children.splice(index, 1, ...parts);
      return index + parts.length;
    });

    if (!order.length) return;

    const entries = lib.cite.format('bibliography', {
      format: 'html',
      style: STYLE,
      lang: 'en-US',
      entry: order,
      nosort: true,
      asEntryArray: true,
    });
    const items = entries.map(([id, html]) => {
      const body = select('.csl-right-inline', fromHtml(html, { fragment: true }));
      return { type: 'element', tagName: 'li', properties: { id: `ref-${id}` }, children: body?.children ?? [] };
    });
    restoreMath({ type: 'root', children: items }, lib.math);

    // Left out of site search: titles of cited works would match more often
    // than the post itself, and an excerpt from the list says little.
    tree.children.push(
      { type: 'heading', depth: 2, data: { hProperties: { id: 'references', dataPagefindIgnore: '' } }, children: [text(HEADING[lang])] },
      { type: 'references', data: { hName: 'ol', hProperties: { className: ['references'], dataPagefindIgnore: '' }, hChildren: items } },
    );
  };
}
