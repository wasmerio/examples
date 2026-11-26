import type { Code, Parent, Root } from "mdast";

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Replaces ```mermaid fences with raw <pre class="mermaid"> before syntax
 * highlighting runs, so Shiki never sees them and the client can render them.
 */
export function remarkMermaid() {
  return (tree: Root) => {
    const visit = (node: Parent) => {
      node.children?.forEach((child, index) => {
        if (child.type === "code" && (child as Code).lang === "mermaid") {
          node.children[index] = {
            type: "html",
            value: `<pre class="mermaid not-prose">${escape((child as Code).value)}</pre>`,
          } as never;
          return;
        }
        if ("children" in child) visit(child as Parent);
      });
    };

    visit(tree);
  };
}
