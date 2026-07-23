'use strict';

// Assembles the self-contained artifact that runs on EdgeJS (see wasmer.toml).
// The Express server is bundled with esbuild so node_modules does not need to
// be shipped; the built frontend (dist/), public/ and user-data/ are copied
// alongside it, matching the directory layout services/app.js expects.

const esbuild = require('esbuild');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const outputRoot = path.join(projectRoot, 'edge-build');

fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(path.join(outputRoot, 'server'), { recursive: true });

esbuild.buildSync({
  bundle: true,
  entryPoints: [path.join(projectRoot, 'server.js')],
  format: 'cjs',
  outfile: path.join(outputRoot, 'server', 'index.cjs'),
  platform: 'node',
  target: 'node18',
});

for (const dir of ['dist', 'public', 'user-data']) {
  const source = path.join(projectRoot, dir);
  if (!fs.existsSync(source)) {
    throw new Error(`missing ${dir}/ - run \`pnpm build\` first`);
  }
  fs.cpSync(source, path.join(outputRoot, dir), { recursive: true });
}

const { name, version } = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'),
);
fs.writeFileSync(
  path.join(outputRoot, 'package.json'),
  `${JSON.stringify({ name, version, private: true }, null, 2)}\n`,
);

console.log(`assembled EdgeJS artifact -> ${outputRoot}`);
