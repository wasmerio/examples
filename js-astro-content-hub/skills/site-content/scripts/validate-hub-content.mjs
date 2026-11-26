#!/usr/bin/env node
/**
 * validate-hub-content.mjs - cross-file content validation gate.
 *
 * The hub's zod schemas validate single files; this checker covers rules that
 * span files, which zod cannot express. It is the pre-commit gate for content
 * providers (it lives with the authoring skill at skills/site-content/) and
 * runs in CI before `npm run build` (see .github/workflows/deploy.yml).
 *
 * Error vs warning (owner decision):
 *   - errors   exit non-zero: issues that would break or corrupt the build
 *     (duplicate slugs - a nested-dir collision like `foo.md` + `foo/index.md`
 *     does not hard-fail Astro but silently drops one page, so we catch it here).
 *   - warnings exit 0: issues that do not affect the build (slug parity,
 *     missing index.md, product-info for an unregistered product, drafts).
 *
 * Stdlib only - no dependencies. Reads the source-of-truth registries
 * (locales from src/lib/i18n.ts, products from the root site.config.ts) and
 * walks the content directories (src/content/ plus any product `base`
 * override, e.g. ./docs for the hub's own docs).
 *
 * Output per issue follows `file -> field -> offending value -> fix hint`.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DEFAULT_ROOT = fileURLToPath(new URL('../../..', import.meta.url));

/** Parse frontmatter (between the first `---` pair) into a plain object.
 *  Minimal YAML-subset parser - enough for the `sections` list (Phase 1) and
 *  existing scalar fields. Handles: scalars, quoted scalars, and `- type: x`
 *  list items under `sections:`. Returns {} when no frontmatter. */
function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const body = m[1];
  const out = {};
  let currentKey = null;
  for (const rawLine of body.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('- ')) {
      // List item under the current key (e.g. `sections:`).
      if (currentKey && Array.isArray(out[currentKey])) {
        out[currentKey].push(line.slice(2).trim());
      }
      continue;
    }
    const kv = line.match(/^([\w-]+)\s*:\s*(.*)$/);
    if (!kv) continue;
    currentKey = kv[1];
    const val = kv[2].trim();
    if (val === '' || val === '|' || val === '>') {
      out[currentKey] = []; // block or list starts on following lines
    } else if (/^['"]/.test(val)) {
      out[currentKey] = val.slice(1, -1);
    } else if (val === 'true') {
      out[currentKey] = true;
    } else if (val === 'false') {
      out[currentKey] = false;
    } else if (/^-?\d+$/.test(val)) {
      out[currentKey] = Number(val);
    } else {
      out[currentKey] = val;
    }
  }
  return out;
}

/** Section types declared in a product-info file's `sections` frontmatter.
 *  Items are `- type: <name>` lines; unknown shapes are skipped. */
export function sectionTypesOf(filePath) {
  const text = readFileSync(filePath, 'utf8');
  const fm = parseFrontmatter(text);
  const list = fm.sections;
  if (!Array.isArray(list)) return [];
  const types = [];
  for (const item of list) {
    const t = typeof item === 'string' ? item.match(/^type\s*:\s*(\S+)/)?.[1] : null;
    if (t) types.push(t);
  }
  return types;
}


// ---------------------------------------------------------------------------
// Source-of-truth registries (parsed, not imported - this is plain Node).
// ---------------------------------------------------------------------------

/** Parse `locales` and `defaultLocale` from src/lib/i18n.ts. */
function parseLocales(root) {
  const src = readFileSync(join(root, 'src/lib/i18n.ts'), 'utf8');
  const listMatch = src.match(/export\s+const\s+locales\s*=\s*\[([^\]]*)\]/);
  const locales = listMatch
    ? listMatch[1]
        .split(',')
        .map((s) => s.trim().replace(/^'|'$/g, ''))
        .filter(Boolean)
    : [];
  const defMatch = src.match(/defaultLocale:\s*Locale\s*=\s*'([^']+)'/);
  const defaultLocale = defMatch ? defMatch[1] : 'en';
  return { locales, defaultLocale };
}

/** Parse `products` (slug + optional base) from the root site.config.ts.
 *  Products are object blocks whose `slug` is a single-quoted literal; `base`
 *  may sit on a later line of the same block, so scan until the closing brace. */
function parseProducts(root) {
  const src = readFileSync(join(root, 'site.config.ts'), 'utf8');
  const products = [];
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const slug = lines[i].match(/slug:\s*'([^']+)'/);
    if (!slug) continue;
    let base = null;
    for (let j = i; j < lines.length && !lines[j].includes('}'); j++) {
      const m = lines[j].match(/base:\s*'([^']+)'/);
      if (m) {
        base = m[1];
        break;
      }
    }
    products.push({ slug: slug[1], base });
  }
  return products;
}

// ---------------------------------------------------------------------------
// File walkers.
// ---------------------------------------------------------------------------

/** Recursively list files under `dir` with one of `exts`; empty when absent. */
function walk(dir, exts, out = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out; // collection base not created yet -> no files
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, exts, out);
    else if (exts.some((e) => entry.name.endsWith(e))) out.push(full);
  }
  return out;
}

