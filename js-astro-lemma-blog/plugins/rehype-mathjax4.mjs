// Render TeX math to SVG at build time with MathJax 4.
//
// Input comes from remark-math: `code.math-inline` and `pre > code.math-display`
// (also ```math fenced blocks). Each post gets its own macro sandbox, so
// \newcommand in one post does not leak into another, and equation numbers
// restart per post. Per-post macros come from frontmatter `macros`.
import MathJax from '@mathjax/src';
import { fromHtml } from 'hast-util-from-html';
import { toHtml } from 'hast-util-to-html';
import { toText } from 'hast-util-to-text';
import { visit } from 'unist-util-visit';
import { visitParents } from 'unist-util-visit-parents';

// Loaded up front unless options.packages says otherwise; anything else is
// still reachable through \require or autoload.
const PACKAGES = [
  'ams', 'newcommand', 'configmacros', 'begingroup', 'mathtools', 'physics',
  'cancel', 'cases', 'empheq', 'mhchem', 'bussproofs', 'amscd', 'extpfeil',
  'centernot', 'upgreek', 'gensymb', 'units', 'textcomp', 'colortbl',
  'boldsymbol', 'color', 'html', 'enclose', 'bbox', 'dsfont', 'bbm',
];
// Built into input/tex, so not loaded separately.
const BUILTIN = new Set(['ams', 'newcommand', 'configmacros']);

let ready;
function init(macros = {}, packages = PACKAGES) {
  ready ??= MathJax.init({
    loader: {
      load: ['input/tex', 'output/svg', ...packages.filter((p) => !BUILTIN.has(p)).map((p) => `[tex]/${p}`)],
    },
    tex: {
      // Without noundefined, an unknown macro is an error (as in LaTeX), so the build warns.
      packages: { '[+]': packages, '[-]': ['noundefined'] },
      tags: 'ams',
      macros,
    },
    // Wide display math scrolls sideways instead of overflowing the column.
    svg: { fontCache: 'local', displayOverflow: 'scroll' },
  }).then(breakAfterOperators);
  return ready;
}

// Break inline math after relations and operators, as TeX does; MathJax breaks
// before them. No option for this, so it patches internals of MathJax 4.1.3
// (output/common.js markInlineBreaks, output/common/Wrappers/mo.js moLineBBox):
// re-check on upgrade.
function breakAfterOperators() {
  const { BIN, REL } = MathJax._.core.MmlTree.MmlNode.TEXCLASS;
  const output = MathJax.startup.output;
  const mark = output.markInlineBreaks;
  output.markInlineBreaks = function (node) {
    // Classes first, so a unary minus (BIN -> ORD) is not taken for a break.
    if (node?.parent?.isKind('math')) node.parent.setTeXclass(null);
    mark.call(this, node);
    for (const child of node?.childNodes ?? []) {
      if (!child.getProperty('breakable') || !child.isEmbellished) continue;
      const mo = child.coreMO();
      const attrs = mo.attributes;
      if (![BIN, REL].includes(mo.texClass) || attrs.get('linebreak') !== 'auto' || attrs.hasExplicit('linebreakstyle')) continue;
      // Nothing to break before at the end.
      if (child === node.childNodes.at(-1)) this.unmarkInlineBreaks(child);
      else attrs.set('linebreakstyle', 'after');
    }
  };
  // The space at the break is the left space of what follows the operator
  // (MathJax looks for it in the wrong place and drops it).
  const Mo = output.factory.getNodeClass('mo');
  const moLineBBox = Mo.prototype.moLineBBox;
  Mo.prototype.moLineBBox = function (i, style, obox) {
    const bbox = moLineBBox.call(this, i, style, obox);
    if (i === 0 && style === 'after') {
      let top = this;
      while (top.parent?.node.isEmbellished) top = top.parent;
      const siblings = top.parent?.childNodes ?? [];
      bbox.originalL = siblings[siblings.indexOf(top) + 1]?.getBBox().L ?? 0;
    }
    return bbox;
  };
}

