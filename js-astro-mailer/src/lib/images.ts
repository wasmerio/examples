import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";

/**
 * The rendition the lightbox opens. Capped at the source width, because Astro
 * will not enlarge an image and a srcset promising more than exists is a lie
 * the browser acts on.
 */
export const lightboxRendition = (image: ImageMetadata) => {
  const cap = Math.min(image.width, 2400);
  const widths = [...[1200, 1600].filter((width) => width < cap), cap];
  return getImage({ src: image, width: cap, widths, sizes: "100vw", format: "webp" });
};
