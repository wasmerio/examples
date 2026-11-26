import test from "node:test";
import assert from "node:assert/strict";
import { remarkMermaid } from "./remark-mermaid.mjs";

const tree = (lang, value) => ({
  type: "root",
  children: [{ type: "code", lang, value }],
});

test("mermaid fence becomes an html mermaid div", () => {
  const t = tree("mermaid", "graph TD; A-->B");
  remarkMermaid()(t);
  assert.equal(t.children[0].type, "html");
  assert.match(t.children[0].value, /^<div class="mermaid">/);
  assert.ok(t.children[0].value.includes("graph TD; A--&gt;B"));
});

test("other fences untouched", () => {
  const t = tree("ts", "const a = 1");
  remarkMermaid()(t);
  assert.equal(t.children[0].type, "code");
});
