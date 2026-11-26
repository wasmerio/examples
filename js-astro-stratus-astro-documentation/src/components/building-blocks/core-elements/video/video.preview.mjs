import { preview, band, media, playDisc } from "../../../../../scripts/previews/kit.mjs";

const B = band(960);

// No photo glyph: the play mark alone carries "video" against Image.
export default preview({
  width: B.w,
  draw: [media(B.left, 130, 960, 540), playDisc(640, 400, 72)],
});
