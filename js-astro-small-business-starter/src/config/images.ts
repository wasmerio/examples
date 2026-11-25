/**
 * ─────────────────────────────────────────────────────────────────────────────
 * IMAGE CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 * This is the single file to edit when swapping placeholder images for a
 * client's real photos. Astro will automatically optimize every local image
 * at build time (WebP/AVIF conversion, srcset generation, CLS-safe dimensions).
 *
 * HOW TO ADD YOUR OWN IMAGES
 * ──────────────────────────
 * 1. Drop your image file into the correct folder under src/assets/images/
 * 2. Uncomment the matching import below and update the filename
 * 3. Export it — the component picks it up automatically
 *
 * Supported formats: .jpg  .jpeg  .png  .webp  .avif
 *
 * FOLDER STRUCTURE
 * ────────────────
 *   src/assets/images/
 *     hero/      ← one image used in the homepage Hero section
 *     about/     ← one image used in the About section and About page
 *     gallery/   ← all project photos (drop any number of files here)
 *
 * Until you add local files the components fall back to placeholder URLs
 * served from Unsplash. Those are fine for development/demo but are NOT
 * optimized by Astro. Swap them for local files before going live.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { ImageMetadata } from 'astro';

// ── Hero ──────────────────────────────────────────────────────────────────────
// Recommended: landscape image, at least 1600 × 1200 px
//
// To use your own:
//   1. Drop your file into src/assets/images/hero/
//   2. Uncomment and update the line below
//   3. Replace the heroImage export at the bottom of this section
//
// import heroImage from '../assets/images/hero/hero.jpg';
export const heroImage: ImageMetadata | undefined = undefined;

// ── About ─────────────────────────────────────────────────────────────────────
// Recommended: portrait or square image of your team/job site, at least 900 × 700 px
//
// To use your own:
//   1. Drop your file into src/assets/images/about/
//   2. Uncomment and update the line below
//   3. Replace the aboutImage export at the bottom of this section
//
// import aboutImage from '../assets/images/about/team.jpg';
export const aboutImage: ImageMetadata | undefined = undefined;

// ── Gallery — auto-discovered ─────────────────────────────────────────────────
// Drop any number of image files into src/assets/images/gallery/ and they will
// appear in the gallery automatically — no code changes needed.
//
// The file name becomes the alt text:
//   kitchen-remodel.jpg    → "Kitchen Remodel"
//   deck-installation.jpg  → "Deck Installation"
//
// Recommended: landscape images, at least 800 × 600 px each.
// Aim for consistent proportions (4:3 works best with the gallery grid).

export interface GalleryImage {
  src: ImageMetadata | string;
  alt: string;
}

const discovered = Object.entries(
  import.meta.glob<{ default: ImageMetadata }>(
    '../assets/images/gallery/*.{jpg,jpeg,png,webp,avif}',
    { eager: true },
  ),
).map(([path, mod]): GalleryImage => ({
  src: mod.default,
  alt: path
    .split('/').pop()!
    .replace(/\.[^.]+$/, '')        // strip extension
    .replace(/[-_]/g, ' ')          // hyphens/underscores → spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()), // Title Case
}));

// Unsplash placeholders used when the gallery folder is empty.
// Replace by adding your own images — the placeholders are removed automatically.
const placeholders: GalleryImage[] = [
  { src: 'https://images.unsplash.com/photo-1772567732969-c1506edf80a0?w=600&q=80', alt: 'Completed kitchen renovation' },
  { src: 'https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?w=600&q=80', alt: 'Bathroom remodel with modern fixtures' },
  { src: 'https://images.unsplash.com/photo-1761166518480-49279513d65f?w=600&q=80', alt: 'Fresh landscaping and walkway installation' },
  { src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80', alt: 'Interior painting and trim work' },
  { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', alt: 'Electrical panel upgrade' },
  { src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80', alt: 'Deck construction and staining' },
];

export const galleryImages: GalleryImage[] = discovered.length > 0 ? discovered : placeholders;
