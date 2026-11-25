import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  mkdtemp,
  readdir,
  readFile,
  writeFile,
  mkdir,
  rm,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse } from 'yaml';
import { exportStarter } from '../scripts/export-starter.mjs';
import {
  publishStarter,
  validatePublishTarget,
} from '../scripts/publish-starter.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
async function files(directory, prefix = '') {
  const result = {};
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (
      ['node_modules', 'dist', '.astro', 'cache', '.git'].includes(entry.name)
    )
      continue;
    const name = prefix + entry.name;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory())
      Object.assign(result, await files(file, name + '/'));
    else
      result[name] = createHash('sha256')
        .update(await readFile(file))
        .digest('hex');
  }
  return result;
}

test('starter export is minimal, deterministic, independently configured and leaves source files unchanged', async (t) => {
  const temporary = await mkdtemp(path.join(tmpdir(), 'bloggpt-export-test-'));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const sourcePaths = ['src', 'content', 'public', 'custom', 'apps', '.github'];
  const before = await Promise.all(
    sourcePaths.map((name) => files(path.join(root, name))),
  );
  const first = await exportStarter(
    path.join(temporary, 'first'),
    'example/blog-starter',
  );
  const second = await exportStarter(
    path.join(temporary, 'second'),
    'example/blog-starter',
  );
  const exported = await files(first);
  assert.deepEqual(exported, await files(second));
  assert.deepEqual(
    before,
    await Promise.all(sourcePaths.map((name) => files(path.join(root, name)))),
  );
  assert.deepEqual(
    Object.keys(exported)
      .filter((name) => name.startsWith('content/'))
      .sort(),
    [
      'content/categories/.gitkeep',
      'content/pages/about.md',
      'content/posts/hello-world.md',
      'content/tags/.gitkeep',
    ],
  );
  assert.deepEqual(
    Object.keys(exported).filter((name) => name.startsWith('public/')),
    ['public/favicon.svg'],
  );
  assert.ok(
    !Object.keys(exported).some((name) =>
      /^(apps|tests|\.github|starter|node_modules|dist|\.git)\//.test(name),
    ),
  );
  for (const name of ['src/layouts/Layout.astro', 'scripts/new.mjs']) {
    assert.ok(exported[name], name);
  }
  assert.deepEqual(await files(path.join(first, 'src')), before[0]);
  assert.deepEqual(
    await files(path.join(first, 'archetypes')),
    await files(path.join(root, 'archetypes')),
  );
  assert.ok(!exported['scripts/export-starter.mjs']);
  assert.ok(!exported['scripts/publish-starter.mjs']);
  const pkg = JSON.parse(await readFile(path.join(first, 'package.json')));
  assert.ok(
    !pkg.scripts.test &&
      !pkg.scripts['docs:build'] &&
      !pkg.scripts['starter:export'],
  );
  const sourcePkg = JSON.parse(await readFile(path.join(root, 'package.json')));
  assert.deepEqual(pkg.dependencies, sourcePkg.dependencies);
  assert.equal(pkg.scripts.build, sourcePkg.scripts.build);
  assert.equal(pkg.engines.node, '24.x');
  const environment = ['SITE_URL', 'VERCEL_PROJECT_PRODUCTION_URL', 'URL'];
  const previous = Object.fromEntries(
    environment.map((key) => [key, process.env[key]]),
  );
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  for (const [index, values, expected] of [
    [0, {}, 'https://example.com/'],
    [
      1,
      { VERCEL_PROJECT_PRODUCTION_URL: 'my-blog.vercel.app' },
      'https://my-blog.vercel.app',
    ],
    [2, { URL: 'https://my-blog.netlify.app' }, 'https://my-blog.netlify.app'],
    [
      3,
      {
        SITE_URL: 'https://blog.example.com/sub/',
        VERCEL_PROJECT_PRODUCTION_URL: 'my-blog.vercel.app',
        URL: 'https://my-blog.netlify.app',
      },
      'https://blog.example.com/sub/',
    ],
  ]) {
    for (const key of environment) delete process.env[key];
    Object.assign(process.env, values);
    const { default: config } = await import(
      `${pathToFileURL(path.join(first, 'blog.config.ts')).href}?case=${index}`
    );
    assert.equal(config.site.baseUrl, expected);
  }
  const lock = parse(
    await readFile(path.join(first, 'pnpm-lock.yaml'), 'utf8'),
  );
  assert.deepEqual(Object.keys(lock.importers), ['.']);
  assert.deepEqual(
    parse(await readFile(path.join(first, 'pnpm-workspace.yaml'), 'utf8'))
      .packages,
    [],
  );
  for (const name of ['README.md', 'README.zh-CN.md']) {
    const readme = await readFile(path.join(first, name), 'utf8');
    assert.ok(!readme.includes('__STARTER_REPOSITORY__'));
    assert.ok(
      readme.includes('https://github.com/example/blog-starter/generate'),
    );
    assert.ok(
      readme.includes(
        'repository-url=https%3A%2F%2Fgithub.com%2Fexample/blog-starter',
      ),
    );
    assert.ok(
      readme.includes('repository=https://github.com/example/blog-starter'),
    );
  }
  await assert.rejects(exportStarter(first), /EEXIST/);
  await assert.rejects(exportStarter(root), /source repository/);
  await assert.rejects(
    exportStarter(path.join(root, 'src/unsafe-export')),
    /outside the source repository/,
  );
  await assert.rejects(
    exportStarter(
      path.join(temporary, 'invalid'),
      'https://github.com/example/repo',
    ),
    /owner\/name/,
  );
});

