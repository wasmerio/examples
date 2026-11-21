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
const skip = new Set([".git", ".github", ".circleci", "node_modules", "coverage"]);

async function sha256(path) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest("hex");
}
function download(url, path) {
  execFileSync("curl", ["--fail", "--silent", "--show-error", "--location", "--retry", "2", "--output", path, url], { stdio: "inherit" });
}
try {
  const archive = join(temp, "source.tar.gz");
  download(upstream.archiveUrl, archive);
  const hash = await sha256(archive);
  if (hash !== upstream.archiveSha256) throw new Error(`archive SHA-256 mismatch: ${hash}`);
  const unpacked = join(temp, "unpacked");
  await mkdir(unpacked);
  execFileSync("tar", ["-xzf", archive, "-C", unpacked]);
  const tops = (await readdir(unpacked)).filter((name) => name !== ".DS_Store");
  if (tops.length !== 1) throw new Error(`archive layout unexpected: ${tops.join(",")}`);
  const src = join(unpacked, tops[0]);
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist);
  if (upstream.mode === "npm") {
    try {
      const vitePath = join(src, "vite.config.ts");
      let vite = await readFile(vitePath, "utf8");
      const needle = "execSync('git rev-parse --short HEAD').toString().trim()";
      if (vite.includes(needle)) {
        vite = vite.replace(needle, JSON.stringify(upstream.commit.slice(0, 7)));
        await writeFile(vitePath, vite);
      }
    } catch {}
    execFileSync("npm", ["ci", "--no-audit", "--no-fund"], { cwd: src, stdio: "inherit", env: { ...process.env, PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: "1", CI: "1" } });
    execFileSync("npm", ["run", "build"], { cwd: src, stdio: "inherit" });
    await cp(join(src, upstream.outDir), dist, { recursive: true });
  } else {
    const site = upstream.siteDir === "." ? src : join(src, upstream.siteDir);
    for (const name of await readdir(site)) {
      if (skip.has(name)) continue;
      await cp(join(site, name), join(dist, name), { recursive: true, dereference: true });
    }
  }
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