/** Collection id: path relative to the collection base, extension stripped
 *  (mirrors the glob loader, e.g. en/getting-started.md -> 'getting-started'). */
function toId(filePath, baseDir) {
  return relative(baseDir, filePath).split(sep).join('/').replace(/\.(md|mdx|html)$/i, '');
}

/** True when the file's frontmatter sets `draft: true`. */
function isDraft(filePath) {
  const text = readFileSync(filePath, 'utf8');
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return false;
  return /(^|\n)\s*draft\s*:\s*true\s*(\n|$)/.test(m[1]);
}

/**
 * Run every cross-file validation rule against a hub root.
 *
 * Pure (no process.exit / console) so the test suite can point it at a temp
 * fixture directory and assert on the collected issues; the CLI wrapper below
 * wires it to the real repo root and renders the report.
 *
 * Returns { issues, counts } where issues is { error: string[][], warning:
 * string[][], info: string[][] } - each issue is the array of report lines
 * (first line is the headline).
 */
export function runValidation(root) {
  const ROOT = root ?? DEFAULT_ROOT;
  const rel = (p) => relative(ROOT, p).split(sep).join('/');

  const issues = { error: [], warning: [], info: [] };
  const add = (level, lines) => issues[level].push(lines);

  const { locales, defaultLocale } = parseLocales(ROOT);
  const products = parseProducts(ROOT);

  /** Collect every file per collection: posts, docs (per product), product-info. */
  function collect() {
    const posts = {}; // locale -> [{ path, id, draft }]
    const docs = {}; // productSlug -> locale -> [{ path, id }]
    const productInfos = {}; // locale -> [{ path, id }]

    for (const locale of locales) {
      const postsBase = join(ROOT, 'src/content/posts', locale);
      posts[locale] = walk(postsBase, ['.md', '.mdx', '.html']).map((p) => ({
        path: p,
        id: toId(p, postsBase),
        draft: isDraft(p),
      }));

      const piBase = join(ROOT, 'src/content/product-info', locale);
      productInfos[locale] = walk(piBase, ['.md']).map((p) => ({
        path: p,
        id: toId(p, piBase),
      }));
    }

    for (const product of products) {
      const baseDir = product.base
        ? join(ROOT, product.base)
        : join(ROOT, 'src/content/docs', product.slug);
      docs[product.slug] = {};
      for (const locale of locales) {
        const localeDir = join(baseDir, locale);
        docs[product.slug][locale] = walk(localeDir, ['.md']).map((p) => ({
          path: p,
          id: toId(p, localeDir),
        }));
      }
    }

    return { posts, docs, productInfos };
  }

  const { posts, docs, productInfos } = collect();

  // ---------------------------------------------------------------------------
  // Checks.
  // ---------------------------------------------------------------------------

  /** Duplicate slugs within one collection + locale (errors). Nested-dir
   *  collisions normalize away a trailing '/index' so `foo.md` and
   *  `foo/index.md` are flagged together - the site builds either way, but one
   *  page silently wins, so this is caught as a hard error. */
  function checkDuplicates(label, files) {
    const byRoute = new Map();
    for (const f of files) {
      const key = f.id.replace(/\/index$/, '');
      if (!byRoute.has(key)) byRoute.set(key, []);
      byRoute.get(key).push(f);
    }
    for (const [key, group] of byRoute) {
      if (group.length < 2) continue;
      add('error', [
        `${label}: duplicate slug '${key}' - ${group.length} files map to the same page`,
        ...group.map((f) => `  ${rel(f.path)} -> slug -> '${f.id}'`),
        `  fix: rename or delete one file so every markdown file resolves to a unique URL.`,
      ]);
    }
  }

  /** Slug parity (warnings): a non-default-locale slug with no default-locale
   *  counterpart breaks the fallback chain - the default-locale route is simply
   *  absent. The build still passes. */
  function checkParity(label, defaultFiles, localeFiles, locale) {
    const defaultIds = new Set(defaultFiles.map((f) => f.id));
    for (const f of localeFiles) {
      if (defaultIds.has(f.id)) continue;
      add('warning', [
        `${label}: slug '${f.id}' has no ${defaultLocale} counterpart (breaks fallback)`,
        `  ${rel(f.path)} -> slug -> '${f.id}'`,
        `  fix: create the ${defaultLocale} file at the same relative path so the default-locale`,
        `       site serves this page too (or remove it if it is ${locale}-only by design).`,
      ]);
    }
  }

  /** Missing docs index (warnings). Only when the locale has some docs but no
   *  index.md - the docs landing page is silently absent. `en` missing means no
   *  docs home at all (serious); a non-default locale missing it is the normal
   *  fallback case but still worth surfacing. */
  function checkMissingIndex(product, locale, files) {
    if (files.length === 0) return; // whole collection absent -> normal fallback
    if (files.some((f) => f.id === 'index')) return;
    const serious = locale === defaultLocale;
    add('warning', [
      `docs (${product.slug}, ${locale}): missing index.md - the docs landing page is absent`,
      `  base: ${rel(files[0].path).replace(/\/[^/]+$/, '')}/`,
      serious
        ? `  fix: add index.md so /${product.slug}/docs/ has a landing page (today there is no docs home at all).`
        : `  fix: add index.md to stop falling back to the ${defaultLocale} index, or leave it as the normal untranslated-collection fallback.`,
    ]);
  }

  /** Product-info files whose slug is not a registered product (warnings):
   *  they render nothing. */
  function checkUnknownProductInfo(locale, files, knownSlugs) {
    for (const f of files) {
      if (knownSlugs.has(f.id)) continue;
      add('warning', [
        `product-info (${locale}): slug '${f.id}' is not a registered product - this file renders nothing`,
        `  ${rel(f.path)} -> slug -> '${f.id}'`,
        `  fix: rename it to a product slug from site.config.ts, or register the product,`,
        `       or delete the file.`,
      ]);
    }
  }

  /** Section types declared in a product-info `sections` list with no registered
   *  component (warnings). The renderer skips unknown types, so the build stays
   *  green; this surfaces typos/missing sections at review time. */
  function checkUnknownSectionTypes(files, registered) {
    for (const f of files) {
      for (const type of sectionTypesOf(f.path)) {
        if (registered.has(type)) continue;
        add('warning', [
          `product-info (${f.id}): section type '${type}' has no registered component - this section renders nothing`,
          `  ${rel(f.path)} -> sections -> type -> '${type}'`,
          `  fix: add src/components/landing-sections/${type}.astro (it is picked up automatically), or`,
          `       fix the type name, or remove the section entry.`,
        ]);
      }
    }
  }

  // --- Run the checks ---------------------------------------------------------

  for (const locale of locales) {
    const published = (files) => files.filter((f) => !f.draft);

    // Posts
    checkDuplicates(`posts (${locale})`, posts[locale]);
    if (locale !== defaultLocale) {
      checkParity(`posts (${locale})`, published(posts[defaultLocale]), published(posts[locale]), locale);
    }
    for (const f of posts[locale]) {
      if (f.draft) {
        add('info', [
          `posts (${locale}): '${f.id}' is a draft - excluded from the build`,
          `  ${rel(f.path)} -> draft -> 'true'`,
        ]);
      }
    }

    // Docs (per product)
    for (const product of products) {
      checkDuplicates(`docs (${product.slug}, ${locale})`, docs[product.slug][locale]);
      if (locale !== defaultLocale) {
        checkParity(
          `docs (${product.slug}, ${locale})`,
          docs[product.slug][defaultLocale],
          docs[product.slug][locale],
          locale,
        );
      }
      checkMissingIndex(product, locale, docs[product.slug][locale]);
    }

    // Product-info
    checkDuplicates(`product-info (${locale})`, productInfos[locale]);
    if (locale !== defaultLocale) {
      checkParity(`product-info (${locale})`, productInfos[defaultLocale], productInfos[locale], locale);
    }
    checkUnknownProductInfo(locale, productInfos[locale], new Set(products.map((p) => p.slug)));
  }

  // Registered section types come from the TypeScript registry, but this script
  // is plain Node (no imports) - derive them from the landing-sections directory
  // so drift between the two is caught by this same gate.
  const sectionsBase = join(ROOT, 'src/components/landing-sections');
  const registeredSections = new Set(
    walk(sectionsBase, ['.astro']).map((p) => p.replace(/.*\/([^/]+)\.astro$/, '$1')),
  );
  for (const locale of locales) {
    checkUnknownSectionTypes(productInfos[locale], registeredSections);
  }

  return {
    issues,
    counts: { error: issues.error.length, warning: issues.warning.length, info: issues.info.length },
    summary: { locales, defaultLocale, products },
  };
}