test('publishing rejects the source repository and invalid branch names', () => {
  assert.throws(
    () => validatePublishTarget('Owner/Theme', 'owner/theme', 'main'),
    /source repository/,
  );
  for (const branch of ['--all', 'main:other', '../main', 'main\nother'])
    assert.throws(() =>
      validatePublishTarget('owner/starter', 'owner/theme', branch),
    );
});

test('publishing preserves history, skips identical output and removes stale target files', async (t) => {
  const temporary = await mkdtemp(path.join(tmpdir(), 'bloggpt-publish-test-'));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const remote = path.join(temporary, 'remote.git');
  const directory = path.join(temporary, 'export');
  await mkdir(directory);
  await writeFile(path.join(directory, 'README.md'), 'First export\n');
  const git = (...args) =>
    execFileSync('git', args, { encoding: 'utf8', stdio: 'pipe' }).trim();
  git('init', '--bare', '--initial-branch=main', remote);
  const config = path.join(temporary, 'gitconfig');
  git(
    'config',
    '--file',
    config,
    `url.${pathToFileURL(remote).href}.insteadOf`,
    'https://github.com/example/starter.git',
  );
  const previous = {
    GIT_CONFIG_GLOBAL: process.env.GIT_CONFIG_GLOBAL,
    GIT_ALLOW_PROTOCOL: process.env.GIT_ALLOW_PROTOCOL,
  };
  process.env.GIT_CONFIG_GLOBAL = config;
  process.env.GIT_ALLOW_PROTOCOL = 'file';
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  const metadata = {
    private: false,
    is_template: true,
    fork: false,
    default_branch: 'main',
  };
  t.mock.method(globalThis, 'fetch', async () => ({
    ok: true,
    json: async () => metadata,
  }));
  const options = {
    directory,
    repository: 'example/starter',
    sourceRepository: 'example/theme',
    sourceSha: 'a'.repeat(40),
    token: 'test-placeholder',
  };
  assert.equal(await publishStarter(options), true);
  const first = git('--git-dir', remote, 'rev-parse', 'main');
  assert.equal(await publishStarter(options), false);
  assert.equal(git('--git-dir', remote, 'rev-parse', 'main'), first);
  await rm(path.join(directory, 'README.md'));
  await writeFile(path.join(directory, 'replacement.md'), 'Replacement\n');
  assert.equal(
    await publishStarter({ ...options, sourceSha: 'b'.repeat(40) }),
    true,
  );
  assert.equal(git('--git-dir', remote, 'rev-parse', 'main^'), first);
  assert.equal(
    git('--git-dir', remote, 'ls-tree', '--name-only', 'main'),
    'replacement.md',
  );
  metadata.is_template = false;
  await assert.rejects(publishStarter(options), /public, non-fork template/);
  await mkdir(path.join(directory, '.git'));
  await assert.rejects(publishStarter(options), /clean starter export/);
});
