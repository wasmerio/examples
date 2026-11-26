import {
  preview,
  band,
  accent,
  bar,
  box,
  body,
  line,
  panel,
  subject,
} from "../../../../../scripts/previews/kit.mjs";

const B = band(760);

// Two releases, not one: the repeat is the tell against a single tagged list.
const change = (y, tagW, textW, tagFill) => [
  box(B.left, y, tagW, 20, { r: 6, fill: tagFill }),
  bar(B.left + tagW + 20, y + 4, textW, "body", { fill: body }),
];

const release = (y, rows) => [
  bar(B.left, y, 150, "heading", { fill: subject }),
  bar(B.left + 174, y + 6, 110, "label", { fill: body }),
  box(B.left, y + 50, B.w, 2, { r: 1, fill: line }),
  ...rows.map((row, index) => change(y + 82 + index * 44, ...row)),
];

export default preview({
  width: B.w,
  draw: [
    release(0, [
      [96, 480, accent],
      [96, 380, panel],
      [96, 540, panel],
    ]),
    release(250, [
      [96, 300, panel],
      [96, 440, panel],
    ]),
  ],
});
