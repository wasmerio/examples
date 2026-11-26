import { site } from "$lib/site";
import type { BlogEntry } from "$lib/content/blog";
import { figures } from "$content/figures";
import { FIGURE_LINE } from "$lib/content/figures";

// Plain-markdown view of a post for agents: /blog/<slug>.md and llms-full.txt.
// String work only: the source is already Markdown, so no unified pipeline.

export const postUrl = (slug: string) => `${site.url}/blog/${slug}`;
export const postMarkdownUrl = (slug: string) => `${postUrl(slug)}.md`;

const figureLines = new RegExp(FIGURE_LINE.source, "gm");

export function postMarkdown(entry: BlogEntry) {
  const url = postUrl(entry.slug);
  const body = entry.body.replace(figureLines, (_, id: string) => {
    const figure = figures[id];
    if (!figure) return "";
    return `> **Figure: ${figure.caption}**\n>\n> ${figure.description}\n>\n> Interactive version: ${url}#figure-${id}`;
  });

  const meta = [
    `- Author: ${site.name} (${site.url})`,
    `- Published: ${entry.published}`,
    entry.updated ? `- Updated: ${entry.updated}` : "",
    `- URL: ${url}`,
    entry.tags.length ? `- Tags: ${entry.tags.join(", ")}` : "",
  ].filter(Boolean);

  return `# ${entry.title}\n\n${entry.description}\n\n${meta.join("\n")}\n\n${body.trim()}\n`;
}
