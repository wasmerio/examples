// Section numbers and theorem-like environments, numbered in one pass.
//
//   ## Introduction \label{sec:intro}
//
//   :::theorem[Lagrange]{#thm:lagrange}
//   Body.
//   :::
//
// h2/h3 are numbered 1, 1.1, ...; theorem-like kinds share one counter that
// restarts in each section (2.1, 2.2, ...), as amsthm with [section].
// `numbering: false` in frontmatter turns section numbers off (theorems are
// then 1, 2, ...). Figures and tables are numbered 1, 2, ... per post:
//
//   :::figure{#fig:cayley}          :::table{#tab:groups}
//   ![Cayley graph](./cayley.png)   | a | b |
//                                    |---|---|
//   Caption, may contain $math$.     Caption.
//   :::                              :::
//
// (the caption can also go in brackets: :::figure[Caption]{#fig:x}).
// `\ref{id}` in prose becomes a link with the number of a section, theorem,
// figure or table (or the text of an unnumbered heading); other \ref and
// \eqref are left for MathJax.
import { visit, SKIP } from 'unist-util-visit';

// Defaults; options.labels (lemma.config.mjs) replaces them per language.
const LABELS = {
  zh: {
    theorem: '定理', lemma: '引理', proposition: '命题', corollary: '推论',
    definition: '定义', example: '例', remark: '注', proof: '证明',
    figure: '图', table: '表',
  },
  en: {
    theorem: 'Theorem', lemma: 'Lemma', proposition: 'Proposition', corollary: 'Corollary',
    definition: 'Definition', example: 'Example', remark: 'Remark', proof: 'Proof',
    figure: 'Figure', table: 'Table',
  },
};

// A paragraph holding only images (videos are images until remark-media).
const isMedia = (node) =>
  node.type === 'paragraph' &&
  node.children.some((c) => c.type === 'image') &&
  node.children.every((c) => c.type === 'image' || (c.type === 'text' && !c.value.trim()));

const REF = /\\ref\{([^}]+)\}/g;
const LABEL = /\s*\\label\{([^}]+)\}/;

const text = (value) => ({ type: 'text', value });
const span = (className, children) => ({ type: 'emphasis', data: { hName: 'span', hProperties: { className } }, children });

function langOf(file) {
  return /[/\\]en\.md$/.test(file.path ?? '') ? 'en' : 'zh';
}

// Put the inline head at the start of the first paragraph, or in its own
// paragraph if the environment starts with display math, a list, etc.
function prependHead(node, head) {
  const first = node.children[0];
  if (first?.type === 'paragraph') first.children.unshift(head, text(' '));
  else node.children.unshift({ type: 'paragraph', children: [head] });
}

function appendQed(node) {
  const qed = span(['qed'], [text('∎')]);
  const last = node.children.at(-1);
  if (last?.type === 'paragraph') last.children.push(qed);
  else node.children.push({ type: 'paragraph', data: { hProperties: { className: ['qed-line'] } }, children: [qed] });
}

// Restored directives leave split text ("\ref{thm" + ":lagrange" + "}"); join it again.
function mergeText(tree) {
  visit(tree, (node) => {
    if (!node.children) return;
    node.children = node.children.reduce((out, child) => {
      const prev = out.at(-1);
      if (prev?.type === 'text' && child.type === 'text') prev.value += child.value;
      else out.push(child);
      return out;
    }, []);
  });
}

// Take `\label{...}` out of a heading's text and return the label.
function takeLabel(heading) {
  for (const child of heading.children) {
    if (child.type !== 'text') continue;
    const m = child.value.match(LABEL);
    if (m) {
      child.value = child.value.replace(LABEL, '');
      return m[1];
    }
  }
}

