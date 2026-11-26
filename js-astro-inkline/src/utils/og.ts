import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { SITE } from "../config";

// Fonts come from @fontsource/newsreader (Latin only). Titles in other scripts
// need a font that covers them: add one to `loadFonts()` below.
const fontDir = path.join(process.cwd(), "node_modules/@fontsource/newsreader/files");
let fonts: { name: string; data: Buffer; weight: 400 | 700; style: "normal" }[] | undefined;
function loadFonts() {
  fonts ??= [
    { name: "Newsreader", data: fs.readFileSync(path.join(fontDir, "newsreader-latin-400-normal.woff")), weight: 400, style: "normal" },
    { name: "Newsreader", data: fs.readFileSync(path.join(fontDir, "newsreader-latin-700-normal.woff")), weight: 700, style: "normal" },
  ];
  return fonts;
}

const INK = "#161a2b";
const PAPER = "#f6f7f9";
const MUTED = "#5a6175";
const ACCENT = "#2b45d1";

type Card = { title: string; subtitle?: string; footer?: string };

/** Render a 1200x630 PNG: title on paper, with the inkline drawn along the bottom edge. */
export async function renderOg({ title, subtitle, footer }: Card): Promise<Uint8Array> {
  const size = title.length > 90 ? 52 : title.length > 60 ? 62 : title.length > 35 ? 74 : 88;
  const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

  const tree = el("div", { display: "flex", flexDirection: "column", justifyContent: "space-between", width: 1200, height: 630, boxSizing: "border-box", background: PAPER, color: INK, padding: "72px 80px 64px", fontFamily: "Newsreader", position: "relative" }, [
    el("div", { display: "flex", flexDirection: "column" }, [
      el("div", { display: "flex", fontSize: size, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, maxWidth: 1000 }, title),
      subtitle ? el("div", { display: "flex", fontSize: 32, lineHeight: 1.35, color: MUTED, marginTop: 28, maxWidth: 900 }, subtitle.length > 130 ? subtitle.slice(0, 127) + "…" : subtitle) : null,
    ].filter(Boolean)),
    el("div", { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 30, color: MUTED }, [
      el("div", { display: "flex", fontWeight: 700, color: INK }, SITE.title),
      footer ? el("div", { display: "flex" }, footer) : el("div", { display: "flex" }, ""),
    ]),
    el("div", { display: "flex", position: "absolute", left: 0, bottom: 0, width: 1200, height: 14, background: "#dde0e6" }, ""),
    el("div", { display: "flex", position: "absolute", left: 0, bottom: 0, width: 720, height: 14, background: ACCENT }, ""),
  ]);

  const svg = await satori(tree as any, { width: 1200, height: 630, fonts: loadFonts() });
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}
