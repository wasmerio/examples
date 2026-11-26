import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import {
  cp,
  mkdtemp,
  readFile,
  readdir,
  writeFile,
  unlink,
  symlink,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { parseHTML } from "linkedom";

const root = fileURLToPath(new URL("../", import.meta.url));
// Resolve the CLI through the package's own bin field so a future Astro release
// can move the entry file without breaking the isolated build fixture.
const astroBin = JSON.parse(
  readFileSync(join(root, "node_modules/astro/package.json"), "utf8"),
).bin.astro;
let fixture;
let posts;

before(async () => {
  fixture = await mkdtemp(join(tmpdir(), "plainblog-build-"));
  for (const entry of [
    "src",
    "astro.config.mjs",
    "package.json",
    "tsconfig.json",
  ]) {
    await cp(join(root, entry), join(fixture, entry), { recursive: true });
  }
  await symlink(
    join(root, "node_modules"),
    join(fixture, "node_modules"),
    "dir",
  );
  posts = join(fixture, "src/content/posts");
});
after(async () => {
  if (fixture) await rm(fixture, { recursive: true, force: true });
});

function build(siteUrl = "", basePath = "") {
  return spawnSync(
    "node",
    [join(root, "node_modules/astro", astroBin), "build"],
    {
      cwd: fixture,
      env: { ...process.env, SITE_URL: siteUrl, BASE_PATH: basePath },
      encoding: "utf8",
    },
  );
}

const documentAt = async (path) =>
  parseHTML(await readFile(join(fixture, "dist", path, "index.html"), "utf8"))
    .document;

test("invalid calendar dates and unsafe slugs stop the build with a file clue", async () => {
  for (const [filename, content, clue] of [
    [
      "bad-date.md",
      "---\ntitle: Bad date\ndate: '2025-02-29'\n---\n\n## Sample\n",
      "bad-date",
    ],
    [
      "Bad-Name.md",
      "---\ntitle: Bad slug\ndate: '2025-02-28'\n---\n\n## Sample\n",
      "Bad-Name",
    ],
  ]) {
    const path = join(posts, filename);
    await writeFile(path, content, { flag: "wx" });
    try {
      const result = build();
      assert.notEqual(result.status, 0, `${filename} unexpectedly built`);
      assert.match(result.stdout + result.stderr, new RegExp(clue, "i"));
    } finally {
      await unlink(path);
    }
  }
});

test("a missing relative image fails rather than shipping a broken article", async () => {
  const path = join(posts, "broken-image.md");
  await writeFile(
    path,
    "---\ntitle: Broken image\ndate: '2025-02-28'\n---\n\n![missing](../../assets/no-such-image.png)\n",
    { flag: "wx" },
  );
  try {
    const result = build();
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /no-such-image|broken-image/i);
  } finally {
    await unlink(path);
  }
});

test("configured site identity and HTTPS URL reach visible pages and metadata", async () => {
  const config = join(fixture, "src/config.ts");
  const original = await readFile(config, "utf8");
  await writeFile(
    config,
    `export const site = {
      name: "A renamed notebook",
      description: "An isolated build fixture",
      nav: [{ label: "Projects", href: "/projects/" }, { label: "About", href: "/about/" }],
    };`,
  );
  try {
    const result = build("https://blog.example.org/");
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const home = await documentAt("");
    assert.equal(
      home.querySelector("h1").textContent.trim(),
      "A renamed notebook",
    );
    assert.equal(home.title, "Home · A renamed notebook");
    const article = await documentAt("blog/markdown-field-guide");
    assert.equal(
      article.querySelector('link[rel="canonical"]')?.getAttribute("href"),
      "https://blog.example.org/blog/markdown-field-guide/",
    );
    const feed = await readFile(join(fixture, "dist/rss.xml"), "utf8");
    assert.match(
      feed,
      /<link>https:\/\/blog\.example\.org\/blog\/markdown-field-guide\/<\/link>/,
    );
    assert.match(feed, /<title>A renamed notebook<\/title>/);
  } finally {
    await writeFile(config, original);
  }
});

test("a sub-path deployment prefixes internal links and keeps URLs absolute", async () => {
  const result = build("https://blog.example.org/", "/PlainBlog");
  assert.equal(result.status, 0, result.stdout + result.stderr);

  const home = await documentAt("");
  const articleHref = home.querySelector(".post-list a").getAttribute("href");
  assert.match(articleHref, /^\/PlainBlog\/blog\/[a-z0-9-]+\/$/);
  assert.equal(
    home.querySelector('link[rel="alternate"]').getAttribute("href"),
    "/PlainBlog/rss.xml",
  );
  assert.equal(
    home.querySelector(".home-link").getAttribute("href"),
    "/PlainBlog/",
  );

  // Site-root links written by hand in Markdown must carry the prefix too, while
  // external links stay untouched.
  const introLinks = [...home.querySelectorAll(".intro a")].map((a) =>
    a.getAttribute("href"),
  );
  assert.ok(introLinks.includes("/PlainBlog/about/"), introLinks.join(", "));
  assert.ok(introLinks.includes("/PlainBlog/projects/"), introLinks.join(", "));
  assert.ok(introLinks.includes("https://github.com"), introLinks.join(", "));

  const article = await documentAt("blog/markdown-field-guide");
  assert.equal(
    article.querySelector('link[rel="canonical"]').getAttribute("href"),
    "https://blog.example.org/PlainBlog/blog/markdown-field-guide/",
  );

  const feed = await readFile(join(fixture, "dist/rss.xml"), "utf8");
  assert.match(
    feed,
    /<link>https:\/\/blog\.example\.org\/PlainBlog\/blog\/[a-z0-9-]+\/<\/link>/,
  );
  assert.doesNotMatch(feed, /PlainBlog\/PlainBlog/);

  // Exhaustive rather than point-wise: every link the sub-path build emits must be
  // prefixed, absolute, an in-page anchor, or an external URL. This is the check
  // that catches a newly added page or Markdown link that forgets the prefix.
  const strays = [];
  for (const file of await readdir(join(fixture, "dist"), {
    recursive: true,
  })) {
    if (!file.endsWith(".html")) continue;
    const doc = parseHTML(
      await readFile(join(fixture, "dist", file), "utf8"),
    ).document;
    for (const el of doc.querySelectorAll("[href],[src]")) {
      for (const attr of ["href", "src"]) {
        const value = el.getAttribute(attr);
        if (!value) continue;
        const resolved =
          value.startsWith("http") ||
          value.startsWith("#") ||
          value.startsWith("mailto:") ||
          value.startsWith("data:") ||
          value.startsWith("/PlainBlog/");
        if (!resolved) strays.push(`${file} ${attr}=${value}`);
      }
    }
  }
  assert.deepEqual(
    strays,
    [],
    `unprefixed paths in the sub-path build:
${strays.join("\n")}`,
  );
});
