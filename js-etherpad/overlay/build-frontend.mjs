// Bundle Etherpad's client-side "bootstrap" entrypoints (index / pad /
// timeslider) ahead of time, on native Node, so the running server never has
// to invoke esbuild at runtime.
//
// Upstream Etherpad bundles these three entrypoints lazily inside
// `specialpages.ts` (`esbuild.buildSync` in production, watched `esbuild.build`
// in development). EdgeJS/QuickJS cannot run esbuild at runtime (no native
// modules / no runtime TypeScript), so we perform the exact same esbuild bundle
// here during `pnpm run build` and emit a manifest that `specialpages.ts` reads
// to serve the pre-built assets. Must run AFTER build-backend.mjs so the
// compiled `.js` sources and plugin metadata exist.
//
// The three entrypoints are eejs templates parameterised by the installed
// plugin set and settings; both are fixed for a given build, so bundling them
// ahead of time is equivalent to what the server would produce at startup.

import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
// ep_etherpad-lite (and esbuild) resolve from the src workspace.
const require = createRequire(path.join(root, 'src', 'package.json'));

const settings = require('ep_etherpad-lite/node/utils/Settings').default;
const eejs = require('ep_etherpad-lite/node/eejs');
const plugins = require('ep_etherpad-lite/static/js/pluginfw/plugins');
const pluginDefs = require('ep_etherpad-lite/static/js/pluginfw/plugin_defs');
const esbuild = require('esbuild');

// Populate pluginDefs.parts / .plugins exactly as the server does before it
// renders the bootstrap templates (server.js -> plugins.update()).
await plugins.update();

// Same derivation as specialpages.ts: the set of plugin modules that expose
// client-side hooks, which the bootstrap bundles must pull in.
const pluginModules = (() => {
  const set = new Set();
  for (const part of pluginDefs.parts) {
    for (const [, hookFnName] of Object.entries(part.client_hooks || {})) {
      set.add(hookFnName.split(':')[0]);
    }
  }
  return [...set];
})();

const padString = eejs.require('ep_etherpad-lite/templates/padBootstrap.js', { pluginModules, settings });
const indexString = eejs.require('ep_etherpad-lite/templates/indexBootstrap.js', { settings });
const timeSliderString =
  eejs.require('ep_etherpad-lite/templates/timeSliderBootstrap.js', { pluginModules, settings });

// esbuild options mirror specialpages.ts `convertTypescript`. Minified, no
// sourcemap: this is a deployable production artifact.
const bundle = (contents) => {
  const out = esbuild.buildSync({
    stdin: { contents, resolveDir: path.join(settings.root, 'var', 'js'), loader: 'js' },
    alias: {
      'ep_etherpad-lite/static/js/browser': 'ep_etherpad-lite/static/js/vendors/browser',
      'ep_etherpad-lite/static/js/nice-select': 'ep_etherpad-lite/static/js/vendors/nice-select',
    },
    bundle: true,
    minify: true,
    sourcemap: false,
    sourceRoot: settings.root + '/src/static/js/',
    target: ['es2020'],
    metafile: true,
    write: false,
  });
  const file = out.outputFiles[0];
  // Same hash sanitisation specialpages.ts uses for filename safety.
  const hash = file.hash.replaceAll('/', '2').replaceAll('+', '5').replaceAll('^', '7');
  return { text: file.text, hash };
};

const outdir = path.join(settings.root, 'var', 'js');
if (!existsSync(outdir)) mkdirSync(outdir, { recursive: true });

const entries = {
  index: { source: indexString, prefix: 'indexBootstrap' },
  pad: { source: padString, prefix: 'padbootstrap' },
  timeslider: { source: timeSliderString, prefix: 'timeSliderBootstrap' },
};

const manifest = {};
for (const [key, { source, prefix }] of Object.entries(entries)) {
  const { text, hash } = bundle(source);
  const fileName = `${prefix}-${hash}.min.js`;
  writeFileSync(path.join(outdir, fileName), text);
  manifest[key] = { fileName, bytes: text.length };
}

writeFileSync(path.join(outdir, 'frontend-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

console.log(
  `build-frontend: bundled ${Object.keys(manifest).length} client entrypoints -> var/js ` +
  `(${Object.values(manifest).map((m) => m.fileName).join(', ')})`,
);

// plugins.update()/UpdateCheck can leave timers or a keep-alive handle; this is
// a one-shot build tool, so exit deterministically once the manifest is written.
process.exit(0);
