import {
  cp,
  lstat,
  mkdir,
  readFile,
  readdir,
  realpath,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse, stringify } from 'yaml';

const root = fileURLToPath(new URL('../', import.meta.url));
// Deliberately opt in: new demo assets, docs, workflows and local files never
// become part of the starter just because they were added to the theme repo.
const included = [
  'src',
  'archetypes',
  'custom',
  'astro.config.ts',
  'tsconfig.json',
  'eslint.config.js',
  '.prettierrc.json',
  '.prettierignore',
  '.gitignore',
  '.gitattributes',
  'LICENSE',
  'NOTICE',
  'public/favicon.svg',
  'scripts/prepare-build.mjs',
  'scripts/build-search.mjs',
  'scripts/new.mjs',
  'scripts/lib',
];

async function copyTree(source, destination) {
  const stat = await lstat(source);
  if (stat.isSymbolicLink())
    throw new Error(`Starter cannot contain symlinks: ${source}`);
  if (stat.isDirectory()) {
    await mkdir(destination, { recursive: true });
    for (const name of (await readdir(source)).sort())
      await copyTree(path.join(source, name), path.join(destination, name));
  } else {
    await mkdir(path.dirname(destination), { recursive: true });
    await cp(source, destination);
  }
}

export async function exportStarter(
  destination,
  repository = 'Raincarnator/astro-theme-BlogGPT-starter',
) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository))
    throw new Error('Expected starter repository as owner/name.');
  const output = path.resolve(destination);
  // Never clean or overwrite an existing directory, particularly the checkout.
  // Canonicalize the parent as well so symlinked paths cannot bypass the check.
  const parent = await realpath(path.dirname(output));
  const target = path.join(parent, path.basename(output));
  const sourceRoot = await realpath(root);
  if (target === sourceRoot || sourceRoot.startsWith(target + path.sep))
    throw new Error(
      'Starter destination cannot contain the source repository.',
    );
  const relative = path.relative(sourceRoot, target);
  if (!relative.startsWith('..') && !path.isAbsolute(relative))
    throw new Error(
      'Export outside the source repository to keep builds and deployments isolated.',
    );
  await mkdir(target);
  for (const file of included)
    await copyTree(path.join(root, file), path.join(target, file));
  await copyTree(path.join(root, 'starter/files'), target);
  await cp(
    path.join(root, 'starter/blog.config.ts.template'),
    path.join(target, 'blog.config.ts'),
  );
  await cp(
    path.join(root, 'starter/friends.config.ts.template'),
    path.join(target, 'friends.config.ts'),
  );

  const pkg = JSON.parse(
    await readFile(path.join(root, 'package.json'), 'utf8'),
  );
  pkg.name = 'bloggpt-starter';
  pkg.description = 'My blog, powered by Astro and BlogGPT.';
  // Vercel selects Node from engines; .node-version alone is not sufficient.
  pkg.engines.node = '24.x';
  pkg.repository.url = `git+https://github.com/${repository}.git`;
  delete pkg.homepage;
  pkg.scripts = Object.fromEntries(
    Object.entries(pkg.scripts).filter(([name]) =>
      [
        'dev',
        'check',
        'build',
        'preview',
        'lint',
        'format',
        'format:check',
        'new',
      ].includes(name),
    ),
  );
  await writeFile(
    path.join(target, 'package.json'),
    JSON.stringify(pkg, null, 2) + '\n',
  );

  // Preserve exact theme dependency resolutions, dropping the docs importer.
  const lock = parse(await readFile(path.join(root, 'pnpm-lock.yaml'), 'utf8'));
  lock.importers = { '.': lock.importers['.'] };
  await writeFile(
    path.join(target, 'pnpm-lock.yaml'),
    stringify(lock, { lineWidth: 0 }),
  );
  const workspace = parse(
    await readFile(path.join(root, 'pnpm-workspace.yaml'), 'utf8'),
  );
  workspace.packages = [];
  await writeFile(
    path.join(target, 'pnpm-workspace.yaml'),
    stringify(workspace),
  );
  for (const name of ['README.md', 'README.zh-CN.md']) {
    const file = path.join(target, name);
    await writeFile(
      file,
      (await readFile(file, 'utf8')).replaceAll(
        '__STARTER_REPOSITORY__',
        repository,
      ),
    );
  }
  return target;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  const destination = process.argv[2];
  if (!destination)
    throw new Error(
      'Usage: pnpm starter:export <new-directory> [owner/repository]',
    );
  console.log(
    `Starter exported to ${await exportStarter(destination, process.argv[3])}`,
  );
}
