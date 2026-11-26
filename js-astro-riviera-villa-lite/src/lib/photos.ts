import type { ImageMetadata } from 'astro';

const modules = import.meta.glob<{ default: ImageMetadata }>('/src/assets/photos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  caseSensitive: false,
});

/** Photos by lower-case file name: 'Pool.JPG' on disk answers to 'pool.jpg' in the config. */
const byName = new Map(
  Object.entries(modules).map(([path, mod]) => [(path.split('/').pop() ?? path).toLowerCase(), mod.default]),
);

/** The photo `name` from src/assets/photos/, ready for Astro's <Image> component. */
export function photo(name: string): ImageMetadata {
  const image = byName.get(name.toLowerCase());
  if (!image) {
    throw new Error(`Photo "${name}" not found in src/assets/photos/. Available: ${[...byName.keys()].join(', ')}`);
  }
  return image;
}

export interface PhotoCredit {
  file: string;
  title?: string;
  author: string;
  license: string;
  licenseUrl?: string;
  sourceUrl: string;
}

const creditFiles = import.meta.glob<{ default: PhotoCredit[] }>('/src/assets/photos/credits.json', { eager: true });

/** Credits of the photos in use (written by `npm run photos:demo`), empty for placeholders. */
export const photoCredits: PhotoCredit[] = Object.values(creditFiles)[0]?.default ?? [];
