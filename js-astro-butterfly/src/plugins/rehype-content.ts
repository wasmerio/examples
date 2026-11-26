import type { Root, Element } from 'hast';
import { visit, SKIP } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import { HexoSlugger } from '../lib/slug';
import { site, features } from '../config';

const HEADING = /^h[1-6]$/;
const siteHost = new URL(site.url).host;

/**
 * Post-processing for rendered Markdown:
 *  - heading ids using the Hexo slug algorithm (old #anchors keep working) + hover anchor link
 *  - images: lazy/async decoding, wrapped for the lightbox; iframes: lazy
 *  - external links: new tab + nofollow (Hexo external_link + hexo-filter-nofollow)
 *  - standalone images with alt text become <figure> + <figcaption> (Butterfly
 *    photofigcaption, but at build time: no JS, no layout shift, works offline)
 *  - root-relative links and images ("/posts/x/", "/img/a.png") get the site's
 *    base path, so Markdown written for "/" also works under GitHub project pages
 */
export default function rehypeContent({ base = '/' }: { base?: string } = {}) {
  const prefix = base.replace(/\/+$/, '');
  const withBase = (v: unknown) => {
    const s = String(v ?? '');
    if (!prefix || !s.startsWith('/') || s.startsWith('//') || s === prefix || s.startsWith(`${prefix}/`)) return v;
    return prefix + s;
  };
  return (tree: Root) => {
    const slugger = new HexoSlugger();

    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName === 'img' || node.tagName === 'source') node.properties.src = withBase(node.properties.src) as string;
      if (node.tagName === 'a') node.properties.href = withBase(node.properties.href) as string;
      if (HEADING.test(node.tagName)) {
        const id = (node.properties.id as string | undefined) ?? slugger.slug(toString(node));
        node.properties.id = id;
        node.children.push({
          type: 'element',
          tagName: 'a',
          properties: { className: ['headerlink'], href: `#${encodeURIComponent(id)}`, ariaLabel: '本节链接', tabIndex: -1 },
          children: [],
        });
        return;
      }

      if (node.tagName === 'img') {
        node.properties.loading ??= 'lazy';
        node.properties.decoding ??= 'async';
        const cls = (node.properties.className as string[] | undefined) ?? [];
        const inCard = cls.some((c) => c.startsWith('site-card'));
        if (!inCard && parent && typeof index === 'number' && (parent as Element).tagName !== 'a') {
          // wrap with a link to the full image so the lightbox can open it. A post's own
          // image only gets its final URL at render time; initContent() links those.
          // The router and prefetch must leave these same-origin image links alone.
          const src = node.properties.src as string;
          parent.children[index] = {
            type: 'element',
            tagName: 'a',
            properties: { ...(/^(\/|https?:)/.test(src) ? { href: src } : {}), className: ['lightbox'], dataPswp: '', dataAstroReload: '', dataAstroPrefetch: 'false', ariaLabel: String(node.properties.alt || '查看原图') },
            children: [node],
          };
        }
        return;
      }

      // embedded demos and videos: load when scrolled near, not with the page
      if (node.tagName === 'iframe') {
        node.properties.loading ??= 'lazy';
        return;
      }

      if (node.tagName === 'a') {
        const href = String(node.properties.href ?? '');
        if (!/^https?:\/\//.test(href)) return;
        try {
          if (new URL(href).host === siteHost) return;
        } catch {
          return;
        }
        node.properties.target = '_blank';
        node.properties.rel = ['noopener', 'external', 'nofollow', 'noreferrer'];
      }
    });

    // Raw HTML in Markdown stays a string (no rehype-raw): add the attribute there too.
    visit(tree, 'raw', (node: { value: string }) => {
      node.value = node.value.replace(/<iframe\b(?![^>]*\bloading=)/gi, '<iframe loading="lazy"');
    });

    if (features.photoCaption) {
      visit(tree, 'element', captionStandaloneImage);
      visit(tree, 'element', captionInlineImage);
    }
  };
}

/** alt text that is really a file name or a placeholder says nothing to readers */
const NOT_A_CAPTION = /^(image|img|图片|截图|screenshot)?[\w.-]*\.(png|jpe?g|gif|webp|avif|svg)$|^(image|img|图片|截图|screenshot)$/i;

/** <p><a.lightbox><img alt></a></p> (nothing else but whitespace) → <figure>…<figcaption> */
function captionStandaloneImage(node: Element) {
  if (node.tagName !== 'p') return;
  const content = node.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
  if (content.length !== 1 || content[0].type !== 'element') return;
  const only = content[0];
  const img = only.tagName === 'img' ? only : only.tagName === 'a' ? only.children.find((c): c is Element => c.type === 'element' && c.tagName === 'img') : undefined;
  if (!img || (only.tagName === 'a' && only.children.filter((c) => c.type === 'element').length !== 1)) return;
  const alt = String(img.properties.alt ?? '').trim();
  if (!alt || NOT_A_CAPTION.test(alt)) return;
  node.tagName = 'figure';
  node.properties = { className: ['img-figure'] };
  node.children = [only, caption('figcaption', alt)];
}

const caption = (tag: 'figcaption' | 'span', alt: string): Element => ({
  type: 'element', tagName: tag, properties: { className: ['img-alt'] }, children: [{ type: 'text', value: alt }],
});

/**
 * An image that shares its paragraph / list item with text (`步骤…
![alt](…)`):
 * <figure> isn't allowed there, so wrap link + caption in a centred block span.
 */
function captionInlineImage(node: Element, index: number | undefined, parent: Root | Element | undefined) {
  if (node.tagName !== 'a' || !(node.properties.className as string[] | undefined)?.includes('lightbox')) return;
  if (!parent || typeof index !== 'number' || (parent as Element).tagName === 'figure') return;
  if ((parent as Element).properties?.className && ((parent as Element).properties.className as string[]).includes('img-figure')) return;
  const img = node.children.find((c): c is Element => c.type === 'element' && c.tagName === 'img');
  const alt = String(img?.properties.alt ?? '').trim();
  if (!img || !alt || NOT_A_CAPTION.test(alt)) return;
  parent.children[index] = {
    type: 'element', tagName: 'span', properties: { className: ['img-figure'] }, children: [node, caption('span', alt)],
  };
  return SKIP; // don't descend into the new wrapper
}
