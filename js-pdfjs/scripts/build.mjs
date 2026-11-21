import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile, cp } from "node:fs/promises";
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
  const archive = join(temp, "pdfjs.zip");
  execFileSync("curl", ["--fail", "--silent", "--show-error", "--location", "--retry", "2", "--output", archive, upstream.archiveUrl], { stdio: "inherit" });
  const hash = await sha256(archive);
  if (hash !== upstream.archiveSha256) throw new Error(`archive SHA-256 mismatch: ${hash}`);
  const unpacked = join(temp, "unpacked");
  await mkdir(unpacked);
  execFileSync("unzip", ["-q", archive, "-d", unpacked]);
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist);
  async function copyTree(from, to) {
    await mkdir(to, { recursive: true });
    for (const name of await readdir(from)) {
      if (name.endsWith(".map")) continue;
      const src = join(from, name);
      const dest = join(to, name);
      const { stat } = await import("node:fs/promises");
      if ((await stat(src)).isDirectory()) await copyTree(src, dest);
      else await cp(src, dest);
    }
  }
  await copyTree(unpacked, dist);
  await writeFile(join(dist, "index.html"), `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>PDF.js viewer</title>
<style>html,body,iframe{margin:0;border:0;width:100%;height:100%}</style>
</head>
<body>
<iframe src="web/viewer.html" title="PDF.js viewer"></iframe>
</body>
</html>
`);
  await writeFile(join(dist, "SOURCE.txt"), [
    `PDF.js viewer ${upstream.version}`,
    `Upstream: ${upstream.repository}`,
    `Commit: ${upstream.commit}`,
    `Archive SHA-256: ${upstream.archiveSha256}`,
    `License: ${upstream.license}`,
    "",
  ].join("\n"));
} finally {
  await rm(temp, { recursive: true, force: true });
}
