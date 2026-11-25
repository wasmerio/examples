export function calculateReadingTimeFromHtml(html: string, wordsPerMinute = 200): number {
  if (!html) return 1;
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ') // strip tags
    .replace(/&[a-zA-Z#0-9]+;/g, ' ') // entities
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();
  const words = text ? text.split(' ').length : 0;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function calculateReadingTimeFromMarkdown(markdown: string, wordsPerMinute = 200): number {
  if (!markdown) return 1;
  // Strip code blocks, HTML, frontmatter, links/images syntax, emphasis, headings markers, lists
  const text = markdown
    // YAML frontmatter
    .replace(/^---[\s\S]*?---/m, ' ')
    // fenced code blocks
    .replace(/```[\s\S]*?```/g, ' ')
    // inline code
    .replace(/`[^`]*`/g, ' ')
    // HTML tags
    .replace(/<[^>]+>/g, ' ')
    // images ![alt](url) and links [text](url)
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^\)]*\)/g, ' ')
    // headings markers, blockquotes, lists
    .replace(/^\s{0,3}(#{1,6}|>|\*|-|\+|\d+\.)\s+/gm, ' ')
    // emphasis markers
    .replace(/[\*_]{1,3}([^\*_]+)[\*_]{1,3}/g, '$1')
    // collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();

  const wordMatches = text.match(/[A-Za-zÀ-ÖØ-öø-ÿ0-9]+/g);
  const words = wordMatches ? wordMatches.length : 0;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}


