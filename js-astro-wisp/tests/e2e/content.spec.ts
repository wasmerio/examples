import { test, expect } from '@playwright/test';

const URL = '/posts/kitchen-sink/';

test.beforeEach(async ({ page }) => {
  await page.goto(URL);
  await page.evaluate(() => document.fonts.ready);
});

test('Mermaid：6 个 .wisp-pele，各含 SVG', async ({ page }) => {
  await expect(page.locator('.wisp-pele')).toHaveCount(6);
  await expect(page.locator('.wisp-pele svg.pele')).toHaveCount(6);
});

test('KaTeX 公式存在', async ({ page }) => {
  expect(await page.locator('.katex').count()).toBeGreaterThan(0);
  await expect(page.locator('.katex-display').first()).toBeVisible();
});

test('代码块有行号（::before 计数器）', async ({ page }) => {
  const pre = page.locator('pre.wisp-ln').first();
  await expect(pre).toBeVisible();
  const content = await pre
    .locator('.line')
    .first()
    .evaluate((el) => getComputedStyle(el, '::before').content);
  expect(content).toMatch(/counter|\d/);
  expect(content).not.toBe('none');
});

test('复制按钮复制的文本不含行号', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const pre = page.locator('pre.wisp-ln').first();
  const btn = pre.locator('xpath=..').locator('.wisp-copy');
  await pre.hover();
  await btn.click();
  await expect(btn).toHaveAttribute('data-done', '');
  const copied = (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n');
  const expected = await pre.locator('code').evaluate((c) => c.textContent ?? '');
  expect(copied.length).toBeGreaterThan(0);
  expect(copied).toBe(expected);
  // 每行都不应以行号开头
  for (const l of copied.split('\n')) expect(l).not.toMatch(/^\s*\d+\s*$/);
  await expect(btn.locator('xpath=following-sibling::span[@role="status"]')).toHaveText(/已复制/);
});

test('剪贴板不可用时给出复制失败反馈', async ({ page }) => {
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('blocked');
        },
      },
    });
  });
  const pre = page.locator('pre.wisp-ln').first();
  const btn = pre.locator('xpath=..').locator('.wisp-copy');
  await btn.click();
  await expect(btn).toHaveAttribute('data-failed', '');
  await expect(btn.locator('xpath=following-sibling::span[@role="status"]')).toHaveText(/复制失败/);
});

test('移动端交互入口有足够的触控高度', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.reload();
  const heights = await page
    .locator(
      '.wisp-toc-inline summary, .wisp-series-inline summary, .wisp-fig-actions a, .wisp-copy, .wisp-theme-toggle',
    )
    .evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().height)));
  expect(heights.length).toBeGreaterThan(0);
  expect(Math.min(...heights)).toBeGreaterThanOrEqual(44);
});

test('图表 figure 存在，下载链接返回 200', async ({ page, request }) => {
  const figs = page.locator('figure.wisp-diagram');
  expect(await figs.count()).toBeGreaterThanOrEqual(2);
  const links = page.locator('a.wisp-diagram-dl');
  const n = await links.count();
  expect(n).toBeGreaterThanOrEqual(2);
  for (let i = 0; i < n; i++) {
    const href = await links.nth(i).getAttribute('href');
    expect((await request.get(href!)).status(), href!).toBe(200);
  }
});

