import type { Element, ElementContent, Root, Text } from "hast";
import { SKIP, visit } from "unist-util-visit";
import { aiTargets, chatUrl } from "$lib/ai/links";
import { calloutIcon } from "$lib/content/callout-icons";
import { figures } from "$content/figures";
import { FIGURE_LINE } from "$lib/content/figures";

// Blog-only markdown extensions. Each keeps the source readable as plain
// markdown, so the raw .md copy and the feeds stay useful.
//
// "page" renders for the site; "feed" renders for RSS and JSON Feed, where
// components and buttons cannot run.
export type RenderMode = "page" | "feed";

const el = (
  tagName: string,
  properties: Element["properties"],
  children: ElementContent[] = [],
): Element => ({ type: "element", tagName, properties, children });
const text = (value: string): Text => ({ type: "text", value });

const textContent = (node: ElementContent): string =>
  node.type === "text"
    ? node.value
    : node.type === "element"
      ? node.children.map(textContent).join("")
      : "";

// GitHub-style alerts: `> [!TIP] Optional title` on the first line.
const calloutTitles: Record<string, string> = {
  NOTE: "Note",
  TIP: "Tip",
  IMPORTANT: "Key idea",
  WARNING: "Warning",
  CAUTION: "Caution",
  TLDR: "TL;DR",
};

export function rehypeCallouts() {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "blockquote") return;
      const first = node.children.find(
        (child): child is Element => child.type === "element",
      );
      const lead = first?.tagName === "p" ? first.children[0] : undefined;
      if (!first || lead?.type !== "text") return;

      const match = lead.value.match(/^\[!([A-Z]+)\][ \t]*([^\n]*)\n?/);
      if (!match || !(match[1] in calloutTitles)) return;

      lead.value = lead.value.slice(match[0].length);
      if (first.children.every((child) => !textContent(child).trim())) {
        node.children.splice(node.children.indexOf(first), 1);
      }
      // A note, not an <aside>: a complementary landmark inside <main> is flagged by axe.
      node.tagName = "div";
      node.properties = {
        className: ["callout", `callout-${match[1].toLowerCase()}`],
        role: "note",
      };
      node.children.unshift(
        el("p", { className: ["callout-title"] }, [
          calloutIcon(match[1]),
          text(match[2].trim() || calloutTitles[match[1]]),
        ]),
      );
    });
  };
}

// `::figure <id>` on its own line becomes an interactive figure on the page,
// and a captioned link in feeds.
export function rehypeFigures(mode: RenderMode, postUrl: string) {
  return () => (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "p" || !parent || index === undefined) return;
      const match = textContent(node).trim().match(FIGURE_LINE);
      if (!match || node.children.length !== 1) return;

      const id = match[1];
      const figure = figures[id];
      if (!figure) {
        throw new Error(`Unknown figure "${id}". Register it in src/lib/content/figures.ts.`);
      }
      parent.children[index] =
        mode === "page"
          ? el("div", { dataFigure: id })
          : el("p", {}, [
              el("em", {}, [text(`Figure: ${figure.caption}`)]),
              text(" "),
              el("a", { href: `${postUrl}#figure-${id}` }, [text("Open the interactive figure")]),
            ]);
      return SKIP;
    });
  };
}

// A ```prompt fence becomes a copyable prompt with "Open in" links.
// Must run before Shiki, which does not know the `prompt` language.
export function rehypePromptBlocks(mode: RenderMode) {
  return () => (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre" || !parent || index === undefined) return;
      const code = node.children[0];
      if (code?.type !== "element" || code.tagName !== "code") return;
      const classes = code.properties.className;
      if (!Array.isArray(classes) || !classes.includes("language-prompt")) return;

      const meta = String((code.data as { meta?: string } | undefined)?.meta ?? "");
      const title = meta.match(/title="([^"]+)"/)?.[1] ?? "Try it with your agent";
      const prompt = textContent(code).trim();

      const actions =
        mode === "page"
          ? [
              el("div", { className: ["prompt-actions"] }, [
                el("button", { type: "button", className: ["prompt-action"], dataPromptCopy: "" }, [
                  text("Copy"),
                ]),
                ...aiTargets.map((target) =>
                  el(
                    "a",
                    {
                      className: ["prompt-action"],
                      ariaLabel: `Open in ${target.label}`,
                      href: chatUrl(target.id, prompt),
                      target: "_blank",
                      rel: ["noopener", "noreferrer"],
                    },
                    [
                      el("svg", { viewBox: "0 0 24 24", width: 14, height: 14, ariaHidden: "true" }, [
                        el("path", { d: target.path, fill: "currentColor" }),
                      ]),
                      text(target.label),
                    ],
                  ),
                ),
              ]),
            ]
          : [];

      parent.children[index] = el("div", { className: ["prompt-box"] }, [
        el("div", { className: ["prompt-head"] }, [
          el("p", { className: ["prompt-title"] }, [text(title)]),
          ...actions,
        ]),
        el("pre", { className: ["prompt-text"] }, [el("code", {}, [text(prompt)])]),
      ]);
      return SKIP;
    });
  };
}

// Feeds cannot switch tabs, so a code group becomes its panels in order,
// each under its tab label.
export function rehypeFeedCodeGroups(mode: RenderMode) {
  return () => (tree: Root) => {
    if (mode !== "feed") return;
    visit(tree, "element", (node, index, parent) => {
      const classes = node.properties.className;
      if (!Array.isArray(classes) || !classes.includes("rehype-code-group")) return;
      if (!parent || index === undefined) return;

      const panels = node.children.flatMap((child) => {
        if (child.type !== "element" || child.properties.role !== "tabpanel") return [];
        const label = String(child.properties["data-rcg-label"] ?? "");
        return [el("p", {}, [el("strong", {}, [text(label)])]), ...child.children];
      });
      parent.children.splice(index, 1, ...panels);
      return [SKIP, index + panels.length];
    });
  };
}

// Images load lazily. An image alone in a paragraph with a title,
// `![alt](/images/x.png "Caption")`, becomes a captioned figure.
export function rehypeMedia() {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName === "img") {
        node.properties.loading ??= "lazy";
        node.properties.decoding ??= "async";
        return;
      }
      if (node.tagName !== "p" || !parent || index === undefined) return;
      const media = node.children.filter((child) => textContent(child).trim() || child.type === "element");
      const image = media.length === 1 && media[0].type === "element" ? media[0] : null;
      if (image?.tagName !== "img" || !image.properties.title) return;

      const caption = String(image.properties.title);
      delete image.properties.title;
      image.properties.loading ??= "lazy";
      image.properties.decoding ??= "async";
      parent.children[index] = el("figure", { className: ["media-figure"] }, [
        image,
        el("figcaption", {}, [text(caption)]),
      ]);
      return SKIP;
    });
  };
}
