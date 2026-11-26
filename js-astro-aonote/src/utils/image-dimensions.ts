import fs from 'node:fs';
import path from 'node:path';
import sizeOf from 'image-size';

export function resolveImagePath(
  src: string,
  contentFilePath: string | undefined,
  projectRoot: string,
): string | null {
  const clean = src.split('?')[0]!.split('#')[0]!;
  if (!clean || clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return null;
  }

  if (clean.startsWith('/')) {
    return path.join(projectRoot, 'public', clean.slice(1));
  }

  if (contentFilePath) {
    return path.resolve(path.dirname(contentFilePath), clean);
  }

  return null;
}

export function readImageDimensions(
  filePath: string,
): { width: number; height: number } | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const result = sizeOf(fs.readFileSync(filePath));
    if (result.width && result.height) {
      return { width: result.width, height: result.height };
    }
  } catch {
    return null;
  }
  return null;
}
