import type { ImageMetadata } from 'astro';

/**
 * Your portrait: the ONE file at `src/assets/portrait.<ext>`, whatever the
 * extension. A glob rather than a path in consts.ts because `<Image>` needs a
 * statically analysable asset — a configured string would arrive as a runtime
 * value with no hashed filename and no intrinsic dimensions, which the audit
 * fails. An eager `import.meta.glob` is resolved by Vite at build time.
 */
const found = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/portrait.{avif,gif,jpeg,jpg,png,svg,webp}',
  { eager: true },
);

const matches = Object.keys(found).sort();

/* Two portraits is as wrong as none: picking by sort order would keep showing
   the old photo after a new one arrived in another format. */
if (matches.length === 0) {
  throw new Error(
    'portrait: no src/assets/portrait.<ext> found — add one ' +
      '(portrait.jpg, .png, .webp, .avif or .svg). It is rendered by ' +
      'src/components/hero/PersonHero.astro and src/pages/cv/index.astro.',
  );
}
if (matches.length > 1) {
  throw new Error(
    `portrait: ${matches.length} portraits in src/assets/ (${matches
      .map((m) => m.replace('../assets/', ''))
      .join(', ')}) — keep exactly one.`,
  );
}

export const portrait: ImageMetadata = found[matches[0]].default;

/** The side of the square both consumers render it at, before CSS scales it. */
export const PORTRAIT_SIZE = 320;
