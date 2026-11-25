/**
 * Sätteri MDAST plugins for Patrika.
 *
 * wikilinkResolver — converts wikilink hrefs (raw title, URL-encoded) to /notes/slug paths.
 * directiveToHtml  — converts :::aside and :::annotation container directives to HTML divs.
 *
 * Both run as hastPlugins / mdastPlugins on the Sätteri processor.
 */

// ── Slugify (mirrors src/utils/text.ts#slugify exactly) ──────────────────────
function slugify(str: string): string {
  return str
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── HAST plugin: resolve wikilink hrefs ──────────────────────────────────────
// element visitor requires { filter, visit } shape per Sätteri HastFilteredVisitor API
export const wikilinkResolver = {
  name: 'wikilink-resolver',
  element: {
    filter: ['a'],
    visit(node: any, ctx: any) {
      const href = node.properties?.href as string | undefined;
      if (!href) return;
      // Skip absolute URLs, root-relative paths, mailto
      if (
        href.startsWith('http') ||
        href.startsWith('/') ||
        href.startsWith('mailto')
      ) return;
      // Bare same-page anchor: [[#Heading]] — lowercase/slug to match the
      // auto-generated heading id, but don't prefix a page path.
      if (href.startsWith('#')) {
        ctx.setProperty(node, 'href', `#${slugify(decodeURIComponent(href.slice(1)))}`);
        return;
      }
      // Sätteri emits wikilink href as raw URL-encoded title, optionally
      // carrying a #Heading suffix verbatim — split before slugifying so
      // the page and heading don't get merged into one slug.
      const decoded = decodeURIComponent(href);
      const hashIndex = decoded.indexOf('#');
      const page = hashIndex === -1 ? decoded : decoded.slice(0, hashIndex);
      const heading = hashIndex === -1 ? '' : decoded.slice(hashIndex + 1);
      const slug = slugify(page);
      const anchor = heading ? `#${slugify(heading)}` : '';
      ctx.setProperty(node, 'href', `/notes/${slug}${anchor}`);
    },
  },
};

// ── Text extraction from MDAST child nodes ────────────────────────────────────
function extractHtml(node: any): string {
  if (!node) return '';
  switch (node.type) {
    case 'text':       return escapeHtml(node.value ?? '');
    case 'emphasis':   return `<em>${(node.children ?? []).map(extractHtml).join('')}</em>`;
    case 'strong':     return `<strong>${(node.children ?? []).map(extractHtml).join('')}</strong>`;
    case 'inlineCode': return `<code>${escapeHtml(node.value ?? '')}</code>`;
    case 'link': {
      const href = escapeAttr(node.url ?? '');
      const text = (node.children ?? []).map(extractHtml).join('');
      return `<a href="${href}">${text}</a>`;
    }
    case 'paragraph':  return `<p>${(node.children ?? []).map(extractHtml).join('')}</p>`;
    default:
      if (Array.isArray(node.children)) return node.children.map(extractHtml).join('');
      return '';
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

// ── MDAST plugin: Obsidian text formatting ───────────────────────────────────
// Wikilinks and image embeds are handled natively by Sätteri's `wikilinks`
// feature; only comments and highlights need porting from remark-obsidian.ts.
export const obsidianTextFormatting = {
  name: 'obsidian-text-formatting',
  text(node: any, ctx: any) {
    const value: string = node.value ?? '';
    const stripped = value.replace(/%%[\s\S]*?%%/g, '');

    const highlightRegex = /==(.+?)==/g;
    if (!highlightRegex.test(stripped)) {
      if (stripped !== value) ctx.setProperty(node, 'value', stripped);
      return;
    }

    const segments: Array<{ type: string; value: string }> = [];
    let lastIndex = 0;
    highlightRegex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = highlightRegex.exec(stripped)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', value: stripped.slice(lastIndex, match.index) });
      }
      segments.push({ type: 'html', value: `<mark>${escapeHtml(match[1])}</mark>` });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < stripped.length) {
      segments.push({ type: 'text', value: stripped.slice(lastIndex) });
    }

    const parent = ctx.parent(node);
    const index = ctx.indexOf(node);
    if (!parent || index === undefined) return;

    ctx.removeNode(node);
    ctx.insertChildAt(parent, index, segments);
  },
};

// ── MDAST plugin: convert directives to HTML ─────────────────────────────────
export const directiveToHtml = {
  name: 'directive-to-html',
  containerDirective(node: any, ctx: any) {
    const name: string = node.name;
    if (name !== 'aside' && name !== 'annotation') return;

    const children: any[] = Array.isArray(node.children) ? node.children : [];
    const innerHtml = children.map(extractHtml).join('\n');

    const label = `<span class="${name}__label">${name}</span>`;
    const date: string | undefined = node.attributes?.date;
    const dateHtml = date ? `\n<span class="${name}__date">${escapeHtml(date)}</span>` : '';

    const fullHtml = `<div class="${name}">${label}\n${innerHtml}${dateHtml}</div>`;
    ctx.replaceNode(node, { type: 'html', value: fullHtml });
  },
};
