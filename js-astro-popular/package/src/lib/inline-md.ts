/** Minimal inline-markdown renderer for short, author-controlled config
 *  strings (e.g. the notice banner, §5). Parity with Hugo's inline
 *  `.RenderString`: supports links, bold, emphasis, and inline code, and
 *  HTML-escapes everything else. Not a full Markdown parser; block syntax
 *  (headings, lists, images) is intentionally out of scope. */
import { withBase } from './url';

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function inlineMarkdown(src: string): string {
  let s = escapeHtml(src);
  // [label](http(s)://… | /path): only http(s) and root-relative targets
  s = s.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g,
    (_m, label, href) =>
      `<a href="${withBase(href)}"${href.startsWith('/') ? '' : ' rel="noopener" target="_blank"'}>${label}</a>`,
  );
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  return s;
}
