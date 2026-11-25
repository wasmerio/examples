import { execFileSync } from 'node:child_process';
import { cp, lstat, mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function validatePublishTarget(repository, sourceRepository, branch) {
  const name = /^[\w.-]+\/[\w.-]+$/;
  if (!name.test(repository) || !name.test(sourceRepository))
    throw new Error('Both repositories must be owner/name.');
  if (repository.toLowerCase() === sourceRepository.toLowerCase())
    throw new Error('Cannot publish the starter into the source repository.');
  if (!branch || branch.startsWith('-'))
    throw new Error('Invalid starter branch.');
  execFileSync('git', ['check-ref-format', `refs/heads/${branch}`], {
    stdio: 'pipe',
  });
}

// Only fresh export artifacts are accepted. Never copy a checkout's .git or
// generated build files into the publishing checkout.
async function validateExport(directory) {
  for (const name of await readdir(directory)) {
    if (['.git', 'node_modules', 'dist', '.astro'].includes(name))
      throw new Error(`Expected a clean starter export, found ${name}.`);
    const file = path.join(directory, name);
    const stat = await lstat(file);
    if (stat.isSymbolicLink())
      throw new Error('Starter export contains a symlink.');
    if (stat.isDirectory()) await validateExport(file);
  }
}

export async function publishStarter({
  directory,
  repository,
  sourceRepository,
  sourceSha,
  branch = 'main',
  token,
}) {
  validatePublishTarget(repository, sourceRepository, branch);
  if (!/^[a-f0-9]{40}$/.test(sourceSha))
    throw new Error('Expected a full source commit SHA.');
  if (!token) throw new Error('STARTER_TOKEN is required.');
  await validateExport(directory);
  const response = await fetch(`https://api.github.com/repos/${repository}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (!response.ok)
    throw new Error(`Cannot read starter repository: HTTP ${response.status}.`);
  const metadata = await response.json();
  if (
    metadata.private ||
    !metadata.is_template ||
    metadata.fork ||
    metadata.default_branch !== branch
  )
    throw new Error(
      'Starter must be a public, non-fork template repository with the configured default branch.',
    );

  const checkout = await mkdtemp(path.join(tmpdir(), 'bloggpt-publish-'));
  const url = `https://github.com/${repository}.git`;
  const env = {
    ...process.env,
    GIT_TERMINAL_PROMPT: '0',
    GIT_CONFIG_COUNT: '1',
    GIT_CONFIG_KEY_0: 'http.https://github.com/.extraheader',
    GIT_CONFIG_VALUE_0: `AUTHORIZATION: basic ${Buffer.from(`x-access-token:${token}`).toString('base64')}`,
  };
  // Captured errors intentionally omit stderr so credentials cannot reach logs.
  const git = (...args) => {
    try {
      return execFileSync('git', args, {
        cwd: checkout,
        env,
        encoding: 'utf8',
        stdio: 'pipe',
      }).trim();
    } catch {
      throw new Error(
        `Starter Git operation failed: ${args[0]}. Check token permissions and branch protection.`,
      );
    }
  };
  try {
    git('init', '--initial-branch', branch);
    git('remote', 'add', 'origin', url);
    const ref = `refs/heads/${branch}`;
    if (git('ls-remote', '--heads', 'origin', ref)) {
      git('fetch', '--depth=1', 'origin', ref);
      git('checkout', '-B', branch, 'FETCH_HEAD');
      git('rm', '-r', '--ignore-unmatch', '.');
    }
    for (const file of await readdir(directory))
      await cp(path.join(directory, file), path.join(checkout, file), {
        recursive: true,
      });
    git('add', '--all');
    if (!git('status', '--porcelain')) return false;
    git(
      '-c',
      'user.name=github-actions[bot]',
      '-c',
      'user.email=41898282+github-actions[bot]@users.noreply.github.com',
      'commit',
      '-m',
      `Sync starter from ${sourceRepository}@${sourceSha}`,
    );
    // Normal fast-forward push: concurrent target edits fail safely.
    git('push', 'origin', `HEAD:${ref}`);
    return true;
  } finally {
    // checkout is always a newly created child of the OS temporary directory.
    await rm(checkout, { recursive: true, force: true });
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  const changed = await publishStarter({
    directory: process.argv[2],
    repository: process.env.STARTER_REPOSITORY,
    branch: process.env.STARTER_BRANCH || 'main',
    token: process.env.STARTER_TOKEN,
    sourceRepository: process.env.GITHUB_REPOSITORY,
    sourceSha: process.env.GITHUB_SHA,
  });
  console.log(
    changed ? 'Starter published.' : 'Starter is already up to date.',
  );
}