/** @param {{ labels?: Record<string, Record<string, string>> }} options */
export default function remarkTheorems({ labels: custom = {} } = {}) {
  return (tree, file) => {
    const lang = langOf(file);
    const labels = { ...LABELS[lang], ...custom[lang] };
    const numbered = file.data.astro?.frontmatter?.numbering !== false;
    const numbers = new Map();
    // Labels of unnumbered headings, with the heading text.
    const names = new Map();
    let section = 0;
    let subsection = 0;
    let counter = 0;
    const floats = { figure: 0, table: 0 };
    const ids = new Set();
    const claim = (id) => {
      if (ids.has(id)) console.warn(`[theorems] ${file.path}: duplicate label ${id}`);
      ids.add(id);
    };

    // Directives we do not handle (e.g. "std::vector", "note:this", or the
    // ":intro" in "\label{sec:intro}") go back to their source text first, so
    // the passes below see whole text nodes.
    visit(tree, (node, index, parent) => {
      if (node.type !== 'textDirective' && node.type !== 'leafDirective') return;
      const { start, end } = node.position ?? {};
      const source = start && end ? String(file.value).slice(start.offset, end.offset) : `:${node.name}`;
      parent.children[index] = node.type === 'leafDirective' ? { type: 'paragraph', children: [text(source)] } : text(source);
      return SKIP;
    });
    mergeText(tree);

    visit(tree, (node) => {
      if (node.type === 'heading' && node.depth >= 2) {
        const label = takeLabel(node);
        if (label) claim(label);
        // h4-h6 are not numbered; their label sets the id, and \ref shows the heading text.
        if (!numbered || node.depth > 3) {
          if (label) {
            node.data = { hProperties: { id: label } };
            names.set(label, structuredClone(node.children));
          }
          return;
        }
        if (node.depth === 2) {
          section++;
          subsection = 0;
          counter = 0;
        } else {
          subsection++;
        }
        const n = node.depth === 2 ? `${section}` : `${section}.${subsection}`;
        if (label) numbers.set(label, n);
        node.data = { hProperties: label ? { id: label } : {} };
        node.children.unshift(span(['secnum'], [text(n)]), text(' '));
        return;
      }
      if (node.type !== 'containerDirective') return;
      if (!Object.hasOwn(labels, node.name)) {
        console.warn(`[theorems] ${file.path}: unknown environment :::${node.name}`);
        return;
      }

      const kind = node.name;
      const id = node.attributes?.id;
      if (id) claim(id);
      const classes = node.attributes?.class?.split(/\s+/) ?? [];
      // An empty label (:::theorem[]{#id}) is no title.
      const label = node.children[0]?.data?.directiveLabel ? node.children.shift().children : [];
      const title = label.length ? label : null;

      if (kind === 'figure' || kind === 'table') {
        floats[kind]++;
        const n = `${floats[kind]}`;
        if (id) numbers.set(id, n);
        // Caption: the bracket label, else the first paragraph that is not media.
        const at = title ? -1 : node.children.findIndex((c) => c.type === 'paragraph' && !isMedia(c));
        const caption = title ?? (at >= 0 ? node.children.splice(at, 1)[0].children : []);
        for (const child of node.children) if (isMedia(child)) child.data = { hName: 'div', hProperties: { className: ['figure-media'] } };
        const figcaption = {
          type: 'paragraph',
          data: { hName: 'figcaption' },
          children: [{ type: 'strong', children: [text(`${labels[kind]} ${n}.`)] }, ...(caption.length ? [text(' '), ...caption] : [])],
        };
        // Tables are captioned above, figures below, as in print.
        if (kind === 'table') node.children.unshift(figcaption);
        else node.children.push(figcaption);
        node.data = { hName: 'figure', hProperties: { className: ['float', `float-${kind}`, ...classes], id } };
        return;
      }

      if (kind === 'proof') {
        node.data = { hName: 'section', hProperties: { className: ['proof'], id } };
        prependHead(node, span(['thm-head'], title ? [...title, text('.')] : [text(`${labels.proof}.`)]));
        appendQed(node);
        return;
      }

      counter++;
      const n = numbered && section > 0 ? `${section}.${counter}` : `${counter}`;
      if (id) numbers.set(id, n);
      node.data = { hName: 'section', hProperties: { className: ['thm'], dataKind: kind, id } };
      prependHead(
        node,
        span(['thm-head'], [
          { type: 'strong', children: [text(`${labels[kind]} ${n}`)] },
          ...(title ? [text(' ('), ...title, text(')')] : []),
          text('.'),
        ]),
      );
    });

    // Last pass, after all numbers are known, so forward references work.
    visit(tree, 'text', (node, index, parent) => {
      if (!node.value.includes('\\ref{')) return;
      const parts = [];
      let last = 0;
      for (const m of node.value.matchAll(REF)) {
        const n = numbers.get(m[1]);
        const name = names.get(m[1]);
        if (n === undefined && name === undefined) continue;
        // A heading without a number is named instead, as \nameref does.
        if (n === undefined) console.warn(`[theorems] ${file.path}: \\ref{${m[1]}} points to an unnumbered heading; shown as its text`);
        if (m.index > last) parts.push(text(node.value.slice(last, m.index)));
        const children = n === undefined ? structuredClone(name) : [text(n)];
        parts.push({ type: 'link', url: `#${m[1]}`, data: { hProperties: { className: ['xref'] } }, children });
        last = m.index + m[0].length;
      }
      if (!parts.length) return;
      if (last < node.value.length) parts.push(text(node.value.slice(last)));
      parent.children.splice(index, 1, ...parts);
      return index + parts.length;
    });
  };
}
