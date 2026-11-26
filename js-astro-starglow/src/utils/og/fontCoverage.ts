import { inflateSync } from "node:zlib";

/** The bytes of one table of a WOFF or plain TrueType/OpenType file. */
function table(font: Buffer, tag: string): Buffer | undefined {
  const woff = font.toString("latin1", 0, 4) === "wOFF";
  const count = font.readUInt16BE(woff ? 12 : 4);
  const first = woff ? 44 : 12;
  const size = woff ? 20 : 16;
  for (let index = 0; index < count; index += 1) {
    const at = first + index * size;
    if (font.toString("latin1", at, at + 4) !== tag) continue;
    const offset = font.readUInt32BE(at + 4);
    if (!woff)
      return font.subarray(offset, offset + font.readUInt32BE(at + 12));
    const stored = font.readUInt32BE(at + 8);
    const original = font.readUInt32BE(at + 12);
    const data = font.subarray(offset, offset + stored);
    return stored < original ? inflateSync(data) : data;
  }
  return undefined;
}

/** Picks the Unicode subtable of a `cmap` table, preferring full-range ones. */
function unicodeSubtable(cmap: Buffer): number {
  const records = cmap.readUInt16BE(2);
  const wanted = [
    [3, 10],
    [0, 4],
    [0, 6],
    [3, 1],
    [0, 3],
  ];
  for (const [platform, encoding] of wanted) {
    for (let index = 0; index < records; index += 1) {
      const at = 4 + index * 8;
      if (
        cmap.readUInt16BE(at) === platform &&
        cmap.readUInt16BE(at + 2) === encoding
      )
        return cmap.readUInt32BE(at + 4);
    }
  }
  throw new Error("font has no Unicode cmap subtable");
}

/**
 * Reads the `cmap` table of a font file and returns a lookup that says whether
 * the font draws a code point. satori draws a missing glyph as an empty box
 * without any error, so the OG renderer asks this first.
 */
export function codePointCoverage(
  font: Buffer
): (codePoint: number) => boolean {
  const cmap = table(font, "cmap");
  if (!cmap) throw new Error("font has no cmap table");
  const start = unicodeSubtable(cmap);
  const format = cmap.readUInt16BE(start);

  if (format === 4) {
    const segments = cmap.readUInt16BE(start + 6) / 2;
    const ends = start + 14;
    const starts = ends + segments * 2 + 2;
    const deltas = starts + segments * 2;
    const offsets = deltas + segments * 2;
    return codePoint => {
      if (codePoint > 0xffff) return false;
      for (let index = 0; index < segments; index += 1) {
        if (codePoint > cmap.readUInt16BE(ends + index * 2)) continue;
        const first = cmap.readUInt16BE(starts + index * 2);
        if (codePoint < first) return false;
        const delta = cmap.readUInt16BE(deltas + index * 2);
        const offset = cmap.readUInt16BE(offsets + index * 2);
        if (offset === 0) return ((codePoint + delta) & 0xffff) !== 0;
        const glyph = cmap.readUInt16BE(
          offsets + index * 2 + offset + (codePoint - first) * 2
        );
        return glyph !== 0;
      }
      return false;
    };
  }

  if (format === 12) {
    const groups = cmap.readUInt32BE(start + 12);
    return codePoint => {
      for (let index = 0; index < groups; index += 1) {
        const at = start + 16 + index * 12;
        if (
          codePoint >= cmap.readUInt32BE(at) &&
          codePoint <= cmap.readUInt32BE(at + 4)
        )
          return (
            cmap.readUInt32BE(at + 8) + codePoint - cmap.readUInt32BE(at) > 0
          );
      }
      return false;
    };
  }

  throw new Error(`font cmap format ${format} is not supported`);
}
