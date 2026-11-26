// Guards the notoFonts integration's output (astro.config.mjs): the async
// font stylesheet must reference only files that were actually copied, and
// the render-blocking bundle must stay free of @font-face declarations.
// Runs against dist/ — skips when there is no build (CI runs build first).
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";

const CSS = new URL("../dist/fonts/noto-sans-tc.css", import.meta.url);
const FILES = new URL("../dist/fonts/files/", import.meta.url);
const ASTRO = new URL("../dist/_astro/", import.meta.url);
const built = existsSync(CSS);

test("font css references only copied files, no woff fallbacks", { skip: !built }, () => {
  const css = readFileSync(CSS, "utf8");
  const referenced = [...css.matchAll(/url\(\.\/files\/([^)]+)\)/g)].map(
    (m) => m[1],
  );
  assert.ok(referenced.length >= 300, `expected ~315 refs, got ${referenced.length}`);
  assert.equal(css.match(/format\('woff'\)/g), null, "woff fallbacks must be stripped");
  assert.equal(css.match(/font-display: swap/g), null, "font-display must be optional, not swap");
  assert.ok(
    (css.match(/font-display: optional/g) || []).length >= 300,
    "optional rewrite missing",
  );
  const copied = new Set(readdirSync(FILES));
  const dangling = referenced.filter((f) => !copied.has(f));
  assert.deepEqual(dangling, [], "css references missing font files");
  const dead = [...copied].filter((f) => !referenced.includes(f));
  assert.deepEqual(dead, [], "copied font files nothing references");
});

test("render-blocking bundles carry no @font-face", { skip: !built }, () => {
  for (const f of readdirSync(ASTRO).filter((f) => f.endsWith(".css"))) {
    const css = readFileSync(new URL(f, ASTRO), "utf8");
    assert.ok(!css.includes("@font-face"), `${f} still declares fonts`);
  }
});
