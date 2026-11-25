import type { DefaultTreeAdapterMap } from 'parse5';

/** Give rendered paragraphs stable destinations in both dev and built pages. */
export function searchAnchors(tree: DefaultTreeAdapterMap['node']) {
  const changes: { start: number; end: number; value: string }[] = [];
  const ids = new Set<string>();
  const children = (node: DefaultTreeAdapterMap['node']) =>
    'childNodes' in node ? node.childNodes : [];
  const collect = (node: DefaultTreeAdapterMap['node']) => {
    if ('attrs' in node) {
      const id = node.attrs.find((attr) => attr.name === 'id')?.value;
      if (id) ids.add(id);
    }
    children(node).forEach(collect);
  };
  collect(tree);
  let index = 0;
  const visit = (node: DefaultTreeAdapterMap['node'], inContent = false) => {
    const element = 'tagName' in node ? node : undefined;
    const attr = (name: string) =>
      element?.attrs.find((item) => item.name === name)?.value;
    if (
      ['script', 'style', 'annotation'].includes(element?.tagName ?? '') ||
      attr('data-pagefind-ignore') !== undefined ||
      attr('aria-hidden') === 'true'
    )
      return;
    const content =
      inContent ||
      (attr('class') ?? '').split(/\s+/).includes('article-content');
    if (
      content &&
      ['p', 'li', 'pre', 'table'].includes(element?.tagName ?? '') &&
      attr('data-search-paragraph') === undefined
    ) {
      const end = element?.sourceCodeLocation?.startTag?.endOffset;
      if (end) {
        let attributes = ' data-search-paragraph';
        if (!attr('id')) {
          let id: string;
          do id = `search-paragraph-${++index}`;
          while (ids.has(id));
          ids.add(id);
          attributes += ` id="${id}"`;
        }
        changes.push({ start: end - 1, end: end - 1, value: attributes });
      }
    }
    children(node).forEach((child) => visit(child, content));
  };
  visit(tree);
  return changes;
}
