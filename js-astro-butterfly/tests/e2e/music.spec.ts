import { createRequire } from 'node:module';
import { expect, test } from '@playwright/test';

const require = createRequire(import.meta.url);

test('fixed lyrics slide between cues and clear on a seek into the intro @mobile', async ({ page }) => {
  await page.route('**/lyrics-playlist', (route) => route.fulfill({
    json: [{ name: 'Track', url: 'data:audio/mpeg,', lrc: '/lyrics-test.lrc' }],
  }));
  await page.route('**/lyrics-test.lrc', (route) => route.fulfill({
    contentType: 'text/plain; charset=utf-8',
    body: '[00:02.000]第一句\n[00:04.000]第二句\n[00:06.000]\n[00:08.000]第三句',
  }));
  await page.addInitScript(() => {
    const create = document.createElement.bind(document);
    document.createElement = ((tag: string, options?: ElementCreationOptions) => {
      const el = create(tag, options);
      if (el instanceof HTMLAudioElement) {
        Object.defineProperty(el, 'currentTime', { value: 0, writable: true });
        (window as Window & { lyricsTestAudio?: HTMLAudioElement }).lyricsTestAudio = el;
      }
      return el;
    }) as typeof document.createElement;
    document.addEventListener('DOMContentLoaded', () => {
      document.body.insertAdjacentHTML('beforeend', `
        <div id="global-music" data-global-music data-api="/lyrics-playlist">
          <button type="button" data-music-start>展开音乐播放器</button>
        </div>`);
    });
  });

  await page.goto('/');
  const player = page.locator('#global-music');
  await player.getByRole('button', { name: '展开音乐播放器' }).click();
  await expect(player).toHaveAttribute('data-state', 'ready');
  await player.locator('.aplayer-icon-lrc').click();
  const lyrics = player.locator('.aplayer-lrc');
  const current = lyrics.locator('.aplayer-lrc-current');
  const strip = lyrics.locator('.aplayer-lrc-contents');
  const second = strip.getByText('第二句', { exact: true });
  const at = (seconds: number, event = 'timeupdate') => page.evaluate(([time, type]) => {
    const audio = (window as Window & { lyricsTestAudio?: HTMLAudioElement }).lyricsTestAudio!;
    audio.currentTime = time;
    audio.dispatchEvent(new Event(type));
  }, [seconds, event] as const);

  await at(2.5);
  await expect(current).toHaveText('第一句');
  await expect(current).toHaveCSS('font-weight', '600');
  await expect(current).toHaveCSS('transition-property', 'none');
  const themeColor = await player.locator('.aplayer-played').evaluate((bar) => getComputedStyle(bar).backgroundColor);
  await expect(current).toHaveCSS('color', themeColor);
  await expect(second).toHaveCSS('color', themeColor);
  await expect(second).toHaveCSS('font-weight', '600');
  await expect(strip).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -16)');
  await at(4.5);
  await expect(current).toHaveText('第二句');
  await expect(current).toHaveCSS('color', themeColor);
  await expect(current).toHaveCSS('font-weight', '600');
  await expect(strip).toHaveCSS('transition-property', 'transform');
  await expect(strip).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -32)');
  await at(2.5, 'seeking');
  await expect(current).toHaveText('第一句');
  await expect(strip).toHaveCSS('transition-property', 'none');
  await at(2.5);
  await at(2.5, 'seeked');
  await expect(strip).toHaveCSS('transition-property', 'none');
  await at(0.5, 'seeked');
  await expect(current).toHaveText('');
  await expect(lyrics).toHaveCSS('opacity', '0');
  await expect(strip).toHaveCSS('transition-property', 'none');

  await at(4.5, 'seeked');
  await expect(current).toHaveText('第二句');
  await expect(lyrics).toHaveCSS('opacity', '1');
  await at(6.5);
  await expect(current).toHaveText('');
  await expect(lyrics).toHaveCSS('opacity', '0');
  await at(8.5);
  await expect(current).toHaveText('第三句');
  await expect(lyrics).toHaveCSS('opacity', '1');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => strip.evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration)))
    .toBeLessThan(0.001);
});

