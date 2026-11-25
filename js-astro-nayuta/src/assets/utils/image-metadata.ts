import { readFile } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { imageMetadata } from 'astro/assets/utils';

export interface ImageDimensions {
  width: number;
  height: number;
}

export function imageDimensions(
  width: unknown,
  height: unknown,
): ImageDimensions | undefined {
  const w = Number(width);
  const h = Number(height);
  return Number.isFinite(w) && w > 0 && Number.isFinite(h) && h > 0
    ? { width: w, height: h }
    : undefined;
}

const remoteCache = new Map<string, Promise<ImageDimensions | undefined>>();

/** Best effort only: an unavailable image must never prevent publishing content. */
export async function resolveImageDimensions(
  src: string,
  options: {
    width?: unknown;
    height?: unknown;
    file?: string;
    root?: string;
  } = {},
): Promise<ImageDimensions | undefined> {
  const explicit = imageDimensions(options.width, options.height);
  if (explicit) return explicit;
  if (/^(https?:)?\/\//i.test(src)) {
    const url = src.startsWith('//') ? `https:${src}` : src;
    let result = remoteCache.get(url);
    if (!result) {
      result = probeRemote(url);
      remoteCache.set(url, result);
    }
    return result;
  }
  if (/^[a-z][a-z\d+.-]*:/i.test(src)) return undefined;
  try {
    const root = options.root ?? process.cwd();
    const path = decodeURIComponent(src.split(/[?#]/, 1)[0]);
    const base = src.startsWith('/')
      ? resolve(root, 'public')
      : dirname(options.file ?? resolve(root, 'index.md'));
    const filename = resolve(base, path.replace(/^\//, ''));
    if (src.startsWith('/') && !filename.startsWith(base + sep))
      return undefined;
    const dimensions = await imageMetadata(await readFile(filename), src);
    return imageDimensions(dimensions.width, dimensions.height);
  } catch {
    return undefined;
  }
}

async function probeRemote(src: string): Promise<ImageDimensions | undefined> {
  // Bound both time and bytes. Read metadata as soon as its header is available.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  try {
    const response = await fetch(src, { signal: controller.signal });
    if (!response.ok || !response.body) return undefined;
    reader = response.body.getReader();
    let bytes = new Uint8Array(0);
    while (bytes.length < 1024 * 1024) {
      const { done, value } = await reader.read();
      if (done) break;
      if (bytes.length + value.length > 1024 * 1024) break;
      const next = new Uint8Array(bytes.length + value.length);
      next.set(bytes);
      next.set(value, bytes.length);
      bytes = next;
      try {
        const dimensions = await imageMetadata(bytes, src);
        return imageDimensions(dimensions.width, dimensions.height);
      } catch {
        // A partial image header is expected while streaming.
      }
    }
  } catch {
    // Runtime loading can still succeed when the build machine is offline.
  } finally {
    clearTimeout(timeout);
    await reader?.cancel().catch(() => {});
    controller.abort();
  }
  return undefined;
}
