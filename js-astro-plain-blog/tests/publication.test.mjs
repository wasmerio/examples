import test from "node:test";
import assert from "node:assert/strict";
import {
  isCalendarDate,
  selectPublished,
  validateSlug,
} from "../src/lib/publication.mjs";

test("only real ISO calendar days are accepted without timezone conversion", () => {
  for (const date of ["2024-02-29", "2025-12-31", "2030-01-01"])
    assert.equal(isCalendarDate(date), true);
  for (const date of [
    "2025-02-29",
    "2024-04-31",
    "2024-13-01",
    "2024-2-09",
    "2024-01-01T00:00:00Z",
  ])
    assert.equal(isCalendarDate(date), false);
});

test("flat lowercase kebab slugs alone become publication paths", () => {
  assert.equal(validateSlug("small-note"), "small-note");
  for (const slug of [
    "Upper",
    "two--words",
    "../escape",
    "nested/post",
    "trailing-",
    "a_b",
  ]) {
    assert.throws(() => validateSlug(slug), /slug/i);
  }
});

test("drafts disappear, future posts remain, and equal dates sort by slug", () => {
  const posts = [
    { id: "z-last", data: { date: "2024-01-01", draft: false } },
    { id: "hidden", data: { date: "2030-01-01", draft: true } },
    { id: "b-next", data: { date: "2025-06-01", draft: false } },
    { id: "a-first", data: { date: "2025-06-01", draft: false } },
    { id: "future", data: { date: "2030-01-01", draft: false } },
  ];
  assert.deepEqual(
    selectPublished(posts).map(({ id }) => id),
    ["future", "a-first", "b-next", "z-last"],
  );
  assert.deepEqual(
    posts.map(({ id }) => id),
    ["z-last", "hidden", "b-next", "a-first", "future"],
  );
});

test("duplicate paths fail instead of silently overwriting a page", () => {
  assert.throws(
    () =>
      selectPublished([
        { id: "same", data: { date: "2025-01-01" } },
        { id: "same", data: { date: "2024-01-01", draft: true } },
      ]),
    /duplicate.*same/i,
  );
});
