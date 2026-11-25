/**
 * Keeps the colour-theme set tied to the files on disk.
 *
 * The set lived in four places that nothing compared: the files in
 * src/styles/themes/, the @import list in tokens/colors.css, the allowlist the
 * BaseLayout bootstrap validates sessionStorage against, and the registry the
 * pickers read. A theme could be added to one and missed in another — a file
 * with no import ships nothing, an import with no registry entry ships CSS no
 * one can reach, and a registry entry missing from the bootstrap allowlist is
 * a swatch that silently refuses to stick.
 *
 * The count was also quoted as 12 across the config, both locales, the project
 * page, three blog posts, the README and AGENTS.md, with nothing checking any
 * of it. The same lesson as the component count, which is why this mirrors
 * that test.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { colourThemes, selectorThemes } from '../lib/themes';
import en from '../i18n/en.json';
import nl from '../i18n/nl.json';
import siteConfig from '../config/site.config';

const COUNT = colourThemes.length;
const IDS = colourThemes.map((t) => t.id);
const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

describe('colour themes', () => {
  it('the registry is the number the copy quotes', () => {
    expect(COUNT).toBe(8);
  });

  it('ids are unique and lower-case', () => {
    expect(new Set(IDS).size).toBe(COUNT);
    for (const id of IDS) expect(id).toMatch(/^[a-z]+$/);
  });

  it('every theme has a file, and every file is a theme', () => {
    const onDisk = readdirSync(join(process.cwd(), 'src/styles/themes'))
      .filter((f) => f.endsWith('.css'))
      .map((f) => f.replace('.css', ''));
    expect(onDisk.sort()).toEqual([...IDS].sort());
  });

  it('every theme file scopes itself to its own id', () => {
    for (const id of IDS) {
      const css = read(`src/styles/themes/${id}.css`);
      expect(css, id).toContain(`html[data-theme="${id}"]`);
      expect(css, id).toContain(`html.dark[data-theme="${id}"]`);
    }
  });

  it('every theme file defines the full brand scale', () => {
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    for (const id of IDS) {
      const css = read(`src/styles/themes/${id}.css`);
      for (const step of steps) {
        expect(css, `${id} → --brand-${step}`).toMatch(
          new RegExp(`--brand-${step}:\\s*oklch\\(`)
        );
      }
    }
  });

  it('the swatch colour matches the palette brand-500', () => {
    for (const theme of colourThemes) {
      const css = read(`src/styles/themes/${theme.id}.css`);
      const match = /--brand-500:\s*(oklch\([^)]*\))/.exec(css);
      expect(match, `${theme.id} has no --brand-500`).not.toBeNull();
      expect(norm(theme.color), theme.id).toBe(norm(match![1]));
    }
  });

  it('colors.css imports exactly the registered themes', () => {
    const imported = [...read('src/styles/tokens/colors.css').matchAll(
      /@import\s+'\.\.\/themes\/([a-z0-9-]+)\.css'/g
    )].map((m) => m[1]);
    expect(imported.sort()).toEqual([...IDS].sort());
  });

  it('the bootstrap allowlist matches the registry', () => {
    const match = /const COLOR_THEMES = \[([^\]]*)\]/.exec(read('src/layouts/BaseLayout.astro'));
    expect(match, 'COLOR_THEMES not found in BaseLayout').not.toBeNull();
    const allowed = [...match![1].matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]);
    expect(allowed.sort()).toEqual([...IDS].sort());
  });

  it('the default the layout seeds is one of the themes', () => {
    const match = /<html[^>]*\sdata-theme="([a-z0-9-]+)"/.exec(read('src/layouts/BaseLayout.astro'));
    expect(match, 'no seeded data-theme on <html>').not.toBeNull();
    expect(IDS).toContain(match![1]);
  });

  it('the base scale in primitives.css matches that default', () => {
    const fallback = /<html[^>]*\sdata-theme="([a-z0-9-]+)"/.exec(read('src/layouts/BaseLayout.astro'))![1];
    const base = /--brand-500:\s*(oklch\([^)]*\))/.exec(read('src/styles/tokens/primitives.css'));
    const theme = /--brand-500:\s*(oklch\([^)]*\))/.exec(read(`src/styles/themes/${fallback}.css`));
    expect(norm(base![1])).toBe(norm(theme![1]));
  });

  it('no per-theme exception names a theme that is gone', () => {
    for (const file of ['src/styles/global.css', 'src/components/ui/form/Button/Button.astro']) {
      for (const m of read(file).matchAll(/\[data-theme="([a-z0-9-]+)"\]/g)) {
        expect(IDS, `${file} → ${m[1]}`).toContain(m[1]);
      }
    }
  });

  it('site.config and both locales quote the count', () => {
    expect(siteConfig.description).toContain(`${COUNT} colour themes`);
    expect(JSON.stringify(en)).toContain(`${COUNT} colour themes`);
    expect(JSON.stringify(nl)).toContain(`${COUNT} kleurthema's`);
  });

  it('the README and the docs quote the count', () => {
    for (const file of [
      'README.md',
      'src/content/blog/en/astro-rocket-configuration-guide.mdx',
      'src/content/blog/en/astro-rocket-getting-started.mdx',
    ]) {
      expect(read(file), file).toMatch(new RegExp(`${COUNT} (ready-to-use )?colour themes`));
    }
  });

  it('no shipped copy still claims twelve', () => {
    for (const file of [
      'README.md',
      'AGENTS.md',
      'src/config/site.config.ts',
      'src/i18n/en.json',
      'src/i18n/nl.json',
      'src/content/projects/en/astro-rocket.mdx',
      'src/content/blog/en/astro-rocket-configuration-guide.mdx',
      'src/content/blog/en/astro-rocket-getting-started.mdx',
      'src/content/blog/en/component-library.mdx',
      'src/content/blog/en/scroll-progress-ring.mdx',
    ]) {
      expect(read(file), file).not.toMatch(/\btwelve\b/i);
      expect(read(file), file).not.toMatch(/\b12[- ](colour|color|swatch|theme)/i);
    }
  });

  it('no shipped copy names a palette that was removed', () => {
    const gone = ['orange', 'amber', 'lime', 'magenta'];
    for (const file of [
      'src/content/projects/en/astro-rocket.mdx',
      'src/content/blog/en/astro-rocket-configuration-guide.mdx',
      'src/content/blog/en/scroll-progress-ring.mdx',
      'README.md',
    ]) {
      const prose = read(file)
        // Tailwind's own palette is unrelated to the theme set
        .replace(/\b(text|bg|border|from|via|to|ring|decoration)-[a-z]+-\d{2,3}\b/g, '')
        // the OKLCH section names hues on the wheel, not themes
        .replace(/Common hue landmarks:[^\n]*\n/g, '');
      for (const name of gone) {
        expect(prose, `${file} → ${name}`).not.toMatch(new RegExp(`\\b${name}\\b`, 'i'));
      }
    }
  });

  it('every registered theme is offered in the pickers', () => {
    expect(selectorThemes).toHaveLength(COUNT);
  });
});