// ---------------------------------------------------------------------------
// CLI entry (executed directly; skipped when imported by the test suite).
// ---------------------------------------------------------------------------

// Only run the CLI side-effects when this file is the main module. Under the
// test runner the file is imported, so `import.meta.url` won't match the entry
// point - runValidation() is called directly by the tests instead.
const isDirect = !process.argv[1] ||
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (!isDirect) {
  // Imported (e.g. by tests) - the caller uses runValidation() directly.
  process.exitCode = 0;
} else {
  const { issues, counts, summary } = runValidation(DEFAULT_ROOT);

  console.log(`Validating hub content (locales: ${summary.locales.join(', ') || '(none)'}, default: ${summary.defaultLocale}, products: ${summary.products.map((p) => p.slug).join(', ') || '(none)'})`);

  for (const level of ['error', 'warning', 'info']) {
    for (const lines of issues[level]) {
      console.log(`[${level}] ${lines[0]}`);
      for (const line of lines.slice(1)) console.log(line);
    }
  }

  console.log(`Summary: ${counts.error} error(s), ${counts.warning} warning(s), ${counts.info} info.`);
  if (counts.error > 0) {
    console.log('Errors found - fix them before building. (Warnings and info do not block.)');
    process.exit(1);
  }
  process.exit(0);
}
