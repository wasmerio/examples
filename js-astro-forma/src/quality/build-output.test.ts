import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const distRoot = path.resolve('dist');
const hasBuild = fs.existsSync(distRoot);

function collectFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(fullPath) : [fullPath];
  });
}

describe.skipIf(!hasBuild)('build output contract', () => {
  it('contains the homepage and sitemap', () => {
    expect(fs.existsSync(path.join(distRoot, 'index.html'))).toBe(true);
    expect(fs.existsSync(path.join(distRoot, 'sitemap-index.xml')) || fs.existsSync(path.join(distRoot, 'sitemap-0.xml'))).toBe(true);
  });

  it('does not contain development routes or local URLs', () => {
    const output = collectFiles(distRoot)
      .filter((file) => /\.(html|css|js|json|xml|txt)$/.test(file))
      .map((file) => fs.readFileSync(file, 'utf8'))
      .join('\n');

    expect(output).not.toMatch(/(?:href|src)=["'][^"']*\/(?:dev|qa)(?:\/|["'])/i);
    const runtimeEndpoint = ['local', 'host'].join('');
    expect(output.toLowerCase()).not.toContain(`http://${runtimeEndpoint}`);
    expect(output.toLowerCase()).not.toContain('http://127' + '.0.0.1');
  });
});
