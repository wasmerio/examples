/**
 * Plain-text excerpt of a post's Markdown body: what the home page cards show.
 * Plain JS so scripts/build-font.mjs can import it too and put exactly these
 * characters in the always-loaded font chunk.
 *
 * @param {string} body Markdown body (no frontmatter)
 * @param {number} [length]
 * @returns {string}
 */
export function plainExcerpt(body, length = 150) {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^\s*>\s?\[!\w+\].*$/gm, ' ')
    .replace(/^\s*:{2,}.*$/gm, ' ')
    .replace(/:(\w+)\[([^\]]*)\](\{[^}]*\})?/g, '$2')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/[#>*_`~|-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > length ? `${text.slice(0, length)}…` : text;
}
