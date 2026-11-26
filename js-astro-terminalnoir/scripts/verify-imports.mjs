import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { init, parse } from 'es-module-lexer';
import { verifyIsolation } from './verify-isolation.mjs';

await init;

const SOURCE_DOMAIN = 'terminalnoir.web.app';

function codeBlocks(file, source) {
  if (!file.endsWith('.astro')) return [source];
  const blocks = [];
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (frontmatter) blocks.push(frontmatter[1]);
  for (const match of source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) blocks.push(match[1]);
  return blocks;
}

function assertInside(root, file, specifier) {
  if (specifier.includes('${')) throw new Error('dynamic relative glob');
  if (!specifier.startsWith('.') && !specifier.startsWith('/')) return;
  const cut = specifier.search(/[*?]|\{/);
  const prefix = cut === -1 ? specifier : specifier.slice(0, cut);
  verifyIsolation(root, resolve(dirname(file), prefix || '.'));
}

function globs(source) {
  const found = [];
  const pattern = /import\.meta\.glob(?:<[^>]+>)?\(\s*(['"`])([\s\S]*?)\1/g;
  for (const match of source.matchAll(pattern)) found.push(match[2]);
  return found;
}

export function scanImports(root, file, source) {
  if (source.includes(SOURCE_DOMAIN)) throw new Error(`source domain ${SOURCE_DOMAIN}`);
  for (const block of codeBlocks(file, source)) {
    const scannable = block.replace(/import\.meta\.glob<[^>]+>/g, 'import.meta.glob');
    let imports = [];
    try {
      imports = parse(scannable)[0];
    } catch {
      imports = [];
    }
    for (const item of imports) {
      const specifier = item.specifier ?? item.n;
      if (specifier) assertInside(root, file, specifier);
      else if ((item.d ?? item.dynamicStart ?? -1) >= 0) {
        const at = item.d ?? item.dynamicStart;
        const snippet = scannable.slice(at, at + 200);
        if (snippet.includes('./') || snippet.includes('../')) throw new Error('dynamic relative glob');
      }
    }
    for (const specifier of globs(block)) assertInside(root, file, specifier);
  }
}

export function scanTree(root) {
  const walk = directory => {
    for (const entry of readdirSync(directory)) {
      if (entry === 'node_modules' || entry === 'dist') continue;
      const path = join(directory, entry);
      if (statSync(path).isDirectory()) {
        walk(path);
        continue;
      }
      scanImports(root, path, readFileSync(path, 'utf8'));
    }
  };
  walk(join(root, 'src'));
}
