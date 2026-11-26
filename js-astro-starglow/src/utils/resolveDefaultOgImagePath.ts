import type { ResolvedStarglowConfig } from "@/types/config";
import { getAssetPath } from "./withBase";

const publicFiles = import.meta.glob("/public/*", {
  eager: false,
  query: "?url",
});

function existsInPublic(filename: string): boolean {
  return `/public/${filename}` in publicFiles;
}

/**
 * Default OG image path: `public/{site.ogImage}` when present, else the
 * generated `/og.png` (which requires `dynamicOgImage`). `site.ogImage` must be
 * a single filename, to rule out path traversal.
 */
export function resolveDefaultOgImagePath(
  config: ResolvedStarglowConfig
): string {
  const filename = config.site.ogImage;
  if (
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\")
  ) {
    throw new Error(
      `site.ogImage must be a single filename in public/ (e.g. "default-og.jpg"), got "${filename}"`
    );
  }

  if (config.features.dynamicOgImage) {
    return existsInPublic(filename)
      ? getAssetPath(filename)
      : getAssetPath("og.png");
  }

  if (!existsInPublic(filename)) {
    throw new Error(
      `starglow: missing public/${filename}. Add that file, or set site.ogImage to an existing file under public/, or enable features.dynamicOgImage to fall back to /og.png.`
    );
  }

  return getAssetPath(filename);
}
