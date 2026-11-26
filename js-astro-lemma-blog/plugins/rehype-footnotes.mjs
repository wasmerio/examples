// GFM footnotes: localise the (screen-reader-only) heading and back-link
// labels, which remark-rehype emits in English for every post. The back
// links (↩) are kept out of site search excerpts.
import { visit } from 'unist-util-visit';

const LABELS = {
  zh: { heading: '注释', back: '返回正文' },
  en: { heading: 'Notes', back: 'Back to text' },
};

export default function rehypeFootnotes() {
  return (tree, file) => {
    const labels = LABELS[/[/\\]en\.md$/.test(file.path ?? '') ? 'en' : 'zh'];
    visit(tree, 'element', (node) => {
      if (node.properties?.id === 'footnote-label') {
        node.children = [{ type: 'text', value: labels.heading }];
      } else if (node.properties?.dataFootnoteBackref !== undefined) {
        node.properties.ariaLabel = labels.back;
        node.properties.dataPagefindIgnore = '';
      }
    });
  };
}
