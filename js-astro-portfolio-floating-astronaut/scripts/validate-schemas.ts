#!/usr/bin/env -S node --experimental-strip-types
/**
 * Schema validator — walks every built HTML page in `dist/` and parses
 * each <script type="application/ld+json"> block. Fails the run on:
 *
 * - Invalid JSON (parse error)
 * - Missing @context or @type
 * - Required-field omissions on common types (Product/Offer needs price,
 *   FAQPage needs mainEntity, etc.)
 *
 * Designed to run after `astro build` in CI. Zero deps — pure Node.
 *
 * Usage:
 *   npm run schemas:validate          # validates everything in dist/
 *   npm run schemas:validate path/to  # validates a subtree
 */

import fs from 'node:fs';
import path from 'node:path';

const DIST = process.argv[2] ?? path.join(process.cwd(), 'dist');

interface Issue {
  file: string;
  type: string | null;
  message: string;
}

function* walkHtml(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkHtml(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) yield full;
  }
}

const LDJSON_RE = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

// Per-@type required-field map. Keep this list small and canonical —
// we want signal not noise. Add types as we ship new schemas.
const REQUIRED: Record<string, string[]> = {
  Organization: ['name', 'url'],
  WebSite: ['name', 'url'],
  WebPage: ['name', 'url'],
  Article: ['headline', 'datePublished'],
  BlogPosting: ['headline', 'datePublished', 'author'],
  FAQPage: ['mainEntity'],
  Question: ['name', 'acceptedAnswer'],
  Answer: ['text'],
  HowTo: ['name', 'step'],
  HowToStep: ['name', 'text'],
  Product: ['name', 'offers'],
  Offer: ['price', 'priceCurrency'],
  SoftwareApplication: ['name', 'applicationCategory'],
  WebApplication: ['name', 'applicationCategory'],
  BreadcrumbList: ['itemListElement'],
  ListItem: ['position', 'name'],
  DefinedTerm: ['name', 'description'],
  ContactPoint: ['contactType'],
};

function checkObject(obj: any, file: string, issues: Issue[], isTopLevel: boolean): void {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    for (const o of obj) checkObject(o, file, issues, isTopLevel);
    return;
  }
  const type = obj['@type'];
  // Required-field checks apply only to top-level schemas (the ones with
  // their own @context). Nested references — `publisher: { @type:
  // Organization, name: ... }` — are deliberately partial and should not
  // be flagged. Offer is a special case: even nested it needs price +
  // currency to be useful.
  const isOfferLike = type === 'Offer';
  if (typeof type === 'string' && REQUIRED[type] && (isTopLevel || isOfferLike)) {
    for (const field of REQUIRED[type]) {
      if (!(field in obj) || obj[field] === undefined || obj[field] === null || obj[field] === '') {
        issues.push({ file, type, message: `${type} missing required field "${field}"` });
      }
    }
  }
  for (const v of Object.values(obj)) {
    if (v && typeof v === 'object') checkObject(v, file, issues, false);
  }
}

function validateFile(file: string, issues: Issue[]): { blocks: number; types: Set<string> } {
  const html = fs.readFileSync(file, 'utf8');
  let m: RegExpExecArray | null;
  let blocks = 0;
  const types = new Set<string>();
  while ((m = LDJSON_RE.exec(html))) {
    blocks++;
    const raw = m[1].trim();
    if (!raw) {
      issues.push({ file, type: null, message: 'empty <script type="application/ld+json"> block' });
      continue;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      issues.push({ file, type: null, message: `JSON parse error: ${e instanceof Error ? e.message : String(e)}` });
      continue;
    }
    const top = Array.isArray(parsed) ? parsed : [parsed];
    for (const obj of top) {
      if (!obj || typeof obj !== 'object') {
        issues.push({ file, type: null, message: 'top-level JSON-LD is not an object' });
        continue;
      }
      const o = obj as Record<string, unknown>;
      if (!o['@context']) {
        issues.push({ file, type: typeof o['@type'] === 'string' ? o['@type'] as string : null, message: 'top-level JSON-LD missing @context' });
      }
      if (!o['@type']) {
        issues.push({ file, type: null, message: 'top-level JSON-LD missing @type' });
      } else if (typeof o['@type'] === 'string') {
        types.add(o['@type'] as string);
      }
      checkObject(o, file, issues, true);
    }
  }
  return { blocks, types };
}

function main(): void {
  if (!fs.existsSync(DIST)) {
    console.error(`No dist directory at ${DIST}. Run \`npm run build\` first.`);
    process.exit(1);
  }
  const issues: Issue[] = [];
  const allTypes = new Set<string>();
  let pageCount = 0;
  let blockCount = 0;
  for (const file of walkHtml(DIST)) {
    pageCount++;
    const { blocks, types } = validateFile(file, issues);
    blockCount += blocks;
    for (const t of types) allTypes.add(t);
  }

  console.log(`Pages scanned:    ${pageCount}`);
  console.log(`JSON-LD blocks:   ${blockCount}`);
  console.log(`@type values:     ${[...allTypes].sort().join(', ')}`);

  if (issues.length === 0) {
    console.log('\n✓ All JSON-LD valid.');
    return;
  }

  // Group issues by message for compact reporting.
  const byMessage = new Map<string, Set<string>>();
  for (const i of issues) {
    const key = `${i.type ?? '(no type)'} — ${i.message}`;
    if (!byMessage.has(key)) byMessage.set(key, new Set());
    byMessage.get(key)!.add(path.relative(DIST, i.file));
  }
  console.error(`\n✗ ${issues.length} issues across ${byMessage.size} distinct problems:\n`);
  for (const [msg, files] of byMessage) {
    console.error(`  ${msg}`);
    const sample = Array.from(files).slice(0, 3);
    for (const f of sample) console.error(`    └─ ${f}`);
    if (files.size > 3) console.error(`    └─ … +${files.size - 3} more`);
  }
  process.exit(1);
}

main();
