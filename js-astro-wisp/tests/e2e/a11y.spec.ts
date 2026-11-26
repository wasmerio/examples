import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = [
  '/',
  '/posts/kitchen-sink/',
  '/posts/attention-explained/',
  '/posts/matrix-multiplication/',
  '/tags/',
  '/tags/' + encodeURI('线性代数') + '/',
  '/archive/',
];

for (const theme of ['light', 'dark'] as const) {
  for (const path of PAGES) {
    test(`axe ${theme} ${decodeURI(path)}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript((t) => localStorage.setItem('color-scheme', t), theme);
      await page.goto(path);
      await expect(page.locator('head meta[name="color-scheme"]')).toHaveAttribute(
        'content',
        theme,
      );
      await page.evaluate(() => document.fonts.ready);
      // 触发 client:visible 的岛屿并等待其渲染
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(300);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
        .analyze();
      const bad = results.violations
        .map((v) => ({
          ...v,
          // axe 把 role=img/graphics-document 的 SVG 当成“从内容取名的控件”检查；
          // 这些图形的 aria-label/title 是整张图的名称，内部文字不是控件标签。
          nodes:
            v.id === 'label-content-name-mismatch'
              ? v.nodes.filter(
                  (n) =>
                    !n.html.trimStart().startsWith('<svg') &&
                    !n.target.some(
                      (s) =>
                        String(s).startsWith('svg[viewBox=') ||
                        s === '.wisp-d' ||
                        s === '.wisp-explainer__svg' ||
                        s === '.pele' ||
                        String(s).startsWith('.pele-'),
                    ),
                )
              : v.nodes,
        }))
        .filter((v) => (v.impact === 'serious' || v.impact === 'critical') && v.nodes.length > 0);
      const report = bad.map(
        (v) =>
          `${v.id} [${v.impact}] ${v.nodes.length} 处\n` +
          v.nodes
            .slice(0, 4)
            .map(
              (n) =>
                `   ${n.target.join(' ')} :: ${n.failureSummary?.split('\n').slice(0, 2).join(' | ')}`,
            )
            .join('\n'),
      );
      expect(report).toEqual([]);
    });
  }
}

test('横向滚动容器：只有确实溢出的才是 Tab 停靠点，名称在反复 resize 后不叠加', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/posts/kitchen-sink/');
  await page.evaluate(() => document.fonts.ready);
  const SEL = '.wisp-post-body :is(.wisp-pre, .wisp-table, .katex-display)';
  const state = () =>
    page.$$eval(SEL, (els) =>
      els.map((e) => ({
        overflow: e.scrollWidth > e.clientWidth + 1,
        tab: e.getAttribute('tabindex'),
        label: e.getAttribute('aria-label') ?? '',
      })),
    );
  const check = async () => {
    const all = await state();
    expect(all.length).toBeGreaterThan(0);
    for (const s of all) {
      expect(s.tab).toBe(s.overflow ? '0' : null);
      // 「可横向滚动」最多出现一次，且只在溢出时出现
      expect(s.label.split('可横向滚动').length - 1).toBe(s.overflow ? 1 : 0);
    }
    return all;
  };
  await check();
  for (const w of [390, 900, 390, 700, 390]) {
    await page.setViewportSize({ width: w, height: 800 });
    await page.waitForTimeout(100);
  }
  const narrow = await check();
  expect(narrow.some((s) => s.overflow)).toBe(true);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(100);
  await check();
});

test('全站滚动条：桌面端根视口与内部容器不设 scrollbar-color（保障无箭头圆角滑块生效）且悬停切换 --wisp-sb，触屏采用标准 thin 滚动条，溢出表格首列吸左且可拖拽平移', async ({
  page,
  isMobile,
}) => {
  await page.goto('/posts/kitchen-sink/');
  await page.evaluate(() => document.fonts.ready);
  const table = page.locator('.wisp-table').first();
  const rootSc = await page.evaluate(
    () => getComputedStyle(document.documentElement).scrollbarColor,
  );
  const tableSc = await table.evaluate((el) => getComputedStyle(el).scrollbarColor);
  const isHoverNone = await page.evaluate(() => matchMedia('(hover: none)').matches);
  if (isHoverNone) {
    const tableSw = await table.evaluate((el) => getComputedStyle(el).scrollbarWidth);
    expect(rootSc).not.toBe('auto');
    expect(tableSc).not.toBe('auto');
    expect(tableSw).toBe('thin');
  } else {
    expect(rootSc).toBe('auto');
    expect(tableSc).toBe('auto');
    await page.mouse.move(2, 2);
    const restSb = await table.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('--wisp-sb').trim(),
    );
    expect(restSb).toBe('transparent');
  }
  await table.evaluate((el) => {
    (el as HTMLElement).style.maxWidth = '180px';
    document.dispatchEvent(new Event('wisp:overflow'));
  });
  await expect(table).toHaveAttribute('data-wisp-overflow', 'end');
  const pos = await table
    .locator('th')
    .first()
    .evaluate((el) => getComputedStyle(el).position);
  expect(pos).toBe('sticky');
  if (!isMobile) {
    await table.scrollIntoViewIfNeeded();
    const box = (await table.boundingBox())!;
    await page.mouse.move(box.x + 80, box.y + 30);
    const hoverSb = await table.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('--wisp-sb').trim(),
    );
    expect(hoverSb).not.toBe('transparent');
    expect(hoverSb.length).toBeGreaterThan(0);
    await page.mouse.move(box.x + 140, box.y + 40);
    await page.mouse.down();
    await page.mouse.move(box.x + 40, box.y + 40, { steps: 8 });
    await page.mouse.up();
    expect(await table.evaluate((el) => el.scrollLeft)).toBeGreaterThan(20);
  }
});
