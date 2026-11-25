import { parse } from 'parse5';
import { searchSections } from './search-sections.mjs';

const attr = (node, name) =>
  node?.attrs?.find((item) => item.name === name)?.value;
const children = (node) => node.childNodes ?? [];
const findAll = (node, predicate) => [
  ...(predicate(node) ? [node] : []),
  ...children(node).flatMap((child) => findAll(child, predicate)),
];
function text(node) {
  if (
    ['script', 'style', 'annotation'].includes(node.tagName) ||
    attr(node, 'data-pagefind-ignore') !== undefined ||
    attr(node, 'aria-hidden') === 'true'
  )
    return '';
  if (node.nodeName === '#text') return node.value;
  const value = children(node).map(text).join('');
  return ['p', 'div', 'li', 'tr', 'h1', 'h2', 'h3', 'h4', 'pre', 'br'].includes(
    node.tagName,
  )
    ? ` ${value} `
    : value;
}
function sections(node) {
  return searchSections(node, {
    tag: (node) => node.tagName ?? '',
    attr,
    children,
    value: (node) => (node.nodeName === '#text' ? node.value : undefined),
  });
}
/** Index rendered content only: navigation, related posts, popovers and attachments stay out. */
export function searchRecords(html) {
  const tree = parse(html);
  const language =
    attr(findAll(tree, (node) => node.tagName === 'body')[0], 'data-locale') ??
    attr(findAll(tree, (node) => node.tagName === 'html')[0], 'lang') ??
    'en';
  const canonical = findAll(
    tree,
    (node) => node.tagName === 'link' && attr(node, 'rel') === 'canonical',
  )[0];
  const url = attr(canonical, 'href');
  if (!url) return [];
  return findAll(
    tree,
    (node) => attr(node, 'data-search-record') !== undefined,
  ).map((node) => ({
    url: new URL(url).pathname,
    language,
    kind: attr(node, 'data-search-record'),
    title: attr(node, 'data-search-title') ?? '',
    description: attr(node, 'data-search-description') ?? '',
    sections: findAll(
      node,
      (child) => attr(child, 'data-search-content') !== undefined,
    ).flatMap(sections),
    body: findAll(
      node,
      (child) => attr(child, 'data-search-content') !== undefined,
    )
      .map(text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim(),
  }));
}
