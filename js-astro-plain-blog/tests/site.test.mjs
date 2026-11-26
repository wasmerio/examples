import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseHTML } from "linkedom";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const page = async (path) =>
  parseHTML(
    await readFile(
      path === "404" ? join(root, "404.html") : join(root, path, "index.html"),
      "utf8",
    ),
  ).document;
const links = (doc) =>
  [...doc.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"));

test("home is the only index and its dated links reach the rendered articles", async () => {
  const doc = await page("");
  assert.equal(doc.documentElement.lang, "zh-CN");
  assert.equal(doc.querySelectorAll("h1").length, 1);
  assert.ok(doc.querySelector("main"));
  assert.ok(doc.querySelector('a[href="#main"]'));
  const years = [...doc.querySelectorAll("[data-year]")].map((group) =>
    Number(group.getAttribute("data-year")),
  );
  for (let i = 1; i < years.length; i++) {
    assert.ok(
      years[i - 1] > years[i],
      "year groups must descend without duplicates",
    );
  }
  const items = [...doc.querySelectorAll(".post-list li")];
  let previous;
  assert.ok(items.length > 0, "the template ships readable sample articles");
  for (const item of items) {
    const anchor = item.querySelector("a");
    const href = anchor.getAttribute("href");
    assert.match(href, /^\/blog\/[a-z0-9-]+\/$/);
    const article = await page(href.slice(1));
    assert.equal(
      article.querySelector("h1").textContent.trim(),
      anchor.textContent.trim(),
    );
    const time = item.querySelector("time");
    const date = time.getAttribute("datetime");
    const slug = href.split("/")[2];
    if (previous) {
      assert.ok(
        previous.date >= date,
        "readers must see newest articles first",
      );
      if (previous.date === date) {
        assert.ok(
          previous.slug < slug,
          "same-day articles must keep ascending slug order",
        );
      }
    }
    previous = { date, slug };
    assert.match(time.textContent.trim(), /^\d{2}\/\d{2}$/);
    assert.equal(
      article.querySelector("time").getAttribute("datetime"),
      time.getAttribute("datetime"),
    );
    assert.equal(
      time.getAttribute("datetime").slice(0, 4),
      item.closest("[data-year]").getAttribute("data-year"),
    );
  }
  assert.ok(
    !links(doc).some(
      (href) => href === "/blog/" || href?.includes("private-draft"),
    ),
  );
  assert.deepEqual(
    [...doc.querySelectorAll(".social-link")].map((a) => [
      a.textContent.trim(),
      a.getAttribute("href"),
    ]),
    [
      ["GitHub", "https://github.com"],
      ["X", "https://x.com"],
      ["B站", "https://www.bilibili.com"],
      ["小红书", "https://www.xiaohongshu.com"],
    ],
  );
  for (const link of doc.querySelectorAll(".social-link")) {
    const svg = link.querySelector("svg");
    assert.equal(svg?.getAttribute("viewBox"), "0 0 24 24");
    assert.ok(
      svg.querySelector("path")?.getAttribute("d")?.length > 50,
      `${link.textContent.trim()} needs a real brand mark`,
    );
  }
});

test("article uses a noninteractive Blog crumb and ships rendered Markdown", async () => {
  const doc = await page("blog/markdown-field-guide");
  assert.equal(doc.querySelectorAll("h1").length, 1);
  assert.ok(doc.querySelector("h1").textContent.includes("Markdown"));
  assert.ok(doc.querySelector('nav[aria-label="面包屑"]'));
  assert.ok(
    [...doc.querySelectorAll('nav[aria-label="面包屑"] span')].some(
      (el) => el.textContent.trim() === "Blog",
    ),
  );
  assert.ok(!links(doc).includes("/blog/"));
  for (const selector of [
    ".prose h2",
    ".prose blockquote",
    ".prose pre code",
    ".prose table",
    '.prose input[type="checkbox"]',
    ".prose del",
    ".prose img",
  ]) {
    assert.ok(doc.querySelector(selector), `missing rendered ${selector}`);
  }
  const image = doc.querySelector(".prose img");
  assert.ok(image.getAttribute("alt"));
  await access(join(root, image.getAttribute("src").replace(/^\//, "")));
});

test("all public pages have native navigation and distinct metadata; drafts have no route", async () => {
  const home = await page("");
  const articlePaths = [...home.querySelectorAll(".post-list a")].map((a) =>
    a.getAttribute("href").slice(1),
  );
  const paths = ["", "about", "projects", "404", ...articlePaths];
  const titles = new Set();
  for (const path of paths) {
    const doc = await page(path);
    titles.add(doc.title);
    assert.ok(
      doc.querySelector('meta[name="description"]')?.getAttribute("content"),
    );
    assert.equal(doc.querySelectorAll("h1").length, 1);
    assert.ok(doc.querySelector("details > summary"));
    const menu = [...doc.querySelectorAll("details a")];
    assert.deepEqual(
      menu.map((a) => a.textContent.trim()),
      ["Projects", "About", "RSS"],
    );
    assert.equal(menu.at(-1).getAttribute("href"), "/rss.xml");
    assert.ok(menu.at(-1).querySelector("svg"), "RSS shows a departure arrow");
    assert.ok(doc.querySelector("button.theme-toggle"));
    assert.equal(
      doc.querySelector('link[rel="alternate"]')?.getAttribute("href"),
      "/rss.xml",
    );
    assert.ok(
      !doc.querySelector('link[rel="canonical"], meta[property="og:url"]'),
    );
  }
  assert.equal(titles.size, paths.length);
  assert.ok((await page("projects")).querySelector(".prose h2"));
  assert.ok((await page("about")).querySelector(".prose p"));
  const notFound = await page("404");
  assert.ok(links(notFound).includes("/"));
  assert.equal(
    notFound.querySelectorAll('a[href="/"][aria-current="page"]').length,
    0,
    "a missing page must not tell readers they are on Home",
  );
  await assert.rejects(access(join(root, "blog/private-draft/index.html")));
  await assert.rejects(access(join(root, "blog/index.html")));
  const feed = await readFile(join(root, "rss.xml"), "utf8");
  assert.match(feed, /<content:encoded>/);
  assert.match(feed, /Markdown 排版实验手记/);
  assert.match(feed, /写在前面/);
  assert.doesNotMatch(feed, /未公开的草稿样本|小项目/);
  assert.match(feed, /<link>\/blog\/markdown-field-guide\/<\/link>/);
  assert.doesNotMatch(feed, /<link>https?:/);
});
