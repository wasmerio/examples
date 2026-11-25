import fs from 'node:fs';
import path from 'node:path';

/**
 * WCAG 2.1/2.2 AA accessibility and structural hygiene auditor over dist/.
 * Exits with code 1 if any violation or unresolved Astro asset is found.
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

/** Strip script, style, and comment blocks to prevent false positives in regex DOM checks. */
function stripNonDomBlocks(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
}

const htmlFiles = walk('dist');
console.log(`Auditing ${htmlFiles.length} HTML files in dist/ for WCAG 2.1/2.2 AA & SEO standards...`);

const issues = [];
const stats = {
  pagesAudited: htmlFiles.length,
  buttonsChecked: 0,
  linksChecked: 0,
  imagesChecked: 0,
  headingsChecked: 0,
};

for (const file of htmlFiles) {
  const rawContent = fs.readFileSync(file, 'utf8');
  const domHtml = stripNonDomBlocks(rawContent);
  const rel = path.relative('dist', file).replace(/\\/g, '/');

  // 1. Check html lang (WCAG 3.1.1)
  if (!/<html[^>]*\blang=["'][^"']+["']/i.test(domHtml)) {
    issues.push({ file: rel, type: 'WCAG 3.1.1 (Language of Page)', msg: 'Missing or empty <html lang="..."> attribute.' });
  }

  // 2. Check title (WCAG 2.4.2)
  const titleMatch = domHtml.match(/<title>([^<]*)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    issues.push({ file: rel, type: 'WCAG 2.4.2 (Page Titled)', msg: 'Missing or empty <title> element.' });
  }

  // 3. Check viewport (WCAG 1.4.4 Resize text)
  if (!/<meta[^>]*name=["']viewport["']/i.test(domHtml)) {
    issues.push({ file: rel, type: 'WCAG 1.4.4 (Resize text)', msg: 'Missing <meta name="viewport"> tag.' });
  }

  // 4. Check main landmark (WCAG 1.3.1 Info and Relationships)
  if (!/<main\b/i.test(domHtml)) {
    issues.push({ file: rel, type: 'WCAG 1.3.1 (Landmark Main)', msg: 'Missing <main> landmark element.' });
  }

  // 5. Check img resolution & alt attribute (WCAG 1.1.1 Non-text Content)
  const imgMatches = domHtml.match(/<img[^>]*>/gi) || [];
  for (const img of imgMatches) {
    stats.imagesChecked++;
    if (img.includes('__ASTRO_IMAGE_')) {
      issues.push({ file: rel, type: 'Astro Asset Resolution (Broken Image)', msg: `Unresolved __ASTRO_IMAGE_ attribute emitted in HTML: ${img.slice(0, 80)}` });
      continue;
    }
    if (!/\balt=["'][^"']*["']/i.test(img)) {
      issues.push({ file: rel, type: 'WCAG 1.1.1 (Non-text Content)', msg: `Image missing alt attribute: ${img.slice(0, 80)}` });
    }
  }

  // 6. Check buttons without accessible name (WCAG 4.1.2 Name, Role, Value)
  const btnMatches = domHtml.match(/<button\b[\s\S]*?<\/button>/gi) || [];
  for (const btn of btnMatches) {
    stats.buttonsChecked++;
    const hasAria = /\baria-label=["'][^"']+["']/i.test(btn) || /\baria-labelledby=["'][^"']+["']/i.test(btn);
    const hasTitle = /\btitle=["'][^"']+["']/i.test(btn);
    const hasImgAlt = /<img[^>]*\balt=["'][^"']+["']/i.test(btn);
    const innerText = btn.replace(/<[^>]+>/g, '').trim();
    if (!hasAria && !hasTitle && !hasImgAlt && !innerText) {
      issues.push({ file: rel, type: 'WCAG 4.1.2 (Name, Role, Value)', msg: `Button missing accessible name: ${btn.slice(0, 80)}` });
    }
  }

  // 7. Check links without accessible name (WCAG 2.4.4 Link Purpose)
  const linkMatches = domHtml.match(/<a\b[\s\S]*?<\/a>/gi) || [];
  for (const a of linkMatches) {
    stats.linksChecked++;
    const hasAria = /\baria-label=["'][^"']+["']/i.test(a) || /\baria-labelledby=["'][^"']+["']/i.test(a);
    const hasImgWithAlt = /<img[^>]*\balt=["'][^"']+["']/i.test(a);
    const innerText = a.replace(/<[^>]+>/g, '').trim();
    if (!hasAria && !hasImgWithAlt && !innerText) {
      issues.push({ file: rel, type: 'WCAG 2.4.4 (Link Purpose)', msg: `Link missing accessible text or aria-label: ${a.slice(0, 80)}` });
    }
  }

  // 8. Check heading hierarchy & unique H1 (WCAG 1.3.1)
  const headings = Array.from(domHtml.matchAll(/<h([1-6])\b[^>]*>/gi)).map(m => Number.parseInt(m[1], 10));
  stats.headingsChecked += headings.length;
  const h1Count = headings.filter(level => level === 1).length;
  if (h1Count !== 1) {
    issues.push({ file: rel, type: 'WCAG 1.3.1 (Single H1)', msg: `Expected exactly one <h1>, found ${h1Count}.` });
  }
  for (let i = 0; i < headings.length - 1; i++) {
    if (headings[i + 1] > headings[i] + 1) {
      issues.push({ file: rel, type: 'WCAG 1.3.1 (Heading Order)', msg: `Heading level skipped from h${headings[i]} to h${headings[i + 1]}. Headings should not skip levels.` });
      break;
    }
  }

  // 9. Check duplicate DOM IDs (WCAG 4.1.1 Parsing)
  const idMatches = Array.from(domHtml.matchAll(/\bid=["']([^"']+)["']/gi)).map(m => m[1]);
  const seenIds = new Set();
  for (const id of idMatches) {
    if (seenIds.has(id)) {
      issues.push({ file: rel, type: 'WCAG 4.1.1 (Unique IDs)', msg: `Duplicate DOM ID found: #${id}` });
    }
    seenIds.add(id);
  }
}

console.log('\n=============================================');
console.log('         WCAG & SEO AUDIT REPORT             ');
console.log('=============================================');
console.log(`Pages Audited:    ${stats.pagesAudited}`);
console.log(`Buttons Checked:  ${stats.buttonsChecked}`);
console.log(`Links Checked:    ${stats.linksChecked}`);
console.log(`Images Checked:   ${stats.imagesChecked}`);
console.log(`Headings Checked: ${stats.headingsChecked}`);
console.log(`Issues Found:     ${issues.length}`);
console.log('=============================================\n');

if (issues.length > 0) {
  console.log('Detected Findings:');
  issues.forEach((iss, idx) => {
    console.log(`[${idx + 1}] [${iss.type}] in ${iss.file}:`);
    console.log(`    ${iss.msg}`);
  });
  process.exitCode = 1;
} else {
  console.log('🎉 100% CLEAN: Zero WCAG or asset-resolution violations detected across all static routes!');
}
