// Must share `CODE_THEME` with the Markdown fence pipeline in `astro.config.mjs`.
// Create the highlighter once per build: per component costs seconds on a large site.
import { createHighlighter, type Highlighter } from "shiki";
import { CODE_THEME } from "@utils/codeTheme.mjs";

export { CODE_THEME };

/** Languages a docs page can use. An unlisted one falls back to plain text. */
export const CODE_LANGUAGES = [
  "astro",
  "bash",
  "css",
  "diff",
  "html",
  "js",
  "json",
  "jsx",
  "markdown",
  "mdx",
  "python",
  "ruby",
  "sh",
  "ts",
  "tsx",
  "yaml",
] as const;

let highlighterPromise: Promise<Highlighter> | undefined;

function getHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({
    themes: [CODE_THEME],
    langs: [...CODE_LANGUAGES],
  });

  return highlighterPromise;
}

export type DiffMarker = "add" | "remove" | "highlight";

export type HighlightOptions = {
  /** 1-based line numbers to mark with `data-highlighted`. */
  highlight?: number[];
  /** 1-based line number → marker number shown in the gutter. */
  annotations?: Map<number, number>;
  /** 1-based line number → `data-diff` value. */
  diff?: Map<number, DiffMarker>;
};

/** Returns the `<pre>` markup for `code`, or escaped plain text if `lang` is unknown. */
export async function highlightCode(
  code: string,
  lang: string,
  options: HighlightOptions = {}
): Promise<string> {
  const highlighter = await getHighlighter();
  const loaded = highlighter.getLoadedLanguages();
  const language = loaded.includes(lang) ? lang : "text";

  return highlighter.codeToHtml(code.replace(/\n+$/, ""), {
    lang: language,
    theme: CODE_THEME,
    transformers: [
      {
        line(node, line) {
          if (options.highlight?.includes(line)) {
            this.addClassToHast(node, "is-highlighted");
          }

          const marker = options.annotations?.get(line);

          if (marker !== undefined) {
            node.properties["data-annotation"] = String(marker);
          }

          const diff = options.diff?.get(line);

          if (diff !== undefined) {
            node.properties["data-diff"] = diff;
          }
        },
        pre(node) {
          // The theme's inline background would beat the shared CSS code token.
          node.properties.style = undefined;
          this.addClassToHast(node, "code-pre");
        },
      },
    ],
  });
}

/** Parses `"1,3-5"` into `[1, 3, 4, 5]`. Whitespace and empty parts are ignored. */
export function parseLineRanges(input: string | undefined): number[] {
  if (!input) return [];

  const lines: number[] = [];

  for (const part of input.split(",")) {
    const [from, to] = part.trim().split("-").map(Number);

    if (!Number.isFinite(from)) continue;

    for (let line = from; line <= (Number.isFinite(to) ? to : from); line += 1) lines.push(line);
  }

  return lines;
}

/** A line named twice wins in source order: `highlight`, then `added`, then `removed`. */
export function parseDiffLines(ranges: {
  removed?: string;
  added?: string;
  highlight?: string;
}): Map<number, DiffMarker> {
  const diff = new Map<number, DiffMarker>();

  for (const line of parseLineRanges(ranges.removed)) diff.set(line, "remove");
  for (const line of parseLineRanges(ranges.added)) diff.set(line, "add");
  for (const line of parseLineRanges(ranges.highlight)) diff.set(line, "highlight");

  return diff;
}
