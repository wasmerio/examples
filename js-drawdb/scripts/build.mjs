import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const upstream = JSON.parse(await readFile(join(root, "upstream.json"), "utf8"));
const cache = join(root, ".cache");
const archive = join(cache, `drawdb-${upstream.commit}.tar.gz`);
const source = join(cache, "upstream");
const output = join(root, "dist");

await mkdir(cache, { recursive: true });
let bytes;
try {
  bytes = await readFile(archive);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  console.log(`Downloading drawDB ${upstream.commit}`);
  const response = await fetch(upstream.archive, {
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) throw new Error(`Source download failed: HTTP ${response.status}`);
  bytes = Buffer.from(await response.arrayBuffer());
}

const checksum = createHash("sha256").update(bytes).digest("hex");
if (checksum !== upstream.sha256) {
  throw new Error(`Source checksum mismatch: expected ${upstream.sha256}, got ${checksum}`);
}
await writeFile(archive, bytes);
console.log(`Verified source SHA-256 ${checksum}`);

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: source,
    stdio: "inherit",
    env: {
      ...process.env,
      HUSKY: "0",
      NODE_OPTIONS: process.env.NODE_OPTIONS || "--max-old-space-size=4096",
    },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited with ${result.status}`);
}

await rm(source, { recursive: true, force: true });
await mkdir(source, { recursive: true });
run("tar", ["-xzf", archive, "--strip-components=1", "-C", source]);
run("npm", ["ci", "--no-audit", "--no-fund"]);
run("npm", ["run", "build"]);

await rm(output, { recursive: true, force: true });
await cp(join(source, "dist"), output, { recursive: true });
await cp(join(source, "LICENSE"), join(output, "LICENSE"));

// Ship the exact application source and this build recipe with every deployment.
const sourceOutput = join(output, "source");
await mkdir(join(sourceOutput, "template", "scripts"), { recursive: true });
await cp(archive, join(sourceOutput, `drawdb-${upstream.commit}.tar.gz`));
for (const file of ["wasmer.bzl", "LICENSE", "README.md", "package.json", "package-lock.json", "upstream.json", "scripts/build.mjs", "scripts/preview.mjs"]) {
  await cp(join(root, file), join(sourceOutput, "template", file));
}
// Anybuild omits its entrypoint from source copies; recreate the same two-line loader.
await writeFile(join(sourceOutput, "template", "Anybuild"), 'load("./wasmer.bzl", "configure")\nconfigure()\n');
await writeFile(join(sourceOutput, "README.txt"), [
  "drawDB source and license",
  "",
  `Upstream: ${upstream.repository}`,
  `Commit: ${upstream.commit}`,
  `Archive: drawdb-${upstream.commit}.tar.gz`,
  `SHA-256: ${upstream.sha256}`,
  "License: GNU Affero General Public License version 3 (see /LICENSE).",
  "The application source is unmodified. The Wasmer build recipe is in template/.",
  "Core editing is browser-local. File sharing requires a separate optional server.",
  "",
].join("\n"));

console.log(`Static app ready in ${output}`);