test('switching tracks scrolls from the playlist position and follows the latest track @mobile', async ({ page }) => {
  await page.route('http://aplayer.test/', (route) => route.fulfill({
    contentType: 'text/html',
    body: '<meta name="viewport" content="width=device-width"><div style="height: 2400px"><div id="player" style="position: fixed; top: 0; width: 280px"></div></div>',
  }));
  await page.goto('http://aplayer.test/');
  await page.addStyleTag({ path: require.resolve('aplayer/dist/APlayer.min.css') });
  await page.addStyleTag({ content: '.aplayer .aplayer-list ol li { height: 42px; }' });
  await page.addScriptTag({ path: require.resolve('aplayer/dist/APlayer.min.js') });

  const result = await page.evaluate(async () => {
    const { APlayer } = window as unknown as {
      APlayer: new (options: object) => { list: { show(): void; switch(index: number): void } };
    };
    const container = document.querySelector<HTMLElement>('#player')!;
    const player = new APlayer({
      container,
      listMaxHeight: '260px',
      preload: 'none',
      audio: Array.from({ length: 40 }, (_, i) => ({ name: `Track ${i}`, url: 'data:audio/mpeg,' })),
    });
    const list = container.querySelector<HTMLOListElement>('ol')!;
    const aligned = (index: number, edge: 'top' | 'bottom') => {
      const top = list.getBoundingClientRect().top + list.clientTop;
      const target = edge === 'top' ? top : top + list.clientHeight;
      return Math.abs(list.children[index].getBoundingClientRect()[edge] - target) < 1;
    };
    const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    async function waitForAlignment(index: number, edge: 'top' | 'bottom', positions?: number[]) {
      const deadline = performance.now() + 2500;
      while (!aligned(index, edge) && performance.now() < deadline) {
        positions?.push(list.scrollTop);
        await frame();
      }
      return aligned(index, edge);
    }

    player.list.show();
    window.scrollTo(0, 700);
    player.list.switch(18);
    const firstTrackAligned = await waitForAlignment(18, 'bottom');

    player.list.switch(10);
    await frame();
    player.list.switch(4);
    const positions: number[] = [];
    const lastTrackAligned = await waitForAlignment(4, 'top', positions);
    const stayedUpward = positions.every((top, i) => i === 0 || top <= positions[i - 1]);

    list.scrollTop = 0;
    player.list.switch(2);
    await frame();
    const afterSwitch = list.scrollTop;
    player.list.show();
    return { firstTrackAligned, lastTrackAligned, stayedUpward, afterSwitch, afterShow: list.scrollTop, pageScroll: window.scrollY };
  });

  expect(result).toMatchObject({ firstTrackAligned: true, lastTrackAligned: true, stayedUpward: true, pageScroll: 700, afterSwitch: 0, afterShow: 0 });
});

test('the first click animates the fixed player open @mobile', async ({ page, isMobile }) => {
  await page.route('**/test-playlist', (route) => route.fulfill({
    json: [{ name: 'Track', url: 'data:audio/mpeg,' }],
  }));
  await page.addInitScript(() => {
    // The theme ships with the global player disabled. Give the real initializer a playlist.
    document.addEventListener('DOMContentLoaded', () => {
      document.body.insertAdjacentHTML('beforeend', `
        <div id="global-music" data-global-music data-api="/test-playlist">
          <button type="button" data-music-start aria-label="展开音乐播放器">›</button>
        </div>`);
    });
    document.addEventListener('transitionrun', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || !target.matches('#global-music .aplayer-body')) return;
      if (event.propertyName === 'width') target.dataset.widthTransition = '';
      if (event.propertyName !== 'left') return;
      const slide = target.getAnimations().find((animation) =>
        animation instanceof CSSTransition && animation.transitionProperty === 'left',
      );
      const firstFrame = (slide?.effect as KeyframeEffect | undefined)?.getKeyframes()[0];
      if (typeof firstFrame?.left === 'string') target.dataset.slideFrom = firstFrame.left;
    });
  });

  await page.goto('/');
  const player = page.locator('#global-music');
  await player.getByRole('button', { name: '展开音乐播放器' }).click();
  await expect(player).toHaveAttribute('data-state', 'ready');
  const body = player.locator('.aplayer-body');
  await expect(body).toHaveAttribute('data-width-transition', '');
  await expect(body).toHaveAttribute('data-slide-from', '-66px');
  const expectedWidth = isMobile ? page.viewportSize()!.width : 400;
  await expect.poll(() => body.evaluate((el) => el.getBoundingClientRect().width))
    .toBe(expectedWidth);
});

test('the fixed player keeps its hover preview stable and tucks back to the tab', async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort());
  await page.goto('/');
  await page.addStyleTag({ path: require.resolve('aplayer/dist/APlayer.min.css') });
  await page.addScriptTag({ path: require.resolve('aplayer/dist/APlayer.min.js') });
  await page.evaluate(() => {
    const container = document.createElement('div');
    container.id = 'global-music';
    container.className = 'ap-init';
    document.body.append(container);
    const { APlayer } = window as unknown as { APlayer: new (options: object) => unknown };
    new APlayer({ container, fixed: true, audio: [{ name: 'Track', url: 'data:audio/mpeg,' }] });
    void container.offsetWidth;
    container.classList.remove('ap-init');
  });

  const player = page.locator('#global-music');
  const body = player.locator('.aplayer-body');
  const bottom = page.viewportSize()!.height;
  const rightEdge = () => body.evaluate((el) => el.getBoundingClientRect().right);
  const hitsPlayer = (x: number, y: number) => page.evaluate(
    ([x, y]) => !!document.elementFromPoint(x, y)?.closest('#global-music'),
    [x, y],
  );

  await expect.poll(rightEdge).toBe(19);
  expect(await hitsPlayer(76, bottom - 34)).toBe(false);

  await page.mouse.move(8, bottom - 34);
  await expect.poll(rightEdge).toBe(85);
  await page.mouse.move(84, bottom - 65); // rounded top corner of the preview
  expect(await hitsPlayer(84, bottom - 65)).toBe(true);
  await expect.poll(rightEdge).toBe(85);

  await page.mouse.move(140, bottom - 34);
  await expect.poll(rightEdge).toBe(19);
  expect(await hitsPlayer(76, bottom - 34)).toBe(false);

  await page.mouse.move(8, bottom - 34);
  await expect.poll(rightEdge).toBe(85);
  await player.locator('.aplayer-miniswitcher').click();
  await expect(player).not.toHaveClass(/aplayer-narrow/);
  await player.locator('.aplayer-miniswitcher').click();
  await expect(player).toHaveClass(/aplayer-narrow/);

  await page.mouse.move(140, bottom - 34);
  await expect.poll(rightEdge).toBe(19);
  expect(await hitsPlayer(76, bottom - 34)).toBe(false);
});
