/**
 * Keeps the component count in the marketing copy tied to the registry.
 *
 * The number used to be 57, which came from another theme's documentation
 * rather than from this one. Nothing checked it, so it survived in six places
 * while the page's own badge said 50+ and the README broke 57 down into
 * categories that summed to 59.
 *
 * `component-registry.json` is the source of truth: the curated set a user
 * installs or copies. These tests fail when a component is added or removed
 * without the copy following, so the claim cannot drift again.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import registry from '../../component-registry.json';
import en from '../i18n/en.json';
import siteConfig from '../config/site.config';

const COUNT = Object.keys(registry.components).length;
const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

describe('component count', () => {
  it('the registry is the number the copy quotes', () => {
    expect(COUNT).toBe(44);
  });

  it('every file the registry lists exists', () => {
    for (const [name, entry] of Object.entries(registry.components)) {
      for (const file of entry.files) {
        expect(() => readFileSync(join(process.cwd(), file)), `${name} → ${file}`).not.toThrow();
      }
    }
  });

  it('site.config quotes it', () => {
    expect(siteConfig.description).toContain(`${COUNT} designed components`);
  });

  it('the English dictionary quotes it', () => {
    expect(JSON.stringify(en)).toContain(`${COUNT} designed components`);
  });

  it('no file anywhere quotes a count the registry cannot justify', () => {
    // Named files are not enough. The first sweep listed the files it thought
    // mattered and missed the Dutch dictionary, a homepage stat tile, the
    // project page, the post body, two README paragraphs, and the number
    // drawn on the post's cover image. So walk the tree instead.
    //
    // Any two-digit figure next to the word component has to be either the
    // total or one of the per-category counts — both taken from the registry,
    // so this keeps working when components are added.
    const byCategory: Record<string, number> = {};
    for (const entry of Object.values(registry.components)) {
      byCategory[entry.category] = (byCategory[entry.category] ?? 0) + 1;
    }
    const allowed = new Set<number>([COUNT, ...Object.values(byCategory)]);

    const roots = ['src', 'README.md', 'AGENTS.md'];
    const skip = /node_modules|\/dist\/|\.vercel|__tests__|CHANGELOG/;
    const exts = /\.(md|mdx|astro|ts|tsx|json|svg)$/;

    const files: string[] = [];
    const walk = (rel: string) => {
      const full = join(process.cwd(), rel);
      if (skip.test(full)) return;
      if (statSync(full).isDirectory()) {
        for (const e of readdirSync(full)) walk(join(rel, e));
      } else if (exts.test(rel)) files.push(rel);
    };
    for (const r of roots) walk(r);

    const claim =
      /\b(\d{2})\+?[\s-]+(?:designed,?\s+|production-ready\s+|ontworpen\s+|)(?:accessible,?\s+|)(?:UI\s+|)[Cc]omponent/g;

    const wrong: string[] = [];
    for (const f of files) {
      for (const m of readFileSync(join(process.cwd(), f), 'utf8').matchAll(claim)) {
        if (!allowed.has(Number(m[1]))) wrong.push(`${f}: "${m[0].trim()}"`);
      }
    }
    expect(wrong, `not a total (${COUNT}) or a category count`).toEqual([]);
  });

  it('the showcase page and its post quote it', () => {
    expect(read('src/pages/components.astro')).toContain(`${COUNT} production components`);
    expect(read('src/content/blog/en/component-library.mdx')).toContain(`${COUNT} Components Ready to Use`);
  });

  it('the README quotes it, and its category breakdown adds up', () => {
    const readme = read('README.md');
    expect(readme).toContain(`**${COUNT} Components**`);

    // Second table cell only — the first holds the total, which would be
    // counted as part of its own breakdown.
    const row = readme.split('\n').find((l) => l.includes(`**${COUNT} Components**`)) ?? '';
    const breakdown = row.split('|')[2] ?? '';
    const parts = [...breakdown.matchAll(/(\d+)\s+[A-Za-z]/g)].map((m) => Number(m[1]));
    expect(parts.length, 'no category counts found in the README row').toBeGreaterThan(0);
    expect(parts.reduce((a, b) => a + b, 0)).toBe(COUNT);
  });

  /*
     The row above was already guarded, and the section that LISTS the
     components drifted anyway: its headings said 31 UI and 8 patterns
     against the registry's 34 and 7, its category table gave layout as 6,
     and it added up to 58 four lines after the page said 44. A count is
     only guarded where it is written down.
  */
  it('the README section headings match the registry', () => {
    const readme = read('README.md');
    const byCategory = (c: string) =>
      Object.values(registry.components).filter((e) => e.category === c).length;

    for (const [heading, category] of [
      ['UI Components', 'ui'],
      ['Pattern Components', 'patterns'],
    ] as const) {
      const m = readme.match(new RegExp(`### ${heading} \\((\\d+)\\)`));
      expect(m, `no "### ${heading} (n)" heading in the README`).not.toBeNull();
      expect(Number(m![1]), `${heading} heading`).toBe(byCategory(category));
    }

    for (const [label, category] of [
      ['Layout', 'layout'],
      ['Hero', 'hero'],
    ] as const) {
      const row = readme.split('\n').find((l) => l.startsWith(`| ${label} |`)) ?? '';
      expect(row, `no "${label}" row in the category table`).not.toBe('');
      expect(Number(row.split('|')[2].trim()), `${label} row`).toBe(byCategory(category));
    }
  });

  it('the README lists every component the registry counts', () => {
    const readme = read('README.md');
    // The ui and patterns tables give a component a row of its own; the two
    // layout components and the hero are named inside the category table's
    // last cell instead. Both count as listed.
    const section = readme.slice(readme.indexOf('## Components')).split('\n## ')[0];
    const missing = Object.values(registry.components)
      .map((entry) => entry.name)
      .filter(
        (name) =>
          !new RegExp(`^\\| ${name} \\|`, 'm').test(section) &&
          !new RegExp(`^\\| (Layout|Hero) \\|.*\\b${name}\\b`, 'm').test(section),
      );
    expect(missing, 'in the registry but not listed in the README').toEqual([]);
  });
});
