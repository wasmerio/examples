import assert from 'node:assert/strict'
import test from 'node:test'
import { photoSwipeLocaleOf } from '../../theme/lib/photo-swipe.ts'

test('PhotoSwipe keeps frozen locales and merges path-specific overrides', () => {
  assert.equal(photoSwipeLocaleOf('zh-CN', '/').arrowNext, '下一个 (右箭头)')
  assert.equal(photoSwipeLocaleOf('ja-JP', '/ja/').download, '画像ダウンロード')
  assert.deepEqual(photoSwipeLocaleOf('en-US', '/en/', { '/en/': { close: 'Dismiss' } }), {
    close: 'Dismiss', download: 'Download Image', fullscreen: 'Switch to fullscreen', zoom: 'Zoom in/out', arrowPrev: 'Prev (Arrow Left)', arrowNext: 'Next (Arrow Right)',
  })
})
