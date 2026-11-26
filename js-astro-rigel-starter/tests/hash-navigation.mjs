import assert from 'node:assert/strict';
import { openProperties } from './editor-controls.mjs';

export async function checkHashNavigation({ cdp, evaluate, waitFor }) {
  const quote = JSON.stringify;
  const click = selector => evaluate(`document.querySelector(${quote(selector)}).click()`);
  const choice = label => evaluate(`[...document.querySelectorAll('.unsaved-dialog button')].find(button => button.textContent.trim() === ${quote(label)}).click()`);
  const writes = () => evaluate('window.hashNavigationWrites.length');
  const mockWrites = () => evaluate(`window.hashNavigationOriginalFetch = window.fetch; window.hashNavigationWrites = []; window.hashNavigationFail = false; window.fetch = async (...args) => {
    const url = new URL(args[0] instanceof Request ? args[0].url : args[0], location.href);
    const method = args[1]?.method ?? (args[0] instanceof Request ? args[0].method : 'GET');
    if (url.pathname.startsWith('/rigel/api/') && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      window.hashNavigationWrites.push({ url: url.pathname, method, body: args[1]?.body ? JSON.parse(args[1].body) : null });
      return new Response(window.hashNavigationFail ? 'Hash navigation save failure' : null, { status: window.hashNavigationFail ? 500 : 204 });
    }
    return window.hashNavigationOriginalFetch(...args);
  }`);
  const hash = () => evaluate('location.hash');
  const expectHash = value => waitFor(`location.hash === ${quote(value)}`);
  const welcome = "!!document.querySelector('.welcome')";
  const menuField = '.menu-details input:not([readonly])';
  const menuReady = `!!document.querySelector(${quote(menuField)})`;
  const base = await evaluate('location.origin + location.pathname');
  const manifest = await evaluate("fetch('/rigel/manifest.json').then(response => response.json())");
  const about = manifest.documents.find(document => document.id === 'page:about');
  const blog = manifest.collections.find(collection => collection.name === 'blog');
  const footer = manifest.menus?.entries.find(menu => menu.slug === 'footer');
  assert(about && blog?.posts.length && footer, 'Existing about document, blog post and footer menu are required');
  const post = blog.posts.find(post => post.slug === 'first-post') ?? blog.posts[0];
  const route = (...parts) => '#/' + parts.map(encodeURIComponent).join('/');
  const documentHash = route('pages', about.slug);
  const menuHash = route('menus', footer.slug);
  const titleIs = title => `document.querySelector('main .titlebar h2')?.textContent === ${quote(title)}`;
  const cases = [
    ['#/pages', "!!document.querySelector('.pages-controls') && !!document.querySelector('.table-card')", '#/pages?all=1'],
    ['#/pages?all=1', "!!document.querySelector('.pages-controls') && !!document.querySelector('.table-card')"],
    [documentHash, titleIs(about.data.title)],
    ['#/author', "!!document.querySelector('.table-card') && !document.querySelector('.pages-controls')"],
    ['#/collections/blog', "!!document.querySelector('[data-collection=blog].active') && !!document.querySelector('.table-card')"],
    [route('collections', 'blog', post.slug), titleIs(post.frontmatter.title)],
    ['#/menus', "!!document.querySelector('.table-card') && !!document.querySelector('#nav-menus.active')"],
    [menuHash, menuReady],
    ['#/media', "!!document.querySelector('#nav-media.active') && !document.querySelector('.welcome')"],
  ];
  for (const page of manifest.pages) cases.push([route('copy', page.slug), titleIs(page.label)]);
  for (const doc of manifest.documents.filter(doc => doc.id !== about.id)) {
    const type = manifest.schema.documents.find(type => type.name === doc.type);
    const fragment = doc.type === 'page' ? route('pages', doc.slug) : route(doc.type, doc.slug);
    cases.push([fragment, titleIs(type.singleton ? type.title : String(doc.data.title || doc.data.name || doc.slug))]);
  }
  const categories = [...new Set([...manifest.pages, ...(manifest.schema?.documents ?? [])].filter(entry => !entry.shared && entry.category).map(entry => entry.category))];
  for (const category of categories) cases.push(['#/pages?' + new URLSearchParams({ category }), `!!document.querySelector('.table-card') && document.querySelector('main .titlebar h2')?.textContent.includes(${quote(category)})`]);
  const locales = manifest.contentLocales?.locales ?? [];
  if (locales.some(locale => locale.code === 'fr')) {
    cases.push([menuHash + '?locale=fr', `document.querySelector('.content-language')?.dataset.locale === 'fr' && (${menuReady})`]);
  }
  const fresh = async fragment => {
    await cdp('Page.navigate', { url: new URL('manifest.json', base).href });
    await waitFor("location.pathname === '/rigel/manifest.json'");
    await cdp('Page.navigate', { url: base + fragment });
    await waitFor("!!document.querySelector('#nav-pages')");
  };
  const historyEntry = async () => {
    const history = await cdp('Page.getNavigationHistory');
    return { index: history.currentIndex, id: history.entries[history.currentIndex].id, url: history.entries[history.currentIndex].url };
  };
  const traverse = async direction => {
    await evaluate(`history.${direction}()`);
  };
  try {
    await fresh('');
    await waitFor(welcome);
    assert.equal(await hash(), '', 'Plain /rigel/ must stay on Welcome');
    for (const [fragment, ready, canonical = fragment] of cases) {
      await fresh(fragment);
      await expectHash(canonical);
      await waitFor(ready);
      await evaluate("window.hashNavigationMarker = 'before-refresh'");
      await cdp('Page.reload');
      await waitFor("!!document.querySelector('#nav-pages') && window.hashNavigationMarker === undefined");
      await expectHash(canonical);
      await waitFor(ready);
    }
    if (manifest.contentLocales) {
      await fresh(menuHash + '?' + new URLSearchParams({ locale: manifest.contentLocales.defaultLocale }));
      await expectHash(menuHash);
      await waitFor(menuReady);
      await cdp('Page.reload');
      await expectHash(menuHash);
      await waitFor(menuReady);
    }
    await fresh(route('documents', 'page', about.id));
    await expectHash(documentHash);
    await waitFor(titleIs(about.data.title));
    await fresh('#/documents/author');
    await expectHash('#/author');
    console.log('PASS: readable content paths restore on fresh URL and refresh; older document links normalize to clean paths');
    if (!manifest.pages.length) console.log('SKIP: legacy copy restoration (manifest has no legacy pages)');
    if (!locales.some(locale => locale.code === 'fr')) console.log('SKIP: French locale restoration (manifest has no French content locale)');

    await fresh('');
    await waitFor(welcome);
    await evaluate("window.hashNavigationMarker = 'same-document'");
    for (const [selector, fragment, ready] of [
      ['#nav-pages', '#/pages?all=1', "!!document.querySelector('.table-card')"],
      ['[data-collection="blog"]', '#/collections/blog', "!!document.querySelector('[data-collection=blog].active') && !!document.querySelector('.table-card')"],
      ['#nav-menus', '#/menus', "!!document.querySelector('.table-card')"],
      ['#nav-media', '#/media', "!!document.querySelector('#nav-media.active')"],
      ['.brand', '', welcome],
    ]) {
      await click(selector);
      await expectHash(fragment);
      await waitFor(ready);
      assert.equal(await evaluate('window.hashNavigationMarker'), 'same-document', 'Editor navigation must not reload');
    }
    await click('#nav-pages');
    await waitFor("!!document.querySelector('.table-card')");
    await evaluate(`[...document.querySelectorAll('tbody tr')].find(row => [...row.cells].some(cell => cell.textContent.trim() === 'about')).querySelector('.table-link').click()`);
    await expectHash(documentHash);
    await openProperties({ evaluate, waitFor });
    await click('#properties-tab-page');
    await waitFor("!!document.querySelector('#properties-page input:not([readonly])')");
    const slugInput = '#properties-page input:not([readonly])';
    const originalSlug = await evaluate(`document.querySelector(${quote(slugInput)}).value`);
    await mockWrites();
    for (const slug of ['hash-navigation-unsaved-slug', originalSlug]) {
      await evaluate(`(() => { const input = document.querySelector(${quote(slugInput)}); input.value = ${quote(slug)}; input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
      assert.equal(await hash(), documentHash, 'Schema route uses storage identity, not its editable slug');
    }
    await waitFor("document.querySelector('.save-button').disabled");
    await click('[data-collection="blog"]');
    await waitFor("!!document.querySelector('.table-card')");
    await evaluate(`[...document.querySelectorAll('tbody tr')].find(row => [...row.cells].some(cell => cell.textContent.trim() === ${quote(post.slug)})).querySelector('.table-link').click()`);
    await expectHash(route('collections', 'blog', post.slug));
    assert.equal(await evaluate('window.hashNavigationMarker'), 'same-document');

    const invalid = ['#/unknown', '#/documents', '#/documents/page/missing', '#/documents/author/page%3Aabout', '#/collections/missing', '#/collections/blog/missing', '#/menus/missing', '#/pages/missing', '#/documents/page/%E0%A4%A', '#/media/extra'];
    invalid.push('#/pages/definitely-missing-page');
    for (const fragment of invalid) {
      await fresh(fragment);
      await waitFor(welcome);
      await expectHash('');
    }
    await fresh(menuHash);
    await waitFor(menuReady);
    const menuEntry = await historyEntry();
    await evaluate("location.hash = '/documents/page/missing'");
    await waitFor(welcome);
    await expectHash('');
    const normalizedHistory = await cdp('Page.getNavigationHistory');
    assert.equal(normalizedHistory.entries[normalizedHistory.currentIndex - 1].id, menuEntry.id, 'Invalid hash is replaced, not followed by another entry');
    await traverse('back');
    await expectHash(menuHash);
    await waitFor(menuReady);
    console.log('PASS: UI updates hashes without reload; unknown, malformed and missing targets replace to Welcome');

    await fresh('#/pages');
    await waitFor("!!document.querySelector('.table-card')");
    await cdp('Page.resetNavigationHistory');
    await click('#nav-menus');
    await expectHash('#/menus');
    await waitFor("!!document.querySelector('.table-card')");
    await evaluate(`[...document.querySelectorAll('tbody tr')].find(row => [...row.cells].some(cell => cell.textContent.trim() === 'footer')).querySelector('.table-link').click()`);
    await expectHash(menuHash);
    await waitFor(menuReady);
    const original = await evaluate(`document.querySelector(${quote(menuField)}).value`);
    await click('#nav-media');
    await expectHash('#/media');
    await traverse('back');
    await expectHash(menuHash);
    await waitFor(menuReady);
    await traverse('forward');
    await expectHash('#/media');
    await waitFor("!!document.querySelector('#nav-media.active')");
    await traverse('back');
    await expectHash(menuHash);
    await waitFor(menuReady);
    await mockWrites();
    const edit = text => evaluate(`(() => { const input = document.querySelector(${quote(menuField)}); input.value = ${quote(text)}; input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
    await edit('Hash navigation draft');
    await waitFor("!document.querySelector('.save-button').disabled");
    await evaluate('new Promise(resolve => setTimeout(resolve, 1100))');
    assert.equal(await writes(), 0, 'Editing must not autosave');
    const current = await historyEntry();
    for (const direction of ['back', 'forward']) {
      await traverse(direction);
      await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
      assert.deepEqual(await historyEntry(), current, `Dirty ${direction} restores the current history entry before showing the dialog`);
      await choice('Keep editing');
      await waitFor("!document.querySelector('.unsaved-dialog')");
      await expectHash(menuHash);
      await waitFor(`document.querySelector(${quote(menuField)})?.value === 'Hash navigation draft'`);
      assert.deepEqual(await historyEntry(), current, `Cancelling ${direction} restores the current history entry and URL`);
      assert.equal(await writes(), 0, 'Cancelling navigation must not save');
    }
    await traverse('back');
    await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
    await choice('Discard changes');
    await expectHash('#/menus');
    await waitFor("!!document.querySelector('.table-card')");
    assert.equal(await writes(), 0, 'Discard must not save');
    await traverse('forward');
    await expectHash(menuHash);
    await waitFor(menuReady);
    assert.equal(await evaluate(`document.querySelector(${quote(menuField)}).value`), original, 'Discard removes the draft');
    await edit('Saved hash navigation');
    await evaluate('window.hashNavigationFail = true');
    await traverse('forward');
    await waitFor("!!document.querySelector('.unsaved-dialog[open]')");
    await choice('Save and leave');
    await waitFor("document.querySelector('.unsaved-dialog [role=alert]')?.textContent.includes('Hash navigation save failure')");
    await expectHash(menuHash);
    assert.deepEqual(await historyEntry(), current, 'Failed Save keeps the current history entry');
    assert.equal(await evaluate(`document.querySelector(${quote(menuField)}).value`), 'Saved hash navigation');
    assert.equal(await writes(), 1, 'Only the explicit failed Save writes');
    await evaluate('window.hashNavigationFail = false');
    await choice('Save and leave');
    await waitFor("!document.querySelector('.unsaved-dialog')");
    await expectHash('#/media');
    assert.equal(await writes(), 2, 'Successful Save retries exactly once');
    assert.equal(await evaluate('window.hashNavigationWrites[1].body.title'), 'Saved hash navigation');
    await traverse('back');
    await expectHash(menuHash);
    await waitFor(menuReady);
    assert.equal(await evaluate(`document.querySelector(${quote(menuField)}).value`), 'Saved hash navigation', 'Save retains the saved draft when revisiting');
    assert.equal(await evaluate("document.querySelector('.save-button').disabled"), true);
    console.log('PASS: Back/Forward, dirty cancel preserves URL and entry, discard, failed/successful Save, no autosave (mocked writes)');
  } finally {
    await evaluate('if (window.hashNavigationOriginalFetch) { window.fetch = window.hashNavigationOriginalFetch; delete window.hashNavigationOriginalFetch; }');
    if (await evaluate("!!document.querySelector('.brand')")) {
      await click('.brand');
      if (await evaluate("!!document.querySelector('.unsaved-dialog[open]')")) await choice('Discard changes');
      await waitFor(welcome);
      await cdp('Page.reload');
      await waitFor(welcome);
    }
  }
}