// Astro may transform several files at once; MathJax state (labels, macro
// sandbox) is global, so one file at a time.
let queue = Promise.resolve();
function serial(fn) {
  const run = queue.then(fn);
  queue = run.catch(() => {});
  return run;
}

// [name, "\newcommand..."] for each macro.
function toNewcommands(macros = {}) {
  return Object.entries(macros).map(([name, def]) => {
    const [body, n, opt] = Array.isArray(def) ? def : [def];
    const args = n ? `[${n}]` + (opt !== undefined ? `[${opt}]` : '') : '';
    return [name, `\\newcommand{\\${name}}${args}{${body}}`];
  });
}

async function toSvg(tex, display) {
  const html = MathJax.startup.adaptor.serializeXML(await MathJax.tex2svgPromise(tex, { display }));
  return { html, error: html.match(/data-mjx-error="([^"]*)"/)?.[1] };
}

// The characters an SVG element draws, e.g. "(1)" for an \eqref link.
function glyphText(node) {
  let out = '';
  visit(node, 'element', (el) => {
    if (el.properties.dataC) out += String.fromCodePoint(parseInt(el.properties.dataC, 16));
    else if (el.tagName === 'text') out += toText(el);
    else return;
    return 'skip';
  });
  return out;
}

// Render one item and put the SVG in place of the item (or of its last render).
async function render(item, file, warn = true) {
  const { html, error } = await toSvg(item.tex, item.display);
  if (error && warn) console.warn(`[mathjax] ${file.path}: ${error}\n  in: ${item.tex}`);
  const [rendered] = fromHtml(html, { fragment: true }).children;
  rendered.properties ??= {};
  rendered.properties.dataTex = item.tex;
  // Screen readers get the TeX source, and links in it their number. Inline
  // math with line breaks is several <svg>s: the first carries the label, the
  // rest are hidden unless they hold a link.
  const label = item.tex.replace(/\\label\{[^}]*\}/g, '').trim();
  rendered.children
    .filter((c) => c.tagName === 'svg')
    .forEach((svg, i) => {
      const links = [];
      visit(svg, 'element', (el) => {
        if (el.tagName === 'a') links.push(el);
      });
      for (const a of links) a.properties.ariaLabel = glyphText(a);
      // An img's children are presentational, so its links would be hidden.
      if (links.length) svg.properties.role = 'group';
      if (i && !links.length) svg.properties.ariaHidden = 'true';
      else svg.properties.ariaLabel = label;
    });
  const node = item.rendered ?? item.node;
  item.parent.children[item.parent.children.indexOf(node)] = rendered;
  item.rendered = rendered;
}

function isMath(node) {
  const cls = node.properties?.className ?? [];
  return node.tagName === 'code' && (cls.includes('math-inline') || cls.includes('math-display') || cls.includes('language-math'));
}

// Bare \ref{..} / \eqref{..} in prose, as in LaTeX, without $ around them.
const REF = /\\(?:eq)?ref\{([^}]+)\}/g;

function wrapRefs(tree) {
  visitParents(tree, 'text', (node, ancestors) => {
    if (!node.value.match(REF) || ancestors.some((a) => a.tagName === 'code' || a.tagName === 'pre')) return;
    const parent = ancestors.at(-1);
    const parts = [];
    let last = 0;
    for (const m of node.value.matchAll(REF)) {
      if (m.index > last) parts.push({ type: 'text', value: node.value.slice(last, m.index) });
      parts.push({
        type: 'element',
        tagName: 'code',
        properties: { className: ['math-inline'] },
        children: [{ type: 'text', value: m[0] }],
      });
      last = m.index + m[0].length;
    }
    if (last < node.value.length) parts.push({ type: 'text', value: node.value.slice(last) });
    parent.children.splice(parent.children.indexOf(node), 1, ...parts);
  });
}

