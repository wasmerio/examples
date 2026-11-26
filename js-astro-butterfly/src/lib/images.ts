import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { url } from './url';

/**
 * Images stored in the project are encoded at build time: AVIF, sized for where
 * they are shown. A missing one fails the build rather than the visitor.
 *
 * - post covers with a relative path: `image()` in the content schema resolves
 *   them to ImageMetadata
 * - site images (src/config.ts): a path under src/assets, looked up below
 * - anything else, such as a file in public/ or a full URL: served as it is
 */
export type ImageSource = ImageMetadata | string;
export type Img = { src: string; srcset?: string; sizes?: string };

const siteImages = import.meta.glob<{ default: ImageMetadata }>('/src/assets/*.{png,jpg,jpeg,webp,avif,svg}', { eager: true });

type Options = {
  /** Fixed output box: both set -> cropped to cover it (thumbnails, avatars). */
  width: number;
  height?: number;
  /** Responsive candidates; the shown size is picked by `sizes`. */
  widths?: number[];
  sizes?: string;
  /** Defaults to AVIF; a format other programs must read (feeds, link previews) can override it. */
  format?: 'avif' | 'jpg' | 'png';
};

const done = new Map<string, Promise<Img>>();

export function optimize(source: ImageSource, o: Options): Promise<Img> {
  const src = typeof source === 'string' ? (siteImages[source]?.default ?? source) : source;
  if (typeof src === 'string') return Promise.resolve({ src: url(src) });
  // Vector images are already resolution independent.
  if (src.format === 'svg') return Promise.resolve({ src: src.src });
  const key = JSON.stringify([src.src, o]);
  let p = done.get(key);
  if (!p) {
    // Never upscale: the source's own width replaces any candidate wider than it.
    const width = Math.min(o.width, src.width);
    const base = { src, format: o.format ?? ('avif' as const), layout: 'none' as const };
    const encoded = o.height
      // The types rule out `layout` next to `densities`, but the config's default layout must still be off here.
      ? getImage({ ...base, layout: 'none' as never, width: o.width, height: o.height, fit: 'cover', densities: [1, 2] })
      : o.widths
        ? getImage({ ...base, width, widths: [...new Set(o.widths.map((w) => Math.min(w, width)))], sizes: o.sizes })
        : getImage({ ...base, width });
    p = encoded.then((img) => ({ src: img.src, srcset: img.srcSet.attribute || undefined, sizes: o.sizes }));
    done.set(key, p);
  }
  return p;
}

/** Presets for each place an image is shown (sizes measured at 1440 / 1024 / 393px). */
export const imagePresets = {
  /** Home card cover: ~363x250 desktop, full card width on phones */
  card: { width: 800, widths: [400, 600, 800], sizes: '(max-width: 768px) 100vw, 420px' },
  /** Page / post header: full viewport width, 400px (340px on phones) high */
  header: { width: 1920, widths: [768, 1280, 1920], sizes: '100vw' },
  /** Prev / next and related post covers: ~392x150 */
  pager: { width: 800, widths: [400, 800], sizes: '(max-width: 768px) 100vw, 400px' },
  /** Square thumbnails in the aside / archives (64-80px) */
  thumb: { width: 80, height: 80 },
  avatar: { width: 120, height: 120 },
  logo: { width: 36, height: 36 },
  notFound: { width: 460, height: 300 },
  /** Link previews: social platforms don't all read AVIF */
  social: { width: 1200, format: 'jpg' },
  feedIcon: { width: 64, height: 64, format: 'png' },
} satisfies Record<string, Options>;
