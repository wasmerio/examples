import { searchSections } from '../../scripts/lib/search-sections.mjs';

export type SearchSection = { heading: string; id: string; text: string };
export function contextSnippets(
  sections: SearchSection[],
  query: string,
  radius = 36,
) {
  const terms = [
    ...new Set(query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean)),
  ].sort((a, b) => b.length - a.length);
  if (!terms.length) return [];
  const pattern = new RegExp(
    terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
    'gi',
  );
  return sections.flatMap((section) => {
    const ranges: [number, number][] = [];
    for (const match of section.text.matchAll(pattern)) {
      const start = Math.max(0, match.index! - radius),
        end = Math.min(
          section.text.length,
          match.index! + match[0].length + radius,
        );
      const last = ranges.at(-1);
      if (last && start <= last[1] + 16) last[1] = Math.max(last[1], end);
      else ranges.push([start, end]);
    }
    return ranges.length
      ? [
          {
            ...section,
            text: ranges
              .map(
                ([start, end]) =>
                  `${start ? '…' : ''}${section.text.slice(start, end)}${end < section.text.length ? '…' : ''}`,
              )
              .join(' '),
          },
        ]
      : [];
  });
}
export function renderedSections(document: Document): SearchSection[] {
  return [...document.querySelectorAll('[data-search-content]')].flatMap(
    (root) =>
      searchSections<Node>(root, {
        tag: (node) =>
          node instanceof Element ? node.tagName.toLowerCase() : '',
        attr: (node, name) =>
          node instanceof Element
            ? (node.getAttribute(name) ?? undefined)
            : undefined,
        children: (node) => [...node.childNodes],
        value: (node) =>
          node.nodeType === Node.TEXT_NODE
            ? (node.textContent ?? '')
            : undefined,
      }),
  );
}
