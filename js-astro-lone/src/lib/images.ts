import sharp from 'sharp';

export const CANDIDATES = [480, 960, 1600];

export function variantsOf(src: string) {
  if (!src) return [];
  const ext = src.slice(src.lastIndexOf('.'));
  return CANDIDATES.map((w) => `${src.slice(0, -ext.length)}-${w}.webp`);
}

export function fullOf(src: string) {
  return variantsOf(src).at(-1) ?? src;
}

export function srcsetOf(src: string): string {
  if (!src) return '';
  return variantsOf(src)
    .map((url, i) => `${url} ${CANDIDATES[i]}w`)
    .join(', ');
}

export async function measure(src: string, publicDir = 'public'): Promise<{ width: number; height: number }> {
  if (!src) return { width: 0, height: 0 };
  const file = `${publicDir.replace(/\/$/, '')}/${src.replace(/^\//, '')}`;
  try {
    const meta = await sharp(file).metadata();
    return { width: meta.width ?? 0, height: meta.height ?? 0 };
  } catch {
    return { width: 0, height: 0 };
  }
}

export async function measureAll(srcs: string[], publicDir = 'public'): Promise<Record<string, { width: number; height: number }>> {
  const out: Record<string, { width: number; height: number }> = {};
  await Promise.all(
    [...new Set(srcs.filter(Boolean))].map(async (src) => {
      out[src] = await measure(src, publicDir);
    }),
  );
  return out;
}
