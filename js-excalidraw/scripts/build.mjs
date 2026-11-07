import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const upstream = JSON.parse(await readFile(join(root, 'UPSTREAM.json'), 'utf8'));
const cache = join(root, '.cache');
const source = join(cache, `excalidraw-${upstream.commit}`);
const output = join(root, 'site');
await mkdir(cache, { recursive: true });
const archive = join(cache, `${upstream.commit}.tar.gz`);
let bytes;
try {
  bytes = await readFile(archive);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  const url = `${upstream.repository.replace('https://github.com/', 'https://codeload.github.com/')}/tar.gz/${upstream.commit}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(120_000) });
  assert.ok(response.ok, `Source download: HTTP ${response.status}`);
  bytes = Buffer.from(await response.arrayBuffer());
}
assert.equal(createHash('sha256').update(bytes).digest('hex'), upstream.archiveSha256,
  'Upstream archive checksum mismatch');
await writeFile(archive, bytes);
// Always extract verified sources afresh, so local cached changes cannot ship.
await rm(source, { recursive: true, force: true });
execFileSync('tar', ['-xzf', archive, '-C', cache], { stdio: 'inherit' });

// Yarn is pinned in this template, and every upstream lock entry is a registry tarball.
const yarn = join(root, 'node_modules/yarn/bin/yarn.js');
const lock = await readFile(join(source, 'yarn.lock'), 'utf8');
for (const [, url] of lock.matchAll(/^  resolved "([^"\n]+)"/gm)) {
  assert.ok(/^https:\/\/registry\.(yarnpkg\.com|npmjs\.org)\//.test(url),
    `Unexpected dependency source: ${url}`);
}
function replaceOnce(text, before, after) {
  assert.equal(text.split(before).length, 2, `Upstream patch no longer matches: ${before}`);
  return text.replace(before, after);
}
// Disable unavailable services through upstream behavior and supported component options.
// No control, markup, style, or design token is replaced.
const appPath = join(source, 'excalidraw-app/App.tsx');
let app = await readFile(appPath, 'utf8');
app = replaceOnce(app, 'const isCollabDisabled = isRunningInIframe();',
  'const isCollabDisabled = true; // Single-user static deployment.');
app = replaceOnce(app, '<Excalidraw\n        viewportStatusFrame=',
  '<Excalidraw\n        aiEnabled={false}\n        viewportStatusFrame=');
app = replaceOnce(app, '              onExportToBackend,', '              onExportToBackend: undefined,');
// Remove the optional Excalidraw+ export callback using its existing UIOptions slot.
const start = app.indexOf('              renderCustomUI: excalidrawAPI');
const end = app.indexOf('                : undefined,', start);
assert.ok(start > 0 && end > start, 'Upstream export callback patch no longer matches');
app = app.slice(0, start) + '              renderCustomUI: undefined,' + app.slice(end + '                : undefined,'.length);
app = replaceOnce(app, '{excalidrawAPI && <AIComponents excalidrawAPI={excalidrawAPI} />}',
  '');
app = replaceOnce(app, 'import { AIComponents } from "./components/AI";\n', '');
app = replaceOnce(app, '<TTDDialogTrigger />', '');
app = replaceOnce(app, '  TTDDialogTrigger,\n', '');
app = replaceOnce(app, '  isRunningInIframe,\n', '');
await writeFile(appPath, app);
// Keep the same fonts while serving their already-bundled assets from this deployment.
const fontPlugin = join(source, 'scripts/woff2/woff2-vite-plugins.js');
await writeFile(fontPlugin, replaceOnce(await readFile(fontPlugin, 'utf8'),
  'const OSS_FONTS_CDN = "https://excalidraw.nyc3.cdn.digitaloceanspaces.com/oss/";',
  'const OSS_FONTS_CDN = "/";'));
// The upstream page injects analytics independently of VITE_APP_ENABLE_TRACKING.
const htmlPath = join(source, 'excalidraw-app/index.html');
let html = await readFile(htmlPath, 'utf8');
const analytics = /<!-- 100% privacy friendly analytics -->[\s\S]*?<!-- end LEGACY GOOGLE ANALYTICS -->/g;
assert.equal([...html.matchAll(analytics)].length, 1, 'Upstream analytics patch no longer matches');
await writeFile(htmlPath, html.replace(analytics, ''));

// Also blank upstream service endpoints; local drawing/import/export need none of them.
const env = { ...process.env, NODE_ENV: 'production',
  VITE_APP_ENABLE_TRACKING: 'false', VITE_APP_DISABLE_SENTRY: 'true',
  VITE_APP_WS_SERVER_URL: '', VITE_APP_AI_BACKEND: '', VITE_APP_FIREBASE_CONFIG: '{}',
  VITE_APP_BACKEND_V2_GET_URL: '', VITE_APP_BACKEND_V2_POST_URL: '',
};
execFileSync(process.execPath, [yarn, 'install', '--frozen-lockfile', '--ignore-scripts', '--non-interactive', '--production=false'], {
  cwd: source, stdio: 'inherit', env,
});
// Direct Vite invocation avoids upstream's script forcing tracking back on.
execFileSync(process.execPath, [join(source, 'node_modules/vite/bin/vite.js'), 'build'], {
  cwd: join(source, 'excalidraw-app'), stdio: 'inherit', env,
});

await rm(output, { recursive: true, force: true });
await cp(join(source, 'excalidraw-app/build'), output, { recursive: true });
// The upstream font plugin assumes its CDN and does not emit Assistant files.
// Copy the exact UI fonts to the same-origin URLs generated by that plugin.
await cp(join(source, 'packages/excalidraw/fonts/Assistant'),
  join(output, 'fonts/Assistant'), { recursive: true });
for (const path of ['LICENSE', 'UPSTREAM.json']) {
  await cp(join(root, path), join(output, path));
}
// Preserve source and installed package notices alongside the shipped application.
async function notices(directory, target) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory() && !['node_modules', '.git', 'build', 'dest'].includes(entry.name)) {
      await notices(path, join(target, entry.name));
    } else if (entry.isFile() && /^(licen[cs]e|notice|copying|ofl)([._-]|$)/i.test(entry.name)) {
      await mkdir(target, { recursive: true });
      await cp(path, join(target, entry.name));
    }
  }
}
await notices(source, join(output, 'notices/upstream'));
const modules = join(source, 'node_modules');
for (const entry of await readdir(modules, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
  if (entry.name.startsWith('@')) {
    for (const scoped of await readdir(join(modules, entry.name), { withFileTypes: true })) {
      if (scoped.isDirectory()) await notices(join(modules, entry.name, scoped.name),
        join(output, 'notices/packages', entry.name, scoped.name));
    }
  } else {
    await notices(join(modules, entry.name), join(output, 'notices/packages', entry.name));
  }
}
await writeFile(join(output, 'version.json'), `${JSON.stringify({ version: upstream.commit })}\n`);
const index = join(output, 'index.html');
await writeFile(index, (await readFile(index, 'utf8')).replaceAll('{version}', upstream.commit));
console.log(`Built excalidraw ${upstream.version} (${upstream.commit}) into site/`);
