import {
  preview,
  band,
  accent,
  bar,
  box,
  ink,
  line,
  onInk,
  panel,
  subject,
} from "../../../../../scripts/previews/kit.mjs";

const B = band(760);

// The accent-marked highlighted line is the tell against a plain panel.
export default preview({
  width: B.w,
  draw: [
    box(B.left, 0, B.w, 232, { r: 12, fill: ink, stroke: line, sw: 2 }),
    box(B.left, 0, B.w, 56, { r: 12, fill: panel }),
    bar(B.left + 28, 20, 200, "label", { fill: subject }),
    bar(B.right - 108, 20, 80, "label", { fill: subject }),
    box(B.left, 54, B.w, 2, { r: 1, fill: line }),
    bar(B.left + 28, 84, 300, "body", { fill: onInk }),
    box(B.left, 116, 6, 28, { r: 0, fill: accent }),
    bar(B.left + 28, 122, 430, "body", { fill: onInk }),
    bar(B.left + 28, 160, 250, "body", { fill: onInk }),
    bar(B.left + 28, 192, 120, "body", { fill: onInk }),
  ],
});
