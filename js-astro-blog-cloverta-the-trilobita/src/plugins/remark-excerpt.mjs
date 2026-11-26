// Use prose from the Markdown body, without headings or embedded media.
export default function remarkExcerpt() {
  return (tree, file) => {
    const paragraphs = [];
    const inlineText = node => {
      if (node.type === 'text' || node.type === 'inlineCode') return node.value;
      if (node.type === 'break') return ' ';
      if (node.type === 'image' || node.type === 'imageReference' || node.type === 'html') return '';
      return (node.children || []).map(inlineText).join('');
    };
    const visit = node => {
      if (node.type === 'paragraph') paragraphs.push(inlineText(node));
      else for (const child of node.children || []) visit(child);
    };
    visit(tree);
    const text = paragraphs.map(paragraph => paragraph.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');
    const characters = Array.from(text);
    const excerpt = characters.length > 400
      ? `${characters.slice(0, 400).join('').trimEnd()}…`
      : text;
    file.data.astro.frontmatter.bodyExcerpt = excerpt.replace(/\s+/g, ' ');
    file.data.astro.frontmatter.bodyExcerptParagraphs = excerpt.split('\n');
  };
}
