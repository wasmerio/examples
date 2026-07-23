'use strict';

const esbuild = require('esbuild');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'dist', 'server');
const outputPath = path.join(outputDir, 'index.cjs');

fs.mkdirSync(outputDir, { recursive: true });

esbuild.buildSync({
  bundle: true,
  entryPoints: [path.join(projectRoot, 'server', 'index.js')],
  format: 'cjs',
  outfile: outputPath,
  platform: 'node',
  target: 'node18',
});

console.log(`bundled server entry -> ${outputPath}`);
