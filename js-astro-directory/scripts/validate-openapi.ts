// CI-only: re-emit src/api/openapi.json from the YAML source of truth and validate the contract.
// Not run during `dev`/`build`. Requires devDeps: `yaml`, `@apidevtools/swagger-parser`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import SwaggerParser from '@apidevtools/swagger-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiDir = path.join(__dirname, '../src/api');
const yamlPath = path.join(apiDir, 'openapi.yaml');
const jsonPath = path.join(apiDir, 'openapi.json');

const doc = parse(fs.readFileSync(yamlPath, 'utf-8'));

// Full OpenAPI validation (also resolves $refs).
await SwaggerParser.validate(structuredClone(doc));
console.log('✅ openapi.yaml is a valid OpenAPI 3.1 document');

// Keep the committed JSON twin in lockstep so the site needs no runtime YAML parser.
const nextJson = JSON.stringify(doc, null, 2) + '\n';
const prevJson = fs.existsSync(jsonPath) ? fs.readFileSync(jsonPath, 'utf-8') : '';
if (nextJson !== prevJson) {
    fs.writeFileSync(jsonPath, nextJson);
    console.log('✍️  Rewrote openapi.json from openapi.yaml');
} else {
    console.log('✅ openapi.json is already in sync');
}
