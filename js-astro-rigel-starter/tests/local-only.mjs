import assert from "node:assert/strict";

const target = new URL(process.env.RIGEL_URL || "http://127.0.0.1:4321/rigel/");
assert.ok(target.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(target.hostname) && !target.username && !target.password, "Browser tests require a local HTTP dev server");
