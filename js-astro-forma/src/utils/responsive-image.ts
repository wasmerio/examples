export const RESPONSIVE_IMAGE_WIDTHS = [320, 480, 640, 800, 1080] as const;

/**
 * Buduje srcset dla zdjęć Formy bez zastępowania oryginalnego pliku.
 * Oryginał zostaje w zestawie, aby duże ekrany nie dostały mniejszej wersji.
 */
export function getResponsiveImageSrcSet(src: string, originalWidth: number): string | undefined {
  if (!src.startsWith('/assets/images/') || !src.endsWith('.webp')) return undefined;

  const sourceName = src.slice('/assets/images/'.length, -'.webp'.length);
  const widths = [...RESPONSIVE_IMAGE_WIDTHS.filter((width) => width < originalWidth), originalWidth];

  return widths
    .map((width) => {
      const imageSrc = width === originalWidth
        ? src
        : `/assets/images-responsive/${sourceName}-${width}.webp`;
      return `${imageSrc} ${width}w`;
    })
    .join(', ');
}