test('所有 figure 题注在图下全宽左对齐，桌面端动作悬浮于右上角、窄屏落底', async ({ page }) => {
  // 带标题的 Markdown 图片 → figure + 题注，title 不再留在 img 上；不带标题的图片保持原样
  const img = page.locator('figure.wisp-image');
  await expect(img).toHaveCount(1);
  await expect(img.locator('img')).not.toHaveAttribute('title', /.*/);
  await expect(img.locator('figcaption .wisp-fig-no')).toHaveText('图 5：');
  await expect(page.locator('.prose p > img:only-child')).toHaveCount(1);
  // Mermaid 围栏 caption=
  await expect(page.locator('figure.wisp-pele figcaption .wisp-fig-no')).toHaveText('图 3：');
  // 图表：桌面有 hover 时动作悬浮在图表右上角（默认隐藏、hover 显现）；窄屏落到题注下一行贴左缘
  const fig = page.locator('figure.wisp-diagram[aria-labelledby]').first();
  const [body, caption, actions] = await Promise.all([
    fig.locator('.wisp-diagram-body').boundingBox(),
    fig.locator('figcaption').boundingBox(),
    fig.locator('.wisp-fig-actions').boundingBox(),
  ]);
  const hasHover = await page.evaluate(
    () => matchMedia('(min-width: 40rem) and (hover: hover) and (pointer: fine)').matches,
  );
  await expect(fig.locator('.wisp-fig-actions')).toHaveCSS('border-top-width', '1px');
  if (hasHover) {
    await expect(fig.locator('.wisp-fig-actions')).toHaveCSS('opacity', '0');
    await fig.hover();
    await expect(fig.locator('.wisp-fig-actions')).toHaveCSS('opacity', '1');
    expect(Math.abs(actions!.y - body!.y)).toBeLessThan(30);
    expect(actions!.x + actions!.width).toBeLessThanOrEqual(body!.x + body!.width + 2);
  } else {
    expect(actions!.y).toBeGreaterThanOrEqual(caption!.y + caption!.height - 1);
    expect(Math.abs(actions!.x - caption!.x)).toBeLessThan(2);
  }
  await expect(page.locator('figure.wisp-diagram > .wisp-fig-actions')).toHaveCount(4);
});

test('图表和 Mermaid SVG 可用键盘打开 lightbox，并恢复焦点', async ({ page }) => {
  const triggers = page.locator('[data-wisp-lightbox-trigger]');
  expect(await triggers.count()).toBeGreaterThanOrEqual(8);

  const trigger = triggers.first();
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.locator('dialog.wisp-lightbox');
  await expect(dialog).toHaveAttribute('open', '');
  await expect(dialog.locator('[data-lightbox-media] svg')).toHaveAttribute('role', 'img');
  await expect(dialog.locator('[data-lightbox-close]')).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect(trigger).toBeFocused();

  await trigger.press('Space');
  await expect(dialog).toHaveAttribute('open', '');
  await dialog.locator('[data-lightbox-close]').click();
  await expect(dialog).not.toHaveAttribute('open', '');

  await trigger.click();
  await expect(dialog).toHaveAttribute('open', '');
  await expect(dialog).toHaveAttribute('closedby', 'any');
  // 滚轮不穿透到底层页面
  const yBefore = await page.evaluate(() => scrollY);
  await page.mouse.move(10, 10);
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(100);
  expect(await page.evaluate(() => scrollY)).toBe(yBefore);
  // 点背景 ::backdrop 原生 light-dismiss 关闭
  await page.mouse.click(4, 4);
  await expect(dialog).not.toHaveAttribute('open', '');
});