/** @param {{ macros?: Record<string, string | [string, number, string?]>, packages?: string[] }} options */
export default function rehypeMathJax4(options = {}) {
  return async (tree, file) => {
    await init(options.macros ?? {}, options.packages ?? PACKAGES);
    wrapRefs(tree);
    const items = [];
    visitParents(tree, 'element', (node, ancestors) => {
      if (!isMath(node)) return;
      const parent = ancestors.at(-1);
      const display = !node.properties.className.includes('math-inline');
      // Display math sits in a <pre>; replace the <pre>, not the <code>.
      if (display && parent?.tagName === 'pre') {
        items.push({ node: parent, parent: ancestors.at(-2), tex: toText(node), display });
      } else {
        items.push({ node, parent, tex: toText(node), display });
      }
      return 'skip';
    });
    if (!items.length) return;

    const fm = file.data.astro?.frontmatter ?? {};
    await serial(async () => {
      MathJax.texReset();
      await MathJax.tex2svgPromise('\\begingroupSandbox');
      // One macro at a time, so a broken one is named and does not drop the rest.
      for (const [name, def] of toNewcommands(fm.macros)) {
        const { error } = await toSvg(def, false);
        if (error) console.warn(`[mathjax] ${file.path}: frontmatter macro \\${name}: ${error}`);
      }

      const tags = MathJax.startup.input[0].parseOptions.tags;
      for (const item of items) {
        item.refs = [...item.tex.matchAll(REF)].map((m) => m[1]);
        // A label further down (or in the same formula) is not known yet and renders as "???".
        item.forward = item.refs.some((key) => !Object.hasOwn(tags.allLabels, key));
        await render(item, file);
      }

      // Now all labels are known. Render forward references again, but only in
      // math that cannot define a label or step the equation counter.
      const warned = new Set();
      for (const item of items.filter((item) => item.forward)) {
        const unknown = item.refs.filter((key) => !Object.hasOwn(tags.allLabels, key));
        for (const key of unknown) {
          if (!warned.has(key)) console.warn(`[mathjax] ${file.path}: unknown label ${key}`);
          warned.add(key);
        }
        if (unknown.length) continue;
        if (/\\(?:label|tag|begin)\b/.test(item.tex)) {
          console.warn(`[mathjax] ${file.path}: forward reference in math that may hold a label or number, shown as ???\n  in: ${item.tex}`);
        } else {
          await render(item, file, false);
        }
      }
    });
  };
}

// virtual:lemma/math, TeX from lemma.config.mjs rendered once for the
// templates: `formula`, the home page formula (site.intro.formula) as inline
// math, or null. Its SVG is labelled with the TeX for screen readers.
const MATH = 'virtual:lemma/math';

/** Astro integration. @param {{ formula: string | null, macros?: object, packages?: string[] }} options */
export function mathIntegration({ formula, macros = {}, packages = PACKAGES }) {
  const render = async (tex) => {
    await init(macros, packages);
    return serial(async () => {
      MathJax.texReset();
      await MathJax.tex2svgPromise('\\begingroupSandbox');
      const { html, error } = await toSvg(tex, false);
      if (error) console.warn(`[mathjax] lemma.config.mjs site.intro.formula: ${error}\n  in: ${tex}`);
      const [rendered] = fromHtml(html, { fragment: true }).children;
      // Inline math with break points is several <svg>s; the first carries the label.
      rendered.children
        .filter((c) => c.tagName === 'svg')
        .forEach((svg, i) => (i ? (svg.properties.ariaHidden = 'true') : (svg.properties.ariaLabel = tex)));
      return toHtml(rendered);
    });
  };
  return {
    name: 'lemma-math',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'lemma-math',
                resolveId: (id) => (id === MATH ? `\0${MATH}` : undefined),
                async load(id) {
                  if (id !== `\0${MATH}`) return;
                  return `export const formula = ${JSON.stringify(formula ? await render(formula) : null)};`;
                },
              },
            ],
          },
        });
      },
    },
  };
}

// The small stylesheet MathJax needs once per site (mjx-container layout).
export async function mathjaxStylesheet() {
  await init({});
  return MathJax.startup.adaptor.textContent(MathJax.svgStylesheet());
}
