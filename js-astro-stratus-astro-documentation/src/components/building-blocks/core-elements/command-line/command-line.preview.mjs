import {
  preview,
  band,
  bar,
  box,
  body,
  line,
  panel,
  subject,
} from "../../../../../scripts/previews/kit.mjs";

const B = band(560);

// One pill-shaped row is the tell against a full code block.
export default preview({
  width: B.w,
  draw: [
    box(B.left, 0, B.w, 92, { r: 12, fill: panel, stroke: line, sw: 2 }),
    bar(B.left + 28, 38, 16, "label", { fill: body }),
    bar(B.left + 60, 38, 330, "label", { fill: subject }),
    box(B.left + 424, 32, 100, 28, { r: 8, fill: line }),
  ],
});
