import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const enabled = process.env.RIGEL_CONTENT_MULTILANG === "true";
const manifest = JSON.parse(await readFile("dist/rigel/manifest.json", "utf8"));
const html = route => readFile(`dist/${route}/index.html`, "utf8");
const absent = route => assert.rejects(access(`dist/${route}/index.html`));
const types = manifest.schema.documents.filter(type => ["pageEn", "pageFr"].includes(type.name));
const collections = manifest.collections.filter(collection => collection.name.startsWith("articles-"));
assert.equal(types.length, enabled ? 2 : 0);
assert.equal(collections.length, enabled ? 2 : 0);
if (!enabled) {
  assert.equal(manifest.contentLocales, undefined);
  assert.ok(!manifest.documents.some(doc => ["pageEn", "pageFr"].includes(doc.type)));
  for (const route of ["en/studio", "fr/studio", "en/articles/publishing", "fr/articles/publishing", "preview/page-en", "preview/page-fr", "preview/articles-en", "preview/articles-fr"]) await absent(route);
} else {
  assert.deepEqual(manifest.contentLocales, { defaultLocale: "en", locales: [{ code: "en", label: "English" }, { code: "fr", label: "Français" }] });
  for (const locale of ["en", "fr"]) {
    const type = locale === "fr" ? "pageFr" : "pageEn";
    const definition = types.find(document => document.name === type);
    assert.equal(definition.locale, locale);
    assert.equal(collections.find(collection => collection.name === `articles-${locale}`).locale, locale);
    const source = JSON.parse(await readFile(`src/content/multilang/${locale}/pages/welcome.json`, "utf8"));
    assert.equal(source._id, `${type}:welcome`);
    assert.equal(source.slug, "studio");
    const page = await html(`${locale}/studio`);
    assert.ok(page.includes(`<html lang="${locale}">`));
    assert.ok(page.includes(`data-rigel-doc="${type}:welcome"`));
    assert.ok(page.includes(`href="/${locale}/articles/publishing/"`));
    assert.ok(page.includes('data-rigel-doc="logoSet:brands"'), "Logos resolve through the shared document");
    let previous = -1;
    for (const section of source.sections) {
      const index = page.indexOf(`data-rigel-key="${section._key}"`);
      assert.ok(index > previous, "Saved locale-specific section order renders unchanged");
      previous = index;
    }
    const expected = locale === "fr" ? ["hero", "story", "logoStrip"] : ["pageIntro", "textBlock", "logoStrip"];
    assert.deepEqual(definition.fields.find(field => field.key === "sections").items.map(item => item.name), expected);
    assert.deepEqual([...page.matchAll(/data-rigel-item-template="([^"]+)"/g)].map(match => match[1]).sort(), expected.toSorted());
    const article = await html(`${locale}/articles/publishing`);
    assert.ok(article.includes(`<html lang="${locale}">`));
    assert.ok(article.includes(locale === "fr" ? "Publier pour deux publics" : "Publishing for two audiences"));
    assert.ok(article.includes('data-rigel-richtext="$body"'));
    assert.match(article, /data-rigel-text="author"[^>]*>Alex<\/span>/);
    assert.ok(article.includes(`href="/${locale}/studio/"`));
    assert.ok((await html(`preview/articles-${locale}`)).includes('data-rigel-richtext="$body"'));
    await absent(`${locale}/welcome`);
    await absent(`${locale}/articles/notes`);
  }
  await absent("fr/brouillon");
  await absent("fr/articles/brouillon");
  for (const name of ["author", "logoSet", "callout", "settings", "page"]) assert.equal(manifest.schema.documents.find(type => type.name === name).locale, undefined);
  for (const name of ["blog", "news"]) assert.equal(manifest.collections.find(collection => collection.name === name).locale, undefined);
}
console.log(`PASS: multilingual example ${enabled ? "enabled: EN/FR routes, slug overrides, per-type templates, shared references and production draft exclusion" : "disabled: original manifest and routes, no locale configuration"}`);
