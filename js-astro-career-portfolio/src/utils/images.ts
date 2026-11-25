import type { ImageMetadata } from "astro";

const allImages = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/*.{jpeg,jpg,png,gif,webp,svg}",
);

/**
 * Dynamically resolves a local asset image object from a string filename or path.
 * @param photoUrl - The filename (e.g., 'avatar.jpg') or full path from JSON data
 * @returns The resolved ImageMetadata object, or null if not found
 */

export async function resolveAssetImage(
  photoUrl: string | undefined,
): Promise<ImageMetadata | null> {
  if (!photoUrl || photoUrl.trim() === "") {
    return null;
  }

  // Normalize path format
  const imagePath = photoUrl.startsWith("/src/assets/") ? photoUrl : `/src/assets/${photoUrl}`;

  const imageResolver = allImages[imagePath];

  if (!imageResolver) {
    console.warn(`[Image Utility] Asset not found for path: ${imagePath}`);
    return null;
  }

  try {
    const imageModule = await imageResolver();
    return imageModule.default;
  } catch (error) {
    console.error(`[Image Utility] Failed to load image at ${imagePath}`, error);
    return null;
  }
}
