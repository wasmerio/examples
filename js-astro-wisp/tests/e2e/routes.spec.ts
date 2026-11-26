import { test, expect } from '@playwright/test';

const OK = [
  '/',
  '/archive/',
  '/tags/',
  '/categories/',
  '/about/',
  '/posts/kitchen-sink/',
  '/posts/attention-explained/',
  '/posts/matrix-multiplication/',
  '/posts/welcome-to-wisp/',
  '/posts/rust-ownership/',
  '/posts/english-post/',
  '/tags/rust/',
  '/tags/' + encodeURI('线性代数') + '/',
  '/tags/' + encodeURI('示例') + '/',
  '/categories/' + encodeURI('机器学习') + '/',
  '/categories/' + encodeURI('算法') + '/',
  '/rss.xml',
  '/sitemap-index.xml',
  '/sitemap-0.xml',
  '/diagrams/kitchen-sink/attention-flow.excalidraw',
  '/diagrams/shared/transformer-block.drawio',
];

for (const path of OK) {
  test(`200 ${decodeURI(path)}`, async ({ request }) => {
    const res = await request.get(path);
    expect(res.status()).toBe(200);
  });
}

test('/page/n/ 与首页的分页导航一致：首页链到第 2 页时它才存在（有系列时一页都不生成）', async ({
  request,
  page,
}) => {
  await page.goto('/');
  const linksPage2 = (await page.locator('.wisp-pagination a[href$="/page/2/"]').count()) > 0;
  const res = await request.get('/page/2/');
  expect(res.status()).toBe(linksPage2 ? 200 : 404);
  // sitemap 只列出实际生成的页面
  const sitemap = await request.get('/sitemap-0.xml');
  if (sitemap.ok() && !linksPage2) expect(await sitemap.text()).not.toContain('/page/');
});

test('不存在的路径 404 并渲染自定义 404 页', async ({ page }) => {
  const res = await page.goto('/nonexistent');
  expect(res?.status()).toBe(404);
  await expect(page.locator('main')).toBeVisible();
});

test('草稿文章不在生产构建中', async ({ request, page }) => {
  expect((await request.get('/posts/draft-notes/')).status()).toBe(404);
  for (const p of ['/', '/archive/', '/rss.xml', '/sitemap-0.xml']) {
    expect(await (await request.get(p)).text()).not.toContain('draft-notes');
  }
  await page.goto('/archive/');
  await expect(page.locator('a[href*="draft-notes"]')).toHaveCount(0);
});
