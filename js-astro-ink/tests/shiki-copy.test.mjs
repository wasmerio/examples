import assert from 'node:assert/strict'
import test from 'node:test'
import { codeToHtml } from 'shiki'
import { parseFragment } from 'parse5'
import { addCopyButton, updateStyle } from '../src/plugins/shiki-custom-transformers.ts'

async function copyButton(source, transforms = []) {
  const html = await codeToHtml(source, {
    lang: 'text',
    theme: 'github-light',
    transformers: [...transforms, updateStyle(), addCopyButton()]
  })
  const block = parseFragment(html).childNodes[0]
  const button = block.childNodes.find((node) => node.tagName === 'button')
  return Object.fromEntries(button.attrs.map(({ name, value }) => [name, value]))
}

test('ordinary highlighted code with tabs, newlines and HTML characters is stored once', async () => {
  const button = await copyButton('  <a>\t& "字"\n\n')
  assert.equal(button['data-code'], undefined)
  assert.equal(button.onclick, undefined)
})

test('a transformer that changes displayed text preserves the exact source for copying', async () => {
  const source = 'const line = 1 // [!code highlight]\n'
  const hideNotation = {
    code(node) {
      node.children = [{ type: 'text', value: 'const line = 1\n' }]
    }
  }
  const button = await copyButton(source, [hideNotation])
  assert.equal(button['data-code'], source)
})
