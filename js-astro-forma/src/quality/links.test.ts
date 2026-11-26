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

function collectLinks(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(collectLinks);
  if (!value || typeof value !== 'object') return [];

  return Object.entries(value).flatMap(([key, entry]) => {
    const nested = collectLinks(entry);
    return key.toLowerCase().endsWith('href') && typeof entry === 'string' ? [entry, ...nested] : nested;
  });
}

function isInternalPath(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}

const pagesRoot = path.resolve('src/pages');
const srcRoot = path.resolve('src');

function collectAstroFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectAstroFiles(fullPath);
    return entry.name.endsWith('.astro') ? [fullPath] : [];
  });
}

function collectAstroHrefs(): string[] {
  const pattern = /href\s*=\s*["'](\/[^"'#?]*\/?)["']/g;
  return collectAstroFiles(srcRoot).flatMap((file) => {
    const matches: string[] = [];
    for (const match of fs.readFileSync(file, 'utf8').matchAll(pattern)) {
      matches.push(match[1]);
    }
    return matches;
  });
}

function collectRoutePaths(): string[] {
  return collectAstroFiles(pagesRoot).map((file) => {
    const relative = path.relative(pagesRoot, file).replace(/\\/g, '/').replace(/\.astro$/, '');
    if (relative === 'index' || relative.endsWith('/index')) {
      const route = relative.replace(/\/?index$/, '');
      return route ? `/${route}/` : '/';
    }
    return `/${relative}/`;
  });
}

describe('internal link contract', () => {
  it('keeps internal JSON links on trailing slash routes', () => {
    const links = collectJsonFiles(dataRoot).flatMap((file) => collectLinks(JSON.parse(fs.readFileSync(file, 'utf8'))));
    const invalid = links.filter((href) => isInternalPath(href) && !href.startsWith('#') && !href.includes('?') && !href.includes('#') && href !== '/' && !href.endsWith('/'));

    expect(invalid).toEqual([]);
  });

  it('does not ship placeholder hash links', () => {
    const links = collectJsonFiles(dataRoot).flatMap((file) => collectLinks(JSON.parse(fs.readFileSync(file, 'utf8'))));
    expect(links.filter((href) => href === '#')).toEqual([]);
  });

  it('points every internal link to an existing route', () => {
    const routes = collectRoutePaths();
    const jsonLinks = collectJsonFiles(dataRoot).flatMap((file) => collectLinks(JSON.parse(fs.readFileSync(file, 'utf8'))));
    const links = [...jsonLinks, ...collectAstroHrefs()].filter(
      (href) => isInternalPath(href) && !href.includes('?') && !href.includes('#'),
    );
    expect(links.length).toBeGreaterThan(0);
    const dead = [...new Set(links)].filter((href) => !routes.includes(href));
    expect(dead).toEqual([]);
  });
});
