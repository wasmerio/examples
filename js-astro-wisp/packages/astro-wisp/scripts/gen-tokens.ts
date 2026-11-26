/** 主题维护者用：把默认调色板（design/palette.json）的产物写回仓库。站点不需要运行它。 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { genDiagram, genPele, genTokens, genTones } from '../src/tokens/generate';
import { loadPaletteRaw } from '../src/tokens/palette';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function genAll(): Record<string, string> {
  return {
    'src/styles/tokens.css': genTokens(),
    'src/styles/pele.css': genPele(),
    'src/styles/diagram.css': genDiagram(),
    'src/explainers/core/tones.generated.ts': genTones(),
    'skills/wisp-diagram/palette.json': loadPaletteRaw(),
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const [rel, content] of Object.entries(genAll())) {
    const p = resolve(root, rel);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, content);
    console.log(`wrote ${rel}`);
  }
}
