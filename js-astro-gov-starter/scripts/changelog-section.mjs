#!/usr/bin/env node
/**
 * Print the CHANGELOG.md body for one version, without its heading.
 *
 * Used by .github/workflows/release.yml so the notes on the GitHub Releases
 * page are exactly the notes committed to the repo — there is no second place
 * to keep release notes in sync.
 *
 * Usage: node scripts/changelog-section.mjs 2.0.0
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const version = process.argv[2];
if (!version) {
  console.error('Usage: node scripts/changelog-section.mjs <version>');
  process.exit(1);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const changelog = readFileSync(resolve(root, 'CHANGELOG.md'), 'utf8');

// Version headings look like:  ## [2.0.0] - 2026-08-22
const lines = changelog.split('\n');
const isVersionHeading = (line) => /^## /.test(line);
const matchesVersion = (line) =>
  new RegExp(`^## \\[?${version.replace(/\./g, '\\.')}\\]?(\\s|$)`).test(line);

const start = lines.findIndex(matchesVersion);
if (start === -1) {
  console.error(`No CHANGELOG.md section found for version ${version}.`);
  process.exit(1);
}

let end = lines.length;
for (let i = start + 1; i < lines.length; i++) {
  if (isVersionHeading(lines[i])) {
    end = i;
    break;
  }
}

// Drop the heading itself, the trailing link-reference definitions that live at
// the bottom of the file (they belong to the document, not to the last release),
// and blank lines at either edge, so the release body starts with real content.
const section = lines.slice(start + 1, end);
while (section.length && /^(\s*|-{3,}|\[[^\]]+\]:\s*\S+)$/.test(section[section.length - 1])) {
  section.pop();
}
const body = section.join('\n').replace(/^\n+/, '').replace(/\n+$/, '');
if (!body) {
  console.error(`CHANGELOG.md section for ${version} is empty.`);
  process.exit(1);
}
process.stdout.write(body + '\n');
