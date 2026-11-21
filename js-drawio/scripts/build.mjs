import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
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
try {
  const archive = join(temp, "draw.war");
  execFileSync("curl", ["--fail", "--silent", "--show-error", "--location", "--retry", "2", "--output", archive, upstream.archiveUrl], { stdio: "inherit" });
  const hash = await sha256(archive);
  if (hash !== upstream.archiveSha256) throw new Error(`archive SHA-256 mismatch: ${hash}`);
  const unpacked = join(temp, "unpacked");
  await mkdir(unpacked);
  execFileSync("unzip", ["-q", archive, "-d", unpacked, "-x", "WEB-INF/*", "META-INF/*"]);
  await rm(dist, { recursive: true, force: true });
  await cp(unpacked, dist, { recursive: true });
  await writeFile(join(dist, "SOURCE.txt"), [
    `draw.io ${upstream.version}`,
    `Upstream: ${upstream.repository}`,
    `Commit: ${upstream.commit}`,
    `Archive SHA-256: ${upstream.archiveSha256}`,
    "The Java server under WEB-INF is not included.",
    `License: ${upstream.license}`,
    "",
  ].join("\n"));
} finally {
  await rm(temp, { recursive: true, force: true });
}
