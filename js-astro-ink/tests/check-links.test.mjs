import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { checkLinks } from '../scripts/check-links.mjs'

for (const base of ['/', '/project/']) {
  test(`built links resolve against ${base}, including relative assets and encoded fragments`, (t) => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ink-built-links-'))
    t.after(() => fs.rmSync(directory, { recursive: true, force: true }))
    fs.mkdirSync(path.join(directory, 'posts', '笔记'), { recursive: true })
    fs.writeFileSync(path.join(directory, 'cover.webp'), '')
    fs.writeFileSync(path.join(directory, 'cover@2x.webp'), '')
    fs.writeFileSync(path.join(directory, '404.html'), '<a id="main" href="#main">Skip</a>')
    fs.writeFileSync(
      path.join(directory, 'posts', '笔记', 'index.html'),
      `
      <h2 id="章节">Section</h2><a href="?q=astro#%E7%AB%A0%E8%8A%82">This section</a>
      <picture><source srcset="../../cover.webp 1x, ../../cover@2x.webp 2x"><img src="../../cover.webp"></picture>
      <a href="#top">Top</a>`
    )
    const index = path.join(directory, 'index.html')
    fs.writeFileSync(
      index,
      `<link rel="canonical" href="https://example.org${base}">
      <a href="${base}posts/笔记?from=home#章节">Post</a><a href="https://other.example/missing">External</a>`
    )
    assert.deepEqual(checkLinks(directory), { pages: 3, checked: 7, errors: [] })
    fs.appendFileSync(
      index,
      `<a href="posts/missing">Post</a><a href="posts/笔记/#removed">Section</a>
      <img srcset="cover.webp 1x, missing.webp 2x"><a href="/outside">Outside</a>`
    )
    fs.appendFileSync(index, '<meta property="og:image" content="cover.webp"><meta name="twitter:image" content="missing-card.jpg">')
    const { errors } = checkLinks(directory)
    assert.equal(errors.length, 5)
    assert.ok(errors.some((e) => e.includes('missing-card.jpg (missing page or file)')))
    assert.ok(
      errors.some((e) => e.includes('index.html → posts/笔记/#removed (missing heading or anchor)'))
    )
    assert.ok(errors.some((e) => e.includes('missing.webp (missing page or file)')))
    assert.ok(
      errors.some((e) =>
        e.includes(
          base === '/' ? '/outside (missing page or file)' : '/outside (outside deployment base)'
        )
      )
    )
  })
}
