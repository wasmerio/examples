import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const JS_COPIES = [
  ['js/app.mjs', 'mcp-http/app.mjs'],
  ['js/wasmer-starter-ui.js', 'mcp-http/wasmer-starter-ui.js'],
];
const PY_COPIES = [
  ['python/mcp_http/__init__.py', 'mcp_http/__init__.py'],
  ['python/mcp_http/app.py', 'mcp_http/app.py'],
  ['python/mcp_http/wasmer-starter-ui.js', 'mcp_http/wasmer-starter-ui.js'],
];

export function sharedSource(rel) {
  return readFileSync(path.join(root, '_shared/mcp-http', rel), 'utf8');
}

export function generatedCopy(rel, source = sharedSource(rel)) {
  const hash = createHash('sha256').update(source).digest('hex');
  // Files that are already generated (the starter UI) keep their own header, which sync-starter-ui.mjs checks.
  if (source.startsWith('// Generated from ')) return { hash, text: source };
  const comment = rel.endsWith('.py') ? '#' : '//';
  return {
    hash,
    text: `${comment} Generated from _shared/mcp-http/${rel}; SHA256 ${hash}\n${source}`,
  };
}

export function copyPlan(folder) {
  const dir = path.resolve(root, folder);
  if (!dir.startsWith(root + path.sep)) throw new Error('Folder must stay inside the repository.');
  if (existsSync(path.join(dir, 'main.py'))) return PY_COPIES;
  if (existsSync(path.join(dir, 'server.mjs'))) return JS_COPIES;
  throw new Error(`No main.py or server.mjs in ${folder}`);
}

export function writeSharedCopies(folder) {
  const written = [];
  for (const [rel, destRel] of copyPlan(folder)) {
    const dest = path.join(root, folder, destRel);
    mkdirSync(path.dirname(dest), { recursive: true });
    writeFileSync(dest, generatedCopy(rel).text);
    written.push(`${folder}/${destRel}`);
  }
  return written;
}

export function checkSharedCopies(folder) {
  for (const [rel, destRel] of copyPlan(folder)) {
    const dest = path.join(root, folder, destRel);
    const actual = readFileSync(dest, 'utf8');
    if (actual !== generatedCopy(rel).text) throw new Error(`Stale MCP HTTP copy: ${folder}/${destRel}`);
  }
}

function main() {
  const checking = process.argv.includes('--check');
  const folders = process.argv.slice(2).filter((arg) => arg !== '--check');
  if (!folders.length) throw new Error('Pass template folders, relative to the repository root.');
  for (const folder of folders) {
    if (checking) checkSharedCopies(folder);
    else writeSharedCopies(folder);
    console.log(`${checking ? 'Verified' : 'Wrote'} ${folder}`);
  }
}

const entry = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (entry) {
  try {
    main();
  } catch (error) {
    console.error(error && error.message ? error.message : error);
    process.exit(1);
  }
}
