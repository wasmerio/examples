import assert from 'node:assert/strict'
import test from 'node:test'
import { feedContent } from '../src/utils/rss-content.ts'

test('feed links and local images resolve to the published article and assets with or without a base', () => {
  for (const base of ['/', '/ink/']) {
    const site = new URL(base, 'https://blog.example')
    const article = new URL('blog/post/', site)
    const html = feedContent(
      `<a href="#details">Section</a><a href="../other/?q=x&amp;y=2">Other</a>
      <a href="${base}tags/astro/">Tag</a><a href="mailto:me@example.com">Email</a>
      <img src="${base}_astro/diagram.hash.webp" alt="Diagram" width="24">
      <img src="/images/photo.jpg"><img src="//cdn.example/photo.webp">`,
      article,
      site
    )
    for (const url of [
      article.href + '#details',
      site.href + 'blog/other/?q=x&amp;y=2',
      site.href + 'tags/astro/',
      'mailto:me@example.com',
      site.href + '_astro/diagram.hash.webp',
      site.href + 'images/photo.jpg',
      'https://cdn.example/photo.webp'
    ])
      assert.ok(html.includes('="' + url + '"'), url)
  }
})

test('readers get full code, native math and task state without site controls or active markup', () => {
  const site = new URL('https://blog.example')
  const html = feedContent(
    '<h2>Examples</h2><div class="astro-code"><pre><code><span>&lt;b&gt;</span>\nlast</code></pre>' +
      '<span class="language">js</span><button onclick="copy()">Copy</button></div>' +
      '<span class="katex"><span class="katex-mathml"><math><semantics><mi>x</mi>' +
      '<annotation encoding="application/x-tex">x</annotation></semantics></math></span>' +
      '<span class="katex-html" aria-hidden="true">duplicate</span></span>' +
      '<li><input type="checkbox" checked>Done</li><a href="javascript:run()">link</a>' +
      '<img src="file:///etc/test" onerror="run()"><script>run()</script><style>.hidden{}</style>',
    new URL('/blog/post/', site),
    site
  )
  assert.match(html, /<h2>Examples<\/h2>/)
  assert.match(html, /<pre><code>&lt;b&gt;\nlast<\/code><\/pre>/)
  assert.match(html, /<math><semantics><mi>x<\/mi><\/semantics><\/math>/)
  assert.match(html, /☑Done/)
  assert.doesNotMatch(
    html,
    /Copy|duplicate|annotation|<button|<script|<style|onerror|file:|javascript:|>js</
  )
})
