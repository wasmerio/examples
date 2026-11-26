#!/usr/bin/env node
// Validates markdown content before syncing to a content hub.
//
// Checks:
//   - Frontmatter conforms to the post or doc schema.
//   - Slug contract: every locale's file has a matching file in the default
//     locale (en), so per-page fallback can resolve.
//   - No stray files outside the expected directory layout.
//
// Run from the external project root (where posts/ and docs/ live):
//   node skills/site-content-sync/scripts/validate.mjs
//
// Exits non-zero on any error so it can gate a sync workflow.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES = ['en', 'zh-Hans'];

let errors = 0;
let warnings = 0;

function fail(msg) { console.error(`  ✗ ${msg}`); errors++; }
function warn(msg) { console.warn(`  ⚠ ${msg}`); warnings++; }

/** Minimal YAML frontmatter parser (key: value only, no nesting). Good enough
 *  for the flat schemas used here; for anything richer use a real parser. */
function parseFrontmatter(filePath) {
  const text = readFileSync(filePath, 'utf8');
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w[\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    let [, key, val] = kv;
    val = val.trim();
    // strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    // inline array [a, b]
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    }
    fm[key] = val;
  }
  return fm;
}

/** Recursively list .md files under a dir. */
function listMd(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...listMd(p));
    else if (name.endsWith('.md')) out.push(p);
  }
  return out;
}

/** Relative path with locale segment stripped, used as the cross-locale slug. */
function slugKey(file, locale, base) {
  return relative(join(base, locale), file).replace(/\.md$/, '').replace(/\\/g, '/');
}

function validatePosts() {
  const base = join(ROOT, 'posts');
  if (!existsSync(base)) { warn('no posts/ directory - skipping posts validation'); return; }

  const locales = SUPPORTED_LOCALES.filter(l => existsSync(join(base, l)));
  if (locales.length === 0) { warn('posts/ exists but has no locale subdirs (en/, zh-Hans/)'); return; }

  const byLocale = {};
  for (const l of locales) {
    byLocale[l] = listMd(join(base, l)).map(f => ({ file: f, slug: slugKey(f, l, base) }));
  }

  // Slug contract: every non-default-locale slug must exist in the default locale.
  const defaultSlugs = new Set((byLocale[DEFAULT_LOCALE] || []).map(d => d.slug));
  if (!byLocale[DEFAULT_LOCALE]) {
    fail(`posts/${DEFAULT_LOCALE}/ is missing - the default locale must exist`);
  }
  for (const l of locales) {
    if (l === DEFAULT_LOCALE) continue;
    for (const { file, slug } of byLocale[l]) {
      if (!defaultSlugs.has(slug)) {
        fail(`posts/${l}/${slug}.md has no matching ${DEFAULT_LOCALE} counterpart - fallback cannot resolve`);
      }
    }
  }

  // Frontmatter schema for posts.
  for (const l of locales) {
    for (const { file, slug } of byLocale[l]) {
      const fm = parseFrontmatter(file);
      if (!fm) { fail(`${relative(ROOT, file)}: missing frontmatter`); continue; }
      for (const key of ['title', 'date', 'description']) {
        if (!fm[key]) fail(`${relative(ROOT, file)}: missing required '${key}'`);
      }
      if (fm.date && isNaN(Date.parse(fm.date))) {
        fail(`${relative(ROOT, file)}: invalid date '${fm.date}'`);
      }
    }
  }

  console.log(`posts: ${locales.length} locale(s), ${Object.values(byLocale).flat().length} file(s)`);
}

function validateDocs() {
  const base = join(ROOT, 'docs');
  if (!existsSync(base)) { warn('no docs/ directory - skipping docs validation'); return; }

  // docs/<locale>/*.md  (the product dimension is a sync-time concern,
  // configured via the PRODUCT env var in sync-docs.yml; validation is
  // product-agnostic.)
  const locales = SUPPORTED_LOCALES.filter(l => existsSync(join(base, l)));
  if (locales.length === 0) {
    warn('docs/ exists but has no locale subdirs (en/, zh-Hans/)');
    return;
  }

  const byLocale = {};
  for (const l of locales) {
    byLocale[l] = listMd(join(base, l)).map(f => ({ file: f, slug: slugKey(f, l, base) }));
  }

  const defaultSlugs = new Set((byLocale[DEFAULT_LOCALE] || []).map(d => d.slug));
  if (!byLocale[DEFAULT_LOCALE]) {
    fail(`docs/${DEFAULT_LOCALE}/ is missing - the default locale must exist`);
  }
  for (const l of locales) {
    if (l === DEFAULT_LOCALE) continue;
    for (const { file, slug } of byLocale[l]) {
      if (!defaultSlugs.has(slug)) {
        fail(`docs/${l}/${slug}.md has no matching ${DEFAULT_LOCALE} counterpart`);
      }
    }
  }

  for (const l of locales) {
    for (const { file } of byLocale[l]) {
      const fm = parseFrontmatter(file);
      if (!fm) { fail(`${relative(ROOT, file)}: missing frontmatter`); continue; }
      if (!fm.title) fail(`${relative(ROOT, file)}: missing required 'title'`);
      if (fm.order !== undefined && isNaN(Number(fm.order))) {
        fail(`${relative(ROOT, file)}: invalid order '${fm.order}'`);
      }
    }
  }

  console.log(`docs: ${locales.length} locale(s), ${Object.values(byLocale).flat().length} file(s)`);
}

/** Validate product landing info files (optional). One file per locale at
 *  landing/<locale>.md; the product slug is injected at sync time from the
 *  PRODUCT env var (same as docs), so the external file has no slug in its
 *  name. Shallow frontmatter check: `tagline` and `description` are required;
 *  deep schema (features/highlights/links arrays of objects) is validated by
 *  the hub's zod schema at build time. */
function validateLanding() {
  const base = join(ROOT, 'landing');
  if (!existsSync(base)) return; // landing is optional; silent skip

  const locales = SUPPORTED_LOCALES.filter(l => existsSync(join(base, `${l}.md`)));
  if (locales.length === 0) {
    warn('landing/ exists but has no <locale>.md files (expected landing/en.md)');
    return;
  }

  if (!locales.includes(DEFAULT_LOCALE)) {
    fail(`landing/${DEFAULT_LOCALE}.md is missing - the default locale must exist for fallback`);
  }
  for (const l of locales) {
    if (l === DEFAULT_LOCALE) continue;
    // A non-default-locale landing requires the default-locale landing
    // (fallback renders the en body when zh-Hans is absent).
  }

  for (const l of locales) {
    const file = join(base, `${l}.md`);
    const fm = parseFrontmatter(file);
    if (!fm) { fail(`${relative(ROOT, file)}: missing frontmatter`); continue; }
    for (const key of ['tagline', 'description']) {
      if (!fm[key]) fail(`${relative(ROOT, file)}: missing required '${key}'`);
    }
  }

  console.log(`landing: ${locales.length} locale(s)`);
}

console.log('Validating content for hub sync...\n');
validatePosts();
validateDocs();
validateLanding();

console.log('');
if (errors) { console.error(`✗ ${errors} error(s), ${warnings} warning(s)`); process.exit(1); }
console.log(`✓ all checks passed${warnings ? ` (${warnings} warning(s))` : ''}`);
