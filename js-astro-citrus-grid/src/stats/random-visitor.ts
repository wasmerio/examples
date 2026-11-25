/**
  测试用统计插件：随机生成全站与文章的 PV / UV 数字，用于本地调整统计显示效果。

  启用：site.config.ts 填 statsScript: 'random-visitor'（仅生产环境注入，dev 不生效）。
  注意 client.ts 有 TTL 缓存（生产 5 分钟），TTL 内换页数字保持不变；清掉 sessionStorage
  或等 TTL 过期即可看到新随机数。测试完记得换回正式统计脚本或留空停用。
*/

// 每次请求的人为延迟（毫秒），方便观察占位「-」到数字填充的过渡
const FAKE_DELAY = 300

// 位数的随机范围：[minDigits, maxDigits]，按需调整来测试不同长度的排版
const SITE_PV_DIGITS: [number, number] = [4, 6]
const SITE_UV_DIGITS: [number, number] = [3, 5]
const ARTICLE_PV_DIGITS: [number, number] = [1, 4]
const ARTICLE_UV_DIGITS: [number, number] = [1, 4]

function randomDigits([min, max]: [number, number]): number {
  const digits = min + Math.floor(Math.random() * (max - min + 1))
  const low = 10 ** (digits - 1)
  return low + Math.floor(Math.random() * (9 * low))
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export function trackVisit(_path?: string) {}

export async function getSiteTotal() {
  await delay(FAKE_DELAY)
  return { siteTotal: randomDigits(SITE_PV_DIGITS), siteUnique: randomDigits(SITE_UV_DIGITS) }
}

export async function getArticleStats(_path: string) {
  await delay(FAKE_DELAY)
  return {
    articleTotal: randomDigits(ARTICLE_PV_DIGITS),
    articleUnique: randomDigits(ARTICLE_UV_DIGITS),
    siteTotal: randomDigits(SITE_PV_DIGITS),
    siteUnique: randomDigits(SITE_UV_DIGITS),
  }
}
