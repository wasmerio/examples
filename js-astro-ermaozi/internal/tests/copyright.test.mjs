import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveCopyrightOptions } from '../../theme/lib/copyright.ts'

test('copyright settings retain Plume merge and override semantics', () => {
  assert.equal(resolveCopyrightOptions(undefined, false), undefined)
  assert.deepEqual(resolveCopyrightOptions(undefined, true), { license: undefined, author: undefined, creation: undefined })
  assert.deepEqual(resolveCopyrightOptions(undefined, 'CC0'), { license: 'CC0', author: undefined, creation: undefined })
  assert.deepEqual(resolveCopyrightOptions(undefined, { license: 'CC-BY-4.0', author: 'A', creation: 'original' }), {
    license: 'CC-BY-4.0', author: 'A', creation: 'original',
  })
  assert.deepEqual(resolveCopyrightOptions(undefined, { enabled: true, license: 'CC0', author: 'A' }), { license: 'CC0', author: 'A', creation: undefined })
  assert.equal(resolveCopyrightOptions(false, 'CC0'), undefined)
  assert.deepEqual(resolveCopyrightOptions(true, { license: 'CC0', author: 'A' }), { license: '', author: 'A', creation: undefined })
  assert.deepEqual(resolveCopyrightOptions('CC0', { author: 'A', creation: 'original' }), { license: 'CC0', author: 'A', creation: 'original' })
  assert.deepEqual(resolveCopyrightOptions({ creation: 'reprint', source: 'https://example.com/', author: 'B' }, { license: 'CC0', author: 'A' }), {
    creation: 'reprint', source: 'https://example.com/', author: 'B', license: 'CC0',
  })
  assert.deepEqual(resolveCopyrightOptions({ license: 'MIT' }, { enabled: false, license: 'CC0' }), { license: 'MIT' })
})
