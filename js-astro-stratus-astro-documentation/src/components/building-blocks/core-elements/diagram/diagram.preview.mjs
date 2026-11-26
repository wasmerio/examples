import {
  preview,
  band,
  accent,
  bar,
  box,
  glyph,
  line,
  panel,
  paper,
  poly,
  subject,
} from "../../../../../scripts/previews/kit.mjs";

const B = band(760);

// The branching arrows are the tell against three cards.
const node = (x, y, w) => [
  box(x, y, w, 64, { r: 10, fill: paper, stroke: glyph, sw: 2 }),
  bar(x + 24, y + 26, w - 48, "label", { fill: subject }),
];

const arrow = (x, y, len) => [
  box(x, y - 1, len, 3, { r: 1, fill: accent }),
  poly(
    [
      [x + len, y - 9],
      [x + len + 16, y + 1],
      [x + len, y + 11],
    ],
    { fill: accent, round: 2 }
  ),
];

export default preview({
  width: B.w,
  draw: [
    box(B.left, 0, B.w, 250, { r: 12, fill: panel, stroke: line, sw: 2 }),
    node(B.left + 40, 93, 168),
    arrow(B.left + 208, 125, 44),
    node(B.left + 268, 93, 152),
    arrow(B.left + 420, 90, 48),
    node(B.left + 484, 40, 200),
    arrow(B.left + 420, 160, 48),
    node(B.left + 484, 146, 200),
  ],
});
