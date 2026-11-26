// Runs a local binary through the current node, bypassing PATH issues in npm scripts.
import { spawnSync } from 'node:child_process';

const [cmd, ...args] = process.argv.slice(2);
const BINS = {
  astro: 'node_modules/astro/bin/astro.mjs',
  pagefind: 'node_modules/pagefind/lib/runner/bin.cjs',
  prettier: 'node_modules/prettier/bin/prettier.cjs',
  eslint: 'node_modules/eslint/bin/eslint.js',
};
if (!cmd || !BINS[cmd]) {
  console.error(`usage: node scripts/bin.mjs <${Object.keys(BINS).join('|')}> [...args]`);
  process.exit(1);
}
const r = spawnSync(process.execPath, [BINS[cmd], ...args], { stdio: 'inherit' });
process.exit(r.status ?? 1);
