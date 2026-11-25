import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

import { OG, SITE } from "../config";

/**
 * Build-time social preview images.
 *
 * satori reads TrueType, not woff2, and the opentype parser it bundles chokes
 * on the fvar table of a variable font — so this is a static single-weight cut
 * of JetBrains Mono rather than the webfont in public/. It lives in src/assets
 * so it is never served to visitors. Cached, since every post wants it.
 */
let fontPromise: Promise<Buffer> | undefined;

function loadFont(): Promise<Buffer> {
  fontPromise ??= readFile(
    // Relative to the project root: this module is bundled into dist/ during a
    // build, so import.meta.url would point at the wrong tree.
    join(process.cwd(), "src/assets/fonts/jetbrains-mono-latin-400.ttf"),
  );

  return fontPromise;
}

const INK = "#0b0c0e";
const PAPER = "#e9e7e1";
const FAINT = "rgba(233,231,225,0.45)";
const ACCENT = "#c85a52";

interface OgOptions {
  title: string;
  /** Monospace stamp under the rule, e.g. "2026.05.08". */
  stamp?: string;
  tags?: string[];
}

/** satori takes a React-shaped tree; these keep the literals readable. */
const node = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown,
) => ({ type, props: { style, children } });

const text = (value: string, style: Record<string, unknown>) =>
  node("div", style, value);

export async function renderOgImage(options: OgOptions): Promise<Buffer> {
  const { title, stamp, tags = [] } = options;
  const font = await loadFont();

  const footer = [stamp, tags.join(" · ")].filter(Boolean).join("  —  ");

  const markup = node(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: "100%",
      height: "100%",
      padding: "72px 80px",
      backgroundColor: INK,
      fontFamily: "JetBrains Mono",
      color: PAPER,
    },
    [
      text(SITE.title.toUpperCase(), {
        fontSize: 24,
        letterSpacing: "0.34em",
        color: FAINT,
      }),

      node("div", { display: "flex", flexDirection: "column", gap: 40 }, [
        text(title, {
          fontSize: title.length > 46 ? 56 : 68,
          lineHeight: 1.18,
          letterSpacing: "-0.01em",
        }),
        node("div", {
          display: "flex",
          width: 96,
          height: 3,
          backgroundColor: ACCENT,
        }),
      ]),

      text(footer, {
        fontSize: 22,
        letterSpacing: "0.14em",
        color: FAINT,
      }),
    ],
  );

  const svg = await satori(markup as never, {
    width: OG.width,
    height: OG.height,
    fonts: [
      {
        name: "JetBrains Mono",
        data: font,
        weight: 400,
        style: "normal",
      },
    ],
  });

  return Buffer.from(
    new Resvg(svg, {
      fitTo: { mode: "width", value: OG.width },
    })
      .render()
      .asPng(),
  );
}
