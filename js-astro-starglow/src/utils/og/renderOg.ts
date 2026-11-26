import { readFile } from "node:fs/promises";
import { join } from "node:path";
import satori from "satori";
import sharp from "sharp";
import config from "@/config";
import { ogColors } from "@/utils/ogTheme";
import { codePointCoverage } from "@/utils/og/fontCoverage";

// The page type scale is laid out at half size and doubled, so the image keeps
// the same proportions as the site.
const OG_SCALE = 2;
const TOKENS = {
  label: 14,
  display: 24,
  xs: 4,
  md: 16,
  xl: 32,
  border: 1,
} as const;
const px = (token: number): number => token * OG_SCALE;

const WIDTH = 1200;
const HEIGHT = 630;
const TITLE_LINE_HEIGHT = 1.25;
const BODY_LINE_HEIGHT = 1.5;
const TITLE_LINES = 3;

export type OgInput = {
  title: string;
  typeLabel?: string;
  date?: string;
  description?: string;
};

type OgNode = {
  type: string;
  key: null;
  props: { style?: Record<string, unknown>; children?: unknown };
};

type OgFont = {
  name: string;
  data: Buffer;
  weight: 400 | 600;
  style: "normal";
};

type OgFonts = { fonts: OgFont[]; covers: (codePoint: number) => boolean };

/**
 * Vendored fonts, no network at build. satori takes one file per family and
 * weight, so the Cyrillic subset is its own family, listed after Inter in
 * `FONT_FAMILY`.
 */
const FONT_FILES: [string, string, 400 | 600][] = [
  ["Inter", "inter-latin-400-normal.woff", 400],
  ["Inter", "inter-latin-600-normal.woff", 600],
  ["Inter Cyrillic", "inter-cyrillic-400-normal.woff", 400],
  ["Inter Cyrillic", "inter-cyrillic-600-normal.woff", 600],
];
const FONT_FAMILY = "Inter, Inter Cyrillic";

let fontsPromise: Promise<OgFonts> | undefined;

function loadOgFonts(): Promise<OgFonts> {
  fontsPromise ??= (async () => {
    const dir = join(process.cwd(), "src/assets/fonts");
    const fonts = await Promise.all(
      FONT_FILES.map(async ([name, file, weight]): Promise<OgFont> => ({
        name,
        data: await readFile(join(dir, file)),
        weight,
        style: "normal",
      }))
    );
    const lookups = fonts.map(font => codePointCoverage(font.data));
    return {
      fonts,
      covers: codePoint => lookups.some(lookup => lookup(codePoint)),
    };
  })();
  return fontsPromise;
}

/** Plain-text stand-ins for symbols the vendored subsets do not draw. */
const SYMBOL_FALLBACKS: Record<string, string> = {
  "\u2190": "<-",
  "\u2192": "->",
  "\u2194": "<->",
  "\u21d2": "=>",
  "\u2260": "!=",
  "\u2264": "<=",
  "\u2265": ">=",
  "\u2248": "~",
};
/** Characters that draw nothing, so no glyph is needed. */
const NO_GLYPH_NEEDED = /[\p{Cc}\p{Cf}\p{Zs}\p{Zl}\p{Zp}\p{Mn}]/u;

/**
 * Returns the text with uncovered symbols swapped for their plain-text
 * stand-ins. Anything else the fonts cannot draw stops the build with the
 * character and the text, because satori would draw an empty box.
 */
export function fitToFonts(
  text: string,
  covers: (codePoint: number) => boolean,
  field: string
): string {
  let fitted = "";
  for (const character of text) {
    const codePoint = character.codePointAt(0) ?? 0;
    if (NO_GLYPH_NEEDED.test(character) || covers(codePoint)) {
      fitted += character;
      continue;
    }
    const fallback = SYMBOL_FALLBACKS[character];
    if (
      fallback !== undefined &&
      [...fallback].every(c => covers(c.codePointAt(0) ?? 0))
    ) {
      fitted += fallback;
      continue;
    }
    const hex = codePoint.toString(16).toUpperCase().padStart(4, "0");
    throw new Error(
      `[og] the ${field} "${text}" holds U+${hex} (${character}), which the vendored Inter Latin and Cyrillic fonts cannot draw. Remove it, or vendor a font that has it (src/assets/fonts, src/utils/og/renderOg.ts).`
    );
  }
  return fitted;
}

