/** Entries to plain props (src/utils/view.ts): post rows, work rows, project items and cards, talks, uses, collage photos and images. */
import assert from "node:assert/strict";
import { test } from "node:test";
import { initialsOf, talksByYear, tileOf, TILES, toCollagePhoto, toPostRow, toProjectCard, toProjectItem, toTalk, toUiImage, toUsesGroups, toWorkRow, usesGroupId } from "../../src/utils/view.ts";

const img = { src: "/a.webp", alt: "A photo", width: 800, height: 600 };
const body = { format: "markdown", value: "" };

test("a post row: link, title, date, the category's label, summary and thumbnail; no undefined keys", () => {
	const date = new Date("2026-10-09T00:00:00Z");
	const post = { slug: "offline", title: "Offline", date, summary: "S", thumbnail: img, category: { slug: "design", label: "Design" }, tags: [], series: { slug: "s", label: "S" }, body };
	assert.deepEqual(toPostRow(post), { slug: "offline", href: "/articles/offline", title: "Offline", date, category: "Design", summary: "S", thumbnail: img });
	assert.deepEqual(toPostRow({ slug: "b", title: "B", tags: [], body }), { slug: "b", href: "/articles/b", title: "B" });
});

test("a work row: company, role, the years with Now, initials and a tile; the logo and link when set", () => {
	const row = toWorkRow({ slug: "s", company: "Switchback Studio", role: "Founder", start: 2022 }, "Now");
	assert.deepEqual(row, { company: "Switchback Studio", role: "Founder", years: "2022 – Now", initials: "Sw", tile: tileOf("Switchback Studio") });
	const done = toWorkRow({ slug: "c", company: "Cairn Maps", role: "Designer", start: 2018, end: 2022, logo: img, link: "https://example.com/cairn" }, "Now");
	assert.equal(done.years, "2018 – 2022");
	assert.deepEqual(done.logo, img);
	assert.equal(done.href, "https://example.com/cairn");
});

test("a project item: its page, title, summary, initials and tile; the logo when set", () => {
	const p = { slug: "ridgeline", title: "Ridgeline", summary: "Maps", featured: true, body };
	assert.deepEqual(toProjectItem(p), { href: "/projects/ridgeline", title: "Ridgeline", summary: "Maps", initials: "Ri", tile: tileOf("Ridgeline") });
	assert.deepEqual(toProjectItem({ ...p, logo: img }).logo, img);
});

test("a collage photo: the image, its alt, the caption parts and the link only when set", () => {
	const c = { slug: "tam", image: img, alt: "A ridge", place: "Mount Tamalpais, CA", year: 2024, geo: "37.92° N", order: 1 };
	assert.deepEqual(toCollagePhoto(c), { slug: "tam", image: img, alt: "A ridge", place: "Mount Tamalpais, CA", year: 2024, geo: "37.92° N" });
	assert.equal(toCollagePhoto({ ...c, link: "/articles/x" }).href, "/articles/x");
	assert.deepEqual(Object.keys(toCollagePhoto({ slug: "x", image: img, alt: "X" })), ["slug", "image", "alt"]);
});

test("initials: the first two letters of the first word, the first upper case", () => {
	assert.equal(initialsOf("Switchback Studio"), "Sw");
	assert.equal(initialsOf("contour"), "Co");
	assert.equal(initialsOf("  X "), "X");
	assert.equal(initialsOf(""), "");
});

test("tiles: one of the six, the same for the same name", () => {
	const names = ["Switchback Studio", "Cairn Maps", "Ridgeline", "Contour", "Darkroom Notes", "Talus Works", "Tidewater Outfitters"];
	for (const name of names) {
		const t = tileOf(name);
		assert.ok(Number.isInteger(t) && t >= 1 && t <= TILES, `${name}: ${t}`);
		assert.equal(tileOf(name), t);
	}
	assert.ok(new Set(names.map(tileOf)).size > 2, "names spread over the tiles");
});

test("images: a plain URL for parts with no image component", () => {
	assert.deepEqual(toUiImage(img), { src: "/a.webp", alt: "A photo", width: 800, height: 600 });
	assert.equal(toUiImage(undefined), undefined);
});

test("project cards: the page, the photo, the mark, the outside link with its label; no undefined keys", () => {
	const card = toProjectCard({ slug: "ridgeline", title: "Ridgeline", summary: "Maps.", image: img, link: "https://example.com/ridgeline/", year: 2024, featured: true, body });
	assert.deepEqual(card, {
		slug: "ridgeline",
		href: "/projects/ridgeline",
		title: "Ridgeline",
		summary: "Maps.",
		year: 2024,
		image: img,
		link: { href: "https://example.com/ridgeline/", label: "Project link" },
		initials: "Ri",
		tile: tileOf("Ridgeline"),
	});
	const bare = toProjectCard({ slug: "x", title: "X", featured: false, body });
	assert.deepEqual(Object.keys(bare).sort(), ["href", "initials", "slug", "tile", "title"]);
});

test("talks: plain rows, grouped by their UTC year in rule order", () => {
	const talk = (slug, date) => toTalk({ slug, title: slug, event: "Summit", date: new Date(date), place: undefined });
	const groups = talksByYear([talk("a", "2026-06-11"), talk("b", "2026-01-01"), talk("c", "2025-12-31")]);
	assert.deepEqual(groups.map((g) => [g.year, g.talks.map((t) => t.slug)]), [[2026, ["a", "b"]], [2025, ["c"]]]);
	assert.ok(!("place" in groups[0].talks[0]));
	assert.deepEqual(talksByYear([]), []);
});

test("uses: groups in rule order with stable ids and the first group photo; each item with its link's words and style", () => {
	const photo = { src: "/a.webp", alt: "A camera", width: 800, height: 600 };
	const later = { src: "/b.webp", alt: "Another", width: 800, height: 600 };
	const groups = toUsesGroups([
		{ slug: "b", group: "Desk", name: "Keyboard", order: 2 },
		{ slug: "a", group: "Camera bag", name: "SLR", note: "Metal.", order: 1 },
		{ slug: "c", group: "Camera bag", name: "App", link: "https://example.com/app", order: 3, groupImage: photo },
		{ slug: "d", group: "Camera bag", name: "Lens", link: "https://example.com/lens/", linkButton: true, linkLabel: " Get the lens ", order: 4, groupImage: later },
	]);
	assert.deepEqual(groups, [
		{
			group: "Camera bag",
			id: "uses-camera-bag",
			image: photo,
			items: [
				{ slug: "a", name: "SLR", note: "Metal." },
				{ slug: "c", name: "App", link: { href: "https://example.com/app", label: "Visit the site" } },
				{ slug: "d", name: "Lens", link: { href: "https://example.com/lens/", label: "Get the lens", button: true } },
			],
		},
		{ group: "Desk", id: "uses-desk", items: [{ slug: "b", name: "Keyboard" }] },
	]);
	assert.equal(usesGroupId("Café & Desk!"), "uses-cafe-desk");
	assert.equal(usesGroupId("—"), "uses-group");
	// Two names that give one id: the second gets "-2".
	assert.deepEqual(
		toUsesGroups([
			{ slug: "x", group: "Desk", name: "A", order: 1 },
			{ slug: "y", group: "desk", name: "B", order: 2 },
		]).map((g) => g.id),
		["uses-desk", "uses-desk-2"],
	);
});
