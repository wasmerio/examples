import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { autoFrontmatterIntegration, generateAutoFrontmatter } from '../../theme/lib/auto-frontmatter.mjs'

test('auto frontmatter fills only missing fields and honors collection transforms', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ermaozi-frontmatter-'))
  await mkdir(join(root, 'en', 'blog'), { recursive: true })
  const file = join(root, 'en', 'blog', '02.Hello World.md')
  await writeFile(file, '---\ntitle: Kept title\n---\nBody\n')
  const config = {
    autoFrontmatter: { permalink: 'filepath', transform: data => ({ ...data, custom: true }) },
    locales: { 'zh-CN': { home: '/' }, 'en-US': { path: '/en/', home: '/en/start/' } },
  }
  assert.deepEqual(await generateAutoFrontmatter({ root, config }), ['en/blog/02.Hello World.md'])
  const source = await readFile(file, 'utf8')
  assert.match(source, /title: Kept title/)
  assert.match(source, /createTime: \d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}/)
  assert.match(source, /permalink: \/en\/blog\/hello-world\//)
  assert.match(source, /custom: true/)
  assert.deepEqual(await generateAutoFrontmatter({ root, config }), [])
})

test('configured collections match README, sidebar, include, exclude, and fallback precedence', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ermaozi-frontmatter-matrix-'))
  await Promise.all([
    mkdir(join(root, 'posts', 'draft'), { recursive: true }),
    mkdir(join(root, 'docs', '01.guide'), { recursive: true }),
    mkdir(join(root, 'shared'), { recursive: true }),
  ])
  await Promise.all([
    writeFile(join(root, 'README.md'), '# Home\n'),
    writeFile(join(root, 'posts', 'README.md'), '# Posts\n'),
    writeFile(join(root, 'posts', 'draft', 'hidden.md'), '# Hidden\n'),
    writeFile(join(root, 'docs', 'README.md'), '# Docs\n'),
    writeFile(join(root, 'docs', '01.guide', '01.intro.md'), '# Intro\n'),
    writeFile(join(root, 'shared', 'extra.md'), '# Extra\n'),
  ])
  const config = {
    autoFrontmatter: { permalink: 'filepath', transform: data => ({ ...data, fallback: true }) },
    locales: {
      'zh-CN': {
        home: '/',
        collections: [
          {
            type: 'post',
            dir: 'posts',
            title: 'Posts',
            linkPrefix: 'articles',
            include: ['shared/*.md'],
            exclude: ['posts/draft/**'],
            autoFrontmatter: { permalink: 'filepath', transform: data => ({ ...data, collection: 'post' }) },
          },
          {
            type: 'doc',
            dir: 'docs',
            title: 'Docs',
            linkPrefix: 'handbook',
            autoFrontmatter: { permalink: 'filepath' },
            sidebar: [{ text: 'Guide', prefix: '01.guide', link: 'guide', items: ['01.intro'] }],
          },
        ],
      },
    },
  }
  await generateAutoFrontmatter({ root, config })
  const read = path => readFile(join(root, path), 'utf8')
  const home = await read('README.md')
  assert.match(home, /pageLayout: home/)
  assert.match(home, /title: Home/)
  assert.match(home, /fallback: true/)
  assert.match(await read('posts/README.md'), /title: Posts[\s\S]*permalink: \/articles\/readme\/[\s\S]*collection: post/)
  assert.equal(await read('posts/draft/hidden.md'), '# Hidden\n')
  assert.match(await read('shared/extra.md'), /permalink: \/articles\/shared\/extra\/[\s\S]*collection: post/)
  assert.match(await read('docs/README.md'), /title: Docs[\s\S]*permalink: \/handbook\//)
  assert.match(await read('docs/01.guide/01.intro.md'), /permalink: \/handbook\/guide\/intro\//)
  assert.doesNotMatch(await read('docs/README.md'), /fallback: true/)

  const disabledRoot = await mkdtemp(join(tmpdir(), 'ermaozi-frontmatter-disabled-'))
  await mkdir(join(disabledRoot, 'notes'), { recursive: true })
  await writeFile(join(disabledRoot, 'README.md'), '# Untouched\n')
  await writeFile(join(disabledRoot, 'notes', '01.Enabled.md'), '# Enabled\n')
  await generateAutoFrontmatter({
    root: disabledRoot,
    config: {
      autoFrontmatter: false,
      locales: { 'zh-CN': { home: '/', collections: [{ type: 'doc', dir: 'notes', linkPrefix: 'notes', autoFrontmatter: { permalink: 'filepath' } }] } },
    },
  })
  assert.equal(await readFile(join(disabledRoot, 'README.md'), 'utf8'), '# Untouched\n')
  assert.match(await readFile(join(disabledRoot, 'notes', '01.Enabled.md'), 'utf8'), /title: Enabled[\s\S]*permalink: \/notes\/enabled\//)
})

test('development watcher applies locale collection rules to new Markdown files', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ermaozi-frontmatter-watch-'))
  await mkdir(join(root, 'notes'), { recursive: true })
  const httpServer = new EventEmitter()
  const config = {
    autoFrontmatter: true,
    locales: {
      'zh-CN': {
        home: '/',
        collections: [{ type: 'doc', dir: 'notes', linkPrefix: 'handbook', autoFrontmatter: { permalink: 'filepath', transform: async data => ({ ...data, watched: true }) } }],
      },
    },
  }
  autoFrontmatterIntegration(config, root).hooks['astro:server:setup']({ server: { httpServer } })
  const file = join(root, 'notes', '01.New Page.md')
  await writeFile(file, '# New page\n')
  try {
    const deadline = Date.now() + 3_000
    let source = ''
    while (Date.now() < deadline) {
      source = await readFile(file, 'utf8')
      if (source.includes('watched: true')) break
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    assert.match(source, /title: New Page/)
    assert.match(source, /permalink: \/handbook\/new-page\//)
    assert.match(source, /watched: true/)
  } finally {
    httpServer.emit('close')
  }
})
