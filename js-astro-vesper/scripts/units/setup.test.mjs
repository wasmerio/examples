/**
 * The setup reader (src/utils/setup.ts): the newsletter's state, the CV link, the collage count, the setup problems a
 * build checks, how the check stops a build or warns, and the test-only settings override.
 */
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
	checkSetup,
	identityOf,
	SAMPLE_IDENTITY,
	collageState,
	cvHref,
	formSending,
	isDemoForm,
	isLinkValue,
	isPlaceholderEmail,
	isRealOrigin,
	newsletterState,
	PLACEHOLDER_ORIGIN,
	sendableForm,
	setupProblems,
	siteIsLive,
	siteSettings,
	testSettingsNotice,
	withoutPlaceholderForms,
	withoutPlaceholderLinks,
	withTestSettings,
} from "../../src/utils/setup.ts";
import { checkedHref, checkedMenu } from "../../src/content/links.ts";
import { isPlaceholderValue, liveHref } from "../../src/utils/placeholders.ts";

const base = { title: "Vesper", name: "Rowan", headline: "Hi", socials: [] };
const md = (text) => ({ format: "markdown", value: { body: text } });
const page = (slug, text) => ({ slug, title: slug, body: md(text) });
const photos = (n) => Array.from({ length: n }, (_, i) => ({ slug: `p${i}` }));
const anyFile = () => true;
const noFile = () => false;
const ICONS = ["github", "instagram", "rss", "website"];
/** A clean setup: a real newsletter service, a CV in public/, known icons, no markers. */
const clean = {
	...base,
	socials: [{ label: "GitHub", href: "https://github.com/rowan", icon: "github" }],
	newsletterAction: "https://buttondown.com/api/emails/embed-subscribe/rowan",
	newsletterOptions: { honeypot: { name: "_hp" } },
	cvFile: "/files/cv.pdf",
};
const problemsOf = (settings, opts = {}) => setupProblems(settings, { photos: photos(6), pages: [], publicFile: anyFile, icons: ICONS, ...opts });
const none = { errors: [], placeholders: [], markers: [], warnings: [] };

// ---------------------------------------------------------------------------
// Links

test("isLinkValue: https: URLs and site paths only", () => {
	for (const value of ["https://x.com/a", "/files/cv.pdf"]) assert.equal(isLinkValue(value), true, value);
	for (const value of ["http://x.com", "mailto:a@b.c", "//x.com", "x.com", "https://", "/a b", "javascript:alert(1)", "/\\evil.com", "#top", "", undefined, null, 3])
		assert.equal(isLinkValue(value), false, String(value));
});

// ---------------------------------------------------------------------------
// The newsletter

test("newsletterState: a form with the action and the options", () => {
	const state = newsletterState({ newsletterAction: "https://n.com/sub", newsletterOptions: { emailName: "EMAIL", honeypot: { name: "_hp" }, nameField: true, nameName: "FNAME", hiddenFields: [{ name: "list", value: "7" }] } }, { origin: "https://rowan.com" });
	assert.deepEqual(state, {
		kind: "form",
		props: { action: "https://n.com/sub", emailName: "EMAIL", honeypot: { name: "_hp" }, nameField: true, nameName: "FNAME", hiddenFields: [{ name: "list", value: "7" }] },
	});
	assert.deepEqual(newsletterState({ newsletterAction: "https://n.com/sub" }, { origin: "https://rowan.com" }), { kind: "form", props: { action: "https://n.com/sub" } }, "no empty keys");
});

test("newsletterState: no action, or one that is not a link value, follows by RSS (fail closed)", () => {
	for (const action of [undefined, "", "javascript:alert(1)", "http://n.com/sub", "mailto:a@b.c"]) assert.deepEqual(newsletterState({ newsletterAction: action }, { origin: "https://rowan.com" }), { kind: "rss" }, String(action));
});

test("newsletterState: a site-path hidden value is absolute on a real origin and dropped on the placeholder origin", () => {
	const settings = { newsletterAction: "https://n.com/sub", newsletterOptions: { hiddenFields: [{ name: "redirect", value: "/thanks" }, { name: "list", value: "7" }] } };
	assert.deepEqual(newsletterState(settings, { origin: "https://rowan.com" }).props.hiddenFields, [
		{ name: "redirect", value: "https://rowan.com/thanks" },
		{ name: "list", value: "7" },
	]);
	assert.equal(PLACEHOLDER_ORIGIN, "https://example.com");
	assert.deepEqual(newsletterState(settings, { origin: PLACEHOLDER_ORIGIN }).props.hiddenFields, [{ name: "list", value: "7" }]);
	const only = { newsletterAction: "https://n.com/sub", newsletterOptions: { hiddenFields: [{ name: "redirect", value: "/thanks" }] } };
	assert.equal(newsletterState(only, { origin: "https://example.com/" }).props.hiddenFields, undefined, "none left: no key");
	const bad = { newsletterAction: "https://n.com/sub", newsletterOptions: { hiddenFields: [{ name: "next", value: "javascript:alert(1)" }] } };
	assert.equal(newsletterState(bad, { origin: "https://rowan.com" }).props.hiddenFields, undefined, "a bad link value is dropped");
});

// ---------------------------------------------------------------------------
// The CV and the collage

test("cvHref: a site path or an https: URL, else nothing", () => {
	assert.equal(cvHref({ cvFile: "/files/cv.pdf" }), "/files/cv.pdf");
	assert.equal(cvHref({ cvFile: "https://cdn.rowan.com/cv.pdf" }), "https://cdn.rowan.com/cv.pdf");
	for (const bad of [undefined, "", "javascript:alert(1)", "http://x.com/cv.pdf", "files/cv.pdf"]) assert.equal(cvHref({ cvFile: bad }), undefined, String(bad));
});

test("collageState: none for 0, ok for 4 to 6, invalid for any other count", () => {
	assert.equal(collageState(photos(0)), "none");
	for (const n of [4, 5, 6]) assert.equal(collageState(photos(n)), "ok", `${n}`);
	for (const n of [1, 2, 3, 7, 12]) assert.equal(collageState(photos(n)), "invalid", `${n}`);
});

// ---------------------------------------------------------------------------
// Setup problems

