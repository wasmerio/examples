import test from "node:test";
import assert from "node:assert/strict";
import { remarkReadingTime } from "./remark-reading-time.mjs";

const tree = (text) => ({
  type: "root",
  children: [{ type: "text", value: text }],
});

// Minimal stand-in for the `file` argument Astro's remarkPlugins receive:
// the plugin under test only reads/writes data.astro.frontmatter.
const fakeFile = () => ({ data: { astro: { frontmatter: {} } } });

test("short text still floors minutesRead at 1", () => {
  const file = fakeFile();
  remarkReadingTime()(tree("hello"), file);
  assert.equal(file.data.astro.frontmatter.minutesRead, 1);
});

test("6x repeated CJK text reads longer than 1x", () => {
  // "字" is a single CJK ideograph; reading-time counts CJK text per
  // character rather than per word (see the plugin's own comment).
  const unit = "字".repeat(60);

  const once = fakeFile();
  remarkReadingTime()(tree(unit), once);

  const sixTimes = fakeFile();
  remarkReadingTime()(tree(unit.repeat(6)), sixTimes);

  assert.ok(
    sixTimes.data.astro.frontmatter.minutesRead >
      once.data.astro.frontmatter.minutesRead,
  );
});
