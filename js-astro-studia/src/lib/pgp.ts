import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { socials } from './data.ts';

/* Everything /pgp-key/ needs, from the one value in socials.yml. Every function
   here returns null when it is unset. */
const raw = socials.pgp_fingerprint?.replace(/\s+/g, '').toUpperCase() ?? null;
const valid = raw && /^[0-9A-F]{40}$/.test(raw) ? raw : null;

/** The long key id: the last 16 characters, which is what people paste. */
export const keyId = () => (valid ? valid.slice(-16) : null);

/** The fingerprint in the usual groups of four, for reading aloud. */
export const grouped = () => (valid ? (valid.match(/.{4}/g)?.join(' ') ?? valid) : null);

export const fingerprint = () => valid;

/** Working directory, not import.meta.url — see images.ts. */
const keyFile = () =>
  valid ? join(process.cwd(), 'public', 'assets/pgp-key', `${valid}.asc`) : null;

/** The exported public key's URL, or null when the .asc is not there: the page
    linked it regardless and advertised a download that 404s. */
export const keyPath = () => {
  const file = keyFile();
  return file && existsSync(file) ? `/assets/pgp-key/${valid}.asc` : null;
};

/** The ASCII-armored key, inlined at build time. */
export const armoredKey = (): string | null => {
  const file = keyFile();
  return file && existsSync(file) ? readFileSync(file, 'utf8').trim() : null;
};
