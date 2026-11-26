/** The conformance checks (src/content/conformance.ts): a required field a source left empty is reported; a post on a list route is reported. */
import assert from "node:assert/strict";
import { test } from "node:test";
import { checks, reservedPostSlugs } from "../../src/content/conformance.ts";

const validate = (collection, entry) => checks.collections[collection].validate(entry);

test("talks: a missing date is reported", () => {
	const talk = { slug: "t", title: "A talk", event: "A conference", date: new Date("2026-09-01T08:00:00Z") };
	assert.deepEqual(validate("talks", talk), []);
	assert.deepEqual(validate("talks", { ...talk, date: undefined }), ['bad "date": undefined']);
});

test("jobs: a missing start year is reported", () => {
	const job = { slug: "j", company: "A studio", role: "Designer", start: 2020 };
	assert.deepEqual(validate("jobs", job), []);
	const problems = validate("jobs", { ...job, start: undefined });
	assert.ok(problems.includes('bad "start": undefined'), problems.join("; "));
});

test("posts: a post slugged page or category is reported (the list's own routes under /articles)", () => {
	assert.deepEqual(reservedPostSlugs([{ slug: "fog-on-the-fence-trail" }, { slug: "pages" }, { slug: "categories" }]), []);
	assert.deepEqual(reservedPostSlugs([{ slug: "page" }, { slug: "fog-on-the-fence-trail" }, { slug: "Category" }]), [
		'posts: "page" collides with the list\'s /articles/page/ routes',
		'posts: "Category" collides with the list\'s /articles/category/ routes',
	]);
});
