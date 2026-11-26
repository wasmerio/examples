/** The site's own JSON-LD (src/utils/jsonld.ts): the owner as a Person, and the WebSite every indexable page carries. */
import assert from "node:assert/strict";
import { test } from "node:test";
import { ownerInput, siteNodes } from "../../src/utils/jsonld.ts";

const origin = "https://example.com";
const settings = {
	title: "Rowan Ellery",
	tagline: "Designer and developer in Bellingham, Washington.",
	name: "Rowan Ellery",
	role: "Designer and developer",
	bio: "I design calm software.",
	headline: "Hi",
	avatar: { src: "/_astro/avatar.webp", alt: "Rowan", width: 400, height: 400 },
	socials: [
		{ label: "GitHub", href: "https://github.com/rowan", icon: "github" },
		{ label: "RSS", href: "/rss.xml", icon: "rss" },
		{ label: "Email", href: "mailto:name@example.com", icon: "email" },
		{ label: "Feed", href: "https://example.com/rss.xml", icon: "rss" },
		{ label: "GitHub again", href: "https://github.com/rowan", icon: "github" },
		{ label: "Instagram", href: "https://www.instagram.com", icon: "instagram" },
		{ label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
	],
};

test("ownerInput: a Person with the name, role, photo and bio; sameAs keeps only full profile URLs, once each", () => {
	assert.deepEqual(ownerInput(settings), {
		type: "Person",
		name: "Rowan Ellery",
		jobTitle: "Designer and developer",
		image: "/_astro/avatar.webp",
		description: "I design calm software.",
		sameAs: ["https://github.com/rowan"],
	});
});

test("siteNodes: the WebSite (the site's title and tagline, published by the owner) and the owner's Person", () => {
	const [site, owner] = siteNodes(settings, origin);
	assert.equal(site["@type"], "WebSite");
	assert.equal(site.name, "Rowan Ellery");
	assert.equal(site.description, "Designer and developer in Bellingham, Washington.");
	assert.deepEqual(site.publisher, { "@id": `${origin}/#owner` });
	assert.equal(owner["@type"], "Person");
	assert.equal(owner["@id"], `${origin}/#owner`);
	assert.equal(owner.image, `${origin}/_astro/avatar.webp`);
	assert.equal(owner.jobTitle, "Designer and developer");
	assert.equal("logo" in owner, false, "a person has no logo");
});

test("siteNodes: no avatar, role, bio, tagline or profile links: those fields are left out", () => {
	const [site, owner] = siteNodes({ title: "Vesper", name: "Your Name", headline: "Hi", socials: [{ label: "RSS", href: "/rss.xml", icon: "rss" }] }, origin);
	assert.equal("description" in site, false);
	for (const key of ["image", "jobTitle", "description", "sameAs", "logo"]) assert.equal(key in owner, false, key);
	assert.equal(owner.name, "Your Name");
});
