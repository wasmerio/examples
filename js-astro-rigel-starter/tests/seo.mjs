import assert from 'node:assert/strict';
import { openProperties } from './editor-controls.mjs';
import { readFile, writeFile } from 'node:fs/promises';

export async function checkSeo({ cdp, evaluate, waitFor }) {
  const manifest = await evaluate("fetch('/rigel/manifest.json').then(response => response.json())");
  const pages = manifest.documents.filter(doc => !manifest.schema.documents.find(type => type.name === doc.type).shared);
  const fixtures = [
    { slug: 'home', file: 'src/content/pages/home.json', route: '/' },
    { slug: 'about', file: 'src/content/pages/about.json', route: '/about/' },
    { collection: 'blog', slug: 'first-post', file: 'src/content/blog/first-post.json', route: '/blog/first-post/' },
    { collection: 'news', slug: 'launch-week', file: 'src/content/news/launch-week.json', route: '/news/launch-week/' },
  ];
  const originals = await Promise.all(fixtures.map(item => readFile(item.file, 'utf8')));
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const open = async item => {
    await click(item.collection ? `[data-collection="${item.collection}"]` : '#nav-pages');
    await waitFor("!!document.querySelector('tbody .table-link')");
    if (item.drafted) assert.equal(await evaluate(`!![...document.querySelectorAll('tbody tr')].find(row => row.cells[1].textContent.trim() === ${JSON.stringify(item.slug)}).querySelector('.badge')`), true, 'Saved drafts are marked in page lists');
    await evaluate(`[...document.querySelectorAll('tbody tr')].find(row => row.cells[1].textContent.trim() === ${JSON.stringify(item.slug)}).querySelector('.table-link').click()`);
    await waitFor("document.querySelector('.canvas-stage')?.dataset.ready === 'true'");
    await openProperties({ evaluate, waitFor });
  };
  const input = (selector, value) => evaluate(`(() => { const input = document.querySelector(${JSON.stringify(selector)}); input.value = ${JSON.stringify(value)}; input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  const checkScroll = async () => {
    await evaluate("document.querySelector('.schema-panel').scrollIntoView({ block: 'start' }); document.querySelector('.schema-panel').scrollTop = 0");
    const before = await evaluate("(() => { const panel = document.querySelector('.schema-panel'); return { tabs: panel.querySelector('.panel-tabs').getBoundingClientRect().top, field: panel.querySelector('[role=tabpanel]:not([hidden]) input, [role=tabpanel]:not([hidden]) textarea').getBoundingClientRect().top }; })()");
    const distance = await evaluate("Math.min(160, document.querySelector('.schema-panel').scrollHeight - document.querySelector('.schema-panel').clientHeight)");
    assert.ok(distance > 0, 'Short viewports exercise real properties scrolling');
    await evaluate(`document.querySelector('.schema-panel').scrollTop = ${distance}`);
    await waitFor(`document.querySelector('.schema-panel').scrollTop >= ${distance - 1}`);
    const after = await evaluate("(() => { const panel = document.querySelector('.schema-panel'); return { tabs: panel.querySelector('.panel-tabs').getBoundingClientRect().top, field: panel.querySelector('[role=tabpanel]:not([hidden]) input, [role=tabpanel]:not([hidden]) textarea').getBoundingClientRect().top }; })()");
    assert.ok(Math.abs(after.tabs - before.tabs) < 2, 'Only Page/Content/SEO tabs stay pinned while scrolling');
    assert.ok(after.field <= before.field - distance + 2, 'Page and article properties scroll away beneath the tabs');
    assert.equal(await evaluate("(() => { const panel = document.querySelector('.schema-panel'), tabs = panel.querySelector('.panel-tabs'), background = getComputedStyle(panel).backgroundColor; return background !== 'rgba(0, 0, 0, 0)' && getComputedStyle(tabs).backgroundColor === background && getComputedStyle(tabs, '::before').backgroundColor === background; })()"), true, 'Tabs and the padding above them have an opaque panel background');
    assert.equal(await evaluate("(() => { const tabs = document.querySelector('.panel-tabs'), r = tabs.getBoundingClientRect(); return [r.top - 8, r.top + r.height / 2].every(y => document.elementFromPoint(r.left + r.width / 2, y)?.closest('.panel-tabs') === tabs); })()"), true, 'Scrolling fields cannot paint or receive clicks above the tabs');
    const width = await evaluate('innerWidth');
    await writeFile(`_temp/properties-scroll-${width}.png`, Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
    await evaluate("document.querySelector('.schema-panel').scrollTop = document.querySelector('.schema-panel').scrollHeight");
    const bottom = await evaluate("(() => { const panel = document.querySelector('.schema-panel'), controls = [...panel.querySelectorAll('[role=tabpanel]:not([hidden]) input, [role=tabpanel]:not([hidden]) textarea, [role=tabpanel]:not([hidden]) [contenteditable]')].filter(el => el.getBoundingClientRect().height); const last = controls.at(-1).getBoundingClientRect(), tabs = panel.querySelector('.panel-tabs').getBoundingClientRect(); return { last: last.toJSON(), tabs: tabs.toJSON(), panel: panel.getBoundingClientRect().toJSON(), width: innerWidth }; })()");
    assert.ok(bottom.last.bottom > bottom.tabs.bottom && bottom.last.bottom <= bottom.panel.bottom + 1, `Bottom properties remain reachable below the pinned tabs: ${JSON.stringify(bottom)}`);
    await evaluate("document.querySelector('.schema-panel').scrollTop = 0");
  };
  const image = '/demo/landscape.jpg';
  const absoluteImage = new URL(image, process.env.RIGEL_URL || 'http://localhost:4321/rigel/').href;
  const chooseImage = async attr => {
    await click(`[${attr}=ogImage] .image-field button`);
    await waitFor("!!document.querySelector('.image-dialog[open]')");
    await evaluate("[...document.querySelectorAll('.image-dialog .tabs button')].find(button => button.textContent.trim() === 'url').click()");
    await input('.image-dialog input[type=url]', image);
    await evaluate("[...document.querySelectorAll('.image-dialog button')].find(button => button.textContent.trim() === 'Use this URL').click()");
    await waitFor("!!document.querySelector('.image-dialog .media-selection')");
    await click('.image-dialog .media-actions .primary');
    await waitFor("!document.querySelector('.image-dialog[open]')");
  };
  try {
    for (const page of pages) {
      await open(page);
      const mapping = manifest.preview.documents[page.type];
      const slug = page.data.slug ?? page.slug;
      const route = slug === 'home' && mapping.index ? mapping.index : mapping.url.replaceAll('{slug}', slug);
      assert.deepEqual(await evaluate("(() => { const input = document.querySelector('.page-path input'); return { value: input.value, readonly: input.readOnly, tab: input.closest('[role=tabpanel]').id }; })()"), { value: route, readonly: true, tab: 'properties-page' });
      assert.equal(await evaluate("!!document.querySelector('[aria-label=\"Edit name\"]')"), false);
      assert.deepEqual(await evaluate("[...document.querySelectorAll('#properties-content > section > h3')].map(heading => heading.textContent)"), ['Structure']);
      assert.deepEqual(await evaluate("[...document.querySelectorAll('#properties-page > section > h3')].map(heading => heading.textContent)"), ['Page properties']);
      assert.equal(await evaluate("document.querySelector('#properties-page').hidden"), true, 'Content stays the default editing tab');
      await evaluate("window.pageNameControl = document.querySelector('.document-properties [data-schema-path=title] input'); window.draftControl = document.querySelector('.document-properties [data-schema-path=draft] input[role=switch]')");
      assert.equal(await evaluate("!!window.pageNameControl && !!window.draftControl"), true);
      assert.deepEqual(await evaluate("[...document.querySelectorAll('.panel-tabs [role=tab]')].map(tab => tab.textContent)"), ['Page', 'Content', 'SEO']);
      await click('#properties-tab-seo');
      assert.equal(await evaluate("!!document.querySelector('#properties-seo [data-schema-path=ogImage] .image-field')"), true, 'Every website page has a social image picker in SEO');
      assert.equal(await evaluate("!!document.querySelector('#properties-seo [data-schema-path=noindex] input[role=switch]')"), true, 'Every website page has its built-in indexing switch in SEO');
      assert.equal(await evaluate("!document.querySelector('#properties-seo').hidden && document.querySelector('#properties-content').hidden && !!document.querySelector('[data-schema-path=metaTitle] input') && !!document.querySelector('[data-schema-path=description] textarea')"), true);
      await evaluate("document.querySelector('.visual-editor iframe').contentDocument.querySelector('h1').click()");
      await waitFor("document.querySelector('#properties-tab-content').getAttribute('aria-selected') === 'true' && !!document.activeElement?.closest('.section-properties')");
      assert.equal(await evaluate("window.pageNameControl === document.querySelector('.document-properties [data-schema-path=title] input') && window.draftControl === document.querySelector('.document-properties [data-schema-path=draft] input[role=switch]')"), true, 'Page properties remain mounted when selecting sections');
      assert.deepEqual(await evaluate("[...document.querySelectorAll('#properties-content > section > h3')].map(heading => heading.textContent)"), ['Structure', 'Section properties']);
      await evaluate("document.querySelector('.structure-row').click()");
      assert.equal(await evaluate("window.pageNameControl === document.querySelector('.document-properties [data-schema-path=title] input')"), true);
      if (page.slug === 'home') {
        for (const width of [1280, 390]) {
          await cdp('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: false });
          await checkScroll();
        }
        await cdp('Emulation.clearDeviceMetricsOverride');
        await writeFile('_temp/page-properties.png', Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
      }
    }
    for (const item of fixtures) {
      await open(item);
      if (item.collection) {
        await click('#properties-tab-page');
        for (const width of [1280, 390]) {
          await cdp('Emulation.setDeviceMetricsOverride', { width, height: 600, deviceScaleFactor: 1, mobile: false });
          await checkScroll();
        }
        await cdp('Emulation.clearDeviceMetricsOverride');
      }
      const frame = "document.querySelector('.visual-editor iframe')";
      const heading = await evaluate(`${frame}.contentDocument.querySelector('h1').textContent`);
      const originalSeo = await evaluate("document.querySelector('.seo-fields input').value");
      const name = `Renamed ${item.collection ?? 'page'} ${item.slug}`;
      const attr = item.collection ? 'data-collection-field' : 'data-schema-path';
      await click('#properties-tab-page');
      assert.equal(await evaluate("!!document.querySelector('#properties-page input') && document.querySelector('#properties-content').hidden && document.querySelector('#properties-seo').hidden"), true);
      assert.equal(await evaluate("document.querySelector('.page-path input').value"), item.route);
      assert.equal(await evaluate("!!document.querySelector('.titlebar [aria-label=\"Delete post\"]')"), false);
      if (item.collection) assert.equal(await evaluate("!!document.querySelector('#properties-page [aria-label=\"Delete post\"]')"), true);
      const slugSelector = '#properties-page input:not([readonly])';
      const originalSlug = await evaluate(`document.querySelector(${JSON.stringify(slugSelector)}).value`);
      await input(slugSelector, 'Route check');
      const mapping = item.collection ? manifest.preview.collections[item.collection] : manifest.preview.documents[pages.find(page => page.slug === item.slug).type];
      assert.equal(await evaluate("document.querySelector('.page-path input').value"), mapping.url.replaceAll('{slug}', 'route-check'), 'Resolved path updates from unsaved slug changes');
      assert.equal(await readFile(item.file, 'utf8'), originals[fixtures.indexOf(item)], 'Viewing and changing the route does not autosave');
      await input(slugSelector, originalSlug);
      await input(`[${attr}=title] input`, name);
      if (!item.collection) await click('[data-schema-path=draft] input[role=switch]');
      assert.equal(await evaluate("document.querySelector('.titlebar h2').textContent"), name);
      assert.equal(await evaluate("document.querySelector('.seo-fields input').value"), originalSeo, 'Renaming content does not overwrite SEO title');
      assert.equal(await readFile(item.file, 'utf8'), originals[fixtures.indexOf(item)], 'Page properties do not autosave or change the URL');
      await evaluate("document.querySelector('#properties-tab-content').focus()");
      for (const [key, code, target] of [['Home', 36, 'page'], ['ArrowLeft', 37, 'seo'], ['ArrowRight', 39, 'page'], ['ArrowRight', 39, 'content'], ['End', 35, 'seo']]) {
        await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key, windowsVirtualKeyCode: code });
        await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key, windowsVirtualKeyCode: code });
        await waitFor(`document.activeElement?.id === 'properties-tab-${target}' && !document.querySelector('#properties-${target}').hidden`);
      }
      const title = `SEO title ${item.collection ?? 'page'} ${item.slug}`;
      const noindex = `#properties-seo [${attr}=noindex] input[role=switch]`;
      assert.equal(await evaluate(`document.querySelector(${JSON.stringify(noindex)}).checked`), false, 'Missing noindex defaults to indexable');
      assert.equal(await evaluate(`document.querySelector(${JSON.stringify(noindex)}).closest('label').textContent.trim()`), 'No index (noindex)');
      assert.equal(await evaluate("document.querySelector('#properties-seo [data-seo-noindex]').textContent.trim()"), 'Instruct search engines not to index this page or show it in search results. Robots can still crawl the page and follow its links. This does not make the page private.');
      const previewRobots = await evaluate(`${frame}.contentDocument.querySelector('meta[name=robots]')?.content ?? null`);
      await click(noindex);
      assert.equal(await evaluate(`document.querySelector(${JSON.stringify(noindex)}).checked`), true);
      assert.equal(await evaluate(`${frame}.contentDocument.querySelector('meta[name=robots]')?.content ?? null`), previewRobots, 'Unsaved indexing does not replace preview metadata');
      assert.equal(await evaluate(`fetch(${JSON.stringify(item.route)}).then(response => response.text()).then(html => new DOMParser().parseFromString(html, 'text/html').querySelector('meta[name=robots]')?.content ?? null)`), null, 'Unsaved indexing leaves the public head unchanged');
      const description = `Saved SEO description for ${item.route}`;
      for (const [key, cases] of [
        ['metaTitle', [['', 'empty'], ['Tiny', 'danger'], ['T'.repeat(40), 'warning'], ['T'.repeat(50), 'success'], ['T'.repeat(60), 'success'], ['T'.repeat(61), 'danger'], ['🌟', 'danger']]],
        ['description', [['', 'empty'], ['Short', 'danger'], ['D'.repeat(100), 'warning'], ['D'.repeat(120), 'success'], ['D'.repeat(160), 'success'], ['D'.repeat(161), 'danger']]],
      ]) {
        for (const [value, tone] of cases) {
          await input(`[${attr}=${key}] ${key === 'metaTitle' ? 'input' : 'textarea'}`, value);
          assert.equal(await evaluate(`document.querySelector('[data-seo-length=${key}]').dataset.tone`), tone);
          assert.equal(await evaluate(`document.querySelector('[data-seo-length=${key}]').firstElementChild.getAttribute('role')`), 'meter', 'Length bar sits before the recommendation and counter');
          assert.equal(await evaluate(`Number(document.querySelector('[data-seo-length=${key}] [role=meter]').getAttribute('aria-valuenow'))`), [...value].length);
          assert.equal(await evaluate(`document.querySelector('[data-seo-length=${key}] .seo-length-count').textContent`), `${[...value].length}/${key === 'metaTitle' ? 60 : 160}`);
        }
      }
      await input(`[${attr}=metaTitle] input`, title);
      await input(`[${attr}=description] textarea`, description);
      await chooseImage(attr);
      assert.equal(await evaluate(`document.querySelector('[${attr}=ogImage] .image-field img').getAttribute('src')`), image);
      assert.equal(await evaluate(`(() => { const field=document.querySelector('[${attr}=ogImage] .image-field'), bounds=field.getBoundingClientRect(); return [...field.children].every(child => child.getBoundingClientRect().right <= bounds.right); })()`), true, 'Social image controls fit the properties panel');
      assert.equal(await evaluate(`(() => { const field=document.querySelector('[${attr}=ogImage] .image-field'), preview=field.querySelector('.preview'), rect=preview.getBoundingClientRect(), button=field.querySelector('button').getBoundingClientRect(), style=getComputedStyle(preview); return rect.width <= 400 && Math.abs(rect.width-field.getBoundingClientRect().width)<1 && Math.abs(rect.width/rect.height-1200/628)<0.02 && style.objectFit==='cover' && style.objectPosition==='50% 50%' && button.top>=rect.bottom; })()`), true, 'Social image fills the sidebar up to 400px with a centered 1200:628 crop and controls below');
      assert.equal(await evaluate(`document.querySelector('[${attr}=ogImage]').textContent.includes('1200 × 628 px')`), true);
      assert.equal(await readFile(item.file, 'utf8'), originals[fixtures.indexOf(item)], 'SEO edits stay unsaved');
      assert.equal(await evaluate(`${frame}.contentDocument.querySelector('h1').textContent`), item.collection ? name : heading, 'SEO title is independent of the content heading');
      await click('#properties-tab-content');
      await click('#properties-tab-seo');
      assert.equal(await evaluate(`document.querySelector('[${attr}=metaTitle] input').value`), title);
      if (item.slug === 'home') await writeFile('_temp/page-seo.png', Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
      await click('.save-button');
      await waitFor("document.querySelector('.save-status')?.textContent.trim() === 'Saved'");
      const saved = await readFile(item.file, 'utf8');
      assert(saved.includes(title) && saved.includes(description), 'Explicit Save persists text metadata');
      const savedData = JSON.parse(saved);
      assert.equal((item.collection ? savedData.frontmatter : savedData).ogImage, image, 'Explicit Save persists the social image');
      assert.equal((item.collection ? savedData.frontmatter : savedData).noindex, true, 'Explicit Save persists noindex in the existing content record');
      assert(saved.includes(name), 'Explicit Save persists the independently edited CMS name');
      if (!item.collection) assert.equal(JSON.parse(saved).draft, true);
      for (let attempt = 0; attempt < 100; attempt++) {
        const head = await evaluate(`fetch(${JSON.stringify(item.route)}).then(response => response.text()).then(html => { const doc = new DOMParser().parseFromString(html, 'text/html'); return { title: doc.title, description: doc.querySelector('meta[name=description]')?.content, ogImage: doc.querySelector('meta[property=\"og:image\"]')?.content, twitterImage: doc.querySelector('meta[name=\"twitter:image\"]')?.content }; })`);
        if (head.title === `${title} | Rigel` && head.description === description && head.ogImage === absoluteImage && head.twitterImage === absoluteImage) break;
        if (attempt === 99) assert.fail(`Actual public metadata did not update for ${item.route}: ${JSON.stringify(head)}`);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      await cdp('Page.reload');
      await waitFor("!!document.querySelector('[data-doctype=author]')");
      await open({ ...item, drafted: !item.collection });
      await waitFor(`fetch(${JSON.stringify(item.route)}).then(response => response.text()).then(html => { const tags=new DOMParser().parseFromString(html,'text/html').querySelectorAll('meta[name=robots]'); return tags.length === 1 && tags[0].content === 'noindex'; })`);
      if (!item.collection) assert.equal(await evaluate("document.querySelector('[data-schema-path=draft] input[role=switch]').checked"), true, 'Draft state survives Save and reload');
      await click('#properties-tab-seo');
      assert.equal(await evaluate(`document.querySelector('[${attr}=metaTitle] input').value`), title);
      assert.equal(await evaluate(`document.querySelector('[${attr}=description] textarea').value`), description);
      assert.equal(await evaluate(`document.querySelector(${JSON.stringify(noindex)}).checked`), true, 'Indexing switch survives Save and reload');
      await click(noindex);
      assert.equal(await evaluate(`document.querySelector('[${attr}=ogImage] .image-field img').getAttribute('src')`), image, 'Social image survives reload');
      await click(`[${attr}=ogImage] [aria-label="Remove image"]`);
      assert.equal(await readFile(item.file, 'utf8'), saved, 'Removing a social image does not autosave');
      await click('.save-button');
      await waitFor("document.querySelector('.save-status')?.textContent.trim() === 'Saved'");
      const cleared = JSON.parse(await readFile(item.file, 'utf8'));
      assert.equal((item.collection ? cleared.frontmatter : cleared).ogImage, '');
      assert.equal((item.collection ? cleared.frontmatter : cleared).noindex, false, 'Indexing can be re-enabled with explicit Save');
      await waitFor(`fetch(${JSON.stringify(item.route)}).then(response => response.text()).then(html => !new DOMParser().parseFromString(html,'text/html').querySelector('meta[name=robots]'))`);
      await waitFor(`fetch(${JSON.stringify(item.route)}).then(response => response.text()).then(html => { const head=new DOMParser().parseFromString(html,'text/html'); return !head.querySelector('meta[property="og:image"], meta[name="twitter:image"]'); })`);
    }
    console.log('PASS: Page/Content/SEO tabs on all website pages and articles, built-in noindex switch defaults/unsaved isolation/Save/reload/re-enable, unique public robots tag, keyboard navigation, independent SEO values and exact fixture restoration');
  } finally {
    await cdp('Emulation.clearDeviceMetricsOverride');
    await evaluate('scrollTo(0, 0)');
    await Promise.all(fixtures.map((item, index) => writeFile(item.file, originals[index])));
    await cdp('Page.reload');
    await waitFor("!!document.querySelector('[data-doctype=author]')");
  }
}
