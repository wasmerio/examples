#!/usr/bin/env node
/**
 * USWDS compliance checker.
 * Validates that every built HTML page contains the required federal
 * web design components: USA Banner, USA Identifier, skip nav, and
 * a proper lang attribute.
 *
 * Run: node scripts/compliance-check.mjs [--dist=dist] [--verbose]
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const args = process.argv.slice(2);
const distDir = args.find(a => a.startsWith('--dist='))?.split('=')[1] ?? 'dist';
const verbose = args.includes('--verbose');

const RULES = [
  {
    id: 'usa-banner',
    description: 'USA Banner (class="usa-banner")',
    test: (html) => html.includes('class="usa-banner"') || html.includes("class='usa-banner'"),
  },
  {
    id: 'usa-identifier',
    description: 'USA Identifier (class="usa-identifier")',
    test: (html) => html.includes('class="usa-identifier"') || html.includes("class='usa-identifier'"),
  },
  {
    id: 'skip-nav',
    description: 'Skip navigation link (#main-content)',
    test: (html) => html.includes('#main-content'),
  },
  {
    id: 'main-landmark',
    description: '<main> element with id="main-content"',
    test: (html) => html.includes('id="main-content"') || html.includes("id='main-content'"),
  },
  {
    id: 'lang-attr',
    description: 'html[lang] attribute',
    test: (html) => /<html[^>]+lang=/.test(html),
  },
  {
    id: 'viewport-meta',
    description: 'Viewport meta tag',
    test: (html) => html.includes('name="viewport"') || html.includes("name='viewport'"),
  },
];

function walkHtml(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkHtml(full));
    } else if (entry.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

const htmlFiles = walkHtml(join(process.cwd(), distDir));

if (htmlFiles.length === 0) {
  console.error(`No HTML files found in ${distDir}/. Did you run pnpm build first?`);
  process.exit(1);
}

let totalFails = 0;
const fileResults = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf-8');
  const rel = file.replace(process.cwd() + '/', '');
  const failures = RULES.filter(r => !r.test(html));

  fileResults.push({ file: rel, failures });
  totalFails += failures.length;

  if (verbose || failures.length > 0) {
    if (failures.length === 0) {
      console.log(`  ✓ ${rel}`);
    } else {
      console.log(`  ✗ ${rel}`);
      for (const f of failures) {
        console.log(`      missing: ${f.description}`);
      }
    }
  }
}

const failedFiles = fileResults.filter(r => r.failures.length > 0);

console.log('');
console.log('USWDS Compliance Check');
console.log(`  Pages checked : ${htmlFiles.length}`);
console.log(`  Pages passing : ${htmlFiles.length - failedFiles.length}`);
console.log(`  Total issues  : ${totalFails}`);

if (totalFails > 0) {
  console.log('');
  console.log('FAIL: The pages listed above are missing required USWDS components.');
  process.exit(1);
}

console.log('  Result        : PASS');
