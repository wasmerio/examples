export interface Heading {
  depth: number;
  text: string;
  slug: string;
}

export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  
  // Remove frontmatter
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---/, '');
  
  // Match markdown headings
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  
  while ((match = headingRegex.exec(withoutFrontmatter)) !== null) {
    const depth = match[1].length;
    const text = match[2].trim();
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    headings.push({ depth, text, slug });
  }
  
  return headings;
}

export function filterHeadingsForTOC(headings: Heading[]): Heading[] {
  // Only include h2 and h3 for table of contents
  return headings.filter(h => h.depth === 2 || h.depth === 3);
}