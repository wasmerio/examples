/**
 * Content links (src/content/links.ts): the one check both sources run on every link field before it enters the
 * model, and the record the setup check reports.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, test } from "node:test";
import { checkedHref, checkedLink, checkedLinks, checkedMenu, clearLinkProblems, linkProblems, safeHref, socialIcon } from "../../src/content/links.ts";

afterEach(() => clearLinkProblems());

/** Values no page may use as an href: script and data schemes in every spelling, and the ways out of the site. */
const BAD = [
	"javascript:alert(1)",
	"JavaScript:alert(1)",
	" javascript:alert(1)",
	"java\tscript:alert(1)",
	"javascript\n:alert(1)",
	"\x01javascript:alert(1)",
	"data:text/html,<script>alert(1)</script>",
	"DATA:text/html;base64,PHNjcmlwdD4=",
	"vbscript:msgbox(1)",
	"file:///etc/passwd",
	"http://example.com/x",
	"ftp://example.com/x",
	"//example.com/x",
	"/\\example.com",
	"\\\\example.com",
	"https:\\\\example.com",
	"/about\x00",
	"/a b",
	"https://",
	"about",
	"mailto:",
	"tel:",
	"",
	"   ",
];

const GOOD = [
	["https://www.linkedin.com/in/rowan", "https://www.linkedin.com/in/rowan"],
	["HTTPS://Example.com/newsletter", "HTTPS://Example.com/newsletter"],
	["/about", "/about"],
	["/articles/fog-on-the-fence-trail?x=1#notes", "/articles/fog-on-the-fence-trail?x=1#notes"],
	["#notes", "#notes"],
	["mailto:name@example.com", "mailto:name@example.com"],
	["tel:+13125550123", "tel:+13125550123"],
	["  /now  ", "/now"],
];

test("safeHref: https:, site paths, fragments, mailto: and tel: pass (trimmed)", () => {
	for (const [value, href] of GOOD) assert.equal(safeHref(value), href, JSON.stringify(value));
});

test("safeHref: script and data schemes, http:, //, backslashes, whitespace and control characters are refused", () => {
	for (const value of BAD) assert.equal(safeHref(value), undefined, JSON.stringify(value));
	for (const value of [undefined, null, 3, {}, ["/about"]]) assert.equal(safeHref(value), undefined, JSON.stringify(value));
});

test("the socials and one-link fields: refused links are left out and recorded", () => {
	const socials = [
		{ label: "GitHub", href: "https://github.com/rowan", icon: "github" },
		{ label: "Bad", href: "javascript:alert(1)", icon: "website" },
		{ label: "RSS", href: " /rss.xml ", icon: "rss" },
	];
	assert.deepEqual(checkedLinks(socials, "settings.socials"), [
		{ label: "GitHub", href: "https://github.com/rowan", icon: "github" },
		{ label: "RSS", href: "/rss.xml", icon: "rss" },
	]);
	assert.equal(checkedHref("https://rowan.test/ridgeline", 'projects "ridgeline".link'), "https://rowan.test/ridgeline");
	assert.equal(checkedHref("http://example.com", 'talks "x".video'), undefined);
	assert.equal(checkedHref(undefined, 'uses "y".link'), undefined, "no link is no problem");
	assert.equal(checkedLink({ label: "x", href: "data:x" }, "where"), undefined);
	assert.deepEqual(
		linkProblems().map((p) => p.split(":")[0]),
		["settings.socials[1].href", 'talks "x".video', "where.href"],
	);
});

test("menus: refused items are left out at every level (a refused parent with its children), and recorded", () => {
	const menu = [
		{ label: "Articles", href: "/articles", children: [{ label: "Design", href: "/articles/category/design" }, { label: "Bad", href: "vbscript:x" }] },
		{ label: "Evil", href: "//example.com", children: [{ label: "Fine", href: "/fine" }] },
		{ label: "Now", href: "/now", target: "_self" },
	];
	assert.deepEqual(checkedMenu(menu, 'menu "footer"'), [
		{ label: "Articles", href: "/articles", children: [{ label: "Design", href: "/articles/category/design" }] },
		{ label: "Now", href: "/now", target: "_self" },
	]);
	assert.deepEqual(
		linkProblems().map((p) => p.split(":")[0]),
		['menu "footer"[0].children[1].href', 'menu "footer"[1].href'],
	);
});

test("the record follows the latest value of each place (a fixed value stops being reported in dev)", () => {
	checkedLinks([{ label: "A", href: "/a" }, { label: "B", href: "javascript:x" }, { label: "C", href: "javascript:y" }], "settings.socials");
	assert.equal(linkProblems().length, 2);
	checkedLinks([{ label: "A", href: "/a" }], "settings.socials");
	assert.deepEqual(linkProblems(), [], "a shorter list clears the places it no longer has");
	checkedHref("javascript:x", "settings.cvFile");
	assert.equal(linkProblems().length, 1);
	checkedHref("/files/cv.pdf", "settings.cvFile");
	assert.deepEqual(linkProblems(), []);
});

// ---------------------------------------------------------------------------
// Both sources run the check on every field that holds a link

const SOURCES = ["markdown", "emdash"].map((name) => [name, readFileSync(new URL(`../../src/content/sources/${name}.ts`, import.meta.url), "utf8")]);

test("both sources check every link field before it enters the model", () => {
	const fields = [
		["the socials", /\bsocials: checkedLinks\(.*"settings\.socials"\)/],
		["the menus", /\bmenus: \{ get: async \(name, ctx\) => checkedMenu\(/],
		["a project's link", /\blink: checkedHref\(.*`projects "\$\{e\.id\}"\.link`\)/],
		["a talk's video", /\bvideo: checkedHref\(.*`talks "\$\{e\.id\}"\.video`\)/],
		["a talk's slides", /\bslides: checkedHref\(.*`talks "\$\{e\.id\}"\.slides`\)/],
		["a uses item's link", /\blink: checkedHref\(.*`uses "\$\{e\.id\}"\.link`\)/],
		["a job's link", /\blink: checkedHref\(.*`jobs "\$\{e\.id\}"\.link`\)/],
		["a collage photo's link", /\blink: checkedHref\(.*`collage "\$\{e\.id\}"\.link`\)/],
		["the CV file", /\bcvFile: checkedHref\(.*"settings\.cvFile"\)/],
		["the newsletter's action", /checkedAction\(.*"settings\.newsletterAction"\)/],
	];
	for (const [name, text] of SOURCES) {
		for (const [field, re] of fields) assert.match(text, re, `${name}: ${field}`);
		assert.match(text, /from "\.\.\/links"/, `${name} imports the shared check`);
		assert.doesNotMatch(text, /menus: (md\.)?site\.menus/, `${name}: menus unchecked`);
	}
});

test("socialIcon: the id trimmed; website when missing or blank", () => {
	assert.equal(socialIcon("github"), "github");
	assert.equal(socialIcon("  github \n"), "github");
	for (const v of [undefined, null, "", "   ", 3]) assert.equal(socialIcon(v), "website", String(v));
});
