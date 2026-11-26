import { describe, expect, it } from 'vitest';
import { villa as demo } from '../../villa.config.ts';
import { SUPPORTED_LOCALES } from '../i18n/locales.ts';
import { applyOverlay } from './overlay.ts';
import { localizedSchema } from './schema.ts';
import { findMissingTranslations, listPhotoReferences, validateVilla, VillaConfigError } from './validate.ts';

const allPhotos = [
  'hero.jpg',
  'pool.jpg',
  'terrace.jpg',
  'living.jpg',
  'kitchen.jpg',
  'bedroom-1.jpg',
  'bedroom-2.jpg',
  'bedroom-3.jpg',
  'bathroom.jpg',
  'garden.jpg',
  'exterior.jpg',
  'detail.jpg',
  'beach.jpg',
  'village.jpg',
];
const options = { availablePhotos: allPhotos, uiLocales: [...SUPPORTED_LOCALES] };
const clone = <T>(value: T): T => structuredClone(value);
const problemsOf = (input: unknown): string => {
  try {
    validateVilla(input, options);
    return '';
  } catch (err) {
    return (err as Error).message;
  }
};

describe('villa config', () => {
  it('accepts the shipped config and fills the defaults', () => {
    const { villa } = validateVilla(demo, options);
    expect(villa.property.name).toBe('Villa Calanque');
    expect(villa.languages.active).toEqual(demo.languages.active);
    expect(villa.sections.faq).toBe(true);
  });

  it('warns about what the buyer still has to fill in', () => {
    const { warnings } = validateVilla(demo, options);
    expect(warnings).toEqual(
      expect.arrayContaining([
        expect.stringContaining('booking.key is empty'),
        expect.stringContaining('site.url is still "https://villa-calanque.example.com"'),
        expect.stringContaining('legal.publisherName, legal.publisherAddress, legal.publicationDirector empty'),
      ]),
    );
  });


  it('builds translated texts from the supported languages, so a new language is a valid key', () => {
    expect(Object.keys(localizedSchema.shape).sort()).toEqual([...SUPPORTED_LOCALES].sort());
    expect(localizedSchema.safeParse({ xx: 'Hola' }).success).toBe(false);
  });

  it('refuses a photo that is not in src/assets/photos/', () => {
    const broken = clone(demo);
    broken.hero.image = 'missing.jpg';
    expect(() => validateVilla(broken, options)).toThrow(VillaConfigError);
    expect(() => validateVilla(broken, options)).toThrow(/hero\.image: "missing\.jpg"/);
  });

  it('finds a photo whatever the case of its name on disk', () => {
    const upper = allPhotos.map((f) => f.replace('.jpg', '.JPG'));
    expect(() => validateVilla(demo, { ...options, availablePhotos: upper })).not.toThrow();
  });

  it('explains which characters a photo name may use', () => {
    const broken = clone(demo);
    broken.hero.image = 'vue mer été.jpg';
    expect(problemsOf(broken)).toContain('letters without accents, digits, - and _ (no space)');
  });

  it('refuses coordinates with fewer than 5 decimals and tells how to keep a final 0', () => {
    const broken = clone(demo);
    broken.property.geo = { latitude: 43.2213, longitude: 6.63457 };
    expect(problemsOf(broken)).toContain("write it as a string, e.g. '43.22130'");
  });

  it('keeps a coordinate written as a string with its final 0', () => {
    const fixed = clone(demo);
    fixed.property.geo = { latitude: '43.22130', longitude: 6.63457 };
    expect(validateVilla(fixed, options).villa.property.geo.latitude).toBe('43.22130');
  });

  it('refuses a time zone name that does not exist', () => {
    const broken = clone(demo);
    broken.property.timeZone = 'Europe/Pariss';
    expect(problemsOf(broken)).toContain('property.timeZone: "Europe/Pariss" is not a time zone name');
  });

  it('keeps only the form ID when the whole Formspree address is pasted', () => {
    const config = clone(demo);
    config.booking = { provider: 'formspree', key: 'https://formspree.io/f/xwkgabcd' };
    expect(validateVilla(config, options).villa.booking.key).toBe('xwkgabcd');
  });

  it('refuses a key that cannot belong to the chosen form service', () => {
    const config = clone(demo);
    config.booking = { provider: 'web3forms', key: 'my-secret-key' };
    expect(problemsOf(config)).toContain('is not a Web3Forms access key');
  });

  it('refuses a default language that is not active', () => {
    const broken = clone(demo);
    broken.languages = { default: 'it', active: ['fr', 'en'] };
    expect(() => validateVilla(broken, options)).toThrow(/languages\.default/);
  });

  it('refuses an active language without interface texts', () => {
    const missing = demo.languages.active[0] ?? 'en';
    const uiLocales = SUPPORTED_LOCALES.filter((l) => l !== missing);
    expect(() => validateVilla(demo, { ...options, uiLocales })).toThrow(`src/i18n/ui/${missing}.ts`);
  });

  it('finds translated fields anywhere in the tree', () => {
    expect(findMissingTranslations({ a: [{ b: { fr: 'x', en: 'y' } }] }, ['fr', 'en', 'de'])).toEqual([
      'a[0].b: missing de',
    ]);
  });

  it('knows every photo the config uses', () => {
    const { villa } = validateVilla(demo, options);
    const files = new Set(listPhotoReferences(villa).map((r) => r.file));
    for (const file of files) expect(allPhotos).toContain(file);
  });

  it('lets an overlay replace values without touching the rest', () => {
    const merged = applyOverlay(demo, { legal: { noticeUrl: 'https://agency.example/legal' }, calendar: { feeds: [] } });
    const { villa, warnings } = validateVilla(merged, options);
    expect(villa.legal.noticeUrl).toBe('https://agency.example/legal');
    expect(villa.legal.hostingProvider.name).toBe('Cloudflare, Inc.');
    expect(warnings.some((w) => w.includes('legal.publisherName'))).toBe(false);
  });
});
