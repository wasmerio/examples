import assert from 'node:assert/strict'
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import test from 'node:test'
import { optionalOutputsIntegration } from '../../theme/lib/optional-outputs.mjs'
import { sitemapOutputNames } from '../../theme/lib/sitemap-options.mjs'

test('plugins.sitemap false removes generated sitemap files', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'ermaozi-sitemap-'))
  try {
    await mkdir(directory, { recursive: true })
    await Promise.all(['sitemap.xml', 'sitemap.xsl'].map(file => writeFile(join(directory, file), file)))
    const integration = optionalOutputsIntegration({ plugins: { sitemap: false } })
    await integration.hooks['astro:build:done']({ dir: pathToFileURL(`${directory}/`) })
    for (const file of ['sitemap.xml', 'sitemap.xsl']) await assert.rejects(access(join(directory, file)))
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('plugins.sitemap moves custom output filenames without allowing parent traversal', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'ermaozi-sitemap-'))
  try {
    await Promise.all(['sitemap.xml', 'sitemap.xsl'].map(file => writeFile(join(directory, file), file)))
    const config = { plugins: { sitemap: { sitemapFilename: 'seo/site.xml', sitemapXSLFilename: 'seo/site.xsl' } } }
    const integration = optionalOutputsIntegration(config)
    await integration.hooks['astro:build:done']({ dir: pathToFileURL(`${directory}/`) })
    assert.equal(await readFile(join(directory, 'seo/site.xml'), 'utf8'), 'sitemap.xml')
    assert.equal(await readFile(join(directory, 'seo/site.xsl'), 'utf8'), 'sitemap.xsl')
    assert.deepEqual(sitemapOutputNames({ plugins: { sitemap: { sitemapFilename: '../outside.xml' } } }), { sitemap: 'sitemap.xml', xsl: 'sitemap.xsl' })
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