test('lightbox 支持舒适区初始放大、滚轮缩放、拖拽平移、双击复位与自动显隐控制条', async ({
  page,
}) => {
  const diagramFig = page.locator('figure.wisp-diagram[aria-labelledby]').nth(1);
  const trigger = diagramFig.locator('[data-wisp-lightbox-trigger]');
  await diagramFig.scrollIntoViewIfNeeded();
  await trigger.focus();
  await page.keyboard.press('Enter');

  const dialog = page.locator('dialog.wisp-lightbox');
  const stage = dialog.locator('[data-lightbox-stage]');
  const chrome = dialog.locator('[data-lightbox-chrome]');
  const caption = dialog.locator('[data-lightbox-caption]');
  const pct = dialog.locator('[data-lightbox-pct]');
  const svg = dialog.locator('[data-lightbox-media] svg');

  await expect(dialog).toHaveAttribute('open', '');
  await expect(caption).toBeVisible();
  await expect(caption).toContainText('图 2：');

  // 确认克隆题注与 SVG 不会引入重复 id
  const dupIds = await page.evaluate(() => {
    const seen = new Map<string, number>();
    document.querySelectorAll('[id]').forEach((e) => seen.set(e.id, (seen.get(e.id) ?? 0) + 1));
    return [...seen].filter(([, c]) => c > 1);
  });
  expect(dupIds).toEqual([]);

  const vp = page.viewportSize()!;
  const initialBox = (await svg.boundingBox())!;
  const initialPctText = (await pct.textContent())!.trim();
  const initialPct = Number.parseInt(initialPctText, 10);
  expect(Math.abs(initialBox.x + initialBox.width / 2 - vp.width / 2)).toBeLessThan(4);
  if (vp.width >= 1000) {
    expect(initialBox.width).toBeGreaterThan(418 * 1.4);
    expect(initialPct).toBe(165);
  }

  const isCoarse = await page.evaluate(
    () => matchMedia('(hover: none), (pointer: coarse)').matches,
  );
  if (!isCoarse) {
    await expect(chrome).toHaveCSS('opacity', '0');
  }

  // 鼠标移动后控制条淡入
  await page.mouse.move(vp.width / 2, vp.height / 2);
  await expect(dialog).toHaveAttribute('data-chrome', 'visible');
  await expect(chrome).toHaveCSS('opacity', '1');

  // 鼠标滚轮放大：底层页面不滚动，比例增大，题注自动退场，SVG 停稳后提交清晰尺寸
  const yBefore = await page.evaluate(() => scrollY);
  await page.mouse.move(vp.width / 2 + 30, vp.height / 2);
  await page.mouse.wheel(0, -240);
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => scrollY)).toBe(yBefore);

  const afterWheelBox = (await svg.boundingBox())!;
  const afterWheelPct = Number.parseInt((await pct.textContent())!.trim(), 10);
  expect(afterWheelPct).toBeGreaterThan(initialPct);
  expect(afterWheelBox.width).toBeGreaterThan(initialBox.width + 20);
  await expect(dialog).toHaveAttribute('data-zoomed', '');
  await expect(caption).toHaveCSS('opacity', '0');

  // SVG 停稳后应直接更新矢量尺寸，mediaSlot 不残留额外缩放因子
  const inlineTransform = await dialog
    .locator('[data-lightbox-media]')
    .evaluate((el) => (el as HTMLElement).style.transform);
  expect(inlineTransform).not.toContain('scale(');

  // 继续放大直到水平溢出视口（桌面端同时垂直溢出），拖拽平移且松手不关闭
  for (let i = 0; i < 6; i += 1) {
    const box = (await svg.boundingBox())!;
    if (box.width > vp.width + 60) break;
    await page.keyboard.press('+');
    await page.waitForTimeout(220);
  }
  await expect(stage).toHaveAttribute('data-pannable', '');
  const beforeDrag = (await svg.boundingBox())!;
  const cx = vp.width / 2;
  const cy = vp.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx - 90, cy - 60, { steps: 6 });
  await page.mouse.up();
  await expect(dialog).toHaveAttribute('open', '');
  const afterDrag = (await svg.boundingBox())!;
  expect(afterDrag.x).toBeLessThan(beforeDrag.x - 20);
  if (beforeDrag.height > vp.height) {
    expect(afterDrag.y).toBeLessThan(beforeDrag.y - 15);
  }

  // 工具栏按钮与键盘快捷键
  const pctBeforeBtn = Number.parseInt((await pct.textContent())!.trim(), 10);
  await dialog.locator('[data-lightbox-zoom-out]').click();
  await page.waitForTimeout(220);
  expect(Number.parseInt((await pct.textContent())!.trim(), 10)).toBeLessThan(pctBeforeBtn);

  await dialog.locator('[data-lightbox-zoom-in]').click();
  await page.waitForTimeout(220);

  await page.keyboard.press('1');
  await page.waitForTimeout(220);
  expect((await pct.textContent())!.trim()).toBe('100%');

  await page.keyboard.press('0');
  await page.waitForTimeout(220);
  expect((await pct.textContent())!.trim()).toBe(initialPctText);
  await expect(dialog).not.toHaveAttribute('data-zoomed', '');
  await expect(caption).toHaveCSS('opacity', '1');

  // 双击图片切换放大与复位
  await page.mouse.dblclick(cx, cy);
  await page.waitForTimeout(220);
  await expect(dialog).toHaveAttribute('data-zoomed', '');
  expect(Number.parseInt((await pct.textContent())!.trim(), 10)).toBeGreaterThan(initialPct);

  await page.mouse.dblclick(cx, cy);
  await page.waitForTimeout(220);
  await expect(dialog).not.toHaveAttribute('data-zoomed', '');
  expect((await pct.textContent())!.trim()).toBe(initialPctText);

  // 点击空白背景关闭并还原焦点
  await page.mouse.click(10, 10);
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect(trigger).toBeFocused();
});

