import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

// Astro caches rendered Markdown, including Expressive Code asset URLs. Invalidate
// only when renderer/config dependencies change so ordinary content builds stay fast.
const hash = createHash('sha256');
for (const path of [
  'astro.config.ts',
  'blog.config.ts',
  'src/lib/translations.ts',
  'src/content.config.ts',
  'src/lib/content-files.ts',
  'src/lib/content-dates.ts',
  'src/lib/content-variants.ts',
  'src/lib/policy.ts',
  'scripts/lib/slug.mjs',
  'src/integrations/content-bundles.ts',
  'src/integrations/locale-routes.ts',
  'src/lib/locale-routing.ts',
  'src/plugins/remark-callouts.ts',
  'src/plugins/rehype-math.ts',
  'src/lib/article-options.ts',
  'pnpm-lock.yaml',
]) {
  hash.update(await readFile(path));
}
for (const file of (await readdir('src/i18n', { recursive: true })).sort())
  if (file.endsWith('.ts')) hash.update(await readFile(`src/i18n/${file}`));
const signature = hash.digest('hex');
const marker = '.astro/bloggpt-build-key';
const previous = await readFile(marker, 'utf8').catch(() => '');
if (previous !== signature) {
  const result = spawnSync(
    process.execPath,
    ['node_modules/astro/bin/astro.mjs', 'sync', '--force'],
    { stdio: 'inherit' },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
  await mkdir('.astro', { recursive: true });
  await writeFile(marker, signature);
}
