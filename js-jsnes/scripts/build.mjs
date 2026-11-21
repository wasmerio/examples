import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { cp, mkdir, mkdtemp, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const upstream = JSON.parse(await readFile(join(root, "UPSTREAM.json"), "utf8"));
const dist = join(root, "dist");
const temp = await mkdtemp(join(tmpdir(), "wasmer-template-"));
const env = { ...process.env, CI: "1", HUSKY: "0" };

async function sha256(path) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest("hex");
}
async function findIndex(dir) {
  const hits = [];
  async function walk(current) {
    for (const name of await readdir(current)) {
      if (name === "node_modules" || name === ".git") continue;
      const path = join(current, name);
      if ((await stat(path)).isDirectory()) await walk(path);
      else if (name === "index.html") hits.push(path);
    }
  }
  await walk(dir);
  const score = (path) => (path.includes("/dist/") || path.includes("/build/") || path.includes("/docs/") ? 0 : 1);
  hits.sort((a, b) => score(a) - score(b) || a.length - b.length);
  return hits[0] || "";
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
  const install = upstream.installDir === "." ? src : join(src, upstream.installDir);
  const buildCwd = upstream.buildCwd === "." ? src : join(src, upstream.buildCwd);
  if (upstream.packageManager === "pnpm") {
    const pnpm = ["--yes", `pnpm@${upstream.pnpmVersion}`, "--config.engine-strict=false"];
    execFileSync("npx", [...pnpm, "install", "--frozen-lockfile"], { cwd: install, stdio: "inherit", env });
    execFileSync("npx", [...pnpm, "run", "build"], { cwd: buildCwd, stdio: "inherit", env });
  } else {
    const installArgs = upstream.npmCi ? ["ci", "--no-audit", "--no-fund"] : ["install", "--no-audit", "--no-fund"];
    execFileSync("npm", installArgs, { cwd: install, stdio: "inherit", env });
    execFileSync(upstream.build[0], upstream.build.slice(1), { cwd: buildCwd, stdio: "inherit", env });
  }
  const index = await findIndex(src);
  if (!index) throw new Error("index.html missing after build");
  await rm(dist, { recursive: true, force: true });
  await cp(dirname(index), dist, { recursive: true });
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
