import { toc } from "mdast-util-toc";
import { slug } from "github-slugger";

function simplifyTOC(ast) {
  if (!ast || !ast.children) return null;

  function traverse(node) {
    if (node.type === "list") {
      return node.children.map(traverse);
    }

    if (node.type === "listItem") {
      const paragraph = node.children.find(
        (child) => child.type === "paragraph",
      );
      const link = paragraph.children.find((child) => child.type === "link");
      const text = link.children.find((child) => child.type === "text");
      return {
        title: text.value,
        slug: slug(text.value),
        children: node.children
          .filter((child) => child.type === "list")
          .flatMap(traverse),
      };
    }
    return null;
  }
  return traverse(ast);
}

export function remarkTOC() {
  return (tree, { data }) => {
    const tocAST = toc(tree);
    data.astro.frontmatter.toc = simplifyTOC(tocAST.map);
  };
}
