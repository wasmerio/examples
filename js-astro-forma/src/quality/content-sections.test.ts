import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';
import { BUILD_SCOPE } from '../../site.config.mjs';

const distRoot = path.resolve('dist');
const hasBuild = fs.existsSync(distRoot);
const pageCases = [
  { route: 'about', dataFile: 'about.json', sectionClass: 'grid gap-10 md:grid-cols-2' },
  { route: 'contact', dataFile: 'contact.json', sectionClass: 'grid gap-10 md:grid-cols-2' },
  { route: 'cookies', dataFile: 'cookies.json', sectionClass: 'grid gap-10 max-w-3xl' },
  { route: 'services', dataFile: 'services.json', sectionClass: 'grid gap-10 mt-16 md:grid-cols-2' },
  { route: 'services/design', dataFile: 'services-design.json', sectionClass: 'grid gap-10 md:grid-cols-2' },
  { route: 'services/development', dataFile: 'services-development.json', sectionClass: 'grid gap-10 md:grid-cols-2' },
  { route: 'services/strategy', dataFile: 'services-strategy.json', sectionClass: 'grid gap-10 md:grid-cols-2' },
  { route: 'terms', dataFile: 'terms.json', sectionClass: 'grid gap-10 max-w-3xl' },
  { route: 'work', dataFile: 'work.json', sectionClass: 'grid gap-10 md:grid-cols-2' },
];

function getRenderedRoute(route: string): string {
  return path.join(distRoot, ...route.split('/'), 'index.html');
}

function toClassSelector(className: string): string {
  return className.split(' ').map((token) => `.${token.replaceAll(':', '\\:')}`).join('');
}

function isIncluded(route: string): boolean {
  const pathname = `/${route}/`;
  if (BUILD_SCOPE.forceRemove.includes(route.split('/')[0])) return false;
  // Zakres demo jest celowy; test nie może wymagać podstron wyłączonych z wydania.
  return BUILD_SCOPE.pages.length === 0 || BUILD_SCOPE.pages.some((prefix) => {
    const normalized = prefix.endsWith('/') ? prefix : `${prefix}/`;
    return normalized === '/' ? pathname === '/' : pathname.startsWith(normalized);
  });
}

describe.skipIf(!hasBuild)('shared content sections rendered output', () => {
  it.each(pageCases.filter(({ route }) => isIncluded(route)))('$route preserves section order, content and layout classes', ({ route, dataFile, sectionClass }) => {
    const outputPath = getRenderedRoute(route);
    const dataPath = path.resolve('src/data/pages', dataFile);
    const pageData = JSON.parse(fs.readFileSync(dataPath, 'utf8')) as {
      sections: Array<{ heading: string; body: string }>;
    };
    const $ = load(fs.readFileSync(outputPath, 'utf8'));
    const renderedSections = $(`${toClassSelector(sectionClass)} > div`);

    expect(fs.existsSync(outputPath)).toBe(true);
    expect(renderedSections).toHaveLength(pageData.sections.length);

    pageData.sections.forEach((section, index) => {
      const rendered = renderedSections.eq(index);
      expect(rendered.find('h2').text().trim()).toBe(section.heading);
      expect(rendered.find('p').text().trim()).toBe(section.body);
    });
  });

  it.each(pageCases.filter(({ route }) => !isIncluded(route)))('$route stays outside the production build', ({ route }) => {
    expect(fs.existsSync(getRenderedRoute(route))).toBe(false);
  });

  it('renders the default privacy page in English and the localized route in Polish', () => {
    const englishPage = load(fs.readFileSync(getRenderedRoute('privacy-policy'), 'utf8'));
    const polishPage = load(fs.readFileSync(getRenderedRoute('pl/privacy-policy'), 'utf8'));

    expect(englishPage('html').attr('lang')).toBe('en');
    expect(englishPage('body').text()).toContain('Privacy in the demo version.');
    expect(polishPage('html').attr('lang')).toBe('pl');
    expect(polishPage('body').text()).toContain('Prywatność w wersji demo.');
  });
});
