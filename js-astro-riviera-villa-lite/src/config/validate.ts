import { z } from 'astro/zod';
import { SUPPORTED_LOCALES, type Locale } from '../i18n/locales.ts';
import { formKeyProblem, normalizeFormKey } from '../lib/booking-service.ts';
import { villaSchema, type Villa } from './schema.ts';

export class VillaConfigError extends Error {
  constructor(problems: string[]) {
    super(`villa.config.ts has ${problems.length} problem(s):\n${problems.map((p) => `  - ${p}`).join('\n')}`);
    this.name = 'VillaConfigError';
  }
}

function isLocalizedObject(value: unknown): value is Partial<Record<Locale, string>> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((k) => (SUPPORTED_LOCALES as readonly string[]).includes(k));
}

/** Lists every translated text that misses one of the active languages. */
export function findMissingTranslations(value: unknown, active: readonly Locale[], path = ''): string[] {
  // languages.flags is keyed by language too, but holds flag codes, not translations.
  if (path === 'languages.flags') return [];
  if (isLocalizedObject(value)) {
    const missing = active.filter((l) => !value[l]);
    return missing.length ? [`${path || '(root)'}: missing ${missing.join(', ')}`] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => findMissingTranslations(item, active, `${path}[${i}]`));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => findMissingTranslations(v, active, path ? `${path}.${k}` : k));
  }
  return [];
}

/** Every photo file name the config points to, with where it is used. */
export function listPhotoReferences(villa: Villa): { file: string; path: string }[] {
  return [
    { file: villa.hero.image, path: 'hero.image' },
    { file: villa.seo.shareImage, path: 'seo.shareImage' },
    ...villa.house.images.map((file, i) => ({ file, path: `house.images[${i}]` })),
    ...villa.gallery.map((g, i) => ({ file: g.image, path: `gallery[${i}].image` })),
    ...villa.bedrooms.images.map((b, i) => ({ file: b.image, path: `bedrooms.images[${i}].image` })),
    ...villa.area.images.map((img, i) => ({ file: img.image, path: `area.images[${i}].image` })),
  ];
}

export interface ValidateOptions {
  /** File names present in src/assets/photos/. Skipped when undefined. */
  availablePhotos?: readonly string[];
  /** Languages that have interface strings in src/i18n/ui/. */
  uiLocales: readonly Locale[];
}

export interface ValidatedVilla {
  villa: Villa;
  /** Non-blocking advice, printed during the build. */
  warnings: string[];
}

/** Parses and checks the config. Throws a VillaConfigError listing every problem found. */
export function validateVilla(input: unknown, options: ValidateOptions): ValidatedVilla {
  const parsed = villaSchema.safeParse(input);
  if (!parsed.success) {
    throw new VillaConfigError(z.prettifyError(parsed.error).split('\n').filter(Boolean));
  }
  const villa = parsed.data;
  const problems: string[] = [];
  const warnings: string[] = [];

  const active = villa.languages.active;
  problems.push(...findMissingTranslations(villa, active).map((p) => `translation ${p}`));

  for (const locale of active) {
    if (!options.uiLocales.includes(locale)) {
      problems.push(`languages.active contains "${locale}" but src/i18n/ui/${locale}.ts is missing`);
    }
  }

  if (options.availablePhotos) {
    // File names are compared without case: "Pool.JPG" on disk matches "pool.jpg" in the config.
    const available = new Set(options.availablePhotos.map((f) => f.toLowerCase()));
    for (const ref of listPhotoReferences(villa)) {
      if (!available.has(ref.file.toLowerCase())) {
        problems.push(`${ref.path}: "${ref.file}" is not in src/assets/photos/`);
      }
    }
  }

  try {
    new Intl.DateTimeFormat('en', { timeZone: villa.property.timeZone });
  } catch {
    problems.push(
      `property.timeZone: "${villa.property.timeZone}" is not a time zone name. Use the IANA name, e.g. "Europe/Paris", "Europe/Rome", "America/New_York".`,
    );
  }

  villa.booking.key = normalizeFormKey(villa.booking.provider, villa.booking.key);
  const keyProblem = formKeyProblem(villa.booking.provider, villa.booking.key);
  if (keyProblem) problems.push(keyProblem);
  if (villa.booking.provider !== 'none' && !villa.booking.key) {
    warnings.push(
      `booking.key is empty: the form will offer WhatsApp and email instead of sending through ${villa.booking.provider}`,
    );
  }

  if (/(^|\.)example\.(com|org|net)$/i.test(new URL(villa.site.url).hostname)) {
    warnings.push(`site.url is still "${villa.site.url}": set your real address, canonical links and the sitemap use it`);
  }

  const { legal } = villa;
  if (!legal.noticeUrl) {
    const empty = (['publisherName', 'publisherAddress', 'publicationDirector'] as const).filter((k) => !legal[k].trim());
    if (empty.length) {
      warnings.push(
        `legal.${empty.join(', legal.')} empty: the legal notice shows "[to complete]". Fill them, or set legal.noticeUrl to a legal notice published elsewhere`,
      );
    }
  }

  if (problems.length) throw new VillaConfigError(problems);
  return { villa, warnings };
}
