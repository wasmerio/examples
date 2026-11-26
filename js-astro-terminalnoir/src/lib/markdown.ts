import { Marked, type Tokens } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { createHighlighter, type ThemeRegistrationRaw } from 'shiki';
import shikiTheme from '../data/shiki/terminal-noir.json';

// Markdown comes from local starter content. Code blocks use the vendored Shiki theme.
const theme = shikiTheme as unknown as ThemeRegistrationRaw;
const LANGS = ['sh', 'bash', 'zsh', 'json', 'toml', 'css', 'ini', 'kdl', 'js', 'ts'] as const;
const HEX_COLOR = [/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/];

const highlighter = await createHighlighter({ themes: [theme], langs: [...LANGS] });

function highlight(code: string, lang: string | undefined): string {
  const known = (LANGS as readonly string[]).includes(lang ?? '');
  return highlighter.codeToHtml(code, { lang: known ? (lang as string) : 'text', theme: 'terminal-noir' });
}

const marked = new Marked({
  gfm: true,
  renderer: {
    code({ text, lang }: Tokens.Code) {
      return highlight(text, lang?.split(/\s/)[0]);
    },
    image() {
      return '';
    },
  },
});

// Image lines with a relative path resolve in a repository README, not on the site.
const RELATIVE_IMAGE_LINE = /^!\[[^\]]*\]\((?![a-z]+:)[^)]+\)\s*$/gm;

function decodedHref(value: string): string {
  return value
    .replace(/&colon;|&#0*58;|&#x0*3a;/gi, ':')
    .replace(/%3a/gi, ':')
    .replace(/[\u0000-\u0020]+/g, '');
}

function isSafeHref(href: string): boolean {
  const value = href.trim();
  if (!value || /[\u0000-\u001F\u007F\\]/.test(value)) return false;
  const decoded = decodedHref(value);
  if (decoded.startsWith('//') || value.startsWith('//')) return false;
  if (/^[a-z][a-z0-9+.-]*:/i.test(decoded)) return /^(https?:|mailto:)/i.test(decoded);
  return true;
}

function sanitize(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'br',
      'hr',
      'ul',
      'ol',
      'li',
      'a',
      'blockquote',
      'em',
      'strong',
      'del',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'pre',
      'code',
      'span',
    ],
    nonTextTags: ['script', 'style', 'textarea', 'option', 'noscript', 'svg', 'math', 'iframe'],
    allowedAttributes: {
      a: ['href', 'title', 'rel'],
      pre: ['class', 'style'],
      code: ['class', 'style'],
      span: ['class', 'style'],
      th: ['align', 'colspan', 'rowspan'],
      td: ['align', 'colspan', 'rowspan'],
    },
    allowedStyles: {
      pre: { color: HEX_COLOR, 'background-color': HEX_COLOR },
      code: { color: HEX_COLOR, 'background-color': HEX_COLOR },
      span: { color: HEX_COLOR, 'background-color': HEX_COLOR },
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? '';
        if (!isSafeHref(href)) delete attribs.href;
        else if (/^https?:\/\//i.test(href)) attribs.rel = 'noopener noreferrer';
        return { tagName, attribs };
      },
    },
  });
}

export async function renderMarkdown(source: string, options: { dropTitle?: boolean } = {}): Promise<string> {
  const tokens = marked.lexer(source.replace(RELATIVE_IMAGE_LINE, ''));
  const body =
    options.dropTitle && tokens[0]?.type === 'heading' && (tokens[0] as Tokens.Heading).depth === 1
      ? Object.assign(tokens.slice(1), { links: tokens.links })
      : tokens;
  return sanitize(marked.parser(body));
}
