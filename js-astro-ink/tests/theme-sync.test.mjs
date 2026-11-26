import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const script = fileURLToPath(new URL('../scripts/theme-sync.mjs', import.meta.url))

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ink-sync-test-'))
  const source = path.join(root, 'theme')
  const target = path.join(root, 'blog')
  for (const dir of [source, target]) {
    fs.mkdirSync(dir)
    const init = spawnSync('git', ['init', '-q', dir])
    assert.equal(init.status, 0)
  }
  function put(dir, name, text) {
    const dest = path.join(dir, name)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.writeFileSync(dest, text)
  }
  for (const dir of [source, target]) {
    put(dir, 'package.json', '{"name":"astro-theme-ink"}\n')
    put(dir, 'src/components/PostCard.astro', 'original\n')
    spawnSync('git', ['add', '.'], { cwd: dir })
    const commit = spawnSync(
      'git',
      ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-qm', 'initial'],
      { cwd: dir }
    )
    assert.equal(commit.status, 0)
  }
  // Remove only the verified temporary fixture, without following directory links.
  t.after(() => {
    assert.equal(path.dirname(root), fs.realpathSync(os.tmpdir()))
    const remove = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const dest = path.join(dir, entry.name)
        if (entry.isDirectory() && !fs.lstatSync(dest).isSymbolicLink()) remove(dest)
        else {
          fs.chmodSync(dest, 0o666)
          fs.unlinkSync(dest)
        }
      }
      fs.rmdirSync(dir)
    }
    remove(root)
  })
  const run = (...args) =>
    spawnSync(process.execPath, [script, '--source', source, '--target', target, ...args], {
      encoding: 'utf8'
    })
  const read = (name) => fs.readFileSync(path.join(target, name), 'utf8')
  const init = () => {
    const r = run('--init', '--apply')
    assert.equal(r.status, 0, r.stdout + r.stderr)
  }
  return { root, source, target, put, run, read, init }
}

test('preview does not write; scope excludes content, assets and custom routes; repeat is a no-op', (t) => {
  const f = fixture(t)
  f.put(f.source, 'src/content/blog/demo.md', 'theme example')
  f.put(f.source, 'public/avatar.png', 'avatar')
  f.put(f.source, 'src/pages/projects/index.astro', 'projects')
  assert.equal(f.run('--init').status, 0)
  assert.equal(fs.existsSync(path.join(f.target, '.theme-sync.json')), false)
  f.init()
  const state = f.read('.theme-sync.json')
  assert.equal(f.run('--apply').status, 0)
  assert.equal(f.read('.theme-sync.json'), state)
  for (const name of [
    'src/content/blog/demo.md',
    'public/avatar.png',
    'src/pages/projects/index.astro'
  ]) {
    assert.equal(fs.existsSync(path.join(f.target, name)), false)
  }
})

test('first sync refuses to overwrite existing differences and preserves reviewed customization', (t) => {
  const f = fixture(t)
  f.put(f.target, 'src/components/PostCard.astro', 'custom\n')
  assert.equal(f.run('--init', '--apply', '--allow-dirty').status, 2)
  assert.equal(f.read('src/components/PostCard.astro'), 'custom\n')
  assert.equal(fs.existsSync(path.join(f.target, '.theme-sync.json')), false)
  assert.equal(
    f.run('--init', '--apply', '--allow-dirty', '--accept-local', 'src/components/PostCard.astro')
      .status,
    0
  )
  assert.equal(f.run('--apply').status, 0)
  assert.equal(f.read('src/components/PostCard.astro'), 'custom\n')
})

test('incremental merge combines independent changes; creates backup of local bytes', (t) => {
  const f = fixture(t)
  const base = 'heading\n1\n2\n3\n4\n5\n6\nfooter\n'
  f.put(f.source, 'src/utils/example.ts', base)
  f.init()
  f.put(f.source, 'src/utils/example.ts', base.replace('heading', 'new heading'))
  f.put(f.target, 'src/utils/example.ts', base.replace('footer', 'custom footer'))
  assert.equal(f.run('--apply').status, 1) // Dirty blog requires an explicit choice.
  const result = f.run('--apply', '--allow-dirty')
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.equal(
    f.read('src/utils/example.ts'),
    base.replace('heading', 'new heading').replace('footer', 'custom footer')
  )
  const dir = path.join(f.target, '.git/theme-sync-backups')
  const backups = fs
    .readdirSync(dir)
    .map((name) => JSON.parse(fs.readFileSync(path.join(dir, name))))
  assert.ok(
    backups.some((b) =>
      b.files.some(
        (file) =>
          file.path === 'src/utils/example.ts' &&
          file.before !== null &&
          Buffer.from(file.before, 'base64').toString().includes('custom footer')
      )
    )
  )
})

