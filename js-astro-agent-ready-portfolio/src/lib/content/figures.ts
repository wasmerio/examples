// Interactive figures used in posts. A post places one with a line of its own:
//
//   ::figure harness-anatomy
//
// The figures themselves are registered in content/figures/index.ts. Feeds,
// the raw .md copy and llms-full.txt cannot run components,
// so they use each figure's caption and description instead.
export type FigureMeta = { caption: string; description: string };


export const FIGURE_LINE = /^::figure\s+([a-z0-9-]+)\s*$/;

// The rendered page swaps this placeholder for the figure component.
const PLACEHOLDER = /<div data-figure="([a-z0-9-]+)"><\/div>/;

export type PostSegment =
  | { type: "html"; html: string }
  | { type: "figure"; id: string };

export function splitFigures(html: string): PostSegment[] {
  const parts = html.split(new RegExp(PLACEHOLDER, "g"));
  return parts.flatMap((part, index): PostSegment[] => {
    if (index % 2 === 1) return [{ type: "figure", id: part }];
    return part.trim() ? [{ type: "html", html: part }] : [];
  });
}
