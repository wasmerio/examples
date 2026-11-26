/**
 * Generates Open Graph images.
 */

import { fontData } from "astro:assets";
import { outDir } from "astro:config/server";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import satori, { type Font as SatoriFont } from "satori";
import sharp from "sharp";
import { SITE } from "@/config";

export const OG_COLORS = {
  bg: "#f9f9f8",
  text: "#21201c",
  muted: "#63635e",
  faint: "#cfceca",
};

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
export const OG_FONT_FAMILY = "OpenGraphFont";

function hashOgContent(...parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 8);
}

export function getPostOgHash(title: string, date: Date, tags: string[]): string {
  return hashOgContent("post", SITE.title, title, date.toISOString(), ...tags);
}

export const SITE_OG_HASH = hashOgContent("site", SITE.title, SITE.description);

let cachedFonts: SatoriFont[] | null = null;

// Loads the font via the Astro Fonts API font configured as `--font-og` in astro.config.ts
async function getFontsFromAstroFonts(origin: string): Promise<SatoriFont[]> {
  const faces = fontData["--font-og"];

  return Promise.all(
    faces.map(async (face) => {
      const src = face.src[0];
      if (!src) throw new Error("No src in font face");

      const data = import.meta.env.DEV
        ? await fetch(new URL(src.url, origin)).then((r) => r.arrayBuffer())
        : await readFile(new URL(`.${src.url}`, outDir)).then(
            (b) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer,
          );
      return { name: OG_FONT_FAMILY, data, weight: 400 as const, style: "normal" as const };
    }),
  );
}

// Loads a font bundled in the project, bypassing the Astro Fonts API entirely
async function getFontsFromLocalFile(): Promise<SatoriFont[]> {
  const data = await readFile(join(process.cwd(), SITE.ogFontPath)).then(
    (b) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer,
  );
  return [{ name: OG_FONT_FAMILY, data, weight: 400 as const, style: "normal" as const }];
}

async function getFonts(origin: string): Promise<SatoriFont[]> {
  if (cachedFonts) return cachedFonts;

  cachedFonts = SITE.ogFontPath
    ? await getFontsFromLocalFile()
    : await getFontsFromAstroFonts(origin);

  return cachedFonts;
}

/* biome-ignore lint/suspicious/noExplicitAny: not sure which type to use */
export async function renderOgImage(element: any, url: URL): Promise<Response> {
  const fonts = await getFonts(url.origin);

  const svg = await satori(element, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts,
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(png as BodyInit, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
