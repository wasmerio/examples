import fs from 'node:fs';
import path from 'node:path';

/**
 * Google Search & SERP Indexability Auditor over dist/.
 * Exits with code 1 if critical crawlability artifacts or valid article schemas are missing.
 */
function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) results = results.concat(walk(full));
    else if (file.endsWith('.html')) results.push(full);
  }
  return results;
}

/** Extract all @type values from every application/ld+json script (including @graph). */
function inspectJsonLd(html) {
  const matches = Array.from(
    html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
  );
  if (matches.length === 0) return { types: [], invalid: false };

  const types = [];
  let invalid = false;

  for (const match of matches) {
    try {
      const parsed = JSON.parse(match[1]);
      const items = Array.isArray(parsed['@graph']) ? parsed['@graph'] : Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        if (!item || typeof item !== 'object') continue;
        if (Array.isArray(item['@type'])) {
          types.push(...item['@type'].map(String));
        } else if (item['@type']) {
          types.push(String(item['@type']));
        }
      }
    } catch {
      invalid = true;
    }
  }

  return { types: [...new Set(types)], invalid };
}

console.log('====================================================');
console.log('   🔍 GOOGLE SEARCH & SERP READINESS AUDIT          ');
console.log('====================================================\n');

// 1. Check robots.txt and sitemap-index / child sitemaps
console.log('1️⃣  CRAWLABILITY & DISCOVERY (Googlebot)');
const robotsPath = path.join('dist', 'robots.txt');
const publicRobotsPath = path.join('public', 'robots.txt');
const sitemapIndexPath = path.join('dist', 'sitemap-index.xml');

let crawlScore = 0;
if (fs.existsSync(robotsPath) || fs.existsSync(publicRobotsPath)) {
  const robotsContent = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, 'utf8') : fs.readFileSync(publicRobotsPath, 'utf8');
  console.log('  [PASS] robots.txt is present');
  if (robotsContent.includes('Sitemap:')) {
    console.log('  [PASS] robots.txt contains Sitemap directive');
    crawlScore += 50;
  } else {
    console.log('  [FAIL] robots.txt missing Sitemap reference');
  }
} else {
  console.log('  [FAIL] robots.txt not found');
}

let totalIndexedUrls = 0;
if (fs.existsSync(sitemapIndexPath)) {
  const indexContent = fs.readFileSync(sitemapIndexPath, 'utf8');
  const childLocs = Array.from(indexContent.matchAll(/<loc>([^<]+)<\/loc>/gi)).map(m => m[1].trim());
  for (const loc of childLocs) {
    const filename = path.basename(loc.replace(/\/+$/, ''));
    const childPath = path.join('dist', filename);
    if (fs.existsSync(childPath)) {
      const childXml = fs.readFileSync(childPath, 'utf8');
      totalIndexedUrls += (childXml.match(/<loc>/g) || []).length;
    }
  }
  if (totalIndexedUrls > 0) {
    console.log(`  [PASS] sitemap-index.xml resolved (${childLocs.length} sitemap file(s), ${totalIndexedUrls} indexed URLs)`);
    crawlScore += 50;
  } else {
    console.log('  [FAIL] sitemap-index.xml resolved 0 URLs');
  }
} else {
  console.log('  [FAIL] dist/sitemap-index.xml not found (run astro build)');
}

console.log(`  Crawlability Health: ${crawlScore}%\n`);

// 2. Audit ALL blog articles for SERP snippets & Schema.org structured data
console.log('2️⃣  SERP SNIPPET & STRUCTURED DATA (Google Rich Results)');
const htmlFiles = walk('dist');
const blogPosts = htmlFiles.filter(file => {
  const rel = path.relative('dist', file).replace(/\\/g, '/');
  return /^blog\/[^/]+\/index\.html$/.test(rel);
});

console.log(`Auditing all ${blogPosts.length} blog post articles for Google Search Display:\n`);

const articleTypes = new Set(['BlogPosting', 'Article', 'TechArticle']);
const fatalErrors = [];
const warnings = [];
let schemaPasses = 0;

blogPosts.forEach((file, idx) => {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative('dist', file).replace(/\\/g, '/');

  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'N/A';
  const titleLen = title.length;
  const titleOk = titleLen >= 20 && titleLen <= 75;

  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=(?:"([^"]*)"|'([^']*)')/i);
  const desc = (descMatch?.[1] ?? descMatch?.[2] ?? 'N/A').trim();
  const descLen = desc.length;
  const descOk = descLen >= 60 && descLen <= 180;

  const canonMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  const canonical = canonMatch ? canonMatch[1].trim() : 'N/A';

  const { types, invalid } = inspectJsonLd(content);
  const hasArticleSchema = !invalid && types.some(t => articleTypes.has(t));
  const schemaLabel = invalid ? 'Invalid JSON' : types.length > 0 ? types.join(', ') : 'None';

  if (hasArticleSchema) {
    schemaPasses++;
  } else {
    fatalErrors.push(`/${rel}: missing valid Article/TechArticle JSON-LD (found: ${schemaLabel})`);
  }
  if (canonical === 'N/A') {
    fatalErrors.push(`/${rel}: missing <link rel="canonical">`);
  }
  if (!titleOk) {
    warnings.push(`/${rel}: title length ${titleLen} chars outside recommended 20-75 range`);
  }
  if (!descOk) {
    warnings.push(`/${rel}: description length ${descLen} chars outside recommended 60-180 range`);
  }

  console.log('----------------------------------------------------');
  console.log(`📄 Article [${idx + 1}]: /${rel}`);
  console.log(`🌐 Google Title (${titleLen} chars): "${title}" ${titleOk ? '✅' : '⚠️'}`);
  console.log(`📝 Google Description (${descLen} chars): "${desc.slice(0, 80)}..." ${descOk ? '✅' : '⚠️'}`);
  console.log(`🔗 Canonical: ${canonical}`);
  console.log(`🏷️  Schema.org Structured Data: ${schemaLabel} ${hasArticleSchema ? '✅ (Eligible for Google Rich Cards)' : '❌'}`);
});

console.log('\n====================================================');
console.log('           GOOGLE AUDIT SUMMARY                     ');
console.log('====================================================');
console.log(`Googlebot Crawlability:    ${crawlScore === 100 ? `✅ 100% (${totalIndexedUrls} URLs via Sitemap)` : '❌ Check config'}`);
console.log(`Google Schema.org Cards:   ${schemaPasses}/${blogPosts.length} articles with Valid Article Schema`);
console.log(`SERP Length Warnings:      ${warnings.length}`);
console.log('====================================================\n');

if (warnings.length > 0) {
  console.log('Editorial SERP Warnings (non-blocking):');
  warnings.forEach(w => console.log(`  ⚠️ ${w}`));
  console.log('');
}

if (crawlScore < 100 || blogPosts.length === 0 || fatalErrors.length > 0) {
  console.log('SEO Blocking Errors:');
  fatalErrors.forEach(e => console.log(`  ❌ ${e}`));
  process.exitCode = 1;
}
