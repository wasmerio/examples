import { preview, band, bar, subject } from "../../../../../scripts/previews/kit.mjs";

const B = band(960);

// Running text, not stacked pairs, is the tell against `stats`.
const ENTRIES = [
  [
    [78, 150],
    [66, 138],
    [74, 216],
  ],
  [
    [96, 128],
    [84, 160],
    [70, 190],
  ],
  [
    [88, 140],
    [72, 120],
    [62, 172],
  ],
];

export default preview({
  width: B.w,
  draw: [
    bar(B.left, 0, 430, "display"),

    ENTRIES.map((row, r) =>
      row.map(([nameWidth, detailWidth], c) => {
        const x = B.left + c * 330;
        const y = 84 + r * 56;

        return [
          bar(x, y, nameWidth, "body", { fill: subject }),
          bar(x + nameWidth + 10, y, detailWidth, "body"),
        ];
      })
    ),
  ],
});
