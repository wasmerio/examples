/**
 * lightboxHtml() (src/utils/lightbox-html.ts): photos in rendered rich text become links that open large, in both
 * sources. A Markdown image-only paragraph becomes a figure (its title the caption); an EmDash image or gallery figure
 * gets the link around its image. Linked and decorative photos are left alone, and every other byte stays as it was.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { lightboxHtml } from "../../src/utils/lightbox-html.ts";

const MD_SRCSET = "/_astro/tent_640.webp 640w, /_astro/tent_1400.webp 1400w, /_astro/tent_1080.webp 1080w";
const mdImg = (extra = "") => `<img alt="A small tent" ${extra}loading="lazy" width="1400" height="882" src="/_astro/tent.webp" srcset="${MD_SRCSET}">`;
const imgNoTitle = mdImg();
const large = `href="/_astro/tent_1400.webp" data-lightbox="photos" data-lightbox-srcset="${MD_SRCSET}" data-lightbox-sizes="100vw" data-lightbox-width="1400" data-lightbox-height="882"`;

test("a Markdown image-only paragraph with a title becomes a figure: link, image without the title, the title as caption", () => {
	const html = `<p>Before.</p>\n<p>${mdImg('title="Stevens Pass, Washington, 2025." ')}</p>\n<p>After.</p>`;
	assert.equal(lightboxHtml(html), `<p>Before.</p>\n<figure class="v-fig"><a ${large}>${imgNoTitle}</a><figcaption>Stevens Pass, Washington, 2025.</figcaption></figure>\n<p>After.</p>`);
});

test("without a title, the figure has no caption", () => {
	assert.equal(lightboxHtml(`<p>${mdImg()}</p>`), `<figure class="v-fig"><a ${large}>${imgNoTitle}</a></figure>`);
});

test("whitespace around the image in its paragraph still counts as image-only", () => {
	assert.equal(lightboxHtml(`<p>\n  ${mdImg()}\n</p>`), `<figure class="v-fig"><a ${large}>${imgNoTitle}</a></figure>`);
});

test("an EmDash image figure gets the link around its image; its caption and attributes stay as they were", () => {
	const src = "http://localhost:4604/_emdash/api/media/file/demo/tent.webp";
	const srcset = [640, 750, 828, 1080, 1280, 1668, 2048, 2560, 2800].map((w) => `${src} ${w}w`).join(", ");
	const img = `<img src="${src}" srcset="${srcset}" alt="A small tent" loading="lazy" sizes="(min-width: 1400px) 1400px, 100vw" width="1400" height="882">`;
	const html = `<figure class="emdash-image" data-astro-cid-x>${img}<figcaption data-astro-cid-x>Stevens Pass &amp; more</figcaption></figure>`;
	// Every candidate is the same file: the link is that file, with no large srcset and no size.
	assert.equal(lightboxHtml(html), `<figure class="emdash-image" data-astro-cid-x><a href="${src}" data-lightbox="photos">${img}</a><figcaption data-astro-cid-x>Stevens Pass &amp; more</figcaption></figure>`);
});

test("an EmDash image figure with no caption gets the link too", () => {
	const html = `<figure class="emdash-image"><img src="/m/a.jpg" alt="A ridge"></figure>`;
	assert.equal(lightboxHtml(html), `<figure class="emdash-image"><a href="/m/a.jpg" data-lightbox="photos"><img src="/m/a.jpg" alt="A ridge"></a></figure>`);
});

test("an EmDash image with a title keeps its title (only the Markdown title becomes a caption)", () => {
	const html = `<figure class="emdash-image"><img src="/m/a.jpg" alt="A ridge" title="Hover text"></figure>`;
	assert.equal(lightboxHtml(html), `<figure class="emdash-image"><a href="/m/a.jpg" data-lightbox="photos"><img src="/m/a.jpg" alt="A ridge" title="Hover text"></a></figure>`);
});

test("each image of an EmDash gallery is a trigger, in order", () => {
	const item = (n, cap) => `<figure class="emdash-gallery-item"><img src="/m/${n}.jpg" alt="Photo ${n}">${cap ? `<figcaption>${cap}</figcaption>` : ""}</figure>`;
	const linked = (n, cap) => `<figure class="emdash-gallery-item"><a href="/m/${n}.jpg" data-lightbox="photos"><img src="/m/${n}.jpg" alt="Photo ${n}"></a>${cap ? `<figcaption>${cap}</figcaption>` : ""}</figure>`;
	const html = `<div class="emdash-gallery" style="--columns: 3">${item(1, "One")}${item(2)}${item(3, "Three")}</div>`;
	assert.equal(lightboxHtml(html), `<div class="emdash-gallery" style="--columns: 3">${linked(1, "One")}${linked(2)}${linked(3, "Three")}</div>`);
});

test("an image already inside a link keeps its link and is not a trigger (Markdown and EmDash)", () => {
	const md = `<p><a href="https://example.com">${mdImg()}</a></p>`;
	const em = `<figure class="emdash-image"><a href="https://example.com" target="_blank"><img src="/m/a.jpg" alt="A ridge"></a><figcaption>Cap</figcaption></figure>`;
	assert.equal(lightboxHtml(md), md);
	assert.equal(lightboxHtml(em), em);
});

test("a linked Markdown image with a title becomes a figure: its own link inside, as it was, the title as caption, no lightbox link", () => {
	const md = `<p>Before.</p>\n<p><a href="/uses" class="x">\n${mdImg('title="My camera &amp; lens" ')}\n</a></p>`;
	assert.equal(lightboxHtml(md), `<p>Before.</p>\n<figure class="v-fig"><a href="/uses" class="x">\n${imgNoTitle}\n</a><figcaption>My camera &amp; lens</figcaption></figure>`);
});

test("a decorative image (empty, blank or missing alt) is no trigger; a Markdown one with a title gets its caption figure", () => {
	for (const alt of ['alt=""', 'alt="  "', ""]) {
		const md = `<p><img ${alt} src="/a.jpg"></p>`;
		const em = `<figure class="emdash-image"><img ${alt} src="/a.jpg"></figure>`;
		assert.equal(lightboxHtml(md), md);
		assert.equal(lightboxHtml(em), em);
		assert.equal(lightboxHtml(`<p><img ${alt} src="/a.jpg" title="T"></p>`), `<figure class="v-fig"><img ${alt} src="/a.jpg"><figcaption>T</figcaption></figure>`);
	}
});

test("a linked or decorative image with a blank title, or a link holding more than the image, is left alone", () => {
	for (const html of [`<p><a href="/u">${mdImg('title="  " ')}</a></p>`, `<p><img alt="" src="/a.jpg" title=" "></p>`, `<p><a href="/u">${mdImg('title="T" ')} more</a></p>`]) assert.equal(lightboxHtml(html), html);
});

test("a paragraph with text beside the image, or two images, is left alone", () => {
	for (const html of [`<p>Look: ${mdImg()}</p>`, `<p>${mdImg()} <em>x</em></p>`, `<p>${mdImg()}${mdImg()}</p>`]) assert.equal(lightboxHtml(html), html);
});

test("an image in other places (a bare figure, a list item, a div) is left alone", () => {
	for (const html of [`<figure><img src="/a.jpg" alt="A"></figure>`, `<ul><li><img src="/a.jpg" alt="A"></li></ul>`, `<div>${mdImg()}</div>`]) assert.equal(lightboxHtml(html), html);
});

test("href is the largest w candidate by number, whatever the order", () => {
	const out = lightboxHtml(`<p><img alt="A" src="/s.jpg" srcset="/b.jpg 2400w, /a.jpg 900w, /c.jpg 1800w"></p>`);
	assert.match(out, /<a href="\/b\.jpg" data-lightbox="photos" data-lightbox-srcset="\/b\.jpg 2400w, \/a\.jpg 900w, \/c\.jpg 1800w" data-lightbox-sizes="100vw" data-lightbox-width="2400">/);
});

test("the large size keeps the image's shape: the height scales from its width and height", () => {
	const out = lightboxHtml(`<p><img alt="A" src="/s.jpg" width="700" height="400" srcset="/s.jpg 700w, /l.jpg 1400w"></p>`);
	assert.match(out, /data-lightbox-width="1400" data-lightbox-height="800"/);
});

test("x descriptors, no descriptor, mixed or unparsable srcsets give href = src and no large srcset", () => {
	for (const srcset of ["/a.jpg 1x, /b.jpg 2x", "/a.jpg", "/a.jpg 640w, /b.jpg 2x", "/a.jpg 640q", "/a.jpg 0w", ""]) {
		const out = lightboxHtml(`<p><img alt="A" src="/s.jpg" srcset="${srcset}"></p>`);
		assert.equal(out, `<figure class="v-fig"><a href="/s.jpg" data-lightbox="photos"><img alt="A" src="/s.jpg" srcset="${srcset}"></a></figure>`, srcset);
	}
});

test("no srcset: href is src; no src and no usable srcset: left alone", () => {
	assert.equal(lightboxHtml(`<p><img alt="A" src="/s.jpg"></p>`), `<figure class="v-fig"><a href="/s.jpg" data-lightbox="photos"><img alt="A" src="/s.jpg"></a></figure>`);
	const bare = `<p><img alt="A"></p>`;
	assert.equal(lightboxHtml(bare), bare);
});

test("URLs with query strings and &amp; are written back escaped once", () => {
	const html = `<p><img alt="A" src="/i?u=a&amp;w=640" srcset="/i?u=a&amp;w=640 640w, /i?u=a&amp;w=1400 1400w"></p>`;
	const out = lightboxHtml(html);
	assert.match(out, /<a href="\/i\?u=a&amp;w=1400" data-lightbox="photos" data-lightbox-srcset="\/i\?u=a&amp;w=640 640w, \/i\?u=a&amp;w=1400 1400w"/);
	assert.ok(!out.includes("&amp;amp;"));
});

test("a caption with &amp;, &quot;, &lt; and quotes keeps them escaped once", () => {
	const out = lightboxHtml(`<p><img alt="A" src="/s.jpg" title="Tom &amp; Jerry &quot;at&quot; 'camp' &lt;b&gt; 2 < 3"></p>`);
	assert.equal(out, `<figure class="v-fig"><a href="/s.jpg" data-lightbox="photos"><img alt="A" src="/s.jpg"></a><figcaption>Tom &amp; Jerry "at" 'camp' &lt;b> 2 &lt; 3</figcaption></figure>`);
});

test("an attribute value with a quote or a < is escaped in the link", () => {
	const out = lightboxHtml(`<p><img alt="A" src="/a&quot;b<c.jpg"></p>`);
	assert.match(out, /<a href="\/a&quot;b&lt;c\.jpg" data-lightbox="photos">/);
});

test("malformed HTML comes back byte-identical", () => {
	for (const html of [`<p><img alt="A" src="/a.jpg">`, `<p><img alt="A" src="/a.jpg"`, `<figure class="emdash-image"><img alt="A" src="/a.jpg"`, `<p><img alt="A" src="/a.jpg"><p`, `<figure class="emdash-image"><img alt="A" src="/a.jpg"></figure`]) {
		assert.equal(lightboxHtml(html), html, html);
	}
});

test("HTML with no image comes back byte-identical", () => {
	const html = `<h2 id="a">Hi</h2>\n<p>Text &amp; <a href="/x?a=1&amp;b=2">link</a></p><pre tabindex="0"><code>&lt;img&gt;</code></pre>`;
	assert.equal(lightboxHtml(html), html);
	assert.equal(lightboxHtml(""), "");
});

test("the rest of the HTML stays byte for byte, and two photos keep their order", () => {
	const html = `<h2 id="x" >Odd  spacing</h2>\n<p>A&nbsp;B</p>\n<p><img alt="One" src="/1.jpg" title="First"></p>\n<p>Mid</p>\n<figure class="emdash-image"><img alt="Two" src="/2.jpg"><figcaption>Second</figcaption></figure>\n<p>End<br></p>`;
	assert.equal(
		lightboxHtml(html),
		`<h2 id="x" >Odd  spacing</h2>\n<p>A&nbsp;B</p>\n<figure class="v-fig"><a href="/1.jpg" data-lightbox="photos"><img alt="One" src="/1.jpg"></a><figcaption>First</figcaption></figure>\n<p>Mid</p>\n<figure class="emdash-image"><a href="/2.jpg" data-lightbox="photos"><img alt="Two" src="/2.jpg"></a><figcaption>Second</figcaption></figure>\n<p>End<br></p>`,
	);
});

test("Windows line ends do not shift the splice", () => {
	const html = `<p>A\r\nB</p>\r\n<p>\r\n<img alt="One" src="/1.jpg" title="T">\r\n</p>\r\n<p>C</p>`;
	assert.equal(lightboxHtml(html), `<p>A\r\nB</p>\r\n<figure class="v-fig"><a href="/1.jpg" data-lightbox="photos"><img alt="One" src="/1.jpg"></a><figcaption>T</figcaption></figure>\r\n<p>C</p>`);
});

test("a script or data URL never becomes a link: an image with only such URLs is left alone", () => {
	for (const src of ["javascript:alert(1)", "data:image/png;base64,AAAA", "vbscript:msgbox(1)", " JaVaScRiPt:alert(1)", "\u0001\tjava\nscript:alert(1)", "&#x6A;avascript:alert(1)"]) {
		const md = `<p><img alt="A" src="${src}"></p>`;
		const em = `<figure class="emdash-image"><img alt="A" src="${src}"></figure>`;
		assert.equal(lightboxHtml(md), md, JSON.stringify(src));
		assert.equal(lightboxHtml(em), em, JSON.stringify(src));
		const set = `<p><img alt="A" src="${src}" srcset="${src} 640w"></p>`;
		assert.equal(lightboxHtml(set), set, JSON.stringify(src));
	}
});

test("a bad srcset candidate is dropped; the link and the large srcset use the good ones", () => {
	const out = lightboxHtml(`<p><img alt="A" src="/s.jpg" srcset="/a.jpg 640w, javascript:alert(1) 2400w, https://example.com/b.jpg 1400w"></p>`);
	assert.match(out, /<a href="https:\/\/example\.com\/b\.jpg" data-lightbox="photos" data-lightbox-srcset="\/a\.jpg 640w, https:\/\/example\.com\/b\.jpg 1400w" data-lightbox-sizes="100vw" data-lightbox-width="1400">/);
	assert.ok(!/<a[^>]*javascript/i.test(out));
});

test("an unsafe src with a good srcset links to the srcset's file; relative URLs are fine, protocol-relative ones are not", () => {
	assert.match(lightboxHtml(`<p><img alt="A" src="javascript:x" srcset="/a.jpg 640w, /b.jpg 900w"></p>`), /<a href="\/b\.jpg"/);
	assert.match(lightboxHtml(`<p><img alt="A" src="photo.jpg"></p>`), /<a href="photo\.jpg"/);
	const protocolRelative = `<p><img alt="A" src="//example.com/a.jpg"></p>`;
	assert.equal(lightboxHtml(protocolRelative), protocolRelative);
});

test("two images side by side in one EmDash figure each get their own link, in order", () => {
	const html = `<figure class="emdash-gallery-item"><img src="/a.jpg" alt="A"><img src="/b.jpg" alt="B"></figure>`;
	assert.equal(lightboxHtml(html), `<figure class="emdash-gallery-item"><a href="/a.jpg" data-lightbox="photos"><img src="/a.jpg" alt="A"></a><a href="/b.jpg" data-lightbox="photos"><img src="/b.jpg" alt="B"></a></figure>`);
});

test("a srcset with one w candidate keeps its large srcset and size", () => {
	const out = lightboxHtml(`<p><img alt="A" src="/s.jpg" width="700" height="400" srcset="/l.jpg 1400w"></p>`);
	assert.match(out, /<a href="\/l\.jpg" data-lightbox="photos" data-lightbox-srcset="\/l\.jpg 1400w" data-lightbox-sizes="100vw" data-lightbox-width="1400" data-lightbox-height="800">/);
});
