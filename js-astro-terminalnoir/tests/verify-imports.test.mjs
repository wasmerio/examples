import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { scanImports, scanTree } from '../scripts/verify-imports.mjs';

test('rejects imports escaping the starter', () => {
  assert.throws(
    () => scanImports('/starter', '/starter/src/lib/x.ts', "import data from '../../../palette/palette.json'"),
    /outside/,
  );
});

test('accepts internal imports', () => {
  assert.doesNotThrow(() => scanImports('/starter', '/starter/src/lib/x.ts', "import data from '../data.json'"));
});

test('accepts a nested page wrapper and an astro frontmatter import', () => {
  const source = "---\nimport View from '../../../views/Integrations.astro';\n---\n<View />\n";
  assert.doesNotThrow(() => scanImports('/starter', '/starter/src/pages/pt-br/integrations/index.astro', source));
});

test('rejects the source domain and a dynamic relative glob', () => {
  assert.throws(
    () => scanImports('/starter', '/starter/src/a.ts', 'const site = "https://terminalnoir.web.app"'),
    /terminalnoir\.web\.app/,
  );
  assert.throws(
    () =>
      scanImports(
        '/starter',
        '/starter/src/views/Docs.astro',
        '---\nconst docs = import.meta.glob(`../content/${name}/*.md`);\n---\n',
      ),
    /glob/,
  );
});

test('accepts a literal glob that stays inside the project', () => {
  const source = "---\nconst docs = import.meta.glob('../content/docs/*/*.md');\n---\n";
  assert.doesNotThrow(() => scanImports('/starter', '/starter/src/views/Docs.astro', source));
});

test('scans the starter source tree', () => {
  const root = fileURLToPath(new URL('..', import.meta.url));
  assert.doesNotThrow(() => scanTree(root));
});
