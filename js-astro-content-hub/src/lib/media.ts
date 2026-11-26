// Media model - the shared "visual media" spec reused across landing cards.
//
// Cards in the landing section system each decide whether they need media
// (an avatar, an icon block, a thumbnail) and where to put it, but they all
// share this one shape, so adding a media-bearing card never means inventing
// a new media format.
//
//   - `src`      image URL; when present renders an <img>.
//   - `github`   GitHub username - shorthand for the GitHub avatar URL
//                (https://github.com/<user>.png). Takes precedence over
//                `src` so authors can write a username instead of a URL.
//   - `fallback` initials / emoji shown when no src - a zero-asset gradient
//                chip, which is the standard treatment for template landings
//                that ship no image assets.
//   - `gradient` optional CSS gradient for the fallback chip background;
//                defaults to the brand gold gradient.
//   - `shape`    round (circle - avatars) | card (rounded square - icons/thumbs).
//   - `size`     px; default 48.
//
// A plain string is accepted anywhere a MediaSpec is, as a `src` shorthand.
export interface MediaSpec {
  src?: string;
  github?: string;
  fallback?: string;
  gradient?: string;
  shape?: 'round' | 'card';
  size?: number;
}

/** GitHub avatar URL for a username. `?size=` is requested at 2x so the
 *  rendered image stays sharp on Retina displays (GitHub caps at 460). */
export function githubAvatarUrl(username: string, size: number): string {
  return `https://github.com/${encodeURIComponent(username)}.png?size=${Math.min(460, size * 2)}`;
}

/** Normalize a media value: string shorthand -> { src }, object -> itself. */
export function toMediaSpec(media: string | MediaSpec | undefined | null): MediaSpec | undefined {
  if (!media) return undefined;
  if (typeof media === 'string') return { src: media };
  return media;
}

// ---------------------------------------------------------------------------
// Icon spec - the SVG side of the media model. Kept alongside MediaSpec so
// features/docs cards can offer either a vector icon (SVG paths, stroke
// style) or an image/thumbnail (MediaSpec) as their visual anchor.
// ---------------------------------------------------------------------------

export interface IconSpec {
  /** One or more SVG path `d` strings, 24x24 viewBox. */
  paths: string[];
  /** Stroke width for outline icons (default 1.5). Ignored for filled. */
  strokeWidth?: number;
  /** outline (stroke, default) or filled (solid currentColor). */
  variant?: 'outline' | 'filled';
}

/** Normalize a feature `icon` value: string shorthand (single path) or
 *  object ({ paths, ... }) -> IconSpec. */
export function toIconSpec(icon: string | IconSpec | undefined | null): IconSpec | undefined {
  if (!icon) return undefined;
  if (typeof icon === 'string') return { paths: [icon] };
  return icon;
}

/** Render an IconSpec as inline SVG attribute fragments (Astro-friendly). */
export function iconSvgProps(icon: IconSpec): {
  viewBox: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
} {
  const filled = icon.variant === 'filled';
  return {
    viewBox: '0 0 24 24',
    fill: filled ? 'currentColor' : 'none',
    stroke: filled ? 'none' : 'currentColor',
    strokeWidth: icon.strokeWidth ?? 1.5,
  };
}
