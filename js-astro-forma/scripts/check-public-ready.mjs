import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ignoredNames = new Set(['.git', '.astro', 'node_modules', 'dist', 'release', 'audit-reports', '.docs']);
const ignoredFiles = new Set(['.env', '.env.local', '.env.production', 'check-public-ready.mjs']);
const scanExtensions = new Set(['.astro', '.css', '.html', '.js', '.json', '.md', '.mjs', '.ts', '.tsx', '.yml', '.yaml', '.svg', '.example']);
const findings = [];

const rules = [
  { label: 'private filesystem path', pattern: /(?:^|[^\w])(?:[A-Z]:[\\/]|\\\\[^\\/]+\\|\/Users\/|\/home\/)/i },
  { label: 'local URL', pattern: /\b(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?\b/i },
  { label: 'secret assignment', pattern: /\b(?:api[_-]?key|secret|password|passwd|private[_-]?key|access[_-]?token|smtp[_-]?password)\b\s*[:=]/i },
  { label: 'private key', pattern: /-----BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----/i },
  { label: 'private project reference', pattern: /\b(?:modern[- ]house|mariston|studio[- ]muzyczne|t001[- ]nova|t002[- ]forma)\b/i },
];

function shouldIgnore(name) {
  return ignoredNames.has(name) || ignoredFiles.has(name);
}

function scanFile(filePath) {
  if (!scanExtensions.has(path.extname(filePath).toLowerCase())) return;
  const relative = path.relative(root, filePath).replaceAll(path.sep, '/');
  const originalContent = fs.readFileSync(filePath, 'utf8');
  // Dokumentacja może wskazywać wyłącznie własny port podglądu szablonu.
  const content = relative === 'README.md'
    ? originalContent.replaceAll('http://localhost:4345', 'FORMA_PREVIEW_URL')
    : originalContent;
  for (const rule of rules) {
    if (!rule.pattern.test(content)) continue;
    const line = content.split(/\r?\n/).findIndex((entry) => rule.pattern.test(entry)) + 1;
    findings.push(`${relative}:${line || 1} [${rule.label}]`);
  }
}

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (shouldIgnore(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else scanFile(fullPath);
  }
}

walk(root);

if (findings.length > 0) {
  console.error('Public readiness check failed:');
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log('Public readiness check passed. No private markers were found.');
