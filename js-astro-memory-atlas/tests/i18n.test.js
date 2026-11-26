import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { localize, createLanguageController } from '../src/lib/i18n.js';
import { memories } from '../src/data/memories.js';
import { validateContent } from '../scripts/validate-content.js';

test('localized content selects the requested language and falls back safely', () => {
  const copy = { zh: '记忆地图', en: 'Memory Atlas' };
  assert.equal(localize(copy, 'zh'), '记忆地图');
  assert.equal(localize(copy, 'en'), 'Memory Atlas');
  assert.equal(localize(copy, 'fr'), 'Memory Atlas');
});

test('sample memories have Chinese and English copy for every reader-facing field', () => {
  for (const memory of memories) {
    for (const field of ['title', 'description', 'alt', 'place']) {
      if (field === 'place' && !memory.place) continue;
      assert.equal(typeof memory[field]?.zh, 'string', `${memory.id}.${field} should have Chinese copy`);
      assert.equal(typeof memory[field]?.en, 'string', `${memory.id}.${field} should have English copy`);
    }
  }
});

test('content validation rejects a missing English translation', () => {
  const altered = memories.map((memory, index) => index ? memory : { ...memory, title: { zh: memory.title.zh } });
  assert.throws(() => validateContent({ memories: altered }), /memory "first-walk" title: Chinese \(zh\) and English \(en\) text are required/);
});

test('language controller restores, applies, and persists the selected language', () => {
  const dom = new JSDOM('<html><body><button data-language-choice="zh"></button><button data-language-choice="en"></button></body></html>');
  const values = new Map([['site-language', 'en']]);
  const storage = { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) };
  const controller = createLanguageController(dom.window.document, storage);

  assert.equal(controller.getLanguage(), 'en');
  assert.equal(dom.window.document.documentElement.dataset.language, 'en');
  assert.equal(dom.window.document.documentElement.lang, 'en');

  const fresh = new JSDOM('<html><body><button data-language-choice="zh"></button><button data-language-choice="en"></button></body></html>');
  const unset = { getItem: () => null, setItem: () => {} };
  const defaults = createLanguageController(fresh.window.document, unset);
  assert.equal(defaults.getLanguage(), 'en');
  assert.equal(fresh.window.document.documentElement.lang, 'en');
  assert.equal(fresh.window.document.querySelector('[data-language-choice="en"]').getAttribute('aria-pressed'), 'true');

  controller.setLanguage('zh');
  assert.equal(dom.window.document.documentElement.lang, 'zh-CN');
  assert.equal(values.get('site-language'), 'zh');
  assert.equal(dom.window.document.querySelector('[data-language-choice="zh"]').getAttribute('aria-pressed'), 'true');
});
