// A deliberately small Markdown renderer for copy that lives in YAML.
// Supports paragraphs, lists, **bold**, *italic*, `code` and [links](url).
// No raw HTML passes through, so config text cannot inject markup.

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function inline(src: string): string {
  return esc(src)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
}

/** Inline only: one line of Markdown, no block wrappers. */
export function mdInline(text?: string | null): string {
  if (!text) return '';
  return inline(String(text).trim().replace(/\s*\n+\s*/g, ' '));
}

/** Blocks: paragraphs and lists separated by blank lines. */
export function md(text?: string | null): string {
  if (!text) return '';
  const blocks = String(text).trim().split(/\n{2,}/);
  return blocks
    .map((block) => {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      if (!lines.length) return '';
      if (lines.every((l) => /^[-*]\s+/.test(l))) {
        return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ''))}</li>`).join('')}</ul>`;
      }
      if (lines.every((l) => /^\d+\.\s+/.test(l))) {
        return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\d+\.\s+/, ''))}</li>`).join('')}</ol>`;
      }
      return `<p>${lines.map(inline).join('<br />')}</p>`;
    })
    .join('');
}
