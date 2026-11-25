/**
 * Shared types for project gallery slides.
 *
 * A slide is either an image or a self-hosted video. Video slides require a
 * poster image so the carousel can render a real frame without downloading a
 * single video byte (`preload="none"` everywhere) — this is what keeps video
 * slides Lighthouse-neutral.
 */
import type { ImageMetadata } from 'astro';

export interface GalleryImageSlide {
  src: ImageMetadata;
  alt: string;
}

export interface GalleryVideoSlide {
  /** Root-relative path to a video file in `public/`, e.g. `/videos/demo.mp4`. */
  video: string;
  /** Poster frame shown before playback — required, it doubles as the slide's visual. */
  poster: ImageMetadata;
  alt: string;
}

export type GallerySlide = GalleryImageSlide | GalleryVideoSlide;

export function isVideoSlide(slide: GallerySlide): slide is GalleryVideoSlide {
  return 'video' in slide;
}
