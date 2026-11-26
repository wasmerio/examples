import {
  preview,
  band,
  bar,
  box,
  lines,
  plate,
  rule,
  accent,
  glyph,
  panel,
  subject,
} from "../../../../../scripts/previews/kit.mjs";

const B = band(960);

// Horizontal tabs are the tell against `content-selector`, whose tabs run down the side.
export default preview({
  width: B.w,
  draw: [
    bar(B.left, 0, 520, "display"),

    plate(B.left, 96, B.w, 244),
    box(B.left + 2, 98, B.w - 4, 64, { r: 8, fill: panel }),
    rule(B.left, 160, B.w),

    bar(196, 122, 96, "label", { fill: subject }),
    box(184, 156, 120, 4, { r: 2, fill: accent }),
    bar(348, 122, 112, "label", { fill: glyph }),
    bar(516, 122, 84, "label", { fill: glyph }),

    lines(196, 192, [688, 624, 700, 512]),
  ],
});
