#!/usr/bin/env node
/**
 * Patch Lottie JSON colors to match DESIGN.md / global.css color system.
 *
 * Usage:
 *   node scripts/patch-lottie-colors.js path/to/downloaded.json
 *   # Output: public/animations/grid.json
 */

import fs from 'node:fs';
import path from 'node:path';

// Design system colors (from global.css — what we actually render)
const DESIGN = {
  primary: [0.0627, 0.7255, 0.5059],   // #10b981
  secondary: [0.5529, 0.6510, 0.5882], // #8da696
  tertiary: [0.2549, 0.5098, 0.5098],  // #418282
  textPrimary: [0.6314, 0.6314, 0.6667], // #a1a1aa
  textSecondary: [0.9569, 0.9569, 0.9608], // #f4f4f5
  accent: [0.5569, 0.8078, 0.8039],    // #8ececd
};

// Opacity levels for visual hierarchy
const OPACITY = {
  dim: 0.20,
  soft: 0.40,
  medium: 0.60,
  strong: 0.85,
  full: 1.0,
};

/**
 * Recursively walk a Lottie JSON tree and patch stroke/fill colors.
 *
 * Color props in Lottie:
 *   "c": { "a": 0, "k": [r, g, b, a?] }
 *   "o": { "a": 0, "k": opacity }   (separate opacity)
 */
function patchColors(node, stats) {
  if (!node || typeof node !== 'object') return;

  // Stroke shape type
  if (node.ty === 'st') {
    const before = JSON.stringify(node.c?.k?.slice(0, 3) ?? null);
    node.c = Object.assign(node.c ?? {}, {
      a: 0,
      k: [...DESIGN.primary, OPACITY.medium],
    });
    stats.strokes.push({ before, after: 'primary/0.60' });
    return; // don't recurse into stroke itself
  }

  // Fill shape type
  if (node.ty === 'fl') {
    const before = JSON.stringify(node.c?.k?.slice(0, 3) ?? null);
    node.c = Object.assign(node.c ?? {}, {
      a: 0,
      k: [...DESIGN.primary, OPACITY.soft],
    });
    stats.fills.push({ before, after: 'primary/0.40' });
    return;
  }

  // Gradient fill — could recolor stops, but skip for grid animations
  if (node.ty === 'gf' || node.ty === 'gs') {
    stats.gradients.push('skipped');
    return;
  }

  // Composite shape layer — recurse into items
  if (node.ty === 'gr' && Array.isArray(node.it)) {
    for (const child of node.it) {
      patchColors(child, stats);
    }
    return;
  }

  // Generic object recurse
  for (const key of Object.keys(node)) {
    const child = node[key];
    if (Array.isArray(child)) {
      for (const item of child) patchColors(item, stats);
    } else if (typeof child === 'object' && child !== null) {
      patchColors(child, stats);
    }
  }
}

// ─── Main ───────────────────────────────────────────────────────────

const [,, rawPath] = process.argv;

if (!rawPath) {
  console.error('Usage: node scripts/patch-lottie-colors.js <path-to-lottie.json>');
  process.exit(1);
}

const input = path.resolve(rawPath);
if (!fs.existsSync(input)) {
  console.error(`File not found: ${input}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(input, 'utf-8'));

const stats = { strokes: [], fills: [], gradients: [] };
patchColors(data, stats);

// Ensure output directory exists
const outDir = path.resolve('public/animations');
fs.mkdirSync(outDir, { recursive: true });

const outFile = path.join(outDir, 'grid.json');
fs.writeFileSync(outFile, JSON.stringify(data, null, 2));

console.log('\n=== Color Patch Report ===');
console.log(`Input:  ${input}`);
console.log(`Output: ${outFile}`);
console.log(`Strokes patched: ${stats.strokes.length}`);
console.log(`Fills patched:   ${stats.fills.length}`);
console.log(`Gradients:       ${stats.gradients.length}`);

if (stats.strokes.length > 0) {
  console.log('\nOriginal stroke colors found:');
  for (const s of stats.strokes) {
    console.log(`  ${s.before ?? '(animated)'} → ${s.after}`);
  }
}
if (stats.fills.length > 0) {
  console.log('\nOriginal fill colors found:');
  for (const f of stats.fills) {
    console.log(`  ${f.before ?? '(animated)'} → ${f.after}`);
  }
}

console.log('\nAll colors mapped to design system:');
console.log(`  primary     #10b981  (stroke: ${(OPACITY.medium * 100).toFixed(0)}% opacity)`);
console.log(`  primary     #10b981  (fill:   ${(OPACITY.soft * 100).toFixed(0)}% opacity)`);
console.log('\nDone.');
