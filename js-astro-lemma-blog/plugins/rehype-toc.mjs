// Collect h2/h3 for the table of contents, keeping rendered math.
//
// Must run after rehype-mathjax4. Astro's own `headings` drops math (the SVG
// has no text) and slugs "$L^2$ 空间" as "-空间", so this plugin sets the ids
// itself (with the TeX source in the slug) and passes the heading HTML to
// templates as `remarkPluginFrontmatter.toc`, together with a plain-text label
// and the first paragraph of the section (the TOC's hover preview).
import GithubSlugger from 'github-slugger';
import { toHtml } from 'hast-util-to-html';
import { visit } from 'unist-util-visit';

const isFootnoteRef = (node) =>
  node.tagName === 'sup' && node.children.some((c) => c.properties?.dataFootnoteRef !== undefined);

// Heading text with each formula replaced by its TeX source, without footnote
// marks. For a slug, \cite and \ref links are left out too, so the slug does
// not change when citations are renumbered.
function slugText(node, slug = false) {
  if (node.type === 'text') return node.value;
  if (node.tagName === 'mjx-container') return node.properties?.dataTex ?? '';
  if (node.properties?.className?.includes('secnum') || (node.tagName && isFootnoteRef(node))) return '';
  if (slug && node.tagName === 'a' && node.properties?.className?.includes('xref')) return '';
  return (node.children ?? []).map((c) => slugText(c, slug)).join('');
}

const isHeading = (node) => node.type === 'element' && (node.tagName === 'h2' || node.tagName === 'h3');

// A paragraph holding only images or videos.
const isMediaOnly = (p) =>
  p.children.every((c) => (c.type === 'element' && (c.tagName === 'img' || c.tagName === 'video')) || (c.type === 'text' && !c.value.trim()));

// A copy without links, footnote marks or media: the preview is not
// interactive, and it sits inside the TOC's own link. Ids (MathJax glyphs) get
// a prefix, as do the references to them, so they stay unique on the page.
function inertCopy(node, prefix) {
  const copy = structuredClone(node);
  visit(copy, 'element', (el, index, parent) => {
    if (el.tagName === 'img' || el.tagName === 'video' || isFootnoteRef(el)) {
      parent.children.splice(index, 1);
      return index;
    }
    if (el.tagName === 'a') {
      el.tagName = parent?.tagName === 'svg' || parent?.tagName === 'g' ? 'g' : 'span';
      el.properties = {};
    }
    if (el.properties.id) el.properties.id = prefix + el.properties.id;
    for (const key of ['href', 'xLinkHref']) {
      const href = el.properties[key];
      if (typeof href === 'string' && href.startsWith('#')) el.properties[key] = `#${prefix}${href.slice(1)}`;
    }
  });
  return copy;
}

// The first paragraph between a heading and the next one, as HTML.
function excerpt(siblings, start, prefix) {
  for (const node of siblings.slice(start)) {
    // The footnotes come after the last section but are not part of it.
    if (isHeading(node) || node.properties?.dataFootnotes !== undefined) return '';
    let found;
    visit(node, 'element', (el) => {
      if (el.tagName !== 'p' || isMediaOnly(el)) return;
      found = el;
      return false;
    });
    if (found) return toHtml(inertCopy(found, prefix).children);
  }
  return '';
}

export default function rehypeToc() {
  return (tree, file) => {
    const slugger = new GithubSlugger();
    // Ids set before (labels, theorems, references, footnotes) are taken.
    visit(tree, 'element', (node) => {
      if (typeof node.properties.id === 'string') slugger.slug(node.properties.id);
    });
    const toc = [];
    const slug = (node) => slugger.slug(slugText(node, true).trim() || `section-${toc.length + 1}`);
    visit(tree, 'element', (node, index, parent) => {
      if (/^h[4-6]$/.test(node.tagName)) node.properties.id ??= slug(node);
      const depth = { h2: 2, h3: 3 }[node.tagName];
      // The footnotes heading is screen-reader-only and not part of the outline.
      if (!depth || node.properties.id === 'footnote-label') return;
      node.properties.id ??= slug(node);
      const number = node.children.find((c) => c.properties?.className?.includes('secnum'));
      const i = toc.length;
      toc.push({
        depth,
        slug: node.properties.id,
        html: toHtml(inertCopy({ type: 'root', children: node.children }, `toc-${i}-t-`).children),
        label: [number && slugText({ children: number.children }), slugText(node).trim()].filter(Boolean).join(' '),
        excerpt: excerpt(parent.children, index + 1, `toc-${i}-p-`),
      });
    });
    file.data.astro.frontmatter.toc = toc;
  };
}
