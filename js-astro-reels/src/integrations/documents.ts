import { parse, type DefaultTreeAdapterTypes } from 'parse5';
import type { Direction, PagePolicy } from '../lib/seo.ts';

export interface MarkerSpan { start: number; end: number }
export interface ParsedDocument {
  title?: string;
  description?: string;
  lang: string;
  dir?: Direction;
  canonicalUrl?: string;
  robotsNoindex: boolean;
  redirect: boolean;
  imageUrl?: string;
  imageAlt?: string;
  pagePolicy?: PagePolicy;
  generatedImageUrl?: string;
  pageMarkerSpan?: MarkerSpan;
  socialMarkerSpan?: MarkerSpan;
}

type Node = DefaultTreeAdapterTypes.Node;
type Element = DefaultTreeAdapterTypes.Element;

function elements(node: Node): Element[] {
  if (!('childNodes' in node)) return [];
  return node.childNodes.flatMap(child => 'tagName' in child ? [child, ...elements(child)] : []);
}
function attr(node: Element, name: string): string | undefined {
  return node.attrs.find(item => item.name === name)?.value;
}
function text(node: Node): string {
  if ('value' in node) return node.value;
  return 'childNodes' in node ? node.childNodes.map(text).join('') : '';
}

export function parseDocument(html: string): ParsedDocument {
  const duplicates: number[] = [];
  const tree = parse(html, { sourceCodeLocationInfo: true, onParseError(error) {
    if (error.code === 'duplicate-attribute') duplicates.push(error.startOffset);
  } });
  const all = elements(tree);
  const head = all.find(node => node.tagName === 'head');
  const root = all.find(node => node.tagName === 'html');
  if (!head) throw new Error('Document has no head.');
  const markers = head.attrs.filter(item => item.name.startsWith('data-starter-'));
  const owned = markers.length > 0;
  const startTag = head.sourceCodeLocation?.startTag;
  if (owned && startTag && duplicates.some(offset => offset >= startTag.startOffset && offset <= startTag.endOffset)) {
    throw new Error('Duplicate head marker or attribute.');
  }
  const result: ParsedDocument = { lang: root ? attr(root, 'lang') ?? 'en' : 'en', robotsNoindex: false, redirect: false };
  for (const marker of markers) {
    const location = head.sourceCodeLocation?.attrs?.[marker.name];
    if (!location) throw new Error('Head marker has no source location.');
    const span = { start: location.startOffset, end: location.endOffset };
    if (marker.name === 'data-starter-page-v1') {
      let policy: unknown;
      try { policy = JSON.parse(marker.value); } catch { throw new Error('Invalid page marker JSON.'); }
      if (!policy || typeof policy !== 'object' || Array.isArray(policy)) throw new Error('Invalid page marker.');
      const value = policy as Record<string, unknown>;
      const pathname = value['pathname'];
      if (Object.keys(value).sort().join(',') !== 'noindex,pathname'
        || typeof pathname !== 'string' || !pathname.startsWith('/') || /[?#\s]/.test(pathname)
        || typeof value['noindex'] !== 'boolean') throw new Error('Invalid page marker schema.');
      const check = new URL('https://marker.invalid');
      check.pathname = pathname;
      if (check.pathname !== pathname) throw new Error('Page marker pathname must be serialized.');
      result.pagePolicy = { pathname, noindex: value['noindex'] };
      result.pageMarkerSpan = span;
    } else if (marker.name === 'data-starter-social-v1') {
      let url: URL;
      try { url = new URL(marker.value); } catch { throw new Error('Invalid social marker URL.'); }
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid social marker protocol.');
      result.generatedImageUrl = url.href;
      result.socialMarkerSpan = span;
    } else {
      throw new Error(`Unknown head marker: ${marker.name}.`);
    }
  }
  const nodes = elements(head);
  const title = nodes.filter(node => node.tagName === 'title').map(text);
  const values = (name: string) => nodes.filter(node => node.tagName === 'meta'
    && (attr(node, 'name')?.toLowerCase() === name || attr(node, 'property')?.toLowerCase() === name)).map(node => attr(node, 'content') ?? '');
  const description = values('description');
  for (const [name, entries] of [['title', title], ['description', description]] as const) {
    if (owned && (entries.length !== 1 || !entries[0]?.trim())) throw new Error(`Owned page requires one nonblank ${name}.`);
    if (entries[0] !== undefined) result[name] = entries[0];
  }
  const direction = root ? attr(root, 'dir') : undefined;
  if (direction !== undefined) {
    if (!['ltr', 'rtl', 'auto'].includes(direction)) throw new Error('Invalid document direction.');
    result.dir = direction as Direction;
  }
  if (owned && !result.lang.trim()) throw new Error('Owned page requires a nonblank language.');
  const canonical = nodes.filter(node => node.tagName === 'link'
    && attr(node, 'rel')?.toLowerCase().split(/\s+/).includes('canonical'));
  if (canonical.length > 1) throw new Error('Ambiguous duplicate canonical links.');
  const canonicalUrl = canonical[0] ? attr(canonical[0], 'href') : undefined;
  if (canonicalUrl !== undefined) result.canonicalUrl = canonicalUrl;
  result.robotsNoindex = values('robots').some(value => /(?:^|[\s,])(noindex|none)(?:$|[\s,])/i.test(value));
  result.redirect = nodes.some(node => node.tagName === 'meta' && attr(node, 'http-equiv')?.toLowerCase() === 'refresh');
  const image = values('og:image');
  if (owned && image.length > 1) throw new Error('Owned page has multiple social images.');
  if (image[0] !== undefined) result.imageUrl = image[0];
  const alt = values('og:image:alt')[0];
  if (alt?.trim()) result.imageAlt = alt;
  if (result.generatedImageUrl && result.imageUrl !== result.generatedImageUrl) {
    throw new Error('Social marker does not match og:image.');
  }
  return result;
}

export function removeMarkerSpans(html: string, spans: readonly MarkerSpan[]): string {
  let end = 0;
  let result = '';
  for (const span of [...spans].sort((a, b) => a.start - b.start)) {
    if (!Number.isInteger(span.start) || !Number.isInteger(span.end)
      || span.start < end || span.end <= span.start || span.end > html.length) {
      throw new Error('Invalid or overlapping marker span.');
    }
    result += html.slice(end, span.start);
    end = span.end;
  }
  return result + html.slice(end);
}
