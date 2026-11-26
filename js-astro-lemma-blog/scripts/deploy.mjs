// bun run deploy: build, then upload dist/ to Cloudflare with wrangler, as
// Workers static assets (no Worker code). The wrangler config is generated
// from lemma.config.mjs (deploy) into .wrangler/deploy.jsonc.
// Signs in with the cf CLI's login (`cf auth login`) when cf is installed;
// otherwise wrangler uses its own (`bunx wrangler login`). Extra arguments go
// to wrangler: bun run deploy --dry-run
// With deploy.indexNow set, the pages the deploy added or changed then go to
// IndexNow: URLs not in the live sitemap before, or with a new lastmod.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import lemma from '../lemma.config.mjs';

// LEMMA_ABOUT=sample builds the fictitious sample profile as the about page;
// that must never go live.
if (process.env.LEMMA_ABOUT !== undefined) {
  console.error(`deploy: LEMMA_ABOUT is set (${process.env.LEMMA_ABOUT}). Unset it and run bun run deploy again.`);
  process.exit(1);
}
// Drafts and an about page that still holds the template marker are left out
// of production builds only.
if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV !== 'production') {
  console.error(`deploy: NODE_ENV is set (${process.env.NODE_ENV}). Unset it and run bun run deploy again.`);
  process.exit(1);
}

const run = (cmd, args, env) => execFileSync(cmd, args, { stdio: 'inherit', env: { ...process.env, ...env } });

const { worker, accountId, domain, compatibilityDate } = lemma.deploy;
const config = new URL('../.wrangler/deploy.jsonc', import.meta.url);
mkdirSync(new URL('.', config), { recursive: true });
writeFileSync(
  config,
  JSON.stringify(
    {
      name: worker,
      account_id: accountId,
      compatibility_date: compatibilityDate,
      // Relative to this file.
      assets: { directory: '../dist', not_found_handling: '404-page' },
      routes: [{ pattern: domain, custom_domain: true }],
      // The site lives at its domain only: no *.workers.dev copy.
      workers_dev: false,
      preview_urls: false,
    },
    null,
    2,
  ) + '\n',
);

// URL -> lastmod ('' without one) of every page in a sitemap index; `read`
// returns a file of the sitemap by its path, from the live site or dist/.
async function sitemapPages(read) {
  const pages = new Map();
  for (const [, sitemap] of (await read('sitemap-index.xml')).matchAll(/<loc>([^<]+)<\/loc>/g)) {
    for (const [, entry] of (await read(new URL(sitemap).pathname.slice(1))).matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      pages.set(entry.match(/<loc>([^<]+)<\/loc>/)[1], entry.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? '');
    }
  }
  return pages;
}

const site = lemma.site.url;
const key = lemma.deploy.indexNow;
let before;
if (key && !process.argv.includes('--dry-run')) {
  const live = async (path) => {
    const res = await fetch(new URL(path, site));
    if (!res.ok) throw new Error(`${res.status} for ${res.url}`);
    return res.text();
  };
  before = await sitemapPages(live).catch((e) => console.warn(`deploy: no IndexNow this time, the live sitemap could not be read (${e.message})`));
}

run('bun', ['run', 'build']);
let env = {};
try {
  // Any authenticated cf call renews an expired token.
  execFileSync('cf', ['auth', 'whoami', '-q'], { stdio: 'ignore' });
  const { oauth_token } = JSON.parse(readFileSync(join(homedir(), '.config/cloudflare/config/default.json'), 'utf8'));
  env = { CLOUDFLARE_API_TOKEN: oauth_token };
} catch {}
run('bunx', ['wrangler', 'deploy', '--config', '.wrangler/deploy.jsonc', ...process.argv.slice(2)], env);

if (before) {
  const after = await sitemapPages((path) => readFileSync(new URL(`../dist/${path}`, import.meta.url), 'utf8'));
  const urlList = [...after].filter(([url, lastmod]) => before.get(url) !== lastmod).map(([url]) => url);
  if (!urlList.length) console.log('deploy: IndexNow: no new or changed pages');
  else {
    // The site is already live, key file included. A failed submission is
    // only a warning: the deploy itself has succeeded.
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: new URL(site).host, key, keyLocation: new URL(`${key}.txt`, site).href, urlList }),
    }).catch((e) => e);
    if (res instanceof Response && res.ok) console.log(`deploy: IndexNow: submitted ${urlList.length} page(s)\n  ${urlList.join('\n  ')}`);
    else console.warn(`deploy: IndexNow submission failed (${res instanceof Response ? `${res.status} ${await res.text()}` : res.message})`);
  }
}
