import type { FigureMeta } from "$lib/content/figures";
import ExampleFigure from "./ExampleFigure.astro";

// Figures a post can place with `::figure <id>` on a line of its own.
// An unknown id fails the build. Each figure needs a component and a caption
// plus a text description (used where components cannot run: feeds, .md, llms-full.txt).

export const figureComponents: Record<string, typeof ExampleFigure> = {
  example: ExampleFigure,
};

export const figures: Record<string, FigureMeta> = {
  example: {
    caption: "An example figure: write, check, ship, on a loop.",
    description:
      "Three boxes in a row, labelled Write, Check and Ship. A highlight steps through them in turn, then starts over.",
  },
};
