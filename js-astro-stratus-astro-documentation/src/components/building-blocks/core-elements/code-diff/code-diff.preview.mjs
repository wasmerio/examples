import {
  preview,
  band,
  accent,
  bar,
  box,
  glyph,
  ink,
  line,
  onInk,
  panel,
  subject,
} from "../../../../../scripts/previews/kit.mjs";

const B = band(760);
const gutter = B.left + 22;

// The +/- gutter and tinted rows are the tell against Code Block.
export default preview({
  width: B.w,
  draw: [
    box(B.left, 0, B.w, 232, { r: 12, fill: ink, stroke: line, sw: 2 }),
    box(B.left, 0, B.w, 56, { r: 12, fill: panel }),
    bar(B.left + 28, 20, 200, "label", { fill: subject }),
    bar(B.right - 108, 20, 80, "label", { fill: subject }),
    box(B.left, 54, B.w, 2, { r: 1, fill: line }),
    bar(B.left + 56, 84, 300, "body", { fill: onInk }),
    box(B.left, 116, B.w, 28, { r: 0, fill: glyph, opacity: 0.35 }),
    box(gutter, 124, 16, 4, { r: 2, fill: subject }),
    bar(B.left + 56, 120, 380, "body", { fill: onInk }),
    box(B.left, 152, B.w, 28, { r: 0, fill: accent, opacity: 0.28 }),
    box(gutter, 160, 16, 4, { r: 2, fill: accent }),
    box(gutter + 6, 154, 4, 16, { r: 2, fill: accent }),
    bar(B.left + 56, 156, 420, "body", { fill: onInk }),
    bar(B.left + 56, 192, 200, "body", { fill: onInk }),
  ],
});
