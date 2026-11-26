import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { auditPublicFiles } from '../src/lib/privacy-audit.js';

const paths = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' })
  .split('\n').filter(Boolean);
const files = await Promise.all(paths.map(async (path) => ({ path, content: await readFile(path) })));
const issues = auditPublicFiles(files);
if (issues.length) {
  process.stderr.write(`Public-content audit found ${issues.length} issue(s):\n- ${issues.join('\n- ')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`Public-content audit passed for ${files.length} files.\n`);
}
