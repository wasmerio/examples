import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import relativeLinks, {
  checkRelativeLinks,
} from '../src/integrations/relative-links.ts';
import { contentUrls } from '../src/lib/content-urls.ts';

test('build checks final relative content destinations, resources and anchors under a deployment base', async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'bloggpt-links-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const put = async (file, text = '') => {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), text);
  };
  await put('index.html', '<h1 id="home">Home</h1>');
  await put(
    'zh/about/index.html',
    '<h1 id="关于">About</h1><a name="legacy"></a>',
  );
  await put('zh/posts/2025/older/index.html', '<p id="section">Older</p>');
  await put(
    'alias/index.html',
    '<meta http-equiv="refresh" content="0;url=/blog/zh/posts/2025/older/">',
  );
  await put('zh/posts/2026/start/cover.webp');
  await put('zh/posts/2026/start/big.webp');
  await put('zh/posts/2026/start/download.zip');
  await put('zh/posts/2026/start/demo.mjs', 'export const answer = 42;');
  await put('zh/posts/2026/start/demo.html', '<p id="demo">Attachment</p>');
  const html = `<main><a href="missing-ui/">UI excluded</a><div class="article-content">
    <h2 id="here">Section</h2>
    <a href="../../2025/older/?q=1#section">Article</a>
    <a href="../../../about/#%E5%85%B3%E4%BA%8E">Page</a>
    <a href="/blog/zh/about/#legacy">Named anchor</a>
    <a href="#here">Local</a><a href="#top">Top</a><a href="#">Empty</a>
    <a href="#here:~:text=Section">Text fragment</a>
    <a href="/blog/#home">Deployment root</a>
    <a href="/blog/alias/#section">Redirect with a fragment</a>
    <a href="?mode=print#here">Query</a>
    <img src="./cover.webp" srcset="./cover.webp 1x, ./big.webp 2x">
    <a href="./download.zip?download=1">Download</a><a href="./demo.html#demo">HTML attachment</a>
    <a href="https://example.com/missing/">Absolute URL excluded</a>
    <a href="//cdn.invalid/missing">Remote</a><img src="data:image/png;base64,AA==">
    <a href="mailto:hello@example.com">Mail</a>
    <script>const example = '<a href="script-missing/">';</script>
    <script type="module" src="./demo.mjs"></script>
    <script type="module" src="./missing-module.mjs"></script>
    <form action="../../../about/"></form><form action="./missing-action/"></form>
    <template><a href="template-missing/">Template</a></template>
    <a href="../older/">Wrong year</a><a href="../../about/">Wrong page</a>
    <a href="#missing">Missing local anchor</a><a href="../../../about/#missing">Missing page anchor</a>
    <img src="./missing.webp"><img srcset="\n ./cover.webp 1x, ./missing-large.webp 2x">
    <source srcset="\n ./missing-first.webp .5x,\n ./big.webp 2x">
    <a href="/zh/about/">Missing base</a><a href="./%ZZ">Malformed</a>
  </div></main>`;
  const page = new URL('https://example.com/blog/zh/posts/2026/start/');
  // Verify both authored HTML and the URL normalization used for client navigation.
  for (const rendered of [html, contentUrls(html, page)]) {
    await put('zh/posts/2026/start/index.html', rendered);
    const warnings = await checkRelativeLinks(
      root,
      'https://example.com/blog/',
    );
    assert.equal(warnings.length, 11);
    for (const destination of ['missing-module.mjs', 'missing-action/'])
      assert.ok(
        warnings.some((warning) => warning.reference.includes(destination)),
      );
    assert.ok(
      warnings.some((warning) =>
        warning.reference.includes('missing-first.webp'),
      ),
    );
    assert.ok(warnings.every((warning) => warning.page === page.pathname));
    assert.ok(
      warnings.some((warning) => warning.reason.endsWith('/2026/older/')),
    );
    assert.ok(
      warnings.some((warning) => warning.reason.endsWith('/posts/about/')),
    );
    assert.equal(
      warnings.filter((warning) => warning.reason.startsWith('Anchor')).length,
      2,
    );
    assert.ok(
      warnings.some((warning) => warning.reason.includes('deployment base')),
    );
    assert.ok(
      warnings.some((warning) => warning.reason.includes('percent encoding')),
    );
  }
  const logged = [];
  await relativeLinks('https://example.com/blog/').hooks['astro:build:done']({
    dir: pathToFileURL(`${root}${path.sep}`),
    logger: { warn: (message) => logged.push(message) },
  });
  assert.equal(logged.length, 11);
  assert.ok(logged.every((message) => message.includes(page.pathname)));
});
