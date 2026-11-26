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
  paper,
  subject,
} from "../../../../../scripts/previews/kit.mjs";

const B = band(760);

// The tab row must be the loudest thing, or this reads as a plain code block.
const tab = (x, w, active) => [
  box(x, 16, w, 46, { r: 9, fill: active ? paper : panel, stroke: line, sw: 2 }),
  bar(x + 20, 31, w - 40, "label", { fill: active ? accent : subject }),
];

export default preview({
  width: B.w,
  draw: [
    box(B.left, 0, B.w, 236, { r: 12, fill: ink, stroke: line, sw: 2 }),
    box(B.left, 0, B.w, 78, { r: 12, fill: panel }),
    tab(B.left + 20, 140, true),
    tab(B.left + 172, 132, false),
    tab(B.left + 316, 148, false),
    box(B.left, 76, B.w, 2, { r: 1, fill: line }),
    bar(B.left + 28, 108, 420, "body", { fill: onInk }),
    bar(B.left + 28, 148, 290, "body", { fill: onInk }),
    bar(B.left + 28, 188, 170, "body", { fill: onInk }),
  ],
});
