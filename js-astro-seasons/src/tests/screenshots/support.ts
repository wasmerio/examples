import { join } from 'path';
import { test, type Page } from '@playwright/test';
import { SUMMER_SEASON, type Season } from '../seasons';

type ColorScheme = 'light' | 'dark';

const COLOR_SCHEMES: ColorScheme[] = ['light', 'dark'];
const SCREENSHOTS_DIRECTORY: string = 'screenshots';

interface ScreenshotOptions {
  keepAnimations?: boolean;
}

async function freezeParticleAnimations(page: Page): Promise<void> {
  await page.evaluate(async (): Promise<void> => {
    const isParticleAnimation = (animation: Animation): boolean => {
      const target: Element | null | undefined = (animation.effect as KeyframeEffect | null)?.target;
      return target?.classList.contains('particle') ?? false;
    };
    const animations: Animation[] = document.getAnimations();
    const settlingAnimations: Animation[] = animations.filter(
      (animation: Animation) => !isParticleAnimation(animation),
    );
    await Promise.all(settlingAnimations.map((animation: Animation) => animation.finished.catch(() => undefined)));
    animations.filter(isParticleAnimation).forEach((animation: Animation): void => {
      const particle = (animation.effect as KeyframeEffect).target as HTMLElement;
      animation.pause();
      animation.currentTime = 0;
      const { transform, opacity } = getComputedStyle(particle);
      animation.cancel();
      particle.style.transform = transform;
      particle.style.opacity = opacity;
    });
    const waitForFrame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));
    await waitForFrame();
    await waitForFrame();
  });
}

// Playwright's `animations: 'disabled'` only covers CSS animations. The summer heat shimmer is an SVG (SMIL)
// animation that runs on the document timeline, so freeze it at its first frame to keep captures identical.
async function freezeSvgAnimations(page: Page): Promise<void> {
  await page.evaluate((): void => {
    document.querySelectorAll<SVGSVGElement>('svg').forEach((svg: SVGSVGElement): void => {
      svg.setCurrentTime(0);
      svg.pauseAnimations();
    });
  });
}

// Images are decoded asynchronously, so a capture taken right after `goto` can show an empty frame where a
// photo should be. Wait for the eager ones (lazy ones below the fold may never load, so skip those).
async function waitForImages(page: Page): Promise<void> {
  await page.evaluate(async (): Promise<void> => {
    const images: HTMLImageElement[] = Array.from(document.images).filter(
      (image: HTMLImageElement): boolean => image.loading !== 'lazy',
    );
    await Promise.all(images.map((image: HTMLImageElement) => image.decode().catch(() => undefined)));
  });
}

// The summer heat shimmer is an SVG filter over the whole page. It paints a decoded image slightly later
// than the plain frame, and no frame or load event signals when, so give it a moment to settle.
const FILTER_SETTLE_MS: number = 300;

export function defineScreenshotTests(
  pageName: string,
  path: string,
  seasons: Season[] = [SUMMER_SEASON],
  options: ScreenshotOptions = {},
): void {
  for (const season of seasons) {
    for (const colorScheme of COLOR_SCHEMES) {
      test(`${pageName} page captures the ${season.name} ${colorScheme} screenshot`, async ({ page }) => {
        const outputPath: string = join(SCREENSHOTS_DIRECTORY, `${pageName}-${season.name}-${colorScheme}.png`);
        await page.clock.setFixedTime(new Date(season.date));
        await page.emulateMedia({ colorScheme });
        await page.goto(path);
        await waitForImages(page);
        await freezeSvgAnimations(page);
        await page.waitForTimeout(FILTER_SETTLE_MS);
        if (options.keepAnimations) {
          await freezeParticleAnimations(page);
          await page.screenshot({ path: outputPath, animations: 'allow' });
        } else {
          await page.screenshot({ path: outputPath, animations: 'disabled' });
        }
      });
    }
  }
}
