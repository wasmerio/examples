import { LOCALES, type Locale } from '../i18n/locales';

export function getDocSource(files: Record<string, string>, locale: Locale): string {
  for (const language of LOCALES) {
    const file = `../content/docs/${language}/getting-started.md`;
    if (!Object.hasOwn(files, file)) throw new Error(`Missing documentation translation: ${file}`);
  }
  return files[`../content/docs/${locale}/getting-started.md`];
}
