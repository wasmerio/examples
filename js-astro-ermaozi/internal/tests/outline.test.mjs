import assert from 'node:assert/strict'
import test from 'node:test'
import { outlineOfHtml } from '../../theme/lib/outline.ts'

const html = `
  <h2 id="start"><a><span>Start <em>&amp; now</em><span class="vp-badge">New</span></span></a></h2>
  <h4 id="deep" data-outline="4"><a><span>Deep <i class="ignore-header">skip</i></span></a></h4>
  <h3 id="middle"><a><span>Middle</span></a></h3>
  <div class="vp-demo-wrapper"><div><h3 id="demo"><a><span>Demo</span></a></h3></div></div>
  <h2 id="end"><a><span>End</span></a></h2>`

test('outline parsing matches Plume ranges, hierarchy, labels, and ignored wrappers', () => {
  assert.deepEqual(outlineOfHtml(html).map(({ id, label, children }) => ({ id, label, children: children.map(child => child.id) })), [
    { id: 'start', label: 'Start & now', children: ['middle'] },
    { id: 'end', label: 'End', children: [] },
  ])
  assert.deepEqual(outlineOfHtml(html, 'deep')[0].children.map(item => item.id), ['deep', 'middle'])
  assert.deepEqual(outlineOfHtml(html, 3).map(item => item.id), ['deep', 'middle'])
  assert.deepEqual(outlineOfHtml(html, false), [])
})
