import assert from 'node:assert/strict';
import { openProperties } from './editor-controls.mjs';
import { readFile, writeFile, rm, access } from 'node:fs/promises';

export async function checkAuthors({ cdp, evaluate, waitFor }) {
  const files = ['src/content/blog/first-post.json', 'src/content/news/launch-week.json'];
  const originals = await Promise.all(files.map(file => readFile(file, 'utf8')));
  const created = 'src/content/authors/browser-author-check.json';
  await assert.rejects(access(created));
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const input = (selector, value) => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); el.value = ${JSON.stringify(value)}; el.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  const open = async (collection, slug) => {
    await click(`[data-collection="${collection}"]`);
    await waitFor("!!document.querySelector('tbody .table-link')");
    await evaluate(`[...document.querySelectorAll('tbody tr')].find(row => row.cells[1].textContent.trim() === ${JSON.stringify(slug)}).querySelector('.table-link').click()`);
    await waitFor("document.querySelector('.canvas-stage')?.dataset.ready === 'true'");
    await openProperties({ evaluate, waitFor });
    await click('#properties-tab-page');
  };
  const choose = async ids => {
    await evaluate(`(() => { const el = document.querySelector('[data-collection-field="author"] select'); for (const option of el.options) option.selected = ${JSON.stringify(ids)}.includes(option.value); el.dispatchEvent(new Event('change', { bubbles: true })); })()`);
  };
  const save = async () => {
    await click('.save-button');
    await waitFor("document.querySelector('.save-status')?.textContent.trim() === 'Saved'");
  };
  const publicByline = async (route, text) => {
    for (let i = 0; i < 100; i++) {
      const html = await (await fetch(new URL(route, process.env.RIGEL_URL || 'http://127.0.0.1:4321/rigel/'))).text();
      if (html.match(/data-rigel-text="author"[^>]*>([^<]*)<\/span>/)?.[1] === text) return;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.fail(`Public author byline did not update to ${text}`);
  };
  let script;
  try {
    await waitFor("!!document.querySelector('[data-doctype=author]')");
    await click('[data-doctype="author"]');
    await waitFor("document.querySelector('.titlebar h2')?.textContent === 'Authors'");
    assert.deepEqual(await evaluate("[...document.querySelectorAll('th')].map(header => header.textContent.trim())"), ['', 'Name', 'Email', 'Slug']);
    assert.equal(await evaluate("document.querySelector('th').getAttribute('aria-label')"), 'Photo', 'Unlabelled photo column keeps its accessible name');
    const authors = await evaluate("fetch('/rigel/manifest.json').then(response => response.json()).then(manifest => manifest.documents.filter(doc => doc.type === 'author'))");
    assert.equal(await evaluate("document.querySelectorAll('tbody tr').length"), authors.length);
    for (const author of authors) {
      const row = `[...document.querySelectorAll('tbody tr')].find(row => row.cells[3].textContent.trim() === ${JSON.stringify(author.slug)})`;
      assert.equal(await evaluate(`${row}.cells[2].textContent.trim()`), author.data.email ?? '');
      if (author.data.photo) {
        await waitFor(`${row}.querySelector('img')?.complete && ${row}.querySelector('img')?.naturalWidth > 0`);
        assert.deepEqual(await evaluate(`(() => { const image=${row}.querySelector('img'); const style=getComputedStyle(image); return {src:image.getAttribute('src'),width:style.width,height:style.height,fit:style.objectFit}; })()`), {src:author.data.photo,width:'32px',height:'32px',fit:'cover'});
      } else {
        assert.deepEqual(await evaluate(`(() => { const placeholder=${row}.querySelector('.table-avatar-placeholder'); const style=getComputedStyle(placeholder); return {icon:!!placeholder.querySelector('svg'),width:style.width,height:style.height,radius:style.borderRadius}; })()`), {icon:true,width:'32px',height:'32px',radius:'0px'}, 'Missing author photos show the square user placeholder');
      }
    }
    await evaluate("[...document.querySelectorAll('.table-sort')].find(button => button.textContent.trim() === 'Email').click()");
    assert.deepEqual(await evaluate("[...document.querySelectorAll('tbody tr')].map(row => row.cells[2].textContent.trim())"), authors.map(author => author.data.email ?? '').sort((a,b) => a.localeCompare(b)));
    await writeFile('_temp/authors-list.png', Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data,'base64'));
    await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true, 'Author columns do not overflow the mobile page');
    await writeFile('_temp/authors-list-mobile.png', Buffer.from((await cdp('Page.captureScreenshot', {format:'png'})).data,'base64'));
    await cdp('Emulation.clearDeviceMetricsOverride');
    await click('.titlebar .primary');
    await waitFor("!!document.querySelector('.action-dialog[open] input')");
    await input('.action-dialog input', 'Browser Author Check');
    await click('.action-dialog .primary');
    await waitFor("!!document.querySelector('.document-form [data-schema-path=name] input')");
    assert.equal(await evaluate("document.querySelector('[data-schema-path=name] input').value"), 'Browser Author Check');
    await assert.rejects(access(created), 'Creating a draft never writes a file');
    await input('[data-schema-path=description] textarea', 'Author browser fixture');
    await input('[data-schema-path=email] input', 'writer@example.com');
    await input('[data-schema-path=url] input', 'https://example.com/writer');
    await save();
    const author = JSON.parse(await readFile(created, 'utf8'));
    assert.equal(author.name, 'Browser Author Check');
    assert.equal(author.email, 'writer@example.com');
    await click('[data-doctype="author"]');
    await waitFor("document.querySelector('.titlebar h2')?.textContent === 'Authors'");
    const newRow = "[...document.querySelectorAll('tbody tr')].find(row => row.cells[3].textContent.trim() === 'browser-author-check')";
    assert.equal(await evaluate(`${newRow}.cells[2].textContent.trim()`), 'writer@example.com');
    assert.equal(await evaluate(`${newRow}.querySelector('img')`), null, 'Authors without a photo have no broken thumbnail');
    assert.equal(await evaluate(`!!${newRow}.querySelector('.table-avatar-placeholder svg')`), true, 'New authors without a photo get the user icon');
    await evaluate(`${newRow}.querySelector('.table-link').click()`);
    await waitFor("!!document.querySelector('[data-schema-path=name] input')");
    await cdp('Page.bringToFront');
    await evaluate("document.querySelector('[data-schema-path=name] input').focus()");
    await waitFor("document.activeElement === document.querySelector('[data-schema-path=name] input') && getComputedStyle(document.activeElement).outlineOffset === '3px'");
    assert.deepEqual(await evaluate("(() => { const panel = getComputedStyle(document.querySelector('.document-form .schema-panel')), section = getComputedStyle(document.querySelector('.document-form section')), focus = getComputedStyle(document.activeElement); return { x: panel.overflowX, y: panel.overflowY, background: panel.backgroundColor, section: section.backgroundColor, shadow: section.boxShadow, outline: focus.outlineWidth, offset: focus.outlineOffset, canvas: !!document.querySelector('.content.visual') }; })()"), { x: 'visible', y: 'visible', background: 'rgba(0, 0, 0, 0)', section: 'rgba(0, 0, 0, 0)', shadow: 'none', outline: '3px', offset: '3px', canvas: false });
    await writeFile('_temp/author-record.png', Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
    await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 400, deviceScaleFactor: 1, mobile: false });
    await evaluate("document.querySelector('[data-schema-path=url] input').focus()");
    assert.equal(await evaluate("(() => { const rect = document.activeElement.getBoundingClientRect(); return rect.left >= 6 && rect.right <= innerWidth - 6 && rect.top >= 6 && rect.bottom <= innerHeight - 6 && document.documentElement.scrollWidth <= innerWidth; })()"), true, 'The final field and its full focus ring remain reachable on short mobile screens');
    await cdp('Emulation.clearDeviceMetricsOverride');
    await open('blog', 'first-post');
    assert.equal(await evaluate("document.querySelector('[data-collection-field=author] select').multiple"), false);
    await choose(['author:rigel-studio']);
    await waitFor("document.querySelector('.visual-editor iframe').contentDocument.querySelector('[data-rigel-text=author]').textContent === 'Rigel Studio'");
    assert.equal(await evaluate("document.querySelector('[data-collection-field=author] select').selectedOptions[0].textContent"), 'Rigel Studio');
    assert.equal(await evaluate("document.querySelectorAll('.reference-details').length"), 0, 'Author selection has no extra profile details');
    await writeFile('_temp/author-selector.png', Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
    await choose(['author:browser-author-check']);
    assert.equal(await readFile(files[0], 'utf8'), originals[0], 'Author selection remains unsaved');
    await save();
    assert.equal(JSON.parse(await readFile(files[0], 'utf8')).frontmatter.author, 'author:browser-author-check');
    await publicByline('/blog/first-post/', 'Browser Author Check');
    await cdp('Page.reload');
    await waitFor("!!document.querySelector('[data-doctype=author]')");
    await open('blog', 'first-post');
    assert.equal(await evaluate("document.querySelector('[data-collection-field=author] select').value"), 'author:browser-author-check');
    await open('news', 'launch-week');
    assert.equal(await evaluate("document.querySelector('[data-collection-field=author] select').multiple"), true);
    await choose(['author:alex', 'author:rigel-studio']);
    await waitFor("document.querySelector('.visual-editor iframe').contentDocument.querySelector('[data-rigel-text=author]').textContent === 'Alex, Rigel Studio'");
    await save();
    assert.deepEqual(JSON.parse(await readFile(files[1], 'utf8')).frontmatter.author, ['author:alex','author:rigel-studio']);
    await publicByline('/news/launch-week/', 'Alex, Rigel Studio');
    const rejected = await evaluate(`fetch('/rigel/api/local/blog/first-post', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ frontmatter: { author: 'author:missing' }, body: ${JSON.stringify(JSON.parse(originals[0]).body)} }) }).then(response => response.status)`);
    assert.equal(rejected, 400);
    assert.equal(JSON.parse(await readFile(files[0], 'utf8')).frontmatter.author, 'author:browser-author-check');
    script = await cdp('Page.addScriptToEvaluateOnNewDocument', { source: `const baseFetch = window.fetch; window.fetch = async (...args) => { const response = await baseFetch(...args); if (args[0] !== '/rigel/manifest.json') return response; const manifest = await response.json(); manifest.schema.documents.find(type => type.name === 'author').creatable = false; const field = manifest.collections.find(collection => collection.name === 'blog').fields.find(field => field.key === 'author'); delete field.to; field.options = [{ value: 'fixed', label: 'Fixed Author', description: 'Declared in config' }]; return Response.json(manifest); };` });
    await cdp('Page.reload');
    await waitFor("!!document.querySelector('[data-doctype=author]')");
    await click('[data-doctype=author]');
    await waitFor("document.querySelector('.titlebar h2')?.textContent === 'Authors'");
    assert.equal(await evaluate("!!document.querySelector('.titlebar .primary')"), false, 'Creation policy hides Add new');
    await open('blog', 'first-post');
    assert.equal(await evaluate("document.querySelector('[data-collection-field=author] select option[value=fixed]').textContent"), 'Fixed Author');
    await choose(['fixed']);
    await waitFor("document.querySelector('.visual-editor iframe').contentDocument.querySelector('[data-rigel-text=author]').textContent === 'Fixed Author'");
    console.log('PASS: Authors creation, metadata, square photo, config array, single/multiple selection, live names, explicit Save/file/public HTML/reload, creation-policy UI and unknown-reference rejection');
  } finally {
    if (script) await cdp('Page.removeScriptToEvaluateOnNewDocument', { identifier: script.identifier });
    await Promise.all(files.map((file, index) => writeFile(file, originals[index])));
    await rm(created, { force: true });
    await cdp('Page.reload');
    await waitFor("!!document.querySelector('[data-doctype=author]')");
  }
}
