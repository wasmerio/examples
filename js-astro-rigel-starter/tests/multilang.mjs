import assert from "node:assert/strict";
import { chooseSelect, openProperties } from './editor-controls.mjs';
import { readFile, writeFile } from "node:fs/promises";

export async function checkMultilang({ cdp, evaluate, waitFor }) {
  const base = process.env.RIGEL_URL || "http://localhost:4321/rigel/";
  const enabled = process.env.RIGEL_CONTENT_MULTILANG === "true";
  const manifest = await fetch(new URL("/rigel/manifest.json", base)).then(response => response.json());
  assert.equal(Boolean(manifest.contentLocales), enabled, "Server must use the same opt-in setting as the suite");
  const control = '.content-language button[role="combobox"]';
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const key = async key => {
    const windowsVirtualKeyCode = { Escape: 27, Home: 36, End: 35, Enter: 13 }[key];
    await cdp("Input.dispatchKeyEvent", { type: "keyDown", key, code: key, windowsVirtualKeyCode });
    await cdp("Input.dispatchKeyEvent", { type: "keyUp", key, code: key, windowsVirtualKeyCode });
  };
  const set = (selector, value) => evaluate(`(() => { const input = document.querySelector(${JSON.stringify(selector)}); input.value = ${JSON.stringify(value)}; input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  const row = title => evaluate(`[...document.querySelectorAll('tbody .table-link')].find(button => button.textContent.trim() === ${JSON.stringify(title)}).click()`);
  const titleField = '[data-schema-path="title"] input, [data-collection-field="title"] input';
  const locale = () => evaluate(`document.querySelector(${JSON.stringify(control)})?.textContent.trim()`);
  const choose = async language => {
    await click(control);
    await waitFor("!!document.querySelector('.select-menu:popover-open')");
    await evaluate(`[...document.querySelectorAll('.select-menu:popover-open [role=option]')].find(option => option.textContent.trim() === ${JSON.stringify(language)}).click()`);
  };
  const switchTo = async language => {
    if (await locale() !== language) await choose(language);
    await waitFor(`document.querySelector(${JSON.stringify(control)})?.textContent.trim() === ${JSON.stringify(language)}`);
  };
  const pages = async () => {
    await click('#nav-pages');
    await waitFor("!!document.querySelector('tbody .table-link')");
  };
  const assertPages = async language => {
    await pages();
    const text = await evaluate("document.querySelector('tbody').textContent");
    assert.ok(text.includes(language === 'en' ? 'English studio' : 'Le studio français'));
    assert.ok(!text.includes(language === 'en' ? 'Le studio français' : 'English studio'));
    assert.ok(text.includes('About'), 'Unannotated original pages remain visible');
    assert.equal(await evaluate(`!!document.querySelector('[data-collection="articles-${language}"]')`), true);
    assert.equal(await evaluate(`!!document.querySelector('[data-collection="articles-${language === 'en' ? 'fr' : 'en'}"]')`), false);
    for (const name of ['blog', 'news']) assert.equal(await evaluate(`!!document.querySelector('[data-collection="${name}"]')`), true);
  };
  const search = async (query, present, absent) => {
    await click('.search-trigger');
    await waitFor("!!document.querySelector('.palette input')");
    await set('.palette input', query);
    await waitFor(`document.querySelector('.palette')?.textContent.includes(${JSON.stringify(present)})`);
    assert.equal(await evaluate(`document.querySelector('.palette').textContent.includes(${JSON.stringify(absent)})`), false);
    await key('Escape');
  };
  if (!enabled) {
    assert.equal(await evaluate(`!!document.querySelector(${JSON.stringify(control)})`), false);
    await pages();
    assert.equal(await evaluate("document.querySelector('tbody').textContent.includes('English studio')"), false);
    assert.equal(await evaluate("!!document.querySelector('[data-collection=articles-fr]')"), false);
    console.log('PASS: default editor has no content-language selector or multilingual fixtures');
    return;
  }
  const files = ['src/content/multilang/fr/pages/welcome.json', 'src/content/multilang/fr/articles/notes.json', 'src/content/multilang/en/pages/welcome.json', 'src/content/multilang/en/articles/notes.json', 'src/content/pages/about.json', 'src/content/authors/alex.json'];
  const originals = new Map(await Promise.all(files.map(async file => [file, await readFile(file)])));
  try {
    await waitFor(`!!document.querySelector(${JSON.stringify(control)})`);
    assert.equal(await evaluate(`(() => { const button = document.querySelector(${JSON.stringify(control)}); return button.getAttribute('aria-label') || document.getElementById(button.getAttribute('aria-labelledby'))?.textContent.trim(); })()`), 'Content language');
    assert.equal(await locale(), 'English', 'New editor session starts with the configured default');
    assert.equal(await evaluate("document.querySelectorAll('#rigel-sidebar .content-language').length"), 1);
    assert.equal(await evaluate("document.querySelector('main .content-language')"), null);
    assert.equal(await evaluate("document.querySelector('.content-language').previousElementSibling.matches('.search-trigger')"), true, 'Language selector follows sidebar search');
    await click('.sidebar-toggle');
    await waitFor("document.querySelector('.rigel').classList.contains('sidebar-collapsed')");
    assert.equal(await evaluate(`(() => { const r = document.querySelector(${JSON.stringify(control)}).getBoundingClientRect(), aside = document.querySelector('#rigel-sidebar').getBoundingClientRect(); return r.width >= 32 && r.left >= aside.left && r.right <= aside.right; })()`), true, 'Collapsed selector fits the rail');
    const point = await evaluate(`(() => { const r = document.querySelector(${JSON.stringify(control)}).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
    await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
    await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
    await waitFor("!!document.querySelector('.select-menu:popover-open')");
    await writeFile('_temp/multilang-collapsed.png', Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
    await key('End'); await key('Enter');
    assert.equal(await locale(), 'Français');
    await waitFor(`document.activeElement === document.querySelector(${JSON.stringify(control)})`);
    await click('.sidebar-toggle');
    await waitFor("!document.querySelector('.rigel').classList.contains('sidebar-collapsed')");
    await switchTo('English');
    await assertPages('en');
    await click('.user-btn');
    await waitFor("!!document.querySelector('.user-menu')");
    await evaluate("[...document.querySelectorAll('.user-menu button')].find(button => button.textContent.trim() === 'Settings').click()");
    await waitFor("!!document.querySelector('.settings-modal')");
    await evaluate("[...document.querySelectorAll('.settings-nav button')].find(button => button.textContent.trim() === 'Content').click()");
    await chooseSelect({ evaluate, waitFor }, '.settings-pane .custom-select:nth-of-type(2) [role=combobox]', 'Current content language');
    await click('.settings-head .close');
    await search('studio', 'English studio', 'Le studio français');
    await search('Publishing', 'Publishing for two audiences', 'Publier pour deux publics');
    await switchTo('Français');
    await assertPages('fr');
    await search('studio', 'Le studio français', 'English studio');
    await search('Publ', 'Publier pour deux publics', 'Publishing for two audiences');

    await switchTo('English');
    await click('.user-btn');
    await waitFor("!!document.querySelector('.user-menu')");
    await evaluate("[...document.querySelectorAll('.user-menu button')].find(button => button.textContent.trim() === 'Settings').click()");
    await waitFor("!!document.querySelector('.settings-modal')");
    await evaluate("[...document.querySelectorAll('.settings-nav button')].find(button => button.textContent.trim() === 'Interface').click()");
    await waitFor("!!document.querySelector('.settings-modal input[value=fr]')");
    await click('.settings-modal input[value=fr]');
    await waitFor("JSON.parse(localStorage.getItem('rigelcms.settings')).language === 'fr'");
    assert.equal(await locale(), 'English', 'French interface leaves English content selected');
    await click('.settings-modal input[value=en]');
    await waitFor("JSON.parse(localStorage.getItem('rigelcms.settings')).language === 'en'");
    await click('.settings-head .close');
    await assertPages('en');
    await switchTo('Français');
    await assertPages('fr');

    for (const language of ['English', 'Français']) {
      await switchTo(language);
      for (const selector of ['[data-doctype=author]', '[data-doctype=logoSet]', '#nav-menus', '#nav-media']) {
        assert.equal(await evaluate(`!!document.querySelector(${JSON.stringify(selector)})`), true, `${selector} remains shared`);
      }
      await click('[data-doctype=author]');
      await waitFor("document.querySelector('tbody')?.textContent.includes('Alex')");
    }
    const guard = async choice => {
      await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
      await evaluate(`[...document.querySelectorAll('.unsaved-dialog button')].find(button => button.textContent.trim() === ${JSON.stringify(choice)}).click()`);
      await waitFor("!document.querySelector('.unsaved-dialog[open]')");
    };
    const openPage = async title => { await pages(); await row(title); await openProperties({ evaluate, waitFor }); await waitFor(`!!document.querySelector(${JSON.stringify(titleField)})`); };
    await openPage('Le studio français');
    await waitFor("document.querySelector('.canvas-stage')?.dataset.ready === 'true'");
    const frame = "document.querySelector('.visual-editor iframe').contentDocument";
    assert.equal(await evaluate(`${frame}.querySelector('h1').textContent.trim()`), 'Un studio, deux langues');
    assert.equal(await evaluate("new URL(document.querySelector('.visual-live').href).pathname"), '/fr/studio/');
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true, 'Language selector and page editor fit the viewport');
    await writeFile('_temp/multilang-desktop.png', Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
    await set(titleField, 'Titre non enregistré');
    assert.deepEqual(await readFile(files[0]), originals.get(files[0]), 'Editing must not autosave');
    await choose('English'); await guard('Keep editing');
    assert.equal(await locale(), 'Français');
    assert.equal(await evaluate(`document.querySelector(${JSON.stringify(titleField)}).value`), 'Titre non enregistré');
    await waitFor(`document.activeElement === document.querySelector(${JSON.stringify(control)})`);
    for (const cancel of ['close', 'Escape']) {
      await choose('English');
      await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
      if (cancel === 'close') await click('.unsaved-head button'); else await key('Escape');
      await waitFor("!document.querySelector('.unsaved-dialog[open]')");
      await waitFor(`document.activeElement === document.querySelector(${JSON.stringify(control)})`);
      assert.equal(await locale(), 'Français');
      assert.equal(await evaluate(`document.querySelector(${JSON.stringify(titleField)}).value`), 'Titre non enregistré');
    }
    await choose('English'); await guard('Discard changes');
    await waitFor("!!document.querySelector('.welcome')");
    assert.equal(await locale(), 'English');
    assert.deepEqual(await readFile(files[0]), originals.get(files[0]));
    await switchTo('Français'); await openPage('Le studio français');
    await set(titleField, 'Le studio français, enregistré');
    await choose('English'); await guard('Save and leave');
    await waitFor("!!document.querySelector('.welcome')");
    assert.equal(JSON.parse(await readFile(files[0], 'utf8')).title, 'Le studio français, enregistré');
    await switchTo('Français'); await openPage('Le studio français, enregistré');
    await cdp('Page.reload');
    await waitFor("!!document.querySelector('#nav-pages')");
    await switchTo('Français'); await openPage('Le studio français, enregistré');
    assert.equal(await evaluate(`document.querySelector(${JSON.stringify(titleField)}).value`), 'Le studio français, enregistré');

    await click('[data-collection=articles-fr]');
    await waitFor("document.querySelector('tbody')?.textContent.includes('Publier pour deux publics')");
    await row('Publier pour deux publics');
    await openProperties({ evaluate, waitFor });
    await waitFor("document.querySelector('.canvas-stage')?.dataset.ready === 'true'");
    assert.equal(await evaluate(`${frame}.querySelector('h1').textContent.trim()`), 'Publier pour deux publics');
    assert.equal(await evaluate("new URL(document.querySelector('.visual-live').href).pathname"), '/fr/articles/publishing/');
    await set(titleField, 'Publier en français, enregistré');
    await click('.save-button');
    await waitFor("document.querySelector('.save-status')?.textContent.trim() === 'Saved'");
    assert.equal(JSON.parse(await readFile(files[1], 'utf8')).frontmatter.title, 'Publier en français, enregistré');
    let live = '';
    for (let attempt = 0; attempt < 50; attempt++) {
      live = await fetch(new URL('/fr/articles/publishing/', base)).then(response => response.text());
      if (live.includes('Publier en français, enregistré')) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.ok(live.includes('Publier en français, enregistré'), 'Live route uses the saved FR file and metadata slug');
    assert.ok(!live.includes('Publishing for two audiences'));
    await cdp('Page.reload');
    await waitFor("!!document.querySelector('#nav-pages')");
    await switchTo('Français');
    await click('[data-collection=articles-fr]');
    await waitFor("document.querySelector('tbody')?.textContent.includes('Publier en français, enregistré')");
    await row('Publier en français, enregistré');
    await waitFor("document.querySelector('.canvas-stage')?.dataset.ready === 'true'");
    assert.equal(await evaluate(`${frame}.querySelector('h1').textContent.trim()`), 'Publier en français, enregistré');
    await click('.brand');
    await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
    await evaluate(`document.querySelector(${JSON.stringify(control)}).focus()`);
    await click(control);
    await waitFor("!!document.querySelector('.select-menu:popover-open')");
    assert.equal(await evaluate("(() => { const r = document.querySelector('.select-menu:popover-open').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight; })()"), true);
    assert.equal(await evaluate(`document.querySelector(${JSON.stringify(control)}).getAttribute('aria-expanded')`), 'true');
    await key('Home'); await key('Enter');
    await waitFor(`document.querySelector(${JSON.stringify(control)})?.textContent.trim() === 'English'`);
    assert.equal(await evaluate(`document.activeElement === document.querySelector(${JSON.stringify(control)})`), true);
    await key('End'); await key('Escape');
    await waitFor("!document.querySelector('.select-menu:popover-open')");
    assert.equal(await locale(), 'English', 'Escape cancels highlighted choice');
    await writeFile('_temp/multilang-mobile.png', Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
    await cdp('Emulation.clearDeviceMetricsOverride');
    for (const file of files.slice(2)) assert.deepEqual(await readFile(file), originals.get(file), `${file}: saving French never touches other content`);
    console.log('PASS: content locale lists/search, independent interface language, shared assets, guarded Keep/Discard/Save, real FR page/article saves, preview/live/reload and mobile keyboard selector');
  } finally {
    for (const [file, bytes] of originals) await writeFile(file, bytes);
    for (const [file, bytes] of originals) assert.deepEqual(await readFile(file), bytes, `${file}: byte-exact restoration`);
  }
}
