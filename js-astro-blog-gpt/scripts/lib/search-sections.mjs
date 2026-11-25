/**
 * One extractor for parse5 (build) and DOMParser (dev). Keep paragraph text and
 * its rendered ID together; a nearby heading is only a label, not a destination.
 * @template Node
 * @param {Node} root
 * @param {{tag(node: Node): string, attr(node: Node, name: string): string | undefined,
 * children(node: Node): Node[], value(node: Node): string | undefined}} adapter
 */
export function searchSections(root, adapter) {
  const { tag, attr, children, value } = adapter;
  const ignored = (node) =>
    ['script', 'style', 'annotation'].includes(tag(node)) ||
    attr(node, 'data-pagefind-ignore') !== undefined ||
    attr(node, 'aria-hidden') === 'true';
  const heading = (node) => /^h[1-6]$/.test(tag(node));
  const paragraph = (node) => attr(node, 'data-search-paragraph') !== undefined;
  const block = (node) =>
    ['p', 'div', 'li', 'tr', 'td', 'th', 'pre', 'br'].includes(tag(node));
  const text = (node, own = false) => {
    if (ignored(node)) return '';
    if (value(node) !== undefined) return value(node);
    const result = children(node)
      .map((child) =>
        own && (paragraph(child) || heading(child)) ? '' : text(child, own),
      )
      .join('');
    return block(node) ? ` ${result} ` : result;
  };
  const result = [];
  let section = { heading: '', id: '' };
  let loose = '';
  const flush = () => {
    if (loose.trim()) result.push({ ...section, text: loose });
    loose = '';
  };
  const visit = (node, insideParagraph = false) => {
    if (ignored(node)) return;
    if (heading(node)) {
      flush();
      section = { heading: text(node).trim(), id: attr(node, 'id') ?? '' };
      result.push({ ...section, text: section.heading });
      return;
    }
    if (paragraph(node)) {
      flush();
      result.push({
        heading: section.heading,
        id: attr(node, 'id') ?? section.id,
        text: text(node, true),
      });
      children(node).forEach((child) => visit(child, true));
      return;
    }
    if (!insideParagraph && value(node) !== undefined) loose += value(node);
    if (!insideParagraph && block(node)) loose += ' ';
    children(node).forEach((child) => visit(child, insideParagraph));
    if (!insideParagraph && block(node)) loose += ' ';
  };
  visit(root);
  flush();
  return result
    .map((section) => ({
      ...section,
      text: section.text.replace(/\s+/g, ' ').trim(),
    }))
    .filter((section) => section.text);
}
