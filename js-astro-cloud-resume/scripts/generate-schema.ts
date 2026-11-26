/**
 * Writes src/data/resume.schema.json from the zod schema, so editors with the
 * YAML language server (VS Code "YAML" extension, JetBrains, ...) offer
 * autocompletion and inline validation in resume.yaml.
 *
 * Run after changing src/lib/schema.ts:  npm run schema
 */
import { writeFileSync } from 'node:fs';
import { z } from 'astro/zod';
import { resumeSchema } from '../src/lib/schema.ts';

const json = z.toJSONSchema(resumeSchema, { io: 'input', unrepresentable: 'any' });
const out = new URL('../src/data/resume.schema.json', import.meta.url);
writeFileSync(out, `${JSON.stringify({ title: 'cloud-resume data file', ...json }, null, 2)}\n`);
console.log(`Wrote ${out.pathname}`);