test('conflict blocks all writes and baseline advancement', (t) => {
  const f = fixture(t)
  f.init()
  const state = f.read('.theme-sync.json')
  f.put(f.source, 'src/components/PostCard.astro', 'theme\n')
  f.put(f.target, 'src/components/PostCard.astro', 'blog\n')
  f.put(f.source, 'src/utils/new.ts', 'new\n')
  assert.equal(f.run('--apply', '--allow-dirty').status, 2)
  assert.equal(f.read('.theme-sync.json'), state)
  assert.equal(fs.existsSync(path.join(f.target, 'src/utils/new.ts')), false)
  assert.equal(f.read('src/components/PostCard.astro'), 'blog\n')
})

test('unchanged theme preserves local deletion; theme deletion conflicts with local edits', (t) => {
  const f = fixture(t)
  f.put(f.source, 'src/utils/delete.ts', 'base\n')
  f.init()
  fs.unlinkSync(path.join(f.target, 'src/utils/delete.ts'))
  assert.equal(f.run('--apply').status, 0)
  assert.equal(fs.existsSync(path.join(f.target, 'src/utils/delete.ts')), false)
  f.put(f.target, 'src/utils/delete.ts', 'custom\n')
  fs.unlinkSync(path.join(f.source, 'src/utils/delete.ts'))
  assert.equal(f.run('--apply', '--allow-dirty').status, 2)
  assert.equal(f.run('--apply', '--allow-dirty', '--accept-local', 'src/utils/delete.ts').status, 0)
  assert.equal(f.read('src/utils/delete.ts'), 'custom\n')
})

test('configuration changes require review even when blog matched the old default', (t) => {
  const f = fixture(t)
  f.init()
  f.put(f.source, 'package.json', '{"name":"astro-theme-ink","version":"2"}\n')
  assert.equal(f.run('--apply', '--allow-dirty').status, 2)
  assert.equal(f.read('package.json'), '{"name":"astro-theme-ink"}\n')
})

test('diff mode is read-only, limited to managed files, and bounds large patches', (t) => {
  const f = fixture(t)
  const name = 'src/components/PostCard.astro'
  f.put(f.target, name, '博客定制\n'.repeat(2000))
  for (const args of [
    ['--diff', name, '--apply'],
    ['--diff', '../outside'],
    ['--diff', 'src/utils/missing.ts']
  ]) {
    assert.equal(f.run('--init', ...args).status, 1)
  }
  const result = f.run('--init', '--diff', name)
  assert.equal(result.status, 0, result.stderr)
  const [section] = JSON.parse(result.stdout)
  assert.match(section.text, /\+博客定制/)
  assert.match(section.text, /余下内容已省略/)
  assert.ok(section.text.split('\n').length <= 301)
  assert.equal(fs.existsSync(path.join(f.target, '.theme-sync.json')), false)
})

test('recovers a baseline with raw control characters and rewrites valid JSON on apply', (t) => {
  const f = fixture(t)
  f.init()
  const statePath = path.join(f.target, '.theme-sync.json')
  const valid = fs.readFileSync(statePath, 'utf8')
  assert.match(valid, /original\\n/)
  fs.writeFileSync(statePath, valid.replace('original\\n', 'original\n'))
  f.put(f.source, 'src/utils/recovered.ts', 'recovered\n')
  const preview = f.run('--allow-dirty')
  assert.equal(preview.status, 0, preview.stdout + preview.stderr)
  assert.match(preview.stderr, /Recovered invalid control characters/)
  const applied = f.run('--apply', '--allow-dirty')
  assert.equal(applied.status, 0, applied.stdout + applied.stderr)
  assert.doesNotThrow(() => JSON.parse(fs.readFileSync(statePath, 'utf8')))
  assert.equal(f.read('src/utils/recovered.ts'), 'recovered\n')
})

test('rejects self sync, out-of-scope choices and symlinked destination directories', (t) => {
  const f = fixture(t)
  assert.equal(f.run('--target', f.source, '--init').status, 1)
  assert.equal(f.run('--init', '--accept-theme', '../outside').status, 1)
  f.init()
  f.put(f.source, 'src/utils/new.ts', 'new\n')
  const outside = path.join(f.root, 'outside')
  fs.mkdirSync(outside)
  fs.symlinkSync(
    outside,
    path.join(f.target, 'src/utils'),
    process.platform === 'win32' ? 'junction' : 'dir'
  )
  assert.equal(f.run('--apply', '--allow-dirty').status, 1)
  assert.equal(fs.readdirSync(outside).length, 0)
})
