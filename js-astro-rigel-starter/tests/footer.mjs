import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";

export async function checkFooter({ cdp, evaluate, origin }) {
  const settingsFile = "src/content/settings/site.json";
  const menuFile = "src/content/menus/footer.json";
  const originalSettings = await readFile(settingsFile, "utf8");
  const originalMenu = await readFile(menuFile, "utf8");
  const originalCopyright = JSON.parse(originalSettings).copyright;
  const paths = ["/", "/about/", "/blog/"];
  const publicHtml = async path => {
    const response = await fetch(new URL(path, origin));
    assert.equal(response.status, 200, `Public page ${path} loads`);
    return response.text();
  };
  const publicCopyright = async path => (await publicHtml(path)).match(/<p\b[^>]*class="copyright"[^>]*>([^<]*)<\/p>/)?.[1];
  const waitFor = async check => {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await check()) return;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error("Footer verification timed out");
  };
  const openSettings = async () => {
    await waitFor(() => evaluate('!!document.querySelector(\'[data-document="settings:site"]\')'));
    await evaluate('document.querySelector(\'[data-document="settings:site"]\').click()');
    await waitFor(() => evaluate('!!document.querySelector(\'[data-schema-path="copyright"] input\')'));
    assert.equal(await evaluate("!!document.querySelector('.document-form') && !document.querySelector('.visual-editor, .site-preview, main > table')"), true, "Site settings opens directly as a standalone form");
  };
  const copyrightInput = 'document.querySelector(\'[data-schema-path="copyright"] input\')';
  try {
    await cdp("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    await cdp("Page.navigate", { url: `${origin}/rigel/` });
    await openSettings();
    assert.equal(await evaluate(`${copyrightInput}.value`), originalCopyright);
    const marker = "© Rigel global footer regression";
    const siteName = "Rigel settings regression";
    await evaluate(`(() => { const input = document.querySelector('[data-schema-path="siteName"] input'); input.value = ${JSON.stringify(siteName)}; input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
    await evaluate(`(() => { const input = ${copyrightInput}; input.value = ${JSON.stringify(marker)}; input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
    assert.equal(await readFile(settingsFile, "utf8"), originalSettings, "Copyright does not autosave");
    await evaluate("document.querySelector('.back button').click()");
    await waitFor(() => evaluate("!!document.querySelector('.unsaved-dialog[open]')"));
    await evaluate("[...document.querySelectorAll('.unsaved-dialog button')].find(button => button.textContent.trim() === 'Keep editing').click()");
    await waitFor(() => evaluate("!document.querySelector('.unsaved-dialog[open]')"));
    assert.equal(await evaluate(`${copyrightInput}.value`), marker, 'Leaving settings protects the unsaved draft');
    await writeFile('_temp/site-settings.png', Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data, 'base64'));
    for (const path of paths) assert.equal(await publicCopyright(path), originalCopyright, "Public copyright stays unchanged until Save");
    await waitFor(() => evaluate("!document.querySelector('.save-button').disabled"));
    await evaluate("document.querySelector('.save-button').click()");
    await waitFor(async () => JSON.parse(await readFile(settingsFile, "utf8")).copyright === marker);
    for (const path of paths) {
      await waitFor(async () => await publicCopyright(path) === marker);
      const html = await publicHtml(path);
      assert.ok(html.includes(`aria-label="${siteName} home"`) && html.includes(`| ${siteName}</title>`), "Site name controls the real public brand and title suffix");
    }
    assert.equal(JSON.parse(await readFile(settingsFile, "utf8")).siteName, siteName);
    await waitFor(() => evaluate("document.querySelector('.save-button')?.disabled === true"));
    await cdp("Page.reload");
    await openSettings();
    assert.equal(await evaluate(`${copyrightInput}.value`), marker, "Saved copyright survives reload");

    const menu = JSON.parse(originalMenu);
    menu.items[0].label = "Global footer menu regression";
    assert.equal((await fetch(new URL("/rigel/api/local/menus/footer", origin), { method: "PUT", headers: { "Content-Type": "application/json", Origin: origin }, body: JSON.stringify(menu) })).status, 204);
    assert.equal(JSON.parse(await readFile(menuFile, "utf8")).items[0].label, menu.items[0].label);
    for (const path of ["/", "/about/"]) {
      await waitFor(async () => (await publicHtml(path)).includes("Global footer menu regression"));
    }
  } finally {
    await writeFile(settingsFile, originalSettings);
    await writeFile(menuFile, originalMenu);
    assert.equal(await readFile(settingsFile, "utf8"), originalSettings);
    assert.equal(await readFile(menuFile, "utf8"), originalMenu);
    for (const path of paths) await waitFor(async () => await publicCopyright(path) === originalCopyright);
    await cdp("Page.reload");
    await openSettings();
    assert.equal(await evaluate(`${copyrightInput}.value`), originalCopyright, "Original copyright is restored after reload");
  }
  console.log("Footer checks passed: direct Site settings form, explicit Save, JSON persistence, public page footers, reload, editable menu persistence and exact fixture restoration.");
}
