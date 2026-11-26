import assert from 'node:assert/strict'
import test from 'node:test'
import { encryptionPolicy, globalAdminCredentials, matchesEncryptRule } from '../../theme/lib/encrypt-policy.ts'
import { encryptContent } from '../../theme/lib/encryption.ts'

const entry = (id, permalink, password) => ({ id, filePath: id, data: { permalink, password } })

test('encryption rules match routes, Markdown paths, directories, and safe regexes', () => {
  assert.equal(matchesEncryptRule('/notes/', '/notes/one/', 'notes/one.md'), true)
  assert.equal(matchesEncryptRule('notes/', '/other/', 'notes/one.md'), true)
  assert.equal(matchesEncryptRule('one.md', '/other/', 'notes/one.md'), true)
  assert.equal(matchesEncryptRule('^/(?:en/)?about/', '/en/about/', 'en/about.md'), true)
  assert.equal(matchesEncryptRule('^[', '/about/', 'about.md'), false)
})

test('page, matching rule, and admin passwords share the expected unlock scopes', () => {
  const config = { global: true, admin: ['root', 'backup'], rules: { '/private/': ['reader', 'editor'], '^/private/page/$': 'exact' } }
  const policy = encryptionPolicy(entry('private/page.md', '/private/page/', 'frontmatter'), config)
  assert.equal(policy.global, true)
  assert.equal(policy.pageEncrypted, true)
  assert.deepEqual(policy.credentials, [
    { password: 'frontmatter', scope: 'page:/private/page/' },
    { password: 'reader', scope: 'rule:/private/' },
    { password: 'editor', scope: 'rule:/private/' },
    { password: 'exact', scope: 'rule:^/private/page/$' },
    { password: 'root', scope: '__admin__' },
    { password: 'backup', scope: '__admin__' },
  ])
  assert.deepEqual(globalAdminCredentials(config), [
    { password: 'root', scope: '__admin__' },
    { password: 'backup', scope: '__admin__' },
  ])
})

test('shared unlock scopes reuse salt while retaining fresh AES-GCM IVs', async () => {
  const first = await encryptContent('one', 'password', 'rule:/private/')
  const second = await encryptContent('two', 'password', 'rule:/private/')
  const other = await encryptContent('three', 'password', 'rule:/other/')
  assert.equal(first.salt, second.salt)
  assert.notEqual(first.iv, second.iv)
  assert.notEqual(first.salt, other.salt)
})
