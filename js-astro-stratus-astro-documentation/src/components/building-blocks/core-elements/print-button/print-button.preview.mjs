import { preview, box, bar, ink, onInk, poly } from "../../../../../scripts/previews/kit.mjs";

// The printer glyph is the tell against Button. Exempt for the same reason Button is.
export default preview({
  width: 300,
  exempt: true,
  draw: [
    box(490, 362, 300, 76, { fill: ink }),
    box(536, 384, 20, 10, { r: 2, fill: onInk }),
    box(528, 394, 36, 24, { r: 4, fill: onInk }),
    poly(
      [
        [536, 418],
        [556, 418],
        [556, 430],
        [536, 430],
      ],
      { fill: onInk, round: 2 }
    ),
    bar(582, 394, 150, "body", { fill: onInk }),
  ],
});
