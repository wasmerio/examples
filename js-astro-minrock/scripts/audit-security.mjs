import fs from 'node:fs';
import path from 'node:path';

/**
 * DevSecOps Sentinel security auditor for source files, compiled dist/ assets,
 * Cloudflare edge headers in public/_headers, and lockfile integrity.
 */
function walk(dir, exts = ['.astro', '.ts', '.js', '.mjs', '.md', '.json']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  for (const file of fs.readdirSync(dir)) {
    if (file === 'node_modules' || file === '.git' || file === '.astro' || file === '.obsidian') continue;
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(walk(full, exts));
    } else if (exts.some(ext => file.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

const srcFiles = walk('src');
const distFiles = walk('dist', ['.html', '.js']);
const distHtmlFiles = distFiles.filter(f => f.endsWith('.html'));
const distJsFiles = distFiles.filter(f => f.endsWith('.js'));

console.log(`Auditing source (${srcFiles.length} files), compiled (${distFiles.length} files), and edge headers for DevSecOps Sentinel compliance...\n`);

const findings = [];

const secretPatterns = [
  { name: 'Private Key', regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: 'GitHub Personal Token', regex: /ghp_[0-9a-zA-Z]{36}/ },
  { name: 'Google API Key', regex: /AIzaSy[0-9a-zA-Z_-]{33}/ },
  { name: 'OpenAI API Key', regex: /sk-[a-zA-Z0-9]{20,}/ },
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/ },
  { name: 'Generic Password String', regex: /(api_key|secret_key|password)\s*[:=]\s*["'][^"']{8,}["']/i },
  { name: 'Local OS Path Leak', regex: /(?:C:\\Users\\|\/Users\/[A-Za-z0-9._-]+|\/home\/[A-Za-z0-9._-]+)/i },
];

// 1. Secret Scanning across src/ and compiled dist/
for (const file of [...srcFiles, ...distFiles]) {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');

  for (const pat of secretPatterns) {
    const match = content.match(pat.regex);
    if (!match) continue;
    if (/\$\{?[A-Z0-9_]+\}?/.test(match[0]) || /<[a-zA-Z0-9_-]+>/.test(match[0]) || /example|dummy|placeholder/i.test(match[0])) {
      continue;
    }
    const redacted = `${match[0].slice(0, 4)}${'*'.repeat(Math.max(match[0].length - 4, 0))}`;
    findings.push({ severity: 'HIGH', category: 'Secret Leak', file: rel, detail: `Pattern ${pat.name} matched (redacted): "${redacted}"` });
  }
}

// 2. OWASP Static Audit in compiled HTML
for (const file of distHtmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');

  // Mixed Content in subresources (img/script/iframe/form/stylesheet links)
  const insecureSrc = content.match(/\b(?:src|action)=["']http:\/\/[^"']+["']/gi) || [];
  const insecureLink = content.match(/<link\b[^>]*\bhref=["']http:\/\/[^"']+["'][^>]*>/gi) || [];
  for (const m of [...insecureSrc, ...insecureLink]) {
    findings.push({ severity: 'MEDIUM', category: 'Mixed Content (OWASP)', file: rel, detail: `Insecure HTTP resource loaded: ${m.slice(0, 90)}` });
  }

  // javascript: URI sinks in attributes
  const jsLinks = content.match(/\b(?:href|src|action|data-card-link)=["']\s*javascript:[^"']*["']/gi) || [];
  for (const m of jsLinks) {
    findings.push({ severity: 'HIGH', category: 'XSS URI Sink (OWASP)', file: rel, detail: `Unsafe javascript: attribute detected: ${m.slice(0, 90)}` });
  }

  // target="_blank" without rel="noopener" or "noreferrer"
  const blankLinks = content.match(/<a\b[^>]*target=["']_blank["'][^>]*>/gi) || [];
  for (const link of blankLinks) {
    if (!/\brel=["'][^"']*\b(?:noopener|noreferrer)\b[^"']*["']/i.test(link)) {
      findings.push({ severity: 'LOW', category: 'Reverse Tabnabbing (OWASP)', file: rel, detail: `target="_blank" without rel="noopener noreferrer": ${link.slice(0, 80)}` });
    }
  }
}

// 3. Compiled JS Bundle Audit (dist/_astro/*.js & static scripts)
for (const file of distJsFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');

  if (/\beval\s*\(|\bnew\s+Function\s*\(/.test(content)) {
    findings.push({ severity: 'HIGH', category: 'Dynamic Code Execution (OWASP)', file: rel, detail: 'Unsafe eval() or new Function() call detected in compiled JS.' });
  }
  const httpFetch = content.match(/\bfetch\s*\(\s*["']http:\/\/[^"']+["']/gi) || [];
  for (const m of httpFetch) {
    findings.push({ severity: 'MEDIUM', category: 'Insecure Fetch (OWASP)', file: rel, detail: `Plain HTTP fetch() call in compiled JS: ${m.slice(0, 80)}` });
  }
}

// 4. Cloudflare Edge Headers Hygiene (public/_headers)
const headersPath = 'public/_headers';
if (!fs.existsSync(headersPath)) {
  findings.push({ severity: 'HIGH', category: 'Edge Headers', file: headersPath, detail: 'Missing public/_headers security policy file.' });
} else {
  const headersRaw = fs.readFileSync(headersPath, 'utf8');
  const requiredHeaders = [
    'X-Frame-Options:',
    'X-Content-Type-Options: nosniff',
    'Referrer-Policy:',
    'Strict-Transport-Security:',
    'Cross-Origin-Opener-Policy:',
    'Content-Security-Policy:',
  ];
  for (const hdr of requiredHeaders) {
    if (!headersRaw.includes(hdr)) {
      findings.push({ severity: 'MEDIUM', category: 'Edge Headers', file: headersPath, detail: `Missing required header directive "${hdr}".` });
    }
  }

  const cspMatch = headersRaw.match(/Content-Security-Policy:\s*([^\r\n]+)/i);
  if (cspMatch) {
    const csp = cspMatch[1];
    const connectMatch = csp.match(/connect-src\s+([^;]+)/i);
    if (connectMatch) {
      const allowedConnectOrigins = new Set([
        "'self'",
        'https://*.workers.dev',
        'https://api.github.com',
        'https://translate.googleapis.com',
        'https://translate-pa.googleapis.com',
        'https://translate.google.com',
        'https://api.mymemory.translated.net',
      ]);
      for (const token of connectMatch[1].trim().split(/\s+/)) {
        if (!allowedConnectOrigins.has(token)) {
          findings.push({ severity: 'HIGH', category: 'CSP Unexpected Origin', file: headersPath, detail: `Unexpected connect-src origin in public template headers: ${token}` });
        }
      }
    }
    if (csp.includes("'unsafe-eval'")) {
      findings.push({ severity: 'MEDIUM', category: 'CSP Weakening', file: headersPath, detail: "CSP allows 'unsafe-eval'." });
    }
    if (/http:\/\//i.test(csp)) {
      findings.push({ severity: 'HIGH', category: 'CSP Mixed Origin', file: headersPath, detail: 'CSP contains plaintext http:// origin.' });
    }
    if (!csp.includes("object-src 'none'") || !csp.includes("frame-ancestors 'none'")) {
      findings.push({ severity: 'MEDIUM', category: 'CSP Hardening', file: headersPath, detail: "CSP should restrict object-src 'none' and frame-ancestors 'none'." });
    }
  }
}

// 5. Lockfile & Dependency Version Hygiene
if (fs.existsSync('package.json') && fs.existsSync('package-lock.json')) {
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
    if (pkg.version && lock.version && pkg.version !== lock.version) {
      findings.push({
        severity: 'HIGH',
        category: 'Lockfile Desync',
        file: 'package-lock.json',
        detail: `package.json version (${pkg.version}) does not match package-lock.json version (${lock.version}). Run "npm install" to synchronize.`,
      });
    }
  } catch (err) {
    findings.push({ severity: 'MEDIUM', category: 'Parse Error', file: 'package.json', detail: `Could not parse package.json / package-lock.json: ${err.message}` });
  }
}

console.log('=============================================');
console.log('       DEVSECOPS SENTINEL AUDIT REPORT       ');
console.log('=============================================');
console.log(`Source Files Checked:   ${srcFiles.length}`);
console.log(`Compiled Files Checked: ${distFiles.length}`);
console.log(`Security Findings:      ${findings.length}`);
console.log('=============================================\n');

if (findings.length > 0) {
  console.log('Findings:');
  findings.forEach((f, idx) => {
    console.log(`[${idx + 1}] [${f.severity}] [${f.category}] in ${f.file}:`);
    console.log(`    ${f.detail}`);
  });
  process.exitCode = 1;
} else {
  console.log('🎉 100% SECURE: Zero credential leaks, zero mixed content, zero unsafe sinks, and strict edge headers verified!');
}
