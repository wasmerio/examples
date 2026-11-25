/**
 * Image Utilities
 *
 * Gallery image resolution and cover image resolution for
 * folder-based post structure.
 *
 * Reads from:
 *   src/content/posts/{postDir}/gallery/      — dedicated gallery images
 *   src/content/posts/{postDir}/attachments/  — inline and cover images
 */

import type { ImageMetadata } from 'astro';

// ============================================================================
// TYPES
// ============================================================================

export interface GalleryImage {
  src: ImageMetadata;
  alt: string;
  filename: string;
}

// ============================================================================
// GLOBS — static, module-level, Vite requires static patterns
// ============================================================================

const allGalleryImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/**/gallery/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}',
  { eager: true }
);

const allAttachmentImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/**/attachments/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}',
  { eager: true }
);

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Derive post directory name from entry.filePath
 * e.g. src/content/posts/2026-03-rajgad/index.md → 2026-03-rajgad
 */
export function extractPostDir(filePath: string): string {
  const parts = filePath.split('/');
  return parts[parts.length - 2] || '';
}

/**
 * Derive alt text from image filename
 * e.g. 01-rajgad-summit-view.jpg → Rajgad Summit View
 */
export function filenameToAlt(filename: string): string {
  return (
    filename
      .replace(/\.[^.]+$/, '')                  // remove extension
      .replace(/^\d+[-_]?/, '')                 // remove leading number
      .replace(/[-_]/g, ' ')                    // separators → spaces
      .replace(/\b\w/g, (c) => c.toUpperCase()) // capitalise words
      .trim()
  );
}

/**
 * Shuffle array — Fisher-Yates
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Resolve a vault-absolute image path to a glob key.
 *
 * Handles:
 *   posts/2011-03-21-bhuleshwar/attachments/image.jpg
 *   → /src/content/posts/2011-03-21-bhuleshwar/attachments/image.jpg
 */
function vaultPathToGlobKey(vaultPath: string): string {
  // Already a glob key
  if (vaultPath.startsWith('/src/content/')) return vaultPath;
  // Vault-absolute: posts/...
  if (vaultPath.startsWith('travels/')) return `/src/content/${vaultPath}`;
  // Fallback
  return `/src/content/${vaultPath}`;
}

// ============================================================================
// COVER IMAGE
// ============================================================================

/**
 * Resolve a post's cover frontmatter value to ImageMetadata.
 *
 * Accepts vault-absolute Obsidian paths with or without [[ ]] brackets:
 *   [[travels/2011-03-21-bhuleshwar/attachments/image.jpg]]
 *   travels/2011-03-21-bhuleshwar/attachments/image.jpg
 *
 * Returns undefined if the path cannot be resolved (allows graceful fallback).
 */
// export function getCoverImage(raw: string | undefined): ImageMetadata | undefined {
//   if (!raw) return undefined;

//   const stripped = stripObsidianBrackets(raw).trim();
//   if (!stripped) return undefined;

//   const globKey = vaultPathToGlobKey(stripped);

//   const mod = allAttachmentImages[globKey];
//   return mod?.default;
// }

export function normalizeCoverPath(
  raw: string | undefined
): string | undefined {

  if (!raw) return undefined;

  const value = raw.trim();

  // Obsidian wiki-link
  // [[image.jpg]]

  const obsidian = value.match(/^\[\[(.+?)\]\]$/);

  if (obsidian) {
    return obsidian[1].trim();
  }

  // Markdown link
  // [Label](path/image.jpg)

  const markdown = value.match(/^\[.*?\]\((.+?)\)$/);

  if (markdown) {
    return markdown[1].trim();
  }

  // Raw path fallback

  return value;
}

export function getCoverImage(
  raw: string | undefined
): ImageMetadata | undefined {

  const normalized = normalizeCoverPath(raw);

  if (!normalized) return undefined;
  const globKey = vaultPathToGlobKey(normalized);
  const mod = allAttachmentImages[globKey];
  return mod?.default;
}

// ============================================================================
// GALLERY
// ============================================================================

/**
 * Get gallery images for a post, sorted by filename.
 * Reads from src/content/travels/{postDir}/gallery/
 */
export function getGalleryImages(filePath: string): GalleryImage[] {
  const postDir = extractPostDir(filePath);
  if (!postDir) return [];

  return Object.entries(allGalleryImages)
    .filter(([path]) => path.includes(`/posts/${postDir}/gallery/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, mod]) => {
      const filename = path.split('/').pop() ?? '';
      return {
        src: mod.default,
        alt: filenameToAlt(filename),
        filename,
      };
    });
}

/**
 * Check if a post has a gallery — use for conditional rendering decisions.
 */
export function hasGallery(filePath: string): boolean {
  return getGalleryImages(filePath).length > 0;
}