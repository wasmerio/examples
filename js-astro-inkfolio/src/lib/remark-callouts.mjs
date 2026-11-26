/**
 * GitHub-style callouts for the docs.
 *
 *   > [!TIP]
 *   > Short advice.
 *
 * becomes <aside class="callout tip"><p>Short advice.</p></aside>.
 * Supported: NOTE, TIP, WARNING, IMPORTANT. Nothing else is touched.
 */
const KINDS = new Set(['NOTE', 'TIP', 'WARNING', 'IMPORTANT']);

export default function remarkCallouts() {
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      node.children.forEach((child, i) => {
        if (child.type === 'blockquote' && child.children?.length) {
          const first = child.children[0];
          if (first.type === 'paragraph' && first.children?.[0]?.type === 'text') {
            const match = first.children[0].value.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT)\]\s*/);
            if (match && KINDS.has(match[1])) {
              first.children[0].value = first.children[0].value.slice(match[0].length);
              if (!first.children[0].value) first.children.shift();
              node.children[i] = {
                type: 'blockquote',
                data: {
                  hName: 'aside',
                  hProperties: { className: ['callout', match[1].toLowerCase()] },
                },
                children: child.children,
              };
            }
          }
        } else {
          walk(child);
        }
      });
    };
    walk(tree);
  };
}
