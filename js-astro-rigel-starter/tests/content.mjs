import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile, readdir, writeFile, rm } from "node:fs/promises";

for (const [url, allowed] of [["http://127.0.0.1:4321/rigel/", true], ["http://localhost:4321", true], ["http://[::1]:4321", true], ["https://example.com", false], ["http://127.0.0.1.example.com", false], ["http://user@localhost:4321", false]]) {
  const result = spawnSync(process.execPath, ["tests/local-only.mjs"], { env: { ...process.env, RIGEL_URL: url } });
  assert.equal(result.status === 0, allowed, url);
}
const slug = `release-preview-${process.pid}`;
const files = [];
const image = (await readdir("public/rigel-media")).find(file => file.endsWith(".jpg"));
assert.ok(image);
const build = () => {
  const result = spawnSync("pnpm", ["build"], { stdio: "inherit" });
  assert.equal(result.status, 0, "Production build succeeds");
};
try {
  for (const collection of ["blog", "news"]) {
    const post = JSON.parse(await readFile("src/content/blog/a-different-point-of-view.json", "utf8"));
    post.frontmatter.slug = slug;
    post.frontmatter.draft = false;
    if (collection === "news") post.frontmatter.author = [post.frontmatter.author];
    post.body.root.children.find(node => node.type === "image").src = `/rigel-media/${image}`;
    post.body.root.children.find(node => node.type === "image").alt = "Uploaded editorial photograph";
    const file = `src/content/${collection}/release-check-${process.pid}.json`;
    await writeFile(file, JSON.stringify(post), { flag: "wx" });
    files.push(file);
  }
  build();
  for (const collection of ["blog", "news"]) {
    const html = await readFile(`dist/${collection}/${slug}/index.html`, "utf8");
    assert.match(html, /A different point of view/);
    const listing = await readFile(`dist/${collection}/index.html`, "utf8");
    assert.ok(listing.includes(`href="/${collection}/${slug}/"`), `${collection}: links consume custom slugs`);
    if (collection === "blog") {
      assert.ok(listing.includes(`src="/rigel-media/${image}"`));
      assert.ok(listing.includes('alt="Uploaded editorial photograph"'));
    }
  }
  console.log("PASS: local-only browser guard, custom Blog/News slugs, uploaded card images and alt text");
} finally {
  for (const file of files) await rm(file);
  build();
}
