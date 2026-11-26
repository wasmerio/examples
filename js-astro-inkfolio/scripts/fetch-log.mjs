// Builds src/data/log.json for the /log page from **public** GitHub data.
//
//   npm run log
//
// No token, on purpose: a personal access token in a build script is one leak
// away from exposing every private repository it can read. This script only
// touches public repositories, so the heatmap can never become a privacy issue.
// Private work simply does not appear — that is the correct trade.
import { writeFileSync } from 'node:fs';

// Public repositories only. Add a repo here once it is public; anything private
// will return 404 without a token and is reported as skipped.
export const REPOS = [
  'respectevery01/inkfolio',
  'respectevery01/paper',
  'ZensInk/zens-ink-seo-package',
];

const DAYS = 365;
const TZ = 'Asia/Shanghai'; // day buckets follow the author's clock, not UTC
const OUT = 'src/data/log.json';

const dayInTz = (iso) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    new Date(iso),
  );

const since = new Date(Date.now() - DAYS * 864e5).toISOString();

async function api(url) {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'inkfolio-fetch-log',
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function commitsFor(repo) {
  const out = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await api(`https://api.github.com/repos/${repo}/commits?since=${since}&per_page=100&page=${page}`);
    if (!Array.isArray(batch) || batch.length === 0) break;
    for (const c of batch) {
      const date = c?.commit?.author?.date ?? c?.commit?.committer?.date;
      if (date) out.push(dayInTz(date));
    }
    if (batch.length < 100) break;
  }
  return out;
}

const counts = {};
const repos = [];
const repoStats = [];
for (const repo of REPOS) {
  try {
    const days = await commitsFor(repo);
    repos.push(repo);
    repoStats.push({ name: repo, commits: days.length, last: days.slice().sort().pop() ?? null });
    for (const d of days) counts[d] = (counts[d] ?? 0) + 1;
    console.log(`${repo}: ${days.length} commits`);
  } catch (err) {
    console.warn(`${repo}: skipped (${err.message})`);
  }
}

const days = [];
const cursor = new Date();
cursor.setUTCHours(0, 0, 0, 0);
for (let i = DAYS - 1; i >= 0; i--) {
  const d = new Date(cursor);
  d.setUTCDate(d.getUTCDate() - i);
  const key = d.toISOString().slice(0, 10);
  days.push({ date: key, count: counts[key] ?? 0 });
}

if (!repos.length) {
  console.error('No public repositories returned data — keeping the existing file.');
  process.exit(1);
}

const payload = {
  updated: new Date().toISOString().slice(0, 10),
  repos,
  repoStats: repoStats.sort((a, b) => b.commits - a.commits),
  days,
};
writeFileSync(OUT, JSON.stringify(payload, null, 1) + '\n');
console.log(`wrote ${OUT}: ${days.length} days, ${days.reduce((n, d) => n + d.count, 0)} commits`);
