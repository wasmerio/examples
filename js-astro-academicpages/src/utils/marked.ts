import katex from 'katex';
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';

import { resolveHtmlUrls } from '@utils/url';

marked.use(markedKatex({ nonStandard: true }), {
  renderer: {
    link(token) {
      const isExternal = /^(https?:)?\/\//i.test(token.href);
      const text = this.parser.parseInline(token.tokens);
      const titleAttr = token.title ? ` title="${token.title}"` : '';
      if (isExternal)
        return `<a href="${token.href}"${titleAttr} target="_blank">${text}<span class="sr-only"> (opens in a new tab)</span></a>`;

      return `<a href="${token.href}"${titleAttr}>${text}</a>`;
    },
  },
  extensions: [
    {
      name: 'inlineKatex',
      level: 'inline',
      renderer: (token) =>
        katex.renderToString(token.text, { displayMode: false }),
    },
  ],
});

/**
 * Parses inline markdown and LaTeX math (e.g., $E=mc^2$) into HTML,
 * while automatically resolving relative Markdown links against the base URL.
 *
 * @param text - The raw string containing optional Markdown and KaTeX math
 * @returns Sanitized and formatted HTML string
 */
export function parseInline(text?: string | null): string {
  if (!text) return '';

  return resolveHtmlUrls(marked.parseInline(text) as string);
}
