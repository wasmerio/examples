/** What each home section shows (src/utils/home.ts). */
import assert from "node:assert/strict";
import { test } from "node:test";
import { collageToShow, HOME_LIMITS, homeCards, pickPosts, pickProjects } from "../../src/utils/home.ts";

const posts = (n) => Array.from({ length: n }, (_, i) => ({ slug: `p${i}` }));

test("the newest posts: five at most, fewer is fine, order kept", () => {
	assert.equal(HOME_LIMITS.posts, 5);
	assert.deepEqual(pickPosts(posts(12)).map((p) => p.slug), ["p0", "p1", "p2", "p3", "p4"]);
	assert.equal(pickPosts(posts(2)).length, 2);
	assert.deepEqual(pickPosts([]), []);
});

test("featured projects: three at most, none when Projects is off", () => {
	assert.equal(HOME_LIMITS.projects, 3);
	assert.equal(pickProjects(posts(5), true).length, 3);
	assert.equal(pickProjects(posts(2), true).length, 2);
	assert.deepEqual(pickProjects(posts(5), false), []);
});

test("the collage renders 4, 5 or 6 photos; any other count shows no band (the setup check reports it)", () => {
	for (const n of [4, 5, 6]) assert.equal(collageToShow(posts(n)).length, n, `${n} photos`);
	for (const n of [0, 1, 3, 7]) assert.deepEqual(collageToShow(posts(n)), [], `${n} photos`);
});

test("the side cards: Work with jobs or a CV, Projects only when on and not empty", () => {
	assert.deepEqual(homeCards({ jobs: 4, cvFile: "/cv.pdf", projects: 3, projectsOn: true }), { work: true, projects: true });
	assert.deepEqual(homeCards({ jobs: 0, cvFile: "/cv.pdf", projects: 0, projectsOn: true }), { work: true, projects: false });
	assert.deepEqual(homeCards({ jobs: 0, projects: 3, projectsOn: false }), { work: false, projects: false });
	assert.deepEqual(homeCards({ jobs: 2, projects: 3, projectsOn: true }), { work: true, projects: true });
});
