import {
  preview,
  band,
  bar,
  box,
  body,
  line,
  media,
  photoGlyph,
  subject,
} from "../../../../../scripts/previews/kit.mjs";

const B = band(760);

// The caption and zoom affordance are the tell against Image.
export default preview({
  width: B.w,
  draw: [
    box(B.left, 0, B.w, 300, { r: 12, fill: media().fill, stroke: line, sw: 2 }),
    photoGlyph(B.left, 0, B.w, 300),
    bar(B.left, 328, 400, "body", { fill: body }),
    bar(B.right - 120, 328, 120, "body", { fill: subject }),
  ],
});
