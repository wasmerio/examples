import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const dataRoot = path.resolve('src/data');

function collectJsonFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? collectJsonFiles(fullPath) : entry.name.endsWith('.json') ? [fullPath] : [];
  });
}

function collectImageEntries(value: unknown): Array<{ src: string; alt?: string }> {
  if (Array.isArray(value)) return value.flatMap(collectImageEntries);
  if (!value || typeof value !== 'object') return [];

  const object = value as Record<string, unknown>;
  const result = typeof object.imageSrc === 'string' ? [{ src: object.imageSrc, alt: typeof object.imageAlt === 'string' ? object.imageAlt : undefined }] : [];
  return [...result, ...Object.values(object).flatMap(collectImageEntries)];
}

describe('image contract', () => {
  it('references existing local image assets', () => {
    const entries = collectJsonFiles(dataRoot).flatMap((file) => collectImageEntries(JSON.parse(fs.readFileSync(file, 'utf8'))));
    const missing = entries.filter(({ src }) => src.startsWith('/') && !fs.existsSync(path.resolve(`public${src}`)));

    expect(missing).toEqual([]);
  });

  it('provides alt text for configured image assets', () => {
    const entries = collectJsonFiles(dataRoot).flatMap((file) => collectImageEntries(JSON.parse(fs.readFileSync(file, 'utf8'))));
    const missingAlt = entries.filter(({ alt }) => !alt?.trim());

    expect(missingAlt).toEqual([]);
  });
});
