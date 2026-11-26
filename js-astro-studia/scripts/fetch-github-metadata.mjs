/**
 * Fetch GitHub metadata for everything in src/data/repositories.yml and write
 * src/data/github-metadata.json, which is COMMITTED: the build reads the file,
 * never the network. Set GITHUB_TOKEN to raise the rate limit from 60 requests
 * an hour to 5000. .github/workflows/update-github-metadata.yml runs this.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

const ROOT = process.cwd();
const CONFIG = join(ROOT, 'src/data/repositories.yml');
const OUT = join(ROOT, 'src/data/github-metadata.json');

const token = process.env.GITHUB_TOKEN;
const headers = {
  accept: 'application/vnd.github+json',
  'user-agent': 'astro-studia/fetch-github-metadata',
  ...(token ? { authorization: `Bearer ${token}` } : {}),
};

async function api(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) {
    const hint = res.status === 403 && !token ? ' (set GITHUB_TOKEN to raise the rate limit)' : '';
    throw new Error(`GET ${path} → ${res.status} ${res.statusText}${hint}`);
  }
  return res.json();
}

const config = parse(readFileSync(CONFIG, 'utf8')) ?? {};
const users = config.github_users ?? [];
const repos = config.github_repos ?? [];

const out = { fetched: new Date().toISOString(), users: {}, repos: {} };

for (const login of users) {
  const u = await api(`/users/${login}`);
  out.users[login] = {
    login: u.login,
    name: u.name,
    bio: u.bio,
    followers: u.followers,
    publicRepos: u.public_repos,
    htmlUrl: u.html_url,
    avatarUrl: u.avatar_url,
  };
  console.log(`✓ user ${login}`);
}

for (const fullName of repos) {
  const r = await api(`/repos/${fullName}`);
  out.repos[fullName] = {
    fullName: r.full_name,
    description: r.description,
    stars: r.stargazers_count,
    forks: r.forks_count,
    language: r.language,
    license: r.license?.spdx_id ?? null,
    archived: r.archived,
    htmlUrl: r.html_url,
    pushedAt: r.pushed_at,
  };
  console.log(`✓ repo ${fullName}`);
}

writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`);
console.log(`\nwrote ${OUT}`);
