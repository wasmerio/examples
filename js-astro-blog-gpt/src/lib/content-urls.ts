import { parse, type DefaultTreeAdapterMap } from 'parse5';
import { searchAnchors } from './search-anchors.ts';
import { trimUrl, srcsetCandidates } from './url-values.ts';

const urlAttributes = new Set([
  'href',
  'src',
  'poster',
  'data',
  'action',
  'cite',
]);
function resolve(value: string, page: URL): string {
  const normalized = trimUrl(value);
  if (!normalized || /^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(normalized))
    return value;
  const url = new URL(value, page);
  return `${url.pathname}${url.search}${url.hash}`;
}
function srcset(value: string, page: URL): string {
  for (const { url, start, end } of srcsetCandidates(value).reverse())
    value = value.slice(0, start) + resolve(url, page) + value.slice(end);
  return value;
}

/** Resolve relative content URLs before Astro swaps the DOM at the old browser URL. */
export function contentUrls(html: string, page: URL, site = page): string {
  const tree = parse(html, { sourceCodeLocationInfo: true });
  const changes = searchAnchors(tree);
  function visit(
    node: DefaultTreeAdapterMap['node'],
    inMain = false,
    inContent = false,
  ) {
    const element = 'tagName' in node ? node : undefined;
    const main = inMain || element?.tagName === 'main';
    const content =
      inContent ||
      !!element?.attrs.some(
        (attr) =>
          attr.name === 'class' &&
          attr.value.split(/\s+/).includes('article-content'),
      );
    if (content && element?.tagName === 'a') {
      const href = element.attrs.find((attr) => attr.name === 'href')?.value;
      if (
        href &&
        !element.attrs.some((attr) => attr.name === 'data-external')
      ) {
        try {
          const target = new URL(href, site);
          const end = element.sourceCodeLocation?.startTag?.endOffset;
          if (
            /^https?:$/.test(target.protocol) &&
            target.origin !== site.origin &&
            end
          )
            changes.push({
              start: end - 1,
              end: end - 1,
              value: ' data-external',
            });
        } catch {
          /* Malformed author URLs remain unchanged. */
        }
      }
    }
    if (main && element)
      for (const attribute of element.attrs) {
        if (!urlAttributes.has(attribute.name) && attribute.name !== 'srcset')
          continue;
        const value =
          attribute.name === 'srcset'
            ? srcset(attribute.value, page)
            : resolve(attribute.value, page);
        const location = element.sourceCodeLocation?.attrs?.[attribute.name];
        if (value !== attribute.value && location)
          changes.push({
            start: location.startOffset,
            end: location.endOffset,
            value: `${attribute.name}="${value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"`,
          });
      }
    if ('childNodes' in node)
      for (const child of node.childNodes) visit(child, main, content);
    if (element?.tagName === 'template' && 'content' in element)
      visit(element.content as DefaultTreeAdapterMap['documentFragment'], main);
  }
  visit(tree);
  for (const change of changes.sort((a, b) => b.start - a.start))
    html = html.slice(0, change.start) + change.value + html.slice(change.end);
  return html;
}
