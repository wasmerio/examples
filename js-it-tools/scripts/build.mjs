import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const upstream = JSON.parse(await readFile(join(root, "upstream.json"), "utf8"));
const cache = join(root, ".cache");
const archive = join(cache, `it-tools-${upstream.commit}.tar.gz`);
const source = join(cache, "upstream");
const output = join(root, "dist");
await mkdir(cache, { recursive: true });

let bytes;
try {
  bytes = await readFile(archive);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  const response = await fetch(upstream.archive, { signal: AbortSignal.timeout(120_000) });
  if (!response.ok) throw new Error(`Source download failed: HTTP ${response.status}`);
  bytes = Buffer.from(await response.arrayBuffer());
}
const checksum = createHash("sha256").update(bytes).digest("hex");
if (checksum !== upstream.sha256) throw new Error(`Source checksum mismatch: ${checksum}`);
await writeFile(archive, bytes);
console.log(`Verified IT-Tools ${upstream.commit}, SHA-256 ${checksum}`);

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: source,
    stdio: "inherit",
    env: { ...process.env, CI: "true", VITE_VERCEL_ENV: "production" },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited with ${result.status}`);
}

await rm(source, { recursive: true, force: true });
await mkdir(source, { recursive: true });
run("tar", ["-xzf", archive, "--strip-components=1", "-C", source]);

// Preserve the hosted policy: registry packages only, no Git or remote tarball dependencies.
const pkg = JSON.parse(await readFile(join(source, "package.json"), "utf8"));
for (const group of ["dependencies", "devDependencies", "optionalDependencies"]) {
  for (const [name, version] of Object.entries(pkg[group] || {})) {
    if (/^(?:git(?:\+|:)|github:|gitlab:|bitbucket:|https?:|ssh:)/i.test(version)) {
      throw new Error(`Unsupported Git or remote dependency: ${name}`);
    }
  }
}
const lock = await readFile(join(source, "pnpm-lock.yaml"), "utf8");
if (/git\+|github:|gitlab:|bitbucket:|\btarball:/i.test(lock)) {
  throw new Error("Git and remote tarball dependencies are disabled");
}
const pnpm = ["exec", "--yes", `--package=${upstream.packageManager}`, "--", "pnpm"];
run("npm", [...pnpm, "install", "--frozen-lockfile"]);
run("npm", [...pnpm, "run", "build"]);

await rm(output, { recursive: true, force: true });
await cp(join(source, "dist"), output, { recursive: true });

// Exact index copies make direct tool links work on the packaged static server.
// App HTML, scripts, styles and Vue components remain unchanged.
const routes = new Set(["/about"]);
for (const entry of await readdir(join(source, "src/tools"), { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  let tool;
  try { tool = await readFile(join(source, "src/tools", entry.name, "index.ts"), "utf8"); }
  catch (error) { if (error.code === "ENOENT") continue; throw error; }
  for (const [, path] of tool.matchAll(/\bpath:\s*['"]([^'"]+)['"]/g)) routes.add(path);
  const aliases = tool.match(/\bredirectFrom:\s*\[([^\]]*)\]/)?.[1] || "";
  for (const [, path] of aliases.matchAll(/['"]([^'"]+)['"]/g)) routes.add(path);
}
for (const path of routes) {
  if (!/^\/[a-z0-9-]+$/.test(path)) throw new Error(`Unexpected tool route: ${path}`);
  const destination = join(output, path.slice(1));
  await mkdir(destination, { recursive: true });
  await cp(join(output, "index.html"), join(destination, "index.html"));
}
await cp(join(source, "LICENSE"), join(output, "LICENSE"));
const sourceOutput = join(output, "source");
await mkdir(join(sourceOutput, "template", "scripts"), { recursive: true });
await cp(archive, join(sourceOutput, `it-tools-${upstream.commit}.tar.gz`));
for (const file of ["wasmer.bzl", "LICENSE", "README.md", "package.json", "package-lock.json", "upstream.json", "scripts/build.mjs", "scripts/preview.mjs"]) {
  await cp(join(root, file), join(sourceOutput, "template", file));
}
await writeFile(join(sourceOutput, "template", "Anybuild"), 'load("./wasmer.bzl", "configure")\nconfigure()\n');
await writeFile(join(sourceOutput, "routes.json"), JSON.stringify([...routes].sort(), null, 2));
await writeFile(join(sourceOutput, "README.txt"), [
  "IT-Tools source and license", "",
  `Upstream: ${upstream.repository}`, `Commit: ${upstream.commit}`,
  `Archive: it-tools-${upstream.commit}.tar.gz`, `SHA-256: ${upstream.sha256}`,
  "License: GNU General Public License version 3 (see /LICENSE).",
  "The upstream UI is unmodified. The Wasmer build recipe is in template/.",
  "Direct tool routes serve exact copies of the upstream index.html.", "",
].join("\n"));
console.log(`Static app ready in ${output}; ${routes.size} direct routes`);