test("a clean setup has no problems; so does one with no newsletter, CV or collage", () => {
	assert.deepEqual(problemsOf(clean, { pages: [page("privacy", "We use Buttondown.")] }), none);
	assert.deepEqual(problemsOf(base, { photos: [] }), none);
});

test("setupProblems: a collage count that is not 0, 4, 5 or 6 is an error naming the count", () => {
	for (const n of [1, 3, 7]) {
		const { errors } = problemsOf(clean, { photos: photos(n) });
		assert.equal(errors.length, 1, `${n}: ${JSON.stringify(errors)}`);
		assert.match(errors[0], new RegExp(`collage: ${n} photo`));
		assert.match(errors[0], /0, 4, 5 or 6/);
	}
	for (const n of [0, 4, 5, 6]) assert.deepEqual(problemsOf(clean, { photos: photos(n) }).errors, [], `${n}`);
});

test("setupProblems: the CV file is looked up in public/ (a full URL is not)", () => {
	const { errors } = problemsOf({ ...clean, cvFile: "/files/nope.pdf" }, { publicFile: (p) => p !== "/files/nope.pdf" });
	assert.equal(errors.length, 1);
	assert.match(errors[0], /cvFile: "\/files\/nope\.pdf" is not a file in public\//);
	assert.deepEqual(problemsOf(clean, { publicFile: anyFile }).errors, [], "present: no problem");
	assert.deepEqual(problemsOf({ ...clean, cvFile: "https://cdn.rowan.com/cv.pdf" }, { publicFile: noFile }).errors, [], "a full URL is not looked up");
});

test("setupProblems finds each error", () => {
	const cases = [
		[{ newsletterAction: "http://n.com/sub" }, /^newsletterAction: "http:\/\/n\.com\/sub" is neither/],
		[{ newsletterAction: "mailto:a@b.c" }, /^newsletterAction/],
		[{ cvFile: "ftp://x.com/cv.pdf" }, /^cvFile/],
		[{ cvFile: "files/cv.pdf" }, /^cvFile/],
		[{ newsletterOptions: { honeypot: { name: "email" } } }, /newsletterOptions\.honeypot.*"email"/],
		[{ newsletterOptions: { honeypot: { name: "Name" } } }, /honeypot/],
		[{ newsletterOptions: { honeypot: { name: "url" } } }, /honeypot/],
		[{ newsletterOptions: { honeypot: { name: " phone " } } }, /honeypot/],
		[{ newsletterOptions: { hiddenFields: [{ name: "next", value: "javascript:alert(1)" }] } }, /newsletterOptions\.hiddenFields "next"/],
		[{ newsletterOptions: { hiddenFields: [{ name: "next", value: "//evil.com" }] } }, /hiddenFields/],
	];
	for (const [change, re] of cases) {
		const { errors, placeholders } = problemsOf({ ...clean, ...change });
		assert.equal(errors.length, 1, `${JSON.stringify(change)}: ${JSON.stringify(errors)}`);
		assert.match(errors[0], re);
		assert.deepEqual(placeholders, [], JSON.stringify(change));
	}
	assert.deepEqual(problemsOf({ ...clean, newsletterAction: undefined, newsletterOptions: { honeypot: { name: "email" } } }).errors, [], "no action: the options are not used");
});

test("setupProblems passes on the sources' refused links as errors", () => {
	const links = ['menu "primary"[0].href: "javascript:x" is not a link a page may use.'];
	assert.deepEqual(problemsOf(clean, { links }).errors, links);
});

test("setupProblems finds each placeholder address, and the privacy page's markers apart from them", () => {
	const demo = {
		...clean,
		newsletterAction: "https://newsletter.example/rowan/subscribe",
		newsletterOptions: { hiddenFields: [{ name: "redirect", value: "/thanks" }, { name: "list", value: "https://lists.example/7" }] },
		cvFile: "https://files.example/cv.pdf",
	};
	const pages = [page("privacy", "Intro.\n\n[[fill in: your newsletter service]]\n\nMore.\n\n[[fill in: your host]]"), page("about", "No markers.")];
	const { errors, placeholders, markers } = problemsOf(demo, { pages });
	assert.deepEqual(errors, []);
	for (const re of [/^newsletterAction: https:\/\/newsletter\.example/, /^newsletterOptions\.hiddenFields "list"/, /^cvFile: https:\/\/files\.example/]) {
		assert.ok(placeholders.some((p) => re.test(p)), `${re}: ${JSON.stringify(placeholders)}`);
	}
	assert.equal(placeholders.length, 3, JSON.stringify(placeholders));
	assert.deepEqual(markers, ["pages/privacy: [[fill in: your newsletter service]]", "pages/privacy: [[fill in: your host]]"]);
	assert.deepEqual(problemsOf({ ...clean, newsletterAction: "https://example.com/sub" }).placeholders, ["newsletterAction: https://example.com/sub"], "example.com, the demo's own, is a placeholder too");
	const pt = { slug: "privacy", title: "Privacy", body: { format: "portable-text", value: [{ _type: "block", children: [{ text: "[[fill in: your host]]" }] }] } };
	assert.equal(problemsOf(clean, { pages: [pt] }).markers.length, 1, "portable text too");
});

test("setupProblems: a post's markers name the post, in its body, title or summary, in either source", () => {
	const posts = [
		{ slug: "launch-notes", title: "Launch notes", summary: "Short.", tags: [], body: md("Intro.\n\n[[fill in: the launch date]]\n\nMore.") },
		{ slug: "our-story", title: "Our story", tags: [], body: { format: "portable-text", value: [{ _type: "block", children: [{ text: "We began in [[fill " }, { text: "in: the year]]." }] }] } },
		{ slug: "untitled", title: "[[fill in: a title]]", summary: "[[Fill in: a summary]]", tags: [], body: md("Done.") },
		{ slug: "finished", title: "Finished", summary: "Short.", tags: [], body: md("A [[wiki link]], and no marker.") },
	];
	const { errors, placeholders, markers } = problemsOf(clean, { posts });
	assert.deepEqual(errors, []);
	assert.deepEqual(placeholders, []);
	assert.deepEqual(markers, [
		"posts/launch-notes: [[fill in: the launch date]]",
		"posts/our-story: [[fill in: the year]]",
		"posts/untitled: [[fill in: a title]]",
		"posts/untitled: [[Fill in: a summary]]",
	]);
});

test("setupProblems: markers in every other part a buyer writes name the entry, in each text field", () => {
	const opts = {
		pages: [{ slug: "now", title: "[[fill in: a page title]]", summary: "[[fill in: a page summary]]", imageCaption: "[[fill in: a caption]]", body: md("Done.") }],
		projects: [
			{ slug: "atlas", title: "[[fill in: a project title]]", summary: "[[fill in: a project summary]]", body: md("Intro.\n\n[[fill in: the client]]") },
			{ slug: "beacon", title: "Beacon", body: { format: "portable-text", value: [{ _type: "block", children: [{ text: "Began in [[fill " }, { text: "in: the year]]." }] }] } },
			{ slug: "finished", title: "Finished", summary: "Short.", body: md("A [[wiki link]], and no marker.") },
		],
		talks: [{ slug: "keynote", title: "[[fill in: a talk title]]", event: "[[fill in: the event]]", place: "[[fill in: the city]]", summary: "[[fill in: a talk summary]]" }],
		uses: [{ slug: "desk", group: "[[fill in: a group]]", name: "[[fill in: a name]]", note: "[[fill in: a note]]", linkLabel: "[[fill in: link words]]" }],
		jobs: [{ slug: "acme", company: "[[fill in: the company]]", role: "[[fill in: the role]]" }],
		photos: [{ slug: "lake", alt: "[[fill in: the alt text]]", place: "[[fill in: the place]]", geo: "[[fill in: the label]]" }, ...photos(5)],
	};
	const { errors, placeholders, markers } = problemsOf(clean, opts);
	assert.deepEqual(errors, []);
	assert.deepEqual(placeholders, []);
	assert.deepEqual(markers, [
		"pages/now: [[fill in: a page title]]",
		"pages/now: [[fill in: a page summary]]",
		"pages/now: [[fill in: a caption]]",
		"projects/atlas: [[fill in: a project title]]",
		"projects/atlas: [[fill in: a project summary]]",
		"projects/atlas: [[fill in: the client]]",
		"projects/beacon: [[fill in: the year]]",
		"talks/keynote: [[fill in: a talk title]]",
		"talks/keynote: [[fill in: the event]]",
		"talks/keynote: [[fill in: the city]]",
		"talks/keynote: [[fill in: a talk summary]]",
		"uses/desk: [[fill in: a group]]",
		"uses/desk: [[fill in: a name]]",
		"uses/desk: [[fill in: a note]]",
		"uses/desk: [[fill in: link words]]",
		"jobs/acme: [[fill in: the company]]",
		"jobs/acme: [[fill in: the role]]",
		"collage/lake: [[fill in: the alt text]]",
		"collage/lake: [[fill in: the place]]",
		"collage/lake: [[fill in: the label]]",
	]);
});

test("checkSetup: a project's marker stops the build with sampleContent off and only warns with it on", () => {
	const problems = problemsOf(clean, { projects: [{ slug: "atlas", title: "Atlas", body: md("[[fill in: the client]]") }] });
	assert.throws(() => checkSetup(problems, { sampleContent: false, mode: "static", warn: () => {} }), /projects\/atlas: \[\[fill in: the client\]\]/);
	const lines = [];
	assert.doesNotThrow(() => checkSetup(problems, { sampleContent: true, mode: "static", warn: (line) => lines.push(line) }));
	assert.match(lines[0], /projects\/atlas: \[\[fill in: the client\]\]/);
});

test("checkSetup: a marker stops the build only with sampleContent off, and says what to do", () => {
	const problems = problemsOf(clean, { posts: [{ slug: "launch-notes", title: "Launch notes", tags: [], body: md("[[fill in: the launch date]]") }] });
	for (const mode of ["static", "dev"]) {
		for (const sampleContent of [false, undefined]) {
			for (const live of [false, true]) {
				assert.throws(
					() => checkSetup(problems, { sampleContent, live, mode, warn: () => {} }),
					(err) => /posts\/launch-notes: \[\[fill in: the launch date\]\]/.test(err.message) && /fill it in/i.test(err.message) && /turn sampleContent on to build anyway/.test(err.message),
					`${mode} ${sampleContent} ${live}`,
				);
			}
		}
	}
	assert.doesNotThrow(() => checkSetup(problems, { sampleContent: false, mode: "production", warn: () => {} }), "a production server checks nothing");
});

test("checkSetup: with sampleContent on a marker warns and never stops, whatever SITE_URL says", () => {
	const problems = problemsOf(clean, { posts: [{ slug: "launch-notes", title: "Launch notes", tags: [], body: md("[[fill in: the launch date]]") }], pages: [page("privacy", "[[fill in: your host]]")] });
	for (const mode of ["static", "dev"]) {
		for (const live of [false, true]) {
			const out = capture();
			assert.doesNotThrow(() => checkSetup(problems, { sampleContent: true, live, mode, warn: out.warn }), `${mode} ${live}`);
			assert.equal(out.lines.length, 1, "one warning block");
			assert.match(out.lines[0], /posts\/launch-notes: \[\[fill in: the launch date\]\]/);
			assert.match(out.lines[0], /pages\/privacy: \[\[fill in: your host\]\]/);
		}
	}
});

test("checkSetup: a placeholder address at a real address stops with sampleContent on, and does not list the markers", () => {
	const problems = problemsOf({ ...clean, newsletterAction: "https://example.com/sub" }, { pages: [page("privacy", "[[fill in: your host]]")] });
	assert.deepEqual(problems.placeholders, ["newsletterAction: https://example.com/sub"]);
	assert.deepEqual(problems.markers, ["pages/privacy: [[fill in: your host]]"]);
	for (const mode of ["static", "dev"]) {
		assert.throws(
			() => checkSetup(problems, { sampleContent: true, live: true, mode, warn: () => {} }),
			(err) => /newsletterAction: https:\/\/example\.com\/sub/.test(err.message) && /1 problem\(s\)/.test(err.message) && !/fill in: your host/.test(err.message),
			mode,
		);
		assert.throws(() => checkSetup(problems, { sampleContent: false, live: true, mode, warn: () => {} }), (err) => /example\.com\/sub/.test(err.message) && /fill in: your host/.test(err.message) && /2 problem\(s\)/.test(err.message), mode);
		const out = capture();
		assert.doesNotThrow(() => checkSetup(problems, { sampleContent: true, live: false, mode, warn: out.warn }), mode);
		assert.match(out.lines[0], /example\.com\/sub/);
		assert.match(out.lines[0], /fill in: your host/);
	}
});

test("setupProblems: an unknown social icon is a warning (it falls back to the Website icon)", () => {
	const { errors, warnings } = problemsOf({ ...clean, socials: [...clean.socials, { label: "Pixels", href: "https://pixels.com/rowan", icon: "pixelfed" }] });
	assert.deepEqual(errors, []);
	assert.equal(warnings.length, 1);
	assert.match(warnings[0], /socials\[1\].*"pixelfed".*Website icon/);
	assert.deepEqual(problemsOf(clean, { icons: undefined }).warnings, [], "no icon list: not checked");
});

test("setupProblems passes on the config warnings (an unknown id in settings.config)", () => {
	const { errors, warnings } = problemsOf({ ...clean, config: { accent: "teal" } });
	assert.deepEqual(errors, []);
	assert.equal(warnings.length, 1);
	assert.match(warnings[0], /accent "teal"/);
});

// ---------------------------------------------------------------------------
// The check

const capture = () => {
	const lines = [];
	return { lines, warn: (text) => lines.push(text) };
};

test("checkSetup: errors stop a static build and a dev server, listing every problem", () => {
	const problems = { errors: ["collage: 3 photos", "cvFile: bad"], placeholders: ["newsletterAction: x.example"], markers: [], warnings: ["w"] };
	for (const mode of ["static", "dev"]) {
		assert.throws(
			() => checkSetup(problems, { sampleContent: true, mode, warn: () => {} }),
			(err) => /Vesper setup/.test(err.message) && /collage: 3 photos/.test(err.message) && /cvFile: bad/.test(err.message),
			mode,
		);
	}
});

test("checkSetup: placeholders and markers stop the build unless sampleContent is on, then they are printed in one block", () => {
	const problems = { errors: [], placeholders: ["newsletterAction: https://newsletter.example/x"], markers: ["pages/privacy: [[fill in: x]]"], warnings: [] };
	for (const mode of ["static", "dev"]) {
		for (const sampleContent of [false, undefined])
			assert.throws(() => checkSetup(problems, { sampleContent, mode, warn: () => {} }), (err) => /newsletter\.example/.test(err.message) && /fill in: x/.test(err.message) && /sampleContent/.test(err.message), mode);
		const out = capture();
		checkSetup(problems, { sampleContent: true, mode, warn: out.warn });
		assert.equal(out.lines.length, 1, "one warning block");
		assert.match(out.lines[0], /newsletter\.example/);
		assert.match(out.lines[0], /fill in: x/);
	}
});

test("checkSetup: warnings are printed and never stop the build; nothing to say prints nothing", () => {
	const out = capture();
	checkSetup({ errors: [], placeholders: [], markers: [], warnings: ["an icon"] }, { sampleContent: false, mode: "static", warn: out.warn });
	assert.equal(out.lines.length, 1);
	assert.match(out.lines[0], /an icon/);
	const quiet = capture();
	checkSetup(none, { sampleContent: false, mode: "static", warn: quiet.warn });
	assert.deepEqual(quiet.lines, []);
});

test("checkSetup: a production server checks nothing", () => {
	const out = capture();
	checkSetup({ errors: ["broken"], placeholders: ["x.example"], markers: ["pages/a: [[fill in: x]]"], warnings: ["w"] }, { sampleContent: false, mode: "production", warn: out.warn });
	assert.deepEqual(out.lines, []);
});

// ---------------------------------------------------------------------------
// VESPER_SETTINGS (test only)

test("withTestSettings: no override gives the settings as they are", () => {
	assert.equal(withTestSettings(clean, ""), clean);
	assert.equal(withTestSettings(clean, undefined), clean);
});

test("withTestSettings: set keys win, null clears one", () => {
	const out = withTestSettings(clean, JSON.stringify({ newsletterAction: null, cvFile: "/files/other.pdf", nowStatus: "Out", nowLabel: "Status", sampleContent: true, newsletterOptions: { emailName: "EMAIL" } }));
	assert.equal(out.newsletterAction, undefined);
	assert.equal(out.cvFile, "/files/other.pdf");
	assert.equal(out.nowStatus, "Out");
	assert.equal(out.nowLabel, "Status");
	assert.equal(out.sampleContent, true);
	assert.deepEqual(out.newsletterOptions, { emailName: "EMAIL" });
	assert.deepEqual(out.socials, clean.socials, "keys left out stay");
	assert.equal(clean.newsletterAction, "https://buttondown.com/api/emails/embed-subscribe/rowan", "the input is not changed");
});

test("withTestSettings: an unknown key or bad JSON stops the build", () => {
	assert.throws(() => withTestSettings(clean, JSON.stringify({ config: { look: "trail" } })), /"config" cannot be set/);
	assert.throws(() => withTestSettings(clean, JSON.stringify({ title: "X" })), /"title" cannot be set/);
	assert.throws(() => withTestSettings(clean, "{nope"), /JSON/);
	assert.throws(() => withTestSettings(clean, "[1]"), /object/);
});

test("siteSettings: the content's settings, with VESPER_SETTINGS over them when it is set", async () => {
	const content = { settings: async () => clean };
	const before = process.env.VESPER_SETTINGS;
	try {
		delete process.env.VESPER_SETTINGS;
		assert.equal(await siteSettings(content), clean);
		process.env.VESPER_SETTINGS = JSON.stringify({ cvFile: null });
		assert.equal((await siteSettings(content)).cvFile, undefined);
		assert.match(testSettingsNotice(), /^VESPER_SETTINGS is set \(test only\): \{"cvFile":null\}/);
	} finally {
		if (before === undefined) delete process.env.VESPER_SETTINGS;
		else process.env.VESPER_SETTINGS = before;
	}
	assert.equal(testSettingsNotice(""), undefined, "not set: no notice");
});

// ---------------------------------------------------------------------------
// Chunk E review

test("a placeholder host with a trailing dot is still a placeholder", () => {
	const { errors, placeholders } = problemsOf({ ...clean, newsletterAction: "https://letters.example./x" });
	assert.deepEqual(errors, []);
	assert.deepEqual(placeholders, ["newsletterAction: https://letters.example./x"]);
	assert.equal(problemsOf({ ...clean, cvFile: "https://files.example./cv.pdf" }).placeholders.length, 1);
	assert.equal(problemsOf({ ...clean, newsletterOptions: { hiddenFields: [{ name: "list", value: "https://lists.example./7" }] } }).placeholders.length, 1);
});

test("hidden values: plain values with a colon stay; only real links are judged as links", () => {
	const origin = { origin: "https://rowan.com" };
	for (const plain of ["12:30", "tag:news", "list:7", "7"]) {
		const settings = { ...clean, newsletterOptions: { hiddenFields: [{ name: "v", value: plain }] } };
		assert.deepEqual(problemsOf(settings).errors, [], plain);
		assert.deepEqual(newsletterState(settings, origin).props.hiddenFields, [{ name: "v", value: plain }], plain);
	}
	for (const link of ["//evil.com/x", "javascript:alert(1)", "JavaScript:alert(1)", "data:text/html,x", "http://lists.rowan.com/7", "mailto:a@b.c", "ftp://x.com/a", "file:///etc/passwd", "vbscript:x", "foo://host/x"]) {
		const settings = { ...clean, newsletterOptions: { hiddenFields: [{ name: "v", value: link }] } };
		assert.equal(problemsOf(settings).errors.length, 1, link);
		assert.equal(newsletterState(settings, origin).props.hiddenFields, undefined, link);
	}
});

test("setupProblems: social links and menu links (children too) on an .example host are placeholders", () => {
	const socials = [
		{ label: "GitHub", href: "https://code.example/rowan", icon: "github" },
		{ label: "RSS", href: "/rss.xml", icon: "rss" },
		{ label: "Bluesky", href: "https://bsky.app/profile/rowan", icon: "bluesky" },
	];
	const menus = {
		primary: [{ label: "About", href: "/about" }, { label: "Shop", href: "https://shop.example/", children: [{ label: "Prints", href: "https://prints.example./x" }] }],
		footer: [{ label: "Now", href: "/now" }],
	};
	const { errors, placeholders } = problemsOf({ ...clean, socials }, { menus });
	assert.deepEqual(errors, []);
	assert.deepEqual(placeholders, [
		"socials[0] (GitHub): https://code.example/rowan",
		"menus.primary[1] (Shop): https://shop.example/",
		"menus.primary[1].children[0] (Prints): https://prints.example./x",
	]);
	assert.deepEqual(problemsOf(clean, { menus: { primary: [{ label: "Home", href: "https://example.com/" }] } }).placeholders, ["menus.primary[0] (Home): https://example.com/"], "example.com is a placeholder too");
});

// ---------------------------------------------------------------------------
// Markdown SEO fields

test("setupProblems: an entry's SEO canonical on an .example host is a placeholder; a real one, or none, is not", () => {
	const entries = [
		{ at: "posts/a", seo: { canonical: "https://notes.example/a/" } },
		{ at: "projects/b", seo: { canonical: "https://rowan.com/b/" } },
		{ at: "pages/c", seo: { title: "C" } },
		{ at: "pages/d" },
	];
	const { errors, placeholders } = problemsOf(clean, { entries });
	assert.deepEqual(errors, []);
	assert.deepEqual(placeholders, ["posts/a seo.canonical: https://notes.example/a/"]);
	assert.deepEqual(problemsOf(clean, { entries: [{ at: "posts/a", seo: { canonical: "https://example.com/a/" } }] }).placeholders, ["posts/a seo.canonical: https://example.com/a/"], "example.com is a placeholder too");
});

// ---------------------------------------------------------------------------
// Placeholder addresses: nothing a visitor types goes to example.com

/** Built here, so the release scan stays clear of an address on a host that is not a placeholder. */
const mailAt = (host) => ["hello", host].join("@");
/** Every placeholder host: example.com, example.org, example.net with their subdomains, and the `.example` top-level domain. */
const PLACEHOLDERS = ["https://example.com/newsletter/subscribe", "https://EXAMPLE.com/a", "https://sub.example.com/a", "https://example.org/a", "https://a.example.net/a", "https://letters.example/a", "https://letters.example./a", "https://example/a"];
/** Look-alikes and real services: a form on one is real. */
const REAL = ["https://buttondown.com/api/emails/embed-subscribe/rowan", "https://notexample.com/a", "https://example.com.evil.net/a", "https://example.org.test/a", "/subscribe"];

test("a placeholder host in a setting is a placeholder; a look-alike is not", () => {
	for (const action of PLACEHOLDERS) assert.deepEqual(problemsOf({ ...clean, newsletterAction: action }).placeholders, [`newsletterAction: ${action}`], action);
	for (const action of REAL) assert.deepEqual(problemsOf({ ...clean, newsletterAction: action }).placeholders, [], action);
});

test("isPlaceholderEmail: on a placeholder host only; a social or menu mailto link on one is a placeholder", () => {
	for (const host of ["example.com", "sub.example.com", "example.org", "example.net", "rowan.example"]) assert.ok(isPlaceholderEmail(mailAt(host)), host);
	for (const host of ["notexample.com", "example.com.evil.net", "example.org.test", "rowan.test"]) assert.ok(!isPlaceholderEmail(mailAt(host)), host);
	const mailto = `mailto:${mailAt("example.com")}`;
	assert.deepEqual(problemsOf({ ...clean, socials: [{ label: "Email", href: mailto, icon: "email" }] }).placeholders, [`socials[0] (Email): ${mailto}`]);
	assert.deepEqual(problemsOf(clean, { menus: { footer: [{ label: "Email", href: mailto }] } }).placeholders, [`menus.footer[0] (Email): ${mailto}`]);
	assert.deepEqual(problemsOf({ ...clean, socials: [{ label: "Email", href: `mailto:${mailAt("rowan.test")}`, icon: "email" }] }).placeholders, []);
});

test("a social link to a profile site's home page (no username) is a placeholder; a profile, or the owner's own site, is not", () => {
	for (const href of ["https://github.com", "https://github.com/", "https://www.instagram.com", "https://www.linkedin.com", "https://bsky.app", "https://GitHub.com/"]) {
		const { errors, placeholders } = problemsOf({ ...clean, socials: [{ label: "Profile", href, icon: "website" }] });
		assert.deepEqual(errors, []);
		assert.equal(placeholders.length, 1, href);
		assert.ok(placeholders[0].startsWith(`socials[0] (Profile): ${href}`), placeholders[0]);
	}
	for (const href of ["https://github.com/rowan", "https://bsky.app/profile/rowan", "https://www.linkedin.com/in/rowan", "https://rowan.com", "https://rowan.com/", "https://notgithub.com", "/rss.xml"])
		assert.deepEqual(problemsOf({ ...clean, socials: [{ label: "Profile", href, icon: "website" }] }).placeholders, [], href);
});

test("setupProblems: a project's, talk's, uses item's, job's or collage photo's link on a placeholder host is a placeholder; a real one, or none, is not", () => {
	const contentLinks = [
		{ at: "projects/a.link", href: "https://example.com/a" },
		{ at: "talks/b.video", href: "https://sub.example.com/b" },
		{ at: "talks/b.slides", href: "https://slides.example/b" },
		{ at: "uses/c.link", href: "https://example.org/c" },
		{ at: "jobs/d.link", href: "https://example.net/d" },
		{ at: "collage/e.link", href: "https://example.com/e" },
		{ at: "projects/f.link", href: "https://rowan.com/f" },
		{ at: "projects/g.link", href: "/g" },
		{ at: "projects/h.link" },
	];
	const { errors, placeholders } = problemsOf(clean, { contentLinks });
	assert.deepEqual(errors, []);
	assert.deepEqual(placeholders, contentLinks.slice(0, 6).map(({ at, href }) => `${at}: ${href}`));
});

test("a demo's root-domain social links do not stop its build: they stop only with sampleContent off, or at a real address", () => {
	const problems = problemsOf({ ...clean, socials: [{ label: "GitHub", href: "https://github.com", icon: "github" }] });
	assert.equal(problems.placeholders.length, 1);
	const out = capture();
	checkSetup(problems, { sampleContent: true, mode: "static", warn: out.warn });
	assert.match(out.lines[0], /github\.com/);
	assert.throws(() => checkSetup(problems, { sampleContent: false, mode: "static", warn: () => {} }), /github\.com/);
	assert.throws(() => checkSetup(problems, { sampleContent: true, live: true, mode: "static", warn: () => {} }), /github\.com/);
});

test("checkSetup: sampleContent allows placeholder addresses only while the site is not live", () => {
	const problems = { errors: [], placeholders: ["newsletterAction: https://example.com/x"], markers: [], warnings: [] };
	for (const mode of ["static", "dev"]) {
		assert.throws(() => checkSetup(problems, { sampleContent: true, live: true, mode, warn: () => {} }), (err) => /example\.com\/x/.test(err.message) && /real site/.test(err.message), mode);
		assert.doesNotThrow(() => checkSetup(problems, { sampleContent: true, live: false, mode, warn: () => {} }), mode);
		assert.throws(() => checkSetup(problems, { sampleContent: false, live: false, mode, warn: () => {} }), /example\.com\/x/, mode);
	}
	assert.doesNotThrow(() => checkSetup(problems, { sampleContent: true, live: true, mode: "production", warn: () => {} }), "a production server checks nothing: withoutPlaceholderForms guards it");
});

test("a real address is not the placeholder, not a placeholder host and not this machine", () => {
	for (const origin of [undefined, "", PLACEHOLDER_ORIGIN, "http://example.com", "https://sub.example.com", "https://old-demo.example", "http://localhost:4321", "http://127.0.0.1:4630", "http://[::1]:4321", "nope"]) assert.equal(isRealOrigin(origin), false, String(origin));
	for (const origin of ["https://rowan.test", "https://notexample.com", "https://example.com.evil.net"]) assert.equal(isRealOrigin(origin), true, origin);
});

test("a site is live at a real address or on a production server, never in the hosted demo's copy", () => {
	const buyer = mkdtempSync(join(tmpdir(), "vesper-live-"));
	const demo = mkdtempSync(join(tmpdir(), "vesper-live-"));
	mkdirSync(join(demo, "src/demo-brand"), { recursive: true });
	try {
		assert.equal(siteIsLive("https://rowan.test", false, buyer), true);
		assert.equal(siteIsLive(PLACEHOLDER_ORIGIN, true, buyer), true, "a server may not know its address");
		assert.equal(siteIsLive("http://localhost:4321", false, buyer), false);
		assert.equal(siteIsLive(PLACEHOLDER_ORIGIN, false, buyer), false);
		assert.equal(siteIsLive("https://rowan.test", false, demo), false);
		assert.equal(siteIsLive("https://rowan.test", true, demo), false);
	} finally {
		rmSync(buyer, { recursive: true });
		rmSync(demo, { recursive: true });
	}
});

test("a placeholder form on a site that is not live posts to a data URL; on a live site it does not draw; a real form stays as it is", () => {
	for (const action of PLACEHOLDERS) {
		assert.ok(isDemoForm({ action }, false), action);
		assert.ok(!isDemoForm({ action }, true), action);
		assert.equal(sendableForm({ action }, true), undefined, action);
		assert.deepEqual(sendableForm({ action }, false), { action }, action);
		const sending = formSending({ action }, false);
		assert.match(sending.action, /^data:application\/json,/, action);
		assert.equal(sending.enhance, "fetch", "a plain post of a data URL shows nothing");
		assert.equal(sending.successText, "This is a demo, so nothing was sent.");
		assert.ok(!sending.action.includes("example"), "the address is not in the page");
	}
	for (const action of REAL) {
		for (const live of [true, false]) {
			assert.ok(!isDemoForm({ action }, live), action);
			assert.deepEqual(sendableForm({ action }, live), { action }, action);
			assert.deepEqual(formSending({ action }, live), { action }, action);
		}
	}
	assert.equal(sendableForm(undefined, true), undefined);
});

test("newsletterState: on a placeholder action, Follow by RSS on a live site, a demo form on a site that is not live", () => {
	const options = { honeypot: { name: "_hp" }, hiddenFields: [{ name: "list", value: "7" }] };
	for (const action of PLACEHOLDERS) {
		assert.deepEqual(newsletterState({ newsletterAction: action, newsletterOptions: options }, { origin: "https://rowan.test", live: true }), { kind: "rss" }, action);
		assert.deepEqual(newsletterState({ newsletterAction: action, newsletterOptions: options }, { origin: "https://rowan.test" }), { kind: "rss" }, `${action}: a caller that does not say counts as live`);
		const demo = newsletterState({ newsletterAction: action, newsletterOptions: options }, { origin: PLACEHOLDER_ORIGIN, live: false });
		assert.equal(demo.kind, "form", action);
		assert.equal(demo.demo, true, action);
		assert.match(demo.props.action, /^data:/);
		assert.equal(demo.props.enhance, "fetch");
		assert.deepEqual(demo.props.honeypot, options.honeypot, "the demo form is the real form's shape");
		assert.deepEqual(demo.props.hiddenFields, options.hiddenFields);
	}
	for (const live of [true, false])
		for (const action of REAL) assert.deepEqual(newsletterState({ newsletterAction: action }, { origin: "https://rowan.test", live }), { kind: "form", props: { action } }, `${action} stays a plain post`);
});

test("a placeholder hidden value on a real form: gone on a live site, with one line in the log; kept where the site is not live", () => {
	const redirect = { name: "redirect", value: "https://example.com/thanks" };
	const list = { name: "list", value: "7" };
	const settings = { ...clean, newsletterOptions: { honeypot: { name: "_hp" }, hiddenFields: [redirect, list] } };
	const live = newsletterState(settings, { origin: "https://rowan.test", live: true });
	assert.equal(live.props.action, clean.newsletterAction, "the form stays");
	assert.deepEqual(live.props.hiddenFields, [list]);
	assert.deepEqual(newsletterState(settings, { origin: "https://rowan.test", live: false }).props.hiddenFields, [redirect, list]);
	const lines = [];
	const out = withoutPlaceholderForms(settings, (line) => lines.push(line));
	assert.equal(out.newsletterAction, clean.newsletterAction);
	assert.deepEqual(out.newsletterOptions, { honeypot: { name: "_hp" }, hiddenFields: [list] });
	assert.deepEqual(settings.newsletterOptions.hiddenFields, [redirect, list], "the settings it was given stay as they were");
	assert.equal(lines.length, 1);
	assert.match(lines[0], /hiddenFields "redirect".*example\.com\/thanks/);
	withoutPlaceholderForms(settings, (line) => lines.push(line));
	assert.equal(lines.length, 1, "a page load does not repeat the line");
});

test("a hidden value holding a plain email on a placeholder host: gone on a live site, kept where the site is not live, listed by the check", () => {
	// Built here, as the release scan flags any other address in a shipped file.
	const mail = (name, host) => [name, host].join("@");
	for (const value of ["name@example.com", " name@example.com ", `${mail("a", "real.test")}, name@example.com`, `Desk <${mail("name", "news.example.org")}>`, "mailto:name@example.com", mail("name", "site.example")]) assert.ok(isPlaceholderValue(value), value);
	for (const value of ["7", "example", mail("name", "real.test"), `${mail("a", "real.test")}, ${mail("b", "real.test")}`, "https://real.test/thanks", "12:30"]) assert.ok(!isPlaceholderValue(value), value);
	const cc = { name: "_cc", value: "name@example.com" };
	const list = { name: "list", value: "7" };
	const settings = { ...clean, newsletterOptions: { hiddenFields: [cc, list] } };
	assert.deepEqual(newsletterState(settings, { origin: "https://rowan.test", live: true }).props.hiddenFields, [list]);
	assert.deepEqual(newsletterState(settings, { origin: "https://rowan.test", live: false }).props.hiddenFields, [cc, list]);
	assert.deepEqual(withoutPlaceholderForms(settings, () => {}).newsletterOptions.hiddenFields, [list]);
	assert.ok(problemsOf(settings).placeholders.some((line) => line.includes('hiddenFields "_cc": name@example.com')));
});

test("a live server's settings have no form on a placeholder address, with one line in the log, and keep a real one", () => {
	const lines = [];
	const settings = { ...clean, newsletterAction: "https://example.com/newsletter/subscribe" };
	const out = withoutPlaceholderForms(settings, (line) => lines.push(line));
	assert.equal(out.newsletterAction, undefined);
	assert.equal(out.newsletterOptions, undefined, "options with no action are no form");
	assert.equal(settings.newsletterAction, "https://example.com/newsletter/subscribe", "the settings it was given stay as they were");
	assert.equal(lines.length, 1);
	assert.match(lines[0], /newsletterAction.*example\.com\/newsletter\/subscribe/);
	withoutPlaceholderForms(settings, (line) => lines.push(line));
	assert.equal(lines.length, 1, "a page load does not repeat the line");
	assert.equal(withoutPlaceholderForms(clean, (line) => lines.push(line)), clean, "a real action: the same settings");
	assert.equal(lines.length, 1);
});

/** Runs `fn` in a folder with or without the hosted demo's marker. Plain Node counts as a production server, so the folder decides. */
function inCopy(demo, fn) {
	const dir = mkdtempSync(join(tmpdir(), "vesper-copy-"));
	if (demo) mkdirSync(join(dir, "src/demo-brand"), { recursive: true });
	const was = process.cwd();
	process.chdir(dir);
	try {
		return fn();
	} finally {
		process.chdir(was);
		rmSync(dir, { recursive: true, force: true });
	}
}

test("a buyer's server leaves out a placeholder link, with one line in the log, and keeps a real one", () => {
	// Built here so the release scan does not read a sample address as a real one.
	const at = "a@";
	inCopy(false, () => {
		const lines = [];
		const warn = (line) => lines.push(line);
		for (const href of ["https://example.com/x", "https://www.EXAMPLE.org/", "https://site.example/", "mailto:Name@example.com?subject=Hi", `MAILTO:${at}b.example`]) assert.equal(liveHref(href, "t", warn), undefined, href);
		assert.equal(lines.length, 5);
		liveHref("https://example.com/x", "t", warn);
		assert.equal(lines.length, 5, "no repeat");
		assert.match(lines[0], /^Vesper setup: t goes to a placeholder address \(https:\/\/example\.com\/x\)/);
		for (const href of ["https://rowan.test/x", `mailto:${at}rowan.test`, "/rss.xml", "#notes", "https://notexample.com/"]) assert.equal(liveHref(href, "t", warn), href, href);
	});
});

test("the hosted demo's server keeps its placeholder links", () => {
	inCopy(true, () => assert.equal(liveHref("https://example.com/x", "t", () => assert.fail("nothing to say")), "https://example.com/x"));
});

test("a source's links on a buyer's server: a placeholder is left out, not recorded as refused; a menu item goes with its children", () => {
	const warn = console.warn;
	console.warn = () => {};
	try {
		const items = [{ label: "Home", href: "/" }, { label: "Old", href: "https://example.com/old", children: [{ label: "Docs", href: "/docs" }] }, { label: "Real", href: "https://rowan.test/", children: [{ label: "Fake", href: "https://example.org/a" }] }];
		assert.deepEqual(inCopy(false, () => checkedMenu(items, "menu").map((i) => [i.label, i.children?.length ?? 0])), [["Home", 0], ["Real", 0]]);
		assert.equal(inCopy(false, () => checkedHref("https://example.com/contour", "projects.link")), undefined);
		assert.equal(inCopy(true, () => checkedHref("https://example.com/contour", "projects.link")), "https://example.com/contour");
		assert.equal(inCopy(true, () => checkedMenu(items, "menu").length), 3);
	} finally {
		console.warn = warn;
	}
});

test("a live server's settings have no bare or placeholder social and no placeholder CV, with one line each, and keep a real one", () => {
	const lines = [];
	const socials = [
		{ label: "GitHub", href: "https://github.com", icon: "github" },
		{ label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
		{ label: "Mail", href: "mailto:name@example.com", icon: "website" },
		{ label: "Mine", href: "https://github.com/rowan-sample", icon: "github" },
		{ label: "Site", href: "https://rowan.test/", icon: "website" },
		{ label: "RSS", href: "/rss.xml", icon: "rss" },
	];
	const out = withoutPlaceholderLinks({ socials, cvFile: "https://old-demo.example.net/cv.pdf" }, (line) => lines.push(line));
	assert.deepEqual(out.socials.map((s) => s.label), ["Mine", "Site", "RSS"]);
	assert.equal(out.cvFile, undefined);
	assert.equal("cvFile" in out, false);
	assert.equal(lines.length, 4);
	assert.match(lines[0], /socials "GitHub" is the site's home page/);
	assert.match(lines[2], /socials "Mail" goes to a placeholder address/);
	assert.match(lines[3], /cvFile goes to a placeholder address/);
	assert.equal(withoutPlaceholderLinks({ socials: [], cvFile: "/files/cv.pdf" }, () => assert.fail("nothing to say")).cvFile, "/files/cv.pdf");
});

test("the placeholder gate: the sample's identity warns; a changed one with placeholders stops unless ASTRONOMIC_ALLOW_PLACEHOLDERS=1; none left passes", () => {
	const problems = { errors: [], placeholders: ["contactForm.action: https://example.com/f"], markers: ["pages/privacy: [[fill in: your host]]"], warnings: [] };
	const origin = "https://example.com";
	const own = identityOf({ name: "Ruth Calloway" });
	const run = (extra, p = problems) => {
		const warned = [];
		checkSetup(p, { sampleContent: true, mode: "static", origin, env: {}, warn: (t) => warned.push(t), ...extra });
		return warned.join("\n");
	};
	assert.deepEqual(identityOf({ name: "Rowan Ellery" }), SAMPLE_IDENTITY);
	assert.match(run({ identity: identityOf({ name: "Rowan Ellery", title: "rowan  ellery" }) }), /Placeholders \(allowed/, "the sample's name and title only warn");
	assert.throws(() => run({ identity: identityOf({ name: "Rowan Ellery", title: "Ruth Calloway" }) }), (e) => /Placeholders on your own site/.test(e.message) && /"Ruth Calloway"/.test(e.message), "a changed title alone counts");
	assert.throws(() => run({ identity: identityOf({ name: "Ruth Calloway", title: "Rowan Ellery" }) }), /"Ruth Calloway"/, "a changed name alone counts");
	assert.match(run({ identity: identityOf({ name: "rowan  ellery", phone: "(720) 555-0199" }) }), /Placeholders \(allowed while sampleContent is on/);
	assert.match(run({ identity: own, demo: true }), /Placeholders \(allowed/, "the hosted demo only warns");
	assert.throws(() => run({ identity: own }), (e) => /Vesper setup: 2 problem\(s\)/.test(e.message) && /"Ruth Calloway"/.test(e.message) && /SITE_URL is not set/.test(e.message) && /ASTRONOMIC_ALLOW_PLACEHOLDERS=1/.test(e.message) && /contactForm\.action/.test(e.message) && /\[\[fill in: …\]\] marker/.test(e.message));
	assert.match(run({ identity: { ...SAMPLE_IDENTITY, phone: "(720) 555-0199" } }), /Placeholders \(allowed/, "with no sample phone, a phone does not count");
	const live = { identity: own, live: true, origin: "https://own.test" };
	assert.throws(() => run(live, { ...problems, placeholders: [] }), (e) => /1 problem\(s\)/.test(e.message) && /Placeholders on your own site/.test(e.message) && /grep -rnF "fill in"/.test(e.message) && !/SITE_URL is not set/.test(e.message), "a real address does not let a marker through");
	assert.match(run({ ...live, env: { ASTRONOMIC_ALLOW_PLACEHOLDERS: "1" } }, { ...problems, placeholders: [] }), /will NOT reach anyone/);
	assert.match(run({ ...live, identity: SAMPLE_IDENTITY }, { ...problems, placeholders: [] }), /Unfilled/, "the sample's identity at a real address still only warns about markers");
	assert.throws(() => run({ identity: own, env: { ASTRONOMIC_ALLOW_PLACEHOLDERS: " 1 " } }), /Placeholders on your own site/, "a padded 1 is not 1");
	assert.throws(() => run({ identity: own, env: { ASTRONOMIC_ALLOW_PLACEHOLDERS: "true" } }), /Placeholders on your own site/, "only 1 turns it on");
	const bypassed = run({ identity: own, env: { ASTRONOMIC_ALLOW_PLACEHOLDERS: "1" } });
	assert.equal(bypassed.split("contactForm.action").length - 1, 1, "the bypass lists each placeholder once");
	assert.match(bypassed, /Vesper setup: ASTRONOMIC_ALLOW_PLACEHOLDERS=1 is set/);
	assert.match(bypassed, /will NOT reach anyone/);
	assert.equal(run({ identity: own }, { ...problems, placeholders: [], markers: [] }), "", "nothing left passes");
});
