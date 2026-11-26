import type { Heading, Root } from 'mdast';
import type { VFile } from 'vfile';
import { toString } from 'mdast-util-to-string';

function normalizeTitle(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/** Drop the first body `# …` when it repeats frontmatter `title` (page header already has h1). */
export function remarkStripDuplicateTitle() {
  return (tree: Root, file: VFile) => {
    const frontmatter = (file.data as { astro?: { frontmatter?: { title?: string } } })
      ?.astro?.frontmatter;
    const title = frontmatter?.title;
    if (!title) return;

    const expected = normalizeTitle(title);
    const index = tree.children.findIndex(
      (node): node is Heading =>
        node.type === 'heading' && node.depth === 1,
    );
    if (index < 0) return;

    const heading = tree.children[index] as Heading;
    if (normalizeTitle(toString(heading)) !== expected) return;

    tree.children.splice(index, 1);
  };
}
