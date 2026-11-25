import test from 'node:test'
import assert from 'node:assert/strict'
import { outroMessage, renderIntro } from '../src/cli-output.js'

test('CLI intro uses the ASCII banner on wide terminals', () => {
  const output = renderIntro({ color: false, columns: 80 })

  assert.ok(output.includes('░█▀█░█▀▀░█▀▀░█▀▀░█▀▀░█▀▀░▀█▀░█▀▄░█░░░█▀▀░░░█▀█░█▀▀░▀█▀░█▀▄░█▀█'))
  assert.ok(!output.includes('Starter'))
})

test('CLI intro keeps a compact title on narrow terminals', () => {
  assert.equal(renderIntro({ color: false, columns: 40 }), '┌  Accessible Astro\n')
})

test('CLI outro points back to the starter accessibility goal', () => {
  assert.equal(outroMessage, 'Go make the internet a more accessible place! ✨')
})