function el(
  type: string,
  style: Record<string, unknown>,
  children?: unknown
): OgNode {
  return { type, key: null, props: { style, children } };
}

function buildTree(
  input: OgInput,
  fit: (text: string, field: string) => string
): OgNode {
  const title = fit(input.title, "title");
  const typeLabel = input.typeLabel && fit(input.typeLabel, "type label");
  const date = input.date && fit(input.date, "date");
  const description =
    input.description && fit(input.description, "description");
  const host = fit(new URL(config.site.url).hostname, "host");
  const author = fit(config.site.author, "author");
  const isDefault = !typeLabel;

  const top: OgNode[] = [];
  if (typeLabel) {
    top.push(
      el(
        "div",
        {
          display: "flex",
          fontSize: px(TOKENS.label),
          fontWeight: 600,
          lineHeight: BODY_LINE_HEIGHT,
          color: ogColors.mutedForeground,
        },
        typeLabel
      )
    );
  }
  top.push(
    el(
      "div",
      {
        display: "block",
        marginTop: typeLabel ? px(TOKENS.md) : 0,
        fontSize: px(TOKENS.display),
        fontWeight: 600,
        lineHeight: TITLE_LINE_HEIGHT,
        color: ogColors.accent,
        lineClamp: TITLE_LINES,
        wordBreak: "break-word",
      },
      title
    )
  );
  if (isDefault && description) {
    top.push(
      el(
        "div",
        {
          display: "block",
          marginTop: px(TOKENS.md),
          fontSize: px(TOKENS.label),
          fontWeight: 400,
          lineHeight: BODY_LINE_HEIGHT,
          color: ogColors.foreground,
          lineClamp: TITLE_LINES,
          wordBreak: "break-word",
        },
        description
      )
    );
  }

  const hostLine = (marginTop: number): OgNode =>
    el(
      "div",
      {
        display: "flex",
        marginTop,
        fontSize: px(TOKENS.label),
        fontWeight: 400,
        lineHeight: BODY_LINE_HEIGHT,
        color: ogColors.mutedForeground,
      },
      host
    );

  const bottomRow: OgNode[] = [];
  if (isDefault) {
    bottomRow.push(hostLine(0));
  } else {
    bottomRow.push(
      el("div", { display: "flex", flexDirection: "column" }, [
        el(
          "div",
          {
            display: "flex",
            fontSize: px(TOKENS.label),
            fontWeight: 600,
            lineHeight: BODY_LINE_HEIGHT,
            color: ogColors.foreground,
          },
          author
        ),
        hostLine(px(TOKENS.xs)),
      ])
    );
    if (date) {
      bottomRow.push(
        el(
          "div",
          {
            display: "flex",
            fontSize: px(TOKENS.label),
            fontWeight: 400,
            lineHeight: BODY_LINE_HEIGHT,
            color: ogColors.mutedForeground,
          },
          date
        )
      );
    }
  }

  return el(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: WIDTH,
      height: HEIGHT,
      boxSizing: "border-box",
      padding: px(TOKENS.xl),
      backgroundColor: ogColors.background,
      fontFamily: FONT_FAMILY,
      color: ogColors.foreground,
    },
    [
      el("div", { display: "flex", flexDirection: "column" }, top),
      el("div", { display: "flex", flexDirection: "column" }, [
        el("div", {
          display: "flex",
          width: "100%",
          height: px(TOKENS.border),
          backgroundColor: ogColors.border,
        }),
        el(
          "div",
          {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: px(TOKENS.md),
          },
          bottomRow
        ),
      ]),
    ]
  );
}

/** Renders one 1200x630 Open Graph PNG from the shared template. */
export async function renderOgImage(input: OgInput): Promise<Response> {
  const { fonts, covers } = await loadOgFonts();
  const tree = buildTree(input, (text, field) =>
    fitToFonts(text, covers, field)
  );
  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: WIDTH,
    height: HEIGHT,
    embedFont: true,
    fonts,
  });
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
}
