import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'
import { THEME_COLORS } from '../src/utils/theme.ts'

const source = readFileSync(new URL('../src/scripts/theme.js', import.meta.url), 'utf8')

function page({ stored = {}, defaultTheme = 'system', dark = false, blockedStorage = false } = {}) {
  const classes = new Set()
  const root = {
    dataset: { defaultTheme, defaultPalette: 'fresh' },
    style: {},
    classList: {
      toggle(name, enabled) {
        enabled ? classes.add(name) : classes.delete(name)
      },
      add(name) {
        classes.add(name)
      },
      remove(name) {
        classes.delete(name)
      }
    },
    getAttribute(name) {
      const [, , palette, mode] = name.split('-')
      return THEME_COLORS[palette]?.[mode]
    }
  }
  const handlers = {}
  const media = {
    matches: dark,
    addEventListener(name, callback) {
      handlers[name] = callback
    }
  }
  const meta = {
    setAttribute(name, value) {
      this[name] = value
    }
  }
  class Element {
    constructor(id) {
      this.id = id
    }
    closest(selector) {
      return selector === `#${this.id}` ? this : null
    }
  }
  vm.runInNewContext(source, {
    document: {
      documentElement: root,
      querySelector: () => meta,
      addEventListener(name, callback) {
        handlers[name] = callback
      }
    },
    matchMedia: () => media,
    localStorage: {
      getItem(key) {
        if (blockedStorage) throw Error('Unavailable')
        return stored[key] ?? null
      },
      setItem(key, value) {
        if (blockedStorage) throw Error('Unavailable')
        stored[key] = value
      }
    },
    Element,
    setTimeout: () => 1,
    clearTimeout: () => {}
  })
  return {
    root,
    meta,
    classes,
    click(id) {
      handlers.click({ target: new Element(id) })
    },
    changeOS(dark) {
      media.matches = dark
      handlers.change()
    }
  }
}

function expectPaint(p, palette, dark) {
  assert.equal(p.root.style.backgroundColor, THEME_COLORS[palette][dark ? 'dark' : 'light'])
  assert.equal(p.meta.content, p.root.style.backgroundColor)
  assert.equal(p.classes.has('dark'), dark)
  assert.equal(p.classes.has('fresh'), palette === 'fresh')
}

test('first paint respects both saved palettes and all theme modes', () => {
  for (const palette of ['ink', 'fresh']) {
    for (const theme of ['system', 'light', 'dark']) {
      for (const osDark of [false, true]) {
        const p = page({ stored: { 'ink-palette': palette, 'ink-theme': theme }, dark: osDark })
        expectPaint(p, palette, theme === 'dark' || (theme === 'system' && osDark))
      }
    }
  }
})

test('OS changes repaint only in system mode; switches update background and chrome together', () => {
  const p = page()
  p.changeOS(true)
  expectPaint(p, 'fresh', true)
  p.click('theme-toggle') // system -> light
  p.changeOS(false)
  p.changeOS(true)
  expectPaint(p, 'fresh', false)
  p.click('palette-toggle')
  expectPaint(p, 'ink', false)
  p.click('theme-toggle') // light -> dark
  expectPaint(p, 'ink', true)
  p.changeOS(false)
  expectPaint(p, 'ink', true)
  p.click('theme-toggle') // dark -> system, follows the current OS
  expectPaint(p, 'ink', false)
})

test('controls remain usable without localStorage and honor configured starting mode', () => {
  const p = page({ defaultTheme: 'dark', blockedStorage: true })
  expectPaint(p, 'fresh', true)
  p.click('theme-toggle')
  assert.equal(p.root.dataset.theme, 'system')
  expectPaint(p, 'fresh', false)
  p.click('palette-toggle')
  expectPaint(p, 'ink', false)
})

test('saved preferences survive reload and invalid stored values use defaults', () => {
  const stored = {}
  const p = page({ stored })
  p.click('palette-toggle')
  p.click('theme-toggle')
  expectPaint(page({ stored, dark: true }), 'ink', false)
  expectPaint(
    page({ stored: { 'ink-theme': 'invalid', 'ink-palette': 'invalid' } }),
    'fresh',
    false
  )
})
