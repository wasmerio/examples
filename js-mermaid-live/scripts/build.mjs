import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { cp, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const upstream = JSON.parse(await readFile(join(root, "UPSTREAM.json"), "utf8"));
const dist = join(root, "dist");
const temp = await mkdtemp(join(tmpdir(), "wasmer-template-"));

async function sha256(path) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest("hex");
}
function pnpm(args, cwd) {
  execFileSync("npx", ["--yes", upstream.pnpm, "--config.engine-strict=false", ...args], { cwd, stdio: "inherit" });
}
try {
  const archive = join(temp, "source.tar.gz");
  execFileSync("curl", ["--fail", "--silent", "--show-error", "--location", "--retry", "2", "--output", archive, upstream.archiveUrl], { stdio: "inherit" });
  const hash = await sha256(archive);
  if (hash !== upstream.archiveSha256) throw new Error(`archive SHA-256 mismatch: ${hash}`);
  const unpacked = join(temp, "unpacked");
  await mkdir(unpacked);
  execFileSync("tar", ["-xzf", archive, "-C", unpacked]);
  const tops = (await readdir(unpacked)).filter((name) => name !== ".DS_Store");
  if (tops.length !== 1) throw new Error(`archive layout unexpected: ${tops.join(",")}`);
  const src = join(unpacked, tops[0]);
  pnpm(["install", "--frozen-lockfile"], src);
  pnpm(["run", "build"], src);
  const built = join(src, upstream.outDir);
  await rm(dist, { recursive: true, force: true });
  await cp(built, dist, { recursive: true });
  try {
    await cp(join(dist, "assets", "config.yml.dist"), join(dist, "assets", "config.yml"));
  } catch {}
  if (!(await readdir(dist)).includes("index.html")) throw new Error("index.html missing");
  await writeFile(join(dist, "SOURCE.txt"), [
    `${upstream.name} ${upstream.version}`,
    `Upstream: ${upstream.repository}`,
    `Commit: ${upstream.commit}`,
    `Archive SHA-256: ${upstream.archiveSha256}`,
    `License: ${upstream.license}`,
    "",
  ].join("\n"));
} finally {
  await rm(temp, { recursive: true, force: true });
}
