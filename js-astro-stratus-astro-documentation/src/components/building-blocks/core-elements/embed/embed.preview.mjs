import { preview, band, media, cropCorners } from "../../../../../scripts/previews/kit.mjs";

const B = band(960);

// Crop marks, not a photo glyph, are the tell against Image.
export default preview({
  width: B.w,
  draw: [media(B.left, 140, 960, 520), cropCorners(B.left, 140, 960, 520)],
});
