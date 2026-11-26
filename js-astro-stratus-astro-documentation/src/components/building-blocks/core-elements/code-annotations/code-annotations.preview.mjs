import {
  preview,
  band,
  accent,
  bar,
  box,
  dot,
  ink,
  line,
  onInk,
  paper,
} from "../../../../../scripts/previews/kit.mjs";

const B = band(760);

// The paired accent numbers are the component's whole idea.
export default preview({
  width: B.w,
  draw: [
    box(B.left, 0, B.w, 292, { r: 12, fill: ink, stroke: line, sw: 2 }),
    bar(B.left + 28, 28, 300, "body", { fill: onInk }),
    bar(B.left + 28, 64, 420, "body", { fill: onInk }),
    dot(B.right - 44, 70, 15, { fill: accent }),
    bar(B.left + 28, 100, 240, "body", { fill: onInk }),
    bar(B.left + 28, 136, 380, "body", { fill: onInk }),
    dot(B.right - 44, 142, 15, { fill: accent }),
    box(B.left, 178, B.w, 2, { r: 1, fill: line }),
    dot(B.left + 42, 214, 15, { fill: accent }),
    bar(B.left + 72, 208, 520, "body", { fill: onInk }),
    dot(B.left + 42, 258, 15, { fill: accent }),
    bar(B.left + 72, 252, 430, "body", { fill: onInk }),
    box(B.left, 0, 0, 0, { fill: paper }),
  ],
});