test('lightbox 位图与 Mermaid 图全屏后均支持上下左右自由拖拽', async ({ page }) => {
  const dialog = page.locator('dialog.wisp-lightbox');
  const stage = dialog.locator('[data-lightbox-stage]');

  // 1. 位图（figure.wisp-image）
  const imgFig = page.locator('figure.wisp-image');
  await imgFig.scrollIntoViewIfNeeded();
  await imgFig.locator('[data-wisp-lightbox-trigger]').click();
  await expect(dialog).toHaveAttribute('open', '');
  await expect(stage).toHaveAttribute('data-pannable', '');
  const mediaImg = dialog.locator('[data-lightbox-media] img');
  await expect.poll(async () => (await mediaImg.boundingBox())?.width ?? 0).toBeGreaterThan(100);
  const imgBefore = (await mediaImg.boundingBox())!;
  const imgCx = imgBefore.x + imgBefore.width / 2;
  const imgCy = imgBefore.y + imgBefore.height / 2;
  await page.mouse.move(imgCx, imgCy);
  await page.mouse.down();
  await page.mouse.move(imgCx - 80, imgCy - 60, { steps: 6 });
  await page.mouse.up();
  await expect(dialog).toHaveAttribute('open', '');
  const imgAfter = (await mediaImg.boundingBox())!;
  expect(imgAfter.x).toBeLessThan(imgBefore.x - 20);
  expect(imgAfter.y).toBeLessThan(imgBefore.y - 15);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toHaveAttribute('open', '');

  // 2. 紧凑型 Mermaid 图（时序图）
  const mermaidFig = page.locator('figure.wisp-pele').nth(1);
  await mermaidFig.scrollIntoViewIfNeeded();
  await mermaidFig.locator('[data-wisp-lightbox-trigger]').click();
  await expect(dialog).toHaveAttribute('open', '');
  await expect(stage).toHaveAttribute('data-pannable', '');
  const mediaSvg = dialog.locator('[data-lightbox-media] svg');
  const svgBefore = (await mediaSvg.boundingBox())!;
  const svgCx = svgBefore.x + svgBefore.width / 2;
  const svgCy = svgBefore.y + svgBefore.height / 2;
  await page.mouse.move(svgCx, svgCy);
  await page.mouse.down();
  await page.mouse.move(svgCx - 80, svgCy - 60, { steps: 6 });
  await page.mouse.up();
  await expect(dialog).toHaveAttribute('open', '');
  const svgAfter = (await mediaSvg.boundingBox())!;
  expect(svgAfter.x).toBeLessThan(svgBefore.x - 20);
  expect(svgAfter.y).toBeLessThan(svgBefore.y - 15);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toHaveAttribute('open', '');
});

test('页面中所有 id 唯一', async ({ page }) => {
  const dup = await page.evaluate(() => {
    const seen = new Map<string, number>();
    document.querySelectorAll('[id]').forEach((e) => seen.set(e.id, (seen.get(e.id) ?? 0) + 1));
    return [...seen].filter(([, c]) => c > 1).map(([id, c]) => `${id} ×${c}`);
  });
  expect(dup).toEqual([]);
});

test('TOC 链接能跳转到对应标题', async ({ page }) => {
  const links = page.locator('nav.wisp-toc-aside a[data-toc-link]');
  const n = await links.count();
  expect(n).toBeGreaterThan(3);
  for (const i of [1, Math.floor(n / 2), n - 1]) {
    const link = links.nth(i);
    if (!(await link.isVisible())) continue;
    const href = (await link.getAttribute('href'))!;
    await link.click();
    await expect(page).toHaveURL(
      new RegExp(`${encodeURI(decodeURIComponent(href)).replace('#', '#')}$`),
    );
    const target = page.locator(`[id="${decodeURIComponent(href.slice(1))}"]`);
    await expect(target).toBeInViewport();
  }
});
