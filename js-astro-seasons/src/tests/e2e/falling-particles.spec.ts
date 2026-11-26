import { expect, test } from '@playwright/test';
import { AUTUMN_SEASON, SUMMER_SEASON, SPRING_SEASON, WINTER_SEASON } from '../seasons';

interface SeasonCase {
  description: string;
  date: string;
  visibleFamily: string | null;
}

const PARTICLE_FAMILIES: string[] = ['autumn', 'winter', 'spring'];

const SEASON_CASES: SeasonCase[] = [
  { description: 'mid summer', date: SUMMER_SEASON.date, visibleFamily: null },
  { description: 'mid autumn', date: AUTUMN_SEASON.date, visibleFamily: 'autumn' },
  { description: 'first day of autumn', date: '2026-09-22T12:00:00', visibleFamily: 'autumn' },
  { description: 'last day of autumn', date: '2026-12-21T12:00:00', visibleFamily: 'autumn' },
  { description: 'first day of winter', date: '2026-12-22T12:00:00', visibleFamily: 'winter' },
  { description: 'mid winter', date: WINTER_SEASON.date, visibleFamily: 'winter' },
  { description: 'last day of winter', date: '2026-03-19T12:00:00', visibleFamily: 'winter' },
  { description: 'first day of spring', date: '2026-03-20T12:00:00', visibleFamily: 'spring' },
  { description: 'mid spring', date: SPRING_SEASON.date, visibleFamily: 'spring' },
  { description: 'last day of spring', date: '2026-06-20T12:00:00', visibleFamily: 'spring' },
  { description: 'first day of summer', date: '2026-06-21T12:00:00', visibleFamily: null },
  { description: 'day before autumn', date: '2026-09-21T12:00:00', visibleFamily: null },
];

for (const seasonCase of SEASON_CASES) {
  test(`home page shows ${seasonCase.visibleFamily ?? 'no'} particles: ${seasonCase.description}`, async ({ page }) => {
    await page.clock.setFixedTime(new Date(seasonCase.date));
    await page.goto('/');

    for (const family of PARTICLE_FAMILIES) {
      const particles = page.locator(`.falling-particles[data-family="${family}"]`);
      if (family === seasonCase.visibleFamily) {
        await expect(particles).toBeVisible();
        await expect(particles.locator('.particle').first()).toBeAttached();
      } else {
        await expect(particles).toBeHidden();
      }
    }
  });
}

for (const season of [AUTUMN_SEASON, WINTER_SEASON, SPRING_SEASON]) {
  test(`home page hides the ${season.name} particles when reduced motion is preferred`, async ({ page }) => {
    await page.clock.setFixedTime(new Date(season.date));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await expect(page.locator('.falling-particles:visible')).toHaveCount(0);
  });
}
