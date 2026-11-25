import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";

/* Capped at the source width: Astro will not enlarge an image, and a srcset that promises more
   than exists makes the browser fetch the wrong file. */
export const lightboxRendition = (image: ImageMetadata) => {
  const cap = Math.min(image.width, 2400);
  const widths = [...[1200, 1600].filter((width) => width < cap), cap];
  return getImage({ src: image, width: cap, widths, sizes: "100vw", format: "webp" });
};
