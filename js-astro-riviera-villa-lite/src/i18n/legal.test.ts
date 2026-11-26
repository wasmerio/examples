import { describe, expect, it } from 'vitest';
import { villa as shipped } from '../../villa.config.ts';
import { applyOverlay } from '../config/overlay.ts';
import { validateVilla } from '../config/validate.ts';
import { legalTexts } from './legal.ts';
import { SUPPORTED_LOCALES } from './locales.ts';

const parse = (input: unknown) => validateVilla(input, { uiLocales: [...SUPPORTED_LOCALES] }).villa;
const t = (field: Partial<Record<string, string>> | undefined) => field?.fr ?? '';
const allText = (texts: ReturnType<typeof legalTexts>) =>
  [...texts.legalSections, ...texts.privacySections].flatMap((s) => s.paragraphs).join('\n');

describe('legal pages', () => {
  it('shows "[to complete]" in the shipped template until the owner fills in the details', () => {
    const texts = legalTexts('fr', parse(shipped), t);
    expect(allText(texts)).toContain('[à compléter]');
  });

  it('links to an external legal notice and writes no name or company number', () => {
    const demo = parse(applyOverlay(shipped, { legal: { noticeUrl: 'https://agency.example/legal-notice' } }));
    for (const locale of SUPPORTED_LOCALES) {
      const text = allText(legalTexts(locale, demo, t));
      expect(text).toContain('https://agency.example/legal-notice');
      expect(text).not.toMatch(/SIRET|\[/);
    }
  });
});
