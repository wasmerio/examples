import {
  preview,
  band,
  bar,
  box,
  ink,
  line,
  onInk,
  panel,
  subject,
} from "../../../../../scripts/previews/kit.mjs";

const B = band(560);
const stem = B.left + 36;
const stem2 = stem + 44;

// The drawn connectors are the component; without them it is a list.
export default preview({
  width: B.w,
  draw: [
    box(B.left, 0, B.w, 216, { r: 12, fill: ink, stroke: line, sw: 2 }),
    box(B.left, 0, B.w, 56, { r: 12, fill: panel }),
    bar(B.left + 28, 20, 200, "label", { fill: subject }),
    box(B.left, 54, B.w, 2, { r: 1, fill: line }),
    box(stem - 1, 92, 2, 90, { r: 1, fill: line }),
    box(stem2 - 1, 124, 2, 26, { r: 1, fill: line }),
    box(stem, 118, 16, 2, { r: 1, fill: line }),
    box(stem2, 150, 16, 2, { r: 1, fill: line }),
    box(stem, 182, 16, 2, { r: 1, fill: line }),
    bar(B.left + 28, 80, 120, "body", { fill: subject }),
    bar(B.left + 60, 112, 200, "body", { fill: onInk }),
    bar(B.left + 104, 144, 170, "body", { fill: onInk }),
    bar(B.left + 60, 176, 140, "body", { fill: onInk }),
  ],
});
