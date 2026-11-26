#!/usr/bin/env node
/**
 * Populate create-popular-site/templates/ from the repo's demo workspaces.
 *
 * Run by `prepack`, so the published tarball carries the templates while the
 * repo does not: demos/ stays the single source of truth and there is no
 * committed copy to drift. `templates/` is gitignored for the same reason.
 *
 * The one transform is the demo bar. Every demo config ends with a DEMO_BAR
 * export, which is switcher furniture for the deployed gallery and must never
 * appear on a real community's site. It is the last export in each file by
 * convention, and this asserts that before trimming from it to end of file,
 * so a future reorder fails here rather than shipping a demo bar to adopters.
 *
 * The project files a scaffolded site needs (astro.config.mjs, package.json,
 * src/content.config.ts) are NOT written from literals here. They come from
 * `scripts/templates/`, the same files `scripts/setup.py` renders, copied into
 * `templates/_shared/`. Two generators writing the same file two ways is how
 * they drift, and the wizard repo's CLAUDE.md forbids exactly that.
 */
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = resolve(HERE, '..');
const OUT = join(HERE, 'templates');
const TEMPLATES = ['starter', 'aquarium', 'foodie', 'kdrama', 'superfan'];

/* The project files, shared verbatim with scripts/setup.py. */
const SHARED = [
  'astro.config.package.mjs.tmpl',
  'package.json.tmpl',
  'content.config.ts.tmpl',
];

const DEMO_BAR_EXPORT = /^export const DEMO_BAR\b/m;

function neutralizeDemoBar(source, slug) {
  const match = DEMO_BAR_EXPORT.exec(source);
  if (!match) throw new Error(`${slug}: popular.config.ts has no DEMO_BAR export`);

  const after = source.slice(match.index + match[0].length);
  if (/^export const /m.test(after)) {
    throw new Error(
      `${slug}: DEMO_BAR is no longer the last export in popular.config.ts. ` +
      `This script trims from it to end of file; move it back or teach it to ` +
      `match the block.`
    );
  }

  // Keep the doc comment that precedes it, if any, so the file still explains
  // the key an adopter will find in the theme's config docs.
  return `${source.slice(0, match.index)}export const DEMO_BAR = null;\n`;
}

rmSync(OUT, { recursive: true, force: true });

for (const slug of TEMPLATES) {
  const from = join(REPO, 'demos', slug);
  const to = join(OUT, slug);
  mkdirSync(to, { recursive: true });

  cpSync(join(from, 'src', 'content'), join(to, 'src', 'content'), { recursive: true });
  cpSync(join(from, 'public', 'images'), join(to, 'public', 'images'), { recursive: true });

  const config = readFileSync(join(from, 'popular.config.ts'), 'utf8');
  writeFileSync(join(to, 'popular.config.ts'), neutralizeDemoBar(config, slug));

  const files = readdirSync(join(to, 'src', 'content')).length;
  console.log(`templates/${slug}: ${files} collection(s)`);
}

mkdirSync(join(OUT, '_shared'), { recursive: true });
for (const name of SHARED) {
  cpSync(join(REPO, 'scripts/templates', name), join(OUT, '_shared', name));
}

console.log(
  `collected ${TEMPLATES.length} templates + ${SHARED.length} shared project files into ${OUT}`
);
