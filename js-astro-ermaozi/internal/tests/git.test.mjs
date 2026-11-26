import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import test from 'node:test'
import { getGitPageData } from '../../theme/lib/git.ts'

const git = (root, args, env = {}) => execFileSync('git', ['-C', root, ...args], {
  encoding: 'utf8',
  env: { ...process.env, ...env },
})

const commit = (root, args, name, email, date) => git(root, ['-c', `user.name=${name}`, '-c', `user.email=${email}`, 'commit', ...args], {
  GIT_AUTHOR_DATE: date,
  GIT_COMMITTER_DATE: date,
})

test('git metadata follows renames, co-authors, tags, safe messages, and URL patterns', async t => {
  const root = await mkdtemp(join(tmpdir(), 'ermaozi-git-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await mkdir(join(root, 'content'))
  const original = join(root, 'content', 'guide.md')
  const page = join(root, 'content', 'page.md')
  git(root, ['init', '-q'])

  await writeFile(original, '# Guide\n')
  git(root, ['add', 'content/guide.md'])
  commit(root, ['-m', 'Initial #12', '-m', 'Co-authored-by: Bob <123+bob@users.noreply.github.com>'], 'Alice Local', 'alice@example.com', '2026-01-01T00:00:00Z')
  git(root, ['tag', 'v1.0.0'])

  git(root, ['mv', 'content/guide.md', 'content/page.md'])
  commit(root, ['-m', 'Rename guide'], 'Carol', 'carol@example.com', '2026-01-02T00:00:00Z')

  await writeFile(page, '# Guide\n\nUpdated.\n')
  git(root, ['add', 'content/page.md'])
  commit(root, ['-m', '<script>alert(1)</script> fix #42'], 'Alice Local', 'alice@example.com', '2026-01-03T00:00:00Z')

  const data = getGitPageData({
    file: page,
    contributors: {
      avatar: true,
      info: [{ username: 'alice', name: 'Alice', alias: 'Alice Local', avatar: 'https://example.com/alice.png' }],
    },
    changelog: { maxCount: 3 },
    repositoryUrl: 'git@github.com:example/docs.git',
  })

  assert.equal(data.createdTime, Date.parse('2026-01-01T00:00:00Z'))
  assert.equal(data.updatedTime, Date.parse('2026-01-03T00:00:00Z'))
  assert.deepEqual(data.contributors.map(({ name, commits }) => [name, commits]), [['Alice', 2], ['bob', 1], ['Carol', 1]])
  assert.equal(data.contributors[0].avatar, 'https://example.com/alice.png')
  assert.equal(data.contributors[1].url, 'https://github.com/bob')
  assert.equal(data.changelog.length, 3)
  assert.match(data.changelog[0].message, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/)
  assert.doesNotMatch(data.changelog[0].message, /<script>/)
  assert.match(data.changelog[0].message, /href="https:\/\/github\.com\/example\/docs\/issues\/42"/)
  assert.match(data.changelog[0].commitUrl, /\/commit\/[0-9a-f]{40}$/)
  assert.equal(data.changelog[2].tag, 'v1.0.0')
  assert.equal(data.changelog[2].tagUrl, 'https://github.com/example/docs/releases/tag/v1.0.0')

  for (const [repositoryUrl, expected] of [
    ['https://gitlab.com/example/docs', ['/-/commit/', '/-/issues/42', '/-/releases/v1.0.0']],
    ['https://gitee.com/example/docs', ['/commit/', '/issues/42', '/releases/tag/v1.0.0']],
    ['https://bitbucket.org/example/docs', ['/commits/', '/issues/42', `/src/${data.changelog[2].hash}`]],
  ]) {
    const provider = getGitPageData({ file: page, changelog: true, repositoryUrl })
    assert.ok(provider.changelog[0].commitUrl.includes(expected[0]))
    assert.ok(provider.changelog[0].message.includes(expected[1]))
    assert.ok(provider.changelog[2].tagUrl.includes(expected[2]), `${repositoryUrl}: ${provider.changelog[2].tagUrl} does not include ${expected[2]}`)
  }

  const custom = getGitPageData({
    file: page,
    changelog: {
      commitUrlPattern: ':repo/revision/:hash',
      issueUrlPattern: ':repo/ticket/:issue',
      tagUrlPattern: ':repo/version/:tag',
    },
    repositoryUrl: 'https://example.com/docs',
  })
  assert.match(custom.changelog[0].commitUrl, /\/revision\//)
  assert.match(custom.changelog[0].message, /\/ticket\/42/)
  assert.match(custom.changelog[2].tagUrl, /\/version\/v1\.0\.0$/)
})

test('shallow repositories degrade to the available history without failing', async t => {
  const origin = await mkdtemp(join(tmpdir(), 'ermaozi-git-origin-'))
  const clone = await mkdtemp(join(tmpdir(), 'ermaozi-git-shallow-'))
  t.after(() => Promise.all([rm(origin, { recursive: true, force: true }), rm(clone, { recursive: true, force: true })]))
  git(origin, ['init', '-q'])
  await writeFile(join(origin, 'page.md'), '# One\n')
  git(origin, ['add', 'page.md'])
  commit(origin, ['-m', 'One'], 'Alice', 'alice@example.com', '2026-01-01T00:00:00Z')
  await writeFile(join(origin, 'page.md'), '# Two\n')
  git(origin, ['add', 'page.md'])
  commit(origin, ['-m', 'Two'], 'Alice', 'alice@example.com', '2026-01-02T00:00:00Z')
  execFileSync('git', ['clone', '-q', '--depth=1', `file://${origin}`, clone])

  const data = getGitPageData({ file: join(clone, 'page.md'), contributors: true, changelog: true })
  assert.equal(data.changelog.length, 1)
  assert.equal(data.createdTime, Date.parse('2026-01-02T00:00:00Z'))
  assert.equal(data.updatedTime, data.createdTime)
  assert.equal(data.contributors[0].commits, 1)
})

test('git metadata and UI keep Plume production fallbacks and component contracts', async () => {
  assert.deepEqual(getGitPageData({ file: '/definitely/not/a/repository/page.md' }), { contributors: [], changelog: [] })
  const [page, footer, contributors, changelog, styles] = await Promise.all([
    readFile('theme/pages/[...path].astro', 'utf8'),
    readFile('theme/components/DocFooter.astro', 'utf8'),
    readFile('theme/components/GitContributors.astro', 'utf8'),
    readFile('theme/components/GitChangelog.astro', 'utf8'),
    readFile('theme/styles/vendor/git.css', 'utf8'),
  ])
  assert.ok(page.indexOf('<GitContributors') < page.indexOf('<GitChangelog'))
  assert.ok(page.indexOf('<GitChangelog') < page.indexOf('<Copyright'))
  assert.match(page, /const footerUpdated = git\.changelog\.length \? undefined : updated/)
  assert.doesNotMatch(footer, /contributor\.url/)
  assert.match(contributors, /id="doc-contributors"/)
  assert.match(changelog, /id="doc-changelog"/)
  assert.match(changelog, /classList\.toggle\('active'\)/)
  assert.match(changelog, /aria-expanded/)
  assert.match(styles, /\.vp-changelog-wrapper\.active \.vp-changelog-list \{ display: block; \}/)
})
