import { languages, translate, type Language } from "../i18n";
export const categoryNames = ["guides", "notes", "stories"] as const;
export type Category = (typeof categoryNames)[number];
export const categoryLabel = (lang: Language, category: string) =>
  categoryNames.includes(category as Category)
    ? translate(lang, `category.${category as Category}`)
    : category;
// Accept category IDs or a localized label in any language.
export function normalizeCategory(value: string): string {
  return (
    categoryNames.find((category) =>
      languages.some((lang) => categoryLabel(lang, category) === value),
    ) ?? value
  );
}
