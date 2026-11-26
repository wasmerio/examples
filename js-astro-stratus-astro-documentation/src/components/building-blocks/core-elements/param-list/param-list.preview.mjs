import {
  preview,
  band,
  accent,
  bar,
  box,
  body,
  line,
  paper,
  panel,
} from "../../../../../scripts/previews/kit.mjs";

const B = band(760);

const row = (y, nameW, typeW, textW, last) => [
  bar(B.left + 32, y, nameW, "label", { fill: accent }),
  box(B.left + 32 + nameW + 16, y + 1, typeW, 14, { r: 7, fill: panel }),
  bar(B.left + 32, y + 34, textW, "body", { fill: body }),
  !last && box(B.left, y + 66, B.w, 2, { r: 1, fill: line }),
];

export default preview({
  width: B.w,
  draw: [
    box(B.left, 0, B.w, 262, { r: 12, fill: paper, stroke: line, sw: 2 }),
    row(30, 130, 66, 520, false),
    row(118, 104, 54, 430, false),
    row(206, 148, 82, 480, true),
  ],
});
