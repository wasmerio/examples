import rehypeShiki from "@shikijs/rehype";
import type { Element, Root } from "hast";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCodeGroup from "rehype-code-group";
import remarkCodeGroup from "rehype-code-group/remark";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import {
  rehypeCallouts,
  rehypeFeedCodeGroups,
  rehypeFigures,
  rehypeMedia,
  rehypePromptBlocks,
  type RenderMode,
} from "$lib/content/rehype-blog";

export type TocItem = { id: string; text: string; depth: 2 | 3 };

function textOf(node: Element): string {
  return node.children
    .map((child) =>
      child.type === "text"
        ? child.value
        : child.type === "element"
          ? textOf(child)
          : "",
    )
    .join("");
}

// Collects h2/h3 headings (after rehype-slug has given them ids) into `toc`.
function collectToc(toc: TocItem[]) {
  return () => (tree: Root) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "h2" && node.tagName !== "h3") return;
      const id = String(node.properties.id ?? "");
      if (!id) return;
      toc.push({
        id,
        text: textOf(node),
        depth: node.tagName === "h2" ? 2 : 3,
      });
    });
  };
}

// `url` is the post's absolute URL; feeds link figures back to it.
export async function renderMarkdown(
  markdown: string,
  { mode = "page", url = "" }: { mode?: RenderMode; url?: string } = {},
) {
  const toc: TocItem[] = [];

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkCodeGroup)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(collectToc(toc))
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: { class: "heading-anchor", ariaLabel: "Link to this section" },
      content: { type: "text", value: "#" },
    })
    .use(rehypeCallouts)
    .use(rehypeFigures(mode, url))
    .use(rehypePromptBlocks(mode))
    .use(rehypeMedia)
    // The blog page loads the tab script and styles; an inline <script> in {@html} would not run.
    .use(rehypeCodeGroup, { assets: "none" })
    .use(rehypeFeedCodeGroups(mode))
    .use(rehypeShiki, { theme: "github-dark-default" })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return { html: String(file), toc };
}
