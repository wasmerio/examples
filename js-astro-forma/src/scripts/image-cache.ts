import { createHash } from 'node:crypto';
import fs from 'node:fs';

export type ImageFingerprint = {
  size: number;
  sha256: string;
};

export type ImageManifestEntry = ImageFingerprint;

export async function fingerprintImage(filePath: string): Promise<ImageFingerprint> {
  const hash = createHash('sha256');
  const stream = fs.createReadStream(filePath);

  for await (const chunk of stream) {
    hash.update(chunk);
  }

  return {
    size: fs.statSync(filePath).size,
    sha256: hash.digest('hex'),
  };
}

export function canReuseImageDerivatives(
  previous: ImageManifestEntry | number | undefined,
  current: ImageFingerprint,
  allTargetsExist: boolean,
): boolean {
  return Boolean(
    allTargetsExist &&
    typeof previous !== 'number' &&
    previous?.size === current.size &&
    previous.sha256 === current.sha256,
  );
}
