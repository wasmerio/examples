import assert from 'node:assert/strict'
import test from 'node:test'
import { recordPageview, updatePageview } from '../src/utils/pageview.ts'

const response = (payload, status = 200) => new Response(JSON.stringify(payload), { status })

test('counters accept real zero and both supported response shapes', async () => {
  for (const [payload, expected] of [
    [0, 0],
    [12, 12],
    [{ errno: 0, data: [{ time: 0 }] }, 0],
    [{ data: [{ time: 42 }] }, 42],
    [{ data: [{ views: 7 }] }, 7]
  ]) {
    let calls = 0
    const count = await recordPageview(
      'https://counter.example///',
      '/blog/中文',
      async (url, init) => {
        calls++
        assert.equal(url, 'https://counter.example/article')
        assert.equal(init.method, 'POST')
        assert.deepEqual(JSON.parse(init.body), { path: '/blog/中文', type: 'time', action: 'inc' })
        return response(payload)
      }
    )
    assert.equal(count, expected)
    assert.equal(calls, 1)
  }
})

test('HTTP, API, parse and network failures are unavailable rather than zero; no ambiguous retries', async () => {
  const failures = [
    () => response({ data: [{ time: 50 }] }, 500),
    () => response({ errno: 1, data: [{ time: 50 }] }),
    () => response({ data: [] }),
    () => response({ data: [{ time: '12' }] }),
    () => response(-1),
    () => response(1.5),
    () => new Response('not JSON'),
    () => {
      throw new TypeError('Network unavailable')
    }
  ]
  for (const fail of failures) {
    let calls = 0
    assert.equal(
      await recordPageview('https://counter.example', '/site-pv', async () => {
        calls++
        return fail()
      }),
      null
    )
    assert.equal(calls, 1)
  }
})

test('GET-only fallback preserves the exact encoded counter path and checks its HTTP status', async () => {
  for (const postStatus of [405, 501]) {
    for (const getStatus of [200, 503]) {
      const calls = []
      const value = await recordPageview(
        'https://counter.example/',
        '/blog/中文?x=1&y=2',
        async (url, init) => {
          calls.push(init.method)
          if (init.method === 'POST') return response({}, postStatus)
          const parsed = new URL(url)
          assert.equal(parsed.searchParams.get('path'), '/blog/中文?x=1&y=2')
          assert.equal(parsed.searchParams.get('type'), 'time')
          return response({ data: [{ time: 23 }] }, getStatus)
        }
      )
      assert.equal(value, getStatus === 200 ? 23 : null)
      assert.deepEqual(calls, ['POST', 'GET'])
    }
  }
})

test('both counters display an em dash on failure, zero on success, and initialize only once', async (t) => {
  let payload = null
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => response(payload))
  for (const label of ['views', 'total visits']) {
    for (const value of [null, 0, 123]) {
      payload = value
      const attributes = { 'aria-label': label }
      const number = {
        textContent: '···',
        getAttribute: (name) => attributes[name],
        setAttribute: (name, value) => {
          attributes[name] = value
        }
      }
      const element = {
        dataset: {
          server: 'https://counter.example',
          path: label === 'views' ? '/blog/post' : '/site-pv'
        },
        isConnected: true,
        querySelector: () => number
      }
      const before = fetchMock.mock.callCount()
      await updatePageview(element)
      await updatePageview(element)
      assert.equal(fetchMock.mock.callCount(), before + 1)
      assert.equal(number.textContent, value === null ? '—' : value.toLocaleString())
      assert.equal(element.dataset.pageviewState, value === null ? 'error' : 'loaded')
      assert.equal(
        attributes['aria-label'],
        value === null ? `${label}: unavailable` : `${label}: ${value}`
      )
    }
  }
})
