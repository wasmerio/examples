/** Single terms (src/content/terms.ts): a post's one category and one series. */
import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { clearTermProblems, oneTerm, termProblems } from "../../src/content/terms.ts";

afterEach(() => clearTermProblems());

const design = { slug: "design", label: "Design" };
const tools = { slug: "tools", label: "Tools" };

test("the first term is kept; two or more are recorded", () => {
	assert.equal(oneTerm([], 'post "a".category'), undefined);
	assert.deepEqual(oneTerm([design], 'post "a".category'), design);
	assert.deepEqual(termProblems(), []);
	assert.deepEqual(oneTerm([design, tools], 'post "b".category'), design);
	assert.equal(termProblems().length, 1);
	assert.match(termProblems()[0], /^post "b"\.category: 2 terms \(design, tools\); one at most/);
});

test("a fixed post stops being reported", () => {
	oneTerm([design, tools], 'post "b".series');
	oneTerm([design], 'post "b".series');
	assert.deepEqual(termProblems(), []);
});
