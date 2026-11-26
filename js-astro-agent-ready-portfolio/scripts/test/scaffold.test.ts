import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { makeRoot, run } from "./fixture.ts";

const newPost = (root: string, ...args: string[]) =>
  run("new-post.ts", ["--root", root, ...args]);
const newProject = (root: string, ...args: string[]) =>
  run("new-project.ts", ["--root", root, ...args]);

test("new-post writes a published post that check-content accepts", () => {
  const root = makeRoot();
  const { code, out } = newPost(root, "Shipping My First Agent!", "--description", "What I learned.", "--tags", "agents, ts", "--publish", "--published", "2026-03-04");
  assert.equal(code, 0, out);
  assert.match(out, /content\/posts\/shipping-my-first-agent\.md/);

  const text = readFileSync(join(root, "content/posts/shipping-my-first-agent.md"), "utf8");
  assert.match(text, /^---\ntitle: Shipping My First Agent!\n/);
  assert.match(text, /description: What I learned\./);
  assert.match(text, /published: 2026-03-04/);
  assert.match(text, /tags: \[agents, ts\]/);
  assert.doesNotMatch(text, /draft/);
  assert.equal(run("check-content.ts", ["--root", root]).code, 0);
});

test("new-post without --publish writes a hidden draft", () => {
  const root = makeRoot();
  const { code } = newPost(root, "Work in progress");
  assert.equal(code, 0);
  const text = readFileSync(join(root, "content/posts/work-in-progress.md"), "utf8");
  assert.match(text, /draft: true/);
  assert.equal(run("check-content.ts", ["--root", root]).code, 0);
});

test("new-post --publish needs a description", () => {
  const root = makeRoot();
  const { code, out } = newPost(root, "No summary", "--publish");
  assert.equal(code, 1);
  assert.match(out, /--description/);
  assert.equal(existsSync(join(root, "content/posts/no-summary.md")), false);
});

test("new-post never overwrites an existing post", () => {
  const root = makeRoot();
  const before = readFileSync(join(root, "content/posts/first.md"), "utf8");
  const { code, out } = newPost(root, "First");
  assert.equal(code, 1);
  assert.match(out, /content\/posts\/first\.md already exists/);
  assert.equal(readFileSync(join(root, "content/posts/first.md"), "utf8"), before);
});

test("new-post rejects a bad date and a missing title", () => {
  const root = makeRoot();
  assert.equal(newPost(root, "T", "--published", "yesterday").code, 1);
  const none = newPost(root);
  assert.equal(none.code, 1);
  assert.match(none.out, /title/i);
});

test("new-project writes a page that check-content accepts", () => {
  const root = makeRoot();
  const { code, out } = newProject(root, "Cool Lib", "--repo", "https://github.com/alex/cool-lib", "--description", "A cool library.", "--updated", "2026-02-01");
  assert.equal(code, 0, out);
  assert.match(out, /content\/projects\/cool-lib\.md/);
  const text = readFileSync(join(root, "content/projects/cool-lib.md"), "utf8");
  assert.match(text, /title: Cool Lib\n/);
  assert.match(text, /repo: https:\/\/github\.com\/alex\/cool-lib/);
  assert.equal(run("check-content.ts", ["--root", root]).code, 0);
});

test("new-project needs --repo and --description and never overwrites", () => {
  const root = makeRoot();
  const missing = newProject(root, "X");
  assert.equal(missing.code, 1);
  assert.match(missing.out, /--repo/);
  const exists = newProject(root, "Tool", "--repo", "https://github.com/a/b", "--description", "d");
  assert.equal(exists.code, 1);
  assert.match(exists.out, /already exists/);
});
